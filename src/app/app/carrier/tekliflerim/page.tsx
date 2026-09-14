'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Calendar, 
  RotateCcw,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';
import { Offer, OfferStatus, CarrierProfile } from '@/types';
import { ArrowLeft } from 'lucide-react';

export default function CarrierOffersTrackerPage() {
  const [carrier, setCarrier] = useState<CarrierProfile | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  React.useEffect(() => {
    const currentUser = db.getCurrentUser();
    let activeCarrier = db.getCurrentCarrier();
    if (!activeCarrier && currentUser) {
      activeCarrier = db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) || null;
    }
    setCarrier(activeCarrier);

    const loadOffers = () => {
      if (!activeCarrier) return;
      let localAcceptedMap: Record<string, any> = {};
      try {
        const raw = localStorage.getItem('tasinteklif_accepted_offers');
        if (raw) localAcceptedMap = JSON.parse(raw);
      } catch {}

      const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
      const isOfferAccepted = (o: Offer) => {
        if (o.status === 'ACCEPTED') return true;

        const req = db.getRequestById(o.requestId);
        const cleanReqId = (o.requestId || req?.requestCode || req?.id || '').replace(/[^0-9]/g, '');
        const myCompanyName = (activeCarrier?.companyName || '').trim().toLowerCase();

        // 1. Check request assignment in mock-db
        if (req && (req.status === 'ASSIGNED' || (req.status === 'CLOSED' && req.closedReason === 'İş Verildi'))) {
          if (req.assignedCarrierId === activeCarrier?.id || 
              req.assignedCarrierId === activeCarrier?.userId || 
              req.assignedOfferId === o.id) {
            return true;
          }
          const assignedName = ((req as any).assignedCarrierName || '').trim().toLowerCase();
          if (myCompanyName && assignedName && (myCompanyName === assignedName || myCompanyName.includes(assignedName) || assignedName.includes(myCompanyName))) {
            return true;
          }
          if (!req.assignedCarrierId && req.assignedOfferId === o.id) {
            return true;
          }
        }

        // 2. Check localStorage accepted offers
        const acc = localAcceptedMap[o.requestId] 
          || (cleanReqId && Object.entries(localAcceptedMap).find(([k]) => k.replace(/[^0-9]/g, '') === cleanReqId)?.[1])
          || (req?.id && localAcceptedMap[req.id])
          || (req?.requestCode && localAcceptedMap[req.requestCode]);

        if (acc) {
          if (acc.id === o.id || acc.assignedOfferId === o.id) return true;
          if (acc.carrierId === activeCarrier?.id || acc.carrierId === activeCarrier?.userId) return true;
          const accCompanyName = (acc.carrier?.companyName || acc.carrierName || '').trim().toLowerCase();
          if (myCompanyName && accCompanyName && (myCompanyName === accCompanyName || myCompanyName.includes(accCompanyName) || accCompanyName.includes(myCompanyName))) {
            return true;
          }
          if (acc.price && Number(acc.price) === Number(o.price)) {
            return true;
          }
        }

        // 3. Check localStorage closed requests
        try {
          const rawClosed = typeof window !== 'undefined' ? localStorage.getItem('tasinteklif_closed_requests') : null;
          if (rawClosed) {
            const closedMap = JSON.parse(rawClosed);
            const closedInfo = closedMap[o.requestId]
              || (cleanReqId && Object.entries(closedMap).find(([k]) => k.replace(/[^0-9]/g, '') === cleanReqId)?.[1])
              || (req?.id && closedMap[req.id])
              || (req?.requestCode && closedMap[req.requestCode]);
            if (closedInfo && (closedInfo.status === 'ASSIGNED' || closedInfo.closedReason === 'İş Verildi')) {
              if (closedInfo.assignedCarrierId === activeCarrier?.id || closedInfo.assignedCarrierId === activeCarrier?.userId || closedInfo.assignedOfferId === o.id) {
                return true;
              }
              const closedCarrierName = (closedInfo.assignedCarrierName || '').trim().toLowerCase();
              if (myCompanyName && closedCarrierName && (myCompanyName === closedCarrierName || myCompanyName.includes(closedCarrierName) || closedCarrierName.includes(myCompanyName))) {
                return true;
              }
            }
          }
        } catch {}

        return false;
      };

      const rawOffers = db.getOffersForCarrier(activeCarrier.id);
      const map = new Map<string, Offer>();
      rawOffers.forEach(o => {
        const key = o.requestId || o.id;
        const existing = map.get(key);
        let effStatus = o.status;
        if (isOfferAccepted(o)) {
          effStatus = 'ACCEPTED';
        } else if (effStatus === 'PENDING' && o.createdAt) {
          const createdTime = new Date(o.createdAt).getTime();
          if (createdTime > 0 && (Date.now() - createdTime > THREE_DAYS_MS)) {
            effStatus = 'REJECTED';
          }
        }
        const processedOffer = { ...o, status: effStatus };

        if (!existing || new Date(o.createdAt || 0).getTime() >= new Date(existing.createdAt || 0).getTime()) {
          map.set(key, processedOffer);
        }
      });
      setOffers(Array.from(map.values()));
    };

    loadOffers();

    // Background sync with server API
    if (activeCarrier?.id) {
      fetch('/api/offers')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.offers)) {
            data.offers.forEach((ao: any) => {
              db.updateOffer(ao.id, ao);
            });
            loadOffers();
          }
        })
        .catch(() => {});
    }

    const handleEvt = () => loadOffers();
    window.addEventListener('storage', handleEvt);
    window.addEventListener('offer-added', handleEvt);
    window.addEventListener('offer-updated', handleEvt);
    return () => {
      window.removeEventListener('storage', handleEvt);
      window.removeEventListener('offer-added', handleEvt);
      window.removeEventListener('offer-updated', handleEvt);
    };
  }, []);

  const handleWithdraw = (offerId: string) => {
    if (confirm('Bu teklifi geri çekmek istediğinize emin misiniz?')) {
      db.withdrawOffer(offerId);
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'WITHDRAWN' as const } : o));
    }
  };

  const requests = db.getRequests();

  const [tab, setTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const filteredOffers = offers.filter(o => {
    if (tab === 'ALL') return o.status !== 'WITHDRAWN';
    if (tab === 'PENDING') return o.status === 'PENDING';
    if (tab === 'ACCEPTED') return o.status === 'ACCEPTED';
    if (tab === 'REJECTED') return o.status === 'REJECTED' || o.status === 'WITHDRAWN';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back to Operation Center */}
      <div className="mb-6">
        <Link
          href="/app/carrier"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#F95700] bg-white hover:bg-orange-50/50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#F95700]" />
          <span>← Teklif Durumları&apos;na Dön</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            Verdiğim Teklifler
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Müşterilere ilettiğiniz tüm tekliflerin durumlarını buradan izleyin.
          </p>
        </div>

        <Link href="/app/carrier/isler">
          <Button variant="primary" size="sm">
            Yeni İş Bul & Teklif Ver
          </Button>
        </Link>
      </div>

      {/* Tabs (Spec Item 93) */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto">
        {[
          { id: 'ALL', label: 'Tüm Teklifler' },
          { id: 'PENDING', label: 'Bekleyenler' },
          { id: 'ACCEPTED', label: 'Kazanılan İşler 🎉' },
          { id: 'REJECTED', label: 'Sonuçlananlar' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'border-[#146EF5] text-[#146EF5]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Offers List */}
      {filteredOffers.length > 0 ? (
        <div className="space-y-4">
          {filteredOffers.map((off) => {
            const req = requests.find(r => r.id === off.requestId);
            return (
              <div
                key={off.id}
                className={`bg-white rounded-2xl border-2 transition-all p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  off.status === 'ACCEPTED' ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {req?.requestCode || '#26093'}
                    </span>
                    <Badge
                      variant={off.status === 'ACCEPTED' ? 'success' : off.status === 'PENDING' ? 'pending' : off.status === 'WITHDRAWN' ? 'neutral' : 'danger'}
                      size="sm"
                    >
                      {off.status === 'ACCEPTED' ? '✓ Onaylandı (İş Size Verildi 🎉)' : off.status === 'PENDING' ? '⏳ Müşteri İncelemesinde' : off.status === 'WITHDRAWN' ? 'Geri Çekildi' : 'Süresi Doldu / Reddedildi'}
                    </Badge>
                  </div>

                  {req && (
                    <RouteDisplay
                      originCity={req.originCity}
                      originDistrict={req.originDistrict}
                      destinationCity={req.destinationCity}
                      destinationDistrict={req.destinationDistrict}
                      size="md"
                    />
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span>Teslimat: {off.estimatedDeliveryDuration}</span>
                    <span>•</span>
                    <span>{off.isPackagingIncluded ? 'Paketleme Dahil' : 'Paketlemesiz'}</span>
                    <span>•</span>
                    <span>Geçerlilik: {off.validUntil}</span>
                  </div>
                </div>

                {/* Right Price & Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Teklifiniz</span>
                    <span className="text-xl sm:text-2xl font-black text-[#0A1128]">
                      {off.price.toLocaleString('tr-TR')} TL
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {off.status === 'PENDING' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleWithdraw(off.id)}
                        className="h-9 min-h-[36px] text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 shadow-2xs"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5 text-rose-500" />}
                      >
                        Geri Çek
                      </Button>
                    )}
                    <Link href={`/app/carrier/mesajlar`}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 min-h-[36px] text-xs font-bold border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs"
                        leftIcon={<MessageSquare className="w-3.5 h-3.5 text-slate-500" />}
                      >
                        Mesaj
                      </Button>
                    </Link>
                    {req && (
                      <Link href={`/app/carrier/isler/${req.id}`}>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="h-9 min-h-[36px] text-xs font-black shadow-sm"
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          İşi Gör
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#0A1128]">Bu sekmede kayıtlı teklifiniz bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Açık işlere teklif vererek yeni taşımalar kazanabilirsiniz.</p>
          <Link href="/app/carrier/isler">
            <Button variant="primary" size="sm">Açık İşleri Gör</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
