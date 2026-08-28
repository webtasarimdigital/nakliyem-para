'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  ArrowRight,
  Clock,
  MessageSquare,
  CheckSquare,
  MapPin,
  Phone,
  Check,
  ChevronRight,
  Star,
  ShieldCheck,
  Calendar,
  Package,
  Truck,
  CircleDot,
  MoveRight,
  AlertCircle,
  Bell,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';

const TIMELINE_STAGES = [
  { key: 'talep', label: 'Talep Açıldı', done: true },
  { key: 'teklifler', label: 'Teklifler Geldi', done: true },
  { key: 'secim', label: 'Firma Seçildi', done: false, active: true },
  { key: 'yaklasıyor', label: 'Taşıma Yaklaşıyor', done: false },
  { key: 'gun', label: 'Taşıma Günü', done: false },
  { key: 'tamam', label: 'Tamamlandı', done: false },
  { key: 'yorum', label: 'Yorumla', done: false },
];

const DEMO_CHECKLIST = [
  { group: 'Taşınmaya 7 Gün', items: [
    { text: 'Elektrik aboneliğini yeni adrese yönlendir', done: true },
    { text: 'İnternet nakil işlemini başlat', done: false },
    { text: 'Değerli eşyaları güvenli yere ayır', done: false },
    { text: 'Buzdolabını boşaltmayı planla', done: false },
  ]},
  { group: 'Taşınmaya 1 Gün', items: [
    { text: 'Firma ile saati doğrula', done: false },
    { text: 'Anahtarları hazırla', done: false },
    { text: 'Kişisel çantanı hazırla', done: false },
  ]},
];

