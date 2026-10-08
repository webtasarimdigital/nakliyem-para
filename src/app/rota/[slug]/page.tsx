import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin,
  MoveRight,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { INTERCITY_ROUTES, getIntercityRouteBySlug } from '@/lib/data/routes-data';
import { buildServiceSchema, buildFAQSchema } from '@/lib/seo/schema';
import { db } from '@/lib/data/mock-db';

export async function generateStaticParams() {
  return INTERCITY_ROUTES.map(route => ({
    slug: route.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = getIntercityRouteBySlug(slug);

  if (!route) {
    return {
      title: 'Rota Bulunamadı',
      robots: { index: false },
    };
  }

  return {
    title: route.metaTitle,
    description: route.metaDescription,
    keywords: [
      `${route.originCity} ${route.destinationCity} nakliyat`,
      `${route.originCity} ${route.destinationCity} evden eve`,
      `${route.originCity} ${route.destinationCity} nakliye fiyatları 2026`,
      'şehirlerarası nakliyat',
    ],
    alternates: {
      canonical: `/rota/${route.slug}`,
    },
    openGraph: {
      title: `${route.title} | TaşınTeklif`,
      description: route.metaDescription,
      url: `https://tasinteklif.com/rota/${route.slug}`,
      type: 'website',
    },
  };
}

export default async function IntercityRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getIntercityRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const serviceSchema = buildServiceSchema({
    name: route.title,
    serviceType: 'IntercityMoving',
    description: route.overview,
    url: `/rota/${route.slug}`,
    areaServed: `${route.originCity} - ${route.destinationCity}`,
  });

  const faqSchema = buildFAQSchema(route.faqs);

  // Get sample carriers serving origin or destination
  const carriers = db.getCarriers().filter(
    c =>
      c.verificationStatus === 'APPROVED' &&
      (c.city === route.originCity ||
        c.city === route.destinationCity ||
        c.serviceAreas.includes(route.originCity) ||
        c.serviceAreas.includes('TÜM_TÜRKİYE'))
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-10 sm:py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Rotalar', url: '/rota/istanbul-ankara-nakliyat' },
                { name: `${route.originCity} - ${route.destinationCity} Nakliyat`, url: `/rota/${route.slug}` },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
                <Navigation className="w-3.5 h-3.5" />
                <span>Şehirlerarası Karayolu Rotası</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
                {route.originCity} ➔ {route.destinationCity} <br />
                <span className="text-[#F95700]">Evden Eve Nakliyat</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                {route.overview}
              </p>

              {/* Route Metric Cards */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <MapPin className="w-4 h-4 text-[#F95700]" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Karayolu Mesafesi</span>
                    <span className="text-sm font-black text-[#111E38]">{route.distanceKm} km</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Tahmini Seyir Süresi</span>
                    <span className="text-sm font-black text-[#111E38]">{route.durationHours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold block">Yasal Güvence</span>
                    <span className="text-sm font-black text-emerald-800">K3 &amp; Emtia Sigortası</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link href={`/teklif-al?originCity=${encodeURIComponent(route.originCity)}&destCity=${encodeURIComponent(route.destinationCity)}`}>
                  <Button variant="primary" size="lg" className="font-black px-8 shadow-lg shadow-orange-950/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Bu Rota İçin Fiyat Al
                  </Button>
                </Link>
                <Link href="/nakliyeci-defteri">
                  <Button variant="outline" size="lg" className="font-bold border-slate-300 text-[#111E38]">
                    Dönüş Yükü Bul
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Quick Summary Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xl space-y-4">
                <h3 className="font-black text-base text-[#111E38] flex items-center justify-between pb-3 border-b border-slate-100">
                  <span>2026 Ortalama Rota Fiyatları</span>
                  <span className="text-xs text-[#F95700] font-bold">Güncel</span>
                </h3>

                <div className="space-y-2.5">
                  {route.prices2026.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-[#111E38] block">{item.homeType}</span>
                        <span className="text-[10px] text-slate-400">{item.details}</span>
                      </div>
                      <span className="font-black text-xs sm:text-sm text-[#F95700] shrink-0 ml-2">
                        {item.priceRange}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-slate-400 font-medium">
                    * Fiyatlar kat, asansör ve ambalaj tercihine göre değişkenlik gösterebilir.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rota İpuçları & Uzman Rehberi */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#111E38]">
              {route.originCity} ➔ {route.destinationCity} Taşınma İpuçları
            </h2>
            <ul className="space-y-3 pt-2">
              {route.routeTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-4 shadow-2xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#111E38]">
              Bu Güzergahtaki Onaylı Nakliyeciler
            </h2>
            <div className="space-y-3 pt-1">
              {carriers.map(c => (
                <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-[#111E38] block">{c.companyName}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{c.city} • Puan: {c.rating || 4.8}/5</span>
                  </div>
                  <Link href={`/firma/${c.slug || c.id}`}>
                    <Button variant="outline" size="sm" className="text-xs font-bold">
                      İncele
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-black text-[#F95700] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Merak Edilen Sorular</span>
          </div>
          <h2 className="text-2xl font-black text-[#111E38]">
            {route.originCity} - {route.destinationCity} Nakliyat SSS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {route.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="font-bold text-sm text-[#111E38]">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diğer Rotalar Bağlantı Kutusu */}
        <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 text-center space-y-3">
          <h3 className="font-bold text-sm text-[#111E38]">Diğer Popüler Şehirlerarası Rotalar</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {INTERCITY_ROUTES.map(r => (
              <Link
                key={r.slug}
                href={`/rota/${r.slug}`}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#F95700] hover:border-orange-300 transition-all shadow-2xs"
              >
                {r.originCity} ➔ {r.destinationCity} ({r.distanceKm} km)
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
