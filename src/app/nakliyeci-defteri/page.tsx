'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Truck, 
  Package, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck,
  Sparkles,
  MapPin,
  MoveRight,
  Phone,
  MessageSquare,
  Filter,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

const CATEGORY_CHIPS = [
  { id: 'ALL', label: 'Tüm Paylaşımlar' },
  { id: 'EMPTY_VEHICLE', label: 'Boş Araç' },
  { id: 'CARGO_JOB', label: 'Yük Arıyorum' },
  { id: 'RETURN_TRIP', label: 'Boş Dönüş' },
  { id: 'PARTIAL_LOAD', label: 'Parsiyel / Parça' },
  { id: 'ELEVATOR', label: 'Mobil Asansör' }
];

export default function NakliyeciDefteriPublicPage() {
  const [category, setCategory] = useState('ALL');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDest, setFilterDest] = useState('');
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  const allPosts = db.getDefterPosts();

  const filteredPosts = allPosts.filter(post => {
    if (category !== 'ALL' && post.category !== category) return false;
    if (filterOrigin && post.originCity !== filterOrigin) return false;
    if (filterDest && post.destinationCity !== filterDest) return false;
    return true;
  });

  const popularCities = TURKEY_CITIES.filter(c => c.isPopular);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#0A1128] text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #F95700 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-5 border border-[#F95700]/30 shadow-xs">
              <BookOpen className="w-4 h-4" />
              <span>Nakliyeciler Arası Canlı İş &amp; Rota Ağı</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-5">
              Boş Araçlar, Yükler &amp;<br />
              <span className="text-[#F95700]">Dönüş Rotaları</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-medium">
              Türkiye genelinde onaylı nakliyecilerin anlık paylaştığı boş araçları bulun, dönüş güzergâhınızdaki yükleri alın veya meslektaşlarınızla iş paslaşın.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/kayit?role=nakliyeci">
                <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/30" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  İlan / Boş Araç Paylaş
                </Button>
              </Link>
              <Link href="/paketler">
                <Button variant="outline" size="lg" className="font-bold border-white/20 text-white hover:bg-white/10">
                  Abonelik Planları →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER & POSTS FEED ──────────────────────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        
        {/* Category switcher */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {CATEGORY_CHIPS.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                category === c.id
                  ? 'bg-[#0A1128] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* City Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Çıkış İli (Nereden?)</label>
              <select
                value={filterOrigin}
                onChange={e => setFilterOrigin(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50/50 focus:border-[#F95700] focus:outline-none"
              >
                <option value="">Tüm Şehirler</option>
                {popularCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Varış İli (Nereye?)</label>
              <select
                value={filterDest}
                onChange={e => setFilterDest(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50/50 focus:border-[#F95700] focus:outline-none"
              >
                <option value="">Tüm Şehirler</option>
                {popularCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {(filterOrigin || filterDest) && (
            <button
              onClick={() => { setFilterOrigin(''); setFilterDest(''); }}
              className="text-xs font-black text-red-500 hover:underline shrink-0 sm:pt-4"
            >
              Filtreleri Sıfırla
            </button>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPosts.map((post) => {
            const isPhoneRevealed = revealedPhones[post.id];
            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#F95700] transition-all p-6 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-orange-100 text-[#C23E00]">
                        {CATEGORY_CHIPS.find(c => c.id === post.category)?.label || post.category}
                      </span>
                      {post.isSponsored && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-white">
                          Öne Çıkan
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-base font-black text-[#0A1128] mb-2">
                    <span className="text-slate-900">{post.originCity}</span>
                    <MoveRight className="w-5 h-5 text-[#F95700] shrink-0" />
                    <span className="text-slate-900">{post.destinationCity}</span>
                  </div>

                  {/* Body Content */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-4">
                    {post.content}
                  </p>

                  {/* Meta Specs */}
                  {post.vehicleType && (
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold mb-4 flex-wrap">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg">🚛 {post.vehicleType}</span>
                      {post.capacityPercent && (
                        <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg">
                          %{post.capacityPercent} Boş Kapasite
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Footer: Carrier Info & Call Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#0A1128] text-white flex items-center justify-center font-black text-xs shrink-0">
                      {post.carrier.companyName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-xs text-slate-900 truncate">{post.carrier.companyName}</p>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Onaylı Nakliyeci
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPhoneRevealed ? (
                      <a href={`tel:${post.carrier.phone}`}>
                        <Button variant="navy" size="sm" className="font-bold text-xs" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                          {post.carrier.phone}
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="font-black text-xs"
                        leftIcon={<Phone className="w-3.5 h-3.5" />}
                        onClick={() => setRevealedPhones(prev => ({ ...prev, [post.id]: true }))}
                      >
                        İletişim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-black text-slate-700 text-lg mb-1">Seçilen kriterlere uygun paylaşım bulunamadı</h3>
            <p className="text-xs text-slate-400">Filtreleri sıfırlayarak tüm canlı ilanları görebilirsiniz.</p>
          </div>
        )}
      </section>
    </div>
  );
}
