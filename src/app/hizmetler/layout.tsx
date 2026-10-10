import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliye Firmaları İçin Dijital Hizmetler | Web Tasarım, SEO & Reklam | TaşınTeklif',
  description: 'Nakliyat firmalarına özel web sitesi tasarımı, Google SEO, Google Haritalar optimizasyonu, Google Ads ve sosyal medya reklam yönetimi. Aracı komisyonsuz, doğrudan müşteri kazanın.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler',
  },
  openGraph: {
    title: 'Nakliye Firmaları İçin Dijital Büyüme Hizmetleri | TaşınTeklif',
    description: 'Evden eve ve lojistik firmaları için web tasarımı, Google 1. sayfa SEO, Harita kaydı ve reklam yönetimi.',
    url: 'https://www.tasinteklif.com/hizmetler',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function HizmetlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
