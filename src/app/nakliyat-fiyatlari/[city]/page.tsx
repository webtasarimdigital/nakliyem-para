import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TrendingUp, MapPin, ArrowRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { buildFAQSchema } from '@/lib/seo/schema';

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
    title: `${cityObj.name} Nakliyat Fiyatları 2026 (Oda Oda Maliyet Tablosu)`,
    description: `${cityObj.name} evden eve nakliyat fiyatları 2026 yılında ne kadar? 1+1, 2+1, 3+1 daireler için güncel taşıma maliyetleri, asansör ve ambalaj dahil fiyat listesi.`,
    keywords: [
      `${cityObj.name} nakliyat fiyatları 2026`,
      `${cityObj.name} ev taşıma ücretleri`,
      `${cityObj.name} nakliye ne kadar`,
    ],
    alternates: { canonical: `/nakliyat-fiyatlari/${cityObj.slug}` },
  };
}

export default async function CityNakliyatFiyatlariPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const faqs = [
    {
      question: `${cityObj.name} içi nakliye kaç TL tutar?`,
      answer: `${cityObj.name} şehir içi ev taşıma ortalama 8.500 TL ile 32.000 TL arasında değişmektedir. Eşya hacmi ve kat durumu net fiyatı belirler.`,
    },
    {
      question: `Fiyat teklifine neler dahildir?`,
      answer: `TaşınTeklif üzerindeki onaylı tekliflere araç nakliyesi, eşyaların demonte edilip sarılması, yükleme, boşaltma ve mobilya montajı dahildir.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd data={buildFAQSchema(faqs)} />
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Fiyat Rehberleri', url: '/blog/evden-eve-nakliyat-fiyatlari-2026' },
                { name: `${cityObj.name} Fiyatları`, url: `/nakliyat-fiyatlari/${cityObj.slug}` },
              ]}
            />
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{cityObj.name} 2026 Maliyet Analizi</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              {cityObj.name} Nakliyat Fiyatları 2026 <br />
              <span className="text-[#F95700]">Güncel Ev Taşıma Ücretleri</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {cityObj.name} bölgesinde 1+1, 2+1, 3+1 ve villa taşımacılığında 2026 yılı gerçek piyasa verileri ve ortalama fiyat tablosu.
            </p>
            <div className="pt-2">
              <Link href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="lg" className="font-black px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {cityObj.name} İçin Net Teklif Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { home: '1+1 Daire', range: '8.500 TL – 14.500 TL', crew: '2-3 Taşıyıcı Personel', truck: 'Küçük Kamyonet' },
            { home: '2+1 Daire', range: '14.000 TL – 22.000 TL', crew: '3-4 Personel + Marangoz', truck: 'Orta Kapalı Kasa' },
            { home: '3+1 Daire', range: '20.000 TL – 32.000 TL', crew: '4-5 Personel + Marangoz', truck: 'Büyük Boy Kamyon' },
            { home: '4+1 & Villa', range: '30.000 TL – 50.000 TL+', crew: '5+ Personel + Şef', truck: 'Çift Kasa / 10 Teker' },
          ].map(c => (
            <div key={c.home} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
              <span className="font-extrabold text-sm text-[#111E38] block">{c.home}</span>
              <span className="font-black text-xl text-[#F95700] block">{c.range}</span>
              <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                <p>• {c.crew}</p>
                <p>• {c.truck}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
