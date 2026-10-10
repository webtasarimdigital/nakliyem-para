import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliyat Pazaryeri, Kiralık Asansör & Ekipman İlanları',
  description: 'Satılık veya kiralık nakliye kamyonu, hidrolik mobil asansör ve ambalaj malzemesi pazar yeri.',
};

export default function PazaryeriLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
