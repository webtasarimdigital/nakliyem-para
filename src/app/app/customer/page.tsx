'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  ArrowRight,
  MessageSquare,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Settings,
  FileText,
  DollarSign,
  Star,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';

export default function CustomerDashboard() {
  const router = useRouter();
  const currentUser = db.getCurrentUser();
  const requests = db.getRequests();
  const offers = db.getOffers();

  const handleLogout = () => {
    db.setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP HEADER: Taşınma Taleplerim + CTA ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Müşteri Paneli</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              Taşınma Taleplerim
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Yayınladığınız nakliye taleplerini ve gelen teklifleri buradan yönetin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/teklif-al">
              <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />} className="font-black shadow-md shadow-orange-900/20">
                Yeni Taşıma Talebi Aç
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 2-COLUMN LAYOUT: Content (8/12) + Quick Nav (4/12) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Requests List (8/12) */}
          <div className="lg:col-span-8 space-y-5">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Aktif &amp; Geçmiş Talepler ({requests.length})
              </h2>
            </div>

            {requests.length > 0 ? (
              requests.map((req) => {
                const reqOffers = db.getOffersForRequest(req.id);
                const hasAccepted = reqOffers.some(o => o.status === 'ACCEPTED');
                const photoUrl = req.photos && req.photos.length > 0 ? req.photos[0] : '/mock-photos/moving_room_1.jpg';

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700]/50 p-5 sm:p-6 transition-all shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-black text-[#F95700] bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-200">
                          {req.requestCode}
                        </span>
                        <Badge variant={req.status === 'ACTIVE' ? 'verified' : req.status === 'ASSIGNED' ? 'success' : 'danger'} size="sm">
                          {req.status === 'ACTIVE' ? 'Yayında — Teklif Alıyor' : req.status === 'ASSIGNED' ? 'Firma Seçildi' : 'Kapatıldı'}
                        </Badge>
                        <span className="text-xs font-bold text-slate-500">• {req.homeSize} Ev Eşyası</span>
                      </div>

                      <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Taşıma: {req.movingDate}</span>
                      </div>
                    </div>

                    {/* Image & Route Split */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shrink-0">
                        <img
                          src={photoUrl}
                          alt="Taşıma Eşyaları"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80';
                          }}
                        />
                        {req.photos && req.photos.length > 0 && (
                          <span className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                            📷 {req.photos.length}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <RouteDisplay
                          originCity={req.originCity}
                          originDistrict={req.originDistrict}
                          destinationCity={req.destinationCity}
                          destinationDistrict={req.destinationDistrict}
                          size="md"
                        />
                        {req.notes && (
                          <p className="text-xs text-slate-500 line-clamp-2 italic">
                            "{req.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Offers Summary & CTA Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 bg-slate-50/50 -mx-5 -mb-5 p-4 rounded-b-3xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center font-black text-xs">
                          {reqOffers.length}
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-800 block">
                            {reqOffers.length > 0 ? `${reqOffers.length} Nakliye Firması Teklif Verdi` : 'Henüz Teklif Gelmedi'}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {reqOffers.length > 0 ? 'Firmaların fiyatlarını ve puanlarını kıyaslayın' : 'Talebiniz bölgedeki onaylı nakliyecilere iletildi'}
                          </span>
                        </div>
                      </div>

                      <Link href={`/app/customer/taleplerim/${req.id}`}>
                        <button className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0A1128] hover:bg-[#132247] text-white font-black text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                          <span>{reqOffers.length > 0 ? 'Teklifleri Gör & Onayla' : 'Talebi İncele'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
                <Truck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-800">Henüz bir taşıma talebiniz yok</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Evden eve veya ofis taşıma ihtiyacınız için dakikalar içinde ücretsiz talep açın, güvenilir nakliyecilerden teklif toplayın.
                </p>
                <Link href="/teklif-al">
                  <Button variant="primary" size="md">Ücretsiz Teklif Al</Button>
                </Link>
              </div>
            )}

          </div>

          {/* RIGHT: Clean Simplified Navigation (4/12) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* User Profile Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-white flex items-center justify-center font-black text-base shadow-sm">
                  {currentUser?.email ? currentUser.email[0].toUpperCase() : 'M'}
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-black text-slate-900 truncate">
                    {currentUser?.email || 'Müşteri Hesabı'}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ✓ Doğrulanmış Müşteri
                  </span>
                </div>
              </div>

              {/* Menü Öğeleri: Profilim, Taşınma Taleplerim, Gelen Talepler, Mesajlar, Ayarlar, Çıkış */}
              <nav className="space-y-1 text-xs font-bold">
                <Link
                  href="/app/customer/profil"
                  className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Profilim</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  href="/app/customer/taleplerim"
                  className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/70 text-[#F95700] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#F95700]" />
                    <span>Taşınma Taleplerim</span>
                  </div>
                  <span className="text-[11px] font-black bg-white px-2 py-0.5 rounded-md border border-orange-200">
                    {requests.length}
                  </span>
                </Link>

                <Link
                  href="/app/customer/teklifler"
                  className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>Gelen Teklifler</span>
                  </div>
                  <span className="text-[11px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                    {offers.length}
                  </span>
                </Link>

                <Link
                  href="/app/customer/mesajlar"
                  className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <span>Mesajlar</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <Link
                  href="/app/customer/profil"
                  className="flex items-center justify-between p-3 rounded-2xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Ayarlar</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </nav>
            </div>

            {/* Güvenli Taşıma Bilgi Kartı */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#070D1E] to-[#0A1128] text-white space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Güvenli Anlaşma Kuralı</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Sistem üzerinden onayladığınız tekliflerde nakliyeci ile doğrudan sözleşme ve sigorta poliçesi güvencesi altına alınırsınız.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
