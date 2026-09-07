'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
} from 'lucide-react';
import { loginWithFirebase, loginWithGoogleFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { db } from '@/lib/data/mock-db';

function GirisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role');
  const [tab, setTab] = useState<'musteri' | 'nakliyeci'>('musteri');

  useEffect(() => {
    if (urlRole === 'nakliyeci') {
      setTab('nakliyeci');
    } else if (urlRole === 'musteri') {
      setTab('musteri');
    }
  }, [urlRole]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isCarrier = tab === 'nakliyeci';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (isFirebaseConfigured()) {
      const res = await loginWithFirebase(email, password);
      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        if (res.user) {
          db.setCurrentUser(res.user);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
          }
        }
        if (res.user?.role === 'CARRIER' || tab === 'nakliyeci') {
          router.push('/app/carrier');
        } else {
          router.push('/app/customer');
        }
      }
    } else {
      const registeredUser = db.getRegisteredUserByEmail(email) || db.getUserByPhone(email);
      const userRole = (registeredUser?.role || (tab === 'nakliyeci' ? 'CARRIER' : 'CUSTOMER')) as 'CUSTOMER' | 'CARRIER';
      const user = {
        id: registeredUser?.id || (userRole === 'CARRIER' ? 'user_carr_1' : 'user_cust_1'),
        email: email || (userRole === 'CARRIER' ? 'mahmut@nakliyat.com' : 'omer@gmail.com'),
        phone: registeredUser?.phone || '0532 555 00 00',
        role: userRole,
        fullName: registeredUser?.fullName || (userRole === 'CUSTOMER' ? 'Ömer Faruk' : undefined),
        companyName: registeredUser?.companyName || (userRole === 'CARRIER' ? 'Mahmut Nakliyat' : undefined),
        carrierProfileId: userRole === 'CARRIER' ? (registeredUser?.carrierId || 'c1') : undefined,
        createdAt: registeredUser?.createdAt || new Date().toISOString()
      };
      db.setCurrentUser(user);

      setTimeout(() => {
        setLoading(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-changed'));
        }
        if (userRole === 'CARRIER') {
          router.push('/app/carrier');
        } else {
          router.push('/app/customer');
        }
      }, 500);
    }
  };

  const handleRealGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    const targetRole = isCarrier ? 'CARRIER' : 'CUSTOMER';
    const res = await loginWithGoogleFirebase(targetRole);
    setLoading(false);
    if (res.error) {
      setErrorMessage(res.error);
      return;
    }
    if (res.user) {
      db.setCurrentUser(res.user);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }
      if (res.user.role === 'CARRIER' || isCarrier) {
        router.push('/app/carrier');
      } else {
        router.push('/app/customer');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">Giriş Yap</h1>
          <p className="text-sm text-slate-500 font-medium mt-1.5">
            Hesabınıza erişin, teklifleri ve operasyonunuzu yönetin.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/60 p-6 sm:p-8">

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleRealGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-[#F95700]/40 bg-white hover:bg-orange-50/30 text-slate-700 text-sm font-bold transition-all cursor-pointer mb-5 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google ile Giriş Yap</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">veya e-posta ile</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Role Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => setTab('musteri')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                tab === 'musteri'
                  ? 'bg-white text-[#0A1128] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Evimi Taşıtacağım
            </button>
            <button
              type="button"
              onClick={() => setTab('nakliyeci')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                tab === 'nakliyeci'
                  ? 'bg-white text-[#0A1128] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Nakliyeciyim
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-[#0A1128] uppercase tracking-wider">
                  Şifre
                </label>
                <Link href="/sifremi-unuttum" className="text-xs font-bold text-[#F95700] hover:underline">
                  Şifremi Unuttum
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Henüz hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-[#F95700] font-black hover:underline">
                Ücretsiz Kayıt Ol
              </Link>
            </p>
            <Link href="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors block">
              ← Ana sayfaya dön
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center font-bold text-slate-500">Yükleniyor...</div>}>
      <GirisContent />
    </Suspense>
  );
}
