import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Building2, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';

export const metadata: Metadata = {
  title: 'Evden Eve Nakliyat Fiyat Teklifi Al | Nakliyem Para',
  description: 'Türkiye genelinde profesyonel ve sigortalı evden eve nakliyat firmalarından ücretsiz fiyat teklifi alın. Fiyatları karşılaştırın, en uygun nakliyeciyi seçin.',
  keywords: ['evden eve nakliyat', 'ev taşıma fiyatları', 'asansörlü ev taşıma', 'şehirler arası evden eve']
};

export default function EvdenEveNakliyatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-[#0A1128] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-4 border border-[#F95700]/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sigortalı &amp; Profesyonel Ev Taşıma</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Evden Eve Nakliyat İçin <br />
              <span className="text-[#F95700]">Ücretsiz Teklif Al</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed mb-8 max-w-2xl">
              Eşyalarınız profesyonel ekipler tarafından ambalajlansın, marangozlu mobilya montajı yapılsın ve yüksek katlara mobil asansörle güvenle taşınsın.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=evden-eve">
                <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/30" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Evden Eve Teklifi Al
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

      {/* Featured Carriers in Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DynamicAdSlot
          slotKey="service_page.featured"
          title="Onaylı Evden Eve Nakliyat Firmaları"
          subtitle="Tüm Türkiye ve şehirler arası hatta çalışan yüksek puanlı ev taşıma şirketleri."
        />
      </div>

      {/* Content & Guide */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          <div>
            <h2 className="text-2xl font-black text-[#0A1128] mb-3">Evden Eve Nakliyat Fiyatını Ne Belirler?</h2>
            <p>
              Ev taşıma fiyatları hesaplanırken oda sayısı (1+1, 2+1, 3+1), taşınacak iki bina arasındaki mesafe (km), eşyaların bulunduğu ve gideceği katlar, bina içi asansör durumu ve paketlemenin firma tarafından yapılıp yapılmayacağı gibi etkenler dikkate alınır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-black text-[#0A1128] mb-1">A&apos;dan Z&apos;ye Profesyonel Paketleme</h3>
              <p className="text-xs text-slate-500">Koltuk, yatak ve beyaz eşyalar çift kat balonlu patpat naylon ile sarılarak darbelere karşı korunur.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-black text-[#0A1128] mb-1">Dış Cephe Mobil Asansör Desteği</h3>
              <p className="text-xs text-slate-500">Merdiven darlığı veya bina yönetim yasaklarına takılmadan balkon ve pencerelerden hızlı yükleme yapılır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-50 via-white to-orange-50 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-3">Taşınmaya Hazır mısınız?</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mb-6">2 dakika içinde formunuzu doldurun, anında onaylı firmalardan ücretsiz teklif alın.</p>
          <Link href="/teklif-al?service=evden-eve">
            <Button variant="primary" size="lg" className="font-black px-10 shadow-lg shadow-orange-900/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Hemen Ücretsiz Teklif Al
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
