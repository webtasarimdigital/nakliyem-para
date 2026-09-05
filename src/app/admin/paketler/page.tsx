'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  Plus, 
  Check, 
  ArrowLeft, 
  Save, 
  Sparkles,
  SlidersHorizontal,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
import { SubscriptionPlan } from '@/types';

export default function AdminPlansBuilderPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(db.getPlans());
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>(plans[2]); // Gold
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateFeature = (key: keyof SubscriptionPlan['features'], val: any) => {
    setSelectedPlan({
      ...selectedPlan,
      features: {
        ...selectedPlan.features,
        [key]: val
      }
    });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    db.updatePlan(selectedPlan.id, selectedPlan);
    setPlans(db.getPlans());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-[#0A1128]">
            Abonelik Paketleri & Dinamik Yetki Yapılandırıcı
          </h1>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> Paket ayarları ve feature entitlement&apos;lar başarıyla kaydedildi.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (4/12): Plans List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanımlı Paketler</h2>
          {plans.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan.id === p.id
                  ? 'border-[#146EF5] bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#0A1128] text-sm">{p.name}</span>
                <span className="text-xs font-black text-[#0A1128]">{p.priceMonthly} TL/ay</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{p.tagline}</p>
            </div>
          ))}
        </div>

        {/* Right Col (8/12): Feature Config Form (Spec Item 168) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSavePlan} className="space-y-6 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-[#0A1128]">{selectedPlan.name} Paketi Düzenle</h2>
                <span className="text-xs text-slate-400">ID: {selectedPlan.id}</span>
              </div>
              <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
                Paketi Kaydet
              </Button>
            </div>

            {/* General plan info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Paket Adı</label>
                <input
                  type="text"
                  value={selectedPlan.name}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Aylık Fiyat (TL)</label>
                <input
                  type="number"
                  value={selectedPlan.priceMonthly}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, priceMonthly: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deneme Süresi (Gün)</label>
                <input
                  type="number"
                  value={selectedPlan.trialDays}
                  onChange={(e) => setSelectedPlan({ ...selectedPlan, trialDays: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>
            </div>

            {/* Feature Entitlements Checklist */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-[#0A1128] text-sm">Feature & Entitlement Yetkileri</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Teklif Oluşturma Yetkisi</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.offerCreate}
                    onChange={(e) => handleUpdateFeature('offerCreate', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>

                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Müşteri Telefon Numarası Erişimi</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.customerPhoneAccess}
                    onChange={(e) => handleUpdateFeature('customerPhoneAccess', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>

                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Ana Sayfa Sponsorlu Firma Gösterimi</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.featuredHomepage}
                    onChange={(e) => handleUpdateFeature('featuredHomepage', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>

                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Defter Akışı Sponsor Kartı</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.featuredNotebook}
                    onChange={(e) => handleUpdateFeature('featuredNotebook', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>

                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Şehir Sayfaları Üst Sponsorluk</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.featuredCityPages}
                    onChange={(e) => handleUpdateFeature('featuredCityPages', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>

                <label className="p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">Gelişmiş Görüntülenme Analitiği</span>
                  <input
                    type="checkbox"
                    checked={selectedPlan.features.analyticsAdvanced}
                    onChange={(e) => handleUpdateFeature('analyticsAdvanced', e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
