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
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { buildServiceSchema, buildFAQSchema } from '@/lib/seo/schema';

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
    title: `${cityObj.name} Evden Eve Nakliyat Fiyatları 2026 (Teklif Al)`,
    description: `${cityObj.name} evden eve nakliyat fiyatları ne kadar? ${cityObj.name} içi ve şehirler arası asansörlü, sigortalı ve marangozlu ev taşıma firmalarından anında ücretsiz fiyat teklifi toplayın.`,
    keywords: [
      `${cityObj.name} evden eve nakliyat`,
      `${cityObj.name} ev taşıma fiyatları`,
      `${cityObj.name} asansörlü nakliyat`,
      `${cityObj.name} nakliye firmaları 2026`,
    ],
    alternates: {
      canonical: `/evden-eve-nakliyat/${cityObj.slug}`,
    },
    openGraph: {
      title: `${cityObj.name} Evden Eve Nakliyat | TaşınTeklif`,
      description: `${cityObj.name} onaylı nakliyat firmalarından komisyonsuz teklif alın.`,
      url: `https://tasinteklif.com/evden-eve-nakliyat/${cityObj.slug}`,
    },
  };
}

export default async function CityEvdenEvePage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const carriers = db.getCarriers().filter(
    c =>
      c.verificationStatus === 'APPROVED' &&
      (c.city === cityObj.name ||
        c.serviceAreas.includes(cityObj.name) ||
        c.serviceAreas.includes('TÜM_TÜRKİYE'))
  );

  const serviceSchema = buildServiceSchema({
    name: `${cityObj.name} Evden Eve Nakliyat`,
    serviceType: 'ResidentialMoving',
    description: `${cityObj.name} ve tüm ilçelerinde ambalajlı, marangozlu ve sigortalı evden eve nakliyat hizmeti.`,
    url: `/evden-eve-nakliyat/${cityObj.slug}`,
    areaServed: cityObj.name,
  });

  const cityFaqs = [
    {
      question: `${cityObj.name} evden eve nakliyat fiyatları nasıl hesaplanır?`,
      answer: `${cityObj.name} genelinde oda sayısı (1+1, 2+1, 3+1), kat yüksekliği, bina asansörü ve taşınacak mesafe temel alınarak teklif verilir. Ortalama şehir içi fiyat 14.000 TL – 24.000 TL aralığındadır.`,
    },
    {
      question: `${cityObj.name} için asansörlü ev taşıma gerekli mi?`,
      answer: `3. kat ve üzeri binalarda dar merdiven boşlukları eşyaların hasar görmesine yol açabilir. Araç üstü hidrolik mobil asansör eşya güvenliği ve hız açısından şiddetle tavsiye edilir.`,
    },
    {
      question: `${cityObj.name} nakliyat firmalarında mobilya montajı fiyata dahil mi?`,
      answer: `TaşınTeklif üzerindeki onaylı tekliflerin tamamında standart yatak odası ve yemek odası mobilyalarının sökülüp takılması (marangozluk) fiyata dahildir.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd data={serviceSchema} />
      <JsonLd data={buildFAQSchema(cityFaqs)} />

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Evden Eve Nakliyat', url: '/evden-eve-nakliyat' },
                { name: `${cityObj.name} Evden Eve Nakliyat`, url: `/evden-eve-nakliyat/${cityObj.slug}` },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cityObj.name} Profesyonel Ev Taşıma</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              {cityObj.name} Evden Eve Nakliyat <br />
              <span className="text-[#F95700]">Fiyatları &amp; Teklif Al</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              {cityObj.name} genelinde {cityObj.districts.length} ilçede K3 yetki belgeli, sigortalı ve marangozlu ev taşıma şirketlerini karşılaştırın. TaşınTeklif ile aracı komisyonu olmadan sabit fiyat garantisiyle taşının.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href={`/teklif-al?service=evden-eve&originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="lg" className="font-black px-8 shadow-lg shadow-orange-950/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {cityObj.name} Teklifi Al
                </Button>
              </Link>
              <Link href={`/nakliyat-firmalari/${cityObj.slug}`}>
                <Button variant="outline" size="lg" className="font-bold border-slate-300 text-[#111E38]">
                  {cityObj.name} Firmalarını Gör ({carriers.length})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Price Table 2026 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111E38]">
                {cityObj.name} 2026 Ortalama Ev Taşıma Fiyat Tablosu
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Daire büyüklüğüne göre ortalama şehir içi anahtar teslim maliyetler.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shrink-0">
              2026 Güncel
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: '1+1 Daire', price: '8.500 TL – 14.500 TL', desc: '2-3 personel, ambalaj, küçük araç' },
              { type: '2+1 Daire', price: '14.000 TL – 22.000 TL', desc: 'Marangoz montajı, orta boy kamyon' },
              { type: '3+1 Daire', price: '20.000 TL – 32.000 TL', desc: 'Full paketleme, büyük nakliye aracı' },
              { type: '4+1 & Dubleks', price: '30.000 TL – 48.000 TL+', desc: 'Geniş ekip, özel ambalajlama' },
            ].map(item => (
              <div key={item.type} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{item.type}</span>
                <span className="text-lg font-black text-[#F95700] block">{item.price}</span>
                <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Districts Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-[#111E38]">
            {cityObj.name} İlçelerinde Evden Eve Nakliyat
          </h2>
          <div className="flex flex-wrap gap-2">
            {cityObj.districts.map(d => (
              <Link
                key={d}
                href={`/nakliyat-firmalari/${cityObj.slug}/${d
                  .toLowerCase()
                  .replace(/ğ/g, 'g')
                  .replace(/ü/g, 'u')
                  .replace(/ş/g, 's')
                  .replace(/ı/g, 'i')
                  .replace(/ö/g, 'o')
                  .replace(/ç/g, 'c')}`}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-[#F95700] border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                {d} Evden Eve Nakliyat
              </Link>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-black text-[#F95700] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Sıkça Sorulan Sorular</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#111E38]">
            {cityObj.name} Evden Eve Nakliyat Hakkında Merak Edilenler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cityFaqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-[#111E38]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
