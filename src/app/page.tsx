'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MapPin,
  Check,
  Star,
  ShieldCheck,
  Truck,
  ChevronRight,
  BookOpen,
  Clock,
  Phone,
  MessageSquare,
  TrendingUp,
  Package,
  CircleDot,
  MoveRight,
  Dot,
  Building2,
  FileCheck,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  ShieldAlert,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

// Demo teklif karşılaştırma verisi
const DEMO_OFFERS = [
  {
    rank: 1,
    firma: 'Boğaziçi Nakliyat',
    puan: 4.9,
    yorumSayisi: 127,
    fiyat: 24500,
    kdvDahil: true,
    paketleme: true,
    sigorta: true,
    asansor: true,
    demontaj: true,
    montaj: true,
    teslimat: 'Aynı Gün',
    onayliBadge: true,
  },
  {
    rank: 2,
    firma: 'Anadolu Ekspres',
    puan: 4.7,
    yorumSayisi: 89,
    fiyat: 21900,
    kdvDahil: false,
    paketleme: false,
    sigorta: true,
    asansor: false,
    demontaj: true,
    montaj: false,
    teslimat: '24 Saat',
    onayliBadge: true,
  },
  {
    rank: 3,
    firma: 'Güven Taşımacılık',
    puan: 4.4,
    yorumSayisi: 52,
    fiyat: 18750,
    kdvDahil: false,
    paketleme: false,
    sigorta: false,
    asansor: false,
    demontaj: false,
    montaj: false,
    teslimat: '2 Gün',
    onayliBadge: false,
  },
];

const HOMEPAGE_FAQS = [
  {
    q: 'Müşteriler için talep açmak ve teklif almak ücretli mi?',
    a: 'Hayır, %100 ücretsizdir. Müşteriler talep açarken veya teklifleri karşılaştırırken hiçbir komisyon veya ücret ödemez. Anlaştığınız nakliyat firmasına taşıma günü doğrudan anlaştığınız fiyatı ödersiniz.'
  },
  {
    q: 'Teklifler ne kadar sürede gelir?',
    a: 'Talebinizi oluşturduğunuz anda güzergahınızdaki onaylı nakliyecilere anlık bildirim gider. Genellikle ilk 5-15 dakika içinde ilk teklifler panelinize düşmeye başlar.'
  },
  {
    q: 'Firmaların güvenilirliği ve yetki belgeleri nasıl denetlenir?',
    a: 'Platformumuzdaki firmalar T.C. Ulaştırma ve Altyapı Bakanlığı K3 Yetki Belgesi, Vergi Levhası ve Adli Sicil onayından geçirilir. Yalnızca evrakları onaylanan nakliyeciler teklif verebilir.'
  },
  {
    q: 'Mobil asansör ve mobilya montajı dahil mi?',
    a: 'Talep oluştururken kat durumunuza göre dış cephe mobil asansörü ve marangozluk montaj hizmetini seçebilirsiniz. Gelen teklif kartlarında bu hizmetlerin fiyata dahil olup olmadığını yeşil onay işaretleriyle net şekilde görürsünüz.'
  },
  {
    q: 'Nakliyeciler platforma nasıl katılır?',
    a: 'Nakliyeci kayıt formunu doldurup işletme belgelerinizi yükleyerek 7 gün ücretsiz Gold deneme üyeliğinizi hemen başlatabilirsiniz. Onaylanan başvurularla aynı gün iş teklifleri vermeye başlayabilirsiniz.'
  }
];

const POPULAR_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep'];

