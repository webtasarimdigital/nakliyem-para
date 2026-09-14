'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  MapPin,
  Clock,
  Check,
  Star,
  ShieldCheck,
  Calendar,
  Bell,
  MessageSquare,
  Phone,
  Truck,
  Plus,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  MoveRight,
  Circle,
  CheckCircle2,
  Zap,
  BookOpen,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { db } from '@/lib/data/mock-db';

// Rule-based rota eşleşme skoru simülasyonu
function calcMatchScore(request: { originCity: string; destinationCity: string; serviceCategory: string }, carrier: { city: string; serviceAreas: string[]; services: string[] }) {
  let score = 0;
  const reasons: string[] = [];

  if (carrier.serviceAreas.includes(request.originCity) || carrier.serviceAreas.includes('TÜM_TÜRKİYE')) {
    score += 35;
    reasons.push('Hizmet bölgenizde');
  }
  if (carrier.serviceAreas.includes(request.destinationCity) || carrier.serviceAreas.includes('TÜM_TÜRKİYE')) {
    score += 25;
    reasons.push('Varış şehrinizde aktifsiniz');
  }
  if (carrier.city === request.originCity) {
    score += 15;
    reasons.push('Çıkış şehrinizdesiniz');
  }
  // Müsaitlik: demo için +15
  score += 15;
  reasons.push('Talep tarihinde müsaitsiniz');

  const svcMap: Record<string, string> = {
    EVDEN_EVE: 'evden-eve',
    OFIS_TASIMA: 'ofis-tasima',
    PARCA_ESYA: 'parca-esya',
    ESYA_DEPOLAMA: 'depolama',
  };
  if (carrier.services.includes(svcMap[request.serviceCategory])) {
    score += 10;
    reasons.push('Bu hizmeti veriyorsunuz');
  }

  return { score: Math.min(score, 100), reasons };
}

