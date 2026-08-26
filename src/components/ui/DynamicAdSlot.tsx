'use client';

import React from 'react';
import { AdSlotPlacement, CarrierProfile } from '@/types';
import { getFeaturedCarriersForSlot } from '@/lib/services/ad-rotation';
import { Badge } from './Badge';
import { Star, MapPin, Truck, Phone, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface DynamicAdSlotProps {
  slotKey: AdSlotPlacement;
  filter?: { city?: string; service?: string };
  title?: string;
  subtitle?: string;
  className?: string;
}

export const DynamicAdSlot: React.FC<DynamicAdSlotProps> = ({
  slotKey,
  filter,
  title = 'Öne Çıkan Nakliyat Firmaları',
  subtitle = 'Platform tarafından onaylanmış ve yüksek müşteri memnuniyetine sahip seçkin taşıma firmaları.',
  className = ''
}) => {
  const carriers = getFeaturedCarriersForSlot(slotKey, filter);

  if (carriers.length === 0) return null;

  return (
    <section className={`w-full py-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Sponsorlu & Onaylı Firmalar
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>
        </div>
        <Link
          href="/nakliyat-firmalari"
          className="text-xs font-semibold text-[#146EF5] hover:text-[#0B3B8F] inline-flex items-center gap-1 shrink-0"
        >
          Tüm Firmaları Gör <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carriers.map((carrier) => (
          <div
            key={carrier.id}
            className="relative bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-[#146EF5] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* Header with logo & badges */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="w-13 h-13 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                  {carrier.logoUrl ? (
                    <img
                      src={carrier.logoUrl}
                      alt={carrier.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Truck className="w-6 h-6 text-[#146EF5]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                      href={`/firma/${carrier.slug}`}
                      className="font-bold text-sm sm:text-base text-slate-900 hover:text-[#146EF5] truncate block"
                    >
                      {carrier.companyName}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{carrier.rating > 0 ? carrier.rating.toFixed(1) : 'Yeni'}</span>
                      <span className="text-slate-400 font-normal">({carrier.reviewCount})</span>
                    </div>

                    <span className="text-slate-300">•</span>

                    <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {carrier.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                {carrier.verificationStatus === 'APPROVED' && <Badge variant="verified" size="sm" />}
                {carrier.elevatorSpec?.hasElevator && <Badge variant="elevator" size="sm" />}
              </div>

              {/* Short Bio */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                {carrier.shortBio}
              </p>
            </div>

            {/* Footer action bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-500 font-medium">
                {carrier.completedJobsCount} Başarılı Taşıma
              </span>

              <div className="flex items-center gap-1.5">
                <Link
                  href={`/teklif-al?preferredCarrier=${carrier.id}`}
                  className="px-3 py-1.5 rounded-lg bg-[#146EF5] text-white text-xs font-semibold hover:bg-[#0F5BD0] transition-colors"
                >
                  Teklif İste
                </Link>
                <Link
                  href={`/firma/${carrier.slug}`}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  İncele
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
