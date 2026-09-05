'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Check, 
  Smartphone, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

export default function AdminContentManagerPage() {
  const [settings, setSettings] = useState(db.getSettings());
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
            İçerik & Ana Sayfa Yönetimi
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> İçerik ayarları başarıyla kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
        <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3">
          Mobil Uygulama İndirme Bandı Metinleri
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Üst Bant Başlığı</label>
            <input
              type="text"
              value={settings.mobileAppBandTitle}
              onChange={(e) => setSettings({ ...settings, mobileAppBandTitle: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Üst Bant Alt Açıklaması</label>
            <input
              type="text"
              value={settings.mobileAppBandSubtitle}
              onChange={(e) => setSettings({ ...settings, mobileAppBandSubtitle: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">App Store Linki</label>
              <input
                type="text"
                value={settings.appStoreUrl}
                onChange={(e) => setSettings({ ...settings, appStoreUrl: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Google Play Linki</label>
              <input
                type="text"
                value={settings.googlePlayUrl}
                onChange={(e) => setSettings({ ...settings, googlePlayUrl: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            İçerikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
