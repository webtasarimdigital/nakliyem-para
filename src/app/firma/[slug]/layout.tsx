import React from 'react';
import type { Metadata } from 'next';
import { db } from '@/lib/data/mock-db';
import { buildLocalBusinessSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carrier =
    db.getCarrierBySlug(slug) ||
    db.getCarriers().find(c => c.slug === slug || c.id === slug);

  if (!carrier) {
    return {
      title: 'Firma Profili',
      robots: { index: false },
    };
  }

  return {
    title: `${carrier.companyName} - ${carrier.city} Evden Eve Nakliyat`,
    description: `${carrier.companyName} ${carrier.city} onaylı nakliyat firması. Sigortalı ve asansörlü ev taşıma, müşteri puanları ve ücretsiz fiyat teklifi.`,
    keywords: [
      `${carrier.companyName}`,
      `${carrier.companyName} nakliyat`,
      `${carrier.city} evden eve nakliyat`,
      `${carrier.companyName} yorumları`,
    ],
    alternates: {
      canonical: `/firma/${carrier.slug || carrier.id}`,
    },
    openGraph: {
      title: `${carrier.companyName} | TaşınTeklif`,
      description:
        carrier.shortBio || `${carrier.city} onaylı nakliyat firması profili.`,
      url: `https://www.tasinteklif.com/firma/${carrier.slug || carrier.id}`,
    },
  };
}

export default async function CarrierProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carrier =
    db.getCarrierBySlug(slug) ||
    db.getCarriers().find(c => c.slug === slug || c.id === slug);

  const localBusinessSchema = carrier
    ? buildLocalBusinessSchema({
        companyName: carrier.companyName,
        slug: carrier.slug || carrier.id,
        city: carrier.city,
        rating: carrier.rating || 4.8,
        reviewCount: carrier.reviewCount || 12,
        description: carrier.shortBio,
        phone: carrier.phone,
      })
    : null;

  return (
    <>
      {localBusinessSchema && <JsonLd data={localBusinessSchema} />}
      {children}
    </>
  );
}
