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
    }, 600);
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
    }, 500);
  };

  // 3. Step: Set New Password & Update DB
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
      // Update in mock-db
      const updated = db.updateUserPassword(phone, newPassword);
      setLoading(false);
      setStep('SUCCESS');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-4xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-200/80 p-6 sm:p-8">
        
        {/* Top Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#F95700] flex items-center justify-center shadow-md shadow-orange-900/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-[#0A1128] tracking-tight">
              nakliyem<span className="text-[#F95700]">.para</span>
            </span>
          </Link>

          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <KeyRound className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-black text-[#0A1128] tracking-tight">
            Şifre Sıfırlama
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            {step === 'PHONE' && 'Telefon numaranızı girin, sıfırlama kodunu gönderelim.'}
            {step === 'OTP' && `${phone} numaralı telefona gönderilen onay kodunu giriniz.`}
            {step === 'NEW_PASSWORD' && 'Hesabınız için yeni bir şifre belirleyin.'}
            {step === 'SUCCESS' && 'Şifreniz başarıyla sıfırlandı!'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: PHONE INPUT ── */}
        {step === 'PHONE' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Kayıtlı Telefon Numarası
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Kod gönderiliyor...' : 'Doğrulama Kodu Gönder'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP VERIFICATION ── */}
        {step === 'OTP' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                SMS Onay Kodu
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="61"
                required
                autoFocus
                className="w-full text-center text-2xl font-black tracking-widest border-2 border-slate-200 rounded-xl py-3 text-slate-900 placeholder:text-slate-300 focus:border-[#F95700] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="flex-1 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{loading ? 'Doğrulanıyor...' : 'Kodu Onayla'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: NEW PASSWORD ── */}
        {step === 'NEW_PASSWORD' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Yeni Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                  minLength={6}
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
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

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Yeni Şifre (Tekrar)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-11 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Güncelleniyor...' : 'Yeni Şifremi Kaydet'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* ── STEP 4: SUCCESS ── */}
        {step === 'SUCCESS' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Şifreniz Değiştirildi</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Yeni şifreniz veritabanında başarıyla güncellendi. Şimdi giriş yapabilirsiniz.
              </p>
            </div>

            <Link href="/giris" className="block w-full">
              <button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span>Giriş Yap Sayfasına Git</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        )}

        {/* Bottom Link */}
        <div className="mt-6 text-center pt-4 border-t border-slate-100">
          <Link href="/giris" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Giriş Yap sayfasına dön</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
