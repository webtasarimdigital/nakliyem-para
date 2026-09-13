'use client';

import React, { useState, useEffect } from 'react';
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
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  Filter,
  Check
} from 'lucide-react';
import { db, isSeedCarrier, isSeedUser, isSeedRequest } from '@/lib/data/mock-db';
import { getFirestoreUsers, getFirestoreCarriers, updateFirestoreCarrier } from '@/lib/firebase/firestore';
import { User, CarrierProfile } from '@/types';

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
  plan_starter: 0,
  plan_pro: 2450,
  plan_gold: 4850,
};

const STATUS_CONFIG = {
  APPROVED: { label: 'Aktif Onaylı', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  PENDING: { label: 'Onay Bekliyor', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  REJECTED: { label: 'Reddedildi', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
} as const;

interface UnifiedCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requestCount: number;
  lastRequest: string;
  cities: string[];
  source: 'Firestore' | 'Kayıtlı Üye' | 'Talep Sahibi';
  isSeed?: boolean;
}

interface UnifiedCarrier {
  id: string;
  userId?: string;
  companyName: string;
  authorizedPerson?: string;
  email: string;
  phone: string;
  city: string;
  planId: string;
  verificationStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  joinedAt: string;
  rating?: number;
  reviewCount?: number;
  slug?: string;
  source: 'Firestore' | 'Sistem Kaydı';
  isSeed?: boolean;
}

export default function UyelerPage() {
  const [showDemoData, setShowDemoData] = useState(false);
  const [tab, setTab] = useState<'nakliyeci' | 'musteri'>('nakliyeci');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [firestoreUsers, setFirestoreUsers] = useState<User[]>([]);
  const [firestoreCarriers, setFirestoreCarriers] = useState<CarrierProfile[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Firestore live users and carriers
  useEffect(() => {
    async function loadLive() {
      try {
        const [users, carriers] = await Promise.all([
          getFirestoreUsers(),
          getFirestoreCarriers()
        ]);
        setFirestoreUsers(users);
        setFirestoreCarriers(carriers);
      } catch (err) {
        console.warn('Live firestore fetch notice:', err);
      }
    }
    loadLive();
  }, [refreshKey]);

  // Purge demo data
  const handleClearDemoData = () => {
    if (confirm('Veritabanındaki tüm demo/tohum firma ve talep verilerini temizlemek istediğinize emin misiniz?')) {
      db.clearDemoData();
      setShowDemoData(false);
      setRefreshKey(k => k + 1);
      setNotice('Tüm fake ve tohum veriler başarıyla temizlendi. Artık yalnızca gerçek üyeler listeleniyor.');
      setTimeout(() => setNotice(null), 5000);
    }
  };

  // Quick Approve Carrier
  const handleQuickApproveCarrier = async (carrierId: string, companyName: string) => {
    if (!confirm(`"${companyName}" firmasını onaylayarak teklif verme ve sistem erişim yetkisini açmak istiyor musunuz?`)) return;

    const badges = {
      identityVerified: true,
      taxVerified: true,
      transportPermitVerified: true,
      elevatorVerified: false
    };

    db.updateCarrier(carrierId, {
      verificationStatus: 'APPROVED',
      verificationBadges: badges
    });

    const docs = db.getDocumentsForCarrier(carrierId);
    docs.forEach(d => db.updateDocumentStatus(d.id, 'APPROVED'));

    try {
      await updateFirestoreCarrier(carrierId, {
        verificationStatus: 'APPROVED',
        verificationBadges: badges
      });
    } catch (e) {
      console.warn('Firestore carrier update error:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('auth-changed'));
    }

    setNotice(`"${companyName}" firması başarıyla onaylandı. Teklif verme kilidi açıldı.`);
    setTimeout(() => setNotice(null), 4000);
    setRefreshKey(k => k + 1);
  };

  // Build unified Customers list
  const customers: UnifiedCustomer[] = React.useMemo(() => {
    const map = new Map<string, UnifiedCustomer>();

    // 1. Registered users from DB
    const regUsers = showDemoData ? db.getRegisteredUsers() : db.getRealRegisteredUsers();
    regUsers.filter(u => u.role === 'CUSTOMER').forEach(u => {
      const key = u.email?.toLowerCase() || u.phone || u.id;
      map.set(key, {
        id: u.id,
        name: u.fullName || 'Kayıtlı Müşteri',
        phone: u.phone || '—',
        email: u.email,
        requestCount: 0,
        lastRequest: u.createdAt,
        cities: [],
        source: 'Kayıtlı Üye',
        isSeed: u.isSeed
      });
    });

    // 2. Firestore customers
    firestoreUsers.filter(u => u.role === 'CUSTOMER').forEach(u => {
      const key = u.email?.toLowerCase() || u.phone || u.id;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.source = 'Firestore';
        if (u.fullName) existing.name = u.fullName;
        if (u.phone) existing.phone = u.phone;
      } else {
        map.set(key, {
          id: u.id,
          name: u.fullName || u.email?.split('@')[0] || 'Canlı Müşteri',
          phone: u.phone || '—',
          email: u.email,
          requestCount: 0,
          lastRequest: u.createdAt || new Date().toISOString(),
          cities: [],
          source: 'Firestore'
        });
      }
    });

    // 3. Requests
    const reqs = showDemoData ? db.getRequests() : db.getRealRequests();
    reqs.forEach(r => {
      const key = (r.customerPhone && r.customerPhone.replace(/\D/g, '').length >= 7)
        ? r.customerPhone.replace(/\D/g, '')
        : r.customerId;

      if (map.has(key)) {
        const item = map.get(key)!;
        item.requestCount++;
        if (r.createdAt > item.lastRequest) item.lastRequest = r.createdAt;
        const route = `${r.originCity}→${r.destinationCity}`;
        if (!item.cities.includes(route)) item.cities.push(route);
      } else {
        map.set(key, {
          id: r.customerId,
          name: r.customerName || 'Müşteri',
          phone: r.customerPhone || '—',
          requestCount: 1,
          lastRequest: r.createdAt,
          cities: [`${r.originCity}→${r.destinationCity}`],
          source: 'Talep Sahibi',
          isSeed: r.isSeed
        });
      }
    });

    return Array.from(map.values()).filter(c => showDemoData || !c.isSeed);
  }, [showDemoData, firestoreUsers, refreshKey]);

  // Build unified Carriers list
  const carriers: UnifiedCarrier[] = React.useMemo(() => {
    const map = new Map<string, UnifiedCarrier>();

    // 1. Carriers from DB
    const carrList = showDemoData ? db.getCarriers() : db.getRealCarriers();
    carrList.forEach(c => {
      const key = c.email?.toLowerCase() || c.id;
      map.set(key, {
        id: c.id,
        userId: c.userId,
        companyName: c.companyName,
        authorizedPerson: c.authorizedPersonName ? `${c.authorizedPersonName} ${c.authorizedPersonSurname || ''}`.trim() : undefined,
        email: c.email || '—',
        phone: c.phone || '—',
        city: c.city || 'Belirtilmedi',
        planId: c.planId || 'plan_starter',
        verificationStatus: (c.verificationStatus as any) || 'PENDING',
        joinedAt: c.joinedAt || c.createdAt || new Date().toISOString(),
        rating: c.rating,
        reviewCount: c.reviewCount,
        slug: c.slug,
        source: 'Sistem Kaydı',
        isSeed: c.isSeed
      });
    });

    // 2. Registered users who signed up as CARRIER
    const regCarriers = showDemoData ? db.getRegisteredUsers() : db.getRealRegisteredUsers();
    regCarriers.filter(u => u.role === 'CARRIER').forEach(u => {
      const key = u.email?.toLowerCase() || u.id;
      if (!map.has(key)) {
        map.set(key, {
          id: u.carrierId || `carr_${u.id}`,
          userId: u.id,
          companyName: u.companyName || u.fullName || 'Firma Adı Bekleniyor',
          authorizedPerson: u.fullName,
          email: u.email,
          phone: u.phone,
          city: 'Profil Hazırlanıyor',
          planId: 'plan_starter',
          verificationStatus: 'PENDING',
          joinedAt: u.createdAt,
          source: 'Sistem Kaydı',
          isSeed: u.isSeed
        });
      }
    });

    // 3. Firestore carriers
    firestoreCarriers.forEach(fc => {
      const key = fc.email?.toLowerCase() || fc.id;
      if (map.has(key)) {
        const item = map.get(key)!;
        item.source = 'Firestore';
      } else {
        map.set(key, {
          id: fc.id,
          userId: fc.userId,
          companyName: fc.companyName,
          authorizedPerson: fc.authorizedPersonName ? `${fc.authorizedPersonName} ${fc.authorizedPersonSurname || ''}`.trim() : undefined,
          email: fc.email || '—',
          phone: fc.phone || '—',
          city: fc.city || 'Belirtilmedi',
          planId: fc.planId || 'plan_starter',
          verificationStatus: (fc.verificationStatus as any) || 'PENDING',
          joinedAt: fc.joinedAt || fc.createdAt || new Date().toISOString(),
          rating: fc.rating,
          reviewCount: fc.reviewCount,
          slug: fc.slug,
          source: 'Firestore',
          isSeed: fc.isSeed
        });
      }
    });

    return Array.from(map.values()).filter(c => showDemoData || !c.isSeed);
  }, [showDemoData, firestoreCarriers, refreshKey]);

  // Filtered Carriers
  const filteredCarriers = carriers.filter(c => {
    const matchSearch = search === '' ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || c.planId === planFilter;
    const matchStatus = statusFilter === 'all' || c.verificationStatus === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    return search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search);
  });

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F95700] mb-0.5">Üye Yönetimi</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Kayıtlı Müşteri & Nakliye Firmaları</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Canlı veritabanındaki gerçek müşteri ve nakliyecileri inceleyin, durumlarını yönetin.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDemoData(!showDemoData)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showDemoData 
                  ? 'bg-amber-500/10 text-amber-700 border border-amber-300 hover:bg-amber-500/20' 
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {showDemoData ? 'Demo Verileri Dahil (Gizle)' : '🛡️ Yalnızca Gerçek Üyeler'}
            </button>

            <button
              onClick={handleClearDemoData}
              title="Tüm tohum ve demo kayıtları kalıcı olarak temizler"
              className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Fake Bilgileri Temizle
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {notice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            {notice}
          </div>
        )}

        {/* Mode Status Banner */}
        <div className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          !showDemoData 
            ? 'bg-emerald-50/60 border-emerald-200' 
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              !showDemoData ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-[#0A1128]">
                {!showDemoData 
                  ? 'Canlı & Gerçek Üye Görünümü Aktif' 
                  : 'Demo / Vitrin Verileri Görünümü Aktif'}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {!showDemoData
                  ? 'Şu anda sistemde sahte/tohum veriler filtrelenmiştir. Sadece kayıt olmuş gerçek müşteriler ve nakliye firmaları gösterilmektedir.'
                  : 'Platformda önceden tanımlanmış örnek firmalar ve talepler de dahil edilmiştir.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDemoData(!showDemoData)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              {!showDemoData ? 'Demo Verilerini Gör' : '🛡️ Sadece Gerçek Üyelere Dön'}
            </button>
          </div>
        </div>

        {/* Özet Kartlar (Canlı gerçek sayılar) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-500">Gerçek Müşteri</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">{customers.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold">Kayıtlı veya talep açan</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-[#F95700]" />
              <span className="text-xs font-bold text-slate-500">Gerçek Nakliyeci</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">{carriers.length}</span>
            <p className="text-[11px] text-slate-400 font-semibold">Kayıtlı taşıma firması</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-500">Onaylı Firma</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">
              {carriers.filter(c => c.verificationStatus === 'APPROVED').length}
            </span>
            <p className="text-[11px] text-emerald-600 font-semibold">Aktif teklif verebilir</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-500">Onay Bekleyen</span>
            </div>
            <span className="text-2xl font-black text-[#0A1128]">
              {carriers.filter(c => c.verificationStatus === 'PENDING').length}
            </span>
            <p className="text-[11px] text-amber-600 font-semibold">Evrak incelemesi bekliyor</p>
          </div>
        </div>

        {/* Sekme + Filtreler */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Sekmeler */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setTab('nakliyeci')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                tab === 'nakliyeci'
                  ? 'border-[#F95700] text-[#F95700] bg-orange-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Truck className="w-4 h-4" /> Nakliyeciler ({carriers.length})
            </button>
            <button
              onClick={() => setTab('musteri')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                tab === 'musteri'
                  ? 'border-[#F95700] text-[#F95700] bg-orange-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-4 h-4" /> Müşteriler ({customers.length})
            </button>
          </div>

          {/* Arama + Filtreler */}
          <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={tab === 'nakliyeci' ? 'Firma, yetkili, telefon, e-posta, şehir ara...' : 'İsim, telefon veya e-posta ara...'}
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
                    <option value="plan_starter">Başlangıç (3 Ücretsiz/Gün)</option>
                    <option value="plan_pro">Pro</option>
                    <option value="plan_gold">Gold</option>
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
                    <option value="APPROVED">Aktif Onaylı</option>
                    <option value="PENDING">Onay Bekliyor</option>
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
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Firma & Yetkili</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">İletişim (Tel / E-posta)</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Şehir</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Paket</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Durum</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCarriers.map((carrier) => {
                    const statusConf = STATUS_CONFIG[carrier.verificationStatus] || STATUS_CONFIG.PENDING;
                    const StatusIcon = statusConf.icon;
                    return (
                      <tr key={carrier.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <span className="font-bold text-[#0A1128] block">{carrier.companyName}</span>
                            {carrier.authorizedPerson && (
                              <span className="text-xs text-slate-500 font-medium">Yetkili: {carrier.authorizedPerson}</span>
                            )}
                            <span className="inline-block mt-0.5 text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                              {carrier.source}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-0.5">
                            <a href={`tel:${carrier.phone}`} className="text-xs font-bold text-slate-800 hover:text-[#F95700] flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {carrier.phone}
                            </a>
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {carrier.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-medium">{carrier.city}</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full ${PLAN_BADGE[carrier.planId] || 'bg-slate-100 text-slate-600'}`}>
                            {PLAN_LABELS[carrier.planId] || carrier.planId}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusConf.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConf.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs font-medium">
                          {new Date(carrier.joinedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {carrier.verificationStatus === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/dogrulamalar?carrierId=${carrier.id}`}>
                                <span className="inline-block px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-colors shadow-xs">
                                  Evrak İncele
                                </span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleQuickApproveCarrier(carrier.id, carrier.companyName)}
                                className="inline-block px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow-xs cursor-pointer"
                              >
                                Onayla
                              </button>
                            </div>
                          ) : carrier.slug ? (
                            <Link href={`/firma/${carrier.slug}`} target="_blank">
                              <span className="inline-block text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors">
                                Profili Gör →
                              </span>
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Aktif</span>
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
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Müşteri Adı</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Telefon Numarası</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">E-posta</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Toplam İlan</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Güzergah</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Kayıt / Son İşlem</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Kaynak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">
                            {cust.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-[#0A1128]">{cust.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-800">
                        {cust.phone !== '—' ? (
                          <a href={`tel:${cust.phone}`} className="hover:text-[#F95700] transition-colors flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {cust.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        {cust.email || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-black text-[#0A1128]">{cust.requestCount}</span>
                        <span className="text-slate-400 text-xs ml-1">ilan</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs font-medium">
                        {cust.cities.length > 0 ? cust.cities[cust.cities.length - 1] : '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs font-medium">
                        {new Date(cust.lastRequest).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                          {cust.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Zero State Cards */}
            {tab === 'nakliyeci' && filteredCarriers.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-[#0A1128] mb-1">
                  {!showDemoData ? 'Kayıtlı Gerçek Nakliyeci Bulunmuyor' : 'Arama Kriterine Uygun Firma Bulunamadı'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {!showDemoData 
                    ? 'Platforma yeni bir nakliye firması kayıt olduğunda firma unvanı, iletişim numarası, paketi ve evrakları anında burada listelenecektir.'
                    : 'Farklı bir arama terimi veya filtre seçmeyi deneyin.'}
                </p>
                {!showDemoData && (
                  <button
                    onClick={() => setShowDemoData(true)}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Örnek Demo Firmaları İncele
                  </button>
                )}
              </div>
            )}

            {tab === 'musteri' && filteredCustomers.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-[#0A1128] mb-1">
                  {!showDemoData ? 'Kayıtlı Gerçek Müşteri Bulunmuyor' : 'Arama Kriterine Uygun Müşteri Bulunamadı'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {!showDemoData
                    ? 'Yeni bir müşteri hesap açtığında veya taşınma ilanı bıraktığında gerçek telefon numarası ve ilan bilgileriyle birlikte burada görünecektir.'
                    : 'Farklı bir arama terimi deneyin.'}
                </p>
                {!showDemoData && (
                  <button
                    onClick={() => setShowDemoData(true)}
                    className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Örnek Demo Talepleri İncele
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
