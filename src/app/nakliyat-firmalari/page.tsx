import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Truck, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Search,
  CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';

export const metadata: Metadata = {
  title: 'Onaylı Nakliyat Firmaları | Nakliyem Para',
  description: 'Türkiye genelinde 81 ilde hizmet veren onaylı, belgeli ve müşteri puanı yüksek evden eve nakliyat firmalarını listeleyin.',
  keywords: ['nakliyat firmaları', 'evden eve nakliyeciler', 'güvenilir nakliyat firmaları', 'en iyi nakliyat']
};

export default function NakliyatFirmalariDirectoryPage() {
  const carriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED');
  const popularCities = TURKEY_CITIES.filter(c => c.isPopular);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128] mb-3">
          Onaylı & Belgeli Nakliyat Firmaları
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Platformumuzda kayıtlı tüm firmaların vergi levhası ve yetkili kimlikleri kontrol edilmektedir. Şehrinizi seçerek bölgenizdeki en yüksek puanlı nakliyecileri inceleyin.
        </p>
      </div>

      {/* Popular Cities Row */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Şehre Göre Filtrele</h2>
        <div className="flex flex-wrap gap-2">
          {popularCities.map((city) => (
            <Link
              key={city.slug}
              href={`/nakliyat-firmalari/${city.slug}`}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] hover:text-[#F95700] text-xs font-bold text-slate-700 transition-all shadow-2xs"
            >
              {city.name} Nakliyat ({city.districts.length} İlçe)
            </Link>
          ))}
        </div>
      </div>

      {/* Sponsor Dynamic Ad Slot */}
      <DynamicAdSlot
        slotKey="companies.directory"
        title="Öne Çıkan Sponsor Nakliyat Şirketleri"
        subtitle="Yüksek müşteri memnuniyetine ve tam donanımlı araç filosuna sahip onaylı firmalar."
      />

      {/* All Verified Carriers Listing */}
      <div className="mt-10">
        <h2 className="text-xl font-black text-[#0A1128] mb-6">Tüm Doğrulanmış Firmalar ({carriers.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carriers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {c.logoUrl ? (
                      <img src={c.logoUrl} alt={c.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <Truck className="w-7 h-7 text-[#F95700]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link href={`/firma/${c.slug}`} className="font-black text-base text-[#0A1128] group-hover:text-[#F95700] truncate block">
                      {c.companyName}
                    </Link>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{c.rating > 0 ? c.rating.toFixed(1) : 'Yeni'}</span>
                        <span className="text-slate-400 font-normal">({c.reviewCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {c.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {c.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                  <Badge variant="verified" size="sm" />
                  {c.elevatorSpec?.hasElevator && <Badge variant="elevator" size="sm" />}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-6">
                  {c.shortBio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 font-medium">{c.completedJobsCount} Başarılı İş</span>
                <Link href={`/firma/${c.slug}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Profili İncele
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
