import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliyeci Abonelik Paketleri & Fiyatları',
  description: 'Nakliyat firmaları için avantajlı Gold, Platin ve Başlangıç üyelik paketleri. 7 gün ücretsiz deneyin, komisyonsuz iş alın.',
  alternates: {
    canonical: '/paketler',
  },
};

export default function PaketlerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
