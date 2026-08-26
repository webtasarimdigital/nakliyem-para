import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { UserCheck, Truck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nasıl Kullanmak İstiyorsunuz? | Nakliyem Para',
  description: 'Müşteri olarak ücretsiz ev taşıma teklifi alın veya nakliyeci olarak yeni taşıma işlerine ulaşıp firmanızı büyütün.'
};

export default function RoleSelectionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 md:py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          Nasıl Kullanmak İstiyorsunuz?
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-slate-600">
          Size en uygun hesap tipini seçerek hemen devam edin.
        </p>
      </div>

      {/* Two Big Role Selection Cards (Spec Item 7) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#146EF5] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group text-center sm:text-left">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#146EF5] flex items-center justify-center font-bold mx-auto sm:mx-0 group-hover:scale-110 transition-transform">
              <UserCheck className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-slate-900 group-hover:text-[#146EF5] transition-colors">
              Nakliyat Hizmeti Almak İstiyorum
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Taşınma talebi oluşturun, bölgenizdeki doğrulanmış nakliyat firmalarından ücretsiz fiyat teklifleri alın ve karşılaştırın.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 pt-2 text-left">
              <li className="flex items-center gap-2">✓ Tamamen ücretsiz teklifler</li>
              <li className="flex items-center gap-2">✓ Firmalarla güvenli mesajlaşma</li>
              <li className="flex items-center gap-2">✓ Ödeme doğrudan nakliyeciye yapılır</li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link href="/kayit/musteri" className="w-full block">
              <Button variant="primary" size="lg" className="w-full font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Müşteri Olarak Devam Et
              </Button>
            </Link>
          </div>
        </div>

        {/* Carrier Card */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group text-center sm:text-left">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mx-auto sm:mx-0 group-hover:scale-110 transition-transform">
              <Truck className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-black text-slate-900 group-hover:text-amber-600 transition-colors">
              Nakliyat Hizmeti Vermek İstiyorum
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Yeni taşıma işlerine ulaşın, 30 saniyede teklif verin, Nakliyeci Defteri ile boş dönüşlerinizi paraya çevirin ve firmanızı büyütün.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 pt-2 text-left">
              <li className="flex items-center gap-2">★ 7 gün boyunca ücretsiz kullanım</li>
              <li className="flex items-center gap-2">★ Rota alarmları & boş araç ağı</li>
              <li className="flex items-center gap-2">★ Kurumsal onaylı firma profili</li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link href="/kayit/nakliyeci" className="w-full block">
              <Button variant="gold" size="lg" className="w-full font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Nakliyeci Olarak Devam Et
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
