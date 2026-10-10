import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sosyal Medya Reklamları | Instagram & Meta Nakliyat Kampanyaları | TaşınTeklif',
  description: 'Nakliyat firmalarına özel Instagram ve Facebook reklam yönetimi. Yeni ev kiralayan ve satın alan kitleye video ve görsel reklamlarla ulaşıp doğrudan WhatsApp teklifleri toplayın.',
  alternates: {
    canonical: 'https://www.tasinteklif.com/hizmetler/sosyal-medya',
  },
  openGraph: {
    title: 'Nakliyat Sosyal Medya Reklamları | TaşınTeklif Dijital Ajans',
    description: 'Instagram ve Meta reklamlarıyla evini taşıyacak kitleye ulaşıp doğrudan WhatsApp üzerinden iş bağlayın.',
    url: 'https://www.tasinteklif.com/hizmetler/sosyal-medya',
    siteName: 'TaşınTeklif',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function SosyalMedyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
