import type { Metadata } from 'next';
import './globals.css';
import { GlobalAppBand } from '@/components/ui/GlobalAppBand';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileCustomerNav } from '@/components/layout/MobileCustomerNav';
import { MobileCarrierNav } from '@/components/layout/MobileCarrierNav';

export const metadata: Metadata = {
  title: 'Evden Eve Nakliyat Teklifi Al | Nakliyem Para',
  description: 'Evden eve nakliyat, ofis taşıma, parça eşya ve depolama için talep oluşturun; uygun nakliyat firmalarından teklif alın ve karşılaştırın.',
  keywords: ['evden eve nakliyat', 'nakliyat teklifi', 'nakliyat firmaları', 'ev taşıma', 'şehirler arası nakliyat']
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
