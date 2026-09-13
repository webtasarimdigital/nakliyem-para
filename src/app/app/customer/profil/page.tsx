'use client';

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Phone, 
  Mail, 
  Save, 
  Check, 
  ShieldCheck, 
  LogOut,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { db } from '@/lib/data/mock-db';
import { useAuth } from '@/context/AuthContext';
import { updateFirestoreUserProfile } from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(() => authUser || db.getCurrentUser());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync fields with user data
  useEffect(() => {
    const u = authUser || db.getCurrentUser();
    if (u) {
      setCurrentUser(u);
      const fullName = u.fullName || (u as any).name || '';
      const nameParts = fullName.trim().split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setPhone(u.phone || '');
      setEmail(u.email || '');
    }
  }, [authUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaved(false);

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Lütfen geçerli bir cep telefonu numarası giriniz (Örn: 05XX XXX XX XX).');
      return;
    }

    setLoading(true);

    const fullName = `${firstName} ${lastName}`.trim();
    const updatedUser = {
      ...(currentUser || {}),
      id: currentUser?.id || (currentUser as any)?.uid || `user_${Date.now()}`,
      email: email.trim(),
      fullName,
      phone: phone.trim(),
    };

    // 1. Update mock-db
    db.setCurrentUser(updatedUser as any);
    setCurrentUser(updatedUser as any);

    // 2. Update Firestore if configured
    const targetUid = currentUser?.id || (currentUser as any)?.uid;
    if (isFirebaseConfigured() && targetUid) {
      try {
        await updateFirestoreUserProfile(targetUid, {
          fullName,
          phone: phone.trim(),
        });
      } catch (err: any) {
        console.warn('Firestore profil güncelleme hatası:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new Event('storage'));
    }

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error:', err);
    }
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

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {saved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Bilgileriniz başarıyla kaydedildi.
              </div>
            )}

            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">Adınız</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Adınız"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">Soyadınız</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Soyadınız"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">
                    Cep Telefonu Numarası <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    Teklif veren yetkili nakliyecilerin size ulaşabilmesi için kullanılır.
                  </p>
                </div>

                <div>
                  <label className="block font-black text-[#0A1128] mb-1.5">E-posta Adresi</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      disabled
                      value={email}
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    Hesap güvenliği nedeniyle e-posta adresi değiştirilemez.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="md" 
                  isLoading={loading}
                  leftIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                  className="font-black text-xs px-6 py-2.5 rounded-xl shadow-md bg-[#F95700] hover:bg-[#E04D00]"
                >
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
