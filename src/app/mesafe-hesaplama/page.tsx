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
  Info 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { TURKEY_CITIES, calculateDistance } from '@/lib/data/turkey-geo';

export default function MesafeHesaplamaPage() {
  const [originCity, setOriginCity] = useState('İstanbul');
  const [destCity, setDestCity] = useState('Ankara');

  // Internal Cost Estimation helper (Spec Item 114)
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(42);
  const [fuelConsumptionPer100Km, setFuelConsumptionPer100Km] = useState(28); // Standard truck ~28L/100km
  const [staffCount, setStaffCount] = useState(3);
  const [dailyStaffCost, setDailyStaffCost] = useState(1500);

  const distanceInfo = calculateDistance(originCity, destCity);

  // Approximate fuel cost calculation
  const totalLiters = (distanceInfo.km / 100) * fuelConsumptionPer100Km;
  const estimatedFuelCost = Math.round(totalLiters * fuelPricePerLiter);
  const estimatedStaffCost = staffCount * dailyStaffCost;
  const estimatedHighwayTolls = distanceInfo.km > 300 ? 1200 : 400;
  const totalOperatingCost = estimatedFuelCost + estimatedStaffCost + estimatedHighwayTolls;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B3B8F] text-xs font-bold mb-3">
          <Calculator className="w-3.5 h-3.5 text-[#146EF5]" />
          <span>Şehirler Arası Nakliye Hesaplayıcı</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          Mesafe, Süre ve Maliyet Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          İki şehir arasındaki karayolu mesafesini ve nakliyeciler için tahmini operasyon maliyetlerini hesaplayın.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Calculator & Route Picker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Güzergâh Seçin
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Çıkış Şehri (Nereden?)</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {TURKEY_CITIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Varış Şehri (Nereye?)</label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold bg-white"
                >
                  {TURKEY_CITIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-xs text-slate-500 font-medium block mb-1">Karayolu Mesafesi</span>
                <span className="text-2xl sm:text-3xl font-black text-[#0B3B8F]">{distanceInfo.km} KM</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-xs text-slate-500 font-medium block mb-1">Tahmini Sürüş Süresi</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-800">~{distanceInfo.durationHours} Saat</span>
              </div>
            </div>
          </div>

          {/* Nakliye Maliyet Yardımcısı (Internal Tool - Spec Item 114) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#146EF5]" /> Nakliyeci Operasyonel Maliyet Yardımcısı
            </h2>
            <p className="text-xs text-slate-500">
              Kamyon yakıt tüketimi, otoyol geçişleri ve personel yevmiyelerine göre tahmini maliyet tablosu.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Tahmini Yakıt</span>
                <span className="font-bold text-slate-800">{estimatedFuelCost.toLocaleString('tr-TR')} TL</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Köprü & Otoyol</span>
                <span className="font-bold text-slate-800">{estimatedHighwayTolls.toLocaleString('tr-TR')} TL</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block mb-1">Personel ({staffCount} kişi)</span>
                <span className="font-bold text-slate-800">{estimatedStaffCost.toLocaleString('tr-TR')} TL</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between mt-4">
              <span className="text-xs font-semibold">Tahmini Taban Maliyet:</span>
              <span className="text-xl font-black text-amber-400">{totalOperatingCost.toLocaleString('tr-TR')} TL</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Direct Move CTA */}
        <div>
          <div className="bg-gradient-to-br from-[#0D1B2A] to-[#0B3B8F] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
            <h3 className="text-xl font-black">
              Bu Rotada Ev Taşımayı mı Planlıyorsunuz?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>{originCity} → {destCity}</strong> güzergâhında çalışan onaylı nakliyat firmalarından dakikalar içinde ücretsiz teklif alın.
            </p>

            <Link href={`/teklif-al?originCity=${encodeURIComponent(originCity)}&destCity=${encodeURIComponent(destCity)}`}>
              <Button variant="gold" size="lg" className="w-full font-bold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Ücretsiz Teklif Al
              </Button>
            </Link>

            <div className="text-[11px] text-slate-400 space-y-1 pt-4 border-t border-white/10">
              <p>✓ Ödeme doğrudan nakliyeciye yapılır.</p>
              <p>✓ Sözleşmeli ve sigortalı taşıma.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
