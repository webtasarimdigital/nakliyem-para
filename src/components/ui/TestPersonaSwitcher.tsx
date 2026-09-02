'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Truck, Shield, ChevronUp, ChevronDown, Check } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

export const TestPersonaSwitcher: React.FC = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState('');

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
  }, []);

  const switchPersona = (role: 'CUSTOMER' | 'CARRIER' | 'ADMIN') => {
    if (role === 'CUSTOMER') {
      const u = {
        id: 'user_cust_1',
        email: 'omer@gmail.com',
        phone: '0532 555 0000',
        role: 'CUSTOMER' as const,
        createdAt: '2026-01-01T00:00:00Z'
      };
      db.setCurrentUser(u);
      setCurrentUser(u);
      setActiveMessage('Ömer Faruk (Müşteri) hesabına geçildi');
      router.push('/app/customer');
      router.refresh();
    } else if (role === 'CARRIER') {
      const u = {
        id: 'user_carr_1',
        email: 'mahmut@nakliyat.com',
        phone: '0532 555 0001',
        role: 'CARRIER' as const,
        carrierProfileId: 'c1',
        createdAt: '2026-01-01T00:00:00Z'
      };
      db.setCurrentUser(u);
      setCurrentUser(u);
      setActiveMessage('Mahmut Nakliyat (Firma) hesabına geçildi');
      router.push('/app/carrier');
      router.refresh();
    } else if (role === 'ADMIN') {
      setActiveMessage('Admin Paneline Yönlendiriliyor...');
      router.push('/admin');
    }

    setTimeout(() => setActiveMessage(''), 3000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans">
      {/* Toast */}
      {activeMessage && (
        <div className="mb-2 bg-[#0A1128] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-white/20 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{activeMessage}</span>
        </div>
      )}

      {/* Switcher Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-300/80 shadow-xl overflow-hidden transition-all duration-200">
        
        {/* Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 bg-slate-900 text-white text-xs font-bold flex items-center justify-between gap-3 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-wider">🧪 Test Modu</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span>{currentUser?.role === 'CARRIER' ? 'Mahmut (Nakliyeci)' : currentUser?.role === 'CUSTOMER' ? 'Ömer (Müşteri)' : 'Giriş Yapılmadı'}</span>
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Expanded Options */}
        {isOpen && (
          <div className="p-2 space-y-1.5 bg-slate-50 min-w-[240px]">
            <p className="text-[10px] text-slate-400 font-bold px-2 py-0.5 uppercase tracking-wider">
              1 Tıkla Hesap Değiştir
            </p>

            <button
              onClick={() => { switchPersona('CUSTOMER'); setIsOpen(false); }}
              className={'w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (currentUser?.role === 'CUSTOMER' ? 'bg-blue-100 text-blue-950 font-black' : 'bg-white text-slate-700 hover:bg-slate-100')}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>Ömer Faruk (Müşteri)</span>
              </div>
              {currentUser?.role === 'CUSTOMER' && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>

            <button
              onClick={() => { switchPersona('CARRIER'); setIsOpen(false); }}
              className={'w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ' + (currentUser?.role === 'CARRIER' ? 'bg-orange-100 text-orange-950 font-black' : 'bg-white text-slate-700 hover:bg-slate-100')}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#F95700] text-white flex items-center justify-center font-black text-[10px]">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span>Mahmut Nakliyat (Firma)</span>
              </div>
              {currentUser?.role === 'CARRIER' && <Check className="w-3.5 h-3.5 text-[#F95700]" />}
            </button>

            <button
              onClick={() => { switchPersona('ADMIN'); setIsOpen(false); }}
              className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center font-black text-[10px]">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>Admin Paneli (/admin)</span>
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
