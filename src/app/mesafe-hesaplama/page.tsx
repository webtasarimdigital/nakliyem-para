'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  MapPin, 
  Clock, 
  Fuel, 
  Truck, 
  ArrowRight, 
  Sparkles,
  Info,
  MoveRight,
  ShieldCheck,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TURKEY_CITIES, calculateDistance } from '@/lib/data/turkey-geo';

// Approximate price multiplier per km based on home size
const HOME_SIZE_RATES: Record<string, { baseMin: number; baseMax: number; perKm: number; label: string }> = {
  '1+1': { baseMin: 8000, baseMax: 12000, perKm: 22, label: '1+1 Daire (Orta Boy Kapalı Kasa)' },
  '2+1': { baseMin: 12000, baseMax: 18000, perKm: 32, label: '2+1 Daire (Standart Kamyon)' },
  '3+1': { baseMin: 16000, baseMax: 24000, perKm: 42, label: '3+1 Daire (Büyük Boy Kamyon)' },
  '4+1+': { baseMin: 22000, baseMax: 32000, perKm: 55, label: '4+1+ / Villa (Ekstra Geniş Araç)' }
};

export default function MesafeHesaplamaPage() {
  const [originCity, setOriginCity] = useState('İstanbul');
  const [destCity, setDestCity] = useState('Ankara');
  const [homeSize, setHomeSize] = useState('2+1');
  const [showCarrierCostMode, setShowCarrierCostMode] = useState(false);

  // Carrier operating costs state
  const [fuelPrice, setFuelPrice] = useState(44);
  const [fuelConsumption, setFuelConsumption] = useState(28); // L/100km
  const [staffCount, setStaffCount] = useState(3);
  const [staffDailyRate, setStaffDailyRate] = useState(1500);

  const distanceInfo = calculateDistance(originCity, destCity);
  const sizeConfig = HOME_SIZE_RATES[homeSize] || HOME_SIZE_RATES['2+1'];

  // Customer estimated price range
  const kmAddition = distanceInfo.km * sizeConfig.perKm;
  const estimatedMinPrice = Math.round((sizeConfig.baseMin + kmAddition) / 500) * 500;
  const estimatedMaxPrice = Math.round((sizeConfig.baseMax + kmAddition * 1.25) / 500) * 500;

  // Carrier operational cost
  const totalFuelLiters = (distanceInfo.km / 100) * fuelConsumption;
  const totalFuelCost = Math.round(totalFuelLiters * fuelPrice);
  const totalStaffCost = staffCount * staffDailyRate;
  const totalHighwayTolls = distanceInfo.km > 300 ? 1400 : 450;
  const totalDirectCost = totalFuelCost + totalStaffCost + totalHighwayTolls;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-[#0A1128] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-5 border border-[#F95700]/30 shadow-xs">
            <Calculator className="w-4 h-4" />
            <span>Şehirlerarası Nakliyat Mesafe &amp; Fiyat Hesaplayıcı</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            Mesafe, Süre ve Ortalama Taşıma Fiyatını Hesaplayın
          </h1>
          <p className="text-slate-300 font-medium text-sm sm:text-base max-w-2xl mx-auto">
            Türkiye&apos;nin 81 ili arasında karayolu mesafesini ve güncel piyasa ortalama evden eve nakliyat fiyat aralığını saniyeler içinde öğrenin.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 -mt-16">
          
          {/* LEFT: Inputs & Results (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Route & Size Picker Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
              <h2 className="text-lg font-black text-[#0A1128] pb-3 border-b border-slate-100">
                1. Rota ve Ev Büyüklüğü
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Çıkış Şehri (Nereden?)</label>
                  <select
                    value={originCity}
                    onChange={e => setOriginCity(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Varış Şehri (Nereye?)</label>
                  <select
                    value={destCity}
                    onChange={e => setDestCity(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Ev / Eşya Hacmi</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(HOME_SIZE_RATES).map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setHomeSize(size)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                        homeSize === size
                          ? 'border-[#F95700] bg-orange-50/70 text-[#C23E00] shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Distance & Duration KPI Card */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Karayolu Mesafesi</span>
                <span className="text-3xl font-black text-[#0A1128]">{distanceInfo.km} KM</span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs text-center">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Tahmini Sürüş Süresi</span>
                <span className="text-3xl font-black text-emerald-600">~{distanceInfo.durationHours} Saat</span>
              </div>
            </div>

            {/* Optional Carrier Cost Breakdown Toggle */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm text-[#0A1128]">Nakliyeci Operasyonel Maliyet Simülasyonu</h3>
                  <p className="text-xs text-slate-500 font-medium">Yakıt, personel yevmiyesi ve otoyol/köprü giderleri</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCarrierCostMode(!showCarrierCostMode)}
                  className="text-xs font-black text-[#F95700] hover:underline"
                >
                  {showCarrierCostMode ? 'Gizle ▲' : 'Göster ▼'}
                </button>
              </div>

              {showCarrierCostMode && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs animate-fade-in">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Tahmini Yakıt ({Math.round(totalFuelLiters)} Litre Motorin):</span>
                    <span className="font-black text-slate-900">{totalFuelCost.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Personel &amp; Yükleme/İndirme (3 Kişi):</span>
                    <span className="font-black text-slate-900">{totalStaffCost.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Otoyol &amp; Köprü Geçiş Tahmini:</span>
                    <span className="font-black text-slate-900">{totalHighwayTolls.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-slate-800 text-sm">Toplam Direkt Sefer Maliyeti:</span>
                    <span className="font-black text-[#F95700] text-base">{totalDirectCost.toLocaleString('tr-TR')} TL</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Price Range & Quote Box (5/12) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Price Estimation Card */}
            <div className="bg-gradient-to-br from-[#0A1128] via-[#132247] to-[#0A1128] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div>
                <span className="text-xs font-black text-[#F95700] uppercase tracking-wider block mb-1">
                  Piyasa Ortalama Fiyatı
                </span>
                <h3 className="text-xl font-black text-white">
                  {originCity} → {destCity}
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  {sizeConfig.label}
                </p>
              </div>

              {/* Price Band */}
              <div className="p-5 rounded-2xl bg-white/10 border border-white/15 text-center">
                <span className="text-xs text-slate-300 font-medium block mb-1">Tahmini Fiyat Aralığı</span>
                <div className="text-2xl sm:text-3xl font-black text-[#F95700] tracking-tight">
                  {estimatedMinPrice.toLocaleString('tr-TR')} - {estimatedMaxPrice.toLocaleString('tr-TR')} TL
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  * Kat durumu, asansör ve ambalaj kapsamına göre değişebilir.
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>Ambalajlama &amp; marangozluk montajı dahil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>Emtia nakliyat sigortası dahil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>Müşteriye %100 ücretsiz teklif toplama</span>
                </div>
              </div>

              <Link href={`/teklif-al?originCity=${encodeURIComponent(originCity)}&destCity=${encodeURIComponent(destCity)}&size=${encodeURIComponent(homeSize)}`}>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-black text-base py-4 shadow-xl shadow-orange-900/40"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Bu Rota İçin Ücretsiz Teklif Al 🚀
                </Button>
              </Link>
            </div>

            {/* Info notice */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 text-xs text-slate-600 font-medium leading-relaxed shadow-xs flex items-start gap-3">
              <Info className="w-5 h-5 text-[#F95700] shrink-0 mt-0.5" />
              <p>
                Hesaplanan fiyatlar Türkiye genelindeki onaylı firmaların son 6 aydaki ortalama tekliflerine dayanmaktadır. Kesin ve garantili fiyat almak için 2 dakikada ücretsiz talep açabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
