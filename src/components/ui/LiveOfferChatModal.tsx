'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  FileText,
  Send,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';
import { ConversationMessage, CarrierProfile } from '@/types';

interface LiveOfferChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrierName?: string;
  carrierSlug?: string;
  requestId?: string;
  offerPrice?: number;
}

export function LiveOfferChatModal({
  isOpen,
  onClose,
  carrierName = 'Nakliyat Firması',
  carrierSlug = '',
  requestId = '#26093',
  offerPrice = 25000
}: LiveOfferChatModalProps) {
  const convKey = `live_chat_${requestId}_${carrierSlug || carrierName.replace(/\s+/g, '_')}`;

  const [messages, setMessages] = useState<{
    id: string;
    sender: 'CARRIER' | 'CUSTOMER';
    type: 'OFFER_CARD' | 'TEXT' | 'IMAGE';
    content: string;
    mediaUrl?: string;
    time: string;
  }[]>([]);

  const [inputMessage, setInputMessage] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync / load messages when modal opens or offer props change
  useEffect(() => {
    if (!isOpen) return;

    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(convKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {}
    }

    // Default initial messages for this specific offer
    const initialList = [
      {
        id: `offer_card_${requestId}`,
        sender: 'CARRIER' as const,
        type: 'OFFER_CARD' as const,
        content: `${requestId} · ${carrierName}\n· ${Number(offerPrice || 0).toLocaleString('tr-TR')} TL fiyat teklifi verildi`,
        time: 'Yeni'
      },
      {
        id: `offer_intro_${requestId}`,
        sender: 'CARRIER' as const,
        type: 'TEXT' as const,
        content: `Merhaba, talebiniz için ${Number(offerPrice || 0).toLocaleString('tr-TR')} TL teklifimizi ilettik. Sorularınız olursa buradan dilediğiniz an yazabilirsiniz.`,
        time: 'Yeni'
      }
    ];

    setMessages(initialList);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(convKey, JSON.stringify(initialList));
      } catch {}
    }
  }, [isOpen, carrierName, carrierSlug, requestId, offerPrice]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const trimmed = inputMessage.trim();
    const newMsg = {
      id: `cust_${Date.now()}`,
      sender: 'CUSTOMER' as const,
      type: 'TEXT' as const,
      content: trimmed,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(convKey, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    // Save message to mock-db conversation so carrier can see it in /app/carrier/mesajlar
    try {
      const allConvs = db.getConversations();
      let matchedConv = allConvs.find(c => c.contextId === requestId || c.contextTitle?.includes(requestId));
      if (!matchedConv) {
        matchedConv = db.createConversation({
          participantIds: ['user_cust_1', carrierSlug || 'user_carr_1'],
          participantNames: {
            'user_cust_1': db.getCurrentUser()?.fullName || 'Müşteri',
            [carrierSlug || 'user_carr_1']: carrierName
          },
          contextType: 'REQUEST',
          contextId: requestId,
          contextTitle: `${requestId} - ${carrierName}`,
          initialMessage: trimmed
        });
      } else {
        db.sendMessage(matchedConv.id, {
          senderId: db.getCurrentUser()?.id || 'user_cust_1',
          senderName: db.getCurrentUser()?.fullName || 'Müşteri',
          senderRole: 'CUSTOMER',
          content: trimmed
        });
      }
    } catch (err) {
      console.warn('Mesaj mock-db senkronizasyon hatası:', err);
    }

    // Sync to server API
    try {
      fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          carrierName,
          content: trimmed,
          senderRole: 'CUSTOMER'
        })
      }).catch(() => {});
    } catch {}

    setInputMessage('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0A1128]/40 backdrop-blur-xs animate-fade-in">
      
      {/* ── CHAT MODAL CONTAINER (Image media_1788383028254 exact) ── */}
      <div className="bg-white rounded-3xl sm:rounded-4xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[650px] max-h-[92vh] animate-scale-in">
        
        {/* 1. Header Bar: Back arrow + Avatar + Company Name + Close */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Carrier Avatar SN */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {carrierName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'SN'}
            </div>

            <span className="font-black text-xs sm:text-sm text-[#0A1128] tracking-tight">
              {carrierName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Messages & Profile Content Scroll Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative bg-[#FAFAFA]"
          onScroll={(e) => {
            const target = e.currentTarget;
            const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 120;
            setShowScrollBottom(!isNearBottom);
          }}
        >
          
          {/* Profile Summary Card inside chat (Image media_1788383028254 exact) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs text-center space-y-3">
            {/* Round Avatar with Top Gradient Glow */}
            <div className="relative mx-auto w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-md">
              <div className="w-full h-full rounded-full bg-[#0A1128] text-white flex items-center justify-center font-black text-base">
                {carrierName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>

            <div>
              <h3 className="font-black text-base text-[#0A1128] leading-tight">
                {carrierName}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Şubat 2011 katıldı
              </p>
              <div className="inline-flex items-center gap-1 mt-1 text-xs font-black text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 fill-amber-500 text-white" />
                <span>Altın Üye</span>
              </div>
            </div>

            {/* 3 Stats Columns */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 py-2 border-y border-slate-100">
              <div>
                <span className="font-black text-base text-[#0A1128] block">58</span>
                <span className="text-[10px] font-bold text-slate-400">Paylaşım</span>
              </div>
              <div>
                <span className="font-black text-base text-[#0A1128] block">2</span>
                <span className="text-[10px] font-bold text-slate-400">Yük/İş</span>
              </div>
              <div>
                <span className="font-black text-base text-[#0A1128] block">Yeni</span>
                <span className="text-[10px] font-bold text-slate-400">Yorum</span>
              </div>
            </div>

            {/* Firma Sayfasını Göster Link Button */}
            <div>
              <Link
                href={`/firma/${carrierSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
              >
                <span>Firma Sayfasını Göster</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Date Divider */}
          <div className="flex items-center justify-center my-2">
            <span className="px-3 py-1 rounded-full bg-slate-200/70 text-slate-600 text-[11px] font-bold shadow-2xs">
              26 Ağustos
            </span>
          </div>

          {/* Messages Feed */}
          {messages.map((msg) => {
            const isMe = msg.sender === 'CUSTOMER';

            if (msg.type === 'OFFER_CARD') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-orange-50/80 border-l-4 border-[#F95700] rounded-2xl rounded-tl-sm p-3.5 max-w-[85%] shadow-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#F95700]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Taşınma Talebi</span>
                    </div>
                    <p className="text-xs font-bold text-[#0A1128] leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </p>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.type === 'IMAGE') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-1.5 max-w-[70%] shadow-xs space-y-1">
                    <div className="rounded-xl overflow-hidden bg-slate-100">
                      <img
                        src={msg.mediaUrl}
                        alt="Firma Kartviziti"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="text-right px-1">
                      <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 max-w-[80%] shadow-xs space-y-0.5 ${
                    isMe
                      ? 'bg-[#F95700] text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }`}
                >
                  <p className="text-xs font-semibold leading-relaxed">
                    {msg.content}
                  </p>
                  <div className={`text-right text-[10px] ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll To Bottom Floating Button */}
        {showScrollBottom && (
          <div className="absolute bottom-20 right-8 z-10">
            <button
              onClick={scrollToBottom}
              className="w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 text-slate-600 hover:text-[#0A1128] flex items-center justify-center transition-all animate-bounce"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. Input Footer Bar (Image media_1788383028254 exact) */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="w-full py-3 pl-4 pr-12 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-[#0A1128] placeholder:text-slate-400 focus:bg-white focus:border-[#F95700] focus:outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="absolute right-2 w-8 h-8 rounded-full bg-[#F95700] hover:bg-[#E04D00] disabled:bg-slate-300 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
