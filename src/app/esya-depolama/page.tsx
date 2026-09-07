import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Warehouse, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Eşya Depolama Hizmeti ve Fiyatları | TaşınTeklif',
  description: 'Kilitli oda tipi, 7/24 güvenlikli ve sigortalı ev & ofis eşyası depolama hizmeti. Aylık ve yıllık uygun depolama fiyatları.',
  keywords: ['eşya depolama', 'ev eşyası deposu', 'kilitli depolama', 'oda depo']
};

export default function EsyaDepolamaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-4 border border-orange-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Güvenli &amp; Kilitli Depolama</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111E38] tracking-tight leading-[1.2] mb-4">
              Eşyalarınız İçin <br />
              <span className="text-[#F95700]">Güvenli Depolama Çözümleri</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8 max-w-2xl">
              Tadilat, seyahat veya taşınma aralığında eşyalarınızı 7/24 kamera kontrollü, rutubetsiz ve sigortalı özel odalarda saklayın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=esya-depolama">
                <Button variant="primary" size="md" className="font-bold shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Depolama Teklifi Al
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
          title="Depolama Hizmeti Sunan Nakliyat Firmaları"
          subtitle="Özel antrepo ve oda tipi depolama tesislerine sahip kurumsal şirketler."
        />
      </div>

      {/* Content & Guide */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <div>
            <h2 className="text-2xl font-bold text-[#111E38] mb-3">Kilitli Oda Tipi Eşya Depolama Nasıl Çalışır?</h2>
            <p>
              Eşyalarınız evinizden profesyonel ekiplerce paketlenerek alınır ve yalnızca sizin anahtarınızla açılabilen özel ahşap ya da çelik kilitli depolama konteynerlarına yerleştirilir. İhtiyacınız olduğunda dilediğiniz zaman parça veya komple teslim alabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">Nem ve Rutubet Kontrollü Alanlar</h3>
              <p className="text-xs text-slate-500">Tesislerimiz hava sirkülasyonu ve nem dengesi sağlayan modern havalandırma sistemleriyle korunur.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">7/24 Kamera &amp; Sigorta Teminatı</h3>
              <p className="text-xs text-slate-500">Yangın, su baskını ve hırsızlığa karşı tam kapsamlı all-risk sigortası ve güvenlik personeli denetimi altındadır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111E38] mb-3">Eşyalarınızı Güvenle Depolayın</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">Aylık veya yıllık kilitli depo fiyatlarını karşılaştırmak için hemen teklif alın.</p>
          <Link href="/teklif-al?service=esya-depolama">
            <Button variant="primary" size="md" className="font-bold px-8 shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Depolama Teklifi Al
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
