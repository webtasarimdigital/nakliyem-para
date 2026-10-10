import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harita SEO (Google Maps) | Nakliyat İşletme İlk 3 Sıra | TaşınTeklif',
  description: 'Google Haritalar işletme profili doğrulama ve yerel harita SEO optimizasyonu. Bölgenizde "en yakın nakliyeci" aramalarında ilk 3 sırada çıkıp doğrudan telefon çağrıları alın.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler/harita-seo',
  },
  openGraph: {
    title: 'Nakliyat Harita SEO & Google Maps | TaşınTeklif Dijital Ajans',
    description: 'Bölgenizde haritada ilk sırada çıkın, yakınınızdaki müşteriler doğrudan sizin telefonunuzu arasın.',
    url: 'https://www.tasinteklif.com/hizmetler/harita-seo',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function HaritaSeoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
