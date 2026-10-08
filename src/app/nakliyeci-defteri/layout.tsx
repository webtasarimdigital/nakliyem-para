import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliyeci Defteri & Türkiye Nakliye Borsası',
  description: '81 ildeki onaylı nakliyecilerin boş araç, dönüş yükü ve kiralık mobil asansör paylaştığı canlı iş ağı.',
  alternates: {
    canonical: '/nakliyeci-defteri',
  },
};

export default function NakliyeciDefteriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
