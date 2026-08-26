'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Truck, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';

export default function CityDirectoryPage({ params }: { params: Promise<{ city: string }> }) {
  const resolvedParams = use(params);
  const citySlug = resolvedParams.city;
  const cityObj = TURKEY_CITIES.find(c => c.slug === citySlug) || TURKEY_CITIES[0]; // Default to Istanbul if not found

  const carriersInCity = db.getCarriers().filter(c => 
    c.verificationStatus === 'APPROVED' && (c.city === cityObj.name || c.serviceAreas.includes(cityObj.name) || c.serviceAreas.includes('TÜM_TÜRKİYE'))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb (Spec Item 143) */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-slate-800">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/nakliyat-firmalari" className="hover:text-slate-800">Nakliyat Firmaları</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-bold">{cityObj.name}</span>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          {cityObj.name} Nakliyat Firmaları
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {cityObj.name} içi ve {cityObj.name} çıkışlı şehirler arası evden eve nakliyat, ofis taşıma ve asansörlü nakliye hizmeti sunan onaylı firmalardan ücretsiz fiyat teklifi alın.
        </p>
      </div>

      {/* Districts Quick Links (Spec Item 143) */}
      <div className="mb-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          {cityObj.name} İlçeleri ({cityObj.districts.length} İlçe)
        </h2>
        <div className="flex flex-wrap gap-2">
          {cityObj.districts.map((dist) => (
            <Link
              key={dist}
              href={`/nakliyat-firmalari/${cityObj.slug}/${dist.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')}`}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#EAF3FF] hover:text-[#146EF5] text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
            >
              {dist} Nakliyat
            </Link>
          ))}
        </div>
      </div>

      {/* Dynamic City Ad Slot */}
      <DynamicAdSlot
        slotKey="city_page.featured"
        filter={{ city: cityObj.name }}
        title={`${cityObj.name} Öne Çıkan Sponsor Firmalar`}
        subtitle={`${cityObj.name} bölgesinde en çok tercih edilen doğrulanmış taşımacılık şirketleri.`}
      />

      {/* City Carriers Grid */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {cityObj.name} Bölgesine Hizmet Veren Firmalar ({carriersInCity.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carriersInCity.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <Truck className="w-7 h-7 text-[#146EF5]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/firma/${c.slug}`} className="font-bold text-base text-slate-900 group-hover:text-[#146EF5] truncate block">
                      {c.companyName}
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{c.rating > 0 ? c.rating.toFixed(1) : 'Yeni'}</span>
                        <span className="text-slate-400 font-normal">({c.reviewCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{c.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                  <Badge variant="verified" size="sm" />
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
                  {c.shortBio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}&preferredCarrier=${c.id}`}>
                  <Button variant="primary" size="sm">
                    Teklif İste
                  </Button>
                </Link>
                <Link href={`/firma/${c.slug}`}>
                  <Button variant="outline" size="sm">
                    İncele
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
