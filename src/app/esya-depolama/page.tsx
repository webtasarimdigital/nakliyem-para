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
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-10 sm:py-14 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-4 border border-orange-200/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Güvenli &amp; Kilitli Depolama</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111E38] tracking-tight leading-[1.2] mb-4">
                Eşyalarınız İçin <br />
                <span className="text-[#F95700]">Güvenli Depolama Çözümleri</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6 max-w-xl">
                Tadilat, seyahat veya taşınma aralığında eşyalarınızı 7/24 kamera kontrollü, rutubetsiz ve sigortalı özel odalarda saklayın.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/teklif-al?service=esya-depolama">
                  <Button variant="primary" size="md" className="font-bold shadow-md shadow-orange-900/15" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Depolama Teklifi Al
                  </Button>
                </Link>
                <Link href="/nakliyat-firmalari">
                  <Button variant="navy" size="md" className="font-bold shadow-xs">
                    Firmaları İncele →
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-bold text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Kişiye Özel Kilitli Oda</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>7/24 CCTV &amp; Alarm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Yangın &amp; Nem Sigortası</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Highlights Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 rounded-3xl border-2 border-slate-200 p-6 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <Warehouse className="w-4 h-4" />
                    </div>
                    <span className="font-black text-sm text-[#111E38]">Depolama Güvencesi</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    7/24 Kamera
                  </span>
                </div>

                <div className="space-y-3 text-xs font-medium">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Kişiye Özel Kilitli Oda Sistemi</p>
                      <p className="text-slate-500 mt-0.5">Eşyalarınız sadece sizin anahtarınızla açılabilen bağımsız temiz odalarda muhafaza edilir.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Nem &amp; İklimlendirme Kontrolü</p>
                      <p className="text-slate-500 mt-0.5">Rutubetsiz, sürekli havalandırılan ve periyodik ilaçlanan hijyenik depo ortamı.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">✓</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Adresten Alım &amp; Geri Teslim</p>
                      <p className="text-slate-500 mt-0.5">Eşyalarınız kapınızdan ambalajlanarak depoya taşınır, dilediğiniz gün geri getirilir.</p>
                    </div>
                  </div>
                </div>

                <Link href="/teklif-al?service=esya-depolama" className="block pt-1">
                  <Button variant="primary" size="md" className="w-full font-black text-xs shadow-md">
                    Depolama Fiyat Teklifi Al 🚀
                  </Button>
                </Link>
              </div>
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
