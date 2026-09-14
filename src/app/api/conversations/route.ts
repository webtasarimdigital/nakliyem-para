import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db as firestoreDb, auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
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
  } catch (err) {
    // Expected on serverless/read-only environments like Vercel
  }
}

import { extractNumericRequestCode, extractCarrierRoot, slugifyTurkish } from '@/lib/data/mock-db';

function getCarrierKey(str?: string): string {
  return extractCarrierRoot(str);
}

// In-memory cache for serverless execution environment
let memoryConversations: any[] = [];
let memoryMessages: any[] = [];

async function ensureWorkerAuth() {
  if (!isFirebaseConfigured() || !firebaseAuth) return;
  try {
    if (!firebaseAuth.currentUser) {
      await signInWithEmailAndPassword(firebaseAuth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!');
    }
  } catch (err) {
    console.warn('ensureWorkerAuth error:', err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const carrierId = searchParams.get('carrierId');
  const email = searchParams.get('email');
  const requestId = searchParams.get('requestId');
  const convId = searchParams.get('convId');

  const fileConvs = readJson<any[]>('conversations.json', []);
  const fileMsgs = readJson<any[]>('messages.json', []);

  // Merge with memory
  const convMap = new Map<string, any>();
  fileConvs.forEach(c => convMap.set(c.id, c));
  memoryConversations.forEach(c => convMap.set(c.id, c));

  const msgMap = new Map<string, any>();
  fileMsgs.forEach(m => msgMap.set(m.id, m));
  memoryMessages.forEach(m => msgMap.set(m.id, m));

  const reqNum = extractNumericRequestCode(requestId || undefined) || 
                 extractNumericRequestCode(convId || undefined) || 
                 extractNumericRequestCode(searchParams.get('q') || undefined);

  // Sync from Cloud Firestore if available
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await ensureWorkerAuth();

      // 1. If reqNum is given, read direct chat docs
      if (reqNum) {
        const carrRoot = extractCarrierRoot(carrierId || '');
        const carrFull = slugifyTurkish(carrierId || '').replace(/[^a-z0-9]/g, '');
        const chatDocIds = [`chat_${reqNum}`];
        if (carrRoot && carrRoot !== 'carrier') chatDocIds.push(`chat_${reqNum}_${carrRoot}`);
        if (carrFull && !chatDocIds.includes(`chat_${reqNum}_${carrFull}`)) chatDocIds.push(`chat_${reqNum}_${carrFull}`);

        for (const docId of chatDocIds) {
          try {
            const snap = await getDoc(doc(firestoreDb, 'requests', docId));
            if (snap.exists()) {
              const d = snap.data();
              if (Array.isArray(d.messages)) {
                d.messages.forEach((m: any) => msgMap.set(m.id, m));
              }
              if (d.conversation && d.conversation.id) {
                convMap.set(d.conversation.id, d.conversation);
              }
            }
          } catch {}
        }
      }

      // 2. Query all isChatDoc == true docs from requests collection
      try {
        const chatQuery = query(collection(firestoreDb, 'requests'), where('isChatDoc', '==', true));
        const chatSnaps = await getDocs(chatQuery);
        chatSnaps.forEach(snap => {
          const d = snap.data();
          if (Array.isArray(d.messages)) {
            d.messages.forEach((m: any) => msgMap.set(m.id, m));
          }
          if (d.conversation && d.conversation.id) {
            convMap.set(d.conversation.id, d.conversation);
          }
        });
      } catch (qErr) {
        // Continue if query fails
      }

      // 3. If convId is provided, also check direct conversations collection
      if (convId) {
        try {
          const cSnap = await getDoc(doc(firestoreDb, 'conversations', convId));
          if (cSnap.exists()) {
            const cd = cSnap.data();
            convMap.set(convId, cd);
            if (Array.isArray(cd.messages)) {
              cd.messages.forEach((m: any) => msgMap.set(m.id, m));
            }
          }
        } catch {}
      }
    } catch (err) {
      console.warn('Firestore GET sync error:', err);
    }
  }

  const allConvs = Array.from(convMap.values());
  const allMessages = Array.from(msgMap.values());

  // 1. Direct query by convId: return all messages matching convId or request number
  if (convId) {
    const matchedConv = allConvs.find(c => c.id === convId);
    let messages = allMessages.filter(m => m.conversationId === convId);

    const qReq = searchParams.get('requestId') || '';
    const resolvedReqNum = reqNum || 
                           extractNumericRequestCode(qReq) || 
                           extractNumericRequestCode(matchedConv?.contextTitle) || 
                           extractNumericRequestCode(matchedConv?.contextId);

    if (resolvedReqNum && resolvedReqNum.length >= 4) {
      const siblingMsgs = allMessages.filter(m => 
        m.conversationId !== convId && 
        ((m.conversationId && m.conversationId.includes(resolvedReqNum)) || 
         (m.offerData?.requestId && String(m.offerData.requestId).includes(resolvedReqNum)) ||
         (m.content && m.content.includes(`#${resolvedReqNum}`)))
      );
      if (siblingMsgs.length > 0) {
        const msgIds = new Set(messages.map(m => m.id));
        siblingMsgs.forEach(sm => {
          if (!msgIds.has(sm.id)) {
            messages.push({ ...sm, conversationId: convId });
          }
        });
      }
    }

    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json({
      success: true,
      conversations: matchedConv ? [matchedConv] : (allConvs.length > 0 ? allConvs.filter(c => extractNumericRequestCode(c.contextTitle) === resolvedReqNum) : []),
      messages
    });
  }

  // 2. Query by requestId
  if (requestId) {
    const rNum = reqNum || requestId.replace('#', '');
    const filtered = allConvs.filter(c => 
      extractNumericRequestCode(c.contextId) === rNum || 
      extractNumericRequestCode(c.contextTitle) === rNum ||
      c.contextId === requestId || 
      c.contextTitle?.includes(rNum)
    );
    const convIds = new Set(filtered.map(c => c.id));
    const messages = allMessages.filter(m => 
      convIds.has(m.conversationId) || 
      (m.conversationId && m.conversationId.includes(rNum)) ||
      (m.offerData?.requestId && String(m.offerData.requestId).includes(rNum)) ||
      (m.content && m.content.includes(`#${rNum}`))
    );
    messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return NextResponse.json({ success: true, conversations: filtered, messages });
  }

  // 3. Query by userId, carrierId, or email
  if (userId || carrierId || email) {
    const u = userId ? userId.toLowerCase() : '';
    const carr = carrierId ? carrierId.toLowerCase() : '';
    const em = email ? email.toLowerCase() : '';

    const filtered = allConvs.filter(c => {
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
  return NextResponse.json({ success: true, conversations: allConvs, messages: allMessages });
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

    const reqNum = extractNumericRequestCode(requestId) || 
                   extractNumericRequestCode(targetConvId) || 
                   extractNumericRequestCode(conversation?.contextTitle) || 
                   extractNumericRequestCode(conversation?.contextId);
    const carrKey = getCarrierKey(carrierSlug || carrierId || carrierName);

    // 1. Update in-memory & local fallback
    const fileConvs = readJson<any[]>('conversations.json', []);
    const fileMsgs = readJson<any[]>('messages.json', []);

    if (conversation && conversation.id) {
      const idx = memoryConversations.findIndex(c => c.id === conversation.id);
      if (idx >= 0) memoryConversations[idx] = { ...memoryConversations[idx], ...conversation };
      else memoryConversations.unshift(conversation);

      const fIdx = fileConvs.findIndex(c => c.id === conversation.id);
      if (fIdx >= 0) fileConvs[fIdx] = { ...fileConvs[fIdx], ...conversation };
      else fileConvs.unshift(conversation);
    }

    if (targetMessage && targetMessage.id) {
      const mIdx = memoryMessages.findIndex(m => m.id === targetMessage.id);
      if (mIdx >= 0) memoryMessages[mIdx] = { ...memoryMessages[mIdx], ...targetMessage };
      else memoryMessages.push(targetMessage);

      const fMIdx = fileMsgs.findIndex(m => m.id === targetMessage.id);
      if (fMIdx >= 0) fileMsgs[fMIdx] = { ...fileMsgs[fMIdx], ...targetMessage };
      else fileMsgs.push(targetMessage);
    }

    writeJson('conversations.json', fileConvs);
    writeJson('messages.json', fileMsgs);

    // 2. Persist to Cloud Firestore for 100% reliable cross-browser / cross-device sync
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await ensureWorkerAuth();

        const carrRoot = extractCarrierRoot(carrierSlug || carrierId || carrierName);
        const carrFull = slugifyTurkish(carrierSlug || carrierId || carrierName || '').replace(/[^a-z0-9]/g, '');
        const chatDocsToUpdate = [];
        if (reqNum) {
          chatDocsToUpdate.push(`chat_${reqNum}`);
          if (carrRoot && carrRoot !== 'carrier') chatDocsToUpdate.push(`chat_${reqNum}_${carrRoot}`);
          if (carrFull && !chatDocsToUpdate.includes(`chat_${reqNum}_${carrFull}`)) chatDocsToUpdate.push(`chat_${reqNum}_${carrFull}`);
        }

        for (const docId of chatDocsToUpdate) {
          const docRef = doc(firestoreDb, 'requests', docId);
          const snap = await getDoc(docRef);
          let currentList: any[] = [];
          if (snap.exists() && Array.isArray(snap.data().messages)) {
            currentList = snap.data().messages;
          }
          if (targetMessage) {
            const exIdx = currentList.findIndex(m => m.id === targetMessage.id);
            if (exIdx >= 0) {
              currentList[exIdx] = targetMessage;
            } else {
              currentList.push(targetMessage);
            }
          }
          await setDoc(docRef, {
            isChatDoc: true,
            requestId: reqNum,
            carrierKey: carrKey,
            conversationId: targetConvId,
            conversation: conversation || snap.data()?.conversation || null,
            messages: currentList,
            lastMessage: targetMessage?.content || '',
            lastMessageAt: targetMessage?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        // Also save to conversations collection directly
        if (targetConvId) {
          await setDoc(doc(firestoreDb, 'conversations', targetConvId), {
            ...(conversation || {}),
            id: targetConvId,
            requestId: reqNum || requestId,
            lastMessage: targetMessage?.content || '',
            lastMessageAt: targetMessage?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (fbErr) {
        console.warn('Firestore POST error:', fbErr);
      }
    }

    return NextResponse.json({ success: true, conversationId: targetConvId, message: targetMessage });
  } catch (err: any) {
    console.error('API /api/conversations error:', err);
    return NextResponse.json({ error: err.message || 'Sunucu hatası' }, { status: 500 });
  }
}
