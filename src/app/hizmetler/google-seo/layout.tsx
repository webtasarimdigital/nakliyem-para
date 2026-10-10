import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google SEO Hizmeti | Evden Eve Nakliyat 1. Sayfa Sıralama | TaşınTeklif',
  description: 'Nakliyat firmalarına özel Google SEO ve yerel arama optimizasyonu. İlçe ve şehir aramalarında organik 1. sayfaya çıkın, komisyonsuz doğrudan telefon çağrıları alın.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler/google-seo',
  },
  openGraph: {
    title: 'Nakliyat Google SEO Hizmeti | TaşınTeklif Dijital Ajans',
    description: 'Evden eve ve şehirlerarası nakliyat aramalarında kalıcı 1. sıra SEO çalışmaları.',
    url: 'https://www.tasinteklif.com/hizmetler/google-seo',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function GoogleSeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
