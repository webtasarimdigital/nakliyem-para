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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

// Demo teklif karşılaştırma verisi
const DEMO_OFFERS = [
  {
    rank: 1,
    firma: 'Boğaziçi Nakliyat',
    puan: 4.8,
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
    puan: 4.6,
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
    puan: 4.3,
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

const POPULAR_CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep'];

export default function HomePage() {
  const defterPosts = db.getDefterPosts().slice(0, 4);
  const verifiedCarriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED').slice(0, 3);

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

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#0A1128] text-white relative overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #F95700 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-0 lg:pt-24 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">

            {/* Left: Copy */}
            <div className="pb-16 lg:pb-24">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#F95700]/40 bg-[#F95700]/10 text-[#F95700] text-xs font-bold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] animate-pulse" />
                Müşteriye Ücretsiz · Nakliyeciden Abonelik
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] tracking-tight mb-5">
                Taşınmanızı Planlayın,<br />
                <span className="text-[#F95700]">Teklifleri Tek Yerde</span><br />
                Karşılaştırın.
              </h1>

              <p className="text-slate-400 text-base sm:text-lg font-medium leading-relaxed mb-8 max-w-lg">
                Talep açın, onaylı nakliyecilerden teklif alın. Fiyat, paketleme, sigorta — her şeyi yan yana görün. Ücretsiz.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/teklif-al">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-black text-base px-8 shadow-lg shadow-[#F95700]/25 w-full sm:w-auto"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Ücretsiz Teklif Al
                  </Button>
                </Link>
                <Link href="/kayit?role=nakliyeci">
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold text-base border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Nakliyeciyim →
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                {['Kayıt gerekmez', 'Kredi kartı yok', 'Onaylı firmalar'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Check className="w-3.5 h-3.5 text-[#F95700]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Teklif Karşılaştırma Preview */}
            <div className="lg:self-end pb-0">
              <div className="bg-[#0F1B3D] border border-white/10 rounded-t-2xl p-5 relative">
                {/* DEMO badge */}
                <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-amber-500 text-[10px] font-black text-white uppercase tracking-wider">
                  Örnek Karşılaştırma
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-0.5">
                      <CircleDot className="w-3 h-3 text-[#F95700]" />
                      <span>İstanbul, Kadıköy</span>
                      <MoveRight className="w-3 h-3" />
                      <span>Ankara, Çankaya</span>
                    </div>
                    <p className="text-sm font-black text-white">3+1 Ev · 15 Eylül 2026 · 3 Teklif</p>
                  </div>
                </div>

                {/* Comparison rows */}
                <div className="space-y-2">
                  {DEMO_OFFERS.map((o, i) => (
                    <div key={i} className={`rounded-xl p-3.5 ${i === 0 ? 'bg-[#F95700]/15 border border-[#F95700]/30' : 'bg-white/5 border border-white/8'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-[#F95700] text-white' : 'bg-white/10 text-slate-300'}`}>
                            {o.rank}
                          </div>
                          <span className="font-bold text-sm text-white">{o.firma}</span>
                          {o.onayliBadge && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                          <span className="flex items-center gap-0.5 text-[11px] text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-current" />
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
                          <span key={item.key} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 line-through'
                          }`}>
                            {item.v ? '✓' : '✕'} {item.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NASIL ÇALIŞIR — Yatay Workflow ──────────────────── */}
      <section className="bg-white border-b border-slate-100 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-2">4 Adımda Nakliyatınız Tamamlanır</h2>
            <p className="text-slate-500 font-medium">Talep açmak 3 dakika sürer — hiç kayıt gerekmez</p>
          </div>

          {/* Horizontal workflow */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-0 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#F95700] via-[#F95700]/50 to-[#F95700]/20 z-0" />

            {[
              { step: '01', title: 'Talep Aç', desc: 'Nereden nereye, ne zaman, ev tipi. 3 dakika.', color: 'bg-[#F95700]' },
              { step: '02', title: 'Teklifler Gelir', desc: 'Onaylı nakliyeciler tekliflerini gönderir.', color: 'bg-[#0A1128]' },
              { step: '03', title: 'Yan Yana Karşılaştır', desc: 'Fiyat, paketleme, sigorta, asansör — tek ekranda.', color: 'bg-[#0A1128]' },
              { step: '04', title: 'Firmayı Seç', desc: 'Güvenle iletişime geç, taşınmanı planla.', color: 'bg-[#0A1128]' },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center px-4 mb-8 sm:mb-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white mb-4 shadow-lg ${item.color}`}>
                  {item.step}
                </div>
                <h3 className="font-black text-[#0A1128] text-base mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/teklif-al">
              <Button variant="primary" size="lg" className="font-black px-10 shadow-lg shadow-orange-900/15"
                rightIcon={<ArrowRight className="w-5 h-5" />}>
                Hemen Teklif Al — Ücretsiz
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. TEKLİF KARŞILAŞTIRMASI ÖZELLIĞI ─────────────────── */}
      <section className="bg-[#F8FAFC] py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: Editorial text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#C23E00] text-xs font-black mb-4">
                Platform Avantajı
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] leading-tight mb-4">
                "Bu teklif neden diğerinden daha pahalı?"
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed mb-6">
                Her teklifte neyin dahil olduğunu, neyin olmadığını açıkça görürsünüz.
                Sadece rakama değil, gerçek değere bakın.
              </p>

              <div className="space-y-3">
                {[
                  'Toplam fiyat + KDV durumu',
                  'Paketleme, demontaj, montaj dahil mi?',
                  'Sigorta ve mobil asansör',
                  'Teslim süresi ve ek ücret koşulları',
                  'Firma puanı ve tamamlanan iş sayısı',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-[#F95700]/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-[#F95700]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Multi-criteria comparison table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-4 text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50 border-b border-slate-200">
                <div className="p-3 col-span-1">Kapsam</div>
                {DEMO_OFFERS.map((o, i) => (
                  <div key={i} className={`p-3 text-center ${i === 0 ? 'text-[#F95700]' : ''}`}>
                    {o.firma.split(' ')[0]}
                  </div>
                ))}
              </div>

              {[
                { label: 'Fiyat', values: DEMO_OFFERS.map(o => `${o.fiyat.toLocaleString('tr-TR')} TL`), highlight: true },
                { label: 'KDV Dahil', values: DEMO_OFFERS.map(o => o.kdvDahil) },
                { label: 'Paketleme', values: DEMO_OFFERS.map(o => o.paketleme) },
                { label: 'Sigorta', values: DEMO_OFFERS.map(o => o.sigorta) },
                { label: 'Mobil Asansör', values: DEMO_OFFERS.map(o => o.asansor) },
                { label: 'Demontaj', values: DEMO_OFFERS.map(o => o.demontaj) },
                { label: 'Teslim', values: DEMO_OFFERS.map(o => o.teslimat), text: true },
              ].map((row, ri) => (
                <div key={ri} className={`grid grid-cols-4 text-sm border-b border-slate-100 last:border-0 ${ri % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                  <div className="p-3 font-bold text-slate-700 text-xs">{row.label}</div>
                  {row.values.map((v, vi) => (
                    <div key={vi} className="p-3 text-center">
                      {row.highlight ? (
                        <span className={`font-black text-sm ${vi === 0 ? 'text-[#F95700]' : 'text-slate-900'}`}>{v as string}</span>
                      ) : row.text ? (
                        <span className="text-xs font-bold text-slate-600">{v as string}</span>
                      ) : (
                        <span className={`text-base font-black ${v ? 'text-emerald-600' : 'text-red-400'}`}>
                          {v ? '✓' : '✕'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <div className="p-3 bg-amber-50 border-t border-amber-100">
                <p className="text-[11px] text-amber-700 font-bold text-center">
                  Bu tablo yalnızca gösterim amaçlı örnek veridir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. NAKLİYECİ İÇİN — Split Screen ───────────────────── */}
      <section className="bg-[#0A1128] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F95700]/20 border border-[#F95700]/30 text-[#F95700] text-xs font-black mb-5">
                NAKLİYECİ PLATFORMU
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                Sadece iş bulmak değil,<br />
                <span className="text-[#F95700]">işletmenizi büyütmek</span> için.
              </h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-6">
                Rotanıza uygun işleri bulun. Boş dönüşlerinizi doldurun. Takvimi yönetin.
                Meslektaşlarınızla Defter üzerinden bağlantı kurun.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: '🎯', title: 'Rota Eşleşmesi', desc: '%92 eşleşme skoru ile doğru işler' },
                  { icon: '📦', title: 'Boş Dönüş', desc: 'Dönüş rotanı doldur, ekstra kazan' },
                  { icon: '📅', title: 'Operasyon Takvimi', desc: 'Günlük iş planı, müsaitlik yönetimi' },
                  { icon: '📖', title: 'Nakliyeci Defteri', desc: 'Sektörle bağlantı, yük & araç' },
                ].map((item, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xl mb-1.5">{item.icon}</div>
                    <div className="font-black text-sm text-white mb-0.5">{item.title}</div>
                    <div className="text-xs text-slate-400 font-medium">{item.desc}</div>
                  </div>
                ))}
              </div>

              <Link href="/kayit?role=nakliyeci">
                <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/25"
                  rightIcon={<ArrowRight className="w-5 h-5" />}>
                  7 Gün Ücretsiz Başla
                </Button>
              </Link>
              <p className="text-xs text-slate-500 mt-2 font-medium">Kredi kartı gerektirmez · İstediğiniz an iptal</p>
            </div>

            {/* Operasyon Merkezi mockup */}
            <div className="bg-[#0F1B3D] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Operasyon Merkezi</p>
                  <p className="font-black text-white">Bugün · 28 Ağustos</p>
                </div>
                <div className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-black">● Aktif</div>
              </div>

              {[
                { label: 'Yeni Eşleşen İşler', count: '3', badge: 'YENİ', color: 'text-[#F95700]' },
                { label: 'Bekleyen Tekliflerim', count: '2', badge: 'BEKLEYEN', color: 'text-amber-400' },
                { label: 'Bugünkü Taşıma', count: '1', badge: 'BUGÜN', color: 'text-emerald-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/8 last:border-0">
                  <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-black ${item.color}`}>{item.count}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${item.color} bg-current/10`} style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}

              {/* Rota eşleşme */}
              <div className="mt-4 p-3 rounded-xl bg-[#F95700]/10 border border-[#F95700]/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black text-[#F95700]">%94 Rota Eşleşmesi</span>
                  <span className="text-[10px] text-slate-400">Ankara → İstanbul</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['Hizmet bölgenizde', 'Müsait tarihte', 'Dönüş rotanızda'].map(r => (
                    <span key={r} className="text-[10px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-medium">✓ {r}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. NAKLİYECİ DEFTERİ Feed ───────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-1">Nakliyeci Defteri</h2>
              <p className="text-slate-500 font-medium text-sm">Boş araçlar, yük ilanları, rota paylaşımları — canlı akış</p>
            </div>
            <Link href="/nakliyeci-defteri" className="text-sm font-black text-[#F95700] hover:underline flex items-center gap-1">
              Tümünü Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {defterPosts.map((post) => (
              <div key={post.id} className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-4 hover:border-[#F95700] transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {categoryLabels[post.category] || post.category}
                  </span>
                  {post.isSponsored && (
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">ÖNE ÇIKAN</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-sm font-black text-[#0A1128] mb-1">
                  <span>{post.originCity}</span>
                  <MoveRight className="w-3.5 h-3.5 text-[#F95700] shrink-0" />
                  <span>{post.destinationCity}</span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-snug line-clamp-2 mb-3">
                  {post.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{post.carrier.companyName}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. ŞEHİR REHBERİ — Compact ──────────────────────────── */}
      <section className="bg-[#F8FAFC] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#0A1128]">Popüler Şehirlerde Nakliyat</h2>
            <Link href="/nakliyat-firmalari" className="text-xs font-black text-[#F95700] hover:underline">
              Tüm İller →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POPULAR_CITIES.map(city => (
              <Link
                key={city}
                href={`/nakliyat-firmalari/${city.toLowerCase()}`}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-[#F95700] hover:text-[#F95700] transition-all text-sm font-bold text-slate-700 group"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#F95700] transition-colors shrink-0" />
                {city} Nakliyat
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
