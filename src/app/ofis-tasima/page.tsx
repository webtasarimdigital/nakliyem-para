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
      <section className="bg-white border-b border-slate-100 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-4 border border-orange-200/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kurumsal &amp; Planlı Taşımacılık</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111E38] tracking-tight leading-[1.2] mb-4">
              Ofis ve İşyeri Taşıma İçin <br />
              <span className="text-[#F95700]">Hızlı Teklif Al</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8 max-w-2xl">
              Bilişim sistemleriniz, arşiv dosyalarınız ve çalışma masalarınız iş kaybı yaşanmadan hafta sonu veya gece operasyonuyla taşınsın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=ofis-tasima">
                <Button variant="primary" size="md" className="font-bold shadow-md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Ofis Taşıma Teklifi Al
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
