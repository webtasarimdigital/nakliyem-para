'use client';

import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { CustomerSidebar } from '@/components/layout/CustomerSidebar';
import { LiveOfferChatModal } from '@/components/ui/LiveOfferChatModal';
import { db } from '@/lib/data/mock-db';

export default function CustomerRequestsPage() {
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'ASSIGNED' | 'CLOSED'>('ALL');
  const currentUser = db.getCurrentUser();
  const allRequests = db.getRequests();

  const customerRequests = allRequests.filter(
    r => r.customerId === currentUser?.id || r.id === 'req_26093'
  );
  const baseRequests = customerRequests.length > 0 ? customerRequests : allRequests.slice(0, 3);

  const filteredRequests = baseRequests.filter(r => {
    if (tab === 'ALL') return true;
    return r.status === tab;
  });

  const displayName = currentUser?.fullName || (currentUser as any)?.name || 'Hakan Yavaş';
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ── 3-COLUMN LAYOUT (Image Exact) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 1. Left Sidebar */}
          <div className="lg:col-span-3">
            <CustomerSidebar activeTab="requests" />
          </div>

          {/* 2. Center Content */}
          <main className="lg:col-span-6 space-y-5">
            
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
                  const offerCount = reqOffers.length > 0 ? reqOffers.length : 2;
                  const isAssigned = req.status === 'ASSIGNED' || req.id === 'req_26093';

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
                            isAssigned ? 'bg-slate-700' : 'bg-emerald-600'
                          }`}>
                            {isAssigned ? 'Verildi' : 'Yayında'}
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

                      {/* Bottom Action Row (Image Exact: Green 'Teklif var' + Gray 'İş Verildi' + Chat Button) */}
                      <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                        <Link
                          href="/app/customer/teklifler"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-black hover:bg-emerald-100 transition-colors shadow-2xs"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{offerCount} Teklif var</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

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

                        <Link
                          href={`/app/customer/taleplerim/${req.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>İş Verildi</span>
                        </Link>
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

          {/* 3. Right Sidebar Widgets */}
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
