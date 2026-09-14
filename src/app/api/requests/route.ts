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
let memoryRequests: any[] = [];

async function ensureWorkerAuth() {
  if (!isFirebaseConfigured() || !firebaseAuth) return;
  try {
    if (!firebaseAuth.currentUser) {
      await signInWithEmailAndPassword(firebaseAuth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!');
    }
  } catch (err) {
    console.warn('ensureWorkerAuth error in /api/requests:', err);
  }
}

export async function GET() {
  const fileRequests = readJson<any[]>('requests.json', []);
  const fileOffers = readJson<any[]>('offers.json', []);

  const reqMap = new Map<string, any>();
  fileRequests.forEach(r => reqMap.set(r.id, r));
  memoryRequests.forEach(r => reqMap.set(r.id, r));

  // Sync from Cloud Firestore if available
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await ensureWorkerAuth();
      const snap = await getDocs(collection(firestoreDb, 'requests'));
      snap.forEach(d => {
        const data = d.data();
        if (data && !data.isChatDoc) {
          const id = data.id || d.id;
          const existing = reqMap.get(id) || {};
          reqMap.set(id, { ...existing, ...data, id });
        }
      });
    } catch (err) {
      console.warn('Firestore GET requests sync error:', err);
    }
  }

  const allRequests = Array.from(reqMap.values()).map(r => {
    const count = fileOffers.filter(o => o.requestId === r.id).length;
    return { ...r, offersCount: count > 0 ? count : (r.offersCount || 0) };
  });

  return NextResponse.json({ success: true, requests: allRequests });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const request = body.request || body;

    if (!request || !request.id) {
      return NextResponse.json({ error: 'Geçersiz talep verisi' }, { status: 400 });
    }

    // 1. Update memory & file
    const fileRequests = readJson<any[]>('requests.json', []);
    const existingIndex = fileRequests.findIndex(r => r.id === request.id);
    const updatedReq = {
      ...request,
      updatedAt: request.updatedAt || new Date().toISOString()
    };

    if (existingIndex >= 0) {
      fileRequests[existingIndex] = { ...fileRequests[existingIndex], ...updatedReq };
    } else {
      fileRequests.unshift(updatedReq);
    }
    writeJson('requests.json', fileRequests);

    const mIdx = memoryRequests.findIndex(r => r.id === request.id);
    if (mIdx >= 0) memoryRequests[mIdx] = { ...memoryRequests[mIdx], ...updatedReq };
    else memoryRequests.unshift(updatedReq);

    // 2. Persist to Cloud Firestore with Admin privileges
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();

        const cleanReqNum = extractNumericRequestCode(request.requestCode) || 
                             extractNumericRequestCode(request.id);

        const docsToUpdate = [request.id];
        if (request.requestCode) docsToUpdate.push(request.requestCode.replace('#', ''));
        if (cleanReqNum && !docsToUpdate.includes(cleanReqNum)) docsToUpdate.push(cleanReqNum);

        for (const docId of docsToUpdate) {
          const docRef = doc(firestoreDb, 'requests', docId);
          await setDoc(docRef, {
            ...updatedReq,
            id: request.id,
            requestCode: request.requestCode || `#${cleanReqNum}`,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        // Also mirror status and assignment to any chat docs for this request
        if (cleanReqNum) {
          const chatDocRef = doc(firestoreDb, 'requests', `chat_${cleanReqNum}`);
          const chatSnap = await getDoc(chatDocRef);
          if (chatSnap.exists()) {
            await setDoc(chatDocRef, {
              status: updatedReq.status,
              closedReason: updatedReq.closedReason,
              assignedCarrierId: updatedReq.assignedCarrierId,
              assignedCarrierName: updatedReq.assignedCarrierName,
              assignedOfferId: updatedReq.assignedOfferId,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
        }
      } catch (fbErr) {
        console.warn('Firestore POST request error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, request: updatedReq });
  } catch (err: any) {
    console.error('API /api/requests error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
