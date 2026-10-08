import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Building2, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { buildServiceSchema } from '@/lib/seo/schema';

export async function generateStaticParams() {
  return TURKEY_CITIES.map(city => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  return {
    title: `${cityObj.name} Ofis ve İşyeri Taşıma Fiyatları 2026`,
    description: `${cityObj.name} kurumsal ofis, büro ve işyeri nakliyat firmaları. Sıfır iş kaybı odaklı hafta sonu ve gece taşımacılığı teklifleri alın.`,
    keywords: [`${cityObj.name} ofis taşıma`, `${cityObj.name} işyeri nakliyesi`, `${cityObj.name} kurumsal taşımacılık`],
    alternates: { canonical: `/ofis-tasima/${cityObj.slug}` },
  };
}

export default async function CityOfisTasimaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const serviceSchema = buildServiceSchema({
    name: `${cityObj.name} Ofis Taşıma`,
    serviceType: 'OfficeMoving',
    description: `${cityObj.name} şirketleri ve kurumları için profesyonel ofis nakliyatı.`,
    url: `/ofis-tasima/${cityObj.slug}`,
    areaServed: cityObj.name,
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd data={serviceSchema} />
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Ofis Taşıma', url: '/ofis-tasima' },
                { name: `${cityObj.name} Ofis Taşıma`, url: `/ofis-tasima/${cityObj.slug}` },
              ]}
            />
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#146EF5] text-xs font-bold border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>{cityObj.name} Kurumsal Ofis Çözümleri</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              {cityObj.name} Ofis &amp; İşyeri Taşıma <br />
              <span className="text-[#F95700]">Planlı Kurumsal Nakliyat</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {cityObj.name} genelinde çalışma alanlarınızı iş kaybı olmadan yeni adresine taşıyın. Bilişim sistemleri, arşiv dolapları ve çalışma masaları özel ambalajla taşınır.
            </p>
            <div className="pt-2">
              <Link href={`/teklif-al?service=ofis-tasima&originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="lg" className="font-black px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {cityObj.name} Ofis Teklifi Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
