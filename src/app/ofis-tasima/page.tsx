import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Ofis ve İşyeri Taşıma Fiyat Teklifi Al | TaşınTeklif',
  description: 'Kurumsal ofis, işyeri, fabrika ve arşiv taşımacılığı için profesyonel nakliyat firmalarından teklif alın. Sigortalı ve sözleşmeli nakliye.',
  keywords: ['ofis taşıma', 'işyeri nakliyesi', 'kurumsal taşımacılık', 'büro nakliyatı']
};

export default function OfisTasimaPage() {
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
                <span>Kurumsal &amp; Planlı Taşımacılık</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111E38] tracking-tight leading-[1.2] mb-4">
                Ofis ve İşyeri Taşıma İçin <br />
                <span className="text-[#F95700]">Hızlı Teklif Al</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6 max-w-xl">
                Bilişim sistemleriniz, arşiv dosyalarınız ve çalışma masalarınız iş kaybı yaşanmadan hafta sonu veya gece operasyonuyla taşınsın.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/teklif-al?service=ofis-tasima">
                  <Button variant="primary" size="md" className="font-bold shadow-md shadow-orange-900/15" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Ofis Taşıma Teklifi Al
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
                  <span>Kurumsal K3 Yetki Belgesi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sıfır Mesai Kaybı</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resmi Sözleşme &amp; Fatura</span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Highlights Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl border-2 border-slate-200 p-6 shadow-xl shadow-slate-200/50 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#111E38] text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="font-black text-sm text-[#111E38]">Kurumsal Ofis Standardı</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#111E38] font-bold text-[11px]">
                    Sıfır İş Kaybı
                  </span>
                </div>

                <div className="space-y-3 text-xs font-medium">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#111E38] flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Hafta Sonu &amp; Gece Operasyonu</p>
                      <p className="text-slate-500 mt-0.5">Şirket mesaisi bitiminde başlanır, Pazartesi sabahı tüm masalar ve sistemler hazır teslim edilir.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#111E38] flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Antistatik BT &amp; Server Taşıma</p>
                      <p className="text-slate-500 mt-0.5">Bilgisayarlar, monitörler ve sunucular özel köpüklü malzemelerle güvenle nakledilir.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#111E38] flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                    <div>
                      <p className="font-bold text-[#111E38]">Departman &amp; Arşiv Etiketleme</p>
                      <p className="text-slate-500 mt-0.5">Her personelin kutusu ve evrakları numaralandırılarak yeni ofisteki yerine yerleştirilir.</p>
                    </div>
                  </div>
                </div>

                <Link href="/teklif-al?service=ofis-tasima" className="block pt-1">
                  <Button variant="primary" size="md" className="w-full font-black text-xs shadow-md">
                    Ofis Taşıma Tekliflerini Karşılaştır 🚀
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
          title="Kurumsal Ofis Taşımacılığı Yapan Firmalar"
          subtitle="Faturalı ve sigortalı kurumsal taşımacılık belgelerine sahip profesyonel filolar."
        />
      </div>

      {/* Content & Guide */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <div>
            <h2 className="text-2xl font-bold text-[#111E38] mb-3">Kurumsal Ofis Taşıma Nasıl Planlanır?</h2>
            <p>
              Ofis ve büro taşımalarında en kritik konu iş akışının kesintiye uğramamasıdır. TaşınTeklif&apos;teki kurumsal nakliye şirketleri, taşınma sürecini mesai bitiminden sonra veya hafta sonu başlatarak pazartesi sabahı çalışmaya hazır hale getirir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">Elektronik ve Sunucu Güvenliği</h3>
              <p className="text-xs text-slate-500">Bilgisayarlar, ekranlar ve server donanımları anti-statik havalı ambalaj malzemeleriyle korumaya alınarak kodlanır.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-[#111E38] mb-1">Arşiv &amp; Evrak Düzeni</h3>
              <p className="text-xs text-slate-500">Klasörleriniz ve gizli kurumsal arşiviniz departman bazlı numaralandırılmış dayanıklı plastik kasalarla taşınır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111E38] mb-3">Ofisinizi Güvenle Taşıyın</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">Kurumsal nakliye filolarından 2 dakikada ücretsiz teklif toplayın.</p>
          <Link href="/teklif-al?service=ofis-tasima">
            <Button variant="primary" size="md" className="font-bold px-8 shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ofis Taşıma Teklifi Al
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
