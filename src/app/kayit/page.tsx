'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  ShieldCheck,
  BadgePercent,
  Truck,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { registerWithFirebase, loginWithGoogleFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { db } from '@/lib/data/mock-db';
import { validateEmailAddress } from '@/lib/validation/email';

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Carrier specific
  const [companyName, setCompanyName] = useState('');

  // ── OTP Email Doğrulama Durumu (3 Dakika Süreli) ──
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika = 180 saniye
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  // 3 Dakikalık Geri Sayım Sayacı
  useEffect(() => {
    if (step !== 'OTP') return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);

  // Tekrar Gönder bekleme süresi
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cooldownTimer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

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

  // 1. Adım: Form Bilgilerini Doğrulayıp 3 Dakikalık E-Posta Onay Kodu Gönderme
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOtpSuccessMsg('');

    if (isCarrier && !companyName.trim()) {
      setErrorMessage('Lütfen firma adınızı giriniz.');
      return;
    }

    if (!isCarrier && !name.trim()) {
      setErrorMessage('Lütfen ad ve soyadınızı giriniz.');
      return;
    }

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || 'Geçersiz e-posta adresi.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (!agree) {
      setErrorMessage('Lütfen Kullanım Koşulları ve Gizlilik Politikası\'nı onaylayınız.');
      return;
    }

    setLoading(true);

    try {
      // 3 dakikalık OTP kodu gönder
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: isCarrier ? companyName.trim() : name.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Doğrulama kodu gönderilemedi.');
        setLoading(false);
        return;
      }

      setStep('OTP');
      setTimeLeft(180); // 3 dakika = 180 saniye
      setResendCooldown(60);
      setOtpCode('');
      setOtpSuccessMsg(data.message || '6 haneli onay kodu e-posta adresinize gönderildi.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Sunucuyla iletişim kurulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Yeni Kod İste
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    setErrorMessage('');
    setOtpSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: isCarrier ? companyName.trim() : name.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Yeni kod gönderilemedi.');
      } else {
        setTimeLeft(180); // Süreyi 3 dakikaya sıfırla
        setResendCooldown(60);
        setOtpSuccessMsg('Yeni doğrulama kodu e-postanıza gönderildi.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Adım: OTP Kodunu Doğrulayıp Kaydı Tamamlama
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpCode.trim().length !== 6) {
      setErrorMessage('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.');
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage('Doğrulama kodunun 3 dakikalık süresi dolmuştur. Lütfen "Kodu Tekrar Gönder" butonuna basarak yeni bir kod isteyiniz.');
      return;
    }

    setLoading(true);

    try {
      // 1. Sunucu tarafında OTP kodunu ve süresini doğrula
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: otpCode.trim(),
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.verified) {
        setErrorMessage(verifyData.error || 'Doğrulama kodu hatalı veya süresi dolmuş.');
        setLoading(false);
        return;
      }

      // 2. Kod doğrulandı! Kullanıcıyı Firebase ve Mock DB'ye güvenle kaydet
      const newUserId = `user_${Date.now()}`;
      const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;

      // Save to mock db
      db.addRegisteredUser({
        id: newUserId,
        email,
        phone: '',
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
          companyName: companyName,
          slug: companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          authorizedPersonName: companyName,
          authorizedPersonSurname: '',
          phone: '',
          email,
          shortBio: 'TaşınTeklif onaylı nakliyat firması.',
          city: 'İstanbul',
          district: 'Kadıköy',
          services: ['evden-eve', 'ofis-tasima'],
          serviceAreas: ['TÜM_TÜRKİYE'],
          verificationStatus: 'APPROVED',
          verificationBadges: {
            identityVerified: true,
            taxVerified: true,
            transportPermitVerified: true,
            elevatorVerified: true,
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

      if (isFirebaseConfigured()) {
        const { user, error } = await registerWithFirebase({
          email,
          password,
          phone: '',
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          fullName: isCarrier ? undefined : name,
          companyName: isCarrier ? companyName : undefined,
        });

        if (error) {
          setErrorMessage(error);
          setLoading(false);
          return;
        }

        if (user) {
          db.setCurrentUser(user);
        }
      } else {
        db.setCurrentUser({
          id: newUserId,
          email,
          phone: '',
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          fullName: isCarrier ? undefined : name,
          companyName: isCarrier ? companyName : undefined,
          carrierProfileId: newCarrierId,
          createdAt: new Date().toISOString(),
        });
      }

      // Hoş geldin e-postasını gönder
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: isCarrier ? companyName : name,
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName : undefined,
        }),
      }).catch(err => console.warn('Welcome mail error:', err));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('storage'));
      }

      setLoading(false);

      if (isCarrier) {
        router.push('/app/carrier');
      } else {
        router.push('/app/customer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kayıt işlemi sırasında bir sorun oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-center justify-center py-6 sm:py-8 px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

        {/* SOL BİLGİLENDİRİCİ PANEL - SADECE DESKTOP */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#111E38] via-[#172554] to-[#0f172a] p-6 sm:p-8 text-white flex-col justify-between relative overflow-hidden">
          {/* Arka plan dekoratif daireler */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-300">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              <span>{isCarrier ? 'Taşıyıcı & Nakliyeci Portalı' : 'Hızlı & Güvenli Taşınma'}</span>
            </div>

            {/* Müşteri / Nakliyeci Dinamik Başlık */}
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {isCarrier ? 'İşinizi Büyütün, Boş Dönüş Yapmayın' : 'Ev Taşımanın En Kolay ve Güvenli Yolu'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isCarrier
                  ? 'Türkiye genelinde her gün yayınlanan yüzlerce ilana teklif verin, araçlarınızı her zaman dolu tutun.'
                  : 'Tek bir talep oluşturun, onaylı nakliyecilerden dakikalar içinde komisyonsuz en iyi teklifleri toplayın.'}
              </p>
            </div>

            {/* Avantaj Kartları */}
            <div className="space-y-2.5 pt-1">
              {isCarrier ? (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0 text-[#F95700]">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Dönüş Yükü Fırsatları</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Şehirlerarası boş seferlerinizi ilanlarla doldurarak yakıt ve zaman tasarrufu yapın.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Doğrudan Müşteri İletişimi</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Aracı komisyonu yok. Müşteriyle doğrudan anlaşın, ödemenizi kendi koşullarınızla alın.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">7 Gün Ücretsiz Deneme</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Hemen üye olun, taahhütsüz 7 gün boyunca tüm taşınma taleplerine anında teklif verin.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/30 flex items-center justify-center shrink-0 text-[#F95700]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">Doğrulanmış Firmalar</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        K3 yetki belgeli, vergi levhalı ve gerçek müşteri değerlendirmesi almış ekipler.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-400">
                      <BadgePercent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">%40'a Varan Fiyat Tasarrufu</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Rekabetçi canlı tekliflerle bütçenize en uygun taşınma fiyatını zahmetsizce yakalayın.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white">2 Dakikada Hızlı Başvuru</h3>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        Teklifleri SMS ve panel üzerinden karşılaştırın, dilediğiniz firmayla doğrudan el sıkışın.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Alt Güven & Sosyal Kanıt */}
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCarrier ? '1.200+ Aktif Nakliyeci' : '45.000+ Mutlu Müşteri'}</span>
            </div>
            <div className="font-semibold text-orange-300">
              {isCarrier ? 'Hızlı Onay Süreci' : '★ 4.9/5 Memnuniyet'}
            </div>
          </div>
        </div>

        {/* SAĞ FORM PANELİ */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-4">

            {/* Logo ve Başlık */}
            <div className="flex flex-col items-center justify-center text-center space-y-2 mb-2">
              <Link href="/" className="inline-block group hover:scale-105 transition-transform">
                <img src="/images/logo.png" alt="TaşınTeklif" className="h-16 sm:h-20 w-auto object-contain mx-auto" />
              </Link>
              <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
                {step === 'OTP' ? 'E-Posta Doğrulama' : 'Hesap Oluştur'}
              </h1>
            </div>

            {step === 'OTP' ? (
              <div className="space-y-4 animate-fade-in pt-2">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                    <Mail className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                    <strong className="text-[#111E38] font-bold">{email}</strong> adresinize 6 haneli bir güvenlik kodu gönderdik. Hesabınızı aktifleştirmek için lütfen kodu giriniz.
                  </p>
                </div>

                {/* 3-Dakika Geri Sayım Rozeti */}
                <div className="flex items-center justify-center">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-black tracking-wide transition-colors ${
                    timeLeft > 60
                      ? 'bg-orange-50 text-[#C23E00] border-orange-200'
                      : timeLeft > 0
                      ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {timeLeft > 0 
                        ? `Kalan Süre: ${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
                        : 'Süre Doldu (Yeni Kod İsteyiniz)'}
                    </span>
                  </div>
                </div>

                {/* Hata veya Bilgi Mesajı */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {otpSuccessMsg && !errorMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{otpSuccessMsg}</span>
                  </div>
                )}

                {/* OTP Giriş Formu */}
                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                      6 Haneli Doğrulama Kodu
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtpCode(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="• • • • • •"
                      className="w-full text-center text-2xl sm:text-3xl font-black tracking-[8px] py-3 px-4 rounded-xl border-2 border-slate-200 focus:border-[#F95700] focus:outline-none transition-colors text-[#111E38] bg-slate-50/50"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full font-bold shadow-lg shadow-orange-900/15"
                    disabled={loading || otpCode.length !== 6 || timeLeft <= 0}
                  >
                    {loading ? 'Doğrulanıyor...' : 'Doğrula ve Hesabı Aç'}
                  </Button>
                </form>

                {/* Yeniden Gönder & E-postayı Değiştir */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || resendCooldown > 0}
                    className={`font-bold transition-colors cursor-pointer ${
                      resendCooldown > 0
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-[#F95700] hover:text-[#E04D00]'
                    }`}
                  >
                    {resendCooldown > 0
                      ? `Kodu Tekrar Gönder (${resendCooldown}s)`
                      : 'Kodu Tekrar Gönder'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('FORM');
                      setErrorMessage('');
                      setOtpCode('');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    ← E-postayı / Bilgileri Değiştir
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Rol Seçici Sekmeler (Pill Style) */}
                <div className="flex p-1 bg-slate-100 rounded-full">
                  <button
                    type="button"
                    onClick={() => setRole('musteri')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      !isCarrier
                        ? 'bg-[#111E38] text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Müşteri Kaydı
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('nakliyeci')}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      isCarrier
                        ? 'bg-[#111E38] text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Nakliyeci Kaydı
                  </button>
                </div>

                {/* Google ile Kayıt Ol */}
                <button
                  type="button"
                  onClick={handleRealGoogleRegister}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-200 hover:border-[#111E38]/30 bg-white text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 shadow-sm"
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
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[11px] font-medium text-slate-400">veya e-posta ile</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleInitiateRegister} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Single Column Inputs for mobile */}
                  <div className="space-y-3">
                    {isCarrier ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Firma Adı (Ticari Ünvan)
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            placeholder="Boğaziçi Nakliyat Ltd. Şti."
                            required
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Ad Soyad
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ahmet Yılmaz"
                            required
                            className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}

                    {/* E-posta */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                          className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Şifre */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                          className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
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
                  </div>

                  {/* Sözleşme Onayı */}
                  <label className="flex items-start gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={e => setAgree(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#F95700] shrink-0 cursor-pointer rounded"
                      required
                    />
                    <span className="text-xs text-slate-500 font-medium leading-tight">
                      <Link href="/kullanim-kosullari" target="_blank" className="text-[#F95700] font-semibold hover:underline">
                        Kullanım Koşulları ve Gizlilik Politikası
                      </Link>'nı kabul ediyorum.
                    </span>
                  </label>

                  {/* Gönder Butonu */}
                  <button
                    type="submit"
                    disabled={loading || !agree}
                    className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 mt-2"
                  >
                    <span>{loading ? 'İşleniyor...' : 'Üye Ol'}</span>
                  </button>
                </form>

                {/* Alt Linkler */}
                <div className="pt-2 text-center space-y-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Zaten hesabın var mı?{' '}
                    <Link href="/giris" className="text-[#F95700] font-bold hover:underline">
                      Giriş Yap
                    </Link>
                  </p>
                </div>
              </>
            )}

          </div>
        </div>

      </div>
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
