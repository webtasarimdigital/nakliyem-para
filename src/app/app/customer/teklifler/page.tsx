'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star, ShieldCheck, Phone, MessageSquare, Check, X,
  ArrowRight, Truck, ChevronDown, ChevronUp, AlertCircle,
  Clock, Calendar, Award, Info, MoveRight, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { LiveOfferChatModal } from '@/components/ui/LiveOfferChatModal';
import { Offer } from '@/types';

const CRITERIA = [
  { key: 'price', label: 'Fiyat', info: 'KDV dahil/hariç durumuna dikkat edin' },
  { key: 'isVatIncluded', label: 'KDV Dahil', info: 'Bazı teklifler KDV hariç gösterilir' },
  { key: 'isPackagingIncluded', label: 'Paketleme', info: 'Eşyalarınızın paketlenmesini kapsar' },
  { key: 'isAssemblyIncluded', label: 'Demontaj & Montaj', info: 'Mobilya sökme ve kurma dahil mi' },
  { key: 'isMobileElevatorIncluded', label: 'Mobil Asansör', info: 'Kat asansörü kiralama dahil mi' },
  { key: 'isInsuranceIncluded', label: 'Sigorta', info: 'Taşıma sigortası dahil mi' },
  { key: 'estimatedDeliveryDuration', label: 'Teslim Süresi', info: 'Taşımanın tamamlanma süresi' },
  { key: 'validUntil', label: 'Geçerlilik', info: 'Teklifin son geçerlilik tarihi' },
];

function getBoolVal(offer: Offer, key: string): boolean | string | number {
  switch (key) {
    case 'price': return offer.price;
    case 'isVatIncluded': return offer.isVatIncluded;
    case 'isPackagingIncluded': return offer.isPackagingIncluded;
    case 'isAssemblyIncluded': return offer.isAssemblyIncluded;
    case 'isMobileElevatorIncluded': return offer.isMobileElevatorIncluded;
    case 'isInsuranceIncluded': return offer.isInsuranceIncluded;
    case 'estimatedDeliveryDuration': return offer.estimatedDeliveryDuration;
    case 'validUntil': return offer.validUntil?.slice(0, 10) || '—';
    default: return '—';
  }
}

