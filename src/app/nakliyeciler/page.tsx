import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Truck, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Bell, 
  BookOpen, 
  ArrowRight, 
  Globe, 
  ShieldCheck, 
  DollarSign 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nakliyat Firmaları İçin İş Ağı & 7 Gün Ücretsiz Deneme | Nakliyem Para',
  description: 'Bölgenizdeki ev ve ofis taşıma taleplerine anında teklif verin. Nakliyeci Defteri ile boş dönüşlerinizi paraya çevirin. 7 gün ücretsiz deneyin.',
  keywords: ['nakliyeci üyeliği', 'nakliye işleri', 'boş araç yük bulma', 'nakliyeci iş ağı']
};

export default function NakliyecilerLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero (Spec Item 146) */}
      <section className="bg-gradient-to-b from-[#0D1B2A] to-[#0B3B8F] text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-4 border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Nakliyatçının Dijital Çalışma Aracı</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4">
              Yeni Taşıma İşlerine Ulaşın, <br />
              <span className="text-amber-400">Boş Dönüşleri Kazanca Çevirin</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-8">
              Hizmet verdiğiniz şehirlerde açılan taşıma taleplerini takip edin, 30 saniyede teklif verin ve Nakliyeci Defteri ile Türkiye genelindeki meslektaşlarınızla iş paylaşın.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/kayit/nakliyeci">
                <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  7 Gün Ücretsiz Dene
                </Button>
              </Link>
              <Link href="/paketler">
                <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                  Paketleri ve Özellikleri İncele
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-400 mt-4">
              ✓ Bugün kartınızdan ücret çekilmez • İstediğiniz an tek tıkla iptal edebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid: 4 Pillars of Carrier Value */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1128] mb-3">
              Nakliyeciler Neden Nakliyem Para Kullanıyor?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Platformumuz bir ilan sitesi değil, firmanızı her gün büyütecek modern bir iş istasyonudur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#146EF5] flex items-center justify-center font-bold mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128] mb-2">Günlük Taşıma İşleri</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bölgenizde açılan ev ve ofis taşıma taleplerini filtreleyin, hızlıca fiyat teklifi iletin.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128] mb-2">Nakliyeci Defteri</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Boş araç ve parça yüklerinizi meslektaşlarla paylaşarak gidiş-dönüş dolu çalışın.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128] mb-2">Rota Alarmları</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sürekli çalıştığınız hatlara alarm kurun, yeni talep açıldığı an telefonunuza bildirim gelsin.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0A1128] mb-2">Dijital Reklam Desteği</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Google Ads, web sitesi ve harita optimizasyonu ile platform dışında da düzenli müşteri edinin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Trial CTA */}
      <section className="py-16 bg-[#EAF3FF] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-3">
            7 Gün Boyunca Tamamen Ücretsiz Deneyin
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-8 max-w-xl mx-auto">
            Firmanızı kaydedin, belgelerinizi yükleyin ve bugün onay alarak yeni taşıma işlerine teklif vermeye başlayın.
          </p>
          <Link href="/kayit/nakliyeci">
            <Button variant="primary" size="lg" className="px-8 font-bold">
              Hemen Nakliyeci Hesabı Aç
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
