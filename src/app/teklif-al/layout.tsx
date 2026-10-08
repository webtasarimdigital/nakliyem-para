import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ücretsiz Nakliyat Fiyat Teklifi Al',
  description: 'Evinizi veya ofisinizi taşımak için 2 dakikada talep oluşturun, 81 ildeki onaylı nakliyecilerden anında teklif toplayın.',
  alternates: {
    canonical: '/teklif-al',
  },
};

export default function TeklifAlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
