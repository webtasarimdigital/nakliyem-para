'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Star, ShieldCheck, Phone, MessageSquare, Check, X,
  ArrowRight, Truck, ChevronDown, ChevronUp, AlertCircle,
  Clock, Calendar, Award, Info, MoveRight, CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { LiveOfferChatModal } from '@/components/ui/LiveOfferChatModal';
import { openSupportChat } from '@/components/ui/SupportChatWidget';
import { Offer, MovingRequest } from '@/types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';

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

function CustomerOffersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqIdParam = searchParams?.get('reqId');

  const [currentUser, setCurrentUser] = useState(() => db.getCurrentUser());
  const [requests, setRequests] = useState<MovingRequest[]>(() => db.getRequests());
  const [selectedReqId, setSelectedReqId] = useState<string>(reqIdParam || '');

  // Reload requests and auth on events
  useEffect(() => {
    const handleReloadReqs = () => {
      setRequests(db.getRequests());
    };
    const handleAuth = () => {
      setCurrentUser(db.getCurrentUser());
    };
    window.addEventListener('storage', handleReloadReqs);
    window.addEventListener('storage', handleAuth);
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('request-added', handleReloadReqs);
    return () => {
      window.removeEventListener('storage', handleReloadReqs);
      window.removeEventListener('storage', handleAuth);
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('request-added', handleReloadReqs);
    };
  }, []);

  // Update selectedReqId if URL param changes
  useEffect(() => {
    if (reqIdParam) {
      setSelectedReqId(reqIdParam);
    }
  }, [reqIdParam]);

  // Find customer's requests
  const customerRequests = requests.filter(r => currentUser?.id && r.customerId === currentUser.id);
  const activeReq = (selectedReqId ? requests.find(r => (r.id === selectedReqId || r.requestCode === selectedReqId) && (!currentUser?.id || r.customerId === currentUser.id)) : null)
    || (customerRequests.length > 0 ? customerRequests[0] : null);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'delivery'>('price');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [successOffer, setSuccessOffer] = useState<Offer | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'TABLE'>('LIST');
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatData, setChatData] = useState({
    carrierName: 'TaşınTeklif Nakliyat',
    carrierSlug: 'tasinteklif-nakliyat',
    requestId: activeReq?.requestCode || '#26093',
    price: 25000
  });

  // Load offers dynamically for active request
  useEffect(() => {
    if (!activeReq) return;

    const loadOffers = async () => {
      const localOffers = db.getOffersForRequest(activeReq.id);

      if (isFirebaseConfigured() && firestoreDb) {
        try {
          const q = query(collection(firestoreDb, 'offers'), where('requestId', '==', activeReq.id));
          const snapshot = await getDocs(q);
          const fbOffers = snapshot.docs.map(doc => ({ ...(doc.data() as Offer), id: doc.id }));
          const combined = [...fbOffers];
          localOffers.forEach(lo => {
            if (!combined.some(o => o.id === lo.id)) {
              combined.push(lo);
            }
          });
          setOffers(combined);
        } catch {
          setOffers(localOffers);
        }
      } else {
        setOffers(localOffers);
      }
    };

    loadOffers();

    const handleReloadOffers = () => loadOffers();
    window.addEventListener('storage', handleReloadOffers);
    window.addEventListener('offer-added', handleReloadOffers);
    return () => {
      window.removeEventListener('storage', handleReloadOffers);
      window.removeEventListener('offer-added', handleReloadOffers);
    };
  }, [activeReq?.id]);

  const sorted = [...offers].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return (b.carrier?.rating || 5) - (a.carrier?.rating || 5);
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0A1128] mb-2">Firma Başarıyla Seçildi! 🎉</h2>
          <p className="text-base font-black text-[#F95700] mb-1">{successOffer.carrier.companyName}</p>
          <p className="text-3xl font-black text-[#0A1128] mb-4">{successOffer.price.toLocaleString('tr-TR')} TL</p>
          <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">
            Firma yetkilisine anlaşma bilgisi iletildi. Yetkili sizinle telefon numaranız üzerinden iletişime geçecektir.
          </p>
          <div className="space-y-3">
            <Link href="/app/customer">
              <Button variant="primary" size="lg" className="w-full font-black">Taşınma Merkezime Git</Button>
            </Link>
            {successOffer.carrier.phone && (
              <a href={`tel:${successOffer.carrier.phone}`} className="block">
                <Button variant="navy" size="lg" className="w-full font-bold" leftIcon={<Phone className="w-4 h-4" />}>
                  Firmayı Doğrudan Ara
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!activeReq) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-3">
              <CustomerSidebar activeTab="offers" />
            </div>
            <div className="lg:col-span-9">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                  <Clock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-[#0A1128]">Henüz Yayınlanmış Bir Talebiniz Yok</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                    Nakliyat firmalarından teklif alabilmek için önce birkaç adımda taşınma talebinizi oluşturun.
                  </p>
                </div>
                <div className="pt-4 flex justify-center">
                  <Link href="/teklif-al">
                    <Button variant="primary" size="lg" className="font-black text-sm">
                      Hemen Ücretsiz Talep Oluştur →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
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

            {/* Header + Request Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {activeReq?.requestCode || '#TALEP'}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                    offers.length > 0 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    {offers.length > 0 ? `${offers.length} Teklif Geldi` : 'Teklif Bekleniyor'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Gelen Nakliyat Teklifleri</h1>
              </div>

              {/* Request Switcher if user has multiple requests */}
              {customerRequests.length > 1 && (
                <div className="shrink-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Talebiniz:</label>
                  <select
                    value={activeReq?.id}
                    onChange={(e) => {
                      setSelectedReqId(e.target.value);
                      router.push(`/app/customer/teklifler?reqId=${e.target.value}`);
                    }}
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:border-[#F95700] focus:outline-none"
                  >
                    {customerRequests.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.requestCode || '#TALEP'} · {r.originCity} → {r.destinationCity} ({r.homeSize})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Request Summary Card */}
            {activeReq && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <RouteDisplay
                  originCity={activeReq.originCity}
                  originDistrict={activeReq.originDistrict}
                  destinationCity={activeReq.destinationCity}
                  destinationDistrict={activeReq.destinationDistrict}
                  size="md"
                />
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-[#F95700]" />
                    {activeReq.movingDate}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-slate-700">{activeReq.homeSize} Ev</span>
                  <Link href={`/app/customer/taleplerim`} className="text-[#F95700] font-black hover:underline ml-2">
                    Taleplerime Git →
                  </Link>
                </div>
              </div>
            )}

            {/* Controls Bar (Only when offers exist) */}
            {offers.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Sırala:</span>
                  {[
                    { val: 'price', label: 'En Ucuz' },
                    { val: 'rating', label: 'En Yüksek Puan' },
                  ].map(s => (
                    <button
                      key={s.val}
                      onClick={() => setSortBy(s.val as 'price' | 'rating')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        sortBy === s.val ? 'bg-[#F95700] text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#F95700]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 bg-slate-200 rounded-xl p-0.5">
                  <button 
                    onClick={() => setViewMode('LIST')} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      viewMode === 'LIST' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Liste
                  </button>
                  <button 
                    onClick={() => setViewMode('TABLE')} 
                    className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all ${
                      viewMode === 'TABLE' ? 'bg-white text-[#0A1128] shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Karşılaştır
                  </button>
                </div>
              </div>
            )}

            {/* Tip Banner */}
            {offers.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 font-medium">
                  En ucuz teklif her zaman en doğru seçim değildir. Paketleme, sigorta ve asansör dahil mi kontrol edin.
                </p>
              </div>
            )}

            {/* ── LIST VIEW ─────────────────────────────────────────── */}
            {offers.length > 0 && viewMode === 'LIST' && (
              <div className="space-y-4">
                {sorted.map((offer, index) => {
                  const isExpanded = expandedId === offer.id;
                  const isAccepted = offer.status === 'ACCEPTED';
                  const carrier = offer.carrier || {
                    companyName: 'TaşınTeklif Onaylı Nakliyat',
                    rating: 5.0,
                    reviewCount: 1,
                    verificationStatus: 'APPROVED'
                  };

                  return (
                    <div 
                      key={offer.id} 
                      className={`bg-white rounded-2xl border-2 transition-all shadow-xs overflow-hidden ${
                        isAccepted ? 'border-emerald-400 bg-emerald-50/30'
                          : index === 0 ? 'border-[#F95700]/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {index === 0 && !isAccepted && (
                        <div className="bg-[#F95700] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          En Uygun Fiyat
                        </div>
                      )}
                      {isAccepted && (
                        <div className="bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Seçilen Firma
                        </div>
                      )}

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          {/* Firma info */}
                          <div className="flex items-start gap-3 flex-1 min-w-[200px]">
                            <div className="w-12 h-12 rounded-xl bg-[#0A1128] flex items-center justify-center text-white font-black text-lg shrink-0">
                              {carrier.companyName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <h3 className="font-black text-[#0A1128] text-base">{carrier.companyName}</h3>
                                {carrier.verificationStatus === 'APPROVED' && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                                  <strong className="text-slate-700">{carrier.rating || 5.0}</strong>
                                </span>
                                <span>·</span>
                                <span>{carrier.reviewCount || 0} Değerlendirme</span>
                              </div>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                              {offer.price.toLocaleString('tr-TR')} <span className="text-sm font-bold text-slate-500">TL</span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-bold block">
                              {offer.isVatIncluded ? 'KDV Dahil' : 'KDV Hariç'}
                            </span>
                          </div>
                        </div>

                        {/* Features Badges */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-4">
                          {offer.isPackagingIncluded && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              ✓ Paketleme Dahil
                            </span>
                          )}
                          {offer.isAssemblyIncluded && (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              ✓ Montaj Dahil
                            </span>
                          )}
                          {offer.isMobileElevatorIncluded && (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200">
                              ✓ Mobil Asansör Dahil
                            </span>
                          )}
                          {offer.isInsuranceIncluded && (
                            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200">
                              ✓ Sigorta Dahil
                            </span>
                          )}
                        </div>

                        {/* Offer note if exists */}
                        {offer.notes && (
                          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                            <strong>Firma Notu:</strong> {offer.notes}
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex items-center gap-3 pt-4 mt-3 border-t border-slate-100 flex-wrap">
                          {!isAccepted ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                className="font-black px-6"
                                onClick={() => setSelectedOffer(offer)}
                              >
                                Teklifi Kabul Et
                              </Button>
                              <button
                                type="button"
                                onClick={() => {
                                  setChatData({
                                    carrierName: carrier.companyName,
                                    carrierSlug: carrier.slug || 'tasinteklif',
                                    requestId: activeReq?.requestCode || '#TALEP',
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
                              <span className="text-sm font-black text-emerald-700">Anlaşıldı</span>
                              {carrier.phone && (
                                <a href={`tel:${carrier.phone}`} className="ml-2">
                                  <Button variant="navy" size="sm" className="font-bold" leftIcon={<Phone className="w-4 h-4" />}>
                                    Ara
                                  </Button>
                                </a>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── TABLE VIEW ────────────────────────────────────────── */}
            {offers.length > 0 && viewMode === 'TABLE' && (
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
                              <span className={`text-xs font-black ${i === 0 ? 'text-[#F95700]' : 'text-[#0A1128]'}`}>
                                {offer.carrier?.companyName?.split(' ')[0] || 'Firma'}
                              </span>
                              <div className="flex items-center gap-0.5 text-[10px] text-amber-600 font-bold">
                                <Star className="w-3 h-3 fill-current" />
                                {offer.carrier?.rating || 5.0}
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
                                  <span className={`font-black text-base ${ci === 0 ? 'text-[#F95700]' : 'text-[#0A1128]'}`}>
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
                      {/* Action row */}
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

            {/* ── EMPTY STATE WHEN NO OFFERS YET ────────────────────── */}
            {offers.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-4 shadow-xs animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-[#0A1128]">Talebiniz Yayında — Teklifler Hazırlanıyor</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                    Talebiniz bölgenizdeki yetki belgeli nakliyat firmalarına iletildi. Firmalar eşya listenizi ve güzergahınızı inceleyip fiyat teklifi verdikçe burada anında listelenecektir.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
                    <span>Ortalama Süre:</span>
                  </div>
                  <p className="text-slate-600 font-medium text-[11px] leading-relaxed">
                    İlk teklif genellikle 15 - 30 dakika içinde gelir. Teklif geldiğinde SMS ve bildirim ile haberdar edileceksiniz.
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap justify-center gap-3">
                  <Link href="/app/customer/taleplerim">
                    <Button variant="outline" size="md" className="font-bold text-xs">
                      Taleplerime Dön
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => openSupportChat()}
                    className="px-5 py-2.5 rounded-xl bg-[#111E38] hover:bg-[#1a2e56] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Canlı Destek ile Görüş
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedOffer}
        onClose={() => setSelectedOffer(null)}
        title="Firma Teklifini Onayla"
      >
        {selectedOffer && (
          <div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-5 text-center">
              <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Seçilen Firma</p>
              <p className="font-black text-[#0A1128] text-xl">{selectedOffer.carrier?.companyName || 'Nakliyat Firması'}</p>
              <p className="text-3xl font-black text-[#F95700] mt-1">{selectedOffer.price.toLocaleString('tr-TR')} TL</p>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mb-5 leading-relaxed">
              Bu teklifi onayladığınızda diğer teklifler arşivlenecek ve seçtiğiniz nakliyat firmasına taşıma detayı iletilecektir.
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

      {/* Live Offer Chat Modal */}
      <LiveOfferChatModal
        isOpen={liveChatOpen}
        onClose={() => setLiveChatOpen(false)}
        carrierName={chatData.carrierName}
        carrierSlug={chatData.carrierSlug}
        requestId={chatData.requestId}
        offerPrice={chatData.price}
      />

    </div>
  );
}

export default function CustomerOffersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <CustomerOffersContent />
    </Suspense>
  );
}
