'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { registerWithFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';

const CUSTOMER_FEATURES = [
  { icon: MessageSquare, text: 'Onlarca firmadan teklif, tek panelde' },
  { icon: Star, text: 'Sigorta, asansör, paketleme — yan yana karşılaştır' },
  { icon: ShieldCheck, text: 'Onaylı ve puanlı nakliyeciler' },
  { icon: Bell, text: 'Taşıma gününe kadar adım adım takip' },
];

const CARRIER_FEATURES = [
  { icon: MapPin, text: 'Rotanıza eşleşen yeni iş bildirimleri' },
  { icon: Truck, text: 'Boş dönüş rotanızı doldurun' },
  { icon: MessageSquare, text: 'Meslektaşlarınızla Defter üzerinden bağlantı' },
  { icon: Bell, text: 'Takvim, müsaitlik ve operasyon merkezi' },
];

export default function KayitPage() {
  const router = useRouter();
  const [role, setRole] = useState<'musteri' | 'nakliyeci'>('musteri');
  const [step, setStep] = useState<'role' | 'form'>('role');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Carrier specific
  const [companyName, setCompanyName] = useState('');

  const isCarrier = role === 'nakliyeci';
  const features = isCarrier ? CARRIER_FEATURES : CUSTOMER_FEATURES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (isFirebaseConfigured()) {
      const res = await registerWithFirebase({
        email,
        password,
        phone,
        role: isCarrier ? 'CARRIER' : 'CUSTOMER',
        fullName: isCarrier ? undefined : name,
        companyName: isCarrier ? companyName : undefined,
      });

      setLoading(false);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        if (isCarrier) {
          router.push('/app/carrier/onboarding');
        } else {
          router.push('/app/customer');
        }
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        if (isCarrier) {
          router.push('/app/carrier/onboarding');
        } else {
          router.push('/app/customer');
        }
      }, 1000);
    }
  };

  const leftContent = {
    tag: isCarrier ? 'NAKLİYECİ' : 'MÜŞTERİ',
    title: isCarrier
      ? 'Rotanıza uygun işleri bulun, teklifinizi hemen verin.'
      : 'Taşınmanızı planlayın, en iyi teklifi seçin.',
    subtitle: isCarrier
      ? 'Operasyon merkeziniz, takvim ve boş dönüş optimizasyonu tek platformda.'
      : 'Talep açın, teklifleri yan yana karşılaştırın, güvenle taşıyın.',
    trust: isCarrier
      ? ['7 gün ücretsiz dene', 'İstediğin an iptal', '81 ilde kullanıcı']
      : ['Ücretsiz talep aç', 'Kredi kartı gerekmez', 'Güvenli ödeme'],
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] bg-[#0A1128] flex-col justify-between p-10 xl:p-14 relative overflow-hidden">
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid2" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F95700" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F95700] flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              nakliyem<span className="text-[#F95700]">.para</span>
            </span>
          </Link>
        </div>

        {/* Middle: Dynamic content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F95700]/20 border border-[#F95700]/30 text-[#F95700] text-xs font-black mb-4">
              {leftContent.tag}
            </div>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
              {leftContent.title}
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed text-base">
              {leftContent.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {features.map((f, i) => {
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
            {leftContent.trust.map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Check className="w-3.5 h-3.5 text-[#F95700]" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-xs text-slate-600 font-medium">
          Türkiye&apos;nin nakliyat platformu
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-sm">
          
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-[#F95700] flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg text-[#0A1128]">nakliyem<span className="text-[#F95700]">.para</span></span>
          </div>

          <h1 className="text-2xl font-black text-[#0A1128] mb-1">Hesap Oluştur</h1>
          <p className="text-sm text-slate-500 font-medium mb-6">
            Ücretsiz başla — dakikalar içinde hazır ol.
          </p>

          {/* Role Tabs */}
          <div className="flex gap-1 bg-slate-200 rounded-xl p-1 mb-6">
            <button
              onClick={() => setRole('musteri')}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${role === 'musteri' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Müşteri
            </button>
            <button
              onClick={() => setRole('nakliyeci')}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${role === 'nakliyeci' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Nakliyeci
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in">
                {errorMessage}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Mehmet Yılmaz"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
              />
            </div>

            {isCarrier && (
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Firma Adı
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Yılmaz Nakliyat"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Telefon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="05XX XXX XX XX"
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
              />
            </div>

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
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="En az 8 karakter"
                  required
                  minLength={8}
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
              <p className="text-[11px] text-slate-400 font-medium mt-1">En az 8 karakter</p>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#F95700] shrink-0"
                required
              />
              <span className="text-xs text-slate-500 font-medium leading-relaxed">
                <Link href="/kullanim-kosullari" target="_blank" rel="noopener noreferrer" className="text-[#F95700] font-bold hover:underline">Kullanım Koşulları</Link>
                {' '}ve{' '}
                <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="text-[#F95700] font-bold hover:underline">KVKK Aydınlatma Metni</Link>
                &apos;ni okudum, kabul ediyorum.
              </span>
            </label>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-black shadow-lg shadow-orange-900/15"
              disabled={loading || !agree}
              rightIcon={loading ? undefined : <ArrowRight className="w-4 h-4" />}
            >
              {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Zaten hesabınız var mı?{' '}
              <Link href="/giris" className="text-[#F95700] font-black hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>

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
