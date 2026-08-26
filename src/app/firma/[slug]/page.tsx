'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Share2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function PublicCarrierProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const carrier = db.getCarrierBySlug(resolvedParams.slug) || db.getCarriers()[0];
  const [activeTab, setActiveTab] = useState<'ABOUT' | 'SERVICES' | 'REVIEWS' | 'DEFTER'>('ABOUT');
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile Header (Spec Item 94) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-gradient-to-r from-[#0D1B2A] to-[#0B3B8F] relative">
          {carrier.coverImageUrl && (
            <img src={carrier.coverImageUrl} alt="Kapak" className="w-full h-full object-cover opacity-30" />
          )}
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          {/* Logo & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden shrink-0 flex items-center justify-center">
                {carrier.logoUrl ? (
                  <img src={carrier.logoUrl} alt={carrier.companyName} className="w-full h-full object-cover" />
                ) : (
                  <Truck className="w-12 h-12 text-[#146EF5]" />
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {carrier.companyName}
                  </h1>
                  {carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                  <Badge variant="verified" size="sm" />
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 flex-wrap">
                  <div className="flex items-center text-amber-500 font-bold gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{carrier.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({carrier.reviewCount} Müşteri Yorumu)</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {carrier.city} / {carrier.district}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2">
              <Link href={`/teklif-al?preferredCarrier=${carrier.id}`}>
                <Button variant="primary" size="md">
                  Ücretsiz Teklif İste
                </Button>
              </Link>

              {showPhone ? (
                <a href={`tel:${carrier.phone}`}>
                  <Button variant="secondary" size="md">
                    {carrier.phone}
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => setShowPhone(true)}
                >
                  Telefonu Gör
                </Button>
              )}
            </div>
          </div>

          {/* Verification Badges Checklist (Spec Item 95) */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Vergi Levhası Doğrulandı
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Firma Yetkilisi Kimliği Onaylı
            </span>

            {carrier.elevatorSpec?.hasElevator && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                {carrier.elevatorSpec.maxFloor}. Kata Kadar Mobil Asansör
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium ml-auto">
              🏆 {carrier.completedJobsCount} Başarılı Taşıma
            </span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        {[
          { id: 'ABOUT', label: 'Hakkında' },
          { id: 'SERVICES', label: 'Hizmetler & Bölgeler' },
          { id: 'REVIEWS', label: `Yorumlar (${carrier.reviewCount})` }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === t.id
                ? 'border-[#146EF5] text-[#146EF5]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {activeTab === 'ABOUT' && (
          <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Firma Tanıtımı</h3>
              <p>{carrier.shortBio}</p>
              {carrier.description && <p className="mt-3">{carrier.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs mb-1">Müşteri Yanıt Oranı</span>
                <span className="text-lg font-bold text-slate-900">%{carrier.responseRatePercent}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs mb-1">Tamamlanan Taşımalar</span>
                <span className="text-lg font-bold text-slate-900">{carrier.completedJobsCount} Taşıma</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs mb-1">Platform Üyeliği</span>
                <span className="text-lg font-bold text-slate-900">2023&apos;ten Beri</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SERVICES' && (
          <div className="space-y-6 text-xs sm:text-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Verilen Hizmetler</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {carrier.services.map((s) => (
                  <div key={s} className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[#0B3B8F] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#146EF5]" />
                    <span>{s === 'evden-eve' ? 'Evden Eve Nakliyat' : s === 'ofis-tasima' ? 'Ofis Taşıma' : s === 'mobil-asansor' ? 'Mobil Asansör' : s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">Düzenli Hizmet Verilen Şehirler</h3>
              <div className="flex flex-wrap gap-2">
                {carrier.serviceAreas.map((city) => (
                  <span key={city} className="px-3 py-1.5 rounded-lg bg-slate-100 font-semibold text-slate-700">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'REVIEWS' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
              <div>
                <span className="font-bold block text-sm">Genel Memnuniyet: ★ {carrier.rating.toFixed(1)} / 5.0</span>
                <span className="text-slate-600">Yalnızca işi bu firmaya vermiş gerçek müşterilerin değerlendirmeleridir.</span>
              </div>
              <Badge variant="verified" size="sm" />
            </div>

            {[
              {
                name: 'Hakan Demir',
                route: 'İstanbul / Kadıköy → Ankara / Çankaya',
                rating: 5,
                comment: 'Zamanında geldiler, tüm mobilyaları özenle patpat naylon ile sardılar. Çiziksiz teslim aldık, Murat Bey ve ekibine teşekkür ederim.',
                date: '12 Ağustos 2026'
              },
              {
                name: 'Selin Yurt',
                route: 'İstanbul / Ataşehir → İzmir / Bornova',
                rating: 5,
                comment: 'Dış cephe asansörü ile 8. kata çok hızlı ve güvenli taşıdılar. Fiyatta anlaştığımız gibiydi, hiçbir ekstra masraf çıkarmadılar.',
                date: '5 Ağustos 2026'
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.name}</span>
                    <span className="text-amber-500 font-bold">★ {rev.rating}.0</span>
                  </div>
                  <span className="text-xs text-slate-400">{rev.date}</span>
                </div>
                <span className="text-xs text-slate-500 block font-medium">{rev.route}</span>
                <p className="text-slate-700 leading-relaxed">&quot;{rev.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