export default function CustomerOffersPage() {
  const requests = db.getRequests();
  const activeReq = requests.find(r => r.status === 'ACTIVE') || requests[0];
  const offers = activeReq ? db.getOffersForRequest(activeReq.id) : [];

  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'delivery'>('price');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [phoneRevealId, setPhoneRevealId] = useState<string | null>(null);
  const [successOffer, setSuccessOffer] = useState<Offer | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'TABLE'>('LIST');
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatData, setChatData] = useState({
    carrierName: 'SAYCANLAR NAKLİYAT',
    carrierSlug: 'saycanlar-nakliyat',
    requestId: activeReq?.requestCode || '#26093',
    price: 25000
  });

  const sorted = [...offers].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.carrier.rating - a.carrier.rating;
    return 0;
  });

  const handleAccept = () => {
    if (!selectedOffer || !activeReq) return;
    db.acceptOffer(activeReq.id, selectedOffer.id);
    setSuccessOffer(selectedOffer);
    setSelectedOffer(null);
  };

  if (successOffer) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0A1128] mb-2">Firma Seçildi!</h2>
          <p className="text-base font-black text-[#F95700] mb-1">{successOffer.carrier.companyName}</p>
          <p className="text-3xl font-black text-[#0A1128] mb-4">{successOffer.price.toLocaleString('tr-TR')} TL</p>
          <p className="text-slate-500 font-medium text-sm mb-8">
            Firma bilgilendirildi. Taşınma merkezinizden süreci takip edebilirsiniz.
          </p>
          <div className="space-y-3">
            <Link href="/app/customer">
              <Button variant="primary" size="lg" className="w-full font-black">Taşınma Merkezime Git</Button>
            </Link>
            <a href={`tel:${successOffer.carrier.phone}`} className="block">
              <Button variant="navy" size="lg" className="w-full font-bold" leftIcon={<Phone className="w-4 h-4" />}>
                Firmayı Ara
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="offers" />
          </div>
          <div className="lg:col-span-9 space-y-6">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              {activeReq?.requestCode}
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              {offers.length} Teklif Mevcut
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Nakliyat Teklifleri</h1>
        </div>

        {/* Talep özeti */}
        {activeReq && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <RouteDisplay
              originCity={activeReq.originCity}
              originDistrict={activeReq.originDistrict}
              destinationCity={activeReq.destinationCity}
              destinationDistrict={activeReq.destinationDistrict}
              size="md"
            />
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{activeReq.movingDate}</span>
              <span>·</span>
              <span>{activeReq.homeSize} Ev</span>
              <Link href={`/app/customer/taleplerim/${activeReq.id}`} className="text-[#F95700] font-black hover:underline ml-2">
                Talebi Gör →
              </Link>
            </div>
          </div>
        )}

        {/* Kontrol Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Sırala:</span>
            {[
              { val: 'price', label: 'En Ucuz' },
              { val: 'rating', label: 'En Yüksek Puan' },
            ].map(s => (
              <button
                key={s.val}
                onClick={() => setSortBy(s.val as 'price' | 'rating' | 'delivery')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${sortBy === s.val ? 'bg-[#F95700] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#F95700]'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 bg-slate-200 rounded-xl p-0.5">
            <button onClick={() => setViewMode('LIST')} className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${viewMode === 'LIST' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500'}`}>Liste</button>
            <button onClick={() => setViewMode('TABLE')} className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${viewMode === 'TABLE' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500'}`}>Karşılaştır</button>
          </div>
        </div>

        {/* Uyarı */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 mb-5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-medium">
            En ucuz teklif her zaman en doğru seçim değildir. Paketleme, sigorta ve asansör dahil mi kontrol edin.
          </p>
        </div>

        {/* ── LIST VIEW ─────────────────────────────────────────── */}
        {viewMode === 'LIST' && (
          <div className="space-y-4">
            {sorted.map((offer, index) => {
              const isExpanded = expandedId === offer.id;
              const isAccepted = offer.status === 'ACCEPTED';
              const includedItems = [
                offer.isPackagingIncluded && 'Paketleme',
                offer.isAssemblyIncluded && 'Demontaj & Montaj',
                offer.isMobileElevatorIncluded && 'Mobil Asansör',
                offer.isInsuranceIncluded && 'Sigorta',
                offer.isVatIncluded && 'KDV Dahil',
              ].filter(Boolean) as string[];
              const excludedItems = [
                !offer.isPackagingIncluded && 'Paketleme',
                !offer.isAssemblyIncluded && 'Demontaj & Montaj',
                !offer.isMobileElevatorIncluded && 'Mobil Asansör',
                !offer.isInsuranceIncluded && 'Sigorta',
                !offer.isVatIncluded && 'KDV Hariç',
              ].filter(Boolean) as string[];

              return (
                <div key={offer.id} className={`bg-white rounded-2xl border-2 transition-all shadow-xs ${
                  isAccepted ? 'border-emerald-400 bg-emerald-50/30'
                    : index === 0 ? 'border-[#F95700]/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  {/* Rank banner */}
                  {index === 0 && !isAccepted && (
                    <div className="bg-[#F95700] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-t-[14px] flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      En Uygun Fiyat
                    </div>
                  )}
                  {isAccepted && (
                    <div className="bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-t-[14px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Seçilen Firma
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Firma info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#0A1128] flex items-center justify-center text-white font-black text-lg shrink-0">
                          {offer.carrier.companyName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="font-black text-[#0A1128] text-base">{offer.carrier.companyName}</h3>
                            {offer.carrier.verificationStatus === 'APPROVED' && (
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <strong className="text-slate-700">{offer.carrier.rating}</strong>
                              <span>({offer.carrier.reviewCount} yorum)</span>
                            </span>
                            <span>{offer.carrier.completedJobsCount} iş tamamlandı</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{offer.estimatedDeliveryDuration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Fiyat */}
                      <div className="text-right shrink-0">
                        <p className={`text-2xl sm:text-3xl font-black ${index === 0 ? 'text-[#F95700]' : 'text-[#0A1128]'}`}>
                          {offer.price.toLocaleString('tr-TR')} TL
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {offer.isVatIncluded ? 'KDV Dahil' : 'KDV Hariç'}
                        </p>
                      </div>
                    </div>

                    {/* Kapsam özeti */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {includedItems.map(item => (
                        <span key={item} className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                          <Check className="w-3 h-3" />{item}
                        </span>
                      ))}
                      {excludedItems.map(item => (
                        <span key={item} className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg line-through">
                          <X className="w-3 h-3" />{item}
                        </span>
                      ))}
                    </div>

                    {/* Expanded notes */}
                    {isExpanded && offer.notes && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500 mb-1">Firma Notu</p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{offer.notes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-4 border-t border-slate-100">
                      {!isAccepted ? (
                        <>
                          <Button
                            variant="primary"
                            size="md"
                            className="font-black flex-1 sm:flex-none sm:px-6"
                            onClick={() => setSelectedOffer(offer)}
                          >
                            Bu Firmayı Seç
                          </Button>
                          {phoneRevealId === offer.id ? (
                            <a href={`tel:${offer.carrier.phone}`}>
                              <Button variant="navy" size="md" className="font-bold w-full" leftIcon={<Phone className="w-4 h-4" />}>
                                {offer.carrier.phone}
                              </Button>
                            </a>
                          ) : (
                            <Button variant="outline" size="md" className="font-bold"
                              leftIcon={<Phone className="w-4 h-4" />}
                              onClick={() => setPhoneRevealId(offer.id)}>
                              Numarayı Gör
                            </Button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setChatData({
                                carrierName: offer.carrier.companyName,
                                carrierSlug: offer.carrier.slug,
                                requestId: activeReq?.requestCode || '#26093',
                                price: offer.price
                              });
                              setLiveChatOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-[#F95700]" />
                            <span>Mesajlaş</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-black text-emerald-700">Seçildi</span>
                          <a href={`tel:${offer.carrier.phone}`} className="ml-2">
                            <Button variant="navy" size="sm" className="font-bold" leftIcon={<Phone className="w-4 h-4" />}>
                              Ara
                            </Button>
                          </a>
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : offer.id)}
                        className="sm:ml-auto text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? 'Gizle' : 'Detay'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TABLE VIEW ────────────────────────────────────────── */}
        {viewMode === 'TABLE' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-black text-slate-500 uppercase tracking-wider p-4 w-36">Kapsam</th>
                    {sorted.map((offer, i) => (
                      <th key={offer.id} className={`text-center p-4 ${i === 0 ? 'bg-orange-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white ${i === 0 ? 'bg-[#F95700]' : 'bg-[#0A1128]'}`}>
                            {i + 1}
                          </div>
                          <span className={`text-xs font-black ${i === 0 ? 'text-[#F95700]' : 'text-slate-900'}`}>
                            {offer.carrier.companyName.split(' ')[0]}
                          </span>
                          <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {offer.carrier.rating}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map((criterion, ri) => (
                    <tr key={criterion.key} className={ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-700">{criterion.label}</span>
                          <span title={criterion.info} className="cursor-help">
                            <Info className="w-3 h-3 text-slate-300 hover:text-slate-500 transition-colors" />
                          </span>
                        </div>
                      </td>
                      {sorted.map((offer, ci) => {
                        const val = getBoolVal(offer, criterion.key);
                        return (
                          <td key={offer.id} className={`p-4 text-center ${ci === 0 ? 'bg-orange-50/30' : ''}`}>
                            {criterion.key === 'price' ? (
                              <span className={`font-black text-base ${ci === 0 ? 'text-[#F95700]' : 'text-slate-900'}`}>
                                {(val as number).toLocaleString('tr-TR')} TL
                              </span>
                            ) : typeof val === 'boolean' ? (
                              val ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100">
                                  <Check className="w-4 h-4 text-emerald-600" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100">
                                  <X className="w-4 h-4 text-slate-400" />
                                </span>
                              )
                            ) : (
                              <span className="text-xs font-bold text-slate-600">{val as string}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Aksiyon satırı */}
                  <tr className="border-t-2 border-slate-200 bg-white">
                    <td className="p-4 text-xs font-black text-slate-500">Seç</td>
                    {sorted.map((offer, i) => (
                      <td key={offer.id} className={`p-4 text-center ${i === 0 ? 'bg-orange-50/30' : ''}`}>
                        <Button
                          variant={i === 0 ? 'primary' : 'outline'}
                          size="sm"
                          className="font-black text-xs"
                          onClick={() => setSelectedOffer(offer)}
                        >
                          {i === 0 ? 'En İyi Seçim' : 'Seç'}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {offers.length === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
            <Truck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="font-black text-slate-700 text-xl mb-2">Henüz teklif yok</h2>
            <p className="text-slate-500 font-medium">Nakliyeciler tekliflerini gönderdikçe burada listelenir.</p>
          </div>
        )}
      </div>

      {/* ── Firma Seç Modal ────────────────────────────────────── */}
      <Modal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        title="Firmayı Onayla"
      >
        {selectedOffer && (
          <div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-sm font-bold text-slate-600 mb-1">Seçilen Firma</p>
              <p className="font-black text-[#0A1128] text-lg">{selectedOffer.carrier.companyName}</p>
              <p className="text-3xl font-black text-[#F95700] mt-1">{selectedOffer.price.toLocaleString('tr-TR')} TL</p>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-5 leading-relaxed">
              Bu firmayı seçerek diğer teklifler otomatik reddedilecek ve firma bilgilendirilecektir. Onaylıyor musunuz?
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="md" className="flex-1 font-bold" onClick={() => setSelectedOffer(null)}>
                Vazgeç
              </Button>
              <Button variant="primary" size="md" className="flex-1 font-black" onClick={handleAccept}>
                Evet, Bu Firmayı Seç
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Live Offer Chat Modal (Image media_1788383028254 exact) */}
      <LiveOfferChatModal
        isOpen={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        carrierName={chatData.carrierName}
        carrierSlug={chatData.carrierSlug}
        requestId={chatData.requestId}
        offerPrice={chatData.price}
      />

        </div>
      </div>
    </div>
  );
}
