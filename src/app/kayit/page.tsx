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
  User,
  Phone,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { registerWithFirebase, loginWithGoogleFirebase } from '@/lib/firebase/auth';
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

  // OTP Simulation
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [phoneAlreadyRegistered, setPhoneAlreadyRegistered] = useState(false);

  // Carrier specific
  const [companyName, setCompanyName] = useState('');

  const isCarrier = role === 'nakliyeci';

  // Google ile Gerçekçi Kayıt
  const handleRealGoogleRegister = async () => {
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

  // Adım 1: Form Gönderildiğinde Numara Kontrolü & SMS Modalını Aç
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setPhoneAlreadyRegistered(false);

    const existing = db.getUserByPhone(phone);
    if (existing) {
      setPhoneAlreadyRegistered(true);
      setErrorMessage('Bu telefon numarasına ait bir üyelik zaten bulunmaktadır.');
      return;
    }

    setOtpModalOpen(true);
  };

  // Adım 2: SMS Kodunu Doğrula ve Üyeliği Tamamla
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');

    const trimmed = otpCode.trim();
    if (trimmed !== '61' && !trimmed.startsWith('61') && trimmed !== '616161') {
      setOtpError('Girdiğiniz onay kodu hatalı veya süresi dolmuş. Lütfen tekrar deneyin.');
      return;
    }

    setLoading(true);

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

    db.setCurrentUser({
      id: newUserId,
      email,
      phone,
      role: isCarrier ? 'CARRIER' : 'CUSTOMER',
      carrierProfileId: newCarrierId,
      createdAt: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }

    setLoading(false);
    setOtpModalOpen(false);

    if (isCarrier) {
      router.push('/app/carrier');
    } else {
      router.push('/app/customer');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">

        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">Hesap Oluştur</h1>
          <p className="text-sm text-slate-500 font-medium mt-1.5">
            {isCarrier ? 'Nakliyeci profilinizi oluşturun, iş teklifleri verin.' : 'Ücretsiz başlayın — dakikalar içinde teklif toplayın.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/60 p-6 sm:p-8">

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleRealGoogleRegister}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-[#F95700]/40 bg-white hover:bg-orange-50/30 text-slate-700 text-sm font-bold transition-all cursor-pointer mb-5 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google ile Kayıt Ol</span>
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
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {phoneAlreadyRegistered && (
                  <div className="pt-2 border-t border-red-200/80 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Şifrenizi hatırlamıyor musunuz?</span>
                    <Link href="/sifremi-unuttum">
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

            {/* Name */}
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1">
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
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Company Name if Carrier */}
            {isCarrier && (
              <div>
                <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1">
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
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1">
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
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1">
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
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1">
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
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-2.5 sm:py-3 text-sm font-medium text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
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
            <Link href="/" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors block">
              ← Ana sayfaya dön
            </Link>
          </div>

        </div>
      </div>

      {/* ── SMS DOĞRULAMA MODALI ── */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A1128]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#0A1128]">SMS Doğrulama Kodu</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Güvenliğiniz için <strong className="text-[#0A1128]">{phone}</strong> numaralı telefonunuza 6 haneli SMS onay kodu gönderildi. Lütfen kodu giriniz.
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
                <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5 text-center">
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
                  className="w-full text-center text-2xl font-black tracking-widest border-2 border-slate-200 rounded-xl py-3 text-[#0A1128] placeholder:text-slate-300 focus:border-[#F95700] focus:outline-none transition-colors"
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
