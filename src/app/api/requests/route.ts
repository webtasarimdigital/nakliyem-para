import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  try {
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
  } catch (err) {
    console.error('writeJson error:', err);
  }
}

export async function GET() {
  const requests = readJson<any[]>('requests.json', []);
  const offers = readJson<any[]>('offers.json', []);

  // Ensure offersCount is accurate
  const updated = requests.map(r => {
    const count = offers.filter(o => o.requestId === r.id).length;
    return { ...r, offersCount: count > 0 ? count : (r.offersCount || 0) };
  });

  return NextResponse.json({ success: true, requests: updated });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const request = body.request || body;

    if (!request || !request.id) {
      return NextResponse.json({ error: 'Geçersiz talep verisi' }, { status: 400 });
    }

    const requests = readJson<any[]>('requests.json', []);
    const existingIndex = requests.findIndex(r => r.id === request.id);
    if (existingIndex >= 0) {
      requests[existingIndex] = { ...requests[existingIndex], ...request, updatedAt: new Date().toISOString() };
    } else {
      requests.unshift(request);
    }
    writeJson('requests.json', requests);

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    console.error('API /api/requests error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
