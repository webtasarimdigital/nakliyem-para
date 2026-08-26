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
      <section className="bg-gradient-to-b from-[#EAF3FF]/80 via-white to-[#F7F9FC] py-14 md:py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B3B8F] text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#146EF5]" />
              <span>Sigortalı & Profesyonel Ev Taşıma</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              Evden Eve Nakliyat İçin <br />
              <span className="text-[#146EF5]">Ücretsiz Teklif Al</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              Eşyalarınız profesyonel ekipler tarafından ambalajlansın, marangozlu mobilya montajı yapılsın ve yüksek katlara mobil asansörle güvenle taşınsın.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/teklif-al?service=evden-eve">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Evden Eve Teklifi Al
                </Button>
              </Link>
              <Link href="/nakliyat-firmalari">
                <Button variant="outline" size="lg">
                  Firmaları İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Carriers in Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <DynamicAdSlot
          slotKey="service_page.featured"
          title="Onaylı Evden Eve Nakliyat Firmaları"
          subtitle="Tüm Türkiye ve şehirler arası hatta çalışan yüksek puanlı ev taşıma şirketleri."
        />
      </div>

      {/* Content & Guide */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Evden Eve Nakliyat Fiyatını Ne Belirler?</h2>
            <p>
              Ev taşıma fiyatları hesaplanırken oda sayısı (1+1, 2+1, 3+1), taşınacak iki bina arasındaki mesafe (km), eşyaların bulunduğu ve gideceği katlar, bina içi asansör durumu ve paketlemenin firma tarafından yapılıp yapılmayacağı gibi etkenler dikkate alınır.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">A&apos;dan Z&apos;ye Profesyonel Paketleme</h3>
              <p className="text-xs text-slate-500">Koltuk, yatak ve beyaz eşyalar çift kat balonlu patpat naylon ile sarılarak darbelere karşı korunur.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-1">Dış Cephe Mobil Asansör Desteği</h3>
              <p className="text-xs text-slate-500">Merdiven darlığı veya bina yönetim yasaklarına takılmadan balkon ve pencerelerden hızlı yükleme yapılır.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-14 bg-[#EAF3FF] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Taşınmaya Hazır mısınız?</h2>
          <p className="text-xs text-slate-600 mb-6">2 dakika içinde formunuzu doldurun, anında teklif almaya başlayın.</p>
          <Link href="/teklif-al?service=evden-eve">
            <Button variant="primary" size="lg">Ücretsiz Teklif Al</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
