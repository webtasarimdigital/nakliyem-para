import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Check, Sparkles, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

export const metadata: Metadata = {
  title: 'Nakliyeci Abonelik Paketleri ve Fiyatları | Nakliyem Para',
  description: 'Nakliyat firmaları için Başlangıç, Pro ve Gold üyelik paketleri. 7 gün ücretsiz deneyin, yeni işlere teklif verin ve görünürlüğünüzü artırın.',
  keywords: ['nakliyat platformu fiyatları', 'nakliyeci paketleri', 'gold nakliyeci üyeliği']
};

export default function PaketlerPage() {
  const plans = db.getPlans();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B3B8F] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#146EF5]" />
          <span>Şeffaf & Taahhütsüz Fiyatlandırma</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4">
          Firmanız İçin En Uygun Paketi Seçin
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
          Tüm paketlerimizde 7 günlük ücretsiz kullanım dahildir. Bugün hiçbir ödeme alınmaz, dilediğiniz an iptal edebilirsiniz.
        </p>
      </div>

      {/* 3 Tier Cards (Spec Item 105) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-3xl border-2 transition-all p-7 sm:p-8 shadow-xs flex flex-col justify-between ${
              p.id === 'plan_gold'
                ? 'border-amber-400 bg-amber-50/10 shadow-lg relative'
                : p.isFeatured
                ? 'border-[#146EF5] relative'
                : 'border-slate-200'
            }`}
          >
            <div>
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[11px] uppercase tracking-wider shadow-sm">
                  {p.badge}
                </div>
              )}

              <h2 className="text-xl font-black text-slate-900 mb-1">{p.name}</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">{p.tagline}</p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-black text-slate-900">{p.priceMonthly.toLocaleString('tr-TR')} TL</span>
                <span className="text-xs text-slate-500 font-medium"> / Ay + KDV</span>
              </div>

              {/* Checklist */}
              <ul className="space-y-3 text-xs text-slate-700 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{p.features.monthlyOfferLimit === 'unlimited' ? 'Sınırsız İş Teklifi Hakkı' : `Aylık ${p.features.monthlyOfferLimit} Teklif Hakkı`}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{p.features.customerPhoneAccess ? 'Müşteri Telefon Numaralarına Erişim' : 'Müşteri Telefon Erişimi Yok'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{p.features.routeAlarmLimit === 'unlimited' ? 'Sınırsız Rota ve Bölge Alarmı' : `${p.features.routeAlarmLimit} Rota Alarmı`}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Nakliyeci Defteri İş Ağı Tam Erişimi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>{p.features.featuredHomepage ? 'Ana Sayfa & Şehir Sayfalarında Sponsor Reklam' : 'Sponsor Reklamı Yok'}</span>
                </li>
              </ul>
            </div>

            <Link href={`/kayit/nakliyeci?plan=${p.id}`}>
              <Button
                variant={p.id === 'plan_gold' ? 'gold' : 'primary'}
                size="lg"
                className="w-full font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                7 Gün Ücretsiz Başla
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
