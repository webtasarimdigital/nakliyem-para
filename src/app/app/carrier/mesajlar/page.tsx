'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Send, 
  Truck, 
  MessageSquare, 
  Phone, 
  UserCheck, 
  Check, 
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
import { Conversation, ConversationMessage } from '@/types';

const QUICK_TEMPLATES = [
  'Merhaba, teklifimizi ilettik. Eşyalarınız için araç üstü hidrolik asansörümüz ve çift kat patpat ambalaj dahildir.',
  'Taşıma gün ve saatini teyit edebilir misiniz? Ekibimizi planlamak istiyoruz.',
  'Sokağınız büyük nakliye kamyonunun yanaşmasına uygun mudur?',
  'Fiyatımıza mobilya söküm ve kurulum marangozluk hizmetimiz dahildir.'
];

export default function CarrierMessagesPage() {
  const currentUser = db.getCurrentUser();
  const carrier = db.getCarriers().find(c => c.userId === currentUser?.id || c.id === currentUser?.carrierProfileId) || db.getCarriers()[0];
  const isApproved = carrier.verificationStatus === 'APPROVED';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allConvs = db.getConversations();
    setConversations(allConvs);
    if (allConvs.length > 0) {
      setActiveConvId(allConvs[0].id);
      setMessages(db.getMessages(allConvs[0].id));
      db.markConversationAsRead(allConvs[0].id, 'user_carr_1');
    }
  }, []);

  useEffect(() => {
    if (activeConvId) {
      setMessages(db.getMessages(activeConvId));
      db.markConversationAsRead(activeConvId, 'user_carr_1');
    }
  }, [activeConvId]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const activeConv = conversations.find(c => c.id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved) return;
    if (!inputMessage.trim() || !activeConvId) return;

    const newMsg = db.sendMessage(activeConvId, {
      senderId: 'user_carr_1',
      senderName: carrier.companyName,
      senderRole: 'CARRIER',
      content: inputMessage.trim()
    });

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setConversations(db.getConversations());
  };

  const handleQuickTemplate = (text: string) => {
    if (!isApproved) return;
    setInputMessage(text);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Müşteri Mesajları</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Teklif verdiğiniz müşterilerle doğrudan mesajlaşın, detayları netleştirin ve işi bağlayın.
          </p>
        </div>

        <Link href="/app/carrier/isler">
          <Button variant="primary" size="sm" className="font-black text-xs shadow-xs">
            + Yeni İşlere Teklif Ver
          </Button>
        </Link>
      </div>

      {/* Unverified Warning Banner (Spec requirement) */}
      {!isApproved && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-sm text-amber-900">
              ⚠️ Onaysız Profil — Henüz firmamız tarafından doğrulanmış profil değilsiniz
            </h4>
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Yüklediğiniz kimlik ve vergi levhası belgeleriniz inceleme aşamasındadır. <strong>12 saat içinde onay & red durumunuz verilecektir.</strong> Güvenlik sebebiyle evrak onayınız tamamlanana kadar müşterilere doğrudan mesaj gönderemezsiniz.
            </p>
            <Link href="/app/carrier/profil" className="inline-block pt-1 text-xs font-black text-[#F95700] hover:underline">
              Belgelerimi Görüntüle & Yeni Evrak Yükle →
            </Link>
          </div>
        </div>
      )}

      {/* Main Chat Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-14rem)] min-h-[560px] flex">
        
        {/* LEFT: Customer Conversations */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/40">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0A1128] uppercase tracking-wider">Gelen Talepler</span>
              <span className="text-xs font-bold text-slate-400">{conversations.length} Müşteri</span>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
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
                    <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#C23E00] flex items-center justify-center font-black text-sm shrink-0">
                      AY
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs sm:text-sm font-black text-[#0A1128] truncate">
                          Ahmet Yılmaz
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active Chat Thread */}
        {activeConv ? (
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Top Bar */}
            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#C23E00] flex items-center justify-center font-black text-base shrink-0">
                  AY
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-[#0A1128] text-sm sm:text-base truncate">
                    Ahmet Yılmaz
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>Talep: {activeConv.contextTitle}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href="tel:05321112233">
                  <Button variant="navy" size="sm" className="font-bold text-xs" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                    0532 111 22 33
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Templates Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 mr-1">Hızlı Yanıt:</span>
              {QUICK_TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickTemplate(tmpl)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:border-[#F95700] hover:text-[#F95700] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
                >
                  {tmpl.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]">
              {messages.map((msg) => {
                const isMe = msg.senderRole === 'CARRIER';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                      {!isMe && (
                        <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#C23E00] flex items-center justify-center text-[10px] font-black shrink-0 mb-1">
                          AY
                        </div>
                      )}

                      <div
                        className={`p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-[#0A1128] text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        <div className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                          isMe ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isMe && <Check className="w-3 h-3 text-[#F95700]" />}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input or Locked Notice */}
            {!isApproved ? (
              <div className="p-4 border-t border-slate-200 bg-amber-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Profiliniz henüz onaylanmadı. 12 saat içinde kimlik &amp; vergi levhası incelemeniz tamamlandığında mesajlaşma açılacaktır.</span>
                </div>
                <Link href="/app/carrier/profil">
                  <button type="button" className="px-3.5 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-black text-xs shrink-0 cursor-pointer transition-colors">
                    Evraklarımı Gör
                  </button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="Müşteriye teklif notu veya yanıt yazın..."
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#F95700] focus:outline-none text-sm font-medium text-[#0A1128] bg-slate-50/50"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="font-black px-6 shadow-md shadow-orange-900/15 cursor-pointer"
                  rightIcon={<Send className="w-4 h-4" />}
                  disabled={!inputMessage.trim()}
                >
                  Gönder
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 text-slate-300" />
            <h3 className="font-bold text-[#0A1128] text-base mb-1">Bir sohbet seçin</h3>
          </div>
        )}
      </div>
    </div>
  );
}
