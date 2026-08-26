'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  BookOpen, 
  Bell, 
  CheckSquare, 
  Award, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';

export default function CarrierDashboard() {
  const carrier = db.getCarriers()[0]; // Demo carrier (Boğaziçi)
  const requests = db.getRequests().filter(r => r.status === 'ACTIVE');
  const offers = db.getOffersForCarrier(carrier.id);
  const defterPosts = db.getDefterPosts();
  const alarms = db.getAlarmsForCarrier(carrier.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Welcome Header (Spec Item 92) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Merhaba, {carrier.companyName}
            </h1>
            {carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
            <Badge variant="verified" size="sm" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Bugün bölgenizde ve rotalarınızda <strong className="text-[#146EF5]">{requests.length} yeni taşıma işi</strong> ve <strong className="text-amber-600">{defterPosts.length} aktif Defter paylaşımı</strong> bulunuyor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/carrier/defter?action=create">
            <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Boş Araç Paylaş
            </Button>
          </Link>
          <Link href="/app/carrier/isler">
            <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              İşleri İncele
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick 4 KPI Cards (Spec Item 92) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/app/carrier/isler" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#146EF5] transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Uygun İşler</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#146EF5] group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{requests.length}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Talepleri İncele →</span>
        </Link>

        <Link href="/app/carrier/tekliflerim" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#146EF5] transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Aktif Tekliflerim</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{offers.length}</span>
          <span className="text-[11px] text-slate-400">Sonuç Bekleyenler</span>
        </Link>

        <Link href="/app/carrier/alarmlar" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#146EF5] transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Alarm Eşleşmeleri</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">6</span>
          <span className="text-[11px] text-amber-600 font-semibold">Son 7 günde</span>
        </Link>

        <Link href="/app/carrier/abonelik" className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#146EF5] transition-all shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Üyelik Durumu</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-[#0B3B8F] block">GOLD Üyelik</span>
          <span className="text-[11px] text-emerald-600 font-semibold">Aktif • 25 Gün Kaldı</span>
        </Link>
      </div>

      {/* Main Grid: Jobs Feed on Left, Sidebars on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Feed of Available Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Size Uygun Yeni Taşıma İşleri</h2>
            <Link href="/app/carrier/isler" className="text-xs font-bold text-[#146EF5] hover:underline">
              Tümünü Filtrele ({requests.length}) →
            </Link>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-5 sm:p-6 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {req.requestCode}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Yeni İş
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">{req.homeSize} Ev</span>
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

                  <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">{req.movingDate}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                      {req.originHasElevator ? 'Asansör Var' : 'Merdiven'}
                    </span>
                    {req.photos.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                        📷 Fotoğraflı
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                  <span className="text-xs text-slate-500 font-medium">
                    {req.offersCount} firma teklif verdi
                  </span>

                  <Link href={`/app/carrier/isler/${req.id}`}>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      İşi İncele & Teklif Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Quick Carrier Tools */}
        <div className="space-y-6">
          {/* Boş Dönüş Paylaşımı Widget (Spec Item 89) */}
          <div className="bg-gradient-to-br from-[#0D1B2A] to-[#0B3B8F] rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Boş Dönüşünüz Var mı?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Dönüş rotanızı Defter&apos;e kaydedin, güzergâhınız üzerindeki uygun yük ve parça eşya talepleriyle anında eşleşin.
            </p>
            <Link href="/app/carrier/defter?action=create">
              <Button variant="gold" size="sm" className="w-full">
                Boş Araç / Rota Ekle
              </Button>
            </Link>
          </div>

          {/* İşini Büyüt (Digital Services Upsell - Spec Item 100) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Firmanızı Dijitalde Büyütün</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Google Ads ve web sitesi kurulumu ile bölgenizde nakliye arayan müşterilere platform dışında da doğrudan ulaşın.
            </p>
            <Link href="/app/carrier/isini-buyut">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Dijital Hizmetleri İncele →
              </Button>
            </Link>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Abonelik Avantajlarınız</h3>
              <Badge variant="gold" size="sm" />
            </div>
            <ul className="text-xs text-slate-600 space-y-2 mb-4">
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Sınırsız Teklif Verme Hakkı</li>
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Müşteri Telefon Numaralarına Doğrudan Erişim</li>
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Ana Sayfa & Defter Sponsorlu Reklamı</li>
              <li className="flex items-center gap-1.5 text-emerald-700 font-medium">✓ Sınırsız Rota Alarmları</li>
            </ul>
            <Link href="/app/carrier/abonelik">
              <span className="text-xs font-bold text-[#146EF5] hover:underline block text-center">
                Aboneliği Yönet →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
