'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Truck, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';

export default function DistrictDirectoryPage({ params }: { params: Promise<{ city: string; district: string }> }) {
  const resolvedParams = use(params);
  const citySlug = resolvedParams.city;
  const districtSlug = resolvedParams.district;

  const cityObj = TURKEY_CITIES.find(c => c.slug === citySlug) || TURKEY_CITIES[0];
  const matchedDistrict = cityObj.districts.find(d => 
    d.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c') === districtSlug.toLowerCase()
  ) || cityObj.districts[0] || 'Merkez';

  const carriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb (Spec Item 144) */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link href="/" className="hover:text-slate-800">Ana Sayfa</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/nakliyat-firmalari" className="hover:text-slate-800">Nakliyat Firmaları</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/nakliyat-firmalari/${cityObj.slug}`} className="hover:text-slate-800">{cityObj.name}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0A1128] font-bold">{matchedDistrict}</span>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] mb-3">
          {cityObj.name} {matchedDistrict} Nakliyat Firmaları
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {matchedDistrict} bölgesinde evden eve nakliyat, ofis taşıma ve asansörlü taşıma hizmeti veren yetkili ve onaylı nakliyat şirketleri.
        </p>
      </div>

      {/* Nearby Districts */}
      <div className="mb-8 p-4 rounded-xl bg-white border border-slate-200">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          {cityObj.name} Çevre İlçeleri
        </span>
        <div className="flex flex-wrap gap-2">
          {cityObj.districts.slice(0, 6).map(d => (
            <Link
              key={d}
              href={`/nakliyat-firmalari/${cityObj.slug}/${d.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')}`}
              className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-blue-50 hover:text-[#146EF5] text-xs font-medium text-slate-700 border border-slate-200"
            >
              {d}
            </Link>
          ))}
        </div>
      </div>

      {/* Carriers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carriers.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-6 shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                  <Truck className="w-7 h-7 text-[#146EF5]" />
                </div>
                <div>
                  <Link href={`/firma/${c.slug}`} className="font-bold text-base text-[#0A1128] group-hover:text-[#146EF5] truncate block">
                    {c.companyName}
                  </Link>
                  <div className="flex items-center text-amber-500 font-bold text-xs gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{c.rating > 0 ? c.rating.toFixed(1) : 'Yeni'}</span>
                    <span className="text-slate-400 font-normal">({c.reviewCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
                {c.shortBio}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}&originDistrict=${encodeURIComponent(matchedDistrict)}`}>
                <Button variant="primary" size="sm">
                  {matchedDistrict} Teklifi Al
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
  );
}
