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
  Users,
  FileText,
  SlidersHorizontal,
  CheckCircle2,
  Calendar,
  Boxes,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

// Helper: Canlı göreceli zaman formatı
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Az önce';
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    if (isNaN(diffMs)) return 'Az önce';
    const diffMin = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  } catch {
    return 'Az önce';
  }
}

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
    teslimat: 'Aynı Gün Teslim',
    arac: '10 Teker Kapalı Kasa',
    onayliBadge: true,
    badgeText: 'En Çok Tercih Edilen'
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
    teslimat: '24 Saat İçinde',
    arac: 'Kapalı Kasa Kamyon',
    onayliBadge: true,
    badgeText: 'Hızlı Teslimat'
  },
  {
    rank: 3,
    firma: 'Güven Taşımacılık',
    puan: 4.5,
    yorumSayisi: 68,
    fiyat: 19500,
    kdvDahil: false,
    paketleme: false,
    sigorta: true,
    asansor: true,
    demontaj: false,
    montaj: false,
    teslimat: '2 Gün İçinde',
    arac: 'Özel Evden Eve Aracı',
    onayliBadge: true,
    badgeText: 'Ekonomik Fiyat'
  },
  {
    rank: 4,
    firma: 'Marmara Lojistik',
    puan: 4.4,
    yorumSayisi: 52,
    fiyat: 17850,
    kdvDahil: false,
    paketleme: false,
    sigorta: false,
    asansor: false,
    demontaj: false,
    montaj: false,
    teslimat: '3 Gün İçinde',
    arac: 'Standart Nakliye',
    onayliBadge: false,
    badgeText: 'Temel Taşıma'
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

  const allActiveRequests = db.getRequests().filter(r => r.status === 'ACTIVE');
  const [requestCategoryFilter, setRequestCategoryFilter] = useState<'ALL' | 'EVDEN_EVE' | 'OFIS_TASIMA' | 'PARCA_ESYA'>('ALL');

  const filteredLiveRequests = allActiveRequests.filter(r => {
    if (requestCategoryFilter === 'ALL') return true;
    return r.serviceCategory === requestCategoryFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── 1. HERO — Rich split layout ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1128 0%, #0f1a3e 50%, #1a2a5e 100%)' }}>

        {/* Dekoratif arka plan katmanları */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Hafif doku görseli */}
          <img
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&auto=format&fit=crop&q=60"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-[0.08]"
          />
          {/* Gradient üst katman */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(10,17,40,0.98) 0%, rgba(10,17,40,0.85) 50%, rgba(26,42,94,0.75) 100%)' }} />
          {/* Turuncu glow — sol alt */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #F95700 0%, transparent 70%)' }} />
          {/* Mavi glow — sağ üst */}
          <div className="absolute -top-20 right-0 w-80 h-80 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #146EF5 0%, transparent 70%)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">

            {/* ── SOL: Başlık + açıklama + arama widgeti ── */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

              {/* Üst badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border border-[#F95700]/30 bg-[#F95700]/10 text-[#F95700]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] animate-pulse" />
                81 İlde Aktif · 10.000+ Taşınma Tamamlandı
              </div>

              {/* H1 */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.06] tracking-tight text-white">
                  Taşınmanızı Planlayın,{' '}
                  <span className="text-[#F95700]">Teklifleri Tek Yerde</span>{' '}
                  Karşılaştırın.
                </h1>
                <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 pt-2">
                  Talep açın, dakikalar içinde onlarca onaylı nakliyeci firmasından fiyat teklifi alın.
                  Paketleme, sigorta, asansör — hepsini yan yana karşılaştırın. <strong className="text-white font-bold">Komisyon yok, aracı yok.</strong>
                </p>
              </div>

              {/* Trust istatistikleri */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-5">
                {[
                  { value: '10K+', label: 'Mutlu Taşınma' },
                  { value: '500+', label: 'Onaylı Nakliyeci' },
                  { value: '4.8', label: 'Ortalama Puan', hasStar: true },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="text-xl font-black text-white flex items-center justify-center lg:justify-start gap-1">
                      <span>{stat.value}</span>
                      {stat.hasStar && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                  </div>
                ))}
                <div className="hidden lg:block w-px h-10 bg-white/10 self-center" />
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                    ].map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt="Gerçek Kullanıcı"
                        className="w-8 h-8 rounded-full border-2 border-[#0A1128] object-cover shadow-sm"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-300 font-semibold">Bu hafta 47 taşınma</span>
                </div>
              </div>

              {/* Arama widgeti */}
              <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-xl mx-auto lg:mx-0 border border-white/10">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 text-left">Hızlı Teklif Al</p>
                <div className="flex gap-2 items-center mb-3">
                  <div className="flex-1 relative">
                    <CircleDot className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F95700]" />
                    <select
                      value={heroOriginCity}
                      onChange={e => setHeroOriginCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2 py-2.5 text-xs font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none cursor-pointer"
                    >
                      {TURKEY_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <MoveRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F95700]" />
                    <select
                      value={heroDestCity}
                      onChange={e => setHeroDestCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-2 py-2.5 text-xs font-bold text-[#0A1128] focus:border-[#F95700] focus:outline-none cursor-pointer"
                    >
                      {TURKEY_CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/teklif-al?originCity=${encodeURIComponent(heroOriginCity)}&destCity=${encodeURIComponent(heroDestCity)}`} className="flex-1">
                    <button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm py-3 px-4 rounded-xl shadow-lg shadow-orange-900/25 transition-all flex items-center justify-center gap-1.5">
                      Teklif Al <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href={`/nakliyeci-defteri?originCity=${encodeURIComponent(heroOriginCity)}&destCity=${encodeURIComponent(heroDestCity)}`} className="flex-1">
                    <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5">
                      Dönüş Aracı Bul <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Alt güvence */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs text-slate-400 font-medium">
                {[
                  { icon: ShieldCheck, text: 'K3 Belgeli Nakliyeciler' },
                  { icon: Check, text: 'Ücretsiz Teklif Al' },
                  { icon: Truck, text: 'Sigortalı Taşıma' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-[#F95700]" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── SAĞ: Demo teklif kartı (Sol tarafla hizalı ve uzatılmış) ── */}
            <div className="lg:col-span-5 w-full flex flex-col justify-between h-full space-y-3">

              {/* Üst floating badge */}
              <div className="flex justify-center lg:justify-between items-center px-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı Teklif Sistemi
                </div>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                  Anlık 4 Onaylı Teklif
                </span>
              </div>

              {/* Ana demo kartı */}
              <div className="relative flex-1 flex flex-col">
                {/* Glow efekti */}
                <div className="absolute inset-0 rounded-3xl blur-xl opacity-20" style={{ background: 'linear-gradient(135deg, #F95700, #146EF5)' }} />

                <div className="relative bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between">
                  {/* DEMO etiketi */}
                  <div className="absolute -top-3.5 left-6 px-3.5 py-1 rounded-full bg-[#F95700] text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-orange-950/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    Örnek Teklif Karşılaştırma
                  </div>

                  {/* Rota başlığı */}
                  <div className="pt-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold mb-1">
                      <CircleDot className="w-3.5 h-3.5 text-[#F95700]" />
                      <span>İstanbul, Kadıköy</span>
                      <MoveRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ankara, Çankaya</span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                      3+1 Ev Eşyası Taşıma · 15 Eylül · 4 Teklif Geldi
                    </p>
                  </div>

                  {/* Teklif satırları */}
                  <div className="space-y-2.5 flex-1">
                    {DEMO_OFFERS.map((o, i) => (
                      <div
                        key={i}
                        className={`rounded-2xl p-3 sm:p-3.5 transition-all ${
                          i === 0
                            ? 'bg-[#F95700]/15 border-2 border-[#F95700]/50 shadow-sm'
                            : 'bg-white/5 border border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${i === 0 ? 'bg-[#F95700] text-white shadow-xs' : 'bg-white/15 text-slate-300'}`}>
                              {o.rank}
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-white truncate">{o.firma}</span>
                            {o.onayliBadge && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                            <span className="flex items-center gap-0.5 text-xs text-amber-400 font-bold shrink-0">
                              <Star className="w-3 h-3 fill-current" />{o.puan}
                            </span>
                          </div>
                          <span className={`text-sm sm:text-base font-black tracking-tight shrink-0 ${i === 0 ? 'text-[#F95700]' : 'text-white'}`}>
                            {o.fiyat.toLocaleString('tr-TR')} TL
                          </span>
                        </div>

                        {/* Alt bilgi: Teslimat & Araç */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mb-2">
                          <span>{o.teslimat}</span>
                          <span>•</span>
                          <span>{o.arac}</span>
                        </div>

                        {/* Özellik Rozetleri (Yeşil ve yeşil olmayanlar kristal netliğinde okunur) */}
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: 'Paketleme', v: o.paketleme },
                            { label: 'Sigorta', v: o.sigorta },
                            { label: 'Asansör', v: o.asansor },
                            { label: 'KDV Dahil', v: o.kdvDahil },
                          ].map(item => (
                            <span 
                              key={item.label} 
                              className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-1 transition-colors ${
                                item.v 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' 
                                  : 'bg-white/10 text-slate-200 border border-white/15 font-semibold'
                              }`}
                            >
                              <span className={item.v ? 'text-emerald-400 font-black' : 'text-slate-400 font-black'}>
                                {item.v ? '✓' : '✕'}
                              </span>
                              <span>{item.label}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium text-[11px]">Tüm kriterler şeffaf ve bağlayıcı</span>
                    <Link href="/teklif-al" className="text-[#F95700] font-black hover:underline flex items-center gap-1 text-xs">
                      Teklif Toplamaya Başla →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Alt kompakt istatistik çubuğu (Sol tarafın taban çizgisiyle hizalı) */}
              <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#F95700]" />
                  <span className="text-[11px] text-slate-400 font-medium">Ort. Yanıt:</span>
                  <span className="text-xs font-black text-white">8 dk</span>
                </div>
                <div className="w-px h-3.5 bg-white/10" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-slate-400 font-medium">Fiyat Tasarrufu:</span>
                  <span className="text-xs font-black text-emerald-400">%23</span>
                </div>
                <div className="w-px h-3.5 bg-white/10 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>K3 Onaylı</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. 4 ADIMDA KOLAYCA TAŞININ (Kurumsal & Modern Akış) ───── */}
      <section className="bg-[#F8FAFC] border-b border-slate-200 py-16 sm:py-20 relative overflow-hidden">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/10 text-[#F95700] text-xs font-black border border-[#F95700]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Şeffaf ve Basit Süreç
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
              4 Adımda Kolayca Taşının
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1 max-w-xl mx-auto">
              Talep oluşturmak sadece 2 dakika sürer. Komisyon ve aracı olmadan doğrudan onaylı nakliyecilerle anlaşırsınız.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Talep Aç',
                desc: 'Nereden nereye, oda sayısı ve tercih ettiğiniz taşınma tarihini 2 dakikada belirtin.',
                accent: 'text-[#F95700] bg-orange-50 border-orange-200',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Teklifler Gelsin',
                desc: 'Güzergahınızdaki onaylı nakliyat firmaları paketleme ve asansör dahil fiyatlarını sunsun.',
                accent: 'text-blue-600 bg-blue-50 border-blue-200',
              },
              {
                step: '03',
                icon: SlidersHorizontal,
                title: 'Yan Yana Kıyasla',
                desc: 'Fiyat, marangoz montajı, paketleme ve sigorta kapsamını tek ekranda şeffafça karşılaştırın.',
                accent: 'text-purple-600 bg-purple-50 border-purple-200',
              },
              {
                step: '04',
                icon: CheckCircle2,
                title: 'Güvenle Taşın',
                desc: 'Doğrudan firma yetkilisiyle telefonla veya mesajla görüşün, sürpriz maliyetsiz taşının.',
                accent: 'text-emerald-600 bg-emerald-50 border-emerald-200',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="relative bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black tracking-wider text-slate-400">
                      ADIM {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${item.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-black text-[#0A1128] text-base mb-1.5 group-hover:text-[#F95700] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Desktop connector line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-xs font-black">
                        →
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/teklif-al">
              <Button
                variant="primary"
                size="lg"
                className="font-black px-10 shadow-lg shadow-orange-900/15 cursor-pointer"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Hemen Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2.5. ÖNE ÇIKAN CANLI TAŞINMA TALEPLERİ (Emlivo Tarzı İlan Akışı) ───── */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] border border-orange-200 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-[#F95700] animate-pulse" />
                <span>Canlı Pazar • Yeni Açılan İşler</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                Öne Çıkan Güncel Taşınma Talepleri
              </h2>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Türkiye genelinde müşterilerimizin açtığı güncel taşınma işleri. Teklif toplayan onaylı ilanlar.
              </p>
            </div>

            <Link href="/talepler" className="shrink-0">
              <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Tüm Talepleri Gör ({allActiveRequests.length})
              </Button>
            </Link>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            {[
              { id: 'ALL', label: 'Tüm İlanlar' },
              { id: 'EVDEN_EVE', label: 'Evden Eve Nakliyat' },
              { id: 'OFIS_TASIMA', label: 'Ofis & Kurumsal' },
              { id: 'PARCA_ESYA', label: 'Parça Eşya' },
            ].map((tab) => {
              const isSelected = requestCategoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRequestCategoryFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0A1128] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredLiveRequests.slice(0, 4).map((req) => {
              const photo = req.photos?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80';
              const serviceLabel = req.serviceCategory === 'EVDEN_EVE' ? 'Evden Eve' : req.serviceCategory === 'OFIS_TASIMA' ? 'Ofis Taşıma' : 'Parça Eşya';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Photo with Overlay Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={photo}
                      alt={req.requestCode}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category & Date Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#0A1128] text-[11px] font-black shadow-xs">
                        {req.homeSize || serviceLabel}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-black shadow-xs">
                        {formatRelativeTime(req.createdAt)}
                      </span>
                    </div>

                    {/* Bottom overlay inside image: Moving date */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1 opacity-90 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-orange-400" />
                        {req.movingDate}
                      </span>
                      <span className="text-[11px] text-amber-300 font-black">
                        {req.offersCount} Teklif Geldi
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    {/* Route */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-black text-[#0A1128]">
                        <span className="truncate">{req.originCity} ({req.originDistrict})</span>
                        <MoveRight className="w-3.5 h-3.5 text-[#F95700] shrink-0" />
                        <span className="truncate">{req.destinationCity} ({req.destinationDistrict})</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-snug">
                        {req.notes}
                      </p>
                    </div>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.originRequiresMobileElevator && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60">
                          Asansörlü
                        </span>
                      )}
                      {req.packagingPreference !== 'CUSTOMER_PACKS' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                          Paketlemeli
                        </span>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        Sigortalı
                      </span>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Talep Kodu</span>
                        <span className="text-xs font-black text-[#0A1128]">{req.requestCode}</span>
                      </div>

                      <Link href="/talepler">
                        <button className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-[#F95700] text-[#F95700] hover:text-white font-black text-xs transition-all flex items-center gap-1 cursor-pointer">
                          <span>Teklif Ver</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
            
          {/* ── BÖLÜM 1: İŞLETMENİZİ BÜYÜTÜN ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16 pb-16 border-b border-white/10">
            
            {/* Sol: Değer Önerisi (6/12) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-bold border border-[#F95700]/30 shadow-xs">
                <Truck className="w-3.5 h-3.5" />
                <span>Nakliyeci Dijital Ekosistemi</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Sadece iş bulmak değil,<br />
                <span className="text-[#F95700]">işletmenizi büyütmek</span> için.
              </h2>

              <p className="text-slate-300 font-normal text-sm sm:text-base leading-relaxed">
                Rotanıza uygun işleri bulun, aracınızın boş kapasitesini doldurun ve takviminizi tek merkezden yönetin. Aracı komisyonu olmadan doğrudan müşteriyle el sıkışın.
              </p>

              {/* 3 Net Özellik Kartı */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="text-xl mb-2">🎯</div>
                  <h4 className="font-bold text-sm text-white mb-1">Rota Eşleşmesi</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">Boş güzergahınıza uyan talepler otomatik önünüze gelir.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="text-xl mb-2">💰</div>
                  <h4 className="font-bold text-sm text-white mb-1">%0 Komisyon</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">Teklif kabul edildiğinde kazancınızdan kesinti yapılmaz.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#F95700]/50 transition-all">
                  <div className="text-xl mb-2">⭐</div>
                  <h4 className="font-bold text-sm text-white mb-1">Kurumsal Vitrin</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">Puanlarınız ve yorumlarınızla bölgenizin lider firması olun.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/kayit?role=nakliyeci">
                  <Button variant="primary" size="lg" className="font-bold px-7 py-3.5 shadow-lg shadow-orange-900/30 text-sm sm:text-base" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    7 Gün Ücretsiz Başla →
                  </Button>
                </Link>
                <Link href="/paketler">
                  <Button variant="outline-white" size="lg" className="font-bold text-sm">
                    Abonelik Paketleri
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sağ: Canlı Operasyon Yönetimi (6/12) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-gradient-to-b from-[#132247] to-[#0A1128] border border-white/15 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Taşıyıcı Kontrol Paneli</span>
                    <span className="text-base font-bold text-white">Canlı Günlük İş Takibi</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    ● AKTİF ÇALIŞIYOR
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/5">
                    <span className="text-xs text-slate-400 font-medium block">Yeni İşler</span>
                    <span className="text-lg font-black text-white">14 Adet</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/5">
                    <span className="text-xs text-slate-400 font-medium block">Aktif Teklifler</span>
                    <span className="text-lg font-black text-[#F95700]">3 Bekleyen</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/5">
                    <span className="text-xs text-slate-400 font-medium block">Onay Oranı</span>
                    <span className="text-lg font-black text-emerald-400">%88</span>
                  </div>
                </div>

                {/* Match Highlight Banner */}
                <div className="p-4 rounded-2xl bg-[#F95700]/15 border border-[#F95700]/30 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#F95700]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>%96 Rota Uyumu Yakalandı</span>
                    </div>
                    <span className="text-xs text-slate-300 font-normal">İstanbul, Kadıköy → İzmir, Karşıyaka (3+1 Ev)</span>
                  </div>
                  <Link href="/kayit?role=nakliyeci">
                    <button className="text-xs font-bold text-white bg-[#F95700] hover:bg-[#E04D00] px-3.5 py-2 rounded-xl transition-all shrink-0">
                      Teklif Ver
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── BÖLÜM 2: NAKLİYECİ DEFTERİ — TÜRKİYE NAKLİYE BORSASI ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Sol: Defter Nedir ve Nasıl Çalışır? (6/12) */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Meslektaşlar Arası Canlı Borsa</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight">
                Nakliyeci Defteri ile<br />
                <span className="text-emerald-400">hiçbir araç boş dönmesin.</span>
              </h3>

              <p className="text-slate-300 font-normal text-sm sm:text-base leading-relaxed">
                Nakliyeci Defteri, 81 ildeki doğrulanmış nakliyatçıların birbirleriyle anlık boş araç, dönüş yükü ve kiralık mobil asansör paylaştığı kapalı devre iş ağıdır.
              </p>

              {/* 3 Pillar Cards */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#F95700] flex items-center justify-center shrink-0 text-base">
                    🚛
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Boş Araç Paylaşımı</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      Ankara&apos;ya eşya indirdiniz ve İstanbul&apos;a boş döneceksiniz. Defter&apos;e 10 saniyede ilan bırakın, güzergahtaki işler telefonunuza gelsin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-base">
                    📦
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Dönüş Yükü &amp; Parsiyel Eşya</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      Kamyonunuzda kalan boş hacmi parça eşyalarla doldurarak sefer kârlılığınızı %60&apos;a kadar artırın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 text-base">
                    🏗️
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Mobil Asansör Kiralama &amp; Paslaşma</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      Farklı şehre gittiğinizde yüksek katlar için yerel meslektaşlarınızdan anında saatlik mobil dış cephe asansörü kiralayın.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/nakliyeci-defteri">
                  <Button variant="primary" size="md" className="font-bold px-6 py-3 rounded-xl shadow-md text-sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Nakliyeci Defteri&apos;ni Canlı İncele →
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sağ: Canlı Defter İlan Akışı Önizleme (6/12) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/20 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-sm text-white">Canlı Defter Paylaşımları</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">81 İl Canlı Akış</span>
                </div>

                {/* Örnek Paylaşım Kartları */}
                <div className="space-y-2.5">
                  {[
                    {
                      route: 'Kayseri → İzmir',
                      type: '🚛 Boş Araç',
                      time: '5 dk önce',
                      desc: 'Yarın sabah Kayseri merkezden çıkacak 10 teker kapalı kasa boş aracımız vardır. Yol üzeri Kırşehir, Konya, Uşak yükleri alınır.',
                      carrier: 'Erciyes Ekspres Lojistik',
                      phone: '0532 411 ** **'
                    },
                    {
                      route: 'Ankara → Antalya',
                      type: '📦 Yük Arıyorum',
                      time: '18 dk önce',
                      desc: 'Cuma günü Ankara Çankaya çıkışlı parça veya komple ev eşyası yükü aranmaktadır. Araç hazır.',
                      carrier: 'Başkent Evden Eve',
                      phone: '0544 220 ** **'
                    },
                    {
                      route: 'İstanbul, Maltepe',
                      type: '🏗️ Mobil Asansör',
                      time: '34 dk önce',
                      desc: '16. kata kadar ulaşabilen hidrolik dış cephe asansörümüz Maltepe ve Kartal civarı meslektaşların kullanımına müsaittir.',
                      carrier: 'Marmara Asansörlü Taşıma',
                      phone: '0530 987 ** **'
                    }
                  ].map((post, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#F95700]">{post.route}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white">
                            {post.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{post.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 font-normal leading-relaxed">{post.desc}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                        <span className="text-slate-400 font-medium">{post.carrier}</span>
                        <span className="font-bold text-emerald-400">📞 {post.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <Link href="/nakliyeci-defteri" className="text-xs font-bold text-[#F95700] hover:underline inline-flex items-center gap-1">
                    Tüm İlanları Defter&apos;de Gör ({defterPosts.length + 80}+ Aktif İlan) →
                  </Link>
                </div>
              </div>
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

          {/* City Cards Grid (Redesigned for maximum clarity and contrast) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {[
              { city: 'İstanbul', slug: 'istanbul', count: '340+', route: 'Tüm Türkiye Rotaları' },
              { city: 'Ankara', slug: 'ankara', count: '180+', route: 'İç Anadolu & Ege Rotaları' },
              { city: 'İzmir', slug: 'izmir', count: '140+', route: 'Ege & Marmara Rotaları' },
              { city: 'Bursa', slug: 'bursa', count: '90+', route: 'Marmara & Güney Rotaları' },
              { city: 'Antalya', slug: 'antalya', count: '85+', route: 'Akdeniz & İç Hatlar' },
              { city: 'Adana', slug: 'adana', count: '65+', route: 'Çukurova & Güneydoğu' },
              { city: 'Konya', slug: 'konya', count: '70+', route: 'Merkez & Akdeniz Bağlantı' },
              { city: 'Gaziantep', slug: 'gaziantep', count: '55+', route: 'Güneydoğu Ekspres Hat' },
            ].map((item) => (
              <Link
                key={item.city}
                href={`/nakliyat-firmalari/${encodeURIComponent(item.slug)}`}
                className="group relative bg-gradient-to-b from-white/[0.12] to-white/[0.05] hover:from-white/[0.18] hover:to-white/[0.08] border border-white/20 hover:border-[#F95700] rounded-3xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/20 backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#F95700]/20 border border-[#F95700]/30 flex items-center justify-center text-[#F95700] group-hover:scale-110 transition-transform shadow-xs">
                      <MapPin className="w-5 h-5 text-[#F95700]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.count} Firma
                    </span>
                  </div>

                  <h3 className="font-black text-white text-lg tracking-tight group-hover:text-[#F95700] transition-colors">
                    {item.city}
                  </h3>
                  <p className="text-xs text-slate-300 font-normal mt-0.5">
                    Evden Eve &amp; Şehirlerarası Nakliyat
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px] truncate">{item.route}</span>
                  <span className="text-[#F95700] font-bold group-hover:translate-x-1 transition-transform shrink-0 flex items-center gap-0.5">
                    İncele →
                  </span>
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
