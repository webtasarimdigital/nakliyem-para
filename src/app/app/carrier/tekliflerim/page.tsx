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
import { OfferStatus } from '@/types';

export default function CarrierOffersTrackerPage() {
  const carrier = db.getCarriers()[0];
  const offers = db.getOffersForCarrier(carrier.id);
  const requests = db.getRequests();

  const [tab, setTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const filteredOffers = offers.filter(o => {
    if (tab === 'ALL') return true;
    return o.status === tab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
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
                      variant={off.status === 'ACCEPTED' ? 'success' : off.status === 'PENDING' ? 'pending' : 'neutral'}
                      size="sm"
                    >
                      {off.status === 'ACCEPTED' ? 'İş Kazanıldı 🎉' : off.status === 'PENDING' ? 'Müşteri İncelemesinde' : 'Kapandı'}
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
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {off.price.toLocaleString('tr-TR')} TL
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/app/carrier/mesajlar`}>
                      <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                        Mesaj
                      </Button>
                    </Link>
                    {req && (
                      <Link href={`/app/carrier/isler/${req.id}`}>
                        <Button variant="primary" size="sm">
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
          <h3 className="text-sm font-bold text-slate-700">Bu sekmede kayıtlı teklifiniz bulunmuyor</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Açık işlere teklif vererek yeni taşımalar kazanabilirsiniz.</p>
          <Link href="/app/carrier/isler">
            <Button variant="primary" size="sm">Açık İşleri Gör</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
