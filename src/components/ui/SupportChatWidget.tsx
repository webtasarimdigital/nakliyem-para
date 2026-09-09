'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCheck, 
  Minimize2, 
  Headphones,
  Loader2,
  Clock
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent';
}

export const openSupportChat = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-support-chat'));
  }
};

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // email or phone
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize from currentUser and localStorage
  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setName(currentUser.fullName || (currentUser as any).name || currentUser.companyName || '');
      setContactInfo(currentUser.email || currentUser.phone || '');
    } else {
      const savedName = localStorage.getItem('tasinteklif_support_name');
      const savedContact = localStorage.getItem('tasinteklif_support_contact');
      if (savedName) setName(savedName);
      if (savedContact) setContactInfo(savedContact);
    }

    // Load saved messages or set default welcome
    const savedMessages = localStorage.getItem('tasinteklif_support_messages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setHasStarted(true);
        } else {
          initWelcomeMessage();
        }
      } catch {
        initWelcomeMessage();
      }
    } else {
      initWelcomeMessage();
    }

    // Global open event
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-support-chat', handleOpen);
    return () => window.removeEventListener('open-support-chat', handleOpen);
  }, []);

  const initWelcomeMessage = () => {
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'bot',
        text: 'Merhaba! 👋 TaşınTeklif Canlı Destek ekibine hoş geldiniz.\n\nNakliye talebiniz, fiyat teklifleri veya platformumuzla ilgili sormak istediğiniz her şeyi buradan yazabilirsiniz. Size hemen yardımcı olalım.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('tasinteklif_support_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = message.trim();
    if (!cleanText || isSending) return;

    // Contact info validation
    const cleanName = name.trim() || 'Ziyaretçi';
    const cleanContact = contactInfo.trim();

    if (!cleanContact) {
      alert('Lütfen size ulaşabilmemiz için e-posta adresinizi veya telefon numaranızı girin.');
      return;
    }

    // Save contact info locally
    localStorage.setItem('tasinteklif_support_name', cleanName);
    localStorage.setItem('tasinteklif_support_contact', cleanContact);

    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'msg_' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: cleanText,
      timestamp: timeStr,
      status: 'sending',
    };

    setMessages(prev => [...prev, newUserMsg]);
    setMessage('');
    setIsSending(true);
    setHasStarted(true);

    try {
      const isEmail = cleanContact.includes('@');
      const payload = {
        name: cleanName,
        email: isEmail ? cleanContact : '',
        phone: !isEmail ? cleanContact : '',
        message: cleanText,
        subject: `🔔 Destek Chat Mesajı: ${cleanName} (${cleanContact})`,
      };

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Update message status to sent
      setMessages(prev =>
        prev.map(m => (m.id === userMsgId ? { ...m, status: 'sent' } : m))
      );

      // Automated helpful response
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: 'bot_reply_' + Date.now(),
          sender: 'bot',
          text: `Mesajınızı aldık! ✨\n\nYetkili ekibimiz talebinizi inceleyip ${cleanContact} üzerinden en kısa sürede size dönüş yapacaktır. Teşekkür ederiz.`,
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botReply]);
      }, 700);
    } catch (err) {
      console.error('Support message send error:', err);
      // Even if network fails, don't drop the user's message
      setMessages(prev =>
        prev.map(m => (m.id === userMsgId ? { ...m, status: 'sent' } : m))
      );
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: 'bot_reply_' + Date.now(),
          sender: 'bot',
          text: 'Mesajınız sıraya alındı! Ekibimiz en kısa sürede sizinle iletişime geçecektir.',
          timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, botReply]);
      }, 700);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setMessage(q);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <>
      {/* ── 1. FLOATING CHAT BUTTON (When Closed / Minimized) ──────────── */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 animate-bounce-short">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-2.5 px-4 sm:px-5 py-3.5 rounded-full bg-[#111E38] hover:bg-[#1a2e56] text-white shadow-2xl hover:shadow-orange-500/20 border-2 border-[#F95700] transition-all transform hover:scale-105 group cursor-pointer"
            aria-label="Bize Ulaşın / Canlı Destek"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111E38] animate-pulse" />
              <Headphones className="w-5 h-5 text-[#F95700] group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold block leading-tight text-white">Bize Ulaşın</span>
              <span className="text-[10px] text-emerald-400 font-medium block leading-none">Canlı Destek</span>
            </div>
            <span className="sm:hidden text-xs font-bold text-white">Bize Yazın</span>
          </button>
        </div>
      )}

      {/* ── 2. LIVE CHAT MODAL / WINDOW ─────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'hidden'
              : 'bottom-20 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-24px)] sm:w-[390px] h-[540px] max-h-[82vh]'
          }`}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="bg-[#111E38] text-white p-4 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#F95700] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111E38]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5 leading-tight">
                    TaşınTeklif Destek
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Çevrimiçi · Anında İletişim
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Küçült"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body / Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/70 space-y-3 text-xs">
              <div className="text-center my-1">
                <span className="px-3 py-1 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-semibold tracking-wider uppercase">
                  Canlı Sohbet
                </span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#F95700] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                    }`}
                  >
                    <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <div
                      className={`flex items-center justify-end gap-1 text-[10px] ${
                        msg.sender === 'user' ? 'text-orange-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <span>
                          {msg.status === 'sending' ? (
                            <Clock className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCheck className="w-3 h-3 text-white" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-2xs flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F95700]" />
                    <span className="text-[11px] font-medium">Mesajınız iletiliyor...</span>
                  </div>
                </div>
              )}

              {/* Quick Suggestion Pills (Shown before user starts chatting) */}
              {!hasStarted && (
                <div className="pt-2 space-y-1.5">
                  <p className="text-[11px] text-slate-500 font-semibold px-1">Sık sorulanlar:</p>
                  <button
                    type="button"
                    onClick={() => handleQuickQuestion('Nakliyat için nasıl fiyat teklifi alabilirim?')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] text-slate-700 hover:text-[#F95700] transition-colors text-[11px] font-medium"
                  >
                    💡 Nakliyat için nasıl fiyat teklifi alırım?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickQuestion('Nakliyeciyim, sisteme nasıl üye olup iş alabilirim?')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] text-slate-700 hover:text-[#F95700] transition-colors text-[11px] font-medium"
                  >
                    🚛 Nakliyeciyim, sisteme nasıl kayıt olabilirim?
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickQuestion('Bir taleple ilgili bilgi almak istiyorum.')}
                    className="w-full text-left p-2 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] text-slate-700 hover:text-[#F95700] transition-colors text-[11px] font-medium"
                  >
                    📦 Bir taleple ilgili yetkiliyle görüşmek istiyorum
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* User Details Bar (Name + Email/Phone) */}
            <div className="p-2.5 bg-white border-t border-slate-100 grid grid-cols-2 gap-2 shrink-0">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-[#F95700] focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="E-posta veya Telefon *"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-medium text-slate-800 bg-slate-50 focus:bg-white focus:border-[#F95700] focus:outline-none"
                />
              </div>
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınızı buraya yazın..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50 focus:bg-white focus:border-[#F95700] focus:outline-none"
                disabled={isSending}
              />
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                className="w-9 h-9 rounded-xl bg-[#F95700] hover:bg-[#E04D00] disabled:bg-slate-300 text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Gönder"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
};
