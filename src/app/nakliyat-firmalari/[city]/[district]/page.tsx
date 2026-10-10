import React from 'react';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import {
  MapPin,
  Truck,
  Star,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { buildItemListSchema } from '@/lib/seo/schema';
import { getDistrictSlug, isMatchingDistrict } from '@/lib/utils/slug';

export async function generateStaticParams() {
  const params: { city: string; district: string }[] = [];
  for (const city of TURKEY_CITIES) {
    for (const d of city.districts) {
      params.push({
        city: city.slug,
        district: getDistrictSlug(d),
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}): Promise<Metadata> {
  const { city, district } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city);
  if (!cityObj) {
    return {
      title: 'İlçe Bulunamadı',
      robots: { index: false },
    };
  }

  const decodedDistrict = decodeURIComponent(district);
  const matchedDistrict = cityObj.districts.find(d => isMatchingDistrict(d, decodedDistrict));

  if (!matchedDistrict) {
    return {
      title: 'İlçe Bulunamadı',
      robots: { index: false },
    };
  }

  const canonicalSlug = getDistrictSlug(matchedDistrict);

  return {
    title: `${matchedDistrict} Nakliyat Firmaları & Evden Eve Taşıma (${cityObj.name})`,
    description: `${cityObj.name} ${matchedDistrict} evden eve nakliyat firmaları, asansörlü taşıma ve sigortalı nakliye fiyat teklifleri. En uygun onaylı ${matchedDistrict} nakliyecileri.`,
    keywords: [
      `${matchedDistrict} nakliyat`,
      `${matchedDistrict} evden eve nakliyat`,
      `${cityObj.name} ${matchedDistrict} nakliye firmaları`,
      `${matchedDistrict} asansörlü nakliyat`,
    ],
    alternates: {
      canonical: `/nakliyat-firmalari/${cityObj.slug}/${canonicalSlug}`,
    },
    openGraph: {
      title: `${cityObj.name} ${matchedDistrict} Nakliyat Firmaları | TaşınTeklif`,
      description: `${matchedDistrict} bölgesinde onaylı, sigortalı nakliyecilerden komisyonsuz teklif alın.`,
      url: `https://www.tasinteklif.com/nakliyat-firmalari/${cityObj.slug}/${canonicalSlug}`,
    },
  };
}

export default async function DistrictDirectoryPage({
  params,
}: {
  params: Promise<{ city: string; district: string }>;
}) {
  const { city, district } = await params;
  const cityObj = TURKEY_CITIES.find(c => c.slug === city);
  if (!cityObj) {
    notFound();
  }

  const decodedDistrict = decodeURIComponent(district);
  const matchedDistrict = cityObj.districts.find(d => isMatchingDistrict(d, decodedDistrict));

  if (!matchedDistrict) {
    notFound();
  }

  const canonicalSlug = getDistrictSlug(matchedDistrict);

  // If accessed with a non-canonical, encoded or malformed slug, permanently 301 redirect
  if (district !== canonicalSlug) {
    permanentRedirect(`/nakliyat-firmalari/${cityObj.slug}/${canonicalSlug}`);
  }

  const carriers = db.getCarriers().filter(
    c =>
      c.verificationStatus === 'APPROVED' &&
      (c.city === cityObj.name ||
        c.serviceAreas.includes(cityObj.name) ||
        c.serviceAreas.includes('TÜM_TÜRKİYE'))
  );

  const itemListSchema = buildItemListSchema(
    carriers.slice(0, 10).map(c => ({
      name: c.companyName,
      url: `/firma/${c.slug || c.id}`,
      description: `${cityObj.name} ${matchedDistrict} evden eve nakliyat`,
    })),
    `${cityObj.name} ${matchedDistrict} Nakliyat Firmaları`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={itemListSchema} />

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: '/' },
            { name: 'Nakliyat Firmaları', url: '/nakliyat-firmalari' },
            { name: cityObj.name, url: `/nakliyat-firmalari/${cityObj.slug}` },
            { name: `${matchedDistrict} Nakliyat`, url: `/nakliyat-firmalari/${cityObj.slug}/${canonicalSlug}` },
          ]}
        />
      </div>

      {/* Hero */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-3 border border-orange-200">
          <MapPin className="w-3.5 h-3.5" />
          <span>{cityObj.name} / {matchedDistrict}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111E38] mb-3">
          {cityObj.name} {matchedDistrict} Evden Eve Nakliyat Firmaları
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {matchedDistrict} bölgesinde evden eve nakliyat, ofis taşıma ve asansörlü nakliye hizmeti sunan onaylı firmalardan ücretsiz fiyat teklifi toplayın.
        </p>
      </div>

      {/* Quick CTA */}
      <div className="mb-8 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#111E38]">
            {matchedDistrict} İçin Net Fiyat Teklifi Alın
          </h3>
          <p className="text-xs text-slate-500">
            Eşya hacminizi ve kat durumunuzu belirtin, en uygun nakliyeciler 5 dakikada teklif versin.
          </p>
        </div>
        <Link
          href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}&originDistrict=${encodeURIComponent(matchedDistrict)}`}
          rel="nofollow"
          className="w-full sm:w-auto shrink-0"
        >
          <Button variant="primary" size="md" className="w-full font-bold">
            {matchedDistrict} Teklifi Al →
          </Button>
        </Link>
      </div>

      {/* All Sibling Districts of City (Guarantees multi-link internal graph) */}
      <div className="mb-10 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
          {cityObj.name} Diğer İlçeleri ({cityObj.districts.filter(d => d !== matchedDistrict).length})
        </span>
        <div className="flex flex-wrap gap-2">
          {cityObj.districts
            .filter(d => d !== matchedDistrict)
            .map(d => (
              <Link
                key={d}
                href={`/nakliyat-firmalari/${cityObj.slug}/${getDistrictSlug(d)}`}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-[#F95700] text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
              >
                {d} Nakliyat
              </Link>
            ))}
        </div>
      </div>

      {/* Carriers Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#111E38]">
          {matchedDistrict} Bölgesine Hizmet Veren Firmalar ({carriers.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carriers.map(c => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    <Truck className="w-7 h-7 text-[#F95700]" />
                  </div>
                  <div>
                    <Link
                      href={`/firma/${c.slug || c.id}`}
                      className="font-bold text-base text-[#111E38] group-hover:text-[#F95700] truncate block transition-colors"
                    >
                      {c.companyName}
                    </Link>
                    <div className="flex items-center text-amber-500 font-bold text-xs gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{c.rating > 0 ? c.rating.toFixed(1) : '4.8'}</span>
                      <span className="text-slate-400 font-normal">
                        ({c.reviewCount || 10})
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {c.shortBio ||
                    `${matchedDistrict} ve çevre ilçelerde sigortalı marangozlu evden eve nakliyat.`}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/teklif-al?originCity=${encodeURIComponent(cityObj.name)}&originDistrict=${encodeURIComponent(matchedDistrict)}&preferredCarrier=${c.id}`}
                  rel="nofollow"
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
      </div>
    </div>
  );
}
