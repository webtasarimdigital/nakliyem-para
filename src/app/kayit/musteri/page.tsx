'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, ArrowRight, ShieldCheck, CheckCircle2, Phone, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    db.setCurrentUser({
      id: `user_cust_${Date.now()}`,
      email: email || `${phone}@musteri.com`,
      phone,
      role: 'CUSTOMER',
      customerProfileId: `cust_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl font-black text-[#0A1128] mb-2">Hesabınız Başarıyla Oluşturuldu!</h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium mb-8">
          Şimdi ilk taşınma talebinizi 2 dakika içinde oluşturarak onaylı firmalardan ücretsiz teklifler alabilirsiniz.
        </p>
        <Link href="/teklif-al">
          <Button variant="primary" size="lg" className="w-full font-black text-base shadow-lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
            İlk Taşıma Talebini Oluştur
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-8 sm:p-10 shadow-xl space-y-6">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center font-bold mb-4">
            <UserCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Müşteri Hesabı Açın</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Ücretsiz nakliyat teklifleri almak için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">Adınız</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ahmet"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-sm font-bold bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">Soyadınız</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Yılmaz"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-sm font-bold bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">Cep Telefonu Numaranız</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0532 000 00 00"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-sm font-bold bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">E-posta Adresiniz</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmet@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-sm font-bold bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">Şifre Belirleyin</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-sm font-bold bg-white text-slate-900"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full font-black text-base shadow-md mt-2">
            Ücretsiz Kayıt Ol
          </Button>

          <p className="text-center text-xs text-slate-500 font-medium pt-2">
            Zaten hesabınız var mı?{' '}
            <Link href="/giris?role=customer" className="text-[#F95700] font-black hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
