'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  Truck,
  FileText,
  ShieldCheck,
  Award,
  DollarSign,
  Settings,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  LogOut,
  BarChart3,
  UserCheck,
  UserX,
  RefreshCw,
  Home,
} from 'lucide-react';
import { db, SEED_PLANS } from '@/lib/data/mock-db';

// Gelir hesaplama yardımcıları
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

const PLAN_COLORS: Record<string, string> = {
  plan_starter: 'bg-slate-500',
  plan_pro: 'bg-blue-500',
  plan_gold: 'bg-amber-500',
};

function AdminNavbar({ onLogout }: { onLogout: () => void }) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      localStorage.removeItem('admin_token_active');
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      onLogout();
      setLoggingOut(false);
    }
  };

  return (
    <div className="bg-[#0A1128] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#F95700] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-sm tracking-tight truncate">Nakliyem Para <span className="text-[#F95700]">Admin</span></span>
      </div>

      <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-400">
        <Link href="/admin" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-white">
          Dashboard
        </Link>
        <Link href="/admin/uyeler" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
          Üyeler
        </Link>
        <Link href="/admin/gelir" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
          Gelir
        </Link>
        <Link href="/admin/dogrulamalar" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
          Doğrulamalar
        </Link>
        <Link href="/admin/paketler" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
          Paketler
        </Link>
        <Link href="/admin/ayarlar" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
          Ayarlar
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        {loggingOut ? 'Çıkılıyor...' : 'Çıkış'}
      </button>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('admin_token_active') === 'true') {
      setIsAuthenticated(true);
    }
    fetch('/api/admin/login')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          localStorage.setItem('admin_token_active', 'true');
        } else if (localStorage.getItem('admin_token_active') !== 'true') {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (localStorage.getItem('admin_token_active') !== 'true') {
          setIsAuthenticated(false);
        }
      });
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('admin_token_active', 'true');
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Kullanıcı adı veya şifre hatalı.');
      }
    } catch {
      setLoginError('Bağlantı hatası oluştu.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Yükleniyor durumu
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Giriş yapılmamışsa doğrudan burada güvenli Giriş Ekranı göster
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A1128] via-[#0F1A3E] to-[#1a2a5e] flex items-center justify-center p-4 overflow-x-hidden">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F95700] shadow-lg shadow-orange-900/40 mb-3 sm:mb-4">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Yönetici Paneli</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">Lütfen yetkili giriş bilgilerinizi giriniz.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                  Şifre
                </label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#F95700] hover:bg-[#e04d00] text-white font-black rounded-xl py-3.5 text-sm transition-all disabled:opacity-60 shadow-lg shadow-orange-900/20 mt-2 cursor-pointer"
              >
                {loginLoading ? 'Kontrol ediliyor...' : 'Yönetim Paneline Gir'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 text-[11px] mt-6 font-medium">
            Güvenli Yönetim Protokolü • Sadece Yetkili Personel
          </p>
        </div>
      </div>
    );
  }

  const carriers = db.getCarriers();
  const requests = db.getRequests();
  const pendingDocs = db.getDocuments().filter(d => d.status === 'PENDING');
  const leads = db.getLeads();

  // --- Nakliyeci Segmentasyonu ---
  const approvedCarriers = carriers.filter(c => c.verificationStatus === 'APPROVED');
  const pendingCarriers = carriers.filter(c => c.verificationStatus === 'PENDING');

  const goldCarriers = approvedCarriers.filter(c => c.planId === 'plan_gold');
  const proCarriers = approvedCarriers.filter(c => c.planId === 'plan_pro');
  const starterCarriers = approvedCarriers.filter(c => c.planId === 'plan_starter');

  // --- Gelir Hesaplama (aktif onaylı nakliyecilerden) ---
  const monthlyRevenue = approvedCarriers.reduce((sum, c) => {
    return sum + (PLAN_PRICES[c.planId] || 0);
  }, 0);
  const annualRevenue = monthlyRevenue * 12;

  // --- Müşteri (Talep Açmış Benzersiz Kullanıcılar) ---
  const uniqueCustomerIds = new Set(requests.map(r => r.customerId));
  const totalCustomers = uniqueCustomerIds.size;
  const activeRequests = requests.filter(r => r.status === 'ACTIVE').length;
  const closedRequests = requests.filter(r => r.status === 'CLOSED').length;

  // --- Mock monthly breakdown (simulated) ---
  const mockChurnCount = 2;
  const mockTrialCount = 3;
  const mockNewThisMonth = 4;
  const mockRenewedCount = approvedCarriers.length - mockNewThisMonth;

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      <AdminNavbar onLogout={() => setIsAuthenticated(false)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#F95700] mb-1">Operasyon Merkezi</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Sistem Genel Bakış</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Bugün {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/uyeler">
              <button className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:border-[#F95700] hover:text-[#F95700] transition-colors">
                <Users className="w-3.5 h-3.5" /> Üye Yönetimi
              </button>
            </Link>
            <Link href="/admin/gelir">
              <button className="flex items-center gap-1.5 bg-[#F95700] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#e04d00] transition-colors shadow-lg shadow-orange-900/20">
                <BarChart3 className="w-3.5 h-3.5" /> Gelir Raporu
              </button>
            </Link>
          </div>
        </div>

        {/* --- Ana Gelir KPI'ları --- */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">💰 Gelir Özeti</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Aylık Gelir (MRR)</span>
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1128] block">
                {monthlyRevenue.toLocaleString('tr-TR')}₺
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Aktif Abonelikler</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Yıllık Tahmini (ARR)</span>
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1128] block">
                {(annualRevenue / 1000).toFixed(0)}K₺
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">MRR × 12 ay</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Bu Ay Yeniledi</span>
                <div className="p-2 rounded-lg bg-[#F95700]/10 text-[#F95700]">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1128] block">{mockRenewedCount}</span>
              <span className="text-[11px] text-[#F95700] font-semibold">Abonelik Yenileme</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">Ortalama Gelir/Firma</span>
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-[#0A1128] block">
                {approvedCarriers.length > 0
                  ? Math.round(monthlyRevenue / approvedCarriers.length).toLocaleString('tr-TR')
                  : 0}₺
              </span>
              <span className="text-[11px] text-purple-600 font-semibold">ARPU / Ay</span>
            </div>
          </div>
        </div>

        {/* --- Üye KPI'ları --- */}
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">👥 Üye Özeti</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Toplam Müşteri', value: totalCustomers, icon: Home, color: 'bg-slate-50 text-slate-600', badge: 'Taşıttıran', badgeColor: 'text-slate-500' },
              { label: 'Toplam Nakliyeci', value: carriers.length, icon: Truck, color: 'bg-orange-50 text-[#F95700]', badge: 'Kayıtlı Firma', badgeColor: 'text-[#F95700]' },
              { label: 'Aktif Nakliyeci', value: approvedCarriers.length, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', badge: 'Onaylı + Aktif', badgeColor: 'text-emerald-600' },
              { label: 'Onay Bekleyen', value: pendingCarriers.length, icon: Clock, color: 'bg-amber-50 text-amber-600', badge: 'İnceleme Gerek', badgeColor: 'text-amber-600' },
              { label: 'Deneme Sürümü', value: mockTrialCount, icon: AlertCircle, color: 'bg-blue-50 text-blue-600', badge: '7 Gün Trial', badgeColor: 'text-blue-600' },
              { label: 'Bu Ay İptal', value: mockChurnCount, icon: UserX, color: 'bg-red-50 text-red-500', badge: 'Churn', badgeColor: 'text-red-500' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-2xl font-black text-[#0A1128] block">{item.value}</span>
                <span className="text-[10px] font-black text-slate-600 block leading-tight">{item.label}</span>
                <span className={`text-[10px] font-semibold ${item.badgeColor}`}>{item.badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Abonelik Hunisi --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paket Dağılımı */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-slate-900">Nakliyeci Abonelik Dağılımı</h2>
              </div>
              <Link href="/admin/uyeler" className="text-xs font-bold text-[#146EF5] hover:underline">
                Tümünü Gör →
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Gold', count: goldCarriers.length, price: 4850, planId: 'plan_gold' },
                { label: 'Pro', count: proCarriers.length, price: 2450, planId: 'plan_pro' },
                { label: 'Başlangıç', count: starterCarriers.length, price: 1250, planId: 'plan_starter' },
                { label: 'Deneme (Trial)', count: mockTrialCount, price: 0, planId: 'trial' },
                { label: 'İptal / Churn', count: mockChurnCount, price: 0, planId: 'churn' },
              ].map((tier) => {
                const total = carriers.length + mockTrialCount + mockChurnCount;
                const pct = total > 0 ? Math.round((tier.count / total) * 100) : 0;
                const barColor = tier.planId === 'plan_gold' ? 'bg-amber-400'
                  : tier.planId === 'plan_pro' ? 'bg-blue-500'
                  : tier.planId === 'plan_starter' ? 'bg-slate-400'
                  : tier.planId === 'trial' ? 'bg-indigo-400'
                  : 'bg-red-400';

                return (
                  <div key={tier.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-700">{tier.label}</span>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span className="font-semibold">{tier.count} firma</span>
                        {tier.price > 0 && (
                          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                            {(tier.count * tier.price).toLocaleString('tr-TR')}₺/ay
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all`}
                        style={{ width: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Talep & Platform Aktivitesi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F95700]" />
                <h2 className="font-bold text-slate-900">Platform Aktivitesi</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Aktif Taşıma Talebi', value: activeRequests, icon: FileText, color: 'text-[#F95700] bg-orange-50' },
                { label: 'Tamamlanan Taşıma', value: closedRequests, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
                { label: 'Bekleyen Belge Onayı', value: pendingDocs.length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                { label: 'Dijital Hizmet Talebi', value: leads.length, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center mb-2`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xl font-black text-[#0A1128]">{item.value}</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-tight mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Bu ay yeni üyeler */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-2">Bu Ay</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  +{mockNewThisMonth} yeni nakliyeci
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                  <XCircle className="w-3.5 h-3.5" />
                  {mockChurnCount} iptal
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Belge Onayı + Son Talepler --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Belge Onayı */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <h2 className="font-bold text-slate-900">Belge Onayı Bekleyen</h2>
                {pendingDocs.length > 0 && (
                  <span className="text-[10px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {pendingDocs.length}
                  </span>
                )}
              </div>
              <Link href="/admin/dogrulamalar" className="text-xs font-bold text-[#146EF5] hover:underline">
                Konsola Git →
              </Link>
            </div>

            {pendingDocs.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-500">Bekleyen belge yok 🎉</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingDocs.slice(0, 4).map((doc) => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between text-xs gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{doc.title}</span>
                      <span className="text-slate-500">{doc.fileName}</span>
                    </div>
                    <Link href="/admin/dogrulamalar">
                      <button className="shrink-0 bg-[#F95700] text-white text-[11px] font-black px-3 py-1.5 rounded-lg hover:bg-[#e04d00] transition-colors">
                        İncele
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Son Müşteri Talepleri */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F95700]" />
                <h2 className="font-bold text-slate-900">Son Müşteri Talepleri</h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {requests.slice(0, 4).map((req) => (
                <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block">{req.customerName}</span>
                    <span className="text-slate-500">{req.originCity} → {req.destinationCity} • {req.homeSize}</span>
                  </div>
                  <span className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-black ${
                    req.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700'
                    : req.status === 'CLOSED' ? 'bg-slate-200 text-slate-600'
                    : 'bg-blue-100 text-blue-700'
                  }`}>
                    {req.status === 'ACTIVE' ? 'Aktif' : req.status === 'CLOSED' ? 'Kapandı' : req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Alt Hızlı Linkler --- */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { href: '/admin/paketler', icon: Award, label: 'Paket & Özellikler' },
            { href: '/admin/reklamlar', icon: Layers, label: 'Reklam Alanları' },
            { href: '/admin/icerik', icon: FileText, label: 'İçerik & App Bar' },
            { href: '/admin/ayarlar', icon: Settings, label: 'Sistem Ayarları' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#F95700] hover:text-[#F95700] text-slate-700 flex items-center gap-2 text-xs font-bold transition-colors group"
            >
              <item.icon className="w-4 h-4 group-hover:text-[#F95700] transition-colors" />
              {item.label}
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
