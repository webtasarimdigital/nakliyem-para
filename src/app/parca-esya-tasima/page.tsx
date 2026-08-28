import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Package, Warehouse, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Parça Eşya Taşıma & Parsiyel Nakliye | Nakliyem Para',
  description: 'Tek koltuk, beyaz eşya veya birkaç koli eşyanız için uygun fiyatlı şehirler arası ve şehir içi parça eşya nakliye teklifleri alın.',
  keywords: ['parça eşya taşıma', 'parsiyel nakliye', 'parça ev eşyası', 'tek eşya taşıma']
};

export default function ParcaEsyaTasimaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <section className="bg-[#0A1128] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-4 border border-[#F95700]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ekonomik Parsiyel Taşıma</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Parça Eşya Taşıma İçin <br />
              <span className="text-[#F95700]">Ekonomik Fiyat Al</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl">
              Komple araç kiralamak yerine, aracın boş kalan kapasitesini paylaşarak parça eşyalarınızı çok daha uygun fiyata taşıtın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=parca-esya">
                <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/30" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Parça Eşya Teklifi Al
                </Button>
              </Link>
              <Link href="/nakliyat-firmalari">
                <Button variant="outline" size="lg" className="font-bold border-white/20 text-white hover:bg-white/10">
                  Firmaları İncele →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DynamicAdSlot
          slotKey="service_page.featured"
          title="Parça Eşya & Parsiyel Taşıyan Firmalar"
          subtitle="Haftalık düzenli dönüş hatlarında boş yeri olan güvenilir nakliyeciler."
        />
      </div>
    </div>
  );
}
