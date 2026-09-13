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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get('requestId');
  const carrierId = searchParams.get('carrierId');

  const offers = readJson<any[]>('offers.json', []);

  let filtered = offers;
  if (requestId) {
    filtered = filtered.filter(o => o.requestId === requestId);
  }
  if (carrierId) {
    filtered = filtered.filter(o => o.carrierId === carrierId);
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

    // 1. Teklifi kaydet
    const offers = readJson<any[]>('offers.json', []);
    const existingOfferIndex = offers.findIndex(o => o.id === offer.id);
    if (existingOfferIndex >= 0) {
      offers[existingOfferIndex] = { ...offers[existingOfferIndex], ...offer, updatedAt: new Date().toISOString() };
    } else {
      offers.unshift(offer);
    }
    writeJson('offers.json', offers);

    // 2. Talebi kaydet / güncelle
    if (request && request.id) {
      const requests = readJson<any[]>('requests.json', []);
      const reqIndex = requests.findIndex(r => r.id === request.id);
      const offersForReq = offers.filter(o => o.requestId === request.id);
      const updatedReq = {
        ...request,
        offersCount: offersForReq.length,
        updatedAt: new Date().toISOString()
      };
      if (reqIndex >= 0) {
        requests[reqIndex] = { ...requests[reqIndex], ...updatedReq };
      } else {
        requests.unshift(updatedReq);
      }
      writeJson('requests.json', requests);
    }

    // 3. Sohbeti kaydet / güncelle
    if (conversation && conversation.id) {
      const conversations = readJson<any[]>('conversations.json', []);
      const convIndex = conversations.findIndex(c => c.id === conversation.id);
      if (convIndex >= 0) {
        conversations[convIndex] = { ...conversations[convIndex], ...conversation };
      } else {
        conversations.unshift(conversation);
      }
      writeJson('conversations.json', conversations);
    }

    // 4. Mesajları kaydet
    if (Array.isArray(messages) && messages.length > 0) {
      const allMessages = readJson<any[]>('messages.json', []);
      const messageMap = new Map<string, any>();
      allMessages.forEach(m => messageMap.set(m.id, m));
      messages.forEach(m => messageMap.set(m.id, m));
      writeJson('messages.json', Array.from(messageMap.values()));
    }

    return NextResponse.json({ success: true, offer, conversation });
  } catch (err: any) {
    console.error('API /api/offers error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
