'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Truck,
  Search,
  Home,
  ShieldCheck,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

const PLAN_LABELS: Record<string, string> = {
  plan_starter: 'Başlangıç',
  plan_pro: 'Pro',
  plan_gold: 'Gold',
};

const PLAN_BADGE: Record<string, string> = {
  plan_starter: 'bg-slate-100 text-slate-700',
  plan_pro: 'bg-blue-100 text-blue-700',
  plan_gold: 'bg-amber-100 text-amber-700',
};

const PLAN_PRICES: Record<string, number> = {
  plan_starter: 1250,
  plan_pro: 2450,
  plan_gold: 4850,
};

const STATUS_CONFIG = {
  APPROVED: { label: 'Aktif', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  PENDING: { label: 'Onay Bekliyor', icon: Clock, color: 'text-amber-600 bg-amber-50' },
  REJECTED: { label: 'Reddedildi', icon: XCircle, color: 'text-red-600 bg-red-50' },
} as const;

export default function UyelerPage() {
  const carriers = db.getCarriers();
  const requests = db.getRequests();

  const [tab, setTab] = useState<'musteri' | 'nakliyeci'>('nakliyeci');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- Müşteriler (talep açmış benzersiz kullanıcılar) ---
  const customerMap = new Map<string, { id: string; name: string; phone: string; requestCount: number; lastRequest: string; cities: string[] }>();
  requests.forEach(r => {
    if (customerMap.has(r.customerId)) {
      const entry = customerMap.get(r.customerId)!;
      entry.requestCount++;
      if (r.createdAt > entry.lastRequest) entry.lastRequest = r.createdAt;
      entry.cities.push(`${r.originCity}→${r.destinationCity}`);
    } else {
      customerMap.set(r.customerId, {
        id: r.customerId,
        name: r.customerName,
        phone: r.customerPhone,
        requestCount: 1,
        lastRequest: r.createdAt,
        cities: [`${r.originCity}→${r.destinationCity}`],
      });
    }
  });
  const customers = Array.from(customerMap.values());

  // --- Filtrelenmiş Nakliyeciler ---
  const filteredCarriers = carriers.filter(c => {
    const matchSearch = search === '' ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || c.planId === planFilter;
    const matchStatus = statusFilter === 'all' || c.verificationStatus === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  // --- Filtrelenmiş Müşteriler ---
  const filteredCustomers = customers.filter(c => {
    return search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
  });

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      {/* Mini Navbar */}
      <div className="bg-[#0A1128] text-white px-6 py-3.5 flex items-center gap-4 sticky top-0 z-50 shadow-lg">
        <Link href="/admin" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Admin
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-xs font-black text-white">Üye Yönetimi</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#0A1128]">Üye Yönetimi</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Müşteri ve nakliyeci hesaplarını yönetin, abonelik durumlarını takip edin.
          </p>
        </div>

        {/* Özet Kartlar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-500">Müşteri</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">{customers.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold">Taşıttıran kişi</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-[#F95700]" />
              <span className="text-xs font-bold text-slate-500">Nakliyeci</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">{carriers.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold">Kayıtlı firma</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-500">Onaylı</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">
              {carriers.filter(c => c.verificationStatus === 'APPROVED').length}
            </span>
            <p className="text-[11px] text-emerald-600 font-semibold">Aktif nakliyeci</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-500">Beklemede</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">
              {carriers.filter(c => c.verificationStatus === 'PENDING').length}
            </span>
            <p className="text-[11px] text-amber-600 font-semibold">Onay bekliyor</p>
          </div>
        </div>

        {/* Sekme + Filtreler */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Sekmeler */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setTab('nakliyeci')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                tab === 'nakliyeci'
                  ? 'border-[#F95700] text-[#F95700]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Truck className="w-4 h-4" /> Nakliyeciler
              <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-black">
                {carriers.length}
              </span>
            </button>
            <button
              onClick={() => setTab('musteri')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                tab === 'musteri'
                  ? 'border-[#F95700] text-[#F95700]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Müşteriler
              <span className="ml-1 text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-black">
                {customers.length}
              </span>
            </button>
          </div>

          {/* Arama + Filtreler */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={tab === 'nakliyeci' ? 'Firma, e-posta, şehir ara...' : 'İsim veya telefon ara...'}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:border-[#F95700] focus:outline-none transition-colors"
              />
            </div>

            {tab === 'nakliyeci' && (
              <>
                <div className="relative">
                  <select
                    value={planFilter}
                    onChange={e => setPlanFilter(e.target.value)}
                    className="appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-bold focus:border-[#F95700] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Tüm Paketler</option>
                    <option value="plan_gold">Gold</option>
                    <option value="plan_pro">Pro</option>
                    <option value="plan_starter">Başlangıç</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-sm font-bold focus:border-[#F95700] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Tüm Durumlar</option>
                    <option value="APPROVED">Onaylı</option>
                    <option value="PENDING">Beklemede</option>
                    <option value="REJECTED">Reddedildi</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </>
            )}
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            {tab === 'nakliyeci' ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Firma</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Şehir</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Paket</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Aylık Ödeme</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Durum</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Puan</th>
                    <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCarriers.map((carrier) => {
                    const statusConf = STATUS_CONFIG[carrier.verificationStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                    const StatusIcon = statusConf.icon;
                    return (
                      <tr key={carrier.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-bold text-slate-900 block">{carrier.companyName}</span>
                            <span className="text-xs text-slate-400">{carrier.email}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-medium">{carrier.city}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${PLAN_BADGE[carrier.planId] || 'bg-slate-100 text-slate-600'}`}>
                            {PLAN_LABELS[carrier.planId] || carrier.planId}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-700">
                          {carrier.verificationStatus === 'APPROVED'
                            ? `${(PLAN_PRICES[carrier.planId] || 0).toLocaleString('tr-TR')}₺`
                            : <span className="text-slate-400 font-medium">—</span>
                          }
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusConf.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConf.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs font-medium">
                          {new Date(carrier.joinedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <span className="text-amber-500 text-xs">★</span>
                            <span className="font-bold text-slate-700 text-xs">{carrier.rating || '—'}</span>
                            <span className="text-slate-400 text-xs">({carrier.reviewCount})</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {carrier.verificationStatus === 'PENDING' ? (
                            <Link href="/admin/dogrulamalar">
                              <span className="inline-block px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors shadow-xs">
                                Evrakları İncele
                              </span>
                            </Link>
                          ) : (
                            <Link href={`/firma/${carrier.slug}`} target="_blank">
                              <span className="inline-block text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                                Profili Gör →
                              </span>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Müşteri</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Telefon</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Toplam Talep</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Son Rota</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Son Aktif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600 shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900">{cust.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-medium">{cust.phone}</td>
                      <td className="px-5 py-4">
                        <span className="font-black text-slate-900">{cust.requestCount}</span>
                        <span className="text-slate-400 text-xs ml-1">talep</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs font-medium">
                        {cust.cities[cust.cities.length - 1]}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs font-medium">
                        {new Date(cust.lastRequest).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {((tab === 'nakliyeci' && filteredCarriers.length === 0) ||
              (tab === 'musteri' && filteredCustomers.length === 0)) && (
              <div className="text-center py-12">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold text-sm">Sonuç bulunamadı</p>
                <p className="text-slate-400 text-xs mt-1">Arama veya filtre kriterlerinizi değiştirin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
