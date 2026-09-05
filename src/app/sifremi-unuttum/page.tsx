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
  Check
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

export default function SifremiUnuttumPage() {
  const router = useRouter();

  // Steps: 'PHONE' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      {/* Outer Card Container (Split Screen) */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-200/80 items-stretch">
        
        {/* ── LEFT PANEL: Branded Visual & Trust (Same as giris & kayit) ── */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0A1128] via-[#101D42] to-[#1E3264] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden h-full">
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
                Sisteme kayıtlı telefon numaranıza gönderilen tek kullanımlık SMS onay kodu ile hesabınıza anında yeniden güvenli erişim sağlayın.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                'SMS ile 10 saniyede hızlı doğrulama',
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
          <div className="max-w-md w-full mx-auto">
            
            {/* Top Back Link */}
            <div className="mb-6">
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#F95700] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Giriş Ekranına Dön
              </Link>
            </div>

            {/* Title Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                Şifre Sıfırlama
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {step === 'PHONE' && 'Telefon numaranızı girerek onay kodu talep edin.'}
                {step === 'OTP' && 'Telefonunuza gelen 6 haneli kodu giriniz.'}
                {step === 'NEW_PASSWORD' && 'Yeni güvenli şifrenizi belirleyiniz.'}
                {step === 'SUCCESS' && 'Şifreniz yenilendi, profilinize aktarılıyorsunuz!'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 1: PHONE INPUT ── */}
            {step === 'PHONE' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">
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
                      className="w-full border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                    Hesabınıza kayıtlı 10 haneli cep telefonu numaranızı girin.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'SMS Gönderiliyor...' : 'Doğrulama Kodu Gönder'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP INPUT ── */}
            {step === 'OTP' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-xs font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F95700] shrink-0" />
                  <span>{phone} numarasına 6 haneli onay kodu gönderildi.</span>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">
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
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-black tracking-widest text-[#0A1128] placeholder:text-slate-300 focus:border-[#F95700] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="flex-1 py-3 px-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-3 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                  <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">
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
                      className="w-full border-2 border-slate-200 rounded-2xl pl-11 pr-11 py-3 text-sm font-bold text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">
                    Yeni Şifrenizi Tekrar Girin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Şifreyi tekrar yazın"
                      required
                      className="w-full border-2 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-[#0A1128] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm transition-all shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle & Giriş Yap'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ── STEP 4: SUCCESS & AUTO REDIRECT ── */}
            {step === 'SUCCESS' && (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/15">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#0A1128]">
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
