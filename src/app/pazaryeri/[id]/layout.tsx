import type { Metadata } from 'next';

const KNOWN_TITLES: Record<string, { title: string; desc: string }> = {
  v1: {
    title: '2005 Mercedes 2523 Satılık Kamyon',
    desc: '2005 model Mercedes 2523 satılık nakliye kamyonu. Samsun Çöpoğlu Nakliyat güvencesiyle detayları inceleyin.',
  },
  v2: {
    title: '2021 Ford Transit Kapalı Kasa Kamyonet',
    desc: '2021 model Ford Transit kapalı kasa nakliye kamyoneti. İstanbul Marmara Lojistik güvencesiyle satılık.',
  },
  v3: {
    title: '18. Kat Hidrolik Araç Üstü Mobil Asansör Kiralık',
    desc: 'Operatörlü 18. kata kadar hidrolik araç üstü mobil nakliyat asansörü kiralama ilanı.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const known = KNOWN_TITLES[id];

  if (!known) {
    return {
      title: 'İlan Bulunamadı',
      robots: { index: false },
    };
  }

  return {
    title: known.title,
    description: known.desc,
    alternates: {
      canonical: `https://www.tasinteklif.com/pazaryeri/${id}`,
    },
    openGraph: {
      title: `${known.title} | TaşınTeklif Pazaryeri`,
      description: known.desc,
      url: `https://www.tasinteklif.com/pazaryeri/${id}`,
    },
  };
}

export default function ListingDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
