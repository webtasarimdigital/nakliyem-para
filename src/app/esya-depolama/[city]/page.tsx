import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Warehouse, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
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
    title: `${cityObj.name} Eşya Depolama Fiyatları & Kilitli Odalar 2026`,
    description: `${cityObj.name} ev ve ofis eşyası depolama hizmeti. 7/24 kameralı, rutubetsiz ve sigortalı aylık/yıllık kilitli oda tipi eşya deposu fiyat teklifleri.`,
    keywords: [`${cityObj.name} eşya depolama`, `${cityObj.name} ev eşyası deposu`, `${cityObj.name} kilitli oda depo`],
    alternates: { canonical: `/esya-depolama/${cityObj.slug}` },
  };
}

export default async function CityEsyaDepolamaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const serviceSchema = buildServiceSchema({
    name: `${cityObj.name} Eşya Depolama Hizmeti`,
    serviceType: 'SelfStorage',
    description: `${cityObj.name} bölgesinde 7/24 korumalı, kilitli ve sigortalı ev eşyası depolama.`,
    url: `/esya-depolama/${cityObj.slug}`,
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
                { name: 'Eşya Depolama', url: '/esya-depolama' },
                { name: `${cityObj.name} Eşya Depolama`, url: `/esya-depolama/${cityObj.slug}` },
              ]}
            />
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Warehouse className="w-3.5 h-3.5" />
              <span>{cityObj.name} Güvenli Depo Alanları</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              {cityObj.name} Eşya Depolama <br />
              <span className="text-[#F95700]">Kilitli &amp; Sigortalı Odalar</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Tadilat, yurtdışı seyahati veya yeni ev hazırlıklarında eşyalarınızı {cityObj.name} genelindeki rutubetsiz ve 7/24 güvenlik kameralı özel odalarda saklayın.
            </p>
            <div className="pt-2">
              <Link href={`/teklif-al?service=esya-depolama&originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="lg" className="font-black px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {cityObj.name} Depolama Fiyatı Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
