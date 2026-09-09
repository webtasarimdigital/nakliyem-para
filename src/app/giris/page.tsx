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
  ShieldCheck,
  BadgePercent,
  Clock,
  CheckCircle2,
  Sparkles,
  Truck,
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

  const urlEmail = searchParams.get('email') || '';
  const [email, setEmail] = useState(urlEmail);

  useEffect(() => {
    const pEmail = searchParams.get('email');
    if (pEmail) setEmail(pEmail);
  }, [searchParams]);

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

    // Kullanıcı popup'ı kapattı — sessizce iptal et
    if (!res.user) {
      return;
    }

    db.setCurrentUser(res.user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
    // Yönlendirme kararını kullanıcının Firestore'daki gerçek rolüne göre al
    if (res.user.role === 'CARRIER') {
      router.push('/app/carrier');
    } else {
      router.push('/app/customer');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

        {/* SOL BİLGİLENDİRİCİ PANEL - SADECE DESKTOP */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#111E38] via-[#172554] to-[#0f172a] p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden">
          {/* Arka plan dekoratif daireler */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Güvenilir Taşınma Portalı</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                Taşınmanın En Akıllı ve Hızlı Yolu
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                TaşınTeklif ile teklifleri anında karşılaştırın, onaylı nakliyecilerle güvenle taşının.
              </p>
            </div>

            {/* Avantaj Kartları */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0 text-[#F95700]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Doğrulanmış Firmalar</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    K1/K3 yetki belgesi, vergi levhası ve gerçek müşteri yorumları incelenmiş nakliyeciler.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Komisyonsuz Şeffaf Fiyat</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Gizli masraf yok. Firmalardan doğrudan net fiyat teklifleri alın ve tasarruf edin.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">2 Dakikada Hızlı Talep</h3>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Formu doldurun, telefon trafiğine girmeden ortalama 15 dakikada en iyi teklifleri toplayın.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Alt Güven & Sosyal Kanıt */}
          <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>45.000+ Başarılı Taşıma</span>
            </div>
            <div className="text-xs font-semibold text-orange-300">
              ★ 4.9/5 Memnuniyet
            </div>
          </div>
        </div>

        {/* SAĞ FORM PANELİ */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">

            {/* Logo ve Başlık */}
            <div className="flex flex-col items-center justify-center text-center space-y-2 mb-2">
              <Link href="/" className="inline-block group hover:scale-105 transition-transform">
                <img src="/images/logo.png" alt="TaşınTeklif" className="h-16 sm:h-20 w-auto object-contain mx-auto" />
              </Link>
              <p className="text-sm text-slate-500 font-medium">Hesabınıza giriş yapın</p>
            </div>

            {/* Rol Seçici Sekmeler (Pill Style) */}
            <div className="flex p-1 bg-slate-100 rounded-full">
              <button
                type="button"
                onClick={() => setTab('musteri')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  tab === 'musteri'
                    ? 'bg-[#111E38] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Müşteri Girişi
              </button>
              <button
                type="button"
                onClick={() => setTab('nakliyeci')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  tab === 'nakliyeci'
                    ? 'bg-[#111E38] text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Nakliyeci Girişi
              </button>
            </div>

            {/* Google ile Giriş Yap */}
            <button
              type="button"
              onClick={handleRealGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 hover:border-[#111E38]/30 bg-white text-slate-700 text-sm font-semibold transition-all cursor-pointer disabled:opacity-60 shadow-sm"
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
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">veya e-posta ile</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Şifre
                  </label>
                  <Link href="/sifremi-unuttum" className="text-xs font-semibold text-[#F95700] hover:underline">
                    Şifremi Unuttum?
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
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Alt Linkler */}
            <div className="pt-2 text-center space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Hesabın yok mu?{' '}
                <Link href="/kayit" className="text-[#F95700] font-bold hover:underline">
                  Ücretsiz Kayıt Ol
                </Link>
              </p>
            </div>

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
