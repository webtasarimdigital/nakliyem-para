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
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { SystemSettings } from '@/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

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
