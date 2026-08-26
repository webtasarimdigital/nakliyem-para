'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  FileText, 
  CheckSquare, 
  Award, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  Clock,
  Layers,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function AdminDashboardPage() {
  const carriers = db.getCarriers();
  const requests = db.getRequests();
  const pendingDocs = db.getDocuments().filter(d => d.status === 'PENDING');
  const leads = db.getLeads();
  const campaigns = db.getAdCampaigns();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#146EF5] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Yönetim Paneli
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Sistem Operasyon Özeti
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Doğrulama bekleyen nakliyeciler, açık müşteri talepleri ve dijital lead boru hattı.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/dogrulamalar">
            <Button variant="primary" size="sm" leftIcon={<ShieldCheck className="w-4 h-4" />}>
              Doğrulamalar ({pendingDocs.length})
            </Button>
          </Link>
          <Link href="/admin/dijital-hizmetler">
            <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
              CRM Leadler ({leads.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards (Spec Item 166) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Doğrulama Bekleyenler</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{pendingDocs.length}</span>
          <span className="text-[11px] text-amber-600 font-semibold">İnceleme Bekliyor</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Aktif Talepler</span>
            <div className="p-2 rounded-lg bg-blue-50 text-[#146EF5]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{requests.filter(r => r.status === 'ACTIVE').length}</span>
          <span className="text-[11px] text-blue-600 font-semibold">Teklif Topluyor</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Kayıtlı Firmalar</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{carriers.length}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">2 Gold, 2 Pro</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Dijital Hizmet Talepleri</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 block">{leads.length}</span>
          <span className="text-[11px] text-purple-600 font-semibold">Google Ads & Web</span>
        </div>
      </div>

      {/* Actionable Blocks (Spec Item 166) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Belge Onayı Bekleyen Firmalar</h2>
            </div>
            <Link href="/admin/dogrulamalar" className="text-xs font-bold text-[#146EF5] hover:underline">
              Konsola Git →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingDocs.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{doc.title}</span>
                  <span className="text-slate-500">{doc.fileName} • 2 saat önce</span>
                </div>
                <Link href="/admin/dogrulamalar">
                  <Button variant="primary" size="sm">
                    İncele & Onayla
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Growth CRM Leads Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#146EF5]" />
              <h2 className="text-base font-bold text-slate-900">Son Dijital Pazarlama Leadleri</h2>
            </div>
            <Link href="/admin/dijital-hizmetler" className="text-xs font-bold text-[#146EF5] hover:underline">
              CRM Boru Hattı →
            </Link>
          </div>

          <div className="space-y-3">
            {leads.map((l) => (
              <div key={l.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{l.companyName}</span>
                  <span className="text-slate-500">{l.serviceTitle} • {l.phone}</span>
                </div>
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Quick Links */}
      <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
        <Link href="/admin/paketler" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#146EF5] text-slate-800 hover:text-[#146EF5] flex items-center gap-2">
          <Award className="w-4 h-4" /> Paket & Özellikler
        </Link>
        <Link href="/admin/reklamlar" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#146EF5] text-slate-800 hover:text-[#146EF5] flex items-center gap-2">
          <Layers className="w-4 h-4" /> Reklam Alanları
        </Link>
        <Link href="/admin/icerik" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#146EF5] text-slate-800 hover:text-[#146EF5] flex items-center gap-2">
          <FileText className="w-4 h-4" /> İçerik & App Bar
        </Link>
        <Link href="/admin/ayarlar" className="p-4 rounded-xl bg-white border border-slate-200 hover:border-[#146EF5] text-slate-800 hover:text-[#146EF5] flex items-center gap-2">
          <Settings className="w-4 h-4" /> Sistem Ayarları
        </Link>
      </div>
    </div>
  );
}
