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
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { db } from '@/lib/data/mock-db';
import { useRouter } from 'next/navigation';

export default function CustomerProfilePage() {
  const router = useRouter();
  const user = db.getCurrentUser();
  const displayName = user?.fullName || (user as any)?.name || 'Hakan Yavaş';
  const nameParts = displayName.trim().split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || 'Hakan');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || 'Yavaş');
  const [phone, setPhone] = useState(user?.phone || '0535 234 56 78');
  const [email, setEmail] = useState(user?.email || 'hakan@example.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      db.setCurrentUser({
        ...user,
        fullName: `${firstName} ${lastName}`.trim(),
        phone,
        email
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    db.setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="settings" />
          </div>

          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                  Hesap Bilgilerim &amp; Ayarlar
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  İletişim ve bildirim tercihlerinizi yönetin.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-black text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
              </button>
            </div>

            {saved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Bilgileriniz başarıyla güncellendi.
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">Adınız</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">Soyadınız</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">Cep Telefonu Numarası</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">E-posta Adresi</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />} className="font-black text-xs px-6 py-2.5 rounded-xl shadow-md shadow-orange-900/20">
                  Bilgileri Kaydet
                </Button>
              </div>
            </form>
          </main>

        </div>
      </div>
    </div>
  );
}
