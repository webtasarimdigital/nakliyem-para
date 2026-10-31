import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { UsedTrialRecord } from '@/types';
import { recordFirestoreUsedTrial, getFirestoreUsedTrials } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'used_trials.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]', 'utf-8');
  }
}

function readTrials(): UsedTrialRecord[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTrials(data: UsedTrialRecord[]) {
  try {
    ensureFile();
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write used_trials.json:', err);
  }
}

export async function GET() {
  try {
    const fileRecords = readTrials();
    let firestoreRecords: UsedTrialRecord[] = [];
    try {
      firestoreRecords = await getFirestoreUsedTrials();
    } catch {}

    const map = new Map<string, UsedTrialRecord>();
    [...fileRecords, ...firestoreRecords].forEach(r => {
      const key = r.phone || r.email || r.carrierId || r.id;
      if (key && !map.has(key)) {
        map.set(key, r);
      }
    });

    return NextResponse.json({ success: true, records: Array.from(map.values()) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const record: UsedTrialRecord = await req.json();
    if (!record || (!record.phone && !record.email && !record.carrierId)) {
      return NextResponse.json({ error: 'Geçersiz deneme kayıt bilgisi' }, { status: 400 });
    }

    const current = readTrials();
    const normPhone = record.phone ? record.phone.replace(/\D/g, '').slice(-10) : '';
    const normEmail = record.email ? record.email.trim().toLowerCase() : '';

    const exists = current.some(r => 
      (normPhone && r.phone === normPhone) ||
      (normEmail && r.email === normEmail) ||
      (record.carrierId && r.carrierId === record.carrierId)
    );

    if (!exists) {
      const enriched: UsedTrialRecord = {
        id: record.id || `trial_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        phone: normPhone,
        email: normEmail,
        companyName: record.companyName,
        carrierId: record.carrierId,
        userId: record.userId,
        usedAt: record.usedAt || new Date().toISOString(),
        planId: record.planId || 'plan_pro'
      };
      current.unshift(enriched);
      writeTrials(current);

      try {
        await recordFirestoreUsedTrial(enriched);
      } catch (fErr) {
        console.warn('Firestore record used trial warning:', fErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
