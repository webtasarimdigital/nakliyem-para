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
  Check,
  Ban,
  ShieldAlert
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { db, isSeedCarrier, isSeedUser, isSeedRequest } from '@/lib/data/mock-db';
import { getFirestoreUsers, getFirestoreCarriers, updateFirestoreCarrier } from '@/lib/firebase/firestore';
import { User, CarrierProfile } from '@/types';

const PLAN_LABELS: Record<string, string> = {
  plan_starter: 'Başlangıç',
  plan_pro: 'Profesyonel (⭐ 7G Deneme)',
  plan_gold: 'Filo / Kurumsal',
};

const PLAN_BADGE: Record<string, string> = {
  plan_starter: 'bg-slate-100 text-slate-700',
  plan_pro: 'bg-blue-100 text-blue-700 font-bold',
  plan_gold: 'bg-amber-100 text-amber-700 font-bold',
};

const PLAN_PRICES: Record<string, number> = {
  plan_starter: 1199,
  plan_pro: 2990,
  plan_gold: 5990,
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
  hasCardAdded?: boolean;
  trialStatus?: 'NOT_STARTED' | 'PENDING_CARD' | 'PENDING_VERIFICATION' | 'ACTIVE_TRIAL' | 'CONVERTED' | 'EXPIRED';
  trialStartedAt?: string;
  trialEndsAt?: string;
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

  // Moderation Modals State
  const [banModal, setBanModal] = useState<{
    open: boolean;
    type: 'nakliyeci' | 'musteri';
    id: string;
    name: string;
    phone: string;
    email: string;
    reason: string;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    type: 'nakliyeci' | 'musteri';
    id: string;
    name: string;
    phone?: string;
    email?: string;
  } | null>(null);

  const handleConfirmBan = () => {
    if (!banModal) return;
    db.banEntity({
      carrierId: banModal.type === 'nakliyeci' ? banModal.id : undefined,
      userId: banModal.type === 'musteri' ? banModal.id : undefined,
      phone: banModal.phone !== '—' ? banModal.phone : undefined,
      email: banModal.email !== '—' ? banModal.email : undefined,
      name: banModal.name,
      reason: banModal.reason || 'Sistem kuralları ihlali',
    });
    setNotice(`"${banModal.name}" üyesi başarıyla yasaklandı. Telefonu ve e-postası kara listeye alındı, tüm aktif ilan ve paylaşımları siteden kaldırıldı.`);
    setBanModal(null);
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleUnban = (id: string, name: string, phone?: string, email?: string) => {
    if (!confirm(`"${name}" üyesinin yasağını kaldırmak ve sisteme tekrar erişim vermesini sağlamak istiyor musunuz?`)) return;
    if (phone && phone !== '—') db.unbanEntity(phone);
    if (email && email !== '—') db.unbanEntity(email);
    db.unbanEntity(id);
    setNotice(`"${name}" üyesinin yasağı kaldırıldı.`);
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 5000);
  };

  const handleConfirmDelete = () => {
    if (!deleteModal) return;
    if (deleteModal.type === 'nakliyeci') {
      db.deleteCarrier(deleteModal.id);
    } else {
      db.deleteUser(deleteModal.id);
    }
    db.purgeAllUserData(deleteModal.id, {
      phone: deleteModal.phone !== '—' ? deleteModal.phone : undefined,
      email: deleteModal.email !== '—' ? deleteModal.email : undefined,
    });
    setNotice(`"${deleteModal.name}" üyesi ve ilişkili TÜM kayıtları (talepleri, ilanları, teklifleri) kalıcı olarak silindi.`);
    setDeleteModal(null);
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 5000);
  };

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
  // Build unified Customers list
  const customers: UnifiedCustomer[] = React.useMemo(() => {
    try {
      const map = new Map<string, UnifiedCustomer>();

      // 1. Registered users from DB
      const regUsers = showDemoData ? db.getRegisteredUsers() : db.getRealRegisteredUsers();
      regUsers.filter(u => u.role === 'CUSTOMER').forEach(u => {
        const key = u.email?.toLowerCase() || u.phone || u.id;
        map.set(key, {
          id: u.id,
          name: u.fullName || u.email?.split('@')[0] || 'Kayıtlı Müşteri',
          phone: u.phone || '—',
          email: u.email || '—',
          requestCount: 0,
          lastRequest: u.createdAt || new Date().toISOString(),
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
          if (u.email) existing.email = u.email;
        } else {
          map.set(key, {
            id: u.id,
            name: u.fullName || u.email?.split('@')[0] || 'Canlı Müşteri',
            phone: u.phone || '—',
            email: u.email || '—',
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
          if (r.createdAt && (!item.lastRequest || r.createdAt > item.lastRequest)) {
            item.lastRequest = r.createdAt;
          }
          const origin = r.originCity || 'Belirtilmedi';
          const dest = r.destinationCity || 'Belirtilmedi';
          const route = `${origin}→${dest}`;
          if (!item.cities.includes(route)) item.cities.push(route);
        } else {
          const origin = r.originCity || 'Belirtilmedi';
          const dest = r.destinationCity || 'Belirtilmedi';
          map.set(key, {
            id: r.customerId || `cust_${key}`,
            name: r.customerName || 'Müşteri',
            phone: r.customerPhone || '—',
            email: '—',
            requestCount: 1,
            lastRequest: r.createdAt || new Date().toISOString(),
            cities: [`${origin}→${dest}`],
            source: 'Talep Sahibi',
            isSeed: r.isSeed
          });
        }
      });

      return Array.from(map.values()).filter(c => showDemoData || !c.isSeed);
    } catch (err) {
      console.warn('Failed to compile customer records:', err);
      return [];
    }
  }, [showDemoData, firestoreUsers, refreshKey]);

  // Build unified Carriers list
  const carriers: UnifiedCarrier[] = React.useMemo(() => {
    try {
      const map = new Map<string, UnifiedCarrier>();

      // 1. Carriers from DB
      const carrList = showDemoData ? db.getCarriers() : db.getRealCarriers();
      carrList.forEach(c => {
        const key = c.email?.toLowerCase() || c.id;
        map.set(key, {
          id: c.id,
          userId: c.userId,
          companyName: c.companyName || 'İsimsiz Firma',
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
          isSeed: c.isSeed,
          hasCardAdded: c.hasCardAdded,
          trialStatus: c.trialStatus,
          trialStartedAt: c.trialStartedAt,
          trialEndsAt: c.trialEndsAt,
        });
      });

      // 2. Registered users who signed up as CARRIER
      const regCarriers = showDemoData ? db.getRegisteredUsers() : db.getRealRegisteredUsers();
      regCarriers.filter(u => u.role === 'CARRIER').forEach(u => {
        const key = u.email?.toLowerCase() || u.id;
        if (!map.has(key)) {
          const linkedCarrier = u.carrierId ? db.getCarrierById(u.carrierId) : null;
          map.set(key, {
            id: u.carrierId || `carr_${u.id}`,
            userId: u.id,
            companyName: u.companyName || u.fullName || 'Firma Adı Bekleniyor',
            authorizedPerson: u.fullName || '—',
            email: u.email || '—',
            phone: u.phone || '—',
            city: 'Profil Hazırlanıyor',
            planId: linkedCarrier?.planId || 'plan_starter',
            verificationStatus: (linkedCarrier?.verificationStatus as any) || 'PENDING',
            joinedAt: u.createdAt || new Date().toISOString(),
            source: 'Sistem Kaydı',
            isSeed: u.isSeed,
            hasCardAdded: linkedCarrier?.hasCardAdded,
            trialStatus: linkedCarrier?.trialStatus,
            trialStartedAt: linkedCarrier?.trialStartedAt,
            trialEndsAt: linkedCarrier?.trialEndsAt,
          });
        }
      });

      // 3. Firestore carriers
      firestoreCarriers.forEach(fc => {
        const key = fc.email?.toLowerCase() || fc.id;
        if (map.has(key)) {
          const item = map.get(key)!;
          item.source = 'Firestore';
          if (fc.companyName) item.companyName = fc.companyName;
          if (fc.phone) item.phone = fc.phone;
          if (fc.city) item.city = fc.city;
          if (fc.hasCardAdded !== undefined) item.hasCardAdded = fc.hasCardAdded;
          if (fc.trialStatus) item.trialStatus = fc.trialStatus;
          if (fc.trialStartedAt) item.trialStartedAt = fc.trialStartedAt;
          if (fc.trialEndsAt) item.trialEndsAt = fc.trialEndsAt;
        } else {
          map.set(key, {
            id: fc.id,
            userId: fc.userId,
            companyName: fc.companyName || 'Firma Adı Bekleniyor',
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
            isSeed: fc.isSeed,
            hasCardAdded: fc.hasCardAdded,
            trialStatus: fc.trialStatus,
            trialStartedAt: fc.trialStartedAt,
            trialEndsAt: fc.trialEndsAt,
          });
        }
      });

      return Array.from(map.values()).filter(c => showDemoData || !c.isSeed);
    } catch (err) {
      console.warn('Failed to compile carrier records:', err);
      return [];
    }
  }, [showDemoData, firestoreCarriers, refreshKey]);

  // Filtered Carriers
  const filteredCarriers = carriers.filter(c => {
    const q = (search || '').toLowerCase().trim();
    const matchSearch = q === '' ||
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.city || '').toLowerCase().includes(q);
    const matchPlan = planFilter === 'all' || c.planId === planFilter;
    const matchStatus = statusFilter === 'all'
      ? true
      : statusFilter === 'TRIAL_ACTIVE'
        ? c.trialStatus === 'ACTIVE_TRIAL'
        : statusFilter === 'CARD_ADDED'
          ? Boolean(c.hasCardAdded)
          : statusFilter === 'TRIAL_EXPIRED'
            ? c.trialStatus === 'EXPIRED'
            : statusFilter === 'TRIAL_CONVERTED'
              ? c.trialStatus === 'CONVERTED'
              : c.verificationStatus === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    const q = (search || '').toLowerCase().trim();
    return q === '' ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q);
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
                    <option value="TRIAL_ACTIVE">⭐ 7G Pro Denemedekiler</option>
                    <option value="CARD_ADDED">💳 Kartı Ekleyenler</option>
                    <option value="TRIAL_CONVERTED">✅ Yenilenenler (₺2.990 Aktif)</option>
                    <option value="TRIAL_EXPIRED">⚠️ Denemesi Bitenler</option>
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
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">7G Deneme & Abonelik</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Kayıt Tarihi</th>
                    <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCarriers.map((carrier) => {
                    const statusConf = STATUS_CONFIG[carrier.verificationStatus] || STATUS_CONFIG.PENDING;
                    const StatusIcon = statusConf.icon;
                    const trialInfo = db.getCarrierTrialInfo(carrier as any);
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
                          {db.isBanned({ phone: carrier.phone, email: carrier.email, carrierId: carrier.id }).isBanned ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-300">
                              <Ban className="w-3 h-3" />
                              YASAKLI
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${statusConf.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConf.label}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 min-w-[200px]">
                            {trialInfo.status === 'ACTIVE_TRIAL' ? (
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[11px] font-black text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                                    ⭐ {trialInfo.dayNumber}. Gün ({trialInfo.daysRemaining} gün kaldı)
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400">7G Pro</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="bg-[#F95700] h-1.5 rounded-full transition-all" 
                                    style={{ width: `${Math.min(100, Math.round((trialInfo.dayNumber / 7) * 100))}%` }} 
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                  İlk çekim: {trialInfo.endsAtText} (₺2.990)
                                </span>
                              </div>
                            ) : trialInfo.status === 'CONVERTED' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Yenilendi (₺2.990 Aktif)
                              </span>
                            ) : trialInfo.status === 'EXPIRED' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                                ⚠️ Deneme Bitti (Başlangıç)
                              </span>
                            ) : trialInfo.status === 'PENDING_CARD' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                💳 Kart Bekleniyor (Onaylı)
                              </span>
                            ) : trialInfo.status === 'PENDING_VERIFICATION' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                                ⏳ Evrak Onayı Bekliyor (Kart Hazır)
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">
                                — Kart / Onay Yok
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs font-medium" suppressHydrationWarning>
                          {carrier.joinedAt && !isNaN(new Date(carrier.joinedAt).getTime())
                            ? new Date(carrier.joinedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {carrier.verificationStatus === 'PENDING' && (
                              <>
                                <Link href={`/admin/dogrulamalar?carrierId=${carrier.id}`}>
                                  <span className="inline-block px-2 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs">
                                    Evrak
                                  </span>
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleQuickApproveCarrier(carrier.id, carrier.companyName)}
                                  className="inline-block px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                                >
                                  Onayla
                                </button>
                              </>
                            )}
                            {carrier.slug && (
                              <Link href={`/firma/${carrier.slug}`} target="_blank">
                                <span className="inline-block text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors px-1.5 py-1">
                                  Profil →
                                </span>
                              </Link>
                            )}
                            {db.isBanned({ phone: carrier.phone, email: carrier.email, carrierId: carrier.id }).isBanned ? (
                              <button
                                type="button"
                                onClick={() => handleUnban(carrier.id, carrier.companyName, carrier.phone, carrier.email)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                                title="Yasağı Kaldır"
                              >
                                Yasağı Kaldır
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setBanModal({
                                  open: true,
                                  type: 'nakliyeci',
                                  id: carrier.id,
                                  name: carrier.companyName,
                                  phone: carrier.phone,
                                  email: carrier.email,
                                  reason: ''
                                })}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                                title="Firmayı Yasakla (Kara Liste)"
                              >
                                <Ban className="w-3 h-3" />
                                Yasakla
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteModal({
                                open: true,
                                type: 'nakliyeci',
                                id: carrier.id,
                                name: carrier.companyName,
                                phone: carrier.phone,
                                email: carrier.email
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Firmayı ve Tüm İlanlarını Kalıcı Olarak Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Durum & Kaynak</th>
                    <th className="text-right px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((cust) => {
                    const isBanned = db.isBanned({ phone: cust.phone, email: cust.email, userId: cust.id }).isBanned;
                    return (
                      <tr key={cust.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">
                              {(cust.name || 'M').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-bold text-[#0A1128] block">{cust.name || 'Müşteri'}</span>
                              {isBanned && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded mt-0.5">
                                  <Ban className="w-2.5 h-2.5" /> YASAKLI
                                </span>
                              )}
                            </div>
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
                        <td className="px-5 py-4 text-slate-500 text-xs font-medium" suppressHydrationWarning>
                          {cust.lastRequest && !isNaN(new Date(cust.lastRequest).getTime())
                            ? new Date(cust.lastRequest).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
                            : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            {cust.source}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isBanned ? (
                              <button
                                type="button"
                                onClick={() => handleUnban(cust.id, cust.name, cust.phone, cust.email)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                                title="Yasağı Kaldır"
                              >
                                Yasağı Kaldır
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setBanModal({
                                  open: true,
                                  type: 'musteri',
                                  id: cust.id,
                                  name: cust.name,
                                  phone: cust.phone || '',
                                  email: cust.email || '',
                                  reason: ''
                                })}
                                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                                title="Müşteriyi Yasakla (Kara Liste)"
                              >
                                <Ban className="w-3 h-3" />
                                Yasakla
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteModal({
                                open: true,
                                type: 'musteri',
                                id: cust.id,
                                name: cust.name,
                                phone: cust.phone,
                                email: cust.email
                              })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Müşteriyi ve Taleplerini Kalıcı Olarak Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

      {/* Üye Yasaklama Modalı */}
      {banModal && (
        <Modal
          isOpen={banModal.open}
          onClose={() => setBanModal(null)}
          title={`Üye Yasakla (${banModal.type === 'nakliyeci' ? 'Firma' : 'Müşteri'})`}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-900 leading-relaxed font-medium">
                <strong>{banModal.name}</strong> üyesini yasaklamak üzeresiniz.
                <ul className="list-disc pl-4 mt-1.5 space-y-1 text-red-800">
                  {banModal.phone !== '—' && <li>Telefon: <strong>{banModal.phone}</strong> kara listeye eklenecek.</li>}
                  {banModal.email !== '—' && <li>E-posta: <strong>{banModal.email}</strong> kara listeye eklenecek.</li>}
                  <li>Bu kişi sisteme bir daha <strong>giriş yapamayacak ve tekrar kayıt olamayacaktır</strong>.</li>
                  <li>Bu üyeye ait tüm <strong>ilanlar, defter paylaşımları ve teklifler siteden derhal kaldırılacaktır</strong>.</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Yasaklama Gerekçesi (İsteğe Bağlı)
              </label>
              <input
                type="text"
                value={banModal.reason}
                onChange={e => setBanModal({ ...banModal, reason: e.target.value })}
                placeholder="Örn: Platform kuralları ihlali, sahte paylaşım..."
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBanModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Ban className="w-3.5 h-3.5" />
                Yasakla ve İlanlarını Temizle
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Üye Silme Modalı */}
      {deleteModal && (
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal(null)}
          title="Üyeyi Kalıcı Olarak Sil"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 leading-relaxed font-medium">
              <strong>{deleteModal.name}</strong> üyesini ve bu üyeye ait <strong>TÜM kayıtları</strong> (defter paylaşımları, taşınma talepleri, ilanlar, teklifler) kalıcı olarak silmek istediğinize emin misiniz?
              <div className="mt-2 text-rose-700 font-bold">
                ⚠️ Bu işlem geri alınamaz. Silinen kullanıcının profili ve ilanları siteden tamamen temizlenecektir.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
