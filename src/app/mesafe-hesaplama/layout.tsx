import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İller Arası Mesafe ve Nakliyat Kilometre Hesaplama',
  description: '81 il ve ilçe arasındaki karayolu mesafesini km cinsinden hesaplayın, tahmini seyahat süresini ve taşınma maliyetini öğrenin.',
  alternates: {
    canonical: '/mesafe-hesaplama',
  },
};

export default function MesafeHesaplamaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
