'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Building2, 
  Package, 
  Warehouse, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Bell, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DynamicAdSlot } from '@/components/ui/DynamicAdSlot';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

export default function HomePage() {
  const router = useRouter();
  const [originCity, setOriginCity] = useState('İstanbul');
  const [originDistrict, setOriginDistrict] = useState('Kadıköy');
  const [destCity, setDestCity] = useState('Ankara');
  const [destDistrict, setDestDistrict] = useState('Çankaya');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const popularCities = TURKEY_CITIES.filter(c => c.isPopular).slice(0, 8);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/teklif-al?originCity=${encodeURIComponent(originCity)}&originDistrict=${encodeURIComponent(originDistrict)}&destCity=${encodeURIComponent(destCity)}&destDistrict=${encodeURIComponent(destDistrict)}`);
  };

  const originDistricts = TURKEY_CITIES.find(c => c.name === originCity)?.districts || [];
  const destDistricts = TURKEY_CITIES.find(c => c.name === destCity)?.districts || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#EAF3FF]/70 via-white to-[#F7F9FC] pt-10 pb-16 md:py-20 border-b border-slate-200/60 overflow-hidden">
        {/* Subtle decorative grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#146ef508_1px,transparent_1px),linear-gradient(to_bottom,#146ef508_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0B3B8F] text-xs font-bold mb-4 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-[#146EF5]" />
              <span>Güvenilir Nakliyat & İş Ağı Platformu</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
              Evden Eve Nakliyat İçin Teklif Al, <br className="hidden sm:inline" />
              <span className="text-[#146EF5]">Firmaları Karşılaştır</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Taşınma bilgilerinizi tek formda paylaşın. Doğrulanmış nakliyat firmalarından ücretsiz teklifler alın, hizmetleri karşılaştırın ve hangi firmayla çalışacağınıza siz karar verin.
            </p>
          </div>

          {/* Quick Route Form */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200 p-4 sm:p-6">
            <form onSubmit={handleHeroSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-[#146EF5] focus-within:bg-white transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#146EF5]" />
                    Nereden Taşınıyorsunuz?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={originCity}
                      onChange={(e) => {
                        setOriginCity(e.target.value);
                        const cityObj = TURKEY_CITIES.find(c => c.name === e.target.value);
                        if (cityObj && cityObj.districts[0]) setOriginDistrict(cityObj.districts[0]);
                      }}
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {TURKEY_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <select
                      value={originDistrict}
                      onChange={(e) => setOriginDistrict(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-600 focus:outline-none cursor-pointer truncate"
                    >
                      {originDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-emerald-600 focus-within:bg-white transition-all">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    Nereye Taşınıyorsunuz?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={destCity}
                      onChange={(e) => {
                        setDestCity(e.target.value);
                        const cityObj = TURKEY_CITIES.find(c => c.name === e.target.value);
                        if (cityObj && cityObj.districts[0]) setDestDistrict(cityObj.districts[0]);
                      }}
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      {TURKEY_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <select
                      value={destDistrict}
                      onChange={(e) => setDestDistrict(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-600 focus:outline-none cursor-pointer truncate"
                    >
                      {destDistricts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-slate-500 text-center sm:text-left">
                  ✓ Teklif almak tamamen ücretsizdir • Ödeme platform üzerinden tahsil edilmez
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Teklif Almaya Başla
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              İhtiyacınıza Uygun Nakliyat Hizmetini Seçin
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Türkiye genelinde her türlü ev, ofis ve parça eşya nakliyesi için uzman ekipler.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/evden-eve-nakliyat"
              className="p-6 rounded-2xl border border-slate-200/90 hover:border-[#146EF5] hover:shadow-lg transition-all group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#146EF5] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#146EF5] transition-colors mb-2">
                  Evden Eve Nakliyat
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ambalajlama, marangozlu montaj ve asansörlü güvenli ev taşıma hizmeti.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#146EF5]">
                <span>Detayları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/ofis-tasima"
              className="p-6 rounded-2xl border border-slate-200/90 hover:border-[#146EF5] hover:shadow-lg transition-all group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#146EF5] transition-colors mb-2">
                  Ofis & İşyeri Taşıma
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  İş kesintisini minimuma indiren sigortalı ve planlı kurumsal ofis taşımacılığı.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#146EF5]">
                <span>Detayları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/parca-esya-tasima"
              className="p-6 rounded-2xl border border-slate-200/90 hover:border-[#146EF5] hover:shadow-lg transition-all group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#146EF5] transition-colors mb-2">
                  Parça Eşya Taşıma
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tek koltuk, beyaz eşya veya birkaç koli için uygun fiyatlı parsiyel taşıma.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#146EF5]">
                <span>Detayları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/esya-depolama"
              className="p-6 rounded-2xl border border-slate-200/90 hover:border-[#146EF5] hover:shadow-lg transition-all group bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Warehouse className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-[#146EF5] transition-colors mb-2">
                  Eşya Depolama
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  7/24 güvenlikli, nem ve rutubetten arındırılmış özel oda tipi depolama.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-[#146EF5]">
                <span>Detayları İncele</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC AD SLOT - FEATURED CARRIERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <DynamicAdSlot
          slotKey="homepage.featured_carriers"
          title="Öne Çıkan & Onaylı Nakliyat Firmaları"
          subtitle="Belgeleri kontrol edilmiş, müşteri memnuniyeti yüksek doğrulanmış nakliyat firmaları."
        />
      </div>

      {/* 4. HOW IT WORKS (NASIL ÇALIŞIR) */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Nakliyat Teklifi Nasıl Alınır?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              4 basit adımda en uygun nakliye firmasını bulun ve taşınmanızı güvenceye alın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="bg-[#F7F9FC] p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-[#146EF5] text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Bilgilerinizi Girin</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nereden nereye taşınacağınızı, kat ve oda sayınızı 2 dakikalık formda doldurun.
              </p>
            </div>

            <div className="bg-[#F7F9FC] p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-[#146EF5] text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Talebinizi Yayınlayın</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Talebiniz bölgenizde ve rotanızda hizmet veren doğrulanmış firmalara anında iletilir.
              </p>
            </div>

            <div className="bg-[#F7F9FC] p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-[#146EF5] text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Teklifleri Karşılaştırın</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gelen fiyatları, paketleme ve asansör kapsamlarını, firma puanlarını karşılaştırın.
              </p>
            </div>

            <div className="bg-[#F7F9FC] p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Firmanızı Seçin</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                En uygun firmayla anlaşıp işi başlatın. Taşıma ücretini doğrudan nakliyeciye ödeyin.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/teklif-al">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Hemen Nakliyat Teklifi Al
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CITIES DIRECTORY SEO */}
      <section className="py-14 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Şehrinizdeki Nakliyat Firmalarını Bulun
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Türkiye genelinde 81 ilde hizmet veren onaylı yerel nakliyecileri inceleyin.
              </p>
            </div>
            <Link href="/nakliyat-firmalari" className="text-xs font-bold text-[#146EF5] hover:underline">
              Tüm İlleri Gör →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {popularCities.map((city) => (
              <Link
                key={city.slug}
                href={`/nakliyat-firmalari/${city.slug}`}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#146EF5] hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#146EF5] shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#146EF5] block">
                      {city.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {city.districts.length} İlçe
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#146EF5] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. B2B CARRIER CTA & DEFTER SPOTLIGHT */}
      <section className="py-16 bg-gradient-to-r from-[#0D1B2A] to-[#0B3B8F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-md border border-amber-400/20 mb-3 inline-block">
                Nakliyat Firmaları İçin İş Ağı
              </span>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                Yeni Taşıma İşlerine Ulaşın, Boş Dönüşlerinizi Kazanca Çevirin
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Hizmet verdiğiniz bölgelerde açılan müşteri taleplerini anında takip edin, teklif verin. Nakliyeci Defteri ile boş araçlarınızı meslektaşlarınızla paylaşarak çift yönlü kazanın.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Günlük 100+ Gerçek Taşıma Talebi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rota ve Bölge Bazlı İş Alarmları</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Meslektaşlar Arası Boş Araç & Yük Paylaşımı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7 Gün Boyunca Tamamen Ücretsiz Deneme</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/nakliyeciler">
                  <Button variant="gold" size="lg">
                    7 Gün Ücretsiz Dene
                  </Button>
                </Link>
                <Link href="/nakliyeci-defteri">
                  <Button variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                    Defter&apos;i İncele
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mock Defter Card Preview */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#146EF5]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Defter Canlı Akışı</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  Aktif Paylaşımlar
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                    <span>Trabzon → İstanbul</span>
                    <span className="text-[10px] text-slate-400">12 dk önce</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    &quot;Yarın 10 teker aracımız Trabzon&apos;dan boş dönüyor. Samsun, Çorum, Ankara güzergâhında parça yük alınır.&quot;
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center justify-between font-bold text-amber-300 mb-1">
                    <span>İstanbul (Kadıköy)</span>
                    <span className="text-[10px] text-slate-400">25 dk önce</span>
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2">
                    &quot;15. kata kadar çıkan araç üstü hidrolik asansörümüz operatörü ile kiralıktır.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Nakliyat Hakkında Sıkça Sorulan Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Teklif alma, firmalarla anlaşma ve taşıma sürecine dair tüm detaylar.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Nakliyat teklifi almak ücretli mi?',
                a: 'Hayır. Müşteriler için talep oluşturmak ve nakliyat firmalarından teklif almak tamamen ücretsizdir.'
              },
              {
                q: 'Taşıma ücretini platforma mı ödüyorum?',
                a: 'Hayır. Platform nakliye bedelini tahsil etmez. Ödeme miktarını ve şeklini anlaştığınız nakliyat firması ile doğrudan belirlersiniz.'
              },
              {
                q: 'Telefon numaram herkese açık görünür mü?',
                a: 'Hayır. Telefon numaranız yalnızca talep formunda izin vermeniz durumunda ve belgeleri onaylanmış yetkili firmalar tarafından görüntülenebilir.'
              },
              {
                q: 'Firmalar nasıl doğrulanıyor?',
                a: 'Platforma kayıt olan tüm nakliyecilerin vergi levhası, yetkili kimliği ve yetki belgeleri yönetici ekibimiz tarafından incelenip onaylanır.'
              },
              {
                q: 'Teklifleri nasıl karşılaştırabilirim?',
                a: 'Gelen teklifleri fiyata, paketleme kapsamına, asansör durumuna, montaj hizmetine ve firmanın geçmiş müşteri puanlarına göre tek ekranda karşılaştırabilirsiniz.'
              },
              {
                q: 'Talebimi daha sonra kapatabilir miyim?',
                a: 'Evet. İstediğiniz an tek tıkla talebinizi kapatabilir veya başka bir tarih için yeniden yayına alabilirsiniz.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-sm text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#146EF5] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL HOMEPAGE CTA */}
      <section className="py-16 bg-[#EAF3FF] border-t border-blue-100 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Taşınmaya Hazırsanız Teklifleri Karşılaştırmaya Başlayın
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-8">
            Ücretsiz • Birkaç dakika sürer • Ödeme doğrudan anlaştığınız firmaya yapılır
          </p>

          <Link href="/teklif-al">
            <Button variant="primary" size="lg" className="px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Ücretsiz Teklif Al
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
