'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Filter, Search, MapPin, Calendar, ArrowRight, SlidersHorizontal, X,
  Check, Camera, Building2, Package, Truck, ChevronRight, MoveRight,
  Star, ShieldCheck, Phone, MessageSquare, AlertCircle, Info,
  ChevronDown, ChevronUp, Calculator, Clock, Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { Modal } from '@/components/ui/Modal';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { MovingRequest } from '@/types';

// Rule-based match score
function matchScore(req: MovingRequest, carrier: { city: string; serviceAreas: string[]; services: string[] }) {
  let score = 0;
  const reasons: string[] = [];
  if (carrier.serviceAreas.includes(req.originCity) || carrier.serviceAreas.includes('TÜM_TÜRKİYE')) { score += 35; reasons.push('Hizmet bölgenizde'); }
  if (carrier.serviceAreas.includes(req.destinationCity) || carrier.serviceAreas.includes('TÜM_TÜRKİYE')) { score += 25; reasons.push('Varış şehrinizde aktifsiniz'); }
  if (carrier.city === req.originCity) { score += 15; reasons.push('Çıkış şehrinizdesiniz'); }
  score += 15; reasons.push('Talep tarihinde müsaitsiniz');
  const svcMap: Record<string, string> = { EVDEN_EVE: 'evden-eve', OFIS_TASIMA: 'ofis-tasima', PARCA_ESYA: 'parca-esya', ESYA_DEPOLAMA: 'depolama' };
  if (carrier.services.includes(svcMap[req.serviceCategory])) { score += 10; reasons.push('Bu hizmeti veriyorsunuz'); }
  return { score: Math.min(score, 100), reasons };
}

const HOME_SIZES = ['Studio', '1+1', '2+1', '3+1', '4+1', '5+1+'];

