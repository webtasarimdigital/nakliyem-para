'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  ArrowLeft, 
  Save, 
  Check, 
  ToggleLeft, 
  Smartphone, 
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { SystemSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Yönetici Şifre Değiştirme Durumları
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Canlı Şifre Güçlülük Kriterleri
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasDigit = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(newPassword);
  const isMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword !== confirmPassword) {
      setPassError('Yeni şifreler birbiriyle uyuşmuyor.');
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasDigit || !hasSpecial) {
      setPassError('Lütfen belirtilen tüm şifre güvenlik kriterlerini karşılayınız.');
      return;
    }

    setPassLoading(true);
    try {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(storedToken ? { 'Authorization': `Bearer ${storedToken}` } : {})
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPassSuccess(data.message || 'Yönetici şifreniz başarıyla değiştirildi.');
        if (data.token && typeof window !== 'undefined') {
          localStorage.setItem('admin_token', data.token);
          window.dispatchEvent(new Event('auth-changed'));
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassError(data.error || 'Şifre değiştirilemedi.');
      }
    } catch {
      setPassError('Sunucu bağlantısı sırasında bir hata oluştu.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-[#0A1128]">
            Sistem Ayarları & Özellik Bayrakları (Feature Flags)
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> Sistem ayarları başarıyla güncellendi.
        </div>
      )}

      {/* ── YÖNETİCİ ŞİFRE DEĞİŞTİRME & GÜVENLİK KARTI (OWASP Standartlarında) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#0A1128]">
                Yönetici Şifresi &amp; Güvenlik
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Admin panel giriş şifrenizi buradan değiştirebilirsiniz. Şifreniz bellek zorlu (scrypt) kriptografik algoritma ile tuzlanarak korunur ve kaba kuvvet (brute-force) saldırılarına karşı kilit koruması altındadır.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>OWASP Korumalı</span>
          </span>
        </div>

        {passSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-5 flex items-center gap-2.5 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-4 rounded-xl bg-red-100 text-red-900 text-xs font-bold mb-5 flex items-center gap-2.5 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-5 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Mevcut Şifre */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Mevcut Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Mevcut şifreniz..."
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Yeni Şifre */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Yeni Şifre <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni güçlü şifre..."
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Yeni Şifre Tekrar */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Yeni Şifre (Tekrar) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yeni şifrenizi tekrar girin..."
                  className="w-full p-2.5 pr-10 rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Canlı Güvenlik Kriterleri Çubuğu */}
          {newPassword && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Şifre Güvenlik Kriterleri:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 font-bold ${hasMinLength ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasMinLength ? '✓' : '○'} En az 8 karakter
                </div>
                <div className={`flex items-center gap-1.5 font-bold ${hasUpper ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasUpper ? '✓' : '○'} Büyük harf (A-Z)
                </div>
                <div className={`flex items-center gap-1.5 font-bold ${hasLower ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasLower ? '✓' : '○'} Küçük harf (a-z)
                </div>
                <div className={`flex items-center gap-1.5 font-bold ${hasDigit ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasDigit ? '✓' : '○'} Rakam (0-9)
                </div>
                <div className={`flex items-center gap-1.5 font-bold ${hasSpecial ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {hasSpecial ? '✓' : '○'} Özel karakter (!@#$)
                </div>
              </div>
              {confirmPassword && (
                <div className={`pt-2 border-t border-slate-200 text-[11px] font-bold flex items-center gap-1.5 ${isMatch ? 'text-emerald-700' : 'text-red-600'}`}>
                  {isMatch ? '✓ Şifreler birbiriyle eşleşiyor.' : '✕ Şifreler eşleşmiyor.'}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Şifre değiştirildiğinde diğer tüm cihazlardaki açık oturumlar derhal sonlandırılır.</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={passLoading}
              className="w-full sm:w-auto font-black shadow-sm"
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Şifreyi Güncelle &amp; Oturumları Yenile
            </Button>
          </div>
        </form>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 text-xs sm:text-sm">
        {/* Global Settings (Spec Item 173) */}
        <div>
          <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3 mb-4">
            Genel Platform Bilgileri
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Platform Marka Adı</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Müşteri Destek Telefonu</label>
              <input
                type="text"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Destek E-posta Adresi</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ücretsiz Deneme Süresi (Gün)</label>
              <input
                type="number"
                value={settings.trialDurationDays}
                onChange={(e) => setSettings({ ...settings, trialDurationDays: Number(e.target.value) })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Global Mobile App Top Band (Spec Item 5) */}
        <div>
          <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3 mb-4">
            Global Mobil Uygulama Üst Bandı
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.mobileAppBandActive}
                onChange={(e) => setSettings({ ...settings, mobileAppBandActive: e.target.checked })}
                className="w-5 h-5 text-[#146EF5]"
              />
              <span className="font-bold text-slate-800">Uygulama İndirme Bandı Sitede Aktif Olsun</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bant Başlığı</label>
                <input
                  type="text"
                  value={settings.mobileAppBandTitle}
                  onChange={(e) => setSettings({ ...settings, mobileAppBandTitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bant Açıklaması</label>
                <input
                  type="text"
                  value={settings.mobileAppBandSubtitle}
                  onChange={(e) => setSettings({ ...settings, mobileAppBandSubtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">App Store İndirme URL</label>
                <input
                  type="text"
                  value={settings.appStoreUrl}
                  onChange={(e) => setSettings({ ...settings, appStoreUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Play İndirme URL</label>
                <input
                  type="text"
                  value={settings.googlePlayUrl}
                  onChange={(e) => setSettings({ ...settings, googlePlayUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags (Spec Item 172) */}
        <div>
          <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3 mb-4">
            Modül Özellik Bayrakları (Feature Flags)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <span className="font-semibold text-slate-800">Dijital Pazarlama Hizmetleri Modülü</span>
              <input
                type="checkbox"
                checked={settings.featureFlags.digitalServicesEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  featureFlags: { ...settings.featureFlags, digitalServicesEnabled: e.target.checked }
                })}
                className="w-4 h-4 text-[#146EF5]"
              />
            </label>

            <label className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <span className="font-semibold text-slate-800">Rota ve Güzergâh Eşleştirme Motoru</span>
              <input
                type="checkbox"
                checked={settings.featureFlags.routeMatchingEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  featureFlags: { ...settings.featureFlags, routeMatchingEnabled: e.target.checked }
                })}
                className="w-4 h-4 text-[#146EF5]"
              />
            </label>

            <label className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <span className="font-semibold text-slate-800">Müşteri Yorum ve Değerlendirme Sistemi</span>
              <input
                type="checkbox"
                checked={settings.featureFlags.reviewsEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  featureFlags: { ...settings.featureFlags, reviewsEnabled: e.target.checked }
                })}
                className="w-4 h-4 text-[#146EF5]"
              />
            </label>

            <label className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
              <span className="font-semibold text-slate-800">Nakliyeci Pazaryeri (Kamyon/Ekipman)</span>
              <input
                type="checkbox"
                checked={settings.featureFlags.marketplaceEnabled}
                onChange={(e) => setSettings({
                  ...settings,
                  featureFlags: { ...settings.featureFlags, marketplaceEnabled: e.target.checked }
                })}
                className="w-4 h-4 text-[#146EF5]"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Tüm Ayarları Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
