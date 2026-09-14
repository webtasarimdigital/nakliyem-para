import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db as firestoreDb, auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { extractNumericRequestCode } from '@/lib/data/mock-db';

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(filename: string, data: any): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {}
}

// In-memory cache for serverless execution environment
let memoryOffers: any[] = [];

async function ensureWorkerAuth() {
  if (!isFirebaseConfigured() || !firebaseAuth) return;
  try {
    if (!firebaseAuth.currentUser) {
      await signInWithEmailAndPassword(firebaseAuth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!');
    }
  } catch (err) {
    console.warn('ensureWorkerAuth error in /api/offers:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get('requestId');
  const carrierId = searchParams.get('carrierId');

  const fileOffers = readJson<any[]>('offers.json', []);
  const offerMap = new Map<string, any>();
  fileOffers.forEach(o => offerMap.set(o.id, o));
  memoryOffers.forEach(o => offerMap.set(o.id, o));

  // Sync from Cloud Firestore if available
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await ensureWorkerAuth();

      // 1. Read all offers from Firestore
      const snap = await getDocs(collection(firestoreDb, 'offers'));
      snap.forEach(d => {
        const data = d.data();
        if (data && data.id) {
          offerMap.set(data.id, { ...(offerMap.get(data.id) || {}), ...data });
        }
      });

      // 2. Read assigned requests to guarantee offer status consistency
      const reqSnap = await getDocs(collection(firestoreDb, 'requests'));
      reqSnap.forEach(d => {
        const rData = d.data();
        if (rData && (rData.status === 'ASSIGNED' || rData.closedReason === 'İş Verildi') && rData.assignedOfferId) {
          const existing = offerMap.get(rData.assignedOfferId);
          if (existing) {
            offerMap.set(rData.assignedOfferId, {
              ...existing,
              status: 'ACCEPTED',
              assignedCarrierId: rData.assignedCarrierId || existing.carrierId
            });
          }
        }
      });
    } catch (err) {
      console.warn('Firestore GET offers sync error:', err);
    }
  }

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const processedOffers = Array.from(offerMap.values()).map(o => {
    if (o.status === 'PENDING' && o.createdAt) {
      const createdTime = new Date(o.createdAt).getTime();
      if (createdTime > 0 && (now - createdTime > THREE_DAYS_MS)) {
        return { ...o, status: 'REJECTED' };
      }
    }
    return o;
  });

  let filtered = processedOffers;
  if (requestId) {
    filtered = filtered.filter(o => o.requestId === requestId || String(o.requestId).includes(requestId.replace('#', '')));
  }
  if (carrierId) {
    filtered = filtered.filter(o => o.carrierId === carrierId || (o.carrier && (o.carrier.id === carrierId || o.carrier.userId === carrierId)));
  }

  return NextResponse.json({ success: true, offers: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offer, request, conversation, messages } = body;

    if (!offer || !offer.id || !offer.requestId) {
      return NextResponse.json({ error: 'Geçersiz teklif verisi' }, { status: 400 });
    }

    // 1. Update in-memory & file
    const fileOffers = readJson<any[]>('offers.json', []);
    const existingOfferIndex = fileOffers.findIndex(o => o.id === offer.id);
    const updatedOffer = {
      ...offer,
      updatedAt: new Date().toISOString()
    };

    if (existingOfferIndex >= 0) {
      fileOffers[existingOfferIndex] = { ...fileOffers[existingOfferIndex], ...updatedOffer };
    } else {
      fileOffers.unshift(updatedOffer);
    }

    if (offer.status === 'ACCEPTED') {
      fileOffers.forEach((o, idx) => {
        if (o.requestId === offer.requestId && o.id !== offer.id) {
          fileOffers[idx] = { ...fileOffers[idx], status: 'REJECTED', updatedAt: new Date().toISOString() };
        }
      });
    }
    writeJson('offers.json', fileOffers);

    const mIdx = memoryOffers.findIndex(o => o.id === offer.id);
    if (mIdx >= 0) memoryOffers[mIdx] = { ...memoryOffers[mIdx], ...updatedOffer };
    else memoryOffers.unshift(updatedOffer);

    // 2. Persist to Cloud Firestore with Admin privileges
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();

        // Save offer doc
        await setDoc(doc(firestoreDb, 'offers', offer.id), updatedOffer, { merge: true });

        // If offer is ACCEPTED, also update the request in Firestore!
        if (offer.status === 'ACCEPTED') {
          const cleanReqNum = extractNumericRequestCode(offer.requestId) || 
                               extractNumericRequestCode(request?.requestCode) || 
                               extractNumericRequestCode(request?.id);

          const carrierName = offer.carrier?.companyName || offer.carrierName || 'Nakliye Firması';
          const requestPayload = {
            status: 'ASSIGNED',
            closedReason: 'İş Verildi',
            assignedCarrierId: offer.carrierId,
            assignedCarrierName: carrierName,
            assignedOfferId: offer.id,
            assignedPrice: offer.price,
            updatedAt: new Date().toISOString()
          };

          const docsToUpdate = [offer.requestId];
          if (request?.id && !docsToUpdate.includes(request.id)) docsToUpdate.push(request.id);
          if (request?.requestCode && !docsToUpdate.includes(request.requestCode)) docsToUpdate.push(request.requestCode.replace('#', ''));
          if (cleanReqNum && !docsToUpdate.includes(cleanReqNum)) docsToUpdate.push(cleanReqNum);

          for (const docId of docsToUpdate) {
            await setDoc(doc(firestoreDb, 'requests', docId), requestPayload, { merge: true });
          }

          // Mirror to chat doc
          if (cleanReqNum) {
            await setDoc(doc(firestoreDb, 'requests', `chat_${cleanReqNum}`), {
              ...requestPayload,
              isChatDoc: true,
              requestId: cleanReqNum
            }, { merge: true });
          }
        }
      } catch (fbErr) {
        console.warn('Firestore POST offer error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, offer: updatedOffer, conversation });
  } catch (err: any) {
    console.error('API /api/offers error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
