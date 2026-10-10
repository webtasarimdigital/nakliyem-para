import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim & Müşteri Hizmetleri',
  description: 'TaşınTeklif destek ekibine 7/24 canlı sohbet, e-posta veya telefonla ulaşın. Sorularınız ve nakliye talepleriniz için buradayız.',
  alternates: {
    canonical: '/iletisim',
  },
};

export default function IletisimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
