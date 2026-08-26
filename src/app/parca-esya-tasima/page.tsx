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
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-[#EAF3FF]/80 via-white to-[#F7F9FC] py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekonomik Parsiyel Taşıma</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Parça Eşya Taşıma İçin <br />
              <span className="text-[#146EF5]">Ekonomik Fiyat Al</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Komple araç kiralamak yerine, aracın boş kalan kapasitesini paylaşarak parça eşyalarınızı çok daha uygun fiyata taşıtın.
            </p>
            <Link href="/teklif-al?service=parca-esya">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Parça Eşya Teklifi Al
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DynamicAdSlot
          slotKey="service_page.featured"
          title="Parça Eşya & Parsiyel Taşıyan Firmalar"
          subtitle="Haftalık düzenli dönüş hatlarında boş yeri olan güvenilir nakliyeciler."
        />
      </div>
    </div>
  );
}
