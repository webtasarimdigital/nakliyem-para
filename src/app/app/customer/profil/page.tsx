'use client';

import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Save, 
  Check, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

export default function CustomerProfilePage() {
  const user = db.getCurrentUser();
  const [firstName, setFirstName] = useState('Ahmet');
  const [lastName, setLastName] = useState('Yılmaz');
  const [phone, setPhone] = useState(user?.phone || '0535 234 56 78');
  const [email, setEmail] = useState(user?.email || 'ahmet@example.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Hesap Bilgilerim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            İletişim ve bildirim tercihlerinizi yönetin.
          </p>
        </div>

        <button
          onClick={() => db.switchPersona('GUEST')}
          className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg border border-red-200 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> Bilgileriniz başarıyla güncellendi.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Adınız</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Soyadınız</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cep Telefonu Numarası</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Bilgileri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