export default function CarrierDashboard() {
  const router = useRouter();
  const currentUser = typeof window !== 'undefined' ? db.getCurrentUser() : null;
  const carrier = db.getCurrentCarrier() || (currentUser?.role === 'CARRIER' ? db.getCarriers().find(c => c.userId === currentUser?.id || c.id === currentUser?.carrierProfileId) : null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/giris?role=nakliyeci');
      return;
    }
    if (currentUser.role !== 'CARRIER') {
      router.push('/musteri');
      return;
    }
    if (!carrier || !carrier.isProfileCompleted || !carrier.companyName) {
      router.push('/nakliyeci/onboarding');
      return;
    }
  }, [currentUser, carrier, router]);

  const [availabilityDays, setAvailabilityDays] = useState<Record<string, 'MUSAIT' | 'DOLU'>>({
    '2026-09-12': 'MUSAIT',
    '2026-09-14': 'DOLU',
    '2026-09-15': 'MUSAIT',
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshTrigger(k => k + 1);
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('offer-added', handleRefresh);
    window.addEventListener('auth-changed', handleRefresh);
    window.addEventListener('focus', handleRefresh);
    return () => {
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('offer-added', handleRefresh);
      window.removeEventListener('auth-changed', handleRefresh);
      window.removeEventListener('focus', handleRefresh);
    };
  }, []);

  if (!currentUser || !carrier) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F95700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const requests = db.getRequests().filter(r => r.status === 'ACTIVE');
  const rawMyOffers = db.getOffersForCarrier(carrier.id);
  const myOffers = Array.from(new Map(rawMyOffers.map(o => [o.id, o])).values());
  const defterPosts = db.getDefterPosts().filter(p => p.carrierId === carrier.id);
  const alarms = db.getAlarmsForCarrier(carrier.id);

  // Evrak ve Onay Kontrolü (Yönetici onayı varsa firma onaylıdır)
  const carrierDocs = db.getDocumentsForCarrier(carrier.id);
  const hasTaxDoc = carrierDocs.some(d => d.type === 'TAX_CERTIFICATE') || Boolean(carrier.verificationBadges?.taxVerified);
  const hasIdDoc = carrierDocs.some(d => d.type === 'IDENTITY') || Boolean(carrier.verificationBadges?.identityVerified);
  const isApproved = carrier.verificationStatus === 'APPROVED' || (hasTaxDoc && hasIdDoc);

  const isGold = carrier.planId === 'plan_gold' || carrier.planId === 'gold';
  const isPro = carrier.planId === 'plan_pro' || carrier.planId === 'pro';
  const isStarter = !isGold && !isPro;

  // Günlük teklif kotası (Başlangıç paketinde günde 3 teklif)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayActiveOffers = myOffers.filter(o => o.createdAt && o.createdAt.startsWith(todayStr) && o.status !== 'WITHDRAWN');
  const uniqueRequestsOfferedToday = new Set(todayActiveOffers.map(o => o.requestId)).size;
  const dailyFreeLimit = 3;
  const remainingFreeOffers = isStarter ? Math.max(0, dailyFreeLimit - uniqueRequestsOfferedToday) : 'Sınırsız';

  // Matched requests with scores
  const matchedRequests = requests.map(req => {
    const match = calcMatchScore(req, carrier);
    return { ...req, matchScore: match.score, matchReasons: match.reasons };
  }).sort((a, b) => b.matchScore - a.matchScore);

  // Bekleyen teklifler: İlan kapandıysa veya başka firmaya verildiyse bekleyen tekliflerden çıksın
  const pendingOffers = Array.from(
    new Map(
      myOffers
        .filter(o => {
          if (o.status !== 'PENDING') return false;
          const req = db.getRequestById(o.requestId);
          if (req && (req.status === 'ASSIGNED' || req.status === 'CLOSED')) return false;
          return true;
        })
        .map(o => [o.requestId || o.id, o])
    ).values()
  );

  // Kazanılan teklifler
  const acceptedOffers = Array.from(
    new Map(
      myOffers
        .filter(o => {
          if (o.status === 'ACCEPTED') return true;
          const req = db.getRequestById(o.requestId);
          if (req && (req.status === 'ASSIGNED' || (req.status === 'CLOSED' && req.closedReason === 'İş Verildi')) && (req.assignedCarrierId === carrier.id || req.assignedOfferId === o.id)) {
            return true;
          }
          return false;
        })
        .map(o => [o.requestId || o.id, o])
    ).values()
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── HEADER: Operasyon Merkezi ───────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">Operasyon Merkezi</p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">{carrier.companyName}</h1>
              {isGold && <Badge variant="gold" size="sm" />}
              {isPro && <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black border border-blue-200">Pro Üye</span>}
              {isStarter && <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black border border-slate-200">Başlangıç (Ücretsiz)</span>}
              {isApproved ? (
                <Badge variant="verified" size="sm" />
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[11px] font-black border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Doğrulamasız Üye (Onay Bekleniyor)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Bugün bölgenizde <strong className="text-[#F95700]">{matchedRequests.length} yeni eşleşen iş</strong> var
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/nakliyeci/defter?action=create">
              <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} className="font-bold">
                Boş Araç Paylaş
              </Button>
            </Link>
            <Link href="/nakliyeci/isler">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />} className="font-black">
                Tüm İşler
              </Button>
            </Link>
          </div>
        </div>

        {/* ── DOĞRULAMASIZ ÜYE / ONAY BEKLEYEN BANNER ──────────────────────── */}
        {!isApproved && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-50 via-amber-100/60 to-orange-50 border-2 border-amber-300 p-5 sm:p-6 shadow-sm text-amber-950">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs border border-amber-300 uppercase tracking-wide">
                      Doğrulamasız Üye
                    </span>
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
                      Yönetici Onayı Bekleniyor
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#0A1128]">
                    {hasTaxDoc && hasIdDoc
                      ? 'Firmanızın belgeleri incelenmektedir, en kısa sürede onay verilecektir ve teklif verebileceksiniz.'
                      : 'Firmanızın belgeleri incelenmektedir — Lütfen eksik evraklarınızı tamamlayınız.'}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {hasTaxDoc && hasIdDoc
                      ? 'Kimlik ve vergi levhası belgeleriniz yönetici ekibimize iletilmiştir. Platform güvenlik standartlarımız gereğince belgeleriniz incelendikten sonra (genellikle 2 saat içinde) hesabınız onaylanacak ve tüm ilanlara teklif verme yetkiniz açılacaktır.'
                      : 'Müşterilerimize güvenilir hizmet sunabilmek amacıyla ilanlara teklif verebilmek için vergi levhası ve yetkili kimlik belgenizi yüklemeniz gerekmektedir.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1.5 text-xs font-bold">
                    <span className={hasTaxDoc ? 'text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1' : 'text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1'}>
                      {hasTaxDoc ? '✓ Vergi Levhası Yüklendi' : '⏳ Vergi Levhası Eksik'}
                    </span>
                    <span className={hasIdDoc ? 'text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300 flex items-center gap-1' : 'text-amber-900 bg-amber-200/70 px-2.5 py-1 rounded-lg border border-amber-300 flex items-center gap-1'}>
                      {hasIdDoc ? '✓ Kimlik Belgesi Yüklendi' : '⏳ Kimlik Belgesi Eksik'}
                    </span>
                    <span className="text-slate-500 text-[11px] font-medium">
                      (Admin panelden onay verildiğinde bu uyarı otomatik olarak kalkacaktır)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 md:self-center">
                <Link href="/nakliyeci/profil">
                  <Button variant="outline" size="sm" className="font-bold text-xs bg-white border-amber-300 text-amber-950 hover:bg-amber-100/60 shadow-xs h-10">
                    Evrakları İncele / Güncelle →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT: Ana Akış (2/3) ──────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* ── BUGÜN: İş Özeti ─────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Yeni Eşleşen İş', value: matchedRequests.length, color: 'text-[#F95700]', bg: 'bg-orange-50', border: 'border-orange-200', href: '/nakliyeci/isler' },
                { label: 'Bugün Kalan Teklif', value: isStarter ? `${remainingFreeOffers}/3 Hak` : 'Sınırsız', color: isStarter && remainingFreeOffers === 0 ? 'text-red-600' : 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', href: isStarter && remainingFreeOffers === 0 ? '/paketler' : '/nakliyeci/isler' },
                { label: 'Bekleyen Teklifim', value: pendingOffers.length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', href: '/nakliyeci/tekliflerim' },
                { label: 'Kazanılan İş', value: acceptedOffers.length, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', href: '/nakliyeci/tekliflerim' },
              ].map((card, i) => (
                <Link key={i} href={card.href}
                  className={`${card.bg} border ${card.border} rounded-2xl p-4 hover:shadow-sm transition-all group`}>
                  <p className="text-xs font-bold text-slate-500 mb-1">{card.label}</p>
                  <p className={`text-2xl sm:text-3xl font-black ${card.color}`}>{card.value}</p>
                  <p className={`text-[11px] font-bold ${card.color} mt-1 opacity-70 group-hover:opacity-100 transition-opacity`}>
                    Görüntüle →
                  </p>
                </Link>
              ))}
            </div>

            {/* ── ROTA EŞLEŞMELİ İŞLER ──────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#F95700]" />
                  <h2 className="font-black text-[#0A1128] text-base">Rotanıza Eşleşen İşler</h2>
                </div>
                <Link href="/nakliyeci/isler" className="text-xs font-black text-[#F95700] hover:underline">
                  Tümü →
                </Link>
              </div>

              <div className="p-5 space-y-3">
                {matchedRequests.slice(0, 3).map((req) => (
                  <Link key={req.id} href={`/nakliyeci/isler/${req.id}`}>
                    <div className="border border-slate-200 rounded-xl p-4 hover:border-[#F95700] hover:bg-orange-50/30 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{req.requestCode}</span>
                            <span className="text-xs font-bold text-slate-600">{req.homeSize} Ev</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-black text-sm text-[#0A1128]">
                            <span>{req.originCity}</span>
                            <MoveRight className="w-4 h-4 text-[#F95700] shrink-0" />
                            <span>{req.destinationCity}</span>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="shrink-0 text-center">
                          <div className={`text-2xl font-black ${req.matchScore >= 80 ? 'text-emerald-600' : req.matchScore >= 60 ? 'text-amber-600' : 'text-slate-500'}`}>
                            %{req.matchScore}
                          </div>
                          <div className="text-[10px] font-black text-slate-400 uppercase">Eşleşme</div>
                        </div>
                      </div>

                      {/* Match reasons */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {req.matchReasons.map((r, i) => (
                          <span key={i} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            ✓ {r}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />{req.movingDate}
                        </span>
                        {(() => {
                          const existingOffer = myOffers.find(o => o.requestId === req.id && o.status !== 'WITHDRAWN');
                          if (existingOffer) {
                            return (
                              <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Teklifiniz İletildi ({existingOffer.price.toLocaleString('tr-TR')} TL)</span>
                              </span>
                            );
                          }
                          return (
                            <Button variant="primary" size="sm" className="font-black text-xs">
                              Teklif Ver
                            </Button>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                ))}

                {matchedRequests.length === 0 && (
                  <div className="text-center py-8">
                    <Target className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-500">Şu an eşleşen iş yok</p>
                    <p className="text-xs text-slate-400">Alarm kurun, yeni iş gelince anında haberdar olun.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── BOŞ DÖNÜŞ OPTİMİZASYONU ────────────────── */}
            <div className="bg-[#0A1128] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-[#F95700]" />
                <h2 className="font-black text-base">Boş Dönüş Optimizasyonu</h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <span className="font-black text-white">İstanbul</span>
                  <MoveRight className="w-4 h-4 text-[#F95700] shrink-0" />
                  <span className="font-black text-white">İzmir</span>
                  <span className="text-slate-400 text-xs ml-auto">15 Eylül</span>
                </div>
                <p className="text-xs text-slate-400 font-medium mb-3">Dönüş yolunuza uygun işler:</p>
                <div className="space-y-2">
                  {[
                    { route: 'İzmir → İstanbul', score: 96 },
                    { route: 'Manisa → İstanbul', score: 89 },
                    { route: 'Balıkesir → Kocaeli', score: 76 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/8 last:border-0">
                      <span className="text-xs font-bold text-slate-300">{item.route}</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded ${item.score >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300'}`}>
                        %{item.score} eşleşme
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/nakliyeci/defter?action=create">
                <Button variant="primary" size="sm" className="font-black" leftIcon={<Plus className="w-4 h-4" />}>
                  Boş Araç Paylaş
                </Button>
              </Link>
            </div>

            {/* ── BEKLEYEN TEKLİFLERİM ────────────────────── */}
            {pendingOffers.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between p-5 pb-0">
                  <h2 className="font-black text-[#0A1128] text-base">Bekleyen Tekliflerim ({pendingOffers.length})</h2>
                  <Link href="/nakliyeci/tekliflerim" className="text-xs font-black text-[#F95700] hover:underline">Tümü →</Link>
                </div>
                <div className="p-5 space-y-3">
                  {pendingOffers.map(offer => {
                    const req = db.getRequestById(offer.requestId);
                    const routeText = req
                      ? `${req.originCity} → ${req.destinationCity} · ${req.homeSize} Ev`
                      : offer.requestId;
                    const codeText = req?.requestCode || '';
                    const dateText = req?.movingDate ? ` · ${req.movingDate}` : '';
                    return (
                      <Link key={offer.id} href={req ? `/nakliyeci/isler/${offer.requestId}` : '/nakliyeci/tekliflerim'}>
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 hover:bg-amber-100/60 transition-all hover:shadow-2xs">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {codeText && <span className="text-[10px] font-black text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">{codeText}</span>}
                              <span className="text-xs font-black text-[#0A1128]">{routeText}</span>
                            </div>
                            <p className="font-bold text-sm text-[#0A1128]">{offer.price.toLocaleString('tr-TR')} TL <span className="text-[11px] text-slate-400 font-normal">{dateText}</span></p>
                          </div>
                          <span className="text-xs font-black text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-xl shrink-0">
                            Yanıt Bekleniyor
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar (1/3) ─────────────────────────── */}
          <div className="space-y-4">

            {/* Müsaitlik Takvimi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#F95700]" />
                <h3 className="font-black text-sm text-[#0A1128]">Müsaitlik Durumum</h3>
              </div>

              <div className="space-y-2 mb-3">
                {[
                  { date: '12 Eylül', day: 'Cuma' },
                  { date: '13 Eylül', day: 'Cumartesi' },
                  { date: '14 Eylül', day: 'Pazar' },
                  { date: '15 Eylül', day: 'Pazartesi' },
                ].map((d, i) => {
                  const key = `2026-09-${12 + i}`;
                  const status = availabilityDays[key];
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-[#0A1128]">{d.date}</span>
                        <span className="text-[10px] text-slate-400 ml-1">{d.day}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setAvailabilityDays(prev => ({ ...prev, [key]: 'MUSAIT' }))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${status === 'MUSAIT' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-emerald-50'}`}
                        >
                          Müsait
                        </button>
                        <button
                          onClick={() => setAvailabilityDays(prev => ({ ...prev, [key]: 'DOLU' }))}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${status === 'DOLU' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          Dolu
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link href="/nakliyeci/takvim" className="text-[11px] font-bold text-[#F95700] hover:underline flex items-center gap-1">
                Tam Takvim <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Hızlı Linkler */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h3 className="font-black text-xs text-slate-500 uppercase tracking-wider mb-3">Hızlı Erişim</h3>
              <div className="space-y-0.5">
                {[
                  { href: '/nakliyeci/isler', icon: Truck, label: 'Tüm İşler' },
                  { href: '/nakliyeci/tekliflerim', icon: CheckCircle2, label: 'Tekliflerim' },
                  { href: '/nakliyeci/defter', icon: BookOpen, label: 'Nakliyeci Defteri' },
                  { href: '/nakliyeci/mesajlar', icon: MessageSquare, label: 'Mesajlar' },
                  { href: '/nakliyeci/alarmlar', icon: Bell, label: 'Alarmlar' },
                  { href: '/nakliyeci/profil', icon: ShieldCheck, label: 'Profilim' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-[#F95700] transition-all group">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#F95700] transition-colors" />
                      <span className="text-sm font-bold">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Abonelik kartı */}
            <div className="bg-gradient-to-br from-[#0A1128] to-[#132247] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[#F95700]" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-wider">Mevcut Plan</span>
              </div>
              <p className="font-black text-base text-white capitalize mb-2">
                {isGold ? 'GOLD ÜYELİK' : isPro ? 'PRO ÜYELİK' : 'BAŞLANGIÇ (ÜCRETSİZ)'}
              </p>
              <div className="space-y-1 mb-4">
                {isStarter ? (
                  <p className="text-xs text-slate-300 font-medium">
                    Günlük 3 ücretsiz teklif hakkı ({uniqueRequestsOfferedToday}/3 kullanıldı)
                  </p>
                ) : (
                  <p className="text-xs text-slate-300 font-medium">
                    Sınırsız teklif verme ve öncelikli rota eşleşmesi aktif.
                  </p>
                )}
              </div>
              <Link href="/paketler">
                <Button variant="primary" size="sm" className="font-black w-full">
                  Planları Gör &amp; Yükselt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
