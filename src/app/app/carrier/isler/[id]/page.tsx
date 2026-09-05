'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Package, 
  Camera, 
  Phone, 
  MessageSquare, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Truck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { Modal } from '@/components/ui/Modal';
import { calculateDistance } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { Offer } from '@/types';

export default function CarrierJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const req = db.getRequestById(resolvedParams.id) || db.getRequests()[0];
  const carrier = db.getCarriers()[0]; // Demo logged in carrier (Boğaziçi)

  // Distance estimate
  const distanceInfo = calculateDistance(req.originCity, req.destinationCity);

  // Quote Form State (Spec Item 61)
  const [price, setPrice] = useState('24500');
  const [isVatIncluded, setIsVatIncluded] = useState(true);
  const [isPackagingIncluded, setIsPackagingIncluded] = useState(true);
  const [isMobileElevatorIncluded, setIsMobileElevatorIncluded] = useState(true);
  const [isAssemblyIncluded, setIsAssemblyIncluded] = useState(true);
  const [isInsuranceIncluded, setIsInsuranceIncluded] = useState(true);
  const [deliveryDuration, setDeliveryDuration] = useState('24 Saat');
  const [notes, setNotes] = useState('Fiyatımıza çıkış için araç üstü asansör, A\'dan Z\'ye ambalajlama ve sigorta dahildir.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOffer: Offer = {
        id: `off_${Date.now()}`,
        requestId: req.id,
        carrierId: carrier.id,
        carrier,
        price: Number(price) || 20000,
        isVatIncluded,
        isPackagingIncluded,
        isMobileElevatorIncluded,
        isAssemblyIncluded,
        isInsuranceIncluded,
        estimatedDeliveryDuration: deliveryDuration,
        validUntil: '2026-09-15',
        notes,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.addOffer(newOffer);
      setIsSubmitting(false);
      setSuccessModalOpen(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/app/carrier/isler"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128]"
        >
          <ArrowLeft className="w-4 h-4" /> Açık İşlere Dön
        </Link>
        <span className="text-xs text-slate-400">Talep Kodu: {req.requestCode}</span>
      </div>

      {/* Main Grid: Details on Left, Offer Sticky Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Complete Job Specs (Spec Item 60) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Yeni Taşıma İşi
              </span>
              <span className="text-xs text-slate-400">15 dk önce yayınlandı</span>
            </div>

            <div className="py-2">
              <RouteDisplay
                originCity={req.originCity}
                originDistrict={req.originDistrict}
                destinationCity={req.destinationCity}
                destinationDistrict={req.destinationDistrict}
                size="lg"
                distanceKm={distanceInfo.km}
              />
            </div>
          </div>

          {/* Job Specifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3">
              İş Detayları & Özellikler
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Eşya Tipi</span>
                <span className="font-bold text-slate-800">{req.homeSize} Ev</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Taşıma Tarihi</span>
                <span className="font-bold text-slate-800">{req.movingDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Tarih Esnekliği</span>
                <span className="font-bold text-slate-800">{req.isDateFlexible ? `±${req.flexibleDays} Gün` : 'Net'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Mesafe / Süre</span>
                <span className="font-bold text-slate-800">~{distanceInfo.km} km ({distanceInfo.durationHours} sa)</span>
              </div>
            </div>

            {/* Building conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="font-bold text-[#0A1128] block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#146EF5]" /> Çıkış Binası
                </span>
                <p className="text-slate-700 font-medium">{req.originFloor}. Kat</p>
                <p className="text-slate-500">Bina İçi Asansör: {req.originHasElevator ? 'Var' : 'Yok (Merdiven)'}</p>
                <p className="text-slate-500">Mobil Asansör İhtiyacı: {req.originRequiresMobileElevator ? 'Evet (Gereklidir)' : 'Hayır'}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="font-bold text-[#0A1128] block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Varış Binası
                </span>
                <p className="text-slate-700 font-medium">{req.destinationFloor}. Kat</p>
                <p className="text-slate-500">Bina İçi Asansör: {req.destinationHasElevator ? 'Var' : 'Yok'}</p>
                <p className="text-slate-500">Mobil Asansör İhtiyacı: {req.destinationRequiresMobileElevator ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>

            {/* Notes */}
            {req.notes && (
              <div>
                <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Müşteri Notu</h3>
                <p className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                  {req.notes}
                </p>
              </div>
            )}

            {/* Customer Phone Access Card (Spec Item 71) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1128] block">Müşteri İletişim Numarası</span>
                  <span className="text-[11px] text-slate-500">Müşteri telefonla aranmaya izin verdi.</span>
                </div>
              </div>

              {revealedPhone ? (
                <a href={`tel:${req.customerPhone}`} className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  {req.customerPhone}
                </a>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => setRevealedPhone(true)}>
                  Telefonu Gör
                </Button>
              )}
            </div>

            {/* Photos */}
            {req.photos.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Eşya Fotoğrafları ({req.photos.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {req.photos.map((url, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={url} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Quotation Form Drawer (Spec Item 61) */}
        <div>
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg shadow-blue-900/5 sticky top-24 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#146EF5]" /> Teklif Ver
              </h3>
              <span className="text-xs text-slate-400">30 saniyede hazırla</span>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Toplam Fiyat (TL)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Örn: 24500"
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-black text-lg text-[#0A1128] focus:ring-2 focus:ring-[#146EF5]"
                  />
                  <span className="absolute right-3.5 top-3.5 font-bold text-slate-400">TL</span>
                </div>
              </div>

              {/* VAT toggle */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-700">KDV Dahil mi?</span>
                <input
                  type="checkbox"
                  checked={isVatIncluded}
                  onChange={(e) => setIsVatIncluded(e.target.checked)}
                  className="w-4 h-4 text-[#146EF5]"
                />
              </div>

              {/* Checklist included services */}
              <div className="space-y-2 pt-1 font-medium text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPackagingIncluded}
                    onChange={(e) => setIsPackagingIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span>A&apos;dan Z&apos;ye Ambalajlama Dahil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMobileElevatorIncluded}
                    onChange={(e) => setIsMobileElevatorIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span>Mobil Asansör Hizmeti Dahil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAssemblyIncluded}
                    onChange={(e) => setIsAssemblyIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span>Mobilya Söküm & Montajı Dahil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInsuranceIncluded}
                    onChange={(e) => setIsInsuranceIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span>Emtia Nakliyat Sigortası Dahil</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tahmini Teslim Süresi</label>
                <select
                  value={deliveryDuration}
                  onChange={(e) => setDeliveryDuration(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                >
                  <option value="Aynı Gün">Aynı Gün</option>
                  <option value="24 Saat">24 Saat</option>
                  <option value="2 Gün">2 Gün</option>
                  <option value="3-4 Gün">3-4 Gün</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Müşteriye Notunuz</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md"
                isLoading={isSubmitting}
              >
                Teklifi Müşteriye Gönder
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Offer Success Modal (Spec Item 62) */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Teklifiniz Müşteriye Ulaştı! 🎉"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-[#0A1128] block">{Number(price).toLocaleString('tr-TR')} TL</span>
            <span className="text-xs text-slate-500">
              {isPackagingIncluded ? 'Paketleme Dahil' : 'Paketlemesiz'} • {deliveryDuration}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Müşteri teklifinizi inceledikten sonra platform üzerinden sizinle mesajlaşabilir veya işi doğrudan size verebilir.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button variant="primary" size="md" onClick={() => router.push('/app/carrier/tekliflerim')} className="w-full">
              Tekliflerimi Gör
            </Button>
            <Button variant="outline" size="md" onClick={() => router.push('/app/carrier/isler')} className="w-full">
              Benzer İşleri Gör
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