export default function HomePage() {
  const defterPosts = db.getDefterPosts().slice(0, 4);
  const verifiedCarriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED').slice(0, 3);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [heroOriginCity, setHeroOriginCity] = useState('İstanbul');
  const [heroDestCity, setHeroDestCity] = useState('Ankara');

  const categoryLabels: Record<string, string> = {
    EMPTY_VEHICLE: 'Boş Araç',
    CARGO_JOB: 'Yük Arıyorum',
    RETURN_TRIP: 'Boş Dönüş',
    PARTIAL_LOAD: 'Parsiyel',
    ELEVATOR: 'Asansör',
    STAFF: 'Personel',
    EQUIPMENT: 'Ekipman',
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── 1. HERO WITH AUTHENTIC LOGISTICS / TRUCK BACKGROUND ── */}
      <section className="bg-[#0A1128] text-white relative overflow-hidden">
        
        {/* Background photo overlay with rich navy gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&auto=format&fit=crop&q=80"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.15] mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/95 to-[#0A1128]/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

            {/* Left: Headline & Dual Action Widget (7/12) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] tracking-tight text-white">
                Taşınmanızı Planlayın,<br />
                <span className="text-[#F95700]">Teklifleri Tek Yerde</span><br />
                Karşılaştırın.
              </h1>

              {/* ── DUAL ROUTE SEARCH WIDGET (Hero Quick Action) ── */}
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-white/20 max-w-xl mx-auto lg:mx-0">
                
                {/* Top: Nereden / Nereye Select Inputs */}
                <div className="grid grid-cols-2 bg-white rounded-2xl border-2 border-slate-200 divide-x-2 divide-slate-200 overflow-hidden shadow-2xs mb-3.5 text-left">
                  {/* Nereden */}
                  <div className="relative p-2.5 sm:p-3 flex items-center gap-2">
                    <CircleDot className="w-4 h-4 text-[#F95700] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nereden</label>
                      <select
                        value={heroOriginCity}
                        onChange={e => setHeroOriginCity(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-black text-slate-900 focus:outline-none cursor-pointer truncate"
                      >
                        {TURKEY_CITIES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nereye */}
                  <div className="relative p-2.5 sm:p-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F95700] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Nereye</label>
                      <select
                        value={heroDestCity}
                        onChange={e => setHeroDestCity(e.target.value)}
                        className="w-full bg-transparent text-xs sm:text-sm font-black text-slate-900 focus:outline-none cursor-pointer truncate"
                      >
                        {TURKEY_CITIES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom: Teklif Al (Orange) + veya + Dönüş Aracı Bul (Dark Navy) */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href={`/teklif-al?originCity=${encodeURIComponent(heroOriginCity)}&destCity=${encodeURIComponent(heroDestCity)}`}
                    className="flex-1"
                  >
                    <button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Teklif Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>

                  <span className="text-xs font-bold text-slate-400 shrink-0">veya</span>

                  <Link
                    href={`/nakliyeci-defteri?originCity=${encodeURIComponent(heroOriginCity)}&destCity=${encodeURIComponent(heroDestCity)}`}
                    className="flex-1"
                  >
                    <button className="w-full bg-[#0A1128] hover:bg-[#132247] text-white font-black text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                      <span>Dönüş Aracı Bul</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Teklif Karşılaştırma Preview (5/12) - Elevated & Prominent */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-gradient-to-b from-[#132247] to-[#0A1128] border-2 border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative">
                
                {/* DEMO badge */}
                <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-[#F95700] text-[11px] font-black text-white uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Örnek Teklif Karşılaştırma
                </div>

                <div className="flex items-center justify-between mb-4 pt-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mb-0.5">
                      <CircleDot className="w-3.5 h-3.5 text-[#F95700]" />
                      <span>İstanbul, Kadıköy</span>
                      <MoveRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ankara, Çankaya</span>
                    </div>
                    <p className="text-sm font-black text-white">3+1 Ev Taşıma · 15 Eylül 2026 · 3 Teklif</p>
                  </div>
                </div>

                {/* Comparison rows */}
                <div className="space-y-2.5">
                  {DEMO_OFFERS.map((o, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-3.5 sm:p-4 transition-all ${
                        i === 0
                          ? 'bg-[#F95700]/15 border-2 border-[#F95700]/50 shadow-sm'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                            i === 0 ? 'bg-[#F95700] text-white' : 'bg-white/15 text-slate-200'
                          }`}>
                            {o.rank}
                          </div>
                          <span className="font-black text-sm text-white">{o.firma}</span>
                          {o.onayliBadge && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                          <span className="flex items-center gap-0.5 text-xs text-amber-400 font-black">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {o.puan}
                          </span>
                        </div>
                        <span className={`text-base font-black ${i === 0 ? 'text-[#F95700]' : 'text-white'}`}>
                          {o.fiyat.toLocaleString('tr-TR')} TL
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'paketleme', label: 'Paketleme', v: o.paketleme },
                          { key: 'sigorta', label: 'Sigorta', v: o.sigorta },
                          { key: 'asansor', label: 'Asansör', v: o.asansor },
                          { key: 'kdv', label: 'KDV Dahil', v: o.kdvDahil },
                        ].map(item => (
                          <span
                            key={item.key}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              item.v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400 line-through'
                            }`}
                          >
                            {item.v ? '✓' : '✕'} {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Tüm kriterler şeffaf ve net</span>
                  <Link href="/teklif-al" className="text-[#F95700] font-black hover:underline flex items-center gap-1">
                    Teklif Toplamaya Başla →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. 4 ADIMDA NASIL ÇALIŞIR — Logistics Visual ───── */}
      <section className="bg-[#F8FAFC] border-b border-slate-200 py-16 sm:py-20 relative overflow-hidden">
        
        {/* Faint background logistics pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23F95700\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/10 text-[#F95700] text-xs font-black border border-[#F95700]/20 mb-4">
              🚛 Nasıl Çalışır?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-2">4 Adımda Kolayca Taşının</h2>
            <p className="text-slate-500 font-medium">Talep açmak 2 dakika sürer — komisyon olmadan doğrudan nakliyeciyle anlaşın.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { step: '01', emoji: '📋', title: 'Talep Aç', desc: 'Nereden nereye, oda sayısı ve tarih. 2 dakikada hazır.', color: 'bg-[#F95700]', cardBg: 'bg-white border-[#F95700]/20' },
              { step: '02', emoji: '🚛', title: 'Teklifler Gelsin', desc: 'Bölgenizdeki onaylı nakliyeciler fiyatlarını sunsun.', color: 'bg-[#0A1128]', cardBg: 'bg-white border-slate-200' },
              { step: '03', emoji: '⚖️', title: 'Yan Yana Kıyasla', desc: 'Fiyat, asansör, ambalaj ve sigortayı tek tabloda gör.', color: 'bg-[#0A1128]', cardBg: 'bg-white border-slate-200' },
              { step: '04', emoji: '📦', title: 'Firmayı Seç', desc: 'Telefonla veya mesajla görüşüp taşınmanı başlat.', color: 'bg-[#0A1128]', cardBg: 'bg-white border-slate-200' },
            ].map((item, i) => (
              <div key={i} className={`relative ${item.cardBg} border-2 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all group`}>
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md ${item.color}`}>
                    {item.step}
                  </div>
                  <span className="text-3xl">{item.emoji}</span>
                </div>

                <h3 className="font-black text-[#0A1128] text-base mb-1.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-snug">{item.desc}</p>

                {/* Connector arrow for desktop */}
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#F95700] text-white flex items-center justify-center text-xs font-black shadow-md">
                      →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/teklif-al">
              <Button variant="primary" size="lg" className="font-black px-10 shadow-lg shadow-orange-900/15"
                rightIcon={<ArrowRight className="w-5 h-5" />}>
                Hemen Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. GÜVENCE & DENETİM STANDARTLARI ─────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-[#F95700] uppercase tracking-wider block mb-1">Güvenilirlik &amp; Standartlar</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Neden Nakliyem Para ile Taşınmalısınız?</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Sektördeki belgesiz ve merdiven altı riskleri ortadan kaldırıyoruz.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#F95700]" />,
                title: 'T.C. K3 Belgeli Nakliyeciler',
                desc: 'Tüm nakliye firmalarımızın Ulaştırma Bakanlığı K3 yetki belgesi ve vergi levhası doğrulanır.'
              },
              {
                icon: <FileCheck className="w-6 h-6 text-[#F95700]" />,
                title: 'Şeffaf Kapsam & Sabit Fiyat',
                desc: 'Paketleme, asansör ve montaj dahil fiyat alırsınız; taşınma günü sürpriz ek ücret çıkmaz.'
              },
              {
                icon: <Truck className="w-6 h-6 text-[#F95700]" />,
                title: 'Araç Üstü Mobil Asansör',
                desc: 'Yüksek katlı binalarda eşyalarınız dar merdivenlerden geçmeden hidrolik asansörle güvenle indirilir.'
              },
              {
                icon: <Award className="w-6 h-6 text-[#F95700]" />,
                title: 'Gerçek Müşteri Değerlendirmeleri',
                desc: 'Yalnızca platform üzerinden taşınan müşterilerin onaylı puan ve yorumları yayınlanır.'
              },
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <h3 className="font-black text-[#0A1128] text-base">{card.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. NAKLİYECİ İÇİN — Operasyon & Defter Merkezi ─────── */}
      <section className="bg-[#0A1128] text-white py-16 sm:py-24 relative overflow-hidden">
        
        {/* Authentic Logistics Fleet Photo with Dark Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&auto=format&fit=crop&q=80"
            alt="Nakliye Filosu ve Karayolu Taşımacılığı"
            className="w-full h-full object-cover opacity-15 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1128] via-[#0A1128]/95 to-[#0A1128]/80" />
        </div>

        {/* Floating Cargo Box & Truck Silhouettes in Background */}
        <div className="absolute right-10 top-12 opacity-5 text-7xl select-none pointer-events-none hidden lg:block">
          🚛
        </div>
        <div className="absolute right-1/3 bottom-8 opacity-5 text-6xl select-none pointer-events-none hidden lg:block">
          📦
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left: Value Proposition (6/12) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black border border-[#F95700]/30 shadow-xs">
                <Truck className="w-3.5 h-3.5" />
                <span>Nakliyeci İşletim Sistemi</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Sadece iş bulmak değil,<br />
                <span className="text-[#F95700]">işletmenizi büyütmek</span> için.
              </h2>

              <p className="text-slate-300 font-medium text-sm sm:text-base leading-relaxed">
                Rotanıza uygun işleri bulun. Boş dönüşlerinizi doldurun. Takvimi yönetin. Meslektaşlarınızla Defter üzerinden bağlantı kurun ve kiralık mobil asansör paslaşın.
              </p>

              {/* 4 Feature Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-white mb-1">
                    <span className="text-[#F95700]">🎯</span>
                    <span>Rota Eşleşmesi</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">%92 eşleşme skoru ile doğru işler</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-white mb-1">
                    <span className="text-[#F95700]">🔄</span>
                    <span>Boş Dönüş</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Dönüş rotanı doldur, ekstra kazan</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-white mb-1">
                    <span className="text-[#F95700]">📅</span>
                    <span>Operasyon Takvimi</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Günlük iş planı, müsaitlik yönetimi</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-white mb-1">
                    <span className="text-[#F95700]">📖</span>
                    <span>Nakliyeci Defteri</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Sektörle bağlantı, yük &amp; araç</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/kayit?role=nakliyeci">
                  <Button variant="primary" size="lg" className="font-black px-8 py-4 shadow-lg shadow-orange-900/30 text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    7 Gün Ücretsiz Başla →
                  </Button>
                </Link>
                <Link href="/paketler">
                  <Button variant="outline-white" size="lg" className="font-bold">
                    Abonelik Paketleri
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Live Operation Command Center & Defter Feed (6/12) */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Command Center Card */}
              <div className="bg-gradient-to-b from-[#132247] to-[#0A1128] border-2 border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Operasyon Merkezi</span>
                    <span className="text-sm font-black text-white">Bugün · 28 Ağustos</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/30">
                    ● AKTİF
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-bold text-slate-300">Yeni Eşleşen İşler</span>
                    <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-black">3 YENİ</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-bold text-slate-300">Bekleyen Tekliflerim</span>
                    <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-white font-black">2 BEKLEYEN</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="font-bold text-slate-300">Bugünkü Taşıma</span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-black">1 BUGÜN</span>
                  </div>
                </div>

                {/* Match Highlight Banner */}
                <div className="p-3.5 rounded-2xl bg-[#F95700]/15 border border-[#F95700]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-[#F95700] block">%94 Rota Eşleşmesi</span>
                    <span className="text-[11px] text-slate-300">✓ Hizmet bölgesinde · ✓ Müsait tarihte</span>
                  </div>
                  <span className="text-xs font-black text-white bg-white/10 px-2.5 py-1 rounded-lg">
                    Ankara → İstanbul
                  </span>
                </div>
              </div>

              {/* Canlı Defter Akışı Preview */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-black text-xs text-white flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#F95700]" /> Canlı Defter Akışı
                  </span>
                  <Link href="/nakliyeci-defteri" className="text-xs text-[#F95700] font-black hover:underline">
                    Tümünü Gör →
                  </Link>
                </div>

                {defterPosts.slice(0, 2).map((post) => (
                  <div key={post.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-[#F95700]/40 transition-all space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#F95700]">{post.originCity} → {post.destinationCity}</span>
                      <span className="text-[10px] text-slate-400">{post.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-1 font-medium">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SIKÇA SORULAN SORULAR (SSS) ───────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-black text-[#F95700] uppercase tracking-wider block mb-1">Merak Edilenler</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Sıkça Sorulan Sorular</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Taşınma süreci ve platform işleyişi hakkında bilmeniz gerekenler.</p>
          </div>

          <div className="space-y-3">
            {HOMEPAGE_FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <span className="font-black text-sm text-[#0A1128] pr-4">{faq.q}</span>
                  {openFaqIndex === i
                    ? <ChevronUp className="w-5 h-5 text-[#F95700] shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  }
                </button>
                {openFaqIndex === i && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-200/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. ŞEHİRLERE GÖRE NAKLİYAT — Visual Cards ─── */}
      <section className="py-16 sm:py-20 bg-[#0A1128] relative overflow-hidden">
        
        {/* Background dot texture */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'radial-gradient(circle, #F95700 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black border border-[#F95700]/30 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Tüm Türkiye&apos;de Hizmet
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Şehre Göre Nakliyat Firmaları</h2>
            <p className="text-slate-400 text-sm font-medium">81 il genelinde K3 belgeli, puanı yüksek evden eve nakliyat firmaları</p>
          </div>

          {/* City Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { city: 'İstanbul', slug: 'istanbul', count: '340+', accent: 'border-blue-500/30 hover:border-blue-400/60' },
              { city: 'Ankara', slug: 'ankara', count: '180+', accent: 'border-white/10 hover:border-[#F95700]/60' },
              { city: 'İzmir', slug: 'izmir', count: '140+', accent: 'border-cyan-500/30 hover:border-cyan-400/60' },
              { city: 'Bursa', slug: 'bursa', count: '90+', accent: 'border-white/10 hover:border-[#F95700]/60' },
              { city: 'Antalya', slug: 'antalya', count: '85+', accent: 'border-white/10 hover:border-[#F95700]/60' },
              { city: 'Adana', slug: 'adana', count: '65+', accent: 'border-white/10 hover:border-[#F95700]/60' },
              { city: 'Konya', slug: 'konya', count: '70+', accent: 'border-white/10 hover:border-[#F95700]/60' },
              { city: 'Gaziantep', slug: 'gaziantep', count: '55+', accent: 'border-white/10 hover:border-[#F95700]/60' },
            ].map((item) => (
              <Link
                key={item.city}
                href={`/nakliyat-firmalari/${encodeURIComponent(item.slug)}`}
                className={`group relative bg-white/5 hover:bg-white/10 border ${item.accent} rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-900/20`}
              >
                {/* Pin icon */}
                <div className="w-8 h-8 rounded-xl bg-[#F95700]/20 flex items-center justify-center mb-3">
                  <MapPin className="w-4 h-4 text-[#F95700]" />
                </div>
                <h3 className="font-black text-white text-sm sm:text-base leading-tight">
                  {item.city}
                </h3>
                <p className="text-[10px] text-[#F95700] font-black mt-0.5">Nakliyat</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold">{item.count} Onaylı Firma</span>
                  <span className="text-[#F95700] text-xs font-black group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Thin separator */}
          <div className="border-t border-white/10 my-8" />

          {/* Bottom CTA */}
          <div className="relative rounded-3xl border border-[#F95700]/30 bg-gradient-to-r from-[#F95700]/10 via-white/5 to-[#F95700]/10 p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[#F95700]/5 opacity-50 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#F95700]/20 border border-[#F95700]/30 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-[#F95700]" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">Hemen Taşınma Teklifi Toplayın</h3>
              <p className="text-sm text-slate-300 font-medium mb-6 max-w-lg mx-auto">
                2 dakikanızı ayırın — bölgenizdeki K3 belgeli firmaların fiyatlarını ücretsiz karşılaştırın, sürpriz ek ücret olmadan.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/teklif-al">
                  <Button variant="primary" size="lg" className="font-black px-10 shadow-lg shadow-orange-900/30 text-base" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Ücretsiz Teklif Al
                  </Button>
                </Link>
                <Link href="/nakliyat-firmalari">
                  <button className="px-6 py-3.5 rounded-2xl border border-white/20 text-white font-black text-sm hover:bg-white/10 transition-all">
                    Tüm Firmaları Gör →
                  </button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
