'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Truck,
  Box,
  CheckCircle2,
  Building,
  Sofa,
  Clock,
  Sparkles,
  PlusCircle,
  Package,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { LiveOfferChatModal } from '@/components/ui/LiveOfferChatModal';
import { db } from '@/lib/data/mock-db';
import { useAuth } from '@/context/AuthContext';
import { MovingRequest } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { updateFirestoreRequest } from '@/lib/firebase/firestore';

export default function CustomerDashboard() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(() => authUser || db.getCurrentUser());
  const [allRequests, setAllRequests] = useState<MovingRequest[]>(() => db.getRequests());
  const offers = db.getOffers();

  const loadRequests = async () => {
    let localReqs = db.getRequests();
    let firestoreReqs: MovingRequest[] = [];

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const snapshot = await getDocs(collection(firestoreDb, 'requests'));
        firestoreReqs = snapshot.docs.map(doc => ({
          ...(doc.data() as MovingRequest),
          id: doc.id
        }));
      } catch (err) {
        console.warn('Firestore talepleri çekilemedi:', err);
      }
    }

    const combined = [...firestoreReqs];
    localReqs.forEach(lr => {
      if (!combined.some(r => r.id === lr.id)) {
        combined.push(lr);
      }
    });

    setAllRequests(combined);
  };

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  useEffect(() => {
    loadRequests();

    // Talepleri sadece gerçekten yeni talep/teklif eklenince yenile
    const handleRequestReload = () => { loadRequests(); };

    // Storage event yalnızca kullanıcı bilgisini günceller — loadRequests ÇAĞIRMAZ
    // (AuthContext'te storage event fırlatılıyor; bu olmadan kapanan talepler geri geliyordu)
    const handleStorageAuthOnly = () => {
      setCurrentUser(authUser || db.getCurrentUser());
    };

    // Auth değişiminde kullanıcıyı güncelle
    const handleAuthChange = () => {
      setCurrentUser(authUser || db.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageAuthOnly);
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('request-added', handleRequestReload);
    window.addEventListener('offer-added', handleRequestReload);
    return () => {
      window.removeEventListener('storage', handleStorageAuthOnly);
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('request-added', handleRequestReload);
      window.removeEventListener('offer-added', handleRequestReload);
    };
  }, [authUser]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasHash = window.location.hash.includes('customer-dashboard-content');
    if (hasHash) {
      const timer = setTimeout(() => {
        const el = document.getElementById('customer-dashboard-content');
        if (el) {
          const navOffset = 75;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  // User display info
  const displayName = currentUser?.fullName || (currentUser as any)?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Değerli Müşterimiz');
  const nameParts = displayName.trim().split(' ');
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  const shortName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
    : displayName;

  const isUserRequest = (r: MovingRequest, u: any) => {
    if (!u) return false;
    if (u.id && (r.customerId === u.id || (r as any).userId === u.id)) return true;
    if (u.uid && (r.customerId === u.uid || (r as any).userId === u.uid)) return true;
    if (u.email && r.customerEmail && r.customerEmail.trim().toLowerCase() === u.email.trim().toLowerCase()) return true;
    if (u.phone && r.customerPhone && r.customerPhone.replace(/\D/g, '').slice(-10) === u.phone.replace(/\D/g, '').slice(-10)) return true;
    if (u.fullName && r.customerName && r.customerName.trim().toLowerCase() === u.fullName.trim().toLowerCase()) return true;
    return false;
  };

  // Filter requests belonging to this customer
  const customerRequests = allRequests.filter(r => isUserRequest(r, currentUser));
  const displayRequests = customerRequests;
  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatData, setChatData] = useState({
    carrierName: 'SAYCANLAR NAKLİYAT',
    carrierSlug: 'saycanlar-nakliyat',
    requestId: '#26093',
    price: 25000
  });

  // İş Verildi diyerek talebi Anlaşıldı olarak işaretleme işlemi
  const handleCloseRequestAsGiven = async (reqId: string) => {
    // Önce local state'i güncelle (UI anında tepki versin)
    setAllRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'ASSIGNED' as const, closedReason: 'İş Verildi' } : r));
    // mock-db'yi güncelle
    db.updateRequest(reqId, {
      status: 'ASSIGNED',
      closedReason: 'İş Verildi'
    });
    // Firestore'a yaz (event dispatch YOK — loadRequests tetiklenirse mock-db'deki eski ACTIVE veri geri gelir)
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await updateFirestoreRequest(reqId, {
          status: 'ASSIGNED',
          closedReason: 'İş Verildi'
        });
      } catch (err) {
        console.warn('Firestore kapatma hatası:', err);
      }
    }
  };

  // Talebi tekrar yayına alma
  const handleReopenRequest = async (reqId: string) => {
    // Önce local state'i güncelle
    setAllRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'ACTIVE' as const, closedReason: undefined } : r));
    // mock-db'yi güncelle
    db.updateRequest(reqId, {
      status: 'ACTIVE',
      closedReason: undefined
    });
    // Firestore'a yaz (event dispatch YOK)
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await updateFirestoreRequest(reqId, {
          status: 'ACTIVE',
          closedReason: undefined
        });
      } catch (err) {
        console.warn('Firestore açma hatası:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ── 3-COLUMN LAYOUT (Image Exact: Left Sidebar + Center Feed + Right Widgets) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. LEFT SIDEBAR (Col 3/12) */}
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="home" />
          </div>

          {/* 2. CENTER CONTENT: TALEPLERİM (Col 6/12) */}
          <main id="customer-dashboard-content" className="lg:col-span-6 space-y-5 scroll-mt-20">
            
            {/* Page Title */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                Taleplerim
              </h1>
              <Link href="/teklif-al" className="sm:hidden">
                <span className="text-xs font-black text-[#F95700] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 inline-flex items-center gap-1">
                  <PlusCircle className="w-3.5 h-3.5" />
                  Yeni Talep
                </span>
              </Link>
            </div>

            {/* Request Cards (Image Exact: Top avatar, route, address, date, feature pills, bottom action buttons) */}
            {displayRequests.length > 0 ? (
              <div className="space-y-4">
                {displayRequests.map((req) => {
                  const reqOffers = db.getOffersForRequest(req.id);
                  const offerCount = reqOffers.length;
                  const isClosed = req.status === 'CLOSED';
                  const isAssigned = req.status === 'ASSIGNED';
                  const isDone = isClosed || isAssigned;
                  const isAnlasildi = isClosed && req.closedReason === 'İş Verildi';

                  return (
                    <div
                      key={req.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all"
                    >
                      {/* Top Row: User Avatar + Name + Code + Status */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#B23B72] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                            {initials}
                          </div>
                          <div>
                            <h3 className="font-black text-sm text-[#0A1128] leading-tight">
                              {shortName}
                            </h3>
                            <span className="text-[11px] text-slate-400 font-bold block">
                              Bireysel Üye
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 tracking-wider">
                            {req.requestCode || '#26093'}
                          </span>
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-md text-white shadow-2xs ${
                            (isAssigned || isAnlasildi) ? 'bg-emerald-600' : isClosed ? 'bg-slate-500' : 'bg-emerald-600'
                          }`}>
                            {(isAssigned || isAnlasildi) ? 'Anlaşıldı ✓' : isClosed ? 'Kapatıldı' : 'Yayında'}
                          </span>
                        </div>
                      </div>

                      {/* Route Row: Squiggle + Cities + Category Badge */}
                      <div className="flex items-center gap-3 flex-wrap pt-1">
                        <div className="flex items-center gap-2 text-rose-500 font-black text-sm">
                          <span className="text-base">〰</span>
                          <span className="text-[#0A1128] font-black text-base">
                            {req.originCity} <span className="text-rose-500 font-bold">→</span> {req.destinationCity}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-[#0A1128] bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
                          <span>🏠</span>
                          <span>Evden Eve</span>
                        </span>
                      </div>

                      {/* Location: Exact districts */}
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {req.originCity}, {req.originDistrict} — {req.destinationCity}, {req.destinationDistrict}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.movingDate} taşınacak</span>
                      </div>

                      {/* Property Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                          <Sofa className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.homeSize} eşya</span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            Çıkış: {req.originFloor === 0 ? 'Zemin Kat' : `${req.originFloor}. Kat`} · {req.originHasElevator ? 'Asansör' : 'Merdiven'}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            Varış: {req.destinationFloor === 0 ? 'Zemin Kat' : `${req.destinationFloor}. Kat`} · {req.destinationHasElevator ? 'Asansör' : 'Merdiven'}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 shadow-2xs">
                          <Box className="w-3.5 h-3.5 text-slate-500" />
                          <span>
                            {req.packagingPreference === 'CARRIER_PACKS' ? 'Firma paketleyecek' : 'Özel paketleme'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                        {isDone ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{(isAssigned || isAnlasildi) ? 'Anlaşıldı ✓' : 'Kapatıldı'}</span>
                            </span>

                            <button
                              type="button"
                              onClick={() => handleReopenRequest(req.id)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                              <span>Talebi Tekrar Aç</span>
                            </button>

                            <Link
                              href={`/app/customer/taleplerim/${req.id}`}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-all"
                            >
                              <span>Detaylar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </>
                        ) : (
                          <>
                            {offerCount > 0 ? (
                              <Link
                                href={`/app/customer/teklifler?reqId=${req.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-black hover:bg-emerald-100 transition-colors shadow-2xs"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{offerCount} Teklif var</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <Link
                                href={`/app/customer/teklifler?reqId=${req.id}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 text-[#F95700] text-xs font-black hover:bg-orange-100 transition-colors shadow-2xs"
                              >
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span>Teklif Bekleniyor</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setChatData({
                                  carrierName: 'SAYCANLAR NAKLİYAT',
                                  carrierSlug: 'saycanlar-nakliyat',
                                  requestId: req.requestCode || '#26093',
                                  price: 25000
                                });
                                setLiveChatOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-[#F95700] text-xs font-black transition-colors shadow-2xs cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Teklif Mesajı (1 Yeni)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCloseRequestAsGiven(req.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
                              title="Talebi kapat ve iş verildi olarak işaretle"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>İş Verildi</span>
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto shadow-xs">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0A1128]">Henüz Taşıma Talebiniz Yok</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mt-1">
                    Ev veya ofis eşyanızı taşımak için dakikalar içinde ücretsiz talep oluşturun, onaylı nakliyecilerden fiyat teklifleri alın.
                  </p>
                </div>
                <Link href="/teklif-al" className="inline-block">
                  <button className="px-6 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs shadow-md transition-all">
                    Yeni Talep Oluştur →
                  </button>
                </Link>
              </div>
            )}

          </main>

          {/* 3. RIGHT SIDEBAR WIDGETS (Col 3/12 - Image Exact) */}
          <aside className="lg:col-span-3 space-y-4">
            
            {/* Top Card: Teklif Al Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-black text-[#0A1128] tracking-tight">
                  Teklif Al
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                  Ücretsiz talep oluştur, onaylı nakliyecilerden hızla fiyat teklifi al.
                </p>
              </div>

              <Link href="/teklif-al" className="block">
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#FFD200] hover:bg-[#F5C400] text-[#0A1128] font-black text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Teklif Al</span>
                </button>
              </Link>
            </div>

            {/* Category Stats Mini-Cards (Image Exact) */}
            <div className="space-y-2">
              
              {/* 1. Evden Eve Nakliyat */}
              <Link
                href="/teklif-al"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:border-[#F95700]/40 transition-all flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-amber-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  🏠
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1128] leading-tight">
                    Evden Eve Nakliyat
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    4792 taşınma talebi
                  </span>
                </div>
              </Link>

              {/* 2. Ekspres Parça */}
              <Link
                href="/teklif-al"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:border-[#F95700]/40 transition-all flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  ⚡
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1128] leading-tight">
                    Ekspres Parça
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    521 taşınma talebi
                  </span>
                </div>
              </Link>

              {/* 3. Depolama */}
              <Link
                href="/teklif-al"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:border-[#F95700]/40 transition-all flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  📦
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1128] leading-tight">
                    Depolama
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    232 taşınma talebi
                  </span>
                </div>
              </Link>

              {/* 4. Ofis Taşıma */}
              <Link
                href="/teklif-al"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:border-[#F95700]/40 transition-all flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  🏢
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1128] leading-tight">
                    Ofis Taşıma
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    229 taşınma talebi
                  </span>
                </div>
              </Link>

              {/* 5. Defter */}
              <Link
                href="/nakliyeci-defteri"
                className="bg-white rounded-2xl border border-slate-200/90 p-3.5 hover:border-[#F95700]/40 transition-all flex items-center gap-3 shadow-2xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  📖
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0A1128] leading-tight">
                    Defter
                  </h4>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">
                    30000+ iş paylaşımı
                  </span>
                </div>
              </Link>

            </div>

          </aside>
        </div>

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
  );
}
