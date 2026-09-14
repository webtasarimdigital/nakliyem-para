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
  const carrierId = searchParams.get('carrierId');
  const email = searchParams.get('email');
  const requestId = searchParams.get('requestId');
  const convId = searchParams.get('convId');

  const conversations = readJson<any[]>('conversations.json', []);
  const allMessages = readJson<any[]>('messages.json', []);

  // 1. Direct query by convId: ALWAYS return all messages for this convId!
  if (convId) {
    const matchedConv = conversations.find(c => c.id === convId);
    let messages = allMessages.filter(m => m.conversationId === convId);

    // Also check for messages sent to sibling conversations for the same request
    const reqNum = (matchedConv?.contextId || matchedConv?.contextTitle || '').replace(/[^0-9]/g, '');
    if (reqNum && reqNum.length >= 4) {
      const siblingConvs = conversations.filter(c => c.id !== convId && ((c.contextId || '').includes(reqNum) || (c.contextTitle || '').includes(reqNum)));
      const siblingIds = new Set(siblingConvs.map(c => c.id));
      const siblingMsgs = allMessages.filter(m => 
        m.conversationId !== convId && 
        (siblingIds.has(m.conversationId) || m.conversationId?.includes(reqNum))
      );
      if (siblingMsgs.length > 0) {
        const msgIds = new Set(messages.map(m => m.id));
        siblingMsgs.forEach(sm => {
          if (!msgIds.has(sm.id)) {
            messages.push({ ...sm, conversationId: convId });
          }
        });
        messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      }
    }

    return NextResponse.json({
      success: true,
      conversations: matchedConv ? [matchedConv] : [],
      messages
    });
  }

  // 2. Query by requestId
  if (requestId) {
    const cleanReq = requestId.replace('#', '');
    const filtered = conversations.filter(c => 
      c.contextId === requestId || 
      c.contextId === cleanReq || 
      c.contextTitle?.includes(cleanReq)
    );
    const convIds = new Set(filtered.map(c => c.id));
    const messages = allMessages.filter(m => 
      convIds.has(m.conversationId) || 
      m.conversationId?.includes(cleanReq)
    );
    return NextResponse.json({ success: true, conversations: filtered, messages });
  }

  // 3. Query by userId, carrierId, or email
  if (userId || carrierId || email) {
    const u = userId ? userId.toLowerCase() : '';
    const carr = carrierId ? carrierId.toLowerCase() : '';
    const em = email ? email.toLowerCase() : '';

    const filtered = conversations.filter(c => {
      const parts = (c.participantIds || []).map((p: any) => String(p).toLowerCase());
      const pNames = c.participantNames ? Object.keys(c.participantNames).map(k => k.toLowerCase()) : [];

      const matchUser = u && (parts.includes(u) || pNames.includes(u));
      const matchCarrier = carr && (parts.includes(carr) || pNames.includes(carr));
      const matchEmail = em && (parts.includes(em) || pNames.includes(em));

      return matchUser || matchCarrier || matchEmail;
    });

    const convIds = new Set(filtered.map(c => c.id));
    const messages = allMessages.filter(m => 
      convIds.has(m.conversationId) || 
      (u && m.senderId && m.senderId.toLowerCase() === u) || 
      (carr && m.senderId && m.senderId.toLowerCase() === carr)
    );

    return NextResponse.json({ success: true, conversations: filtered, messages });
  }

  // 4. Default: return all conversations & all messages
  return NextResponse.json({ success: true, conversations, messages: allMessages });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      conversationId,
      message,
      conversation,
      requestId,
      carrierName,
      carrierSlug,
      carrierId,
      customerId,
      customerName,
      content,
      senderRole,
      senderName,
      senderId
    } = body;

    let targetConvId = conversationId || (conversation && conversation.id);
    let targetMessage = message;

    // Handle shortcut payload (e.g. from LiveOfferChatModal or quick forms)
    if (!targetMessage && content) {
      targetConvId = targetConvId || `conv_${requestId ? requestId.replace('#', '') : Date.now()}`;
      targetMessage = {
        id: `msg_${Date.now()}`,
        conversationId: targetConvId,
        senderId: senderId || (senderRole === 'CARRIER' ? (carrierId || 'user_carr_1') : (customerId || 'user_cust_1')),
        senderName: senderName || (senderRole === 'CARRIER' ? (carrierName || 'Nakliye Firması') : (customerName || 'Müşteri')),
        senderRole: senderRole || 'CUSTOMER',
        content: content.trim(),
        createdAt: new Date().toISOString()
      };
    }

    const conversations = readJson<any[]>('conversations.json', []);
    const messages = readJson<any[]>('messages.json', []);

    // 1. Save or update conversation
    if (conversation && conversation.id) {
      const convIndex = conversations.findIndex(c => c.id === conversation.id);
      if (convIndex >= 0) {
        conversations[convIndex] = { ...conversations[convIndex], ...conversation };
      } else {
        conversations.unshift(conversation);
      }
    } else if (targetConvId) {
      let conv = conversations.find(c => c.id === targetConvId);
      const now = new Date().toISOString();
      const sId = targetMessage?.senderId || customerId || 'user_cust_1';
      const sName = targetMessage?.senderName || customerName || 'Müşteri';
      const cId = carrierId || carrierSlug || 'user_carr_1';
      const cName = carrierName || 'Nakliyat Firması';

      if (!conv) {
        conv = {
          id: targetConvId,
          participantIds: Array.from(new Set([sId, cId, carrierId, carrierSlug, 'user_carr_1'].filter(Boolean))),
          participantNames: {
            [sId]: sName,
            [cId]: cName,
            'user_carr_1': cName
          },
          contextType: 'REQUEST',
          contextId: requestId || targetConvId,
          contextTitle: requestId ? `Talep #${requestId}` : 'Taşınma Sohbeti',
          lastMessage: targetMessage?.content || 'Sohbet başladı.',
          lastMessageAt: targetMessage?.createdAt || now,
          unreadCounts: {},
          createdAt: now
        };
        conversations.unshift(conv);
      } else if (targetMessage) {
        conv.lastMessage = targetMessage.content || conv.lastMessage;
        conv.lastMessageAt = targetMessage.createdAt || now;
      }
    }
    writeJson('conversations.json', conversations);

    // 2. Save or update message
    if (targetMessage && targetMessage.id && targetConvId) {
      targetMessage.conversationId = targetConvId;
      const existingMsgIndex = messages.findIndex(m => m.id === targetMessage.id);
      if (existingMsgIndex >= 0) {
        messages[existingMsgIndex] = { ...messages[existingMsgIndex], ...targetMessage };
      } else {
        messages.push(targetMessage);
      }
      writeJson('messages.json', messages);
    }

    return NextResponse.json({ success: true, conversationId: targetConvId, message: targetMessage });
  } catch (err: any) {
    console.error('API /api/conversations error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
