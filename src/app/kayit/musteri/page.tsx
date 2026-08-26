'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Hesabınız Başarıyla Oluşturuldu!</h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-8">
          Şimdi ilk taşınma talebinizi 2 dakika içinde oluşturarak onaylı firmalardan ücretsiz teklifler alabilirsiniz.
        </p>
        <Link href="/teklif-al">
          <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            İlk Taşıma Talebini Oluştur
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Müşteri Hesabı Açın</h1>
          <p className="text-xs text-slate-500">Ücretsiz nakliyat teklifleri almak için bilgilerinizi girin.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Adınız</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ahmet"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Soyadınız</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Yılmaz"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cep Telefonu Numaranız</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0532 000 00 00"
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">E-posta Adresiniz</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmet@example.com"
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Şifre Belirleyin</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
            Ücretsiz Kayıt Ol
          </Button>

          <p className="text-center text-xs text-slate-500">
            Zaten hesabınız var mı? <Link href="/giris" className="text-[#146EF5] font-bold hover:underline">Giriş Yap</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
