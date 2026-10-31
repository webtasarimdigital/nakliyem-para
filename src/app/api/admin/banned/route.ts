import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db as firestoreDb, auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDocs, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { ensureServerWorkerAuth } from '@/lib/firebase/server-auth';
import { BannedEntity } from '@/types';

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

async function ensureWorkerAuth() {
  if (!isFirebaseConfigured() || !firebaseAuth) return;
  await ensureServerWorkerAuth(firebaseAuth);
}

export async function GET() {
  const fileBanned = readJson<BannedEntity[]>('banned_entities.json', []);
  const map = new Map<string, BannedEntity>();
  fileBanned.forEach(b => map.set(b.id, b));

  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await ensureWorkerAuth();
      const snap = await getDocs(collection(firestoreDb, 'banned_entities'));
      snap.forEach(d => {
        const data = d.data() as BannedEntity;
        if (data && data.id) {
          map.set(data.id, data);
        }
      });
    } catch (err) {
      console.warn('Firestore banned_entities GET error:', err);
    }
  }

  const list = Array.from(map.values()).sort(
    (a, b) => new Date(b.bannedAt || 0).getTime() - new Date(a.bannedAt || 0).getTime()
  );

  return NextResponse.json({ success: true, banned: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records: BannedEntity[] = body.records || (body.record ? [body.record] : []);

    if (!records || records.length === 0) {
      return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    }

    const fileBanned = readJson<BannedEntity[]>('banned_entities.json', []);
    const map = new Map<string, BannedEntity>();
    fileBanned.forEach(b => map.set(b.id, b));
    records.forEach(r => map.set(r.id, r));

    const updatedList = Array.from(map.values());
    writeJson('banned_entities.json', updatedList);

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();
        for (const r of records) {
          await setDoc(doc(firestoreDb, 'banned_entities', r.id), r, { merge: true });
        }
      } catch (fbErr) {
        console.warn('Firestore banned_entities POST error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, count: records.length });
  } catch (err: any) {
    console.error('API /api/admin/banned POST error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Geçersiz ID' }, { status: 400 });
    }

    const norm = id.replace(/\D/g, '').slice(-10);
    const normEmail = id.trim().toLowerCase();

    const fileBanned = readJson<BannedEntity[]>('banned_entities.json', []);
    const filtered = fileBanned.filter(b => {
      if (b.id === id || b.value === id) return false;
      if (norm && b.type === 'PHONE' && b.value === norm) return false;
      if (normEmail && b.type === 'EMAIL' && b.value === normEmail) return false;
      return true;
    });
    writeJson('banned_entities.json', filtered);

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();
        await deleteDoc(doc(firestoreDb, 'banned_entities', id)).catch(() => {});
      } catch (fbErr) {
        console.warn('Firestore banned_entities DELETE error:', fbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/admin/banned DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
