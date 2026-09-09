import type { Metadata } from 'next';
import './globals.css';
import { GlobalAppBand } from '@/components/ui/GlobalAppBand';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileCustomerNav } from '@/components/layout/MobileCustomerNav';
import { MobileCarrierNav } from '@/components/layout/MobileCarrierNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://tasinteklif.com'),
  title: {
    default: 'Evden Eve Nakliyat Teklifi Al | TaşınTeklif',
    template: '%s | TaşınTeklif',
  },
  description: 'Evden eve nakliyat, ofis taşıma, parça eşya ve depolama için talep oluşturun; onaylı nakliyat firmalarından komisyonsuz fiyat teklifi alın ve karşılaştırın.',
  keywords: ['evden eve nakliyat', 'nakliyat teklifi', 'nakliyat firmaları', 'ev taşıma', 'şehirler arası nakliyat', 'nakliyeci defteri', 'nakliyat pazaryeri'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://tasinteklif.com',
    siteName: 'TaşınTeklif',
    title: 'TaşınTeklif — Güvenilir Nakliyat ve Fiyat Teklifi Karşılaştırma',
    description: '81 ilde onaylı nakliyecilerden anında fiyat teklifi alın. Komisyon yok, sürpriz yok.',
    images: [{ url: '/images/logo.png', width: 805, height: 494, alt: 'TaşınTeklif Logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaşınTeklif — Evden Eve Nakliyat Teklifi Al',
    description: 'Onaylı nakliyat firmalarından komisyonsuz teklif toplayın ve karşılaştırın.',
    images: ['/images/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#172033] antialiased">
        <GlobalAppBand />
        <Navbar />
        <main className="flex-1 w-full pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileCustomerNav />
        <MobileCarrierNav />
      </body>
    </html>
  );
}
