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
  const userId = searchParams.get('userId');
  const email = searchParams.get('email');
  const requestId = searchParams.get('requestId');
  const convId = searchParams.get('convId');

  const conversations = readJson<any[]>('conversations.json', []);
  const allMessages = readJson<any[]>('messages.json', []);

  let filtered = conversations;

  if (convId) {
    filtered = filtered.filter(c => c.id === convId);
  } else if (requestId) {
    filtered = filtered.filter(c => c.contextId === requestId);
  } else if (userId || email) {
    filtered = filtered.filter(c => {
      const parts = c.participantIds || [];
      const matchUserId = userId && (parts.includes(userId) || (c.participantNames && Object.keys(c.participantNames).includes(userId)));
      const matchEmail = email && parts.some((p: string) => p && p.toLowerCase() === email.toLowerCase());
      return matchUserId || matchEmail;
    });
  }

  // Get relevant messages
  const convIds = new Set(filtered.map(c => c.id));
  const messages = allMessages.filter(m => convIds.has(m.conversationId));

  return NextResponse.json({ success: true, conversations: filtered, messages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, message, conversation } = body;

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

    if (message && message.id && conversationId) {
      const messages = readJson<any[]>('messages.json', []);
      const existingMsgIndex = messages.findIndex(m => m.id === message.id);
      if (existingMsgIndex >= 0) {
        messages[existingMsgIndex] = { ...messages[existingMsgIndex], ...message };
      } else {
        messages.push(message);
      }
      writeJson('messages.json', messages);

      // Update last message on conversation
      const conversations = readJson<any[]>('conversations.json', []);
      const targetConv = conversations.find(c => c.id === conversationId);
      if (targetConv) {
        targetConv.lastMessage = message.content || targetConv.lastMessage;
        targetConv.lastMessageAt = message.createdAt || new Date().toISOString();
        writeJson('conversations.json', conversations);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /api/conversations error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
