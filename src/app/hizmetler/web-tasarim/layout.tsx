import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliyat Web Sitesi Tasarımı | Hızlı, Mobil Uyumlu & Teklif Formlu | TaşınTeklif',
  description: 'Nakliyat ve evden eve taşımacılık firmalarına özel ultra hızlı, mobil uyumlu, WhatsApp ve telefon butonlu kurumsal web siteleri. 39 ilçe SEO altyapısı hazır.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler/web-tasarim',
  },
  openGraph: {
    title: 'Nakliyat Web Sitesi Tasarımı | TaşınTeklif Dijital Ajans',
    description: 'Evden eve nakliyat firmanıza özel kurumsal web sitesi. WhatsApp hızlı teklif butonu, ilçe SEO sayfaları ve 0.8 saniyede açılan altyapı.',
    url: 'https://www.tasinteklif.com/hizmetler/web-tasarim',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function WebTasarimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
