import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db as firestoreDb, auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, getDocs, collection, query, limit } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
  } catch {}
}

let memoryListings: any[] = [];

async function ensureWorkerAuth() {
  if (!isFirebaseConfigured() || !firebaseAuth) return;
  try {
    if (!firebaseAuth.currentUser) {
      await signInWithEmailAndPassword(firebaseAuth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!');
    }
  } catch (err) {
    console.warn('Marketplace worker auth error:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const fileList = readJson<any[]>('marketplace_listings.json', []);
  const map = new Map<string, any>();
  fileList.forEach(l => map.set(String(l.id), l));
  memoryListings.forEach(l => map.set(String(l.id), l));

  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await ensureWorkerAuth();
      if (id) {
        const snap = await getDoc(doc(firestoreDb, 'marketplace_listings', id));
        if (snap.exists()) {
          map.set(id, snap.data());
        }
      } else {
        const q = query(collection(firestoreDb, 'marketplace_listings'), limit(100));
        const snaps = await getDocs(q);
        snaps.forEach(s => map.set(s.id, s.data()));
      }
    } catch (err) {
      console.warn('Firestore marketplace GET error:', err);
    }
  }

  const all = Array.from(map.values());
  if (id) {
    const single = map.get(id) || all.find(l => String(l.id) === String(id));
    return NextResponse.json({ success: true, listing: single || null });
  }

  return NextResponse.json({ success: true, listings: all });
}

export async function POST(req: NextRequest) {
  try {
    const listing = await req.json();
    if (!listing || !listing.id) {
      return NextResponse.json({ error: 'Geçersiz ilan verisi' }, { status: 400 });
    }

    const fileList = readJson<any[]>('marketplace_listings.json', []);
    const idx = fileList.findIndex(l => String(l.id) === String(listing.id));
    if (idx >= 0) fileList[idx] = { ...fileList[idx], ...listing };
    else fileList.unshift(listing);
    writeJson('marketplace_listings.json', fileList);

    const mIdx = memoryListings.findIndex(l => String(l.id) === String(listing.id));
    if (mIdx >= 0) memoryListings[mIdx] = { ...memoryListings[mIdx], ...listing };
    else memoryListings.unshift(listing);

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();
        await setDoc(doc(firestoreDb, 'marketplace_listings', String(listing.id)), {
          ...listing,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (fbErr) {
        console.warn('Firestore marketplace POST error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, listing });
  } catch (err: any) {
    console.error('Marketplace POST error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
