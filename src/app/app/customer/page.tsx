'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  ArrowRight, 
  Clock, 
  MessageSquare, 
  CheckSquare, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';

export default function CustomerDashboard() {
  const requests = db.getRequests();
  const activeRequest = requests.find(r => r.status === 'ACTIVE') || requests[0];
  const offers = activeRequest ? db.getOffersForRequest(activeRequest.id) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Merhaba, Hoş Geldiniz 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Taşınma taleplerinizi ve nakliyat firmalarından gelen teklifleri buradan takip edebilirsiniz.
          </p>
        </div>

        <Link href="/teklif-al">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Yeni Taşıma Talebi Oluştur
          </Button>
        </Link>
      </div>

      {/* ACTIVE REQUEST HIGHLIGHT CARD (Spec Item 54) */}
      {activeRequest ? (
        <div className="bg-white rounded-2xl border-2 border-blue-200/80 shadow-md shadow-blue-900/5 p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#146EF5] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  Aktif Taşıma Talebiniz ({activeRequest.requestCode})
                </span>
                <Badge variant={activeRequest.status === 'ACTIVE' ? 'verified' : 'neutral'} size="sm">
                  {activeRequest.status === 'ACTIVE' ? 'Yayında & Teklif Alıyor' : activeRequest.status}
                </Badge>
              </div>

              <div>
                <RouteDisplay
                  originCity={activeRequest.originCity}
                  originDistrict={activeRequest.originDistrict}
                  destinationCity={activeRequest.destinationCity}
                  destinationDistrict={activeRequest.destinationDistrict}
                  size="lg"
                />
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{activeRequest.movingDate}</span>
                </div>
                <span>•</span>
                <span>{activeRequest.homeSize} Ev</span>
                <span>•</span>
                <span>{activeRequest.packagingPreference === 'CARRIER_PACKS' ? 'Paketlemeli' : 'Teklif Bekleniyor'}</span>
              </div>
            </div>

            {/* Offer count & CTA Box */}
            <div className="p-5 rounded-xl bg-[#EAF3FF] border border-blue-100 flex flex-col items-center justify-center text-center min-w-[200px] shrink-0">
              <span className="text-3xl font-black text-[#0B3B8F] mb-0.5">
                {offers.length}
              </span>
              <span className="text-xs font-semibold text-slate-600 mb-3">
                Gelen Teklif
              </span>

              <Link href={`/app/customer/teklifler`} className="w-full">
                <Button variant="primary" size="sm" className="w-full">
                  Teklifleri İncele
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State (Spec Item 55) */
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-[#146EF5] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Henüz taşıma talebiniz yok</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Taşınma bilgilerinizi 2 dakikada paylaşın, onaylı nakliyat firmalarından anında ücretsiz teklifler alın.
          </p>
          <Link href="/teklif-al">
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              İlk Talebimi Oluştur
            </Button>
          </Link>
        </div>
      )}

      {/* Grid of Quick Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Summary Card 1 */}
        <Link
          href="/app/customer/taleplerim"
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#146EF5] transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-lg bg-blue-50 text-[#146EF5] group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#146EF5]">Tüm Taleplerim</h3>
            <p className="text-xs text-slate-500 mt-0.5">Geçmiş ve aktif taşınma taleplerinizi yönetin.</p>
          </div>
        </Link>

        {/* Quick Summary Card 2 */}
        <Link
          href="/app/customer/teklifler"
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#146EF5] transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#146EF5]">Teklif Karşılaştır</h3>
            <p className="text-xs text-slate-500 mt-0.5">Firmaları fiyat ve puanlarına göre sıralayın.</p>
          </div>
        </Link>

        {/* Quick Summary Card 3 */}
        <Link
          href="/app/customer/mesajlar"
          className="p-5 bg-white rounded-xl border border-slate-200 hover:border-[#146EF5] transition-all group flex items-start gap-4"
        >
          <div className="p-3 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#146EF5]">Mesajlar</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teklif veren nakliyeciler ile canlı görüşün.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
