import React from 'react';
import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildFAQSchema, buildServiceSchema } from '@/lib/seo/schema';

export const metadata: Metadata = {
  title: 'Nakliyat Yazılımı ve Nakliyeci Paket Fiyatları',
  description: 'TaşınTeklif nakliyeci paketleri, aylık ve yıllık fiyatlar, 7 gün ücretsiz Gold deneme ve komisyonsuz iş ağı özellik karşılaştırma tablosu.',
  keywords: [
    'nakliyeci paket fiyatları',
    'nakliyat yazılımı fiyatları',
    'nakliyeci abonelik ücretleri',
    'evden eve nakliyat müşteri bulma',
    'nakliyeci defteri paketleri',
    'taşınteklif fiyatlandırma',
    'nakliyeci gold üyelik',
  ],
  alternates: {
    canonical: '/fiyatlar',
  },
};

const pricingFaqs = [
  {
    question: 'Gold paketteki 7 günlük ücretsiz deneme nasıl çalışır?',
    answer: 'En üst paketimiz olan Gold paketi seçtiğinizde ilk 7 gün boyunca hiçbir ücret ödemeden sınırsız teklif, doğrudan müşteri telefonu ve ana sayfa vitrini gibi tüm ayrıcalıkları kullanabilirsiniz. Memnun kalmazsanız süre bitmeden tek tıkla iptal edebilirsiniz.',
  },
  {
    question: 'Yıllık ödeme avantajı nasıl çalışır?',
    answer: 'Yıllık peşin ödemeyi tercih ettiğinizde 12 ay yerine sadece 10 ay ücreti ödersiniz. Tam 2 ay (%20 avantaj) platform kullanımınız hediye edilir.',
  },
  {
    question: 'Teklif hakkım biterse ne olur?',
    answer: 'Aylık teklif kotanız dolduğunda dilediğiniz zaman üst pakete geçebilir veya hesabınızdan ek teklif hakkı satın alarak iş almaya kesintisiz devam edebilirsiniz.',
  },
  {
    question: 'Aldığım taşıma işlerinden komisyon kesilir mi?',
    answer: 'Kesinlikle hayır! TaşınTeklif\'te kazancınızdan yüzde veya komisyon alınmaz. İş bedelinin %100\'ünü doğrudan müşteriden tahsil edersiniz.',
  },
  {
    question: 'Aboneliğimi istediğim zaman iptal edebilir miyim?',
    answer: 'Evet. Hiçbir taahhüt veya ceza yoktur. Dilediğiniz an aboneliğinizi iptal edebilirsiniz; dönem sonuna kadar tüm haklarınızı kullanmaya devam edersiniz.',
  },
];

export default function FiyatlarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Fiyatlandırma', url: '/fiyatlar' },
  ]);

  const serviceSchema = buildServiceSchema({
    name: 'TaşınTeklif Nakliyeci Yazılımı ve Abonelik Paketleri',
    description: 'Taşıyıcı ve nakliyeci firmalar için komisyonsuz müşteri bulma ve iş yönetim yazılımı paketleri.',
    serviceType: 'CarrierSoftwareSubscription',
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