export default function CustomerDashboard() {
  const requests = db.getRequests();
  const activeRequest = requests.find(r => r.status === 'ACTIVE') || requests[0];
  const offers = activeRequest ? db.getOffersForRequest(activeRequest.id) : [];
  const acceptedOffer = offers.find(o => o.status === 'ACCEPTED') || offers[0];

  const [checkItems, setCheckItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (key: string) => {
    setCheckItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── TOP: Welcome + CTA ───────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Taşınma Merkezim</p>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">Merhaba 👋</h1>
          </div>
          <Link href="/teklif-al">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />} className="font-black">
              Yeni Taşıma Talebi
            </Button>
          </Link>
        </div>

        {activeRequest ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Ana İçerik (2/3) ──────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Aktif Talep Kartı */}
              <div className="bg-white rounded-2xl border-2 border-[#F95700]/20 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#F95700] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                      {activeRequest.requestCode}
                    </span>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Aktif — Teklif Alıyor
                    </span>
                  </div>
                  <Link href="/app/customer/taleplerim" className="text-xs font-bold text-slate-400 hover:text-[#F95700] transition-colors">
                    Detay →
                  </Link>
                </div>

                <RouteDisplay
                  originCity={activeRequest.originCity}
                  originDistrict={activeRequest.originDistrict}
                  destinationCity={activeRequest.destinationCity}
                  destinationDistrict={activeRequest.destinationDistrict}
                  size="lg"
                />

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{activeRequest.movingDate}</span>
                  <span>·</span>
                  <span>{activeRequest.homeSize} Ev</span>
                  <span>·</span>
                  <span className="text-[#F95700] font-black">{offers.length} Teklif Bekleniyor</span>
                </div>
              </div>

              {/* Taşınma Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h2 className="font-black text-[#0A1128] text-base mb-4">Taşınma Durumu</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-200" />

                  <div className="space-y-3">
                    {TIMELINE_STAGES.map((stage, i) => (
                      <div key={stage.key} className="flex items-center gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 border-2 transition-all ${
                          stage.done
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : stage.active
                              ? 'bg-[#F95700] border-[#F95700] text-white'
                              : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                          {stage.done ? (
                            <Check className="w-4 h-4" />
                          ) : stage.active ? (
                            <CircleDot className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-black">{i + 1}</span>
                          )}
                        </div>
                        <span className={`text-sm font-bold ${
                          stage.done ? 'text-emerald-700' : stage.active ? 'text-[#F95700]' : 'text-slate-400'
                        }`}>
                          {stage.label}
                        </span>
                        {stage.active && (
                          <span className="text-[10px] font-black text-[#F95700] bg-orange-50 px-2 py-0.5 rounded-full ml-auto">
                            Şu An
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Teklifler Özeti */}
              {offers.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="flex items-center justify-between p-5 pb-0">
                    <h2 className="font-black text-[#0A1128] text-base">Gelen Teklifler ({offers.length})</h2>
                    <Link href="/app/customer/teklifler">
                      <Button variant="primary" size="sm" className="font-black text-xs">
                        Karşılaştır & Seç
                      </Button>
                    </Link>
                  </div>

                  <div className="p-5 space-y-3">
                    {offers.slice(0, 3).map((offer, i) => (
                      <div key={offer.id} className={`flex items-center justify-between p-3.5 rounded-xl border ${i === 0 ? 'border-[#F95700]/30 bg-orange-50/50' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-[#F95700] text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900">{offer.carrier.companyName}</p>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                              <span className="text-xs text-slate-500 font-medium">{offer.carrier.rating}</span>
                              <span className="text-xs text-slate-300">·</span>
                              <span className="text-xs text-slate-500 font-medium">{offer.estimatedDeliveryDuration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-black text-base ${i === 0 ? 'text-[#F95700]' : 'text-slate-900'}`}>
                            {offer.price.toLocaleString('tr-TR')} TL
                          </p>
                          <div className="flex gap-1 mt-0.5 justify-end">
                            {offer.isPackagingIncluded && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-black">Paket</span>}
                            {offer.isInsuranceIncluded && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-black">Sigorta</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="w-5 h-5 text-[#F95700]" />
                  <h2 className="font-black text-[#0A1128] text-base">Taşınma Kontrol Listesi</h2>
                </div>

                {DEMO_CHECKLIST.map((group, gi) => (
                  <div key={gi} className={gi > 0 ? 'mt-5 pt-5 border-t border-slate-100' : ''}>
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">{group.group}</h3>
                    <div className="space-y-2">
                      {group.items.map((item, ii) => {
                        const key = `${gi}-${ii}`;
                        const checked = checkItems[key] ?? item.done;
                        return (
                          <label key={ii} className="flex items-center gap-3 cursor-pointer group">
                            <div
                              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-[#F95700]'
                              }`}
                              onClick={() => toggleCheck(key)}
                            >
                              {checked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm font-medium ${checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                              {item.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Sidebar (1/3) ─────────────────────────── */}
            <div className="space-y-4">

              {/* Seçilen Firma Kartı (eğer varsa) */}
              {acceptedOffer ? (
                <div className="bg-[#0A1128] rounded-2xl p-5 text-white">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Seçilen Firma</p>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F95700] flex items-center justify-center font-black text-xl text-white">
                      {acceptedOffer.carrier.companyName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-white text-sm">{acceptedOffer.carrier.companyName}</p>
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-bold">Onaylı Firma</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-white/10 mb-2">
                    <span className="text-xs text-slate-400 font-medium">Toplam Fiyat</span>
                    <span className="font-black text-[#F95700] text-lg">{acceptedOffer.price.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={`tel:${acceptedOffer.carrier.phone}`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full font-bold" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Ara
                      </Button>
                    </a>
                    <Link href="/app/customer/mesajlar" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full font-bold border-white/20 text-white hover:bg-white/10" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                        Mesaj
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-5 text-center">
                  <Truck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="font-bold text-slate-500 text-sm mb-1">Henüz firma seçilmedi</p>
                  <p className="text-xs text-slate-400 font-medium mb-3">Teklifleri karşılaştırıp en iyi firmayı seçin.</p>
                  <Link href="/app/customer/teklifler">
                    <Button variant="primary" size="sm" className="font-black w-full">
                      Teklifleri Gör
                    </Button>
                  </Link>
                </div>
              )}

              {/* Hızlı Linkler */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                <h3 className="font-black text-xs text-slate-500 uppercase tracking-wider mb-3">Hızlı Erişim</h3>
                <div className="space-y-1">
                  {[
                    { href: '/app/customer/teklifler', icon: FileText, label: 'Teklifleri Karşılaştır' },
                    { href: '/app/customer/taleplerim', icon: Package, label: 'Taleplerim' },
                    { href: '/app/customer/mesajlar', icon: MessageSquare, label: 'Mesajlar' },
                    { href: '/app/customer/bildirimler', icon: Bell, label: 'Bildirimler' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.href} href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#F95700] transition-all group">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition-colors" />
                        <span className="text-sm font-bold">{item.label}</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Ipucu */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs text-orange-900 font-medium leading-relaxed">
                <strong className="block font-black mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Teklif İpucu
                </strong>
                En ucuz teklif her zaman en iyi değildir. Paketleme, sigorta ve asansör dahil mi kontrol edin.
              </div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
            <Truck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="font-black text-slate-700 text-xl mb-2">Henüz taşıma talebiniz yok</h2>
            <p className="text-slate-500 font-medium mb-6">Ücretsiz teklif alın, onlarca firmayı karşılaştırın.</p>
            <Link href="/teklif-al">
              <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/15"
                rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
