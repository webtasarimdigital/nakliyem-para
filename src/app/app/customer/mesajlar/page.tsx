'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Send, 
  Paperclip, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Truck,
  MessageSquare,
  Phone,
  CheckCircle2,
  Clock,
  Info,
  ChevronRight,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { Conversation, ConversationMessage, Offer } from '@/types';

function CustomerMessagesContent() {
  const searchParams = useSearchParams();
  const targetConvId = searchParams?.get('convId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const userConvs = db.getConversations();
    setConversations(userConvs);
    if (userConvs.length > 0) {
      const initialId = targetConvId && userConvs.some(c => c.id === targetConvId)
        ? targetConvId
        : userConvs[0].id;
      setActiveConvId(initialId);
      setMessages(db.getMessages(initialId));
      db.markConversationAsRead(initialId, 'user_cust_1');
    }
  }, [targetConvId]);

  // Load messages when activeConvId changes
  useEffect(() => {
    if (activeConvId) {
      setMessages(db.getMessages(activeConvId));
      db.markConversationAsRead(activeConvId, 'user_cust_1');
    }
  }, [activeConvId]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom without page jumping
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activeCarrier = db.getCarriers().find(c => activeConv?.participantIds.includes(c.userId)) || db.getCarriers()[0];
  const activeOffer = db.getOffers().find(o => o.carrierId === activeCarrier.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConvId) return;

    const userMsg = db.sendMessage(activeConvId, {
      senderId: 'user_cust_1',
      senderName: 'Ahmet Yılmaz',
      senderRole: 'CUSTOMER',
      content: inputMessage.trim()
    });

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Update conversation list item lastMessage
    setConversations(db.getConversations());

    // Simulate carrier intelligent reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg = db.sendMessage(activeConvId, {
        senderId: activeCarrier.userId || 'user_carr_1',
        senderName: activeCarrier.companyName,
        senderRole: 'CARRIER',
        content: 'Mesajınız alındı Ahmet Bey. Ekiplerimiz talebiniz doğrultusunda gerekli hazırlıkları yapacaktır. Başka bir sorunuz olursa memnuniyetle yanıtlarız.'
      });
      setMessages(prev => [...prev, replyMsg]);
      setConversations(db.getConversations());
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="messages" />
          </div>

          <main className="lg:col-span-9 space-y-6">
            
            {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Mesajlar &amp; Sohbet</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Teklif veren onaylı nakliyeciler ile güvenli mesajlaşma ve fiyat netleştirme.
          </p>
        </div>

        <Link href="/app/customer/teklifler">
          <Button variant="outline" size="sm" className="font-bold text-xs">
            ← Tüm Teklifleri Gör
          </Button>
        </Link>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-14rem)] min-h-[560px] flex">
        
        {/* LEFT COLUMN: Conversations List (1/3) */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/40">
          
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0A1128] uppercase tracking-wider">Sohbetler</span>
              <span className="text-xs font-bold text-slate-400">{conversations.length} Aktif Firma</span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const carrier = db.getCarriers().find(c => conv.participantIds.includes(c.userId)) || db.getCarriers()[0];
              const unread = conv.unreadCounts['user_cust_1'] || 0;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-orange-50/80 border-l-4 border-[#F95700]' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#0A1128] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                      {carrier.companyName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-[#0A1128] truncate">
                          {carrier.companyName}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] font-bold text-[#F95700] truncate mb-1">
                        {conv.contextTitle}
                      </p>

                      <p className="text-xs text-slate-600 font-medium truncate">
                        {conv.lastMessage || 'Sohbet başladı.'}
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Thread (2/3) */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Top Chat Bar: Carrier Info & Offer Quick Card */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#0A1128] text-white flex items-center justify-center font-black text-base shrink-0">
                  {activeCarrier.companyName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[#0A1128] text-sm sm:text-base truncate">
                      {activeCarrier.companyName}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{activeCarrier.city}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-bold">★ {activeCarrier.rating} ({activeCarrier.reviewCount} yorum)</span>
                  </div>
                </div>
              </div>

              {/* Offer snippet & actions */}
              <div className="flex items-center gap-2 shrink-0">
                {activeOffer && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200">
                    <span className="text-xs text-slate-600 font-bold">Teklif:</span>
                    <span className="text-sm font-black text-[#F95700]">{activeOffer.price.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}
                <a href={`tel:${activeCarrier.phone}`}>
                  <Button variant="navy" size="sm" className="font-bold text-xs" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                    Ara
                  </Button>
                </a>
                <Link href={`/firma/${activeCarrier.slug}`}>
                  <Button variant="outline" size="sm" className="font-bold text-xs">
                    Profili Gör
                  </Button>
                </Link>
              </div>
            </div>

            {/* Messages Feed */}
            <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]">
              
              {/* Context Banner */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F95700]" />
                  <span><strong>Konu:</strong> {activeConv.contextTitle}</span>
                </div>
                <span className="text-slate-400">Uçtan uca güvenli sohbet</span>
              </div>

              {/* Profile Summary Card inside chat (Image media_1788383028254 exact) */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs text-center space-y-3 max-w-md mx-auto my-2">
                <div className="relative mx-auto w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-md">
                  <div className="w-full h-full rounded-full bg-[#0A1128] text-white flex items-center justify-center font-black text-base">
                    {activeCarrier.companyName.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-base text-[#0A1128] leading-tight">
                    {activeCarrier.companyName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                    Şubat 2011 katıldı
                  </p>
                  <div className="inline-flex items-center gap-1 mt-1 text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-amber-500 text-white" />
                    <span>Altın Üye</span>
                  </div>
                </div>

                {/* 3 Stats Columns */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 py-2 border-y border-slate-100">
                  <div>
                    <span className="font-black text-base text-[#0A1128] block">{activeCarrier.reviewCount || 58}</span>
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

                <div>
                  <Link
                    href={`/firma/${activeCarrier.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <span>Firma Sayfasını Göster</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              </div>

              {messages.map((msg) => {
                const isMe = msg.senderRole === 'CUSTOMER';

                if (msg.isOfferCard) {
                  return (
                    <div key={msg.id} className="flex justify-start my-2">
                      <div className="bg-orange-50/90 border-l-4 border-[#F95700] rounded-2xl rounded-tl-sm p-4 max-w-[85%] sm:max-w-[75%] shadow-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#F95700]">
                          <FileText className="w-4 h-4" />
                          <span>Taşınma Talebi</span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-[#0A1128] leading-relaxed whitespace-pre-line">
                          {msg.content}
                        </p>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (msg.mediaUrl) {
                  return (
                    <div key={msg.id} className="flex justify-start my-2">
                      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-2 max-w-[70%] shadow-xs space-y-1">
                        <div className="rounded-xl overflow-hidden bg-slate-100">
                          <img
                            src={msg.mediaUrl}
                            alt="Kartvizit veya Eşya Görseli"
                            className="w-full h-44 object-cover"
                          />
                        </div>
                        <div className="text-right px-1">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                      {!isMe && (
                        <div className="w-7 h-7 rounded-xl bg-[#0A1128] text-white flex items-center justify-center text-[10px] font-black shrink-0 mb-1">
                          {msg.senderName.charAt(0)}
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-[#F95700] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                          isMe ? 'text-white/80' : 'text-slate-400'
                        }`}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold italic pl-9">
                  <span className="w-2 h-2 rounded-full bg-[#F95700] animate-bounce" />
                  <span>{activeCarrier.companyName} yazıyor...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Mesajınızı yazın (fiyat, asansör, saat detayı vb.)..."
                className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#F95700] focus:outline-none text-sm font-medium text-[#0A1128] bg-slate-50/50"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-black px-6 shadow-md shadow-orange-900/15"
                rightIcon={<Send className="w-4 h-4" />}
                disabled={!inputMessage.trim()}
              >
                Gönder
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
            <h3 className="font-bold text-[#0A1128] text-base mb-1">Bir sohbet seçin</h3>
            <p className="text-xs text-slate-400">Teklif veren nakliyeciler ile mesajlaşmak için soldan bir firma seçin.</p>
          </div>
        )}
      </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CustomerMessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <CustomerMessagesContent />
    </Suspense>
  );
}
