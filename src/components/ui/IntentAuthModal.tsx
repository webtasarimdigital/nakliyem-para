'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { db } from '@/lib/data/mock-db';
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  Clock,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginWithGoogleFirebase, loginWithFirebase, registerWithFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { validateEmailAddress } from '@/lib/validation/email';

export interface IntentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'CUSTOMER' | 'CARRIER';
  title?: string;
  subtitle?: string;
  onSuccess?: (user?: any) => void;
}

export const IntentAuthModal: React.FC<IntentAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'CUSTOMER',
  title,
  subtitle,
  onSuccess
}) => {
  const router = useRouter();
  const [tab, setTab] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ── OTP State (3 Dakika Süreli Kod) ──
  const [registerStep, setRegisterStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika = 180 sn
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  const isCarrier = targetRole === 'CARRIER';

  // 3 Dakikalık Geri Sayım Sayacı
  useEffect(() => {
    if (!isOpen || tab !== 'REGISTER' || registerStep !== 'OTP') return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, tab, registerStep, timeLeft]);

  // Resend Cooldown Sayacı
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const cooldownTimer = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(cooldownTimer);
  }, [resendCooldown]);

  const handleModalClose = () => {
    setRegisterStep('FORM');
    setOtpCode('');
    setErrorMessage('');
    setOtpSuccessMsg('');
    onClose();
  };

  // Google Login / Register
  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setGoogleLoading(true);

    try {
      if (isFirebaseConfigured()) {
        const res = await loginWithGoogleFirebase(targetRole);
        if (res.error) {
          setErrorMessage(res.error);
          setGoogleLoading(false);
          return;
        }
        if (res.user) {
          db.setCurrentUser(res.user);
        } else {
          // User closed popup
          setGoogleLoading(false);
          return;
        }
      } else {
        // Mock fallback Google login
        const newUserId = `user_google_${Date.now()}`;
        const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;
        const mockGoogleUser = {
          id: newUserId,
          email: 'google.hesabi@gmail.com',
          fullName: isCarrier ? undefined : 'Google Kullanıcısı',
          companyName: isCarrier ? 'Google Onaylı Nakliyat' : undefined,
          phone: '',
          role: targetRole,
          carrierProfileId: newCarrierId,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };

        if (isCarrier) {
          db.addCarrier({
            id: newCarrierId!,
            userId: newUserId,
            companyName: 'Google Onaylı Nakliyat',
            slug: 'google-onayli-nakliyat',
            authorizedPersonName: 'Firma Yetkilisi',
            authorizedPersonSurname: '',
            phone: '',
            email: 'google.hesabi@gmail.com',
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

        db.setCurrentUser(mockGoogleUser);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }

      setGoogleLoading(false);
      handleModalClose();

      const loggedInUser = db.getCurrentUser();
      if (onSuccess) {
        onSuccess(loggedInUser);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Google auth error in modal:', err);
      setErrorMessage(err?.message || 'Google ile giriş sırasında bir sorun oluştu.');
      setGoogleLoading(false);
    }
  };

  // 1. Adım: Kayıt Öncesi OTP Kodu Gönderme
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOtpSuccessMsg('');

    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage(isCarrier ? 'Lütfen firma adınızı giriniz.' : 'Lütfen adınızı ve soyadınızı giriniz.');
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

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: cleanName,
          role: targetRole,
          companyName: isCarrier ? cleanName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Doğrulama kodu gönderilemedi.');
        setIsLoading(false);
        return;
      }

      setRegisterStep('OTP');
      setTimeLeft(180); // 3 dakika = 180 saniye
      setResendCooldown(60);
      setOtpCode('');
      setOtpSuccessMsg(data.message || '6 haneli onay kodu e-posta adresinize gönderildi.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Sunucuyla iletişim kurulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Tekrar Gönder
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage('');
    setOtpSuccessMsg('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          role: targetRole,
          companyName: isCarrier ? name.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Yeni kod gönderilemedi.');
      } else {
        setTimeLeft(180);
        setResendCooldown(60);
        setOtpSuccessMsg('Yeni doğrulama kodu e-postanıza gönderildi.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Bağlantı hatası oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Adım: OTP Kodunu Doğrulayıp Kaydı Tamamlama
  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otpCode.trim().length !== 6) {
      setErrorMessage('Lütfen 6 haneli doğrulama kodunu eksiksiz giriniz.');
      return;
    }

    if (timeLeft <= 0) {
      setErrorMessage('Doğrulama kodunun 3 dakikalık süresi dolmuştur. Lütfen yeni bir kod isteyiniz.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Sunucu tarafında OTP kodunu ve 3 dakikalık süresini doğrula
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
        setIsLoading(false);
        return;
      }

      // 2. Kod doğrulandı! Firebase / Mock DB kaydı
      const cleanName = name.trim() || (isCarrier ? 'Nakliyat Firması' : 'Değerli Müşterimiz');
      const newUserId = `user_${Date.now()}`;
      const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;

      if (isFirebaseConfigured()) {
        const res = await registerWithFirebase({
          email,
          password,
          role: targetRole,
          fullName: !isCarrier ? cleanName : undefined,
          companyName: isCarrier ? cleanName : undefined,
        });

        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }

        if (res.user) {
          db.setCurrentUser(res.user);
        }
      } else {
        // Mock DB registration
        const newUser = {
          id: newUserId,
          email,
          phone: '',
          role: targetRole,
          fullName: !isCarrier ? cleanName : undefined,
          companyName: isCarrier ? cleanName : undefined,
          carrierProfileId: newCarrierId,
          createdAt: new Date().toISOString(),
        };

        db.addRegisteredUser({
          ...newUser,
          password,
          carrierId: newCarrierId,
        });

        if (isCarrier) {
          db.addCarrier({
            id: newCarrierId!,
            userId: newUserId,
            companyName: cleanName,
            slug: cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            authorizedPersonName: cleanName,
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

        db.setCurrentUser(newUser);
      }

      // Hoşgeldin e-postası tetikle
      fetch('/api/auth/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: cleanName,
          role: targetRole,
          companyName: isCarrier ? cleanName : undefined,
        }),
      }).catch(err => console.warn(err));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }

      setIsLoading(false);
      handleModalClose();

      const loggedInUser = db.getCurrentUser();
      if (onSuccess) {
        onSuccess(loggedInUser);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Modal OTP auth error:', err);
      setErrorMessage(err?.message || 'İşlem sırasında bir hata oluştu.');
      setIsLoading(false);
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || 'Geçersiz e-posta adresi.');
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Şifreniz en az 6 karakter olmalıdır.');
      setIsLoading(false);
      return;
    }

    try {
      if (isFirebaseConfigured()) {
        const res = await loginWithFirebase(email, password);
        if (res.error) {
          setErrorMessage(res.error);
          setIsLoading(false);
          return;
        }
        if (res.user) {
          db.setCurrentUser(res.user);
        }
      } else {
        // Mock DB Login
        const registeredUsers = db.getRegisteredUsers();
        const match = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

        const loginUser = match ? {
          id: match.id,
          email: match.email,
          phone: match.phone || '',
          role: match.role,
          fullName: match.fullName,
          companyName: match.companyName,
          carrierProfileId: match.carrierId,
          createdAt: match.createdAt,
        } : {
          id: `user_${Date.now()}`,
          email,
          phone: '',
          role: targetRole,
          fullName: isCarrier ? undefined : 'Değerli Müşterimiz',
          companyName: isCarrier ? 'TaşınTeklif Nakliyat' : undefined,
          carrierProfileId: isCarrier ? 'carr_bogazici' : undefined,
          createdAt: new Date().toISOString(),
        };

        db.setCurrentUser(loginUser);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
      }

      setIsLoading(false);
      handleModalClose();

      const loggedInUser = db.getCurrentUser();
      if (onSuccess) {
        onSuccess(loggedInUser);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      console.error('Modal login error:', err);
      setErrorMessage(err?.message || 'İşlem sırasında bir hata oluştu.');
      setIsLoading(false);
    }
  };

  const defaultTitle = targetRole === 'CUSTOMER'
    ? 'Talebi Yayınlamak İçin Giriş Yapın'
    : 'Teklif Vermek İçin Giriş Yapın';

  const defaultSubtitle = targetRole === 'CUSTOMER'
    ? 'Bilgileriniz korunur, talep anında yayınlanır.'
    : 'Hızlıca giriş yapın veya ücretsiz üye olun.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={title || defaultTitle}
      subtitle={subtitle || defaultSubtitle}
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* OTP Success Alert */}
        {otpSuccessMsg && registerStep === 'OTP' && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{otpSuccessMsg}</span>
          </div>
        )}

        {/* ── REGISTER STEP === 'OTP' SCREEN ── */}
        {tab === 'REGISTER' && registerStep === 'OTP' ? (
          <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4 pt-1">
            <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#F95700]/10 text-[#F95700] mx-auto flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-[#111E38]">E-Posta Doğrulama Kodu</h3>
              <p className="text-xs text-slate-600 font-medium">
                <strong className="text-[#111E38] font-bold">{email}</strong> adresine 6 haneli bir onay kodu gönderdik.
              </p>
              {/* 3 Dakika Sayacı */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white shadow-xs border border-orange-200">
                <Clock className={`w-3.5 h-3.5 ${timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-[#F95700]'}`} />
                <span className={timeLeft <= 30 ? 'text-red-600' : 'text-[#111E38]'}>
                  Kalan Süre: {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                6 Haneli Doğrulama Kodunu Girin
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
                autoFocus
                className="w-full py-3 px-4 rounded-xl border-2 border-slate-300 focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/20 text-center tracking-[0.4em] font-mono text-2xl font-black text-[#111E38] outline-none transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={otpCode.length !== 6 || timeLeft <= 0}
              className="w-full font-black text-xs py-3 shadow-md bg-[#F95700] hover:bg-[#E04F00]"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {targetRole === 'CUSTOMER' ? 'Kodu Doğrula & Talebi Yayınla' : 'Kodu Doğrula & Kaydol'}
            </Button>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setRegisterStep('FORM');
                  setErrorMessage('');
                  setOtpSuccessMsg('');
                }}
                className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                E-postayı Değiştir
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
                className="text-[#F95700] hover:underline font-bold disabled:opacity-50 disabled:no-underline cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Tekrar Gönder (${resendCooldown}s)` : 'Tekrar Kod Gönder'}
              </button>
            </div>
          </form>
        ) : (
          /* ── NORMAL FORM SCREEN (GOOGLE + TABS + FORM) ── */
          <>
            {/* 1. BIG GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#F95700]" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{googleLoading ? 'Google Bağlanıyor...' : 'Google ile Giriş Yap'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] text-slate-400 font-semibold absolute">veya e-posta ile</span>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setTab('REGISTER');
                  setRegisterStep('FORM');
                  setErrorMessage('');
                  setOtpSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  tab === 'REGISTER'
                    ? 'border-[#F95700] text-[#F95700]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Hızlı Üye Ol
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('LOGIN');
                  setRegisterStep('FORM');
                  setErrorMessage('');
                  setOtpSuccessMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold border-b-2 text-center transition-colors cursor-pointer ${
                  tab === 'LOGIN'
                    ? 'border-[#F95700] text-[#F95700]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Giriş Yap
              </button>
            </div>

            {/* Form */}
            <form onSubmit={tab === 'REGISTER' ? handleInitiateRegister : handleLoginSubmit} className="space-y-3 pt-1">
              {tab === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isCarrier ? 'Firma Adı veya Yetkili Adı *' : 'Adınız Soyadınız *'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isCarrier ? 'Örn: Murat Kaya / Kaya Nakliyat' : 'Örn: Ahmet Yılmaz'}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresiniz *</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Şifre *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {tab === 'REGISTER' && (
                <div className="p-2.5 bg-orange-50/70 rounded-xl border border-orange-100 flex items-center gap-2 text-[11px] text-[#111E38] font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#F95700] shrink-0" />
                  <span>Kaydınızı tamamlamak için e-postanıza 3 dakikalık onay kodu gönderilecektir.</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full font-bold text-xs py-3 mt-2 shadow-md bg-[#F95700] hover:bg-[#E04F00]"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {tab === 'REGISTER' 
                  ? 'Onay Kodu Gönder & Devam Et'
                  : 'Giriş Yap ve Devam Et'
                }
              </Button>

              <p className="text-[10px] text-slate-400 text-center pt-1 leading-relaxed">
                Devam ederek{' '}
                <a href="/kullanim-kosullari" target="_blank" className="underline hover:text-slate-600">Kullanım Koşulları</a>
                {' '}ve{' '}
                <a href="/gizlilik" target="_blank" className="underline hover:text-slate-600">Gizlilik Politikası</a>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};
