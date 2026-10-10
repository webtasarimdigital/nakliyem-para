import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google Ads Reklam Yönetimi | Evden Eve Nakliyat Reklamları | TaşınTeklif',
  description: 'Nakliyat firmalarına özel Google Ads arama reklamları yönetimi. 450+ negatif kelime filtresi, tıkla-ara çağrı kampanyaları ve düşük tıklama maliyetiyle aynı gün müşteri bağlayın.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler/google-reklamlari',
  },
  openGraph: {
    title: 'Nakliyat Google Ads Reklamları | TaşınTeklif Dijital Ajans',
    description: 'Boşa para harcamadan en doğru müşterilere ulaşın. Telefon odaklı Google Ads reklam yönetimi.',
    url: 'https://www.tasinteklif.com/hizmetler/google-reklamlari',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function GoogleReklamlariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
