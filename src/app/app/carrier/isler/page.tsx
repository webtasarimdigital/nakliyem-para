'use client';

import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  AlertCircle,
  MessageSquare
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
  const carrier = db.getCarriers().find(c => c.userId === currentUser?.id || c.id === currentUser?.carrierProfileId) || db.getCarriers()[0];
  const isApproved = carrier?.verificationStatus === 'APPROVED';
  const [requests, setRequests] = useState<MovingRequest[]>(() => db.getRequests());

  useEffect(() => {
    setRequests(db.getRequests());
    const handleReload = () => {
      setRequests(db.getRequests());
    };
    window.addEventListener('storage', handleReload);
    window.addEventListener('request-added', handleReload);
    return () => {
      window.removeEventListener('storage', handleReload);
      window.removeEventListener('request-added', handleReload);
    };
  }, []);

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

  // Customer Profile Modal State
  const [customerModalReq, setCustomerModalReq] = useState<MovingRequest | null>(null);
  const [customerPhoneWarning, setCustomerPhoneWarning] = useState(false);

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

    if (!isApproved) {
      setPlanModalData({
        title: '⚠️ Onaysız Profil — Teklif Verme Kilitli',
        subtitle: 'Henüz firmamız tarafından doğrulanmış profil değilsiniz. Yüklediğiniz kimlik ve vergi levhası belgeleriniz inceleme aşamasındadır (12 saat içinde sonuçlandırılır). Onay verildikten sonra teklif verebilirsiniz.',
        limitBadge: '12 Saat İçinde Sonuçlandırılır'
      });
      setPlanModalOpen(true);
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

        {/* Unverified Warning Banner (Spec requirement) */}
        {isCarrier && !isApproved && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-sm text-amber-900">
                ⚠️ Onaysız Profil — Henüz firmamız tarafından doğrulanmış profil değilsiniz
              </h4>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Yüklediğiniz kimlik ve vergi levhası evraklarınız inceleme aşamasındadır. <strong>12 saat içinde onay &amp; red durumunuz verilecektir.</strong> Talepleri inceleyebilirsiniz; ancak teklif verme ve iletişim haklarınız onay verildikten sonra açılacaktır.
              </p>
              <Link href="/app/carrier/profil" className="inline-block pt-1 text-xs font-black text-[#F95700] hover:underline">
                Belgelerimi Görüntüle / Yeni Evrak Yükle →
              </Link>
            </div>
          </div>
        )}

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
            const photoList = req.photos && req.photos.length > 0 ? req.photos : [
              '/mock-photos/moving_room_1.jpg'
            ];
            const currentPhotoIdx = activePhotoIndices[req.id] || 0;
            const isPhoneRevealed = revealedPhones[req.id];

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700]/40 transition-all p-5 sm:p-7 shadow-xs space-y-4"
              >
                {/* 1. Header (Image 3 exact): Avatar EB + Esra B. Bireysel Üye + #26208 Yeni */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerModalReq(req);
                        setCustomerPhoneWarning(false);
                      }}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 via-orange-400 to-indigo-400 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    >
                      {req.customerName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </button>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerModalReq(req);
                          setCustomerPhoneWarning(false);
                        }}
                        className="font-black text-base text-[#0A1128] hover:text-[#F95700] transition-colors cursor-pointer text-left block"
                      >
                        {req.customerName}
                      </button>
                      <p className="text-xs text-slate-500 font-semibold">Bireysel Üye</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{req.requestCode}</span>
                    <span className="px-3 py-0.5 rounded-full bg-[#FFD200] text-amber-950 text-xs font-black shadow-xs">
                      Yeni
                    </span>
                  </div>
                </div>

                {/* 2. Route & Service Category (Image 3 exact): Muğla → Antalya  🏠 Evden Eve */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-lg sm:text-xl font-black text-[#0A1128]">
                    <span className="text-teal-600 font-black">〰</span>
                    <span>{req.originCity}</span>
                    <span className="text-slate-400 font-light">→</span>
                    <span>{req.destinationCity}</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                    <span>🏠 {req.serviceCategory === 'EVDEN_EVE' ? 'Evden Eve' : req.serviceCategory === 'OFIS_TASIMA' ? 'Ofis Taşıma' : 'Parça Eşya'}</span>
                  </div>

                  {myOffer && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                      ✓ Teklifiniz: {myOffer.price.toLocaleString('tr-TR')} TL
                    </span>
                  )}
                </div>

                {/* 3. Detailed Address Line: 📍 Muğla, Fethiye → Antalya, Konyaaltı */}
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{req.originCity}, {req.originDistrict} → {req.destinationCity}, {req.destinationDistrict}</span>
                </div>

                {/* 4. Moving Date Line: 📅 19 Eylül 2026'da taşınacak */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{req.movingDate}&apos;da taşınacak ({req.isDateFlexible ? '±Esnek' : 'Kesin Tarih'})</span>
                </div>

                {/* 5. Feature Badges Pills (Image 3 exact) */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                    🛋️ {req.homeSize} eşya
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                    ↗️ Çıkış: {req.originFloor === 0 ? 'Zemin. Kat' : `${req.originFloor}. Kat`} · {req.originHasElevator ? 'Asansör' : 'Merdiven'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                    🛗 Varış: {req.destinationFloor === 0 ? 'Zemin. Kat' : `${req.destinationFloor}. Kat`} · {req.destinationHasElevator ? 'Asansör' : 'Merdiven'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                    📦 {req.packagingPreference === 'CARRIER_PACKS' ? 'Firma paketleyecek' : 'Firma veya kendim paketleyeceğim'}
                  </span>
                </div>

                {/* Photos Thumbnail Preview if photo available */}
                {photoList.length > 0 && photoList[0] && (
                  <div className="flex items-center gap-2 pt-1">
                    <div 
                      onClick={() => setLightboxPhoto(photoList[0])}
                      className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group shadow-2xs"
                    >
                      <img src={photoList[0]} alt="Eşya fotoğrafı" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                        <Maximize2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-500 font-bold">📷 Eşya Fotoğrafı (Büyütmek için tıklayın)</span>
                  </div>
                )}

                {/* 6. Notes if present */}
                {req.notes && (
                  <p className="text-xs text-slate-600 font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
                    &ldquo;{req.notes}&rdquo;
                  </p>
                )}

                {/* 7. Action Bar: Quick Offer Input + Yellow Gönder + Numarayı Göster (Image 3 exact) */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  {(() => {
                    const existingOffer = myCarrierOffers.find(o => o.requestId === req.id);

                    if (existingOffer) {
                      return (
                        <div className="flex items-center justify-between p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
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
                        className="flex items-center gap-2"
                      >
                        <input
                          type="number"
                          value={quickOfferPrices[req.id] || ''}
                          onChange={e => setQuickOfferPrices({ ...quickOfferPrices, [req.id]: e.target.value })}
                          onFocus={(e) => handleInputInteraction(req.id, e)}
                          onClick={(e) => handleInputInteraction(req.id, e)}
                          placeholder="Hemen teklifinizi yazın (TL)..."
                          className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:border-[#F95700] focus:outline-none bg-white shadow-2xs"
                        />
                        <button
                          type="submit"
                          className="bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs sm:text-sm px-6 sm:px-8 py-2.5 rounded-xl shadow-md shadow-orange-950/20 shrink-0 cursor-pointer transition-all"
                        >
                          Gönder
                        </button>
                      </form>
                    );
                  })()}

                  {/* Numarayı Göster Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleShowPhone(req)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isPhoneRevealed ? req.customerPhone : 'Numarayı Göster'}</span>
                    </button>
                  </div>
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
      {/* ── MÜŞTERİ PROFİLİ MODALI (Paket Korumalı Telefon & Mesaj) ── */}
      {customerModalReq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0A1128]">Müşteri Profili</h3>
              <button
                onClick={() => { setCustomerModalReq(null); setCustomerPhoneWarning(false); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#0A1128] text-white font-black text-lg flex items-center justify-center shadow-md">
                {customerModalReq.customerName[0]}
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">{customerModalReq.customerName}</h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                  ✓ Doğrulanmış Cep Telefonu
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Konum</span>
                <span className="font-black text-slate-800">{customerModalReq.originCity} / {customerModalReq.originDistrict}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Taşınma Sayısı</span>
                <span className="font-black text-slate-800">2 Başarılı Taşıma</span>
              </div>
            </div>

            {/* Telefon Alanı: Paket Kontrolü */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">İletişim Numarası</span>
                {canViewPhone ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Paketiniz Yetkili
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    🔒 Başlangıç Paketi Koruması
                  </span>
                )}
              </div>

              {canViewPhone ? (
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-base text-slate-900 tracking-wider">
                    {customerModalReq.customerPhone}
                  </span>
                  <a href={`tel:${customerModalReq.customerPhone}`}>
                    <button className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hemen Ara</span>
                    </button>
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-sm text-slate-400 tracking-wider">
                    {customerModalReq.customerPhone.slice(0, 4)} *** ** {customerModalReq.customerPhone.slice(-2)}
                  </span>
                  <button
                    onClick={() => setCustomerPhoneWarning(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs inline-flex items-center gap-1 shadow-sm cursor-pointer transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Numarayı Gör</span>
                  </button>
                </div>
              )}
            </div>

            {/* Düşük Paket Uyarısı */}
            {customerPhoneWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 font-black text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Numara Başlangıç Paketinde Gizlidir</span>
                </div>
                <p className="leading-relaxed">
                  Müşteriyle platform içi güvenli mesajlaşma üzerinden hemen ücretsiz yazışabilirsiniz. Numarayı doğrudan görmek için Pro veya Gold pakete geçebilirsiniz.
                </p>
                <Link href="/app/carrier/abonelik">
                  <button className="w-full mt-1 py-2 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs transition-colors cursor-pointer">
                    Paketleri İncele &amp; Yükselt →
                  </button>
                </Link>
              </div>
            )}

            {/* Mesaj Gönder Butonu */}
            <div className="pt-2">
              <Link href={`/app/carrier/mesajlar?recipient=${customerModalReq.customerId}&reqId=${customerModalReq.id}`}>
                <button className="w-full py-3 px-4 rounded-xl bg-[#0A1128] hover:bg-[#132247] text-white font-black text-xs inline-flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors">
                  <MessageSquare className="w-4 h-4 text-[#F95700]" />
                  <span>Müşteriye Güvenli Mesaj Gönder</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
