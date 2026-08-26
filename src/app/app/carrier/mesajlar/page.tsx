'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Truck, 
  MessageSquare, 
  Phone, 
  UserCheck, 
  Check, 
  Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function CarrierMessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'CARRIER',
      text: 'Merhaba Ahmet Bey, Kadıköy - Çankaya taşımanız için teklifimizi ilettik. Çıkış binası için dış cephe asansörümüz hazırdır.',
      time: '14:22'
    },
    {
      id: 'm2',
      sender: 'CUSTOMER',
      text: 'Teşekkürler Murat Bey. Mobilya montajını ekibiniz yapıyor mu?',
      time: '14:25'
    },
    {
      id: 'm3',
      sender: 'CARRIER',
      text: 'Evet, usta marangozumuz ekibimizde mevcuttur.',
      time: '14:28'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: `msg_${Date.now()}`,
        sender: 'CARRIER',
        text: inputMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px] flex">
        {/* Left: Client Conversations */}
        <div className="w-full sm:w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Müşteri Mesajları</h2>
            <p className="text-xs text-slate-500">Teklif verdiğiniz müşteriler</p>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            <div className="p-4 bg-[#EAF3FF]/80 cursor-pointer flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0B3B8F] flex items-center justify-center font-bold text-xs shrink-0">
                AY
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">Ahmet Yılmaz (Talep #26093)</span>
                  <span className="text-[10px] text-slate-400">14:28</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  Mobilya montajını ekibiniz yapıyor mu?
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0B3B8F] flex items-center justify-center font-bold text-xs">
                AY
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Ahmet Yılmaz</h3>
                <span className="text-xs text-slate-500">Kadıköy → Çankaya (2+1 Ev)</span>
              </div>
            </div>

            <a href="tel:05352345678">
              <Button variant="outline" size="sm" className="text-xs" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                Müşteriyi Ara
              </Button>
            </a>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'CARRIER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'CARRIER'
                      ? 'bg-[#146EF5] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Müşteriye yanıt yazın..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
            />
            <Button type="submit" variant="primary" size="md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
