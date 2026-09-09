'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Building, 
  Sofa, 
  Box, 
  Truck, 
  Star, 
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

export default function CustomerRequestsPage() {
  const { user: authUser } = useAuth();
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'ASSIGNED' | 'CLOSED'>('ALL');
  const [currentUser, setCurrentUser] = useState(() => authUser || db.getCurrentUser());
  const [allRequests, setAllRequests] = useState<MovingRequest[]>(() => db.getRequests());

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

  // Mobilde doğrudan talepler alanına yumuşak kaydırma
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 1024;
    const hasHash = window.location.hash.includes('customer-requests-content') || window.location.hash.includes('talepler');

    if (isMobile || hasHash) {
      const timer = setTimeout(() => {
        const el = document.getElementById('customer-requests-content');
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

  const isUserRequest = (r: MovingRequest, u: any) => {
    if (!u) return false;
    if (u.id && (r.customerId === u.id || (r as any).userId === u.id)) return true;
    if (u.uid && (r.customerId === u.uid || (r as any).userId === u.uid)) return true;
    if (u.email && r.customerEmail && r.customerEmail.trim().toLowerCase() === u.email.trim().toLowerCase()) return true;
    if (u.phone && r.customerPhone && r.customerPhone.replace(/\D/g, '').slice(-10) === u.phone.replace(/\D/g, '').slice(-10)) return true;
    if (u.fullName && r.customerName && r.customerName.trim().toLowerCase() === u.fullName.trim().toLowerCase()) return true;
    return false;
  };

  const customerRequests = allRequests.filter(r => isUserRequest(r, currentUser));
  const baseRequests = customerRequests;

  const filteredRequests = baseRequests.filter(r => {
    if (tab === 'ALL') return true;
    return r.status === tab;
  });

  const displayName = currentUser?.fullName || (currentUser as any)?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Değerli Müşterimiz');
  const nameParts = displayName.trim().split(' ');
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.slice(0, 2).toUpperCase();
  const shortName = nameParts.length > 1
    ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
    : displayName;

  const [liveChatOpen, setLiveChatOpen] = useState(false);
  const [chatData, setChatData] = useState({
    carrierName: 'SAYCANLAR NAKLİYAT',
    carrierSlug: 'saycanlar-nakliyat',
    requestId: '#26093',
    price: 25000
  });

  // İş Verildi diyerek talebi kapatma işlemi
  const handleCloseRequestAsGiven = async (reqId: string) => {
    // 1. Optimistic UI update
    setAllRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'CLOSED' as const, closedReason: 'İş Verildi' } : r));

    // 2. Update mock-db
    db.updateRequest(reqId, {
      status: 'CLOSED',
      closedReason: 'İş Verildi'
    });

    // 3. Update Firestore if configured (event dispatch YOK — loadRequests tetiklenirse mock-db'deki eski ACTIVE veri geri gelir)
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await updateFirestoreRequest(reqId, {
          status: 'CLOSED',
          closedReason: 'İş Verildi'
        });
      } catch (err) {
        console.warn('Firestore kapatma hatası:', err);
      }
    }
  };

  // Talebi tekrar yayına alma
  const handleReopenRequest = async (reqId: string) => {
    setAllRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'ACTIVE' as const, closedReason: undefined } : r));
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
        
        {/* ── 3-COLUMN LAYOUT (Image Exact) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. Left Sidebar */}
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="requests" />
          </div>

          {/* 2. Center Content (Full Width beside Sidebar) */}
          <main id="customer-requests-content" className="lg:col-span-9 space-y-5 scroll-mt-20">
            
            {/* Header + Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                  Taleplerim
                </h1>
                <Link href="/teklif-al">
                  <span className="text-xs font-black text-[#F95700] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 inline-flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    Yeni Talep
                  </span>
                </Link>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: 'Tümü' },
                  { id: 'ACTIVE', label: 'Aktif Talepler' },
                  { id: 'ASSIGNED', label: 'Anlaşılanlar' },
                  { id: 'CLOSED', label: 'Kapatılanlar' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={`py-2.5 px-3 text-xs font-black border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                      tab === t.id
                        ? 'border-[#F95700] text-[#F95700]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Feed */}
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((req) => {
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
                            isAnlasildi ? 'bg-emerald-600' : isClosed ? 'bg-slate-500' : isAssigned ? 'bg-slate-700' : 'bg-emerald-600'
                          }`}>
                            {isAnlasildi ? 'Anlaşıldı ✓' : isClosed ? 'Kapatıldı' : isAssigned ? 'İş Verildi' : 'Yayında'}
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
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>İş Verildi (Kapandı)</span>
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
                  <h3 className="text-base font-black text-[#0A1128]">Bu Filtrede Talep Bulunamadı</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto mt-1">
                    Filtreyi değiştirerek diğer taleplerinizi görebilir veya yeni bir nakliye talebi açabilirsiniz.
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
