import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Truck,
  FileCheck,
  Star,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Müşteriler İçin Güvenli & Komisyonsuz Taşınma',
  description: 'Taşınmak isteyen müşteriler için ücretsiz teklif karşılaştırma rehberi. K3 onaylı nakliyeciler, sabit fiyat garantisi ve sıfır komisyon.',
  alternates: {
    canonical: '/musteriler-icin',
  },
};

export default function MusterilerIcinPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-200 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Müşteri Güvencesi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              Sürpriz Maliyet Olmadan, <br />
              <span className="text-[#F95700]">Güvenle &amp; Huzurla Taşının</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Taşınma günü kapınıza gelen nakliyecinin fiyat artırmasından korkmayın. Tüm şartlar ve fiyat teklif kartında baştan netleşir.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link href="/teklif-al">
                <Button variant="primary" size="lg" className="font-black px-8 shadow-lg shadow-orange-950/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Hemen Ücretsiz Teklif Al
                </Button>
              </Link>
              <Link href="/nakliyat-firmalari">
                <Button variant="outline" size="lg" className="font-bold border-slate-300 text-[#111E38]">
                  Onaylı Firmaları İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Guarantees */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            <h3 className="font-extrabold text-lg text-[#111E38]">K3 Belgeli Nakliyeciler</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yalnızca Ulaştırma Bakanlığı onaylı ve vergi mükellefi resmi şirketler teklif verebilir. Korsan nakliyecilere izin verilmez.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#F95700]" />
            <h3 className="font-extrabold text-lg text-[#111E38]">Sabit Fiyat Garantisi</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Kabul ettiğiniz teklifte belirtilen hizmetler için taşıma günü ek ücret istenemez.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <Star className="w-8 h-8 text-amber-500" />
            <h3 className="font-extrabold text-lg text-[#111E38]">Onaylı Müşteri Değerlendirmeleri</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Daha önce o nakliyeciyle taşınan gerçek kullanıcıların yorum ve puanlarını okuyarak karar verin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
