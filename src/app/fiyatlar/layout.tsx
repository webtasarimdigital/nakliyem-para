import React from 'react';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildFAQSchema, buildServiceSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: '2026 Evden Eve Nakliyat Fiyatları ve Hizmet Tarifeleri',
  description: '2026 yılı güncel evden eve nakliyat fiyat tarifeleri: 1+1, 2+1, 3+1 daire taşıma, şehirlerarası km fiyatları, asansör kiralama ve eşya depolama maliyetleri.',
  keywords: [
    'nakliyat fiyatları 2026',
    'evden eve nakliyat ücretleri',
    'şehirlerarası nakliyat fiyat hesaplama',
    '1+1 ev taşıma fiyatı',
    '2+1 ev taşıma fiyatı',
    'asansörlü nakliyat fiyatları',
    'eşya depolama ücretleri',
    'nakliyeci abonelik fiyatları',
  ],
  alternates: {
    canonical: '/fiyatlar',
  },
};

const pricingFaqs = [
  {
    question: 'Evden eve nakliyat fiyatları neye göre belirlenir?',
    answer: 'Taşınma fiyatları evdeki oda sayısı (eşya hacmi), taşınılacak mesafe (km), kat sayıları, bina asansörü durumu ve özel paketleme gereksinimlerine göre hesaplanır.',
  },
  {
    question: 'Taşınma günü anlaşılan fiyata ek ücret çıkar mı?',
    answer: 'TaşınTeklif üzerindeki onaylı nakliyeciler ile anlaşılan fiyatlar sözleşmeli ve sabit fiyat garantilidir. Bilgilendirilmeyen ekstra kat veya oda olmadığı sürece sonradan sürpriz ek ücret talep edilemez.',
  },
  {
    question: 'Teklif almak ücretli midir? Komisyon kesilir mi?',
    answer: 'Müşteriler için teklif almak %100 ücretsizdir. Hiçbir aracı komisyonu veya gizli hizmet bedeli ödemezsiniz.',
  },
  {
    question: 'Paketleme ve mobilya montajı fiyata dahil midir?',
    answer: 'Standart ve anahtar teslim paketlerimizde büyük mobilyaların sökümü, montajı, beyaz eşyaların ambalajlanması fiyata dahildir.',
  },
  {
    question: 'Şehirlerarası taşımada eşya sigortası yapılıyor mu?',
    answer: 'Evet, tüm şehirlerarası ev ve ofis taşımacılıklarında eşyalarınız sefer boyunca emtia nakliyat sigortası ile güvence altındadır.',
  },
];

export default function FiyatlarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Fiyatlar & Tarifeler', url: '/fiyatlar' },
  ]);

  const serviceSchema = buildServiceSchema({
    name: '2026 Evden Eve Nakliyat Fiyatları ve Taşıma Tarifeleri',
    description: 'Şeffaf ev taşıma, ofis ve şehirlerarası nakliyat fiyat tarifeleri.',
    serviceType: 'MovingServicesPricing',
    url: 'https://tasinteklif.com/fiyatlar',
  });

  const faqSchema = buildFAQSchema(pricingFaqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />
      {children}
    </>
  );
}
