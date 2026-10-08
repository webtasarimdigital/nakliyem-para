import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Package, MapPin, Truck, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
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
    title: `${cityObj.name} Parça Eşya Taşıma & Parsiyel Nakliyat`,
    description: `${cityObj.name} içi ve ${cityObj.name} çıkışlı şehirler arası parça eşya taşıma fiyatları. Tek koltuk, beyaz eşya ve koli için ekonomik parsiyel nakliye teklifleri alın.`,
    keywords: [`${cityObj.name} parça eşya taşıma`, `${cityObj.name} parsiyel nakliyat`, `${cityObj.name} az eşya taşıma`],
    alternates: { canonical: `/parca-esya-tasima/${cityObj.slug}` },
  };
}

export default async function CityParcaEsyaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city) || TURKEY_CITIES[0];

  const serviceSchema = buildServiceSchema({
    name: `${cityObj.name} Parça Eşya Taşıma`,
    serviceType: 'PartialMoving',
    description: `${cityObj.name} ve çevre illere parsiyel ve tek parça eşya taşımacılığı.`,
    url: `/parca-esya-tasima/${cityObj.slug}`,
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
                { name: 'Parça Eşya Taşıma', url: '/parca-esya-tasima' },
                { name: `${cityObj.name} Parça Eşya`, url: `/parca-esya-tasima/${cityObj.slug}` },
              ]}
            />
          </div>
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <Package className="w-3.5 h-3.5" />
              <span>{cityObj.name} Ekonomik Parsiyel Nakliye</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              {cityObj.name} Parça Eşya Taşıma <br />
              <span className="text-[#F95700]">Uygun Fiyatlı Nakliyat</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Tek bir buzdolabı, koltuk takımı veya birkaç valiz eşyanız için komple kamyon tutmanıza gerek yok. {cityObj.name} çıkışlı paylaşımlı araçlarla bütçenizi %50 koruyun.
            </p>
            <div className="pt-2">
              <Link href={`/teklif-al?service=parca-esya&originCity=${encodeURIComponent(cityObj.name)}`}>
                <Button variant="primary" size="lg" className="font-black px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {cityObj.name} Parça Eşya Teklifi Al
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Beyaz Eşya Taşıma', desc: 'Buzdolabı, çamaşır makinesi ve fırın ambalajlanarak güvenle nakledilir.' },
            { title: 'Mobilya & Koltuk', desc: 'Koltuk takımı, masa veya gardırop demonte edilip sarılarak taşınır.' },
            { title: 'Öğrenci & Bekar Eşyası', desc: 'Birkaç koli ve küçük eşyalar dönüş yapan araçlarla ucuza gönderilir.' },
          ].map(box => (
            <div key={box.title} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-2">
              <h3 className="font-extrabold text-base text-[#111E38]">{box.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{box.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
