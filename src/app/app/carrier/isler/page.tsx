'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Phone,
  SlidersHorizontal,
  Check,
  Building2,
  Package,
  Truck,
  Warehouse,
  ShieldCheck,
  X,
  LayoutGrid,
  Home,
  Armchair,
  Boxes,
  ArrowRight,
  MoveRight,
  Star,
  Clock,
  Sparkles,
  Award,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db, SEED_PLANS } from '@/lib/data/mock-db';
import { MovingRequest, ServiceCategory } from '@/types';

// Category pills styled exactly like the user's reference image
const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tümü', icon: LayoutGrid, iconColor: 'text-white' },
  { id: 'EVDEN_EVE', label: 'Evden Eve', icon: Home, iconColor: 'text-amber-500' },
  { id: 'PARCA_ESYA', label: 'Ekspres Parça', icon: Package, iconColor: 'text-amber-500' },
  { id: 'OFIS_TASIMA', label: 'Ofis', icon: Armchair, iconColor: 'text-amber-500' },
  { id: 'ESYA_DEPOLAMA', label: 'Depolama', icon: Boxes, iconColor: 'text-amber-500' }
];

const HOME_SIZE_FILTERS = ['Tümü', '1+1', '2+1', '3+1', '4+1+'];

export default function CarrierJobsPage() {
  const currentUser = db.getCurrentUser();
  const isCarrier = currentUser?.role === 'CARRIER';
  const carrier = db.getCarriers()[0];
  const requests = db.getRequests();

  // Carrier subscription plan & offer checks
  const carrierPlan = SEED_PLANS.find(p => p.id === carrier?.planId) || SEED_PLANS[0];
  const myCarrierOffers = db.getOffersForCarrier(carrier?.id || '');
  const carrierOffersCount = myCarrierOffers.length;
  const canCreateOffer = !carrierPlan || (carrierPlan.features.offerCreate && (carrierPlan.features.monthlyOfferLimit === 'unlimited' || carrierOffersCount < carrierPlan.features.monthlyOfferLimit));
  const canViewPhone = carrierPlan?.features.customerPhoneAccess === true;

  // Plan limitation modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalData, setPlanModalData] = useState<{ title: string; subtitle: string; limitBadge?: string } | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Additional route & size filters
  const [filterOriginCity, setFilterOriginCity] = useState('');
  const [filterDestCity, setFilterDestCity] = useState('');
  const [filterSize, setFilterSize] = useState('Tümü');

  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // Quick inline offer inputs: { [reqId]: string }
  const [quickOfferPrices, setQuickOfferPrices] = useState<Record<string, string>>({});
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  // Auth gate modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authActionPayload, setAuthActionPayload] = useState<{ reqId: string; type: 'OFFER' | 'PHONE' } | null>(null);

  // Comprehensive Offer Modal
  const [offerModalReq, setOfferModalReq] = useState<MovingRequest | null>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [vatIncluded, setVatIncluded] = useState(true);
  const [packIncluded, setPackIncluded] = useState(false);
  const [assemblyIncluded, setAssemblyIncluded] = useState(false);
  const [elevatorIncluded, setElevatorIncluded] = useState(false);
  const [insuranceIncluded, setInsuranceIncluded] = useState(false);
  const [deliveryDuration, setDeliveryDuration] = useState('Aynı Gün');
  const [offerNotes, setOfferNotes] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    if (req.status !== 'ACTIVE') return false;
    if (activeCategory !== 'ALL' && req.serviceCategory !== activeCategory) return false;
    if (filterOriginCity && req.originCity !== filterOriginCity) return false;
    if (filterDestCity && req.destinationCity !== filterDestCity) return false;
    if (filterSize !== 'Tümü' && req.homeSize !== filterSize) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCity = req.originCity.toLowerCase().includes(q) || req.destinationCity.toLowerCase().includes(q);
      const matchCode = req.requestCode.toLowerCase().includes(q);
      const matchName = req.customerName.toLowerCase().includes(q);
      if (!matchCity && !matchCode && !matchName) return false;
    }
    return true;
  });

  // Check auth and plan rights before typing in input
  const handleInputInteraction = (reqId: string, e: React.MouseEvent | React.FocusEvent) => {
    if (!currentUser || currentUser.role !== 'CARRIER') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
      setAuthActionPayload({ reqId, type: 'OFFER' });
      setAuthModalOpen(true);
      return false;
    }
    if (!canCreateOffer) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
      setPlanModalData({
        title: 'Aylık Teklif Limitiniz Doldu',
        subtitle: `Mevcut ${carrierPlan?.name || 'Başlangıç'} paketinizdeki aylık ${carrierPlan?.features.monthlyOfferLimit} teklif hakkını doldurdunuz. Sınırsız teklif vermek ve daha fazla iş almak için paketinizi Pro veya Gold'a yükseltin.`,
        limitBadge: `${carrierOffersCount} / ${carrierPlan?.features.monthlyOfferLimit} Teklif Kullanıldı`
      });
      setPlanModalOpen(true);
      return false;
    }
    return true;
  };

  // Next / Prev photo in card carousel
  const handleNextPhoto = (reqId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [reqId]: ((prev[reqId] || 0) + 1) % total
    }));
  };

  const handlePrevPhoto = (reqId: string, total: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices(prev => ({
      ...prev,
      [reqId]: ((prev[reqId] || 0) - 1 + total) % total
    }));
  };

  // Trigger offer action with auth gate
  const handleQuickOfferSubmit = (req: MovingRequest, e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'CARRIER') {
      setAuthActionPayload({ reqId: req.id, type: 'OFFER' });
      setAuthModalOpen(true);
      return;
    }

    if (!canCreateOffer) {
      setPlanModalData({
        title: 'Aylık Teklif Limitiniz Doldu',
        subtitle: `Mevcut ${carrierPlan?.name || 'Başlangıç'} paketinizdeki aylık ${carrierPlan?.features.monthlyOfferLimit} teklif hakkını doldurdunuz. Sınırsız teklif vermek ve daha fazla iş almak için paketinizi Pro veya Gold'a yükseltin.`,
        limitBadge: `${carrierOffersCount} / ${carrierPlan?.features.monthlyOfferLimit} Teklif Kullanıldı`
      });
      setPlanModalOpen(true);
      return;
    }

    const price = quickOfferPrices[req.id];
    if (!price || parseFloat(price) <= 0) {
      setOfferModalReq(req);
      setOfferPrice('');
      return;
    }

    // Direct submit quick offer
    db.addOffer({
      id: `off_${Date.now()}`,
      requestId: req.id,
      carrierId: carrier.id,
      carrier,
      price: parseFloat(price),
      isVatIncluded: true,
      isPackagingIncluded: req.packagingPreference === 'CARRIER_PACKS',
      isMobileElevatorIncluded: req.originRequiresMobileElevator || req.destinationRequiresMobileElevator,
      isAssemblyIncluded: req.extraServices.includes('disassembly_assembly'),
      isInsuranceIncluded: req.extraServices.includes('insured'),
      estimatedDeliveryDuration: '24 Saat',
      validUntil: new Date(Date.now() + 7 * 86400000).toISOString(),
      notes: 'Hızlı teklif iletildi.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setQuickOfferPrices(prev => ({ ...prev, [req.id]: '' }));
    setOfferSubmitted(true);
    setOfferModalReq(req);
  };

  const handleShowPhone = (req: MovingRequest) => {
    if (!currentUser || currentUser.role !== 'CARRIER') {
      setAuthActionPayload({ reqId: req.id, type: 'PHONE' });
      setAuthModalOpen(true);
      return;
    }

    if (!canViewPhone) {
      setPlanModalData({
        title: 'Müşteri Numarasını Görmek İçin Paketinizi Yükseltin',
        subtitle: 'Müşteri telefon numaralarına doğrudan erişmek, anında aramak ve WhatsApp üzerinden iletişim kurmak Pro ve Gold nakliyeci paketlerine özeldir.',
        limitBadge: `Mevcut Paketiniz: ${carrierPlan?.name || 'Başlangıç'} (Telefon Erişimi Kapalı)`
      });
      setPlanModalOpen(true);
      return;
    }

    setRevealedPhones(prev => ({ ...prev, [req.id]: true }));
  };

  const resetOfferForm = () => {
    setOfferPrice('');
    setOfferSubmitted(false);
    setOfferModalReq(null);
  };

  const resetFilters = () => {
    setActiveCategory('ALL');
    setSearchQuery('');
    setFilterOriginCity('');
    setFilterDestCity('');
    setFilterSize('Tümü');
  };

  const hasActiveFilters = activeCategory !== 'ALL' || searchQuery || filterOriginCity || filterDestCity || filterSize !== 'Tümü';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* ── 1. HEADER (Title & Search Toggle exactly like screenshot) ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
              Talepler
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-[#0A1128] text-xs font-black">
              {filteredRequests.length} İş
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-black ${
                showFilterDrawer || filterOriginCity || filterDestCity || filterSize !== 'Tümü'
                  ? 'border-[#F95700] bg-orange-50 text-[#C23E00]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              title="Detaylı Filtreler"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filtrele</span>
            </button>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 text-slate-700 transition-all cursor-pointer"
              title="Arama Yap"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {isSearchOpen && (
          <div className="mb-5 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Şehir, ilçe, müşteri adı veya talep kodu ara (#26134)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border-2 border-slate-300 text-sm font-bold text-slate-900 bg-white focus:border-[#F95700] focus:outline-none shadow-sm"
                autoFocus
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── 2. CATEGORY PILLS (Screenshot Match) ─────────────── */}
        <div className="flex gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none ${
                  isSelected
                    ? 'bg-[#0A1128] text-white shadow-md ring-2 ring-[#0A1128]/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : tab.iconColor}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── 3. EXPANDABLE CITY / ROUTE / SIZE FILTER BAR ────────── */}
        {showFilterDrawer && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 mb-8 shadow-xs animate-fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-black text-[#0A1128] uppercase tracking-wider">Detaylı Güzergâh &amp; Hacim Filtresi</span>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs font-black text-red-500 hover:underline">
                  Filtreleri Temizle
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Çıkış İli (Nereden?)</label>
                <select
                  value={filterOriginCity}
                  onChange={e => setFilterOriginCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:border-[#F95700] focus:outline-none"
                >
                  <option value="">Tüm Şehirler</option>
                  {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Varış İli (Nereye?)</label>
                <select
                  value={filterDestCity}
                  onChange={e => setFilterDestCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 focus:border-[#F95700] focus:outline-none"
                >
                  <option value="">Tüm Şehirler</option>
                  {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Ev Büyüklüğü</label>
                <div className="flex gap-1">
                  {HOME_SIZE_FILTERS.map(size => (
                    <button
                      key={size}
                      onClick={() => setFilterSize(size)}
                      className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                        filterSize === size
                          ? 'border-[#F95700] bg-orange-50 text-[#C23E00]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. SPACIOUS REQUESTS FEED ───────────────────────── */}
        <div className="space-y-6">
          {filteredRequests.map((req) => {
            const myOffer = db.getOffersForCarrier(carrier.id).find(o => o.requestId === req.id);
            const photoList = req.photos.length > 0 ? req.photos : [
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
            ];
            const currentPhotoIdx = activePhotoIndices[req.id] || 0;
            const isPhoneRevealed = revealedPhones[req.id];

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#F95700]/50 transition-all p-5 sm:p-7 shadow-xs space-y-5"
              >
                {/* 1. Header: User Avatar, Name, Code, Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#5B7BA8] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                      {req.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-sm sm:text-base text-[#0A1128]">
                        {req.customerName}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Bireysel Müşteri</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-black text-slate-400">{req.requestCode}</span>
                    <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black tracking-wide shadow-2xs">
                      Şimdi
                    </span>
                  </div>
                </div>

                {/* 2. Route & Service Category Pill */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                    <span className="text-[#F95700] font-black">{req.originCity}</span>
                    <MoveRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-900 font-black">{req.destinationCity}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-black text-[#C23E00]">
                    <Home className="w-3.5 h-3.5" />
                    <span>{req.serviceCategory === 'EVDEN_EVE' ? 'Evden Eve' : req.serviceCategory === 'OFIS_TASIMA' ? 'Ofis Taşıma' : 'Parça Eşya'}</span>
                  </div>

                  {myOffer && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                      ✓ Teklifiniz: {myOffer.price.toLocaleString('tr-TR')} TL
                    </span>
                  )}
                </div>

                {/* 3. Large High-Res Photo Slider (Like Reference Image) */}
                <div className="relative aspect-[16/9] sm:aspect-[2/1] rounded-2xl overflow-hidden bg-slate-900 group">
                  <img
                    src={photoList[currentPhotoIdx]}
                    alt={`Eşya Görseli - ${req.requestCode}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Expand to Lightbox Button */}
                  <button
                    onClick={() => setLightboxPhoto(photoList[currentPhotoIdx])}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
                    title="Büyük Görsel"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Carousel Left / Right Controls if multiple photos */}
                  {photoList.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevPhoto(req.id, photoList.length, e)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextPhoto(req.id, photoList.length, e)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs">
                        {photoList.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentPhotoIdx ? 'bg-white w-4' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* 4. Origin & Destination & Date Details */}
                <div className="space-y-1.5 text-xs sm:text-sm font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F95700] shrink-0" />
                    <span>{req.originCity}, {req.originDistrict} → {req.destinationCity}, {req.destinationDistrict}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{req.movingDate}&apos;da taşınacak ({req.isDateFlexible ? '±Esnek' : 'Kesin Tarih'})</span>
                  </div>
                </div>

                {/* 5. Feature Badges (Home Size, Floor, Packaging) */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                    🛋️ {req.homeSize} Eşya
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                    🏢 Çıkış: {req.originFloor === 0 ? 'Zemin Kat' : `${req.originFloor}. Kat`} · {req.originHasElevator ? 'Asansör Var' : 'Merdiven'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                    🏢 Varış: {req.destinationFloor === 0 ? 'Zemin Kat' : `${req.destinationFloor}. Kat`} · {req.destinationHasElevator ? 'Asansör Var' : 'Merdiven'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">
                    📦 {req.packagingPreference === 'CARRIER_PACKS' ? 'Firma Paketlesin' : req.packagingPreference === 'CUSTOMER_PACKS' ? 'Kendim Paketleyeceğim' : 'İkisi İçin Teklif'}
                  </span>
                </div>

                {/* 6. Notes if present */}
                {req.notes && (
                  <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                    &ldquo;{req.notes}&rdquo;
                  </p>
                )}

                {/* 7. Action Bar: Quick Offer Input + Gönder + Numarayı Göster */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  
                  {(() => {
                    const existingOffer = myCarrierOffers.find(o => o.requestId === req.id);

                    if (existingOffer) {
                      return (
                        <div className="flex-1 flex items-center justify-between p-2.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span className="text-xs font-black text-emerald-950">
                              Teklifiniz İletildi: <strong className="text-emerald-700">{existingOffer.price.toLocaleString('tr-TR')} TL</strong>
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setOfferModalReq(req);
                              setOfferPrice(existingOffer.price.toString());
                            }}
                            className="text-xs font-black text-[#F95700] hover:underline cursor-pointer ml-2 shrink-0"
                          >
                            Teklifi Düzenle →
                          </button>
                        </div>
                      );
                    }

                    return (
                      <form
                        onSubmit={(e) => handleQuickOfferSubmit(req, e)}
                        className="flex-1 flex items-center gap-2 border-2 border-slate-200 focus-within:border-[#F95700] rounded-2xl p-1 bg-white transition-all shadow-2xs"
                      >
                        <input
                          type="number"
                          value={quickOfferPrices[req.id] || ''}
                          onChange={e => setQuickOfferPrices({ ...quickOfferPrices, [req.id]: e.target.value })}
                          onFocus={(e) => handleInputInteraction(req.id, e)}
                          onClick={(e) => handleInputInteraction(req.id, e)}
                          placeholder="Hemen teklifinizi yazın (TL)..."
                          className="flex-1 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        />
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          className="font-black text-xs px-6 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
                        >
                          Teklif Ver
                        </Button>
                      </form>
                    );
                  })()}

                  {/* Numarayı Göster Button */}
                  <Button
                    type="button"
                    variant={isPhoneRevealed ? "navy" : "outline"}
                    size="md"
                    className="font-black text-xs px-5 py-2.5 rounded-2xl shrink-0 cursor-pointer"
                    leftIcon={<Phone className="w-3.5 h-3.5" />}
                    onClick={() => handleShowPhone(req)}
                  >
                    {isPhoneRevealed ? req.customerPhone : 'Numarayı Göster'}
                  </Button>
                </div>
              </div>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-16 text-center">
              <Truck className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <h3 className="font-black text-slate-700 text-lg mb-1">Kriterlere uygun talep bulunamadı</h3>
              <p className="text-xs text-slate-400 mb-4">Filtreleri sıfırlayarak tüm açık taşıma taleplerini görebilirsiniz.</p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="font-bold">
                Filtreleri Sıfırla
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── INTENT AUTH MODAL (Gate for Guest / Non-Carrier) ── */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthActionPayload(null);
        }}
        targetRole="CARRIER"
        title="Taleplere Teklif Vermek İçin Nakliyeci Girişi Yapın"
        subtitle="Müşteri taleplerine teklif vermek, telefon numaralarına erişmek ve doğrudan iş almak için onaylı nakliyeci hesabınıza giriş yapın veya 7 gün ücretsiz deneyin."
        onSuccess={() => {
          setAuthModalOpen(false);
          if (authActionPayload?.type === 'PHONE') {
            setRevealedPhones(prev => ({ ...prev, [authActionPayload.reqId]: true }));
          }
        }}
      />

      {/* ── PLAN LIMITATION / UPGRADE MODAL ── */}
      <Modal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title={planModalData?.title || 'Paket Yükseltme'}
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            {planModalData?.subtitle}
          </p>

          {planModalData?.limitBadge && (
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black border border-slate-200">
              {planModalData.limitBadge}
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <Button variant="outline" size="md" className="flex-1 font-bold" onClick={() => setPlanModalOpen(false)}>
              Vazgeç
            </Button>
            <Link href="/app/carrier/abonelik" className="flex-1" onClick={() => setPlanModalOpen(false)}>
              <Button variant="primary" size="md" className="w-full font-black" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Paketleri İncele
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* ── FULL OFFER MODAL ─────────────────────────────────── */}
      <Modal
        isOpen={!!offerModalReq}
        onClose={resetOfferForm}
        title={offerSubmitted ? 'Teklifiniz Gönderildi!' : `Teklif Ver — ${offerModalReq?.requestCode}`}
      >
        {offerModalReq && !offerSubmitted && (
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
              <div className="flex items-center gap-2 text-sm font-black text-[#0A1128]">
                <span>{offerModalReq.originCity}</span>
                <MoveRight className="w-4 h-4 text-[#F95700] shrink-0" />
                <span>{offerModalReq.destinationCity}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {offerModalReq.homeSize} Ev · {offerModalReq.movingDate}
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Teklif Fiyatı (TL) *</label>
              <input
                type="number"
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
                placeholder="24500"
                className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-lg font-black text-[#F95700] focus:border-[#F95700] focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" size="md" className="flex-1 font-bold" onClick={resetOfferForm}>
                İptal
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex-1 font-black"
                disabled={!offerPrice || parseFloat(offerPrice) <= 0}
                onClick={() => {
                  db.addOffer({
                    id: `off_${Date.now()}`,
                    requestId: offerModalReq.id,
                    carrierId: carrier.id,
                    carrier,
                    price: parseFloat(offerPrice),
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
                    updatedAt: new Date().toISOString()
                  });
                  setOfferSubmitted(true);
                }}
              >
                Teklifi Gönder
              </Button>
            </div>
          </div>
        )}

        {offerSubmitted && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-black text-[#0A1128] text-lg">Teklifiniz İletildi!</h3>
            <p className="text-xs text-slate-500 font-medium">Müşteri teklifinizi incelediğinde panelinizden ve SMS ile bilgilendirileceksiniz.</p>
            <Button variant="primary" size="md" className="font-black w-full" onClick={resetOfferForm}>
              Tamam
            </Button>
          </div>
        )}
      </Modal>

      {/* ── FULLSCREEN PHOTO LIGHTBOX ────────────────────────── */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={lightboxPhoto} alt="Büyük Görsel" className="w-full h-full object-contain rounded-2xl" />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