export default function CarrierJobsPage() {
  const carrier = db.getCarriers()[0];
  const requests = db.getRequests();
  const [filterCity, setFilterCity] = useState('');
  const [filterDestCity, setFilterDestCity] = useState('');
  const [filterHomeSize, setFilterHomeSize] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [offerModalReq, setOfferModalReq] = useState<MovingRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Offer form state
  const [offerPrice, setOfferPrice] = useState('');
  const [vatIncluded, setVatIncluded] = useState(true);
  const [packIncluded, setPackIncluded] = useState(false);
  const [assemblyIncluded, setAssemblyIncluded] = useState(false);
  const [elevatorIncluded, setElevatorIncluded] = useState(false);
  const [insuranceIncluded, setInsuranceIncluded] = useState(false);
  const [deliveryDuration, setDeliveryDuration] = useState('Aynı Gün');
  const [offerNotes, setOfferNotes] = useState('');
  const [showCostCalc, setShowCostCalc] = useState(false);
  const [costKm, setCostKm] = useState('');
  const [costFuel, setCostFuel] = useState('');
  const [costStaff, setCostStaff] = useState('');
  const [costPack, setCostPack] = useState('');
  const [costToll, setCostToll] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  const estimatedCost = [costKm, costFuel, costStaff, costPack, costToll]
    .map(v => parseFloat(v) || 0)
    .reduce((a, b) => a + b, 0);
  const grossProfit = (parseFloat(offerPrice) || 0) - estimatedCost;

  const filteredJobs = requests.filter(req => {
    if (req.status !== 'ACTIVE') return false;
    if (filterCity && req.originCity !== filterCity) return false;
    if (filterDestCity && req.destinationCity !== filterDestCity) return false;
    if (filterHomeSize && req.homeSize !== filterHomeSize) return false;
    return true;
  });

  const jobsWithScores = filteredJobs.map(req => ({
    ...req,
    ...matchScore(req, carrier),
  })).sort((a, b) => b.score - a.score);

  const activeFilters = [filterCity, filterDestCity, filterHomeSize].filter(Boolean).length;

  const handleSubmitOffer = () => {
    if (!offerModalReq) return;
    db.addOffer({
      id: `offer_new_${Date.now()}`,
      requestId: offerModalReq.id,
      carrierId: carrier.id,
      carrier,
      price: parseFloat(offerPrice) || 0,
      isVatIncluded: vatIncluded,
      isPackagingIncluded: packIncluded,
      isMobileElevatorIncluded: elevatorIncluded,
      isAssemblyIncluded: assemblyIncluded,
      isInsuranceIncluded: insuranceIncluded,
      estimatedDeliveryDuration: deliveryDuration,
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
      notes: offerNotes,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOfferSubmitted(true);
  };

  const resetOfferForm = () => {
    setOfferPrice(''); setVatIncluded(true); setPackIncluded(false);
    setAssemblyIncluded(false); setElevatorIncluded(false); setInsuranceIncluded(false);
    setDeliveryDuration('Aynı Gün'); setOfferNotes(''); setShowCostCalc(false);
    setCostKm(''); setCostFuel(''); setCostStaff(''); setCostPack(''); setCostToll('');
    setOfferSubmitted(false);
    setOfferModalReq(null);
  };

  const popularCities = TURKEY_CITIES.filter(c => c.isPopular).slice(0, 10);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Açık Taşıma İşleri</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              <strong className="text-[#F95700]">{jobsWithScores.length}</strong> aktif talep — rota eşleşmesine göre sıralı
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-black transition-all cursor-pointer ${showFilters || activeFilters > 0 ? 'border-[#F95700] bg-orange-50 text-[#F95700]' : 'border-slate-200 bg-white text-slate-700'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtrele {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Çıkış Şehri</label>
                <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white">
                  <option value="">Tüm Şehirler</option>
                  {popularCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Varış Şehri</label>
                <select value={filterDestCity} onChange={e => setFilterDestCity(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white">
                  <option value="">Tüm Şehirler</option>
                  {popularCities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Ev Büyüklüğü</label>
                <select value={filterHomeSize} onChange={e => setFilterHomeSize(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white">
                  <option value="">Tüm Büyüklükler</option>
                  {HOME_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {activeFilters > 0 && (
              <button onClick={() => { setFilterCity(''); setFilterDestCity(''); setFilterHomeSize(''); }}
                className="mt-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer">
                <X className="w-3.5 h-3.5" /> Filtreleri Temizle
              </button>
            )}
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-3">
          {jobsWithScores.map((job) => {
            const isExpanded = expandedId === job.id;
            const myOfferForThis = db.getOffersForCarrier(carrier.id).find(o => o.requestId === job.id);
            return (
              <div key={job.id} className={`bg-white rounded-2xl border-2 transition-all shadow-xs ${job.score >= 80 ? 'border-emerald-200 hover:border-emerald-300' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Match Score */}
                    <div className="shrink-0 text-center w-14">
                      <div className={`text-xl font-black ${job.score >= 80 ? 'text-emerald-600' : job.score >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>
                        %{job.score}
                      </div>
                      <div className="text-[9px] font-black text-slate-400 uppercase leading-tight">eşleşme</div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{job.requestCode}</span>
                          <span className="text-xs font-bold text-slate-600">{job.homeSize} Ev</span>
                          {job.photos.length > 0 && (
                            <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Camera className="w-3 h-3" />{job.photos.length} Foto
                            </span>
                          )}
                        </div>
                        {myOfferForThis && (
                          <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shrink-0">
                            Teklif Verildi
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-black text-[#0A1128] text-base mb-2">
                        <span>{job.originCity}</span>
                        <span className="text-xs text-slate-400 font-medium">{job.originDistrict}</span>
                        <MoveRight className="w-5 h-5 text-[#F95700] shrink-0" />
                        <span>{job.destinationCity}</span>
                        <span className="text-xs text-slate-400 font-medium">{job.destinationDistrict}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mb-2">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{job.movingDate}</span>
                        {job.packagingPreference === 'CARRIER_PACKS' && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">Paketleme İstiyor</span>}
                        {job.originRequiresMobileElevator && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-bold">Asansör İstiyor</span>}
                        {job.extraServices.includes('insured') && <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">Sigortalı</span>}
                      </div>

                      {/* Match reasons */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.reasons.map((r, i) => (
                          <span key={i} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">✓ {r}</span>
                        ))}
                      </div>

                      {/* Expand: Bina bilgileri */}
                      {isExpanded && (
                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 mb-3 text-xs font-medium text-slate-600 grid grid-cols-2 gap-2">
                          <div><span className="font-black text-slate-500">Çıkış Kat:</span> {job.originFloor}. kat</div>
                          <div><span className="font-black text-slate-500">Asansör:</span> {job.originHasElevator ? 'Var' : 'Yok'}</div>
                          <div><span className="font-black text-slate-500">Varış Kat:</span> {job.destinationFloor}. kat</div>
                          <div><span className="font-black text-slate-500">Varış Asansör:</span> {job.destinationHasElevator ? 'Var' : 'Yok'}</div>
                          {job.notes && <div className="col-span-2"><span className="font-black text-slate-500">Not:</span> {job.notes}</div>}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {!myOfferForThis ? (
                          <Button variant="primary" size="sm" className="font-black"
                            onClick={() => { setOfferModalReq(job); setOfferSubmitted(false); }}>
                            Teklif Ver
                          </Button>
                        ) : (
                          <span className="text-xs font-black text-amber-700 flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            Teklifiniz: {myOfferForThis.price.toLocaleString('tr-TR')} TL
                          </span>
                        )}
                        <button onClick={() => setExpandedId(isExpanded ? null : job.id)}
                          className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-0.5 cursor-pointer transition-colors">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          {isExpanded ? 'Gizle' : 'Detay'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {jobsWithScores.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
              <Truck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h2 className="font-black text-slate-700 text-xl mb-2">Filtreye uygun iş bulunamadı</h2>
              <button onClick={() => { setFilterCity(''); setFilterDestCity(''); setFilterHomeSize(''); }}
                className="text-sm font-bold text-[#F95700] hover:underline">
                Filtreleri temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── TEKLİF VER MODAL ──────────────────────────────────── */}
      <Modal
        isOpen={!!offerModalReq}
        onClose={resetOfferForm}
        title={offerSubmitted ? 'Teklifiniz Gönderildi!' : `Teklif Ver — ${offerModalReq?.requestCode}`}
      >
        {offerModalReq && !offerSubmitted && (
          <div className="space-y-5">
            {/* Talep özeti */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center gap-2 text-sm font-black text-[#0A1128]">
                <span>{offerModalReq.originCity}</span>
                <MoveRight className="w-4 h-4 text-[#F95700] shrink-0" />
                <span>{offerModalReq.destinationCity}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{offerModalReq.homeSize} Ev · {offerModalReq.movingDate}</p>
            </div>

            {/* Fiyat */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Teklif Fiyatı (TL) *</label>
              <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="24500"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-lg font-black text-[#F95700] focus:border-[#F95700] focus:outline-none" />
            </div>

            {/* Kapsam */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Teklif Kapsamı</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { val: vatIncluded, set: setVatIncluded, label: 'KDV Dahil' },
                  { val: packIncluded, set: setPackIncluded, label: 'Paketleme Dahil' },
                  { val: assemblyIncluded, set: setAssemblyIncluded, label: 'Demontaj & Montaj' },
                  { val: elevatorIncluded, set: setElevatorIncluded, label: 'Mobil Asansör' },
                  { val: insuranceIncluded, set: setInsuranceIncluded, label: 'Sigorta Dahil' },
                ].map(item => (
                  <label key={item.label} className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${item.val ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 ${item.val ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'}`}
                      onClick={() => item.set(!item.val)}>
                      {item.val && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs font-bold text-slate-700" onClick={() => item.set(!item.val)}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Teslim süresi */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Teslim Süresi</label>
              <div className="flex gap-2">
                {['Aynı Gün', '24 Saat', '2 Gün', '3+ Gün'].map(d => (
                  <button key={d} onClick={() => setDeliveryDuration(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${deliveryDuration === d ? 'border-[#F95700] bg-orange-50 text-[#F95700]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Not */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Teklif Notu (Opsiyonel)</label>
              <textarea value={offerNotes} onChange={e => setOfferNotes(e.target.value)} rows={3}
                placeholder="Ek bilgiler, koşullar, özel teklifler..."
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none resize-none" />
            </div>

            {/* Maliyetimi Hesapla */}
            <div>
              <button onClick={() => setShowCostCalc(!showCostCalc)}
                className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-[#F95700] transition-colors cursor-pointer">
                <Calculator className="w-4 h-4" />
                {showCostCalc ? 'Maliyet Hesabını Gizle' : 'Maliyetimi Hesapla (Opsiyonel)'}
                {showCostCalc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCostCalc && (
                <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-[11px] text-slate-500 font-medium mb-3">Bu bilgiler yalnızca size gösterilir, müşteri görmez.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: costKm, set: setCostKm, label: 'Yakıt (TL)' },
                      { val: costFuel, set: setCostFuel, label: 'KM Maliyeti (TL)' },
                      { val: costStaff, set: setCostStaff, label: 'Personel (TL)' },
                      { val: costPack, set: setCostPack, label: 'Paketleme (TL)' },
                      { val: costToll, set: setCostToll, label: 'Otoyol/Köprü (TL)' },
                    ].map(item => (
                      <div key={item.label}>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-1">{item.label}</label>
                        <input type="number" value={item.val} onChange={e => item.set(e.target.value)} placeholder="0"
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white" />
                      </div>
                    ))}
                  </div>
                  {estimatedCost > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Tahmini Maliyet:</span>
                      <span className="font-black text-slate-900">{estimatedCost.toLocaleString('tr-TR')} TL</span>
                    </div>
                  )}
                  {estimatedCost > 0 && parseFloat(offerPrice) > 0 && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-slate-600">Tahmini Kâr:</span>
                      <span className={`font-black text-sm ${grossProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {grossProfit >= 0 ? '+' : ''}{grossProfit.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1 font-bold" onClick={resetOfferForm}>İptal</Button>
              <Button variant="primary" size="md" className="flex-1 font-black"
                disabled={!offerPrice || parseFloat(offerPrice) <= 0}
                onClick={handleSubmitOffer}>
                Teklifi Gönder
              </Button>
            </div>
          </div>
        )}

        {offerSubmitted && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-black text-[#0A1128] text-lg mb-2">Teklifiniz Gönderildi!</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">
              Müşteri teklifinizi inceleyecek ve en kısa sürede yanıtlayacak.
            </p>
            <Button variant="primary" size="md" className="font-black w-full" onClick={resetOfferForm}>
              Tamam
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
