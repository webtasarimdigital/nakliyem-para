import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Ofis ve İşyeri Taşıma Fiyat Teklifi Al | Nakliyem Para',
  description: 'Kurumsal ofis, işyeri, fabrika ve arşiv taşımacılığı için profesyonel nakliyat firmalarından teklif alın. Sigortalı ve sözleşmeli nakliye.',
  keywords: ['ofis taşıma', 'işyeri nakliyesi', 'kurumsal taşımacılık', 'büro nakliyatı']
};

export default function OfisTasimaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <section className="bg-[#0A1128] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-4 border border-[#F95700]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kurumsal &amp; Planlı Taşımacılık</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Ofis ve İşyeri Taşıma İçin <br />
              <span className="text-[#F95700]">Hızlı Teklif Al</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl">
              Bilişim sistemleriniz, arşiv dosyalarınız ve çalışma masalarınız iş kaybı yaşanmadan hafta sonu veya gece operasyonuyla taşınsın.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=ofis-tasima">
                <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/30" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Ofis Taşıma Teklifi Al
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
          title="Kurumsal Ofis Taşımacılığı Yapan Firmalar"
          subtitle="Faturalı ve sigortalı kurumsal taşımacılık belgelerine sahip profesyonel filolar."
        />
      </div>
    </div>
  );
}
