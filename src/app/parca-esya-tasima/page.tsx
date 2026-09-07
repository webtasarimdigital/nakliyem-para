import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Package, Warehouse, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Parça Eşya Taşıma & Parsiyel Nakliye | TaşınTeklif',
  description: 'Tek koltuk, beyaz eşya veya birkaç koli eşyanız için uygun fiyatlı şehirler arası ve şehir içi parça eşya nakliye teklifleri alın.',
  keywords: ['parça eşya taşıma', 'parsiyel nakliye', 'parça ev eşyası', 'tek eşya taşıma']
};

export default function ParcaEsyaTasimaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-4 border border-orange-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ekonomik Parsiyel Taşıma</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111E38] tracking-tight leading-[1.2] mb-4">
              Parça Eşya Taşıma İçin <br />
              <span className="text-[#F95700]">Ekonomik Fiyat Al</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8 max-w-2xl">
              Komple araç kiralamak yerine, aracın boş kalan kapasitesini paylaşarak parça eşyalarınızı çok daha uygun fiyata taşıtın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=parca-esya">
                <Button variant="primary" size="md" className="font-bold shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Parça Eşya Teklifi Al
                </Button>
              </Link>
              <Link href="/nakliyat-firmalari">
                <Button variant="navy" size="md" className="font-bold shadow-sm">
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

      {/* Content & Guide */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <div>
            <h2 className="text-2xl font-bold text-[#111E38] mb-3">Parça Eşya Taşıma (Parsiyel) Nedir?</h2>
            <p>
              Bir kamyonu veya kamyoneti tamamen doldurmayacak hacimdeki eşyaların (tek bir koltuk takımı, buzdolabı, öğrenci evi eşyaları veya 5-10 koli), aynı istikamete giden diğer eşyalarla birleştirilerek taşınmasıdır. Böylece nakliye maliyetiniz %50&apos;ye varan oranda düşer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">Şehirler Arası Dönüş Hatları</h3>
              <p className="text-xs text-slate-500">İstanbul - Ankara - İzmir gibi yoğun güzergahlarda haftalık düzenli sefer yapan araçlarla hızlı teslimat sağlanır.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">Ambalajlı ve Etiketli Güvenlik</h3>
              <p className="text-xs text-slate-500">Eşyalarınız araç içinde diğer yüklerle karışmaması için özel barkod ve isim etiketleriyle ayrıştırılarak sabitlenir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111E38] mb-3">Parça Eşyanızı Uygun Fiyata Taşıtın</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">Aracında boş yeri olan doğrulanmış nakliyecilerden hemen fiyat teklifi alın.</p>
          <Link href="/teklif-al?service=parca-esya">
            <Button variant="primary" size="md" className="font-bold px-8 shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Parça Eşya Teklifi Al
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
