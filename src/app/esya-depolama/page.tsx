import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Warehouse, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Eşya Depolama Hizmeti ve Fiyatları | Nakliyem Para',
  description: 'Kilitli oda tipi, 7/24 güvenlikli ve sigortalı ev & ofis eşyası depolama hizmeti. Aylık ve yıllık uygun depolama fiyatları.',
  keywords: ['eşya depolama', 'ev eşyası deposu', 'kilitli depolama', 'oda depo']
};

export default function EsyaDepolamaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-[#EAF3FF]/80 via-white to-[#F7F9FC] py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Güvenli & Kilitli Depolama</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Eşyalarınız İçin <br />
              <span className="text-[#146EF5]">Güvenli Depolama Çözümleri</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Tadilat, seyahat veya taşınma aralığında eşyalarınızı 7/24 kamera kontrollü, rutubetsiz ve sigortalı özel odalarda saklayın.
            </p>
            <Link href="/teklif-al?service=esya-depolama">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Depolama Teklifi Al
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DynamicAdSlot
          slotKey="service_page.featured"
          title="Depolama Hizmeti Sunan Nakliyat Firmaları"
          subtitle="Özel antrepo ve oda tipi depolama tesislerine sahip kurumsal şirketler."
        />
      </div>
    </div>
  );
}
