'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CustomerNotificationsPage() {
  const notifications = [
    {
      id: 'n1',
      title: 'Boğaziçi Nakliyat Yeni Teklif Verdi',
      desc: 'İstanbul / Kadıköy → Ankara / Çankaya talebiniz için 24.500 TL fiyat teklifi iletildi.',
      time: '12 dakika önce',
      link: '/app/customer/teklifler',
      isUnread: true,
      icon: DollarSign,
      color: 'bg-blue-50 text-[#146EF5]'
    },
    {
      id: 'n2',
      title: 'Ege Güven Lojistik Mesaj Gönderdi',
      desc: '"Merhaba Ahmet Bey, mobilya montaj detaylarını netleştirmek için yazıyoruz..."',
      time: '1 saat önce',
      link: '/app/customer/mesajlar',
      isUnread: true,
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'n3',
      title: 'Taşınma Tarihiniz Yaklaşıyor',
      desc: '15 Eylül tarihindeki taşımanız için 3 gün kaldı. Lütfen nakliyeciniz ile teyitleşiniz.',
      time: 'Dün',
      link: '/app/customer/taleplerim',
      isUnread: false,
      icon: Calendar,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Bildirim Merkezi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gelen teklifler, mesajlar ve taşınma hatırlatmaları.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.link}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors block ${
                n.isUnread ? 'bg-[#EAF3FF]/40' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-sm ${n.isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {n.desc}
                </p>
              </div>

              {n.isUnread && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#146EF5] shrink-0 mt-2" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
