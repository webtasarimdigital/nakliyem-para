import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FileText,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  Truck,
  ShieldCheck,
  PhoneCall,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Nasıl Çalışır? (Adım Adım Taşınma Rehberi)',
  description: 'TaşınTeklif nasıl çalışır? Müşteriler için ücretsiz teklif alma ve nakliyeciler için iş bulma süreçlerinin adım adım açıklaması.',
  alternates: {
    canonical: '/nasil-calisir',
  },
};

export default function NasilCalisirPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Nasıl Çalışır', url: '/nasil-calisir' },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Basit &amp; Şeffaf Süreç</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              TaşınTeklif Nasıl Çalışır?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Müşteriler 2 dakikada talep açar, rotadaki onaylı nakliyeciler fiyat verir. Komisyonsuz, şeffaf ve güvenli bir taşınma deneyimi yaşarsınız.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Talebinizi Oluşturun',
              desc: 'Nereden nereye taşınacağınızı, daire tipinizi (1+1, 2+1, 3+1), kat durumunu ve tercih ettiğiniz taşınma tarihini girin.',
              icon: FileText,
              color: 'text-orange-500 bg-orange-50',
            },
            {
              step: '02',
              title: 'Teklifler Panelinize Düşsün',
              desc: 'Talebiniz güzergahtaki doğrulanmış nakliye şirketlerine iletilir. İlk 8-15 dakika içinde fiyat teklifleri gelmeye başlar.',
              icon: Clock,
              color: 'text-blue-500 bg-blue-50',
            },
            {
              step: '03',
              title: 'Fiyat ve Kapsamı Kıyaslayın',
              desc: 'Gelen tekliflerde paketleme, sigorta, asansör ve mobilya montajının dahil olup olmadığını yan yana inceleyin.',
              icon: SlidersHorizontal,
              color: 'text-purple-500 bg-purple-50',
            },
            {
              step: '04',
              title: 'Güvenle Taşının',
              desc: 'Size en uygun teklifi seçin; firma yetkilisiyle mesajlaşarak veya telefonla teyitleşip huzurla taşının.',
              icon: CheckCircle2,
              color: 'text-emerald-500 bg-emerald-50',
            },
          ].map(card => {
            const Icon = card.icon;
            return (
              <div key={card.step} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400">ADIM {card.step}</span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-extrabold text-base text-[#111E38]">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Dual CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xl text-[#111E38]">Müşteriler İçin</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Komisyon ödemeden onlarca onaylı nakliyeciden anında teklif toplayın.
            </p>
            <Link href="/teklif-al">
              <Button variant="primary" size="md" className="font-bold">
                Ücretsiz Teklif Al →
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-xl text-[#111E38]">Nakliyeciler İçin</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ücretsiz kartınızı ekleyin, rotanızdaki işleri bulun ve kazanmaya başlayın.
            </p>
            <Link href="/kayit?role=nakliyeci">
              <Button variant="navy" size="md" className="font-bold">
                Nakliyeci Olarak Katıl →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
