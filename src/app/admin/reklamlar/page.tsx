'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  ArrowLeft, 
  Plus, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Award,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function AdminAdsManagerPage() {
  const slots = db.getAdSlots();
  const campaigns = db.getAdCampaigns();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Dinamik Reklam Alanları & Sponsor Kampanyaları
          </h1>
        </div>
      </div>

      {/* Ad Slots Overview (Spec Item 169) */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Tanımlı Reklam Yerleşimleri (Ad Slots)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#146EF5] bg-blue-50 px-2 py-0.5 rounded">
                  {slot.key}
                </span>
                <Badge variant="verified" size="sm" />
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{slot.title}</h3>
              <p className="text-xs text-slate-500">{slot.description}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Maks. Firma: <strong>{slot.maxCarriersToShow}</strong></span>
                <span className="text-emerald-600 font-bold">Rotasyon Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns Table (Spec Item 170) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Aktif Sponsor Kampanyaları</h2>
            <p className="text-xs text-slate-500">Gold üyelik ve doğrudan reklam kampanyalarından beslenen liste</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-bold text-slate-700">Firma</th>
                <th className="p-4 font-bold text-slate-700">Reklam Alanı</th>
                <th className="p-4 font-bold text-slate-700">Kaynak</th>
                <th className="p-4 font-bold text-slate-700">Tarih Aralığı</th>
                <th className="p-4 font-bold text-slate-700">Gösterim (Imp.)</th>
                <th className="p-4 font-bold text-slate-700">Tıklama (Clicks)</th>
                <th className="p-4 font-bold text-slate-700">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{c.carrier.companyName}</td>
                  <td className="p-4 text-slate-700 font-mono text-[11px]">{c.slotKey}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-bold border border-amber-200 text-[10px]">
                      {c.source}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{c.startDate} → {c.endDate}</td>
                  <td className="p-4 font-bold text-slate-900">{c.currentImpressions.toLocaleString('tr-TR')}</td>
                  <td className="p-4 font-bold text-blue-600">{c.currentClicks.toLocaleString('tr-TR')}</td>
                  <td className="p-4">
                    <span className="text-emerald-600 font-bold text-xs">✓ Yayında</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
