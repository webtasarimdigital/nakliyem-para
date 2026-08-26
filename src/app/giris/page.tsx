'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('0535 234 56 78');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState<'CUSTOMER' | 'CARRIER' | 'ADMIN'>('CUSTOMER');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    db.switchPersona(role);
    if (role === 'CUSTOMER') router.push('/app/customer');
    else if (role === 'CARRIER') router.push('/app/carrier');
    else router.push('/admin');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding (Spec Item 151) */}
        <div className="bg-gradient-to-br from-[#0D1B2A] to-[#0B3B8F] p-8 md:p-10 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#146EF5] text-white flex items-center justify-center font-bold mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black mb-3">Tekrar Hoş Geldiniz</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Taşıma taleplerinizi yönetmek veya yeni iş teklifleri vermek için hesabınıza giriş yapın.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="flex items-center gap-2">✓ Güvenli ve şifreli giriş</p>
            <p className="flex items-center gap-2">✓ Canlı iş bildirimleri</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Giriş Yap</h1>
            <p className="text-xs text-slate-500 mb-6">Hesabınıza erişmek için bilgilerinizi girin.</p>

            {/* Quick Role Switcher for Demo */}
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setRole('CUSTOMER');
                  setIdentifier('0535 234 56 78');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  role === 'CUSTOMER' ? 'bg-white text-[#146EF5] shadow-xs' : 'text-slate-600'
                }`}
              >
                Müşteri
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('CARRIER');
                  setIdentifier('0532 890 12 34');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  role === 'CARRIER' ? 'bg-white text-[#146EF5] shadow-xs' : 'text-slate-600'
                }`}
              >
                Nakliyeci
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('ADMIN');
                  setIdentifier('admin@nakliyempara.com');
                }}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  role === 'ADMIN' ? 'bg-white text-[#146EF5] shadow-xs' : 'text-slate-600'
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefon / E-posta</label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Şifre</label>
                  <a href="#" className="text-xs text-[#146EF5] hover:underline">Şifremi Unuttum</a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
                Giriş Yap
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Hesabınız yok mu? <Link href="/kayit" className="text-[#146EF5] font-bold hover:underline">Ücretsiz Kayıt Olun</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
