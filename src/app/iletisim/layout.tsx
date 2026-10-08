import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim & Müşteri Hizmetleri',
  description: 'TaşınTeklif müşteri destek ekibine 7/24 canlı sohbet, e-posta veya iletişim formu üzerinden ulaşın. Sorularınız ve destek talepleriniz için buradayız.',
  alternates: {
    canonical: '/iletisim',
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
