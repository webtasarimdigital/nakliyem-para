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
  Clock, 
  XCircle,
  Truck,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';
import { RequestStatus } from '@/types';

export default function CustomerRequestsPage() {
  const [tab, setTab] = useState<'ALL' | 'ACTIVE' | 'ASSIGNED' | 'CLOSED'>('ALL');
  const requests = db.getRequests();

  const filteredRequests = requests.filter(r => {
    if (tab === 'ALL') return true;
    return r.status === tab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Taşıma Taleplerim
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Yayınladığınız ve geçmişteki tüm taşınma taleplerinizi buradan yönetin.
          </p>
        </div>

        <Link href="/teklif-al">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Yeni Talep Aç
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto">
        {[
          { id: 'ALL', label: 'Tümü' },
          { id: 'ACTIVE', label: 'Aktif Talepler' },
          { id: 'ASSIGNED', label: 'Anlaşılan / Tamamlanan' },
          { id: 'CLOSED', label: 'Kapatılanlar' }
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

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isEligibleForReview = (req.status === 'ASSIGNED' || req.status === 'CLOSED') && !!req.assignedCarrierId;
            const hasReview = isEligibleForReview ? db.hasReviewForRequest(req.id) : false;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-5 sm:p-6 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                  <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                    <img
                      src={req.photos && req.photos.length > 0 ? req.photos[0] : '/mock-photos/moving_room_1.jpg'}
                      alt="Taşıma Eşyası"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/mock-photos/moving_room_1.jpg';
                      }}
                    />
                    {req.photos && req.photos.length > 0 && (
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        📷 {req.photos.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {req.requestCode}
                      </span>
                      <Badge variant={req.status === 'ACTIVE' ? 'verified' : req.status === 'ASSIGNED' ? 'success' : 'danger'} size="sm">
                        {req.status === 'ACTIVE' ? 'Yayında' : req.status === 'ASSIGNED' ? 'Firma Seçildi' : 'Kapatıldı'}
                      </Badge>

                      {isEligibleForReview && (
                        hasReview ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Değerlendirildi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F95700] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 animate-pulse">
                            <Star className="w-3 h-3 fill-current" />
                            Değerlendirme Bekliyor
                          </span>
                        )
                      )}

                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{req.homeSize} Ev Eşyası</span>
                    </div>

                    <div>
                      <RouteDisplay
                        originCity={req.originCity}
                        originDistrict={req.originDistrict}
                        destinationCity={req.destinationCity}
                        destinationDistrict={req.destinationDistrict}
                        size="md"
                      />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.movingDate}</span>
                      </div>
                      <span>•</span>
                      <span>Çıkış: {req.originFloor}. Kat {req.originHasElevator ? '(Asansörlü)' : '(Merdiven)'}</span>
                    </div>
                  </div>
                </div>

                {/* Action and offers button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <span className="text-xs font-bold text-[#0B3B8F] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {req.offersCount} Teklif Alındı
                  </span>

                  <div className="flex items-center gap-2">
                    {isEligibleForReview && !hasReview && (
                      <Link href={`/app/customer/taleplerim/${req.id}`}>
                        <Button variant="primary" size="sm" className="bg-[#F95700] hover:bg-[#e04f00] font-black" leftIcon={<Star className="w-3.5 h-3.5 fill-current" />}>
                          Yorum Yap
                        </Button>
                      </Link>
                    )}

                    <Link href={`/app/customer/taleplerim/${req.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Talebi İncele
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Bu sekmede henüz talep bulunmuyor</h3>
          <p className="text-xs text-slate-400 mt-1">İstediğiniz an yeni bir taşıma talebi açabilirsiniz.</p>
        </div>
      )}
    </div>
  );
}
