'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Send, 
  Paperclip, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Truck,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

interface ChatMessage {
  id: string;
  sender: 'CUSTOMER' | 'CARRIER';
  text: string;
  time: string;
}

function CustomerMessagesContent() {
  const searchParams = useSearchParams();
  const targetCarrierId = searchParams?.get('carrierId');

  const carriers = db.getCarriers();
  const [selectedCarrier, setSelectedCarrier] = useState(
    targetCarrierId ? db.getCarrierById(targetCarrierId) || carriers[0] : carriers[0]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'CARRIER',
      text: 'Merhaba Ahmet Bey, talebinizi inceledik. Çıkış binanızda asansör olmadığı için araç üstü hidrolik asansörümüz ile yükleme yapmayı planlıyoruz. Fiyat teklifimizi ilettik.',
      time: '14:22'
    },
    {
      id: 'm2',
      sender: 'CUSTOMER',
      text: 'Teşekkürler Murat Bey. Mobilyaların söküm ve montajını da ekibiniz mi yapacak?',
      time: '14:25'
    },
    {
      id: 'm3',
      sender: 'CARRIER',
      text: 'Evet, ekibimizde uzman marangoz ustamız bulunmaktadır. Gardırop, yatak odası ve yemek masası montajı eksiksiz yapılır.',
      time: '14:28'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'CUSTOMER',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');

    // Simulate carrier reply after 1.5s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `reply_${Date.now()}`,
          sender: 'CARRIER',
          text: 'Mesajınız alındı. Taşıma saatini ve detayları netleştirmek için dilediğiniz zaman arayabilirsiniz.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px] flex">
        {/* Left: Carrier Conversations List */}
        <div className="w-full sm:w-80 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Mesajlaşmalar</h2>
            <p className="text-xs text-slate-500">Teklif veren firmalar</p>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {carriers.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCarrier(c)}
                className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                  selectedCarrier.id === c.id ? 'bg-[#EAF3FF]/80' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-[#146EF5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">{c.companyName}</span>
                    <span className="text-[10px] text-slate-400">14:28</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {c.id === selectedCarrier.id && messages.length > 0
                      ? messages[messages.length - 1].text
                      : 'Teklif detayları hakkında görüşme...'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          {/* Chat Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#146EF5] flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  {selectedCarrier.companyName}
                  <Badge variant="verified" size="sm" />
                </h3>
                <span className="text-xs text-slate-500">
                  Yetkili: {selectedCarrier.authorizedPersonName} • Çevrimiçi
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a href={`tel:${selectedCarrier.phone}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Telefonu Ara
                </Button>
              </a>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            <div className="text-center my-2">
              <span className="text-[11px] bg-slate-200/80 text-slate-600 px-3 py-1 rounded-full font-medium">
                Talep #26093 Konuşması
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'CUSTOMER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'CUSTOMER'
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

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
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

export default function CustomerMessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Yükleniyor...</div>}>
      <CustomerMessagesContent />
    </Suspense>
  );
}
