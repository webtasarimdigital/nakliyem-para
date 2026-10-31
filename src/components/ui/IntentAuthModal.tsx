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
  Building2,
  AlertCircle,
  Loader2,
  Clock,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loginWithGoogleFirebase, loginWithFirebase, registerWithFirebase } from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { validateEmailAddress } from '@/lib/validation/email';
import { 
  normalizePhoneNumber, 
  validatePhoneNumber, 
  formatPhoneNumber, 
  maskEmail 
} from '@/lib/validation/phone';
import { AppealModal } from '@/components/auth/AppealModal';

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
  const [companyName, setCompanyName] = useState('');
  const [authorizedName, setAuthorizedName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bannedError, setBannedError] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);

  // ── OTP State (3 Dakika Süreli Kod) ──
  const [registerStep, setRegisterStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika = 180 sn
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email' | 'screen'>('sms');

  const isCarrier = targetRole === 'CARRIER';

  const [alreadyRegistered, setAlreadyRegistered] = useState<string | null>(null);
  const [phoneAlreadyRegistered, setPhoneAlreadyRegistered] = useState<{
    phone: string;
    email: string;
    maskedEmail: string;
    role: string;
  } | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [commercialConsent, setCommercialConsent] = useState(false);

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

  // Önceden girilmiş telefon veya e-posta varsa otomatik doldur
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('tasin_carrier_phone') || localStorage.getItem('tasin_registered_phone') || localStorage.getItem('tasin_phone');
      if (savedPhone) setPhone(prev => prev || savedPhone);
      const savedEmail = localStorage.getItem('tasin_registered_email');
      if (savedEmail) setEmail(prev => prev || savedEmail);
      const savedCompany = localStorage.getItem('tasin_registered_company');
      const savedName = localStorage.getItem('tasin_registered_name');
      const savedAuthName = localStorage.getItem('tasin_registered_auth_name');
      if (savedCompany) setCompanyName(prev => prev || savedCompany);
      if (savedAuthName) setAuthorizedName(prev => prev || savedAuthName);
      if (savedName) setName(prev => prev || savedName);
    }
  }, [isOpen, isCarrier]);

  const handleModalClose = () => {
    setRegisterStep('FORM');
    setOtpCode('');
    setErrorMessage('');
    setOtpSuccessMsg('');
    setAlreadyRegistered(null);
    setPhoneAlreadyRegistered(null);
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
          const userBanCheck = db.isBanned({ email: res.user.email, phone: res.user.phone, userId: res.user.id });
          if (userBanCheck.isBanned) {
            setBannedError(true);
            setErrorMessage('Hesabınız sistem kuralları gereği askıya alınmıştır/yasaklanmıştır.');
            setGoogleLoading(false);
            return;
          }
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
          companyName: isCarrier ? 'Nakliyat Firması' : undefined,
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
            companyName: 'Nakliyat Firması',
            slug: `nakliyat-${Date.now()}`,
            authorizedPersonName: '',
            authorizedPersonSurname: '',
            phone: '',
            email: 'google.hesabi@gmail.com',
            shortBio: '',
            city: '',
            district: '',
            services: ['evden-eve'],
            serviceAreas: ['TÜM_TÜRKİYE'],
            verificationStatus: 'PENDING',
            verificationBadges: {
              identityVerified: false,
              taxVerified: false,
              transportPermitVerified: false,
              elevatorVerified: false,
            },
            planId: 'plan_starter',
            rating: 0,
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

    let cleanName = '';
    let cleanCompany: string | undefined = undefined;

    if (isCarrier) {
      if (!companyName.trim()) {
        setErrorMessage('Lütfen firma (şirket / ticari ünvan) adınızı giriniz.');
        return;
      }
      if (!authorizedName.trim()) {
        setErrorMessage('Lütfen firma yetkilisi ad ve soyadını giriniz.');
        return;
      }
      cleanName = authorizedName.trim();
      cleanCompany = companyName.trim();
    } else {
      if (!name.trim()) {
        setErrorMessage('Lütfen adınızı ve soyadınızı giriniz.');
        return;
      }
      cleanName = name.trim();
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.error || 'Lütfen geçerli bir cep telefonu numarası giriniz (Örn: 5XX XXX XX XX).');
      return;
    }
    const cleanPhone = phoneValidation.normalized;

    // Kara liste kontrolü
    const banCheck = db.isBanned({ phone: cleanPhone, email: email.trim().toLowerCase() });
    if (banCheck.isBanned) {
      setBannedError(true);
      setErrorMessage('Telefon numaranız veya e-posta adresiniz sistem kuralları gereği askıya alınmıştır/yasaklanmıştır. Tekrar kayıt olamazsınız.');
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

    if (!agreeTerms) {
      setErrorMessage(
        isCarrier
          ? "Lütfen Kullanım Koşulları, KVKK Aydınlatma Metni ve Veri İşleme Taahhüdü'nü onaylayınız."
          : "Lütfen Kullanım Koşulları, KVKK Aydınlatma Metni ve Açık Rıza Metni'ni onaylayınız."
      );
      return;
    }

    // Telefon ile mükerrer hesap kontrolü (Tek telefon tek hesap kuralı)
    const localPhoneUser = db.getUserByPhone(cleanPhone);
    if (localPhoneUser && !localPhoneUser.isMasterUser) {
      const regEmail = (localPhoneUser.email || '').trim().toLowerCase();
      if (regEmail && regEmail !== email.trim().toLowerCase()) {
        setPhoneAlreadyRegistered({
          phone: cleanPhone,
          email: localPhoneUser.email,
          maskedEmail: maskEmail(localPhoneUser.email),
          role: localPhoneUser.role,
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: cleanPhone,
          name: cleanName,
          role: targetRole,
          companyName: cleanCompany,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.error === 'ALREADY_REGISTERED' || data.error === 'PHONE_ALREADY_REGISTERED') {
        if (data.error === 'PHONE_ALREADY_REGISTERED' || data.phoneAlreadyRegistered) {
          setPhoneAlreadyRegistered({
            phone: data.phone || cleanPhone,
            email: data.existingEmail,
            maskedEmail: data.maskedEmail || maskEmail(data.existingEmail),
            role: data.role || targetRole,
          });
          setIsLoading(false);
          return;
        }
        setAlreadyRegistered(email.trim().toLowerCase());
        setIsLoading(false);
        return;
      }

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Doğrulama kodu gönderilemedi.');
        setIsLoading(false);
        return;
      }

      if (data.channel) {
        setOtpChannel(data.channel);
      }

      setRegisterStep('OTP');
      setTimeLeft(180); // 3 dakika = 180 saniye
      setResendCooldown(60);
      setOtpCode('');
      setOtpSuccessMsg(data.message || '6 haneli onay kodunuz gönderildi.');
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
      const cleanName = isCarrier ? authorizedName.trim() : name.trim();
      const cleanCompany = isCarrier ? companyName.trim() : undefined;

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          phone: normalizePhoneNumber(phone),
          name: cleanName,
          role: targetRole,
          companyName: cleanCompany,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Yeni kod gönderilemedi.');
      } else {
        if (data.channel) {
          setOtpChannel(data.channel);
        }
        setTimeLeft(180);
        setResendCooldown(60);
        setOtpSuccessMsg(data.message || 'Yeni doğrulama kodu gönderildi.');
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
      const cleanAuthorized = authorizedName.trim();
      const cleanCompany = companyName.trim();
      const cleanCustomerName = name.trim() || 'Değerli Müşterimiz';
      const cleanPhone = normalizePhoneNumber(phone);
      const newUserId = `user_${Date.now()}`;
      const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;

      let authFirst = cleanAuthorized;
      let authLast = '';
      if (isCarrier && cleanAuthorized) {
        const parts = cleanAuthorized.split(' ');
        if (parts.length > 1) {
          authLast = parts.pop() || '';
          authFirst = parts.join(' ');
        }
      }

      if (isFirebaseConfigured()) {
        const res = await registerWithFirebase({
          email,
          password,
          phone: cleanPhone,
          role: targetRole,
          fullName: !isCarrier ? cleanCustomerName : cleanAuthorized,
          companyName: isCarrier ? cleanCompany : undefined,
          authorizedPersonName: isCarrier ? authFirst : undefined,
          authorizedPersonSurname: isCarrier ? authLast : undefined,
        });

        if (res.error) {
          if (
            res.error.includes('already-in-use') ||
            res.error.includes('already in use') ||
            res.error.includes('zaten kullanımda') ||
            res.error.includes('Bu e-posta')
          ) {
            setRegisterStep('FORM');
            setAlreadyRegistered(email.trim().toLowerCase());
          } else {
            setErrorMessage(res.error);
          }
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
          phone: cleanPhone,
          role: targetRole,
          fullName: !isCarrier ? cleanCustomerName : cleanAuthorized,
          companyName: isCarrier ? cleanCompany : undefined,
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
            companyName: cleanCompany || 'Nakliyat Firması',
            slug: (cleanCompany || 'nakliyat-firmasi').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            authorizedPersonName: authFirst,
            authorizedPersonSurname: authLast,
            phone: cleanPhone,
            email,
            shortBio: '',
            city: '',
            district: '',
            services: ['evden-eve'],
            serviceAreas: ['TÜM_TÜRKİYE'],
            verificationStatus: 'PENDING',
            verificationBadges: {
              identityVerified: false,
              taxVerified: false,
              transportPermitVerified: false,
              elevatorVerified: false,
            },
            planId: 'plan_starter',
            trialStatus: db.hasUsedTrialBefore({ phone: cleanPhone, email }) ? 'EXPIRED' : 'NOT_STARTED',
            rating: 0,
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
          name: isCarrier ? cleanAuthorized : cleanCustomerName,
          role: targetRole,
          companyName: isCarrier ? cleanCompany : undefined,
        }),
      }).catch(err => console.warn(err));

      if (typeof window !== 'undefined') {
        const cleanP = cleanPhone;
        if (cleanP) {
          localStorage.setItem('tasin_registered_phone', cleanP);
          localStorage.setItem('tasin_carrier_phone', cleanP);
          localStorage.setItem('tasin_phone', cleanP);
        }
        if (email) localStorage.setItem('tasin_registered_email', email.trim());
        if (isCarrier) {
          if (cleanCompany) localStorage.setItem('tasin_registered_company', cleanCompany);
          if (cleanAuthorized) localStorage.setItem('tasin_registered_auth_name', cleanAuthorized);
        } else if (cleanCustomerName) {
          localStorage.setItem('tasin_registered_name', cleanCustomerName);
        }
        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('storage'));
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
    setBannedError(false);
    setIsLoading(true);

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      setErrorMessage(emailCheck.error || 'Geçersiz e-posta adresi.');
      setIsLoading(false);
      return;
    }

    // Kara liste kontrolü
    const banCheck = db.isBanned({ email: email.trim().toLowerCase() });
    if (banCheck.isBanned) {
      setBannedError(true);
      setErrorMessage('Hesabınız sistem kuralları gereği askıya alınmıştır/yasaklanmıştır.');
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
          const userBanCheck = db.isBanned({ email: res.user.email, phone: res.user.phone, userId: res.user.id });
          if (userBanCheck.isBanned) {
            setBannedError(true);
            setErrorMessage('Hesabınız sistem kuralları gereği askıya alınmıştır/yasaklanmıştır.');
            setIsLoading(false);
            return;
          }
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
          fullName: isCarrier ? undefined : 'Kullanıcı',
          companyName: isCarrier ? 'Nakliyat Firması' : undefined,
          carrierProfileId: isCarrier ? `carr_${Date.now()}` : undefined,
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
    <>
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
          <div className={`p-3.5 rounded-xl border text-xs font-medium ${
            bannedError ? 'bg-red-50 border-red-300 text-red-900 space-y-2' : 'bg-red-50 border-red-200 text-red-700 flex items-center gap-2'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span className="font-bold leading-relaxed">{errorMessage}</span>
            </div>
            {bannedError && (
              <div className="pt-2 border-t border-red-200 flex items-center justify-between">
                <span className="text-[11px] text-red-700 font-medium">Haksız olduğunu mu düşünüyorsunuz?</span>
                <button
                  type="button"
                  onClick={() => setAppealOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Yasaklamaya İtiraz Et
                </button>
              </div>
            )}
          </div>
        )}

        {/* Already Registered Warning */}
        {alreadyRegistered && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Bu Hesap Zaten Kayıtlı!</span>
            </div>
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              <strong>{alreadyRegistered}</strong> adresi ile kayıtlı bir hesap var. Giriş yapmak veya şifrenizi sıfırlamak için:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAlreadyRegistered(null);
                  setTab('LOGIN');
                  setEmail(alreadyRegistered);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-[#111E38] text-white text-[11px] font-bold hover:bg-[#1a2d52] transition-colors cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModalClose();
                  router.push(`/sifremi-unuttum?email=${encodeURIComponent(alreadyRegistered)}`);
                }}
                className="flex-1 py-1.5 px-3 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
              >
                Şifremi Sıfırla
              </button>
            </div>
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
                {otpChannel === 'sms' ? <Smartphone className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
              </div>
              <h3 className="text-sm font-black text-[#111E38]">
                {otpChannel === 'sms' || phone ? 'Telefon (SMS) Onay Kodu' : 'E-Posta Doğrulama Kodu'}
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {otpChannel === 'sms' || phone ? (
                  <>
                    <strong className="text-[#111E38] font-bold">{formatPhoneNumber(phone)}</strong> numaralı telefonunuza SMS ile 6 haneli güvenlik kodu gönderdik.
                  </>
                ) : (
                  <>
                    <strong className="text-[#111E38] font-bold">{email}</strong> adresine 6 haneli bir onay kodu gönderdik.
                  </>
                )}
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
                className="w-full py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl border-2 border-slate-300 focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/20 text-center tracking-[0.25em] sm:tracking-[0.4em] font-mono text-xl sm:text-2xl font-black text-[#111E38] outline-none transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={otpCode.length !== 6 || timeLeft <= 0}
              className="w-full font-black text-xs sm:text-sm py-2.5 sm:py-3 shadow-md bg-[#F95700] hover:bg-[#E04F00]"
            >
              {isLoading ? 'Doğrulanıyor...' : 'Doğrula ve Üye Ol'}
            </Button>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setRegisterStep('FORM');
                  setErrorMessage('');
                  setOtpSuccessMsg('');
                }}
                className="w-full sm:w-auto text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center sm:justify-start gap-1 cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{otpChannel === 'sms' || phone ? 'Telefonu Değiştir' : 'E-postayı Değiştir'}</span>
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || isLoading}
                className="w-full sm:w-auto text-[#F95700] hover:underline font-bold disabled:opacity-50 disabled:no-underline cursor-pointer flex items-center justify-center sm:justify-end gap-1 py-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{resendCooldown > 0 ? `Tekrar Gönder (${resendCooldown}s)` : 'Tekrar Kod Gönder'}</span>
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
              <span>{googleLoading ? 'Giriş yapılıyor...' : 'Google ile Giriş Yap'}</span>
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
                Üye Ol
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
              {phoneAlreadyRegistered && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-slate-800 space-y-2 text-left animate-fade-in shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded">Güvenlik</span>
                        <span className="text-[10px] text-slate-500 font-bold">{formatPhoneNumber(phoneAlreadyRegistered.phone)}</span>
                      </div>
                      <h4 className="font-bold text-xs text-rose-950">Bu Telefon Numarası Zaten Kayıtlı!</h4>
                      <p className="text-[11px] text-rose-900 leading-tight">
                        Bu numara sistemimizde <strong className="underline font-bold text-slate-900">{phoneAlreadyRegistered.email}</strong> adresiyle kayıtlıdır. Aynı numarayla yeni bir hesap açılamaz.
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(phoneAlreadyRegistered.email);
                        setTab('LOGIN');
                        setPhoneAlreadyRegistered(null);
                      }}
                      className="flex-1 py-1.5 px-2 bg-[#111E38] hover:bg-[#1a2d54] text-white rounded-lg text-[11px] font-bold text-center cursor-pointer transition-colors"
                    >
                      Bu Hesapla Giriş Yap
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneAlreadyRegistered(null);
                        setPhone('');
                      }}
                      className="py-1.5 px-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-[11px] font-medium text-center cursor-pointer"
                    >
                      Farklı Numara Gir
                    </button>
                  </div>
                </div>
              )}

              {tab === 'REGISTER' && (
                <>
                  {isCarrier ? (
                    <>
                      {/* Firma Adı (Şirket / Ticari Ünvan) */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Firma Adı (Şirket / Ticari Ünvan) *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCompanyName(val);
                              if (typeof window !== 'undefined') {
                                localStorage.setItem('tasin_registered_company', val);
                              }
                            }}
                            placeholder="Örn: Asil Nakliyat Ltd. Şti."
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                          />
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Firma Yetkilisi Adı ve Soyadı */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Firma Yetkilisi Adı ve Soyadı *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={authorizedName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setAuthorizedName(val);
                              if (typeof window !== 'undefined') {
                                localStorage.setItem('tasin_registered_auth_name', val);
                              }
                            }}
                            placeholder="Örn: Ahmet Yılmaz"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                          />
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Müşteri Ad Soyad */
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adınız Soyadınız *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setName(val);
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('tasin_registered_name', val);
                            }
                          }}
                          placeholder="Örn: Ahmet Yılmaz"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  )}
                </>
              )}

              {tab === 'REGISTER' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Telefon Numarası *</label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Güvenlik
                    </span>
                  </div>
                  <div className="flex rounded-xl border border-slate-300 focus-within:border-[#F95700] overflow-hidden bg-white">
                    <div className="flex items-center gap-1 px-2.5 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600 select-none shrink-0">
                      <span>🇹🇷</span>
                      <span>TR +90</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhone(val);
                        if (phoneAlreadyRegistered) setPhoneAlreadyRegistered(null);
                        if (errorMessage) setErrorMessage('');
                        if (typeof window !== 'undefined') {
                          localStorage.setItem('tasin_registered_phone', val);
                          localStorage.setItem('tasin_carrier_phone', val);
                          localStorage.setItem('tasin_phone', val);
                        }
                      }}
                      onBlur={() => {
                        const cleanP = normalizePhoneNumber(phone);
                        if (cleanP && cleanP.length >= 10) {
                          const found = db.getUserByPhone(cleanP);
                          if (found && !found.isMasterUser) {
                            const regEmail = (found.email || '').trim().toLowerCase();
                            const typEmail = (email || '').trim().toLowerCase();
                            if (regEmail && (!typEmail || regEmail !== typEmail)) {
                              setPhoneAlreadyRegistered({
                                phone: cleanP,
                                email: found.email,
                                maskedEmail: maskEmail(found.email),
                                role: found.role,
                              });
                            }
                          }
                        }
                      }}
                      placeholder="5XX XXX XX XX"
                      className="w-full px-3 py-2.5 text-xs font-medium focus:outline-none bg-transparent"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Her telefon numarası bir kez kullanılabilir. SMS onay kodu gönderilir.</p>
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
                <>
                  <div className="p-2.5 bg-orange-50/70 rounded-xl border border-orange-100 flex items-center gap-2 text-[11px] text-[#111E38] font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#F95700] shrink-0" />
                    <span>Kaydınızı tamamlamak için telefonunuza SMS ile 3 dakikalık onay kodu gönderilecektir.</span>
                  </div>

                  {/* Yasal Onaylar ve Rıza Metinleri */}
                  <div className="space-y-2.5 pt-1 text-left">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={e => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                        required
                      />
                      <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        <a
                          href="/kullanim-kosullari"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          Kullanım Koşulları
                        </a>
                        ’nı kabul ediyorum ve{' '}
                        <a
                          href="/kvkk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          KVKK Aydınlatma Metni
                        </a>
                        ’ni okudum.{' '}
                        {isCarrier ? (
                          <>
                            Müşteri verileri için{' '}
                            <a
                              href="/nakliyeci-sozlesmesi#veri-isleme-taahhudu"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              Veri İşleme Taahhüdü
                            </a>
                            ’nü kabul ediyorum.
                          </>
                        ) : (
                          <>
                            Kişisel verilerimin işlenmesine ilişkin{' '}
                            <a
                              href="/kvkk#acik-riza"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              Açık Rıza Metni
                            </a>
                            ’ni kabul ediyorum.
                          </>
                        )}{' '}
                        <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={commercialConsent}
                        onChange={e => setCommercialConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        Kampanya, yenilik ve fırsatlardan e-posta ve SMS ile haberdar olmak istiyorum. İsteğe bağlıdır, istediğiniz zaman geri alabilirsiniz.{' '}
                        <a
                          href="/kvkk#ticari-ileti"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline inline-block"
                          onClick={e => e.stopPropagation()}
                        >
                          Ticari Elektronik İleti Onayı
                        </a>
                      </span>
                    </label>
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={tab === 'REGISTER' && !agreeTerms}
                className="w-full font-bold text-xs py-3 mt-2 shadow-md bg-[#F95700] hover:bg-[#E04F00] disabled:opacity-50"
              >
                {isLoading
                  ? (tab === 'REGISTER' ? 'Kayıt yapılıyor...' : 'Giriş yapılıyor...')
                  : tab === 'REGISTER'
                  ? 'Üye Ol'
                  : 'Giriş Yap'
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
    <AppealModal
      isOpen={appealOpen}
      onClose={() => setAppealOpen(false)}
      initialEmail={email}
      initialPhone={phone}
      initialName={isCarrier ? companyName : name}
    />
    </>
  );
};
