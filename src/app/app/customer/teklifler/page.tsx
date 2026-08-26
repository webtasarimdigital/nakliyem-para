'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  Check, 
  X, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  ArrowRight, 
  SlidersHorizontal,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';
import { Offer } from '@/types';

export default function CustomerOffersPage() {
  const requests = db.getRequests();
  const activeReq = requests.find(r => r.status === 'ACTIVE') || requests[0];
  const offers = activeReq ? db.getOffersForRequest(activeReq.id) : [];

  const [selectedOfferForAccept, setSelectedOfferForAccept] = useState<Offer | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [phoneRevealId, setPhoneRevealId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'CARDS' | 'COMPARE'>('CARDS');

  const handleAcceptOffer = () => {
    if (!selectedOfferForAccept || !activeReq) return;

    db.acceptOffer(activeReq.id, selectedOfferForAccept.id);
    setSelectedOfferForAccept(null);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500">Talep: {activeReq?.requestCode}</span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              {offers.length} Teklif Yayında
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Gelen Nakliyat Teklifleri
          </h1>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('CARDS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'CARDS' ? 'bg-[#146EF5] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Kart Görünümü
          </button>
          <button
            onClick={() => setViewMode('COMPARE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              viewMode === 'COMPARE' ? 'bg-[#146EF5] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Karşılaştırma Matrisi
          </button>
        </div>
      </div>

      {/* Route Subtitle */}
      {activeReq && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8 flex items-center justify-between">
          <RouteDisplay
            originCity={activeReq.originCity}
            originDistrict={activeReq.originDistrict}
            destinationCity={activeReq.destinationCity}
            destinationDistrict={activeReq.destinationDistrict}
            size="md"
          />
          <Link href={`/app/customer/taleplerim/${activeReq.id}`} className="text-xs font-bold text-[#146EF5] hover:underline">
            Talebi İncele →
          </Link>
        </div>
      )}

      {/* 1. CARDS VIEW */}
      {viewMode === 'CARDS' && (
        <div className="space-y-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl border-2 transition-all p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                offer.status === 'ACCEPTED'
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-[#146EF5]'
              }`}
            >
              {/* Left Company Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {offer.carrier.logoUrl ? (
                      <img src={offer.carrier.logoUrl} alt={offer.carrier.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <Truck className="w-7 h-7 text-[#146EF5]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/firma/${offer.carrier.slug}`} className="font-bold text-base text-slate-900 hover:text-[#146EF5]">
                        {offer.carrier.companyName}
                      </Link>
                      {offer.carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                      <Badge variant="verified" size="sm" />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <div className="flex items-center text-amber-500 font-bold gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{offer.carrier.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({offer.carrier.reviewCount} Yorum)</span>
                      </div>
                      <span>•</span>
                      <span>{offer.carrier.completedJobsCount} Başarılı Taşıma</span>
                      <span>•</span>
                      <span>{offer.estimatedDeliveryDuration} Teslim</span>
                    </div>
                  </div>
                </div>

                {/* Offer Feature Badges Checklist */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${offer.isPackagingIncluded ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {offer.isPackagingIncluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                    <span>Paketleme Dahil</span>
                  </div>

                  <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${offer.isMobileElevatorIncluded ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {offer.isMobileElevatorIncluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                    <span>Mobil Asansör</span>
                  </div>

                  <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${offer.isAssemblyIncluded ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {offer.isAssemblyIncluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                    <span>Mobilya Montajı</span>
                  </div>

                  <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${offer.isInsuranceIncluded ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                    {offer.isInsuranceIncluded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5" />}
                    <span>Nakliyat Sigortası</span>
                  </div>
                </div>

                {offer.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    &quot;{offer.notes}&quot;
                  </p>
                )}
              </div>

              {/* Right Price & Actions Box */}
              <div className="lg:w-64 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 flex flex-col items-center lg:items-end justify-center text-center lg:text-right shrink-0">
                <span className="text-xs text-slate-400 font-medium">Toplam Teklif Bedeli</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 my-1">
                  {offer.price.toLocaleString('tr-TR')} TL
                </span>
                <span className="text-[11px] text-slate-400 mb-4">
                  {offer.isVatIncluded ? 'KDV Dahil' : '+ KDV'} • Geçerlilik: {offer.validUntil}
                </span>

                {offer.status === 'ACCEPTED' ? (
                  <div className="w-full p-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Anlaşıldı
                  </div>
                ) : activeReq?.status === 'ASSIGNED' ? (
                  <div className="w-full p-2 rounded-xl bg-slate-100 text-slate-500 text-xs">
                    Başka firma seçildi
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full font-bold shadow-sm"
                      onClick={() => setSelectedOfferForAccept(offer)}
                    >
                      İşi Bu Firmaya Ver
                    </Button>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link href={`/app/customer/mesajlar?carrierId=${offer.carrierId}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                          Mesaj
                        </Button>
                      </Link>

                      {phoneRevealId === offer.id ? (
                        <a href={`tel:${offer.carrier.phone}`} className="w-full">
                          <Button variant="secondary" size="sm" className="w-full text-xs truncate">
                            {offer.carrier.phone}
                          </Button>
                        </a>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                          leftIcon={<Phone className="w-3.5 h-3.5" />}
                          onClick={() => setPhoneRevealId(offer.id)}
                        >
                          Ara
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. COMPARISON MATRIX VIEW (Spec Item 64) */}
      {viewMode === 'COMPARE' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-700">Firma</th>
                  <th className="p-4 font-bold text-slate-700">Fiyat (TL)</th>
                  <th className="p-4 font-bold text-slate-700">Puan</th>
                  <th className="p-4 font-bold text-slate-700">Paketleme</th>
                  <th className="p-4 font-bold text-slate-700">Asansör</th>
                  <th className="p-4 font-bold text-slate-700">Montaj</th>
                  <th className="p-4 font-bold text-slate-700">Sigorta</th>
                  <th className="p-4 font-bold text-slate-700">Teslim Süresi</th>
                  <th className="p-4 font-bold text-slate-700 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {offers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{off.carrier.companyName}</span>
                        {off.carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                      </div>
                    </td>
                    <td className="p-4 font-black text-sm text-slate-900">
                      {off.price.toLocaleString('tr-TR')} TL
                    </td>
                    <td className="p-4 font-semibold text-amber-600">
                      ★ {off.carrier.rating.toFixed(1)} ({off.carrier.reviewCount})
                    </td>
                    <td className="p-4">
                      {off.isPackagingIncluded ? <span className="text-emerald-600 font-bold">✓ Dahil</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-4">
                      {off.isMobileElevatorIncluded ? <span className="text-emerald-600 font-bold">✓ Dahil</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-4">
                      {off.isAssemblyIncluded ? <span className="text-emerald-600 font-bold">✓ Dahil</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-4">
                      {off.isInsuranceIncluded ? <span className="text-emerald-600 font-bold">✓ Dahil</span> : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-4 text-slate-600">
                      {off.estimatedDeliveryDuration}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setSelectedOfferForAccept(off)}
                        disabled={activeReq?.status === 'ASSIGNED'}
                      >
                        İşi Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ACCEPT OFFER CONFIRMATION MODAL (Spec Item 65) */}
      <Modal
        isOpen={!!selectedOfferForAccept}
        onClose={() => setSelectedOfferForAccept(null)}
        title="İşi Bu Firmaya Vermeyi Onaylıyor musunuz?"
      >
        {selectedOfferForAccept && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block text-base">{selectedOfferForAccept.carrier.companyName}</span>
                <span className="text-xs text-slate-500">Teklif Bedeli: {selectedOfferForAccept.price.toLocaleString('tr-TR')} TL</span>
              </div>
              <Badge variant="verified" size="sm" />
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Ödeme ve Güvence Bilgilendirmesi</span>
              </div>
              <p>
                Taşıma ücreti platform üzerinden tahsil <strong>edilmez</strong>. Ödemeyi ve kesin taşıma detaylarını anlaştığınız nakliyeci ile doğrudan belirlersiniz.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOfferForAccept(null)}>
                Vazgeç
              </Button>
              <Button variant="primary" size="md" onClick={handleAcceptOffer}>
                Evet, Firmayla Anlaştım
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Success Notification Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Tebrikler, Firma Seçimi Tamamlandı! 🎉"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-sm text-slate-700">
            Seçtiğiniz nakliyat firmasına bildirim iletildi. Talebiniz diğer tekliflere kapatıldı.
          </p>
          <div className="pt-4">
            <Button variant="primary" size="md" onClick={() => setIsSuccessModalOpen(false)} className="w-full">
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
