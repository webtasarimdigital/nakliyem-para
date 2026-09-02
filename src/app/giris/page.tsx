'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  MessageSquare,
  MapPin,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
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
  const [slideIndex, setSlideIndex] = useState(0);

  // Google Modal State

  const isCarrier = tab === 'nakliyeci';

  const slides = [
    {
      badge: 'Şeffaf & Güvenli',
      title: 'Doğru fiyatı teklifleri kıyaslayarak belirleyin.',
      desc: 'Bölgenizdeki yetki belgeli nakliyat firmalarından dakikalar içinde fiyat alın, sürpriz maliyetleri unutun.',
      features: [
        'Onaylı ve Puanlı Nakliyeciler',
        'Komisyonsuz Doğrudan Anlaşma',
        'Sigortalı ve Asansörlü Taşıma',
      ],
    },
    {
      badge: 'Nakliyeciler İçin',
      title: 'Rotanızdaki yeni işleri ve dönüş yüklerini anında yakalayın.',
      desc: '81 ilden açılan ev ve ofis taşıma taleplerine anında teklif verin, boş dönüşlerinizi kâra dönüştürün.',
      features: [
        'Anlık Güzergah ve İş Alarmları',
        'Meslektaş Ağı: Nakliyeci Defteri',
        'Doğrulanmış Kurumsal Profil',
      ],
    },
  ];

  const currentSlide = slides[slideIndex];

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
      if (res.user.role === 'CARRIER' || isCarrier) {
        router.push('/app/carrier');
      } else {
        router.push('/app/customer');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-3 sm:p-6 lg:p-10">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-4xl shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80">
        
        {/* LEFT PANEL — Emlivo-inspired Soft & Elegant Visual Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#F4FDF7] via-[#F8FAFC] to-[#F1F5F9] p-6 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-100">
          
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A1128 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

          {/* Top Badge (Duplicate logo removed) */}
          <div className="relative z-10 flex items-center justify-end">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Güvenli Giriş
            </span>
          </div>

          {/* Center: Interactive Graphic Mockup (Emlivo style orbital network) */}
          <div className="relative z-10 my-8 sm:my-10">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
              
              {/* Outer Orbit Line */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-200/80 animate-[spin_60s_linear_infinite]" />

              {/* Center Image Card with verified check */}
              <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80"
                  alt="Taşınma"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs rounded-xl px-2 py-1 text-center shadow-xs">
                  <span className="text-[10px] font-black text-slate-800 block leading-tight">İstanbul → Ankara</span>
                  <span className="text-[9px] font-bold text-[#F95700]">3 Teklif Hazır</span>
                </div>
              </div>

              {/* Orbiting Badge 1: Location */}
              <div className="absolute top-2 left-8 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#F95700] flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>Kadıköy</span>
              </div>

              {/* Orbiting Badge 2: Verified Shield */}
              <div className="absolute bottom-3 right-6 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>K3 Belgeli</span>
              </div>

              {/* Orbiting Badge 3: Rating */}
              <div className="absolute top-6 right-4 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 flex items-center gap-1 text-xs font-black text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-slate-800 text-[11px]">4.9 Puan</span>
              </div>

              {/* Orbiting Badge 4: Chat */}
              <div className="absolute bottom-6 left-4 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Middle: Visual Interactive Card */}
          <div className="relative z-10 my-8">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Örnek Canlı Teklif</span>
                <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  En Uygun
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center font-black text-xs">
                    🚚
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#0A1128]">Boğaziçi Nakliyat</h4>
                    <div className="flex items-center text-amber-500 text-[10px] gap-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-slate-800">4.9</span>
                      <span className="text-slate-400">(128)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs line-through text-slate-400 block">28.000 TL</span>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">21.500 TL</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Kadıköy → Çankaya (3+1)</span>
                <span className="text-slate-400 font-medium">Sigorta & Asansör Dahil</span>
              </div>
            </div>

            {/* Slider Content */}
            <div className="mt-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#F95700] bg-orange-100/70 px-3 py-1 rounded-full border border-orange-200">
                <Sparkles className="w-3 h-3" />
                <span>{currentSlide.badge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                {currentSlide.desc}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {currentSlide.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlideIndex(0)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${slideIndex === 0 ? 'w-8 bg-[#F95700]' : 'w-4 bg-slate-300'}`}
              ></button>
              <button
                type="button"
                onClick={() => setSlideIndex(1)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${slideIndex === 1 ? 'w-8 bg-[#F95700]' : 'w-4 bg-slate-300'}`}
              ></button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Fresh White Clean Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          
          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">Giriş Yap</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Hesabınıza erişin, teklifleri ve operasyonunuzu yönetin.
              </p>
            </div>

            {/* Quick Google Sign In */}
            <button
              type="button"
              onClick={handleRealGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google ile Giriş Yap</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                veya e-posta ile
              </span>
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
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
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
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
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
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
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

              <div className="pt-2">
                <Link href="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  ← Ana sayfaya dön
                </Link>
              </div>
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
