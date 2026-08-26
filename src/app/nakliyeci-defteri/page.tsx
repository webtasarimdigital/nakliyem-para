import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  BookOpen, 
  Truck, 
  Package, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nakliyeci Defteri — Boş Araç & Yük Paylaşım Ağı | Nakliyem Para',
  description: 'Nakliyeciler arası güvenli iş ağı: Boş araçlarınızı, dönüş rotalarınızı ve kiralık mobil asansör ihtiyaçlarınızı meslektaşlarınızla paylaşın.',
  keywords: ['nakliyeci defteri', 'boş araç dönüşü', 'nakliye yük bul', 'mobil asansör kiralama']
};

export default function NakliyeciDefteriPublicPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero (Spec Item 147) */}
      <section className="bg-gradient-to-b from-[#0D1B2A] to-[#0B3B8F] text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-4 border border-amber-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sadece Onaylı Nakliyat Firmalarına Özel</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4">
              Nakliyecilerin <br />
              <span className="text-amber-400">Canlı İş ve Rota Ağı</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-8">
              Boş aracınızı paylaşın, dönüş güzergâhınızdaki yükleri alın veya yetişemediğiniz işleri güvenilir meslektaşlarınıza paslayın.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/kayit/nakliyeci">
                <Button variant="gold" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Nakliyeci Olarak Katıl (7 Gün Ücretsiz)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Illustrative Preview Feed (Spec Item 147) */}
      <section className="py-16 bg-[#F7F9FC] border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Defter&apos;de Neler Paylaşılıyor?</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Her gün yüzlerce nakliyecinin iş bulduğu ve araç doldurduğu örnek paylaşımlar.
            </p>
          </div>

          <div className="space-y-4">
            {/* Sample Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Truck className="w-5 h-5 text-[#146EF5]" />
                  <span>Trabzon → İstanbul Boş Araç Dönüşü</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  %70 Boş Kapasite
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                &quot;Yarın sabah Trabzon çıkışlı 10 teker kapalı kasa aracımız boştur. Samsun, Çorum, Ankara ve Kocaeli güzergâhında parça eşya veya komple yük kabul edilir.&quot;
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Karadeniz Yıldızı Lojistik (Onaylı Firma)</span>
                <span className="text-[#146EF5] font-semibold">Giriş Yaparak İletişime Geçin →</span>
              </div>
            </div>

            {/* Sample Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Edit3 className="w-5 h-5 text-amber-500" />
                  <span>Kadıköy & Ataşehir Bölgesi Kiralık Mobil Asansör</span>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  15. Kat Operatörlü
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                &quot;Anadolu yakasında çalışan meslektaşlarımız için 15. kata kadar çıkan araç üstü asansörümüz operatörü ile kiralıktır.&quot;
              </p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Boğaziçi Nakliyat (Gold Üye)</span>
                <span className="text-[#146EF5] font-semibold">Giriş Yaparak İletişime Geçin →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#EAF3FF] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-slate-900 mb-3">Defter Ağına Şimdi Katılın</h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6">Türkiye genelinde binlerce meslektaşınızla iş birliği kurun.</p>
          <Link href="/kayit/nakliyeci">
            <Button variant="primary" size="lg">7 Gün Ücretsiz Başla</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
