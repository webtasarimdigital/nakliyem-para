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
  User,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { registerWithFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { db } from '@/lib/data/mock-db';

function KayitContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlRole = searchParams.get('role');
  const [role, setRole] = useState<'musteri' | 'nakliyeci'>('musteri');

  useEffect(() => {
    if (urlRole === 'nakliyeci') {
      setRole('nakliyeci');
    } else if (urlRole === 'musteri') {
      setRole('musteri');
    }
  }, [urlRole]);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Simulation (Code 61) & Duplicate Check
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [phoneAlreadyRegistered, setPhoneAlreadyRegistered] = useState(false);

  // Google Sign In Modal
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState('');

  // Carrier specific
  const [companyName, setCompanyName] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);

  const isCarrier = role === 'nakliyeci';

  const slides = [
    {
      badge: isCarrier ? 'Nakliyeci Ağı' : 'Müşteri Memnuniyeti',
      title: isCarrier
        ? 'Rotanıza uygun işleri bulun, boş dönüşleri doldurun.'
        : 'Doğru fiyatı veriyle ve tekliflerle belirleyin.',
      desc: isCarrier
        ? '7 gün ücretsiz deneyin, 81 ilden gelen doğrulanmış ev ve ofis taşıma taleplerine anında teklif verin.'
        : 'Ücretsiz talep açın, bölgenizdeki puanlı nakliyecilerden komisyonsuz doğrudan teklif toplayın.',
      features: isCarrier
        ? ['7 Gün Ücretsiz Gold Deneme', 'Boş Dönüş ve Parsiyel İlanları', 'Meslektaş Ağı: Nakliyeci Defteri']
        : ['%100 Ücretsiz Talep Açma', 'Onaylı & Puanlı Nakliyeciler', 'Sigortalı ve Asansörlü Seçenekler'],
    },
    {
      badge: 'Yüksek Güvenlik',
      title: 'K3 Belgeli ve onaylı firmalar tek çatı altında.',
      desc: 'Tüm taşımacılar resmi evrak ve yetki belgesi onayından geçer. KVKK uyumlu güvenli iletişim.',
      features: ['Sözleşmeli ve Sigortalı', 'Şeffaf Fiyatlandırma', 'Canlı Destek & Takip'],
    },
  ];

  const currentSlide = slides[slideIndex];

  // Adım 1: Form Gönderildiğinde Numara Kontrolü & SMS Modalını Aç
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPhoneAlreadyRegistered(false);

    // Telefon daha önce kayıtlı mı kontrolü
    const existing = db.getUserByPhone(phone);
    if (existing) {
      setPhoneAlreadyRegistered(true);
      setErrorMessage('Bu telefon numarasına ait bir üyelik zaten bulunmaktadır.');
      return;
    }

    // Telefon yeni ise SMS onay modalını aç
    setOtpModalOpen(true);
  };

  // Google ile Gerçekçi Giriş / Kayıt
  const handleGoogleAuthSelect = (selectedName: string, selectedEmail: string) => {
    setLoading(true);
    const newUserId = `user_g_${Date.now()}`;
    const newCarrierId = isCarrier ? `carr_g_${Date.now()}` : undefined;

    db.addRegisteredUser({
      id: newUserId,
      email: selectedEmail,
      phone: '0532 555 00 00',
      role: isCarrier ? 'CARRIER' : 'CUSTOMER',
      fullName: isCarrier ? undefined : selectedName,
      companyName: isCarrier ? selectedName : undefined,
      carrierId: newCarrierId,
      createdAt: new Date().toISOString(),
    });

    if (isCarrier) {
      db.addCarrier({
        id: newCarrierId!,
        userId: newUserId,
        companyName: selectedName,
        slug: selectedName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        authorizedPersonName: selectedName.split(' ')[0] || selectedName,
        authorizedPersonSurname: selectedName.split(' ').slice(1).join(' ') || '',
        phone: '0532 555 00 00',
        email: selectedEmail,
        shortBio: 'Google ile kaydolan kurumsal nakliyat firması.',
        city: 'İstanbul',
        district: 'Kadıköy',
        services: ['evden-eve', 'ofis-tasima'],
        serviceAreas: ['TÜM_TÜRKİYE'],
        verificationStatus: 'PENDING',
        verificationBadges: {
          identityVerified: false,
          taxVerified: false,
          transportPermitVerified: false,
          elevatorVerified: false,
        },
        planId: 'plan_starter',
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        responseRatePercent: 100,
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    db.setCurrentUser({
      id: newUserId,
      email: selectedEmail,
      phone: '0532 555 00 00',
      role: isCarrier ? 'CARRIER' : 'CUSTOMER',
      carrierProfileId: newCarrierId,
      createdAt: new Date().toISOString(),
    });

    setGoogleModalOpen(false);
    setLoading(false);

    if (isCarrier) {
      router.push('/app/carrier');
    } else {
      router.push('/app/customer');
    }
  };

  // Adım 2: SMS Kodunu Doğrula ve Üyeliği Tamamla
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    const trimmed = otpCode.trim();
    // 61, 616161 veya 61 ile başlayan kodları kabul et
    if (trimmed !== '61' && !trimmed.startsWith('61') && trimmed !== '616161') {
      setOtpError('Girdiğiniz onay kodu hatalı veya süresi dolmuş. Lütfen tekrar deneyin.');
      return;
    }

    setLoading(true);

    // Mock-DB'ye kullanıcıyı ekle
    const newUserId = `user_${Date.now()}`;
    const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;

    db.addRegisteredUser({
      id: newUserId,
      email,
      phone,
      password,
      role: isCarrier ? 'CARRIER' : 'CUSTOMER',
      fullName: isCarrier ? undefined : name,
      companyName: isCarrier ? companyName : undefined,
      carrierId: newCarrierId,
      createdAt: new Date().toISOString(),
    });

    // Eğer nakliyeci ise onay bekleyen yeni firma profili oluştur
    if (isCarrier) {
      db.addCarrier({
        id: newCarrierId!,
        userId: newUserId,
        companyName: companyName || name,
        slug: (companyName || name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        authorizedPersonName: name.split(' ')[0] || name,
        authorizedPersonSurname: name.split(' ').slice(1).join(' ') || '',
        phone,
        email,
        shortBio: 'Yeni kayıt olan nakliyat firması. Belgeler inceleniyor.',
        city: 'İstanbul',
        district: 'Kadıköy',
        services: ['evden-eve', 'ofis-tasima'],
        serviceAreas: ['TÜM_TÜRKİYE'],
        verificationStatus: 'PENDING', // Admin onayı bekleyecek
        verificationBadges: {
          identityVerified: false,
          taxVerified: false,
          transportPermitVerified: false,
          elevatorVerified: false,
        },
        planId: 'plan_starter',
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        responseRatePercent: 100,
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      // Varsayılan mock evrakları ekle (Kimlik ve Vergi Levhası)
      db.addDocument({
        id: `doc_id_${Date.now()}`,
        carrierId: newCarrierId!,
        type: 'IDENTITY',
        title: 'Yetkili Kimlik Belgesi',
        fileName: 'kimlik_on_yuz.jpg',
        fileUrl: '/mock-files/kimlik.jpg',
        status: 'PENDING',
        uploadedAt: new Date().toISOString(),
      });

      db.addDocument({
        id: `doc_tax_${Date.now()}`,
        carrierId: newCarrierId!,
        type: 'TAX_CERTIFICATE',
        title: 'Vergi Levhası Belgesi',
        fileName: 'vergi_levhasi.pdf',
        fileUrl: '/mock-files/vergi_levhasi.pdf',
        status: 'PENDING',
        uploadedAt: new Date().toISOString(),
      });
    }

    // Firebase Auth Entegrasyonu (varsa)
    if (isFirebaseConfigured()) {
      await registerWithFirebase({
        email,
        password,
        phone,
        role: isCarrier ? 'CARRIER' : 'CUSTOMER',
        fullName: isCarrier ? undefined : name,
        companyName: isCarrier ? companyName : undefined,
      });
    }

    // Persona ve oturumu ayarla
    db.setCurrentUser({
      id: newUserId,
      email,
      phone,
      role: isCarrier ? 'CARRIER' : 'CUSTOMER',
      carrierProfileId: newCarrierId,
      createdAt: new Date().toISOString(),
    });

    setLoading(false);
    setOtpModalOpen(false);

    if (isCarrier) {
      router.push('/app/carrier');
    } else {
      router.push('/app/customer');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-3 sm:p-6 lg:p-10">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl sm:rounded-4xl shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80">
        
        {/* LEFT PANEL — Emlivo Style Soft & Light Visual Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#F4FDF7] via-[#F8FAFC] to-[#F1F5F9] p-6 sm:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-100">
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A1128 1px, transparent 1px)', backgroundSize: '18px 18px' }} />

          {/* Top: Logo */}
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F95700] flex items-center justify-center shadow-md shadow-orange-900/20">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl text-[#0A1128] tracking-tight">
                nakliyem<span className="text-[#F95700]">.para</span>
              </span>
            </Link>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Hızlı Kayıt
            </span>
          </div>

          {/* Center: Interactive Orbital Graphic (Emlivo visual mockup) */}
          <div className="relative z-10 my-8 sm:my-10">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
              
              {/* Orbital Ring */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-emerald-200/80 animate-[spin_55s_linear_infinite]" />

              {/* Center Photo */}
              <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <img
                  src={
                    isCarrier
                      ? 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80'
                  }
                  alt="Nakliye ve Taşınma"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs rounded-xl px-2 py-1 text-center shadow-xs">
                  <span className="text-[10px] font-black text-slate-800 block leading-tight">
                    {isCarrier ? '81 İl Nakliye Ağı' : 'En İyi Fiyat Garantisi'}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-600">✓ Onaylı Sistem</span>
                </div>
              </div>

              {/* Orbital Badge 1 */}
              <div className="absolute top-2 left-8 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Güvenli</span>
              </div>

              {/* Orbital Badge 2 */}
              <div className="absolute bottom-3 right-6 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#F95700] flex items-center justify-center">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <span>Şeffaf Teklif</span>
              </div>

              {/* Orbital Badge 3 */}
              <div className="absolute top-6 right-4 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 text-blue-600">
                <MessageSquare className="w-4 h-4" />
              </div>

              {/* Orbital Badge 4 */}
              <div className="absolute bottom-6 left-4 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 text-[#F95700]">
                <Truck className="w-4 h-4" />
              </div>
            </div>

            {/* Slider Content */}
            <div className="text-center sm:text-left mt-4">
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider bg-emerald-100/70 px-2.5 py-0.5 rounded-full inline-block mb-2">
                {currentSlide.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] leading-snug">
                {currentSlide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                {currentSlide.desc}
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
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
          <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSlideIndex(0)}
                className={`h-2 rounded-full transition-all cursor-pointer ${slideIndex === 0 ? 'w-6 bg-[#F95700]' : 'w-2 bg-slate-300'}`}
              />
              <button
                type="button"
                onClick={() => setSlideIndex(1)}
                className={`h-2 rounded-full transition-all cursor-pointer ${slideIndex === 1 ? 'w-6 bg-[#F95700]' : 'w-2 bg-slate-300'}`}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSlideIndex(s => (s === 0 ? 1 : 0))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSlideIndex(s => (s === 1 ? 0 : 1))}
                className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Fresh White Clean Registration Form */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">Kayıt Ol</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {isCarrier ? 'Nakliyeci profilinizi oluşturun, iş teklifleri verin.' : 'Ücretsiz başlayın — dakikalar içinde teklif toplayın.'}
              </p>
            </div>

            {/* Quick Google Sign In */}
            <button
              type="button"
              onClick={() => setGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google ile Kayıt Ol</span>
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
                onClick={() => setRole('musteri')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  !isCarrier
                    ? 'bg-white text-[#0A1128] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Evimi Taşıtacağım
              </button>
              <button
                type="button"
                onClick={() => setRole('nakliyeci')}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  isCarrier
                    ? 'bg-white text-[#0A1128] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Nakliyeciyim
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  {phoneAlreadyRegistered && (
                    <div className="pt-2 border-t border-red-200/80 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Şifrenizi hatırlamıyor musunuz?</span>
                      <Link href={`/sifremi-unuttum`}>
                        <button
                          type="button"
                          className="bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Şifremi Sıfırla
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Name / Company */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {isCarrier ? 'Firma Yetkilisi / Ad Soyad' : 'Ad Soyad'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    required
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Name if Carrier */}
              {isCarrier && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Firma Adı (Ticari Ünvan)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="Boğaziçi Profesyonel Nakliyat"
                      required
                      className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Telefon Numarası
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    required
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
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
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    required
                    minLength={6}
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
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

              {/* Agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#F95700] shrink-0 cursor-pointer"
                  required
                />
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed">
                  <Link href="/kullanim-kosullari" target="_blank" className="text-[#F95700] font-bold hover:underline">
                    Kullanım Koşulları
                  </Link>
                  {' '}ve{' '}
                  <Link href="/kvkk" target="_blank" className="text-[#F95700] font-bold hover:underline">
                    KVKK Aydınlatma Metni
                  </Link>
                  &apos;ni okudum, kabul ediyorum.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !agree}
                className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-5 text-center space-y-2.5">
              <p className="text-xs text-slate-500 font-medium">
                Zaten bir hesabınız var mı?{' '}
                <Link href="/giris" className="text-[#F95700] font-black hover:underline">
                  Giriş Yap
                </Link>
              </p>

              <div>
                <Link href="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  ← Ana sayfaya dön
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── SMS DOĞRULAMA MODALI ── */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0A1128]">SMS Doğrulama Kodu</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Güvenliğiniz için <strong className="text-slate-900">{phone}</strong> numaralı telefonunuza 6 haneli SMS onay kodu gönderildi. Lütfen kodu giriniz.
              </p>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  6 Haneli Onay Kodu
                </label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  placeholder="• • • • • •"
                  required
                  maxLength={6}
                  autoFocus
                  className="w-full text-center text-2xl font-black tracking-widest border-2 border-slate-200 rounded-xl py-3 text-slate-900 placeholder:text-slate-300 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpModalOpen(false)}
                  className="flex-1 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{loading ? 'Onaylanıyor...' : 'Onayla ve Kayıt Ol'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── GOOGLE HESAP SEÇİM MODALI ── */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-bold text-sm text-slate-800">Google ile Devam Et</span>
              </div>
              <button onClick={() => setGoogleModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              <strong>nakliyem.para</strong> platformuna {isCarrier ? 'Nakliyeci' : 'Müşteri'} olarak bağlanmak için bir hesap seçin:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleAuthSelect(isCarrier ? 'Boğaziçi Profesyonel Nakliyat' : 'Ömer Faruk', isCarrier ? 'bogazici@gmail.com' : 'omerfaruk@gmail.com')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {isCarrier ? 'B' : 'Ö'}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 block truncate">{isCarrier ? 'Boğaziçi Nakliyat' : 'Ömer Faruk'}</span>
                  <span className="text-[11px] text-slate-400 truncate">{isCarrier ? 'bogazici@gmail.com' : 'omerfaruk@gmail.com'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleAuthSelect(isCarrier ? 'Mahmut Nakliyat A.Ş.' : 'Mahmut Demir', isCarrier ? 'mahmut.nakliyat@gmail.com' : 'mahmutdemir@gmail.com')}
                className="w-full p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  M
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-900 block truncate">{isCarrier ? 'Mahmut Nakliyat A.Ş.' : 'Mahmut Demir'}</span>
                  <span className="text-[11px] text-slate-400 truncate">{isCarrier ? 'mahmut.nakliyat@gmail.com' : 'mahmutdemir@gmail.com'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function KayitPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center font-bold text-slate-500">Yükleniyor...</div>}>
      <KayitContent />
    </Suspense>
  );
}
