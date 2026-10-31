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
  AlertTriangle,
  Phone,
  Loader2,
  ShieldAlert,
  LogIn,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { 
  registerWithFirebase, 
  loginWithGoogleFirebase, 
  checkEmailAlreadyRegistered, 
  checkEmailAlreadyRegisteredWithRole, 
  sendPasswordResetFirebase,
  logoutFirebase
} from '@/lib/firebase/auth';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { db } from '@/lib/data/mock-db';
import { validateEmailAddress } from '@/lib/validation/email';
import { 
  normalizePhoneNumber, 
  validatePhoneNumber, 
  formatPhoneNumber, 
  maskEmail 
} from '@/lib/validation/phone';
import { AppealModal } from '@/components/auth/AppealModal';

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

  useEffect(() => {
    const pPhone = searchParams.get('phone');
    if (pPhone) {
      setPhone(pPhone);
    } else if (typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem('tasin_carrier_phone') || localStorage.getItem('tasin_phone') || localStorage.getItem('tasin_registered_phone');
      if (savedPhone) setPhone(savedPhone);
    }

    const pEmail = searchParams.get('email');
    if (pEmail) {
      setEmail(pEmail);
    }

    const pCompany = searchParams.get('company') || searchParams.get('companyName');
    if (pCompany) {
      setCompanyName(pCompany);
    }

    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('tasin_registered_auth_name');
      if (savedAuth) setAuthorizedName(savedAuth);
    }
  }, [searchParams]);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [commercialConsent, setCommercialConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bannedError, setBannedError] = useState(false);
  const [appealOpen, setAppealOpen] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState<string | null>(null);
  const [roleMismatch, setRoleMismatch] = useState<{
    expected: 'CUSTOMER' | 'CARRIER';
    actual: 'CUSTOMER' | 'CARRIER';
    email: string;
  } | null>(null);
  const [phoneAlreadyRegistered, setPhoneAlreadyRegistered] = useState<{
    phone: string;
    email: string;
    maskedEmail: string;
    role: string;
  } | null>(null);

  const switchRole = (newRole: 'musteri' | 'nakliyeci') => {
    setRole(newRole);
    setRoleMismatch(null);
    setAlreadyRegistered(null);
    setPhoneAlreadyRegistered(null);
    setErrorMessage('');
    setBannedError(false);
  };

  // Carrier specific
  const [companyName, setCompanyName] = useState('');
  const [authorizedName, setAuthorizedName] = useState('');

  // ── OTP Email Doğrulama Durumu (3 Dakika Süreli) ──
  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 dakika = 180 saniye
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email' | 'screen'>('email');

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

  // Sayfa yenilenirse veya geri gelinirse bekleyen telefon doğrulama oturumunu geri yükle
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem('pending_registration_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        // 10 dakika içindeyse geri yükle
        if (parsed && Date.now() - (parsed.timestamp || 0) < 10 * 60 * 1000) {
          if (parsed.email) setEmail(parsed.email);
          if (parsed.phone) setPhone(parsed.phone);
          if (parsed.name) setName(parsed.name);
          if (parsed.companyName) setCompanyName(parsed.companyName);
          if (parsed.authorizedName) setAuthorizedName(parsed.authorizedName);
          if (parsed.password) setPassword(parsed.password);
          if (parsed.role) setRole(parsed.role);
          if (parsed.otpChannel) setOtpChannel(parsed.otpChannel);
          if (parsed.step === 'OTP') {
            setStep('OTP');
            setOtpSuccessMsg('Devam eden telefon doğrulama oturumunuz yüklendi. Lütfen gelen SMS kodunu giriniz.');
          }
        } else {
          sessionStorage.removeItem('pending_registration_session');
        }
      }
    } catch (e) {
      console.warn('Pending session restore error:', e);
    }
  }, []);

  const isCarrier = role === 'nakliyeci';

  // Google ile Gerçekçi Kayıt
  const handleRealGoogleRegister = async () => {
    setLoading(true);
    setErrorMessage('');
    setRoleMismatch(null);
    setAlreadyRegistered(null);
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

    // Yasaklı kontrolü
    const userBanCheck = db.isBanned({ email: res.user.email, phone: res.user.phone, userId: res.user.id });
    if (userBanCheck.isBanned) {
      await logoutFirebase();
      setBannedError(true);
      setErrorMessage('Hesabınız sistem kuralları gereği askıya alınmıştır/yasaklanmıştır. Tekrar kayıt olamazsınız.');
      return;
    }

    // Google ile kayıt olmaya çalışırken rol uyuşmazlığı kontrolü
    if (!res.user.isMasterUser) {
      if (res.user.role === 'CARRIER' && !isCarrier) {
        await logoutFirebase();
        setRoleMismatch({ expected: 'CUSTOMER', actual: 'CARRIER', email: res.user.email });
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
      if (res.user.role === 'CUSTOMER' && isCarrier) {
        await logoutFirebase();
        setRoleMismatch({ expected: 'CARRIER', actual: 'CUSTOMER', email: res.user.email });
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
    }

    db.setCurrentUser(res.user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
    }
    // Yönlendirme kararını kullanıcının Firestore'daki gerçek rolüne göre al
    if (res.user.role === 'CARRIER') {
      const existingCarrier = db.getCarriers().find(c => c.userId === res.user?.id || c.id === res.user?.carrierProfileId);
      if (!existingCarrier || !existingCarrier.isProfileCompleted || !existingCarrier.companyName) {
        router.push('/nakliyeci/onboarding');
      } else {
        router.push('/nakliyeci');
      }
    } else {
      router.push('/musteri');
    }
  };

  // 1. Adım: Form Bilgilerini Doğrulayıp 3 Dakikalık E-Posta Onay Kodu Gönderme
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setOtpSuccessMsg('');
    setRoleMismatch(null);
    setAlreadyRegistered(null);

    if (isCarrier) {
      if (!companyName.trim()) {
        setErrorMessage('Lütfen firma (şirket / ticari ünvan) adınızı giriniz.');
        return;
      }
      if (!authorizedName.trim()) {
        setErrorMessage('Lütfen firma yetkilisi ad ve soyadını giriniz.');
        return;
      }
    } else {
      if (!name.trim()) {
        setErrorMessage('Lütfen ad ve soyadınızı giriniz.');
        return;
      }
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setErrorMessage(phoneValidation.error || 'Lütfen geçerli bir cep telefonu numarası giriniz (Örn: 5XX XXX XX XX).');
      return;
    }
    const cleanPhone = phoneValidation.normalized;

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
      setErrorMessage(
        isCarrier
          ? "Lütfen Kullanım Koşulları, KVKK Aydınlatma Metni ve Veri İşleme Taahhüdü'nü onaylayınız."
          : "Lütfen Kullanım Koşulları, KVKK Aydınlatma Metni ve Açık Rıza Metni'ni onaylayınız."
      );
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Kara Liste / Yasaklılık Kontrolü
    const banCheck = db.isBanned({ phone: cleanPhone, email: cleanEmail });
    if (banCheck.isBanned) {
      setLoading(false);
      setBannedError(true);
      setErrorMessage('Telefon numaranız veya e-posta adresiniz sistem kuralları gereği askıya alınmıştır/yasaklanmıştır. Tekrar kayıt olamazsınız.');
      return;
    }

    setLoading(true);

    // Fast local check if user exists (E-posta ile rol uyuşmazlığı kontrolü)
    const localUser = db.getUserByEmail(cleanEmail) || db.getRegisteredUserByEmail(cleanEmail);
    if (localUser && !localUser.isMasterUser) {
      if (localUser.role === 'CARRIER' && !isCarrier) {
        setRoleMismatch({ expected: 'CUSTOMER', actual: 'CARRIER', email: cleanEmail });
        setLoading(false);
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
      if (localUser.role === 'CUSTOMER' && isCarrier) {
        setRoleMismatch({ expected: 'CARRIER', actual: 'CUSTOMER', email: cleanEmail });
        setLoading(false);
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }

      setAlreadyRegistered(cleanEmail);
      sendPasswordResetFirebase(cleanEmail).catch(console.warn);
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
      return;
    }

    // Fast local phone check (Bir telefon tek bir üyelik için geçerlidir - Çoklu ücretsiz sürüm suistimal engeli)
    const localPhoneUser = db.getUserByPhone(cleanPhone);
    if (localPhoneUser && !localPhoneUser.isMasterUser) {
      if (localPhoneUser.role === 'CARRIER' && !isCarrier) {
        setRoleMismatch({ expected: 'CUSTOMER', actual: 'CARRIER', email: localPhoneUser.email || cleanEmail });
        setLoading(false);
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
      if (localPhoneUser.role === 'CUSTOMER' && isCarrier) {
        setRoleMismatch({ expected: 'CARRIER', actual: 'CUSTOMER', email: localPhoneUser.email || cleanEmail });
        setLoading(false);
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }

      // Aynı telefonla farklı e-posta açılarak deneme/ücretsiz sürüm suistimali engeli
      const registeredEmail = (localPhoneUser.email || '').trim().toLowerCase();
      if (registeredEmail && registeredEmail !== cleanEmail) {
        setPhoneAlreadyRegistered({
          phone: cleanPhone,
          email: localPhoneUser.email,
          maskedEmail: maskEmail(localPhoneUser.email),
          role: localPhoneUser.role,
        });
        setLoading(false);
        if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
        return;
      }
    }

    // Pre-check if email already exists in Firebase Auth & Firestore
    if (isFirebaseConfigured()) {
      try {
        const checkResult = await checkEmailAlreadyRegisteredWithRole(cleanEmail);
        if (checkResult.exists) {
          if (checkResult.role === 'CARRIER' && !isCarrier) {
            setRoleMismatch({ expected: 'CUSTOMER', actual: 'CARRIER', email: cleanEmail });
            setLoading(false);
            if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
            return;
          }
          if (checkResult.role === 'CUSTOMER' && isCarrier) {
            setRoleMismatch({ expected: 'CARRIER', actual: 'CUSTOMER', email: cleanEmail });
            setLoading(false);
            if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
            return;
          }

          setAlreadyRegistered(cleanEmail);
          await sendPasswordResetFirebase(cleanEmail).catch(console.warn);
          setLoading(false);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }
          return;
        }
      } catch (checkErr) {
        console.warn('Pre-check email warning:', checkErr);
      }
    }

    try {
      // 3 dakikalık OTP kodu gönder
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          phone: cleanPhone,
          name: isCarrier ? authorizedName.trim() : name.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        if (data.error === 'PHONE_ALREADY_REGISTERED' || data.phoneAlreadyRegistered) {
          setPhoneAlreadyRegistered({
            phone: data.phone || cleanPhone,
            email: data.existingEmail,
            maskedEmail: data.maskedEmail || maskEmail(data.existingEmail),
            role: data.role || 'CARRIER',
          });
          setLoading(false);
          if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
          return;
        }
        if (data.error === 'ROLE_MISMATCH_CARRIER' || data.existingRole === 'CARRIER') {
          setRoleMismatch({ expected: 'CUSTOMER', actual: 'CARRIER', email: cleanEmail });
          setLoading(false);
          if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
          return;
        }
        if (data.error === 'ROLE_MISMATCH_CUSTOMER' || data.existingRole === 'CUSTOMER') {
          setRoleMismatch({ expected: 'CARRIER', actual: 'CUSTOMER', email: cleanEmail });
          setLoading(false);
          if (typeof window !== 'undefined') window.scrollTo({ top: 100, behavior: 'smooth' });
          return;
        }

        setAlreadyRegistered(cleanEmail);
        await sendPasswordResetFirebase(cleanEmail).catch(console.warn);
        setLoading(false);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 100, behavior: 'smooth' });
        }
        return;
      }

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Doğrulama kodu gönderilemedi.');
        setLoading(false);
        return;
      }

      if (!data.emailSent && data.code) {
        setDevOtpCode(data.code);
      } else {
        setDevOtpCode(null);
      }

      if (data.channel) {
        setOtpChannel(data.channel);
      }

      setStep('OTP');
      setTimeLeft(180); // 3 dakika = 180 saniye
      setResendCooldown(60);
      setOtpCode('');
      setOtpSuccessMsg(data.message || '6 haneli onay kodunuz gönderildi.');

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_registration_session', JSON.stringify({
          email: cleanEmail,
          phone: cleanPhone,
          name: name.trim(),
          companyName: companyName.trim(),
          authorizedName: authorizedName.trim(),
          password,
          role,
          otpChannel: data.channel || 'sms',
          step: 'OTP',
          timestamp: Date.now(),
        }));
      }
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
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = normalizePhoneNumber(phone);
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          phone: cleanPhone,
          name: isCarrier ? authorizedName.trim() : name.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Yeni kod gönderilemedi.');
      } else {
        if (!data.emailSent && data.code) {
          setDevOtpCode(data.code);
        }
        if (data.channel) {
          setOtpChannel(data.channel);
        }
        setTimeLeft(180); // Süreyi 3 dakikaya sıfırla
        setResendCooldown(60);
        setOtpSuccessMsg(data.message || 'Yeni doğrulama kodu gönderildi.');
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

      // 2. Kod doğrulandı! Bekleyen oturumu temizle
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('pending_registration_session');
      }

      // Kullanıcıyı Firebase ve Mock DB'ye güvenle kaydet
      const newUserId = `user_${Date.now()}`;
      const newCarrierId = isCarrier ? `carr_${Date.now()}` : undefined;

      let authFirst = authorizedName.trim();
      let authLast = '';
      if (isCarrier && authFirst) {
        const parts = authFirst.split(' ');
        if (parts.length > 1) {
          authLast = parts.pop() || '';
          authFirst = parts.join(' ');
        }
      }

      // Save to mock db
      db.addRegisteredUser({
        id: newUserId,
        email,
        phone: phone.trim(),
        password,
        role: isCarrier ? 'CARRIER' : 'CUSTOMER',
        fullName: isCarrier ? authorizedName.trim() : name,
        companyName: isCarrier ? companyName : undefined,
        carrierId: newCarrierId,
        createdAt: new Date().toISOString(),
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        kvkkAccepted: true,
        kvkkAcceptedAt: new Date().toISOString(),
        dataProcessingAccepted: isCarrier,
        commercialConsent: commercialConsent,
        commercialConsentAt: commercialConsent ? new Date().toISOString() : undefined,
      } as any);

      if (isCarrier) {
        db.addCarrier({
          id: newCarrierId!,
          userId: newUserId,
          companyName: companyName.trim(),
          slug: companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          authorizedPersonName: authFirst,
          authorizedPersonSurname: authLast,
          phone: phone.trim(),
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
          isProfileCompleted: false,
          planId: 'plan_starter',
          rating: 0,
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
          phone: phone.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          fullName: isCarrier ? authorizedName.trim() : name,
          companyName: isCarrier ? companyName.trim() : undefined,
          authorizedPersonName: isCarrier ? authFirst : undefined,
          authorizedPersonSurname: isCarrier ? authLast : undefined,
        });

        if (error) {
          // Firebase'den "e-posta zaten kullanımda" hatası gelirse alreadyRegistered göster
          if (
            error.includes('already-in-use') ||
            error.includes('already in use') ||
            error.includes('zaten kullanımda') ||
            error.includes('Bu e-posta')
          ) {
            setStep('FORM');
            setAlreadyRegistered(email.trim().toLowerCase());
          } else {
            setErrorMessage(error);
          }
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
          phone: phone.trim(),
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          fullName: isCarrier ? authorizedName.trim() : name,
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
          name: isCarrier ? authorizedName.trim() : name,
          role: isCarrier ? 'CARRIER' : 'CUSTOMER',
          companyName: isCarrier ? companyName : undefined,
        }),
      }).catch(err => console.warn('Welcome mail error:', err));

      if (typeof window !== 'undefined') {
        const cleanP = phone.trim();
        if (cleanP) {
          localStorage.setItem('tasin_registered_phone', cleanP);
          localStorage.setItem('tasin_carrier_phone', cleanP);
          localStorage.setItem('tasin_phone', cleanP);
        }
        if (email) localStorage.setItem('tasin_registered_email', email.trim());
        if (isCarrier) {
          if (companyName.trim()) localStorage.setItem('tasin_registered_company', companyName.trim());
          if (authorizedName.trim()) localStorage.setItem('tasin_registered_auth_name', authorizedName.trim());
        } else if (name) {
          localStorage.setItem('tasin_registered_name', name.trim());
        }
        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('storage'));
      }

      setLoading(false);

      if (isCarrier) {
        router.push('/app/carrier/onboarding');
      } else {
        router.push('/app/customer');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kayıt işlemi sırasında bir sorun oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-start sm:items-center justify-center pt-3 pb-8 sm:py-8 px-3 sm:px-6">
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
        <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-4">

            {/* Başlık */}
            <div className="text-center space-y-1 mb-2">
              <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
                {step === 'OTP' ? (otpChannel === 'sms' ? 'Telefon (SMS) Doğrulama' : 'E-Posta Doğrulama') : 'Hesap Oluştur'}
              </h1>
            </div>

            {step === 'OTP' ? (
              <div className="space-y-4 animate-fade-in pt-1">
                <div className="text-center space-y-1.5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                    {otpChannel === 'sms' ? <Smartphone className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                    {otpChannel === 'sms' ? (
                      <>
                        <strong className="text-[#111E38] font-bold">{formatPhoneNumber(phone)}</strong> numaralı telefonunuza SMS ile 6 haneli güvenlik kodu gönderdik. Hesabınızı aktifleştirmek için lütfen kodu giriniz.
                      </>
                    ) : (
                      <>
                        <strong className="text-[#111E38] font-bold">{email}</strong> adresinize 6 haneli bir güvenlik kodu gönderdik. Hesabınızı aktifleştirmek için lütfen kodu giriniz.
                      </>
                    )}
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

                {/* Test / Geliştirme Doğrulama Kodu (SMTP henüz ayarlanmadıysa kullanıcı mağdur olmasın) */}
                {devOtpCode && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-800 space-y-1.5 animate-fade-in shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">Test Doğrulama Kodu</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(devOtpCode)}
                        className="text-[11px] font-black text-amber-950 bg-amber-200 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        Kodu Doldur ➔
                      </button>
                    </div>
                    <div className="text-xl font-black text-slate-900 font-mono tracking-widest text-center py-0.5">
                      {devOtpCode}
                    </div>
                    <p className="text-[10px] text-amber-700 text-center font-medium">
                      (SMTP sunucu ayarı henüz tanımlanmadığı için test kodunuz ekranda hazırlanmıştır)
                    </p>
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
                    {loading ? 'Doğrulanıyor...' : 'Doğrula ve Üye Ol'}
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
                      if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('pending_registration_session');
                      }
                      setStep('FORM');
                      setErrorMessage('');
                      setOtpCode('');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                  >
                    ← Telefonu / Bilgileri Değiştir
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Rol Seçici Sekmeler (Pill Style) */}
                <div className="flex p-1 bg-slate-100 rounded-full">
                  <button
                    type="button"
                    onClick={() => switchRole('musteri')}
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
                    onClick={() => switchRole('nakliyeci')}
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
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{loading ? 'Kayıt yapılıyor...' : 'Google ile Kayıt Ol'}</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[11px] font-medium text-slate-400">veya e-posta ile</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Form */}
                <form onSubmit={handleInitiateRegister} className="space-y-4">
                  {phoneAlreadyRegistered ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-slate-800 space-y-3 animate-fade-in shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md">Güvenlik Doğrulaması</span>
                            <span className="text-[11px] text-slate-600 font-bold">{formatPhoneNumber(phoneAlreadyRegistered.phone)}</span>
                          </div>
                          <h4 className="font-black text-sm text-rose-950">
                            Bu Telefon Numarasına Ait Üyelik Zaten Mevcut!
                          </h4>
                          <p className="text-xs text-rose-900 leading-relaxed">
                            Girdiğiniz telefon numarası sistemimizde daha önce <strong className="text-slate-900 font-black underline">{phoneAlreadyRegistered.email}</strong> e-posta adresiyle kaydedilmiştir.
                          </p>
                          <div className="p-3 bg-white/90 rounded-xl border border-rose-200 text-xs text-slate-700 leading-relaxed font-medium">
                            🔒 <strong>Mükerrer &amp; Ücretsiz Üyelik Kuralı:</strong> Her telefon numarası sistemimizde yalnızca <strong>tek bir hesap</strong> için kullanılabilir. Farklı bir e-posta açsanız dahi aynı telefon numarasıyla tekrar ücretsiz deneme veya mükerrer üyelik açılamaz.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-rose-200">
                        <Link
                          href={`/giris?role=${phoneAlreadyRegistered.role === 'CARRIER' ? 'nakliyeci' : 'musteri'}&email=${encodeURIComponent(phoneAlreadyRegistered.email)}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#111E38] hover:bg-[#1a2d54] text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>Bu Hesapla Giriş Yap ({phoneAlreadyRegistered.email})</span>
                        </Link>
                        <Link
                          href={`/sifremi-unuttum?email=${encodeURIComponent(phoneAlreadyRegistered.email)}`}
                          className="text-center py-2.5 px-3 rounded-xl bg-white border border-rose-300 hover:bg-rose-100/60 text-rose-950 text-xs font-black shadow-sm transition-all cursor-pointer"
                        >
                          Şifremi Sıfırla
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setPhoneAlreadyRegistered(null);
                            setPhone('');
                          }}
                          className="text-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Farklı Numara Gir
                        </button>
                      </div>
                    </div>
                  ) : roleMismatch && roleMismatch.actual === 'CARRIER' ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-800 space-y-3 animate-fade-in shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-amber-950">Nakliyeci Kaydınız Mevcuttur!</h4>
                          <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                            <strong className="text-slate-900 font-bold">{roleMismatch.email}</strong> adresiyle sistemimizde aktif bir <strong>Nakliyeci (Firma)</strong> kaydınız bulunmaktadır. Aynı e-posta adresiyle müşteri hesabı açamazsınız.
                          </p>
                          <p className="text-xs text-amber-800 mt-1.5 font-medium">
                            Müşteri olarak yeni bir talep açmak için lütfen farklı bir e-posta adresi kullanınız veya mevcut firmanızla Nakliyeci Girişi yapınız.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-amber-200">
                        <Link
                          href={`/giris?role=nakliyeci&email=${encodeURIComponent(roleMismatch.email)}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#111E38] hover:bg-[#1a2d54] text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Nakliyeci Girişine Git</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setRoleMismatch(null);
                            setEmail('');
                          }}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-white border border-amber-300 hover:bg-amber-100/60 text-amber-950 text-xs font-black shadow-sm transition-all cursor-pointer"
                        >
                          Farklı E-posta ile Kaydol
                        </button>
                      </div>
                    </div>
                  ) : roleMismatch && roleMismatch.actual === 'CUSTOMER' ? (
                    <div className="p-4 sm:p-5 rounded-2xl bg-blue-50 border-2 border-blue-300 text-slate-800 space-y-3 animate-fade-in shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-blue-950">Müşteri Kaydınız Mevcuttur!</h4>
                          <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                            <strong className="text-slate-900 font-bold">{roleMismatch.email}</strong> adresiyle sistemimizde aktif bir <strong>Müşteri</strong> kaydınız bulunmaktadır. Aynı e-posta adresiyle nakliyeci hesabı açamazsınız.
                          </p>
                          <p className="text-xs text-blue-800 mt-1.5 font-medium">
                            Nakliye firmanızı kaydetmek için lütfen kurumsal/farklı bir e-posta adresi kullanınız veya mevcut hesabınızla Müşteri Girişi yapınız.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-blue-200">
                        <Link
                          href={`/giris?role=musteri&email=${encodeURIComponent(roleMismatch.email)}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#111E38] hover:bg-[#1a2d54] text-white text-xs font-black shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Müşteri Girişine Git</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setRoleMismatch(null);
                            setEmail('');
                          }}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-white border border-blue-300 hover:bg-blue-100/60 text-blue-950 text-xs font-black shadow-sm transition-all cursor-pointer"
                        >
                          Farklı E-posta ile Kaydol
                        </button>
                      </div>
                    </div>
                  ) : alreadyRegistered ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-800 space-y-3 animate-fade-in shadow-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertTriangle className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-[#111E38]">Bu E-Posta Hesabına Ait Üyelik Bulunmaktadır!</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            <strong className="text-slate-900 font-bold">{alreadyRegistered}</strong> e-posta adresiyle sistemimizde kayıtlı bir hesap mevcuttur (Google veya Şifre). Şifre sıfırlama bağlantısı e-posta adresinize iletilmiştir.
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Şifre sıfırlama e-postası gelen kutunuza gönderildi.</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Link
                          href={`/giris?email=${encodeURIComponent(alreadyRegistered)}`}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#111E38] hover:bg-[#1b2a4a] text-white text-xs font-black shadow-sm transition-all"
                        >
                          Giriş Yap
                        </Link>
                        <button
                          type="button"
                          onClick={async () => {
                            await sendPasswordResetFirebase(alreadyRegistered);
                            alert('Şifre sıfırlama bağlantısı e-posta adresinize tekrar gönderildi. Lütfen gelen kutunuzu ve spam klasörünü kontrol ediniz.');
                          }}
                          className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white text-xs font-black shadow-sm transition-all cursor-pointer"
                        >
                          Şifremi Sıfırla (Tekrar Gönder)
                        </button>
                      </div>
                    </div>
                  ) : errorMessage ? (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-medium space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
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
                  ) : null}

                  {/* Single Column Inputs for mobile */}
                  <div className="space-y-3">
                    {isCarrier ? (
                      <>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Firma Adı (Şirket / Ticari Ünvan) *
                          </label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={companyName}
                              onChange={e => {
                                setCompanyName(e.target.value);
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('tasin_registered_company', e.target.value);
                                }
                              }}
                              placeholder="Örn: Asil Nakliyat Ltd. Şti."
                              required
                              className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Firma Yetkilisi Adı ve Soyadı *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="text"
                              value={authorizedName}
                              onChange={e => {
                                setAuthorizedName(e.target.value);
                                if (typeof window !== 'undefined') {
                                  localStorage.setItem('tasin_registered_auth_name', e.target.value);
                                }
                              }}
                              placeholder="Örn: Ahmet Yılmaz"
                              required
                              className="w-full border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                            />
                          </div>
                        </div>
                      </>
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

                    {/* Telefon Numarası - Güvenlik & Tek Kullanımlık Numara Doğrulama */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Telefon Numarası
                        </label>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Güvenlik
                        </span>
                      </div>

                      <div className="flex rounded-xl border border-slate-200 focus-within:border-[#111E38] focus-within:ring-2 focus-within:ring-blue-100 overflow-hidden transition-all bg-white shadow-xs">
                        <div className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 bg-slate-50 border-r border-slate-200 text-xs font-black text-slate-700 select-none shrink-0">
                          <span className="text-base leading-none">🇹🇷</span>
                          <span>TR +90</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => {
                            const val = e.target.value;
                            setPhone(val);
                            if (phoneAlreadyRegistered) setPhoneAlreadyRegistered(null);
                            if (errorMessage) setErrorMessage('');
                            if (typeof window !== 'undefined') {
                              localStorage.setItem('tasin_carrier_phone', val);
                              localStorage.setItem('tasin_registered_phone', val);
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
                          required
                          className="w-full px-3 py-2.5 sm:py-3 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Her telefon numarası bir kez kullanılabilir. SMS ile tek kullanımlık kod gönderilir.</span>
                      </p>
                    </div>

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
                          onChange={e => {
                            setEmail(e.target.value);
                            if (alreadyRegistered) setAlreadyRegistered(null);
                            if (errorMessage) setErrorMessage('');
                          }}
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

                  {/* Yasal Onaylar ve Rıza Metinleri */}
                  <div className="space-y-3 pt-2">
                    {/* 1. Zorunlu Yasal Onay Checkbox'ı */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={e => setAgree(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                        required
                      />
                      <span className="text-xs text-slate-600 font-medium leading-relaxed">
                        <Link
                          href="/kullanim-kosullari"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          Kullanım Koşulları
                        </Link>
                        ’nı kabul ediyorum ve{' '}
                        <Link
                          href="/kvkk"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline"
                          onClick={e => e.stopPropagation()}
                        >
                          KVKK Aydınlatma Metni
                        </Link>
                        ’ni okudum.{' '}
                        {isCarrier ? (
                          <>
                            Müşteri verileri için{' '}
                            <Link
                              href="/nakliyeci-sozlesmesi#veri-isleme-taahhudu"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              Veri İşleme Taahhüdü
                            </Link>
                            ’nü kabul ediyorum.
                          </>
                        ) : (
                          <>
                            Kişisel verilerimin işlenmesine ilişkin{' '}
                            <Link
                              href="/kvkk#acik-riza"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-bold hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              Açık Rıza Metni
                            </Link>
                            ’ni kabul ediyorum.
                          </>
                        )}{' '}
                        <span className="text-red-500 font-bold">*</span>
                      </span>
                    </label>

                    {/* 2. İsteğe Bağlı Ticari Elektronik İleti Onayı Checkbox'ı */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={commercialConsent}
                        onChange={e => setCommercialConsent(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-emerald-600 accent-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-slate-600 font-medium leading-relaxed">
                        Kampanya, yenilik ve fırsatlardan e-posta ve SMS ile haberdar olmak istiyorum. İsteğe bağlıdır, istediğiniz zaman geri alabilirsiniz.{' '}
                        <Link
                          href="/kvkk#ticari-ileti"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 font-bold hover:underline inline-block"
                          onClick={e => e.stopPropagation()}
                        >
                          Ticari Elektronik İleti Onayı
                        </Link>
                      </span>
                    </label>
                  </div>

                  {/* Gönder Butonu */}
                  <button
                    type="submit"
                    disabled={loading || !agree}
                    className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{loading ? 'Kayıt yapılıyor...' : 'Üye Ol'}</span>
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

      <AppealModal
        isOpen={appealOpen}
        onClose={() => setAppealOpen(false)}
        initialEmail={email}
        initialPhone={phone}
        initialName={isCarrier ? companyName : name}
      />
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
