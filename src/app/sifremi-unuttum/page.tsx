'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Award,
  Check,
  Mail
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';
import { sendPasswordResetFirebase } from '@/lib/firebase/auth';

export default function SifremiUnuttumPage() {
  const router = useRouter();

  // Method: 'EMAIL' | 'PHONE'
  const [method, setMethod] = useState<'EMAIL' | 'PHONE'>('EMAIL');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Steps: 'PHONE' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email Submit via Firebase Auth
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setLoading(true);
    const res = await sendPasswordResetFirebase(email.trim());
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setEmailSent(true);
    }
  };

  // 1. Step: Phone Submit
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Lütfen geçerli bir telefon numarası giriniz (En az 10 hane).');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 500);
  };

  // 2. Step: OTP Check
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = otpCode.trim();
    if (trimmed !== '61' && !trimmed.startsWith('61') && trimmed !== '616161') {
      setError('Girdiğiniz onay kodu hatalı veya süresi dolmuş. Lütfen tekrar deneyin.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('NEW_PASSWORD');
    }, 400);
  };

  // 3. Step: Set New Password, Update DB & Auto-Login
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler birbiriyle uyuşmuyor.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      db.updateUserPassword(phone, newPassword);

      const existing = db.getUserByPhone(phone) || db.getRegisteredUserByEmail(phone);
      const userRole = (existing?.role || 'CUSTOMER') as 'CUSTOMER' | 'CARRIER';
      const sessionUser = {
        id: existing?.id || (userRole === 'CARRIER' ? 'user_carr_1' : 'user_cust_1'),
        email: existing?.email || (userRole === 'CARRIER' ? 'mahmut@nakliyat.com' : 'omer@gmail.com'),
        phone,
        role: userRole,
        fullName: existing?.fullName || (userRole === 'CUSTOMER' ? 'Ömer Faruk' : undefined),
        companyName: existing?.companyName || (userRole === 'CARRIER' ? 'Mahmut Nakliyat' : undefined),
        carrierProfileId: userRole === 'CARRIER' ? (existing?.carrierId || 'c1') : undefined,
        createdAt: existing?.createdAt || new Date().toISOString()
      };

      // Set user session automatically
      db.setCurrentUser(sessionUser);

      setLoading(false);
      setStep('SUCCESS');

      // Seamless redirect straight to the user dashboard
      setTimeout(() => {
        if (userRole === 'CARRIER') {
          router.push('/app/carrier');
        } else {
          router.push('/app/customer');
        }
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#F8FAFC] flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80 items-stretch">
        
        {/* ── LEFT PANEL: Branded Visual & Trust (Hidden on mobile) ── */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#111E38] via-[#101D42] to-[#1E3264] p-8 sm:p-10 text-white flex-col justify-between relative overflow-hidden h-full">
          {/* Subtle Grid / Pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Top Badge */}
          <div className="relative z-10 flex items-center justify-end">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/10">
              Güvenli Hesap Kurtarma
            </span>
          </div>

          {/* Middle: Feature Card */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-[#F95700] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">Şifrenizi Kolayca Sıfırlayın</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Kayıtlı e-posta adresiniz veya telefon numaranız ile hesabınıza anında yeniden güvenli erişim sağlayın.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'E-posta veya SMS ile anında doğrulama',
                'Yeni şifrenizle doğrudan otomatik oturum açma',
                'Tüm talepleriniz ve teklifleriniz güvende'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F95700]/20 text-[#F95700] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] text-slate-300 font-medium leading-tight">
              256-Bit SSL şifreleme ile korunan resmi taşıma ve nakliye iş ağı.
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Clean Form ── */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-4">
            
            {/* Top Back Link */}
            <div className="mb-2">
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#F95700] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Giriş Ekranına Dön
              </Link>
            </div>

            {/* Logo ve Başlık */}
            <div className="flex flex-col items-center justify-center text-center space-y-2 mb-4">
              <Link href="/" className="inline-block group hover:scale-105 transition-transform">
                <img src="/images/logo.png" alt="TaşınTeklif" className="h-16 sm:h-20 w-auto object-contain mx-auto" />
              </Link>
              <h1 className="text-2xl font-black text-[#111E38] tracking-tight">Şifremi Unuttum</h1>
              <p className="text-sm text-slate-500 font-medium">
                {method === 'EMAIL'
                  ? emailSent
                    ? 'E-posta adresinize bağlantı gönderildi.'
                    : 'Hesabınızı kurtarmak için e-postanızı girin.'
                  : step === 'PHONE'
                  ? 'Telefon numaranızı girerek onay kodu talep edin.'
                  : step === 'OTP'
                  ? 'Telefonunuza gelen 6 haneli kodu giriniz.'
                  : step === 'NEW_PASSWORD'
                  ? 'Yeni güvenli şifrenizi belirleyiniz.'
                  : 'Şifreniz yenilendi, giriş yapılıyor...'}
              </p>
            </div>

            {/* Method Tabs (Only on initial step) */}
            {step === 'PHONE' && !emailSent && (
              <div className="flex p-1 bg-slate-100 rounded-full mb-4">
                <button
                  type="button"
                  onClick={() => { setMethod('EMAIL'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    method === 'EMAIL'
                      ? 'bg-[#111E38] text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>E-posta ile</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod('PHONE'); setError(''); }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    method === 'PHONE'
                      ? 'bg-[#111E38] text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>SMS ile</span>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* ── EMAIL METHOD FLOW ── */}
            {method === 'EMAIL' && (
              emailSent ? (
                <div className="space-y-4 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#111E38]">Bağlantı Gönderildi!</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                      <strong>{email}</strong> adresinize güvenli şifre sıfırlama bağlantısı gönderilmiştir. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol ediniz.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link href="/giris">
                      <button
                        type="button"
                        className="w-full py-3.5 px-6 rounded-xl bg-[#111E38] hover:bg-[#1b2a4a] text-white font-bold text-sm transition-all shadow-md cursor-pointer"
                      >
                        Giriş Ekranına Dön
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Kayıtlı E-posta Adresiniz
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="ornek@mail.com"
                        required
                        autoFocus
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )
            )}

            {/* ── STEP 1: PHONE INPUT ── */}
            {method === 'PHONE' && step === 'PHONE' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kayıtlı Telefon Numaranız
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0532 555 00 00"
                      required
                      autoFocus
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP INPUT ── */}
            {step === 'OTP' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F95700] shrink-0" />
                  <span>{phone} numarasına 6 haneli onay kodu gönderildi.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    SMS Onay Kodu
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value)}
                    placeholder="••••••"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-center text-lg font-bold tracking-widest text-slate-800 placeholder:text-slate-300 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-3 px-6 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Doğrulanıyor...' : 'Kodu Onayla'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: NEW PASSWORD ── */}
            {step === 'NEW_PASSWORD' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Yeni Şifreniz
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="En az 6 karakter"
                      required
                      autoFocus
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Yeni Şifrenizi Tekrar Girin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Şifreyi tekrar yazın"
                      required
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 sm:py-3 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#111E38] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle & Giriş Yap'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── STEP 4: SUCCESS & AUTO REDIRECT ── */}
            {step === 'SUCCESS' && (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/15">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#111E38]">
                  Şifreniz Başarıyla Güncellendi!
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                  Oturumunuz otomatik olarak açıldı. Panel ve profil sayfanıza aktarılıyorsunuz...
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F95700] bg-orange-50 px-4 py-2 rounded-xl">
                  <span className="w-2 h-2 rounded-full bg-[#F95700] animate-ping" />
                  <span>Yönlendiriliyor...</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
