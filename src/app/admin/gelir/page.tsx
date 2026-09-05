'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

const PLAN_PRICES: Record<string, number> = {
  plan_starter: 1250,
  plan_pro: 2450,
  plan_gold: 4850,
};

const PLAN_LABELS: Record<string, string> = {
  plan_starter: 'Başlangıç',
  plan_pro: 'Pro',
  plan_gold: 'Gold',
};

const PLAN_COLORS: Record<string, { bar: string; badge: string; text: string }> = {
  plan_gold: { bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-800', text: 'text-amber-600' },
  plan_pro: { bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800', text: 'text-blue-600' },
  plan_starter: { bar: 'bg-slate-400', badge: 'bg-slate-100 text-slate-700', text: 'text-slate-600' },
};

// Simüle edilmiş aylık gelir verisi (son 6 ay)
const MONTHLY_MOCK = [
  { month: 'Nis', revenue: 18500, newSubs: 2, churn: 0 },
  { month: 'May', revenue: 21250, newSubs: 3, churn: 1 },
  { month: 'Haz', revenue: 26100, newSubs: 4, churn: 0 },
  { month: 'Tem', revenue: 31500, newSubs: 3, churn: 1 },
  { month: 'Ağu', revenue: 35900, newSubs: 5, churn: 2 },
  { month: 'Eyl', revenue: null, newSubs: null, churn: null }, // Bu ay (devam ediyor)
];

// Simüle edilmiş iptal listesi
const MOCK_CHURNS = [
  { name: 'Güney Nakliyat Ltd.', plan: 'plan_pro', reason: 'Ücret çok yüksek', date: '2026-08-22' },
  { name: 'Hızlı Taşıma A.Ş.', plan: 'plan_starter', reason: 'İşleri azaldı', date: '2026-08-14' },
];

// Simüle edilmiş yeni üyeler
const MOCK_NEW = [
  { name: 'Marmara Lider Nakliyat', plan: 'plan_starter', date: '2026-08-18', city: 'Bursa' },
  { name: 'Atlas Ekspres Lojistik', plan: 'plan_pro', date: '2026-08-11', city: 'Ankara' },
  { name: 'Ege Rüzgarı Taşımacılık', plan: 'plan_gold', date: '2026-08-05', city: 'İzmir' },
  { name: 'Kuzey Işık Nakliye', plan: 'plan_pro', date: '2026-07-28', city: 'Trabzon' },
];

export default function GelirPage() {
  const carriers = db.getCarriers();
  const approvedCarriers = carriers.filter(c => c.verificationStatus === 'APPROVED');

  const monthlyRevenue = approvedCarriers.reduce((sum, c) => sum + (PLAN_PRICES[c.planId] || 0), 0);
  const annualRevenue = monthlyRevenue * 12;
  const arpu = approvedCarriers.length > 0 ? Math.round(monthlyRevenue / approvedCarriers.length) : 0;

  const goldCount = carriers.filter(c => c.planId === 'plan_gold').length;
  const proCount = carriers.filter(c => c.planId === 'plan_pro').length;
  const starterCount = carriers.filter(c => c.planId === 'plan_starter').length;

  const goldRevenue = goldCount * PLAN_PRICES.plan_gold;
  const proRevenue = proCount * PLAN_PRICES.plan_pro;
  const starterRevenue = starterCount * PLAN_PRICES.plan_starter;

  const maxMonthlyRevenue = Math.max(...MONTHLY_MOCK.filter(m => m.revenue !== null).map(m => m.revenue as number));

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      {/* Mini Navbar */}
      <div className="bg-[#0A1128] text-white px-6 py-3.5 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
        <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Admin
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs font-black text-white">Gelir Raporu</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-[#0A1128]">Gelir Raporu</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Abonelik gelirleri, paket dağılımı ve churn analizi.
          </p>
        </div>

        {/* Ana Gelir KPI'ları */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Aylık Gelir (MRR)',
              value: `${monthlyRevenue.toLocaleString('tr-TR')}₺`,
              sub: 'Aktif abonelikler',
              icon: DollarSign,
              color: 'bg-emerald-50 text-emerald-600',
              trend: '+12% geçen aya göre',
              trendUp: true,
            },
            {
              label: 'Yıllık Tahmini (ARR)',
              value: `${(annualRevenue / 1000).toFixed(0)}K₺`,
              sub: 'MRR × 12 ay',
              icon: TrendingUp,
              color: 'bg-blue-50 text-blue-600',
              trend: 'Hedef: 600K₺',
              trendUp: true,
            },
            {
              label: 'ARPU',
              value: `${arpu.toLocaleString('tr-TR')}₺`,
              sub: 'Ortalama gelir/firma/ay',
              icon: Award,
              color: 'bg-purple-50 text-purple-600',
              trend: '+8% büyüme',
              trendUp: true,
            },
            {
              label: 'Churn Bu Ay',
              value: `${MOCK_CHURNS.length} firma`,
              sub: 'İptal eden abonelik',
              icon: TrendingDown,
              color: 'bg-red-50 text-red-500',
              trend: `${Math.round(MOCK_CHURNS.length / approvedCarriers.length * 100)}% churn oranı`,
              trendUp: false,
            },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{item.label}</span>
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1128] block">{item.value}</span>
              <span className="text-[11px] text-slate-400 font-semibold">{item.sub}</span>
              <div className={`flex items-center gap-1 mt-2 text-[11px] font-bold ${item.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {item.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Grafik + Paket Dağılımı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Aylık Gelir Grafiği */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-[#0A1128]">Aylık Gelir Trendi</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Son 6 ay • Abonelik gelirleri</p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end gap-2 h-36 mb-3">
              {MONTHLY_MOCK.map((m, i) => {
                const height = m.revenue
                  ? Math.max((m.revenue / maxMonthlyRevenue) * 100, 8)
                  : 0;
                const isCurrent = m.revenue === null;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-500">
                      {m.revenue ? `${(m.revenue / 1000).toFixed(0)}K` : '—'}
                    </span>
                    <div className="w-full flex items-end" style={{ height: '80px' }}>
                      <div
                        className={`w-full rounded-t-lg transition-all ${isCurrent ? 'bg-slate-100 border-2 border-dashed border-slate-300' : 'bg-[#F95700]'}`}
                        style={{ height: isCurrent ? '20%' : `${height}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{m.month}</span>
                    {isCurrent && <span className="text-[9px] font-bold text-slate-400">devam ediyor</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#F95700]" /> Gerçekleşen gelir
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border-2 border-dashed border-slate-300" /> Bu ay (devam ediyor)
              </div>
            </div>
          </div>

          {/* Paket Dağılımı */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h2 className="font-bold text-[#0A1128] mb-5">Pakete Göre Dağılım</h2>

            <div className="space-y-4">
              {[
                { planId: 'plan_gold', count: goldCount, revenue: goldRevenue },
                { planId: 'plan_pro', count: proCount, revenue: proRevenue },
                { planId: 'plan_starter', count: starterCount, revenue: starterRevenue },
              ].map((tier) => {
                const pct = monthlyRevenue > 0 ? Math.round((tier.revenue / monthlyRevenue) * 100) : 0;
                const colors = PLAN_COLORS[tier.planId];

                return (
                  <div key={tier.planId}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colors.bar}`} />
                        <span className="font-bold text-slate-700">{PLAN_LABELS[tier.planId]}</span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${colors.badge}`}>
                          {tier.count} firma
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-black ${colors.text}`}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors.bar}`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                      <span>{PLAN_PRICES[tier.planId].toLocaleString('tr-TR')}₺/firma</span>
                      <span className="font-bold text-slate-600">{tier.revenue.toLocaleString('tr-TR')}₺/ay</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-slate-500">Toplam MRR</span>
                <span className="font-black text-[#0A1128]">{monthlyRevenue.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Churn + Yeni Üyeler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* İptal Edenler */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-5">
              <XCircle className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-[#0A1128]">Bu Ay İptal Edenler</h2>
              <span className="text-xs font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full ml-auto">
                {MOCK_CHURNS.length} firma
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_CHURNS.map((churn, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#0A1128] text-sm">{churn.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${PLAN_COLORS[churn.plan]?.badge || 'bg-slate-100 text-slate-600'}`}>
                      {PLAN_LABELS[churn.plan]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{churn.reason}</span>
                    <span>{new Date(churn.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-500">Kaybedilen aylık gelir</p>
              <p className="text-lg font-black text-red-600 mt-0.5">
                -{(PLAN_PRICES.plan_pro + PLAN_PRICES.plan_starter).toLocaleString('tr-TR')}₺
              </p>
            </div>
          </div>

          {/* Yeni Üyeler */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h2 className="font-bold text-[#0A1128]">Son Yeni Üyeler</h2>
              <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-auto">
                +{MOCK_NEW.length} bu ay
              </span>
            </div>

            <div className="space-y-3">
              {MOCK_NEW.map((member, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#0A1128] text-sm">{member.name}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${PLAN_COLORS[member.plan]?.badge || 'bg-slate-100 text-slate-600'}`}>
                      {PLAN_LABELS[member.plan]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 ml-9">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {member.city}
                    </span>
                    <span>{new Date(member.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-bold text-slate-500">Kazanılan aylık gelir</p>
              <p className="text-lg font-black text-emerald-600 mt-0.5">
                +{(PLAN_PRICES.plan_gold + PLAN_PRICES.plan_pro * 2 + PLAN_PRICES.plan_starter).toLocaleString('tr-TR')}₺
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
