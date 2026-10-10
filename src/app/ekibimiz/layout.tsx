import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ekibimiz & Yönetim Kadrosu',
  description: 'TaşınTeklif lojistik uzmanları, yazılım mühendisleri ve müşteri deneyimi kadrosuyla tanışın. 81 ilde güvenilir ve şeffaf taşınma deneyimi.',
  alternates: {
    canonical: '/ekibimiz',
  },
  openGraph: {
    title: 'Ekibimiz & Yönetim Kadrosu | TaşınTeklif',
    description: 'TaşınTeklif lojistik uzmanları, yazılım mühendisleri ve müşteri deneyimi kadrosuyla tanışın.',
    url: 'https://www.tasinteklif.com/ekibimiz',
    type: 'website',
  },
};

export default function EkibimizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Ana Sayfa',
            item: 'https://tasinteklif.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Kurumsal',
            item: 'https://tasinteklif.com/hakkimizda',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Ekibimiz',
            item: 'https://tasinteklif.com/ekibimiz',
          },
        ],
      },
      {
        '@type': 'Organization',
        name: 'TaşınTeklif',
        url: 'https://tasinteklif.com',
        logo: 'https://tasinteklif.com/logo.png',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'DSO-IFZA, IFZA Properties',
          addressLocality: 'Dubai Silicon Oasis',
          addressCountry: 'AE',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
