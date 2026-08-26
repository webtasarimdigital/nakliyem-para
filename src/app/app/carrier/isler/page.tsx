'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Filter, 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  SlidersHorizontal, 
  X, 
  Check, 
  Camera, 
  Building2, 
  Package, 
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';

export default function CarrierJobsPage() {
  const requests = db.getRequests();

  // Filters State
  const [filterCity, setFilterCity] = useState('');
  const [filterDestCity, setFilterDestCity] = useState('');
  const [filterHomeSize, setFilterHomeSize] = useState('');
  const [filterElevatorOnly, setFilterElevatorOnly] = useState(false);
  const [filterPhotoOnly, setFilterPhotoOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredJobs = requests.filter(req => {
    if (req.status !== 'ACTIVE') return false;
    if (filterCity && req.originCity !== filterCity) return false;
    if (filterDestCity && req.destinationCity !== filterDestCity) return false;
    if (filterHomeSize && req.homeSize !== filterHomeSize) return false;
    if (filterElevatorOnly && !req.originHasElevator && !req.originRequiresMobileElevator) return false;
    if (filterPhotoOnly && req.photos.length === 0) return false;
    return true;
  });

  const resetFilters = () => {
    setFilterCity('');
    setFilterDestCity('');
    setFilterHomeSize('');
    setFilterElevatorOnly(false);
    setFilterPhotoOnly(false);
  };

  const activeFilterCount = (filterCity ? 1 : 0) + (filterDestCity ? 1 : 0) + (filterHomeSize ? 1 : 0) + (filterElevatorOnly ? 1 : 0) + (filterPhotoOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Açık Taşıma İşleri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bölgenizde müşteri tarafından açılmış aktif taşıma talepleri.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="w-full"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filtrele ({activeFilterCount})
          </Button>
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar on Left, Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar (Spec Item 58) */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit sticky top-24 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#146EF5]" /> Filtreler
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Çıkış İli */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Çıkış İli (Nereden?)</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#146EF5]"
            >
              <option value="">Tüm Şehirler</option>
              {TURKEY_CITIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Varış İli */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Varış İli (Nereye?)</label>
            <select
              value={filterDestCity}
              onChange={(e) => setFilterDestCity(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#146EF5]"
            >
              <option value="">Tüm Şehirler</option>
              {TURKEY_CITIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Ev Büyüklüğü */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Eşya / Ev Büyüklüğü</label>
            <select
              value={filterHomeSize}
              onChange={(e) => setFilterHomeSize(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-[#146EF5]"
            >
              <option value="">Tüm Boyutlar</option>
              <option value="1+1">1+1</option>
              <option value="2+1">2+1</option>
              <option value="3+1">3+1</option>
              <option value="4+1">4+1</option>
              <option value="studio">Stüdyo / Parça</option>
            </select>
          </div>

          {/* Checkbox Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterElevatorOnly}
                onChange={(e) => setFilterElevatorOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#146EF5]"
              />
              <span>Asansörlü İşler</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterPhotoOnly}
                onChange={(e) => setFilterPhotoOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#146EF5]"
              />
              <span>Sadece Fotoğraflı Talepler</span>
            </label>
          </div>
        </div>

        {/* Right 3 Cols: Job Cards List (Spec Item 59) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs text-slate-500 font-semibold mb-2">
            Toplam {filteredJobs.length} aktif iş listeleniyor
          </div>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-5 sm:p-6 transition-all shadow-xs flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {job.requestCode}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Yeni
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">12 dk önce</span>
                  </div>

                  <div>
                    <RouteDisplay
                      originCity={job.originCity}
                      originDistrict={job.originDistrict}
                      destinationCity={job.destinationCity}
                      destinationDistrict={job.destinationDistrict}
                      size="md"
                    />
                  </div>

                  {/* Chips row */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-700">
                      {job.homeSize} Ev
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {job.movingDate} {job.isDateFlexible && `(±${job.flexibleDays} gün)`}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                      {job.packagingPreference === 'CARRIER_PACKS' ? 'Paketlemeli' : 'Teklif İstiyor'}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                      {job.originHasElevator ? 'Asansör Var' : `${job.originFloor}. Kat Merdiven`}
                    </span>
                    {job.photos.length > 0 && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5" /> {job.photos.length} Fotoğraf
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {job.offersCount} firma teklif verdi
                  </span>

                  <Link href={`/app/carrier/isler/${job.id}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      İşi İncele & Teklif Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Şu an filtrenize uygun iş bulunamadı</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Yeni bir talep açıldığında anında bildirim almak için alarm kurabilirsiniz.</p>
              <Link href="/app/carrier/alarmlar">
                <Button variant="primary" size="sm">İş Alarmı Kur</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <BottomSheet
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="İşleri Filtrele"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Çıkış İli</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            >
              <option value="">Tüm Şehirler</option>
              {TURKEY_CITIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Varış İli</label>
            <select
              value={filterDestCity}
              onChange={(e) => setFilterDestCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            >
              <option value="">Tüm Şehirler</option>
              {TURKEY_CITIES.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setMobileFilterOpen(false)}
            >
              Sonuçları Gör ({filteredJobs.length})
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
