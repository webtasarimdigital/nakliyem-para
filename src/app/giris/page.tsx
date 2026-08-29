'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShieldCheck,
  Truck,
  Star,
  MessageSquare,
  Bell,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { loginWithFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { db } from '@/lib/data/mock-db';

const LEFT_SLIDES = [
  {
    tag: 'MÜŞTERİ',
    title: 'Onlarca nakliyeciden teklif alın, en iyisini seçin.',
    subtitle: 'Talep açın, teklifleri yan yana karşılaştırın, güvenli taşıyın.',
    features: [
      { icon: MessageSquare, text: 'Onlarca firmadan teklif, tek panelde' },
      { icon: Star, text: 'Sigorta, asansör, paketleme — yan yana karşılaştır' },
      { icon: ShieldCheck, text: 'Onaylı ve puanlı nakliyeciler' },
      { icon: Bell, text: 'Taşıma gününe kadar adım adım takip' },
    ],
    trust: ['Ücretsiz talep aç', 'Kredi kartı gerekmez', 'Güvenli ödeme'],
  },
  {
    tag: 'NAKLİYECİ',
    title: 'Rotanıza uygun işleri bulun, teklifinizi hemen verin.',
    subtitle: 'Operasyon merkeziniz, takvim ve boş dönüş optimizasyonu tek platformda.',
    features: [
      { icon: MapPin, text: 'Rotanıza eşleşen yeni iş bildirimleri' },
      { icon: Truck, text: 'Boş dönüş rotanızı doldurun' },
      { icon: MessageSquare, text: 'Meslektaşlarınızla Defter üzerinden bağlantı' },
      { icon: Bell, text: 'Takvim, müsaitlik ve operasyon merkezi' },
    ],
    trust: ['7 gün ücretsiz dene', 'İstediğin an iptal', '81 ilde kullanıcı'],
  },
];

export default function GirisPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'musteri' | 'nakliyeci'>('musteri');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);

  const slide = LEFT_SLIDES[slideIndex];

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
        if (res.user?.role === 'CARRIER' || tab === 'nakliyeci') {
          router.push('/app/carrier');
        } else {
          router.push('/app/customer');
        }
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        if (tab === 'musteri') {
          router.push('/app/customer');
        } else {
          router.push('/app/carrier');
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-[#0A1128] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        
        {/* Subtle rota pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F95700" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F95700] flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">nakliyem<span className="text-[#F95700]">.para</span></span>
          </Link>
        </div>

        {/* Middle: Slide Content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F95700]/20 border border-[#F95700]/30 text-[#F95700] text-xs font-black mb-4">
              {slide.tag}
            </div>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
              {slide.title}
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed text-base">
              {slide.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {slide.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#F95700]/15 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#F95700]" />
                  </div>
                  <span className="text-sm font-medium text-slate-300">{f.text}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4">
            {slide.trust.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Check className="w-3.5 h-3.5 text-[#F95700]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Slide Nav */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setSlideIndex(0)}
            className={`w-2 h-2 rounded-full transition-all ${slideIndex === 0 ? 'bg-[#F95700] w-6' : 'bg-white/30'}`}
          />
          <button
            onClick={() => setSlideIndex(1)}
            className={`w-2 h-2 rounded-full transition-all ${slideIndex === 1 ? 'bg-[#F95700] w-6' : 'bg-white/30'}`}
          />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSlideIndex(prev => Math.min(LEFT_SLIDES.length - 1, prev + 1))}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 bg-[#F8FAFC]">
        <div className="w-full max-w-sm">
          
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#F95700] flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg text-[#0A1128]">nakliyem<span className="text-[#F95700]">.para</span></span>
          </div>

          <h1 className="text-2xl font-black text-[#0A1128] mb-1">Giriş Yap</h1>
          <p className="text-sm text-slate-500 font-medium mb-6">
            Hesabınıza erişin — dakikalar içinde devam edin.
          </p>

          {/* Role Tabs */}
          <div className="flex gap-1 bg-slate-200 rounded-xl p-1 mb-6">
            <button
              onClick={() => setTab('musteri')}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${tab === 'musteri' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Müşteri
            </button>
            <button
              onClick={() => setTab('nakliyeci')}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${tab === 'nakliyeci' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Nakliyeci
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
              />
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
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-black mt-2 shadow-lg shadow-orange-900/15"
              disabled={loading}
              rightIcon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Hesabınız yok mu?{' '}
              <Link href="/kayit" className="text-[#F95700] font-black hover:underline">
                Ücretsiz Kayıt Ol
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">Güvenli & Şifreli</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-400 leading-relaxed">
            Giriş yaparak{' '}
            <Link href="/kullanim-kosullari" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">Kullanım Koşulları</Link>
            {' '}ve{' '}
            <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">KVKK Aydınlatma Metni</Link>
            &apos;ni kabul etmiş olursunuz.
          </p>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors">
              ← Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
