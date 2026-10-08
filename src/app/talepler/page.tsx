import CarrierJobsPage from '../app/carrier/isler/page';

export const metadata = {
  title: 'Canlı Nakliyat Talepleri & Taşıma İşleri',
  description: 'Türkiye genelinde evden eve, ofis ve parça eşya nakliyat taleplerini listeleyin, hemen teklif verin.',
  alternates: {
    canonical: '/talepler',
  },
};

export default function TaleplerPublicPage() {
  return <CarrierJobsPage />;
}
