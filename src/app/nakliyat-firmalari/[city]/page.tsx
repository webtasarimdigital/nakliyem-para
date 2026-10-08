import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  MapPin,
  Truck,
  Star,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { buildItemListSchema, buildFAQSchema } from '@/lib/seo/schema';

export async function generateStaticParams() {
  return TURKEY_CITIES.map(city => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  return {
    title: `${cityObj.name} Nakliyat Firmaları ve Evden Eve Taşıma Fiyatları`,
    description: `${cityObj.name} evden eve nakliyat firmaları, asansörlü taşıma ve sigortalı nakliye fiyat teklifleri. ${cityObj.name} onaylı nakliyecilerini listeleyin ve ücretsiz teklif alın.`,
    keywords: [
      `${cityObj.name} nakliyat firmaları`,
      `${cityObj.name} evden eve nakliyat`,
      `${cityObj.name} asansörlü nakliyat`,
      `${cityObj.name} şehirler arası nakliyat`,
    ],
    alternates: {
      canonical: `/nakliyat-firmalari/${cityObj.slug}`,
    },
    openGraph: {
      title: `${cityObj.name} Nakliyat Firmaları | TaşınTeklif`,
      description: `${cityObj.name} genelinde onaylı, K3 belgeli evden eve nakliye firmalarından teklif toplayın.`,
      url: `https://tasinteklif.com/nakliyat-firmalari/${cityObj.slug}`,
    },
  };
}

export default async function CityDirectoryPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const carriersInCity = db.getCarriers().filter(
    c =>
      c.verificationStatus === 'APPROVED' &&
      (c.city === cityObj.name ||
        c.serviceAreas.includes(cityObj.name) ||
        c.serviceAreas.includes('TÜM_TÜRKİYE'))
  );

  const itemListSchema = buildItemListSchema(
    carriersInCity.slice(0, 15).map(c => ({
      name: c.companyName,
      url: `/firma/${c.slug || c.id}`,
      description: `${cityObj.name} evden eve nakliyat ve asansörlü taşımacılık hizmeti`,
    })),
    `${cityObj.name} Onaylı Nakliyat Firmaları`
  );

  const cityFaqs = [
    {
      question: `${cityObj.name} evden eve nakliyat fiyatları ne kadar?`,
      answer: `${cityObj.name} şehir içi evden eve nakliyat fiyatları 1+1 daire için ortalama 8.500 TL – 14.500 TL, 2+1 daire için 14.000 TL – 22.000 TL, 3+1 daire için 20.000 TL – 32.000 TL arasındadır.`,
    },
    {
      question: `${cityObj.name} ilçelerine asansörlü nakliye hizmeti var mı?`,
      answer: `Evet, platformumuzdaki ${cityObj.name} nakliyecileri yüksek katlı binalar için araç üstü hidrolik dış cephe asansörü kurarak taşımayı gerçekleştirmektedir.`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={itemListSchema} />
      <JsonLd data={buildFAQSchema(cityFaqs)} />

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: '/' },
            { name: 'Nakliyat Firmaları', url: '/nakliyat-firmalari' },
            { name: cityObj.name, url: `/nakliyat-firmalari/${cityObj.slug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-3 border border-orange-200">
          <MapPin className="w-3.5 h-3.5" />
          <span>{cityObj.name} Nakliye Rehberi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111E38] mb-3">
          {cityObj.name} Nakliyat Firmaları &amp; Ev Taşıma Fiyatları
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {cityObj.name} içi ve {cityObj.name} çıkışlı şehirler arası evden eve nakliyat, ofis taşıma ve asansörlü nakliye hizmeti sunan onaylı firmalardan komisyonsuz, ücretsiz fiyat teklifi alın.
        </p>
      </div>

      {/* Quick Quote Widget Bar */}
      <div className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-[#111E38] to-[#1c305c] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-xs text-orange-400 font-bold block">
            {cityObj.name} İçi veya Şehirlerarası Taşınma
          </span>
          <h3 className="font-extrabold text-base sm:text-lg">
            {cityObj.name} Bölgesinde 2 Dakikada Fiyat Teklifi Alın
          </h3>
        </div>
        <Link
          href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}`}
          className="w-full sm:w-auto shrink-0"
        >
          <Button
            variant="primary"
            size="md"
            className="w-full font-black px-6 shadow-md shadow-orange-950/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {cityObj.name} Teklifi Al
          </Button>
        </Link>
      </div>

      {/* Districts Quick Links */}
      <div className="mb-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h2 className="text-xs font-bold text-[#111E38] uppercase tracking-wider mb-3">
          {cityObj.name} İlçeleri ({cityObj.districts.length} İlçe)
        </h2>
        <div className="flex flex-wrap gap-2">
          {cityObj.districts.map(dist => (
            <Link
              key={dist}
              href={`/nakliyat-firmalari/${cityObj.slug}/${dist
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')}`}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#EAF3FF] hover:text-[#F95700] text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
            >
              {dist} Nakliyat
            </Link>
          ))}
        </div>
      </div>

      {/* City Carriers Grid */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#111E38] mb-6">
          {cityObj.name} Bölgesine Hizmet Veren Onaylı Firmalar ({carriersInCity.length})
        </h2>

        {carriersInCity.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
            <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">
              Bu şehir için doğrudan kayıtlı firma bulunamadı. Ancak Türkiye geneli hizmet veren onaylı filolarımız güzergahınıza teklif verebilir.
            </p>
            <div className="mt-4">
              <Link href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="sm">
                  Genel Talep Oluştur
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carriersInCity.map(c => (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                      {c.logoUrl ? (
                        <img
                          src={c.logoUrl}
                          alt={c.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Truck className="w-7 h-7 text-[#F95700]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/firma/${c.slug || c.id}`}
                        className="font-bold text-base text-[#111E38] group-hover:text-[#F95700] truncate block transition-colors"
                      >
                        {c.companyName}
                      </Link>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{c.rating > 0 ? c.rating.toFixed(1) : '4.8'}</span>
                          <span className="text-slate-400 font-normal">
                            ({c.reviewCount || 12})
                          </span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{c.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> K3 Belgeli
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                      Sigortalı Taşıma
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {c.shortBio ||
                      `${cityObj.name} ve tüm ilçelerinde uzman personelle evden eve, ofis ve parça eşya taşımacılığı.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}&preferredCarrier=${c.id}`}
                  >
                    <Button variant="primary" size="sm">
                      Teklif İste
                    </Button>
                  </Link>
                  <Link href={`/firma/${c.slug || c.id}`}>
                    <Button variant="outline" size="sm">
                      İncele
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
        <div className="flex items-center gap-2 text-xs font-black text-[#F95700] uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Sıkça Sorulan Sorular</span>
        </div>
        <h2 className="text-2xl font-black text-[#111E38]">
          {cityObj.name} Evden Eve Nakliyat Hakkında
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <h3 className="font-bold text-sm text-[#111E38]">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
