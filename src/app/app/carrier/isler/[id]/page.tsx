'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Lock,
  MapPin, 
  Calendar, 
  Building2, 
  Package, 
  Camera, 
  Phone, 
  MessageSquare, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Truck,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { Modal } from '@/components/ui/Modal';
import { calculateDistance } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { Offer } from '@/types';
import { sendNotificationEmail, shouldSendCarrierFirstOfferEmail } from '@/lib/services/notification-service';
import { formatOfferInputOnType, parseOfferInput } from '@/lib/utils/offer-format';

export default function CarrierJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const req = db.getRequestById(resolvedParams.id) || db.getRequests()[0];
  
  const currentUser = typeof window !== 'undefined' ? db.getCurrentUser() : null;
  const isCarrier = currentUser?.role === 'CARRIER';
  const carrier = isCarrier ? (db.getCurrentCarrier() || db.getCarriers().find(c => c.userId === currentUser?.id || c.id === currentUser?.carrierProfileId) || null) : null;

  // Evrak & Doğrulama Kontrolü
  const carrierDocs = carrier ? db.getDocumentsForCarrier(carrier.id) : [];
  const hasTaxDoc = carrierDocs.some(d => d.type === 'TAX_CERTIFICATE') || Boolean(carrier?.verificationBadges?.taxVerified);
  const hasIdDoc = carrierDocs.some(d => d.type === 'IDENTITY') || Boolean(carrier?.verificationBadges?.identityVerified);
  const isApproved = Boolean(carrier && carrier.verificationStatus === 'APPROVED' && hasTaxDoc && hasIdDoc);

  // Günlük Teklif Kotası & Mevcut Teklif Kontrolü
  const carrierSub = carrier ? db.getCarrierSubscription(carrier.id) : null;
  const carrierPlan = carrier ? db.getPlanById(carrierSub?.planId || carrier.planId) : null;
  const isFreeOrStarterPlan = !carrier?.planId || carrier.planId === 'plan_starter' || carrier.planId === 'trial' || carrier.planId === 'free';
  const [activeOffers, setActiveOffers] = useState<Offer[]>(() => carrier ? db.getOffersForCarrier(carrier.id) : []);
  const existingOffer = activeOffers.find(o => o.requestId === req.id && o.status !== 'WITHDRAWN');

  // Müşteri Telefon Görme Yetkisi (Gümüş / Altın Paket veya Kabul Edilmiş Teklif)
  const canViewPhone = Boolean(
    (carrier && isApproved && carrierPlan?.features?.customerPhoneAccess === true) ||
    existingOffer?.status === 'ACCEPTED'
  );

  const todayStr = new Date().toISOString().slice(0, 10);
  const uniqueActiveOffers = Array.from(new Map(activeOffers.map(o => [o.id, o])).values());
  const todayOffersCount = uniqueActiveOffers.filter(o => o.createdAt && o.createdAt.startsWith(todayStr) && o.status !== 'WITHDRAWN').length;
  const isDailyLimitReached = Boolean(carrier && isFreeOrStarterPlan && todayOffersCount >= 3);

  const handleWithdrawOffer = (offerId: string) => {
    if (confirm('Bu ilana verdiğiniz teklifi geri çekmek istediğinizden emin misiniz?')) {
      db.withdrawOffer(offerId);
      setActiveOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'WITHDRAWN' as const } : o));
      setPrice('');
      setNotes('');
    }
  };

  // Distance estimate
  const distanceInfo = calculateDistance(req.originCity, req.destinationCity);

  // Quote Form State
  const [price, setPrice] = useState('');
  const [isVatIncluded, setIsVatIncluded] = useState(true);
  const [isPackagingIncluded, setIsPackagingIncluded] = useState(true);
  const [isMobileElevatorIncluded, setIsMobileElevatorIncluded] = useState(false);
  const [isAssemblyIncluded, setIsAssemblyIncluded] = useState(false);
  const [isInsuranceIncluded, setIsInsuranceIncluded] = useState(true);
  const [deliveryDuration, setDeliveryDuration] = useState('24 Saat');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [revealedPhone, setRevealedPhone] = useState(false);

  // Warning / Upgrade Modal State
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [warningModalData, setWarningModalData] = useState<{ title: string; subtitle: string; limitBadge?: string; actionLink?: string; actionText?: string } | null>(null);

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'CARRIER' || !carrier) {
      router.push('/giris?role=nakliyeci');
      return;
    }

    if (!isApproved) {
      setWarningModalData({
        title: '⏳ Doğrulamasız Üye — Teklif Verme Kilitli',
        subtitle: hasTaxDoc && hasIdDoc
          ? 'Firmanızın belgeleri incelenmektedir, en kısa sürede onay verilecektir ve teklif verebileceksiniz. Güvenli taşımacılık standartlarımız gereği belgeleriniz yönetici kontrolündedir. Onay verildiğinde teklif verme yetkiniz hemen açılacaktır.'
          : 'TaşınTeklif güvencesi kapsamında müşterilere teklif verebilmek için firmanızın Kimlik ve Vergi Levhası belgelerini yüklemeniz zorunludur.',
        limitBadge: hasTaxDoc && hasIdDoc ? 'Belgeler İnceleniyor (Onay Bekleniyor)' : 'Belgeler Eksik',
        actionLink: '/app/carrier/profil',
        actionText: hasTaxDoc && hasIdDoc ? 'Evraklarımı Gör' : 'Evrakları Yükle (Profile Git)'
      });
      setWarningModalOpen(true);
      return;
    }

    if (isDailyLimitReached) {
      setWarningModalData({
        title: 'Günlük Ücretsiz Teklif Limitine Ulaştınız (3/3)',
        subtitle: 'Başlangıç (Ücretsiz) paketinizde günlük en fazla 3 ücretsiz teklif hakkınız bulunmaktadır. Bugün için tüm haklarınızı kullandınız. Sınırsız teklif vermek, müşteri telefon numaralarını görmek ve daha fazla iş almak için paketinizi yükseltin.',
        limitBadge: '3 / 3 Teklif Kullanıldı',
        actionLink: '/paketler',
        actionText: 'Paketleri İncele & Yükselt →'
      });
      setWarningModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Bu firmanın bu ilan (talep) için daha önce teklif verip vermediğini kontrol et
      const existingOffers = db.getOffersForRequest(req.id);
      const existingForCarrier = existingOffers.filter(o => o.carrierId === carrier.id);
      const isFirstOfferForThisCarrier = shouldSendCarrierFirstOfferEmail(req.id, carrier.id, existingForCarrier.length);

      const parsed = parseOfferInput(price);
      const newOffer: Offer = {
        id: `off_${Date.now()}`,
        requestId: req.id,
        carrierId: carrier.id,
        carrier,
        price: parsed.price || 20000,
        isVatIncluded,
        isPackagingIncluded,
        isMobileElevatorIncluded,
        isAssemblyIncluded,
        isInsuranceIncluded,
        estimatedDeliveryDuration: deliveryDuration,
        validUntil: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        notes: notes || parsed.note || 'Profesyonel ve sigortalı taşımacılık teklifimizdir.',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      db.addOffer(newOffer, req);
      setActiveOffers(prev => [newOffer, ...prev]);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('offer-added', { detail: newOffer }));
      }

      // YALNIZCA bu firmanın bu ilandaki İLK TEKLİFİNDE bildirim e-postası gönder
      if (isFirstOfferForThisCarrier) {
        try {
          const customerUser = db.getUsers().find((u: any) => u.id === req.customerId);
          const targetEmail = req.customerEmail || customerUser?.email || 'omerfaruksaycan@gmail.com';
          if (targetEmail) {
            sendNotificationEmail({
              type: 'NEW_OFFER',
              to: targetEmail,
              recipientName: req.customerName || customerUser?.fullName || 'Müşterimiz',
              carrierName: carrier.companyName,
              price: newOffer.price,
              routeText: `${req.originCity} (${req.originDistrict}) → ${req.destinationCity} (${req.destinationDistrict})`,
              movingDate: req.movingDate,
              requestId: req.requestCode || req.id,
              messagePreview: newOffer.notes,
            });
          }
        } catch (emailErr) {
          console.warn('Teklif bildirim e-postası gönderilemedi:', emailErr);
        }
      }

      setIsSubmitting(false);
      setSuccessModalOpen(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header breadcrumb & Back buttons */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Link
            href="/app/carrier"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#F95700] py-1.5 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#F95700]/40 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Operasyon Merkezi</span>
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/app/carrier/isler"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#0A1128] transition-colors"
          >
            Açık İşler Listesi
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {carrier && isFreeOrStarterPlan && (
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-2xs">
              Bugün kalan teklif: <strong className={todayOffersCount >= 3 ? 'text-red-600 font-black' : 'text-emerald-700 font-black'}>{Math.max(0, 3 - todayOffersCount)} / 3</strong>
            </span>
          )}
          <span className="text-xs text-slate-400">Talep Kodu: {req.requestCode}</span>
        </div>
      </div>

      {/* Main Grid: Details on Left, Offer Sticky Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Complete Job Specs (Spec Item 60) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Yeni Taşıma İşi
              </span>
              <span className="text-xs text-slate-400">15 dk önce yayınlandı</span>
            </div>

            <div className="py-2">
              <RouteDisplay
                originCity={req.originCity}
                originDistrict={req.originDistrict}
                destinationCity={req.destinationCity}
                destinationDistrict={req.destinationDistrict}
                size="lg"
                distanceKm={distanceInfo.km}
              />
            </div>
          </div>

          {/* Job Specifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3">
              İş Detayları & Özellikler
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Eşya Tipi</span>
                <span className="font-bold text-slate-800">{req.homeSize} Ev</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Taşıma Tarihi</span>
                <span className="font-bold text-slate-800">{req.movingDate}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Tarih Esnekliği</span>
                <span className="font-bold text-slate-800">{req.isDateFlexible ? `±${req.flexibleDays} Gün` : 'Net'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Mesafe / Süre</span>
                <span className="font-bold text-slate-800">~{distanceInfo.km} km ({distanceInfo.durationHours} sa)</span>
              </div>
            </div>

            {/* Building conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="font-bold text-[#0A1128] block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#146EF5]" /> Çıkış Binası
                </span>
                <p className="text-slate-700 font-medium">{req.originFloor}. Kat</p>
                <p className="text-slate-500">Bina İçi Asansör: {req.originHasElevator ? 'Var' : 'Yok (Merdiven)'}</p>
                <p className="text-slate-500">Mobil Asansör İhtiyacı: {req.originRequiresMobileElevator ? 'Evet (Gereklidir)' : 'Hayır'}</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <span className="font-bold text-[#0A1128] block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> Varış Binası
                </span>
                <p className="text-slate-700 font-medium">{req.destinationFloor}. Kat</p>
                <p className="text-slate-500">Bina İçi Asansör: {req.destinationHasElevator ? 'Var' : 'Yok'}</p>
                <p className="text-slate-500">Mobil Asansör İhtiyacı: {req.destinationRequiresMobileElevator ? 'Evet' : 'Hayır'}</p>
              </div>
            </div>

            {/* Notes */}
            {req.notes && (
              <div>
                <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Müşteri Notu</h3>
                <p className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 text-xs text-slate-700 leading-relaxed">
                  {req.notes}
                </p>
              </div>
            )}

            {/* Customer Phone Access Card (Spec Item 71) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0A1128] block">Müşteri İletişim Numarası</span>
                  <span className="text-[11px] text-slate-500">Müşteri telefonla aranmaya izin verdi.</span>
                </div>
              </div>

              {canViewPhone ? (
                revealedPhone ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 tracking-wider">
                      {req.customerPhone}
                    </span>
                    <a href={`tel:${req.customerPhone}`}>
                      <button className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Hemen Ara</span>
                      </button>
                    </a>
                  </div>
                ) : (
                  <Button variant="secondary" size="sm" onClick={() => setRevealedPhone(true)}>
                    Telefonu Gör
                  </Button>
                )
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 tracking-wider">
                    {req.customerPhone ? `${req.customerPhone.slice(0, 4)} ${req.customerPhone.slice(4, 7)} ** **` : '0532 418 ** **'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setWarningModalData({
                        title: '🔒 Müşteri Telefonu Başlangıç Paketinde Gizlidir',
                        subtitle: 'Müşterilerin doğrudan cep telefonu numarasını görmek ve teklif kabul edilmeden önce doğrudan arayabilmek için Gümüş veya Altın üyelik paketine sahip olmanız gerekmektedir. Mevcut paketinizle müşteriye güvenli mesaj gönderebilir veya doğrudan teklif verebilirsiniz.',
                        limitBadge: 'Gümüş / Altın Paket Özelliği',
                        actionLink: '/app/carrier/abonelik',
                        actionText: 'Paketleri İncele & Yükselt →'
                      });
                      setWarningModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Numarayı Aç</span>
                  </button>
                </div>
              )}
            </div>

            {/* Photos */}
            {req.photos.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Eşya Fotoğrafları ({req.photos.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {req.photos.map((url, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={url} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Quotation Form Drawer (Spec Item 61) */}
        <div>
          {existingOffer ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 shadow-lg shadow-emerald-900/5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Teklifiniz İletildi
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                  existingOffer.status === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {existingOffer.status === 'ACCEPTED' ? 'Kabul Edildi 🎉' : 'Müşteri İncelemesinde'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2 text-center">
                <span className="text-xs text-slate-500 block font-semibold">Verilen Teklif Tutarı</span>
                <span className="text-3xl font-black text-emerald-800 block">
                  {existingOffer.price.toLocaleString('tr-TR')} TL
                </span>
                <p className="text-xs text-slate-600">
                  {existingOffer.isPackagingIncluded ? 'Paketleme Dahil' : 'Paketlemesiz'} • {existingOffer.estimatedDeliveryDuration}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-400">KDV:</span>
                  <span className="font-bold text-slate-700">{existingOffer.isVatIncluded ? 'Dahil' : 'Hariç'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mobil Asansör:</span>
                  <span className="font-bold text-slate-700">{existingOffer.isMobileElevatorIncluded ? 'Dahil' : 'Hariç'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Montaj/Demontaj:</span>
                  <span className="font-bold text-slate-700">{existingOffer.isAssemblyIncluded ? 'Dahil' : 'Hariç'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nakliyat Sigortası:</span>
                  <span className="font-bold text-slate-700">{existingOffer.isInsuranceIncluded ? 'Dahil' : 'Hariç'}</span>
                </div>
              </div>

              {existingOffer.notes && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="font-bold block text-slate-700 mb-1">Müşteriye Notunuz:</span>
                  <p className="text-slate-600 italic leading-relaxed">{existingOffer.notes}</p>
                </div>
              )}

              {existingOffer.status === 'PENDING' && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleWithdrawOffer(existingOffer.id)}
                    className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Teklifi Geri Çek / İptal Et
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Teklifi geri çektiğinizde müşteri bu teklifi göremez.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg shadow-blue-900/5 sticky top-24 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-[#0A1128] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#146EF5]" /> Teklif Ver
                </h3>
                <span className="text-xs text-slate-400">30 saniyede hazırla</span>
              </div>

              {!isApproved && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 text-amber-950 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-950 font-black text-[10px] uppercase border border-amber-300">
                      Doğrulamasız Üye
                    </span>
                    <span className="text-[11px] font-black text-amber-900">
                      Onay Bekleniyor
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#0A1128] leading-snug">
                    Firmanızın belgeleri incelenmektedir, en kısa sürede onay verilecektir ve teklif verebileceksiniz.
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Admin onayının ardından teklif verme kilidiniz otomatik olarak açılacaktır.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Toplam Fiyat (TL)</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(formatOfferInputOnType(e.target.value))}
                      placeholder="Örn: 24.500 veya 50000"
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 font-black text-lg text-[#0A1128] focus:ring-2 focus:ring-[#146EF5]"
                    />
                    <span className="absolute right-3.5 top-3.5 font-bold text-slate-400">TL</span>
                  </div>
                </div>

                {/* VAT toggle */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-semibold text-slate-700">KDV Dahil mi?</span>
                  <input
                    type="checkbox"
                    checked={isVatIncluded}
                    onChange={(e) => setIsVatIncluded(e.target.checked)}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                </div>

                {/* Checklist included services */}
                <div className="space-y-2 pt-1 font-medium text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPackagingIncluded}
                      onChange={(e) => setIsPackagingIncluded(e.target.checked)}
                      className="w-4 h-4 text-[#146EF5]"
                    />
                    <span>A&apos;dan Z&apos;ye Ambalajlama Dahil</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMobileElevatorIncluded}
                      onChange={(e) => setIsMobileElevatorIncluded(e.target.checked)}
                      className="w-4 h-4 text-[#146EF5]"
                    />
                    <span>Mobil Asansör Hizmeti Dahil</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAssemblyIncluded}
                      onChange={(e) => setIsAssemblyIncluded(e.target.checked)}
                      className="w-4 h-4 text-[#146EF5]"
                    />
                    <span>Mobilya Söküm & Montajı Dahil</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInsuranceIncluded}
                      onChange={(e) => setIsInsuranceIncluded(e.target.checked)}
                      className="w-4 h-4 text-[#146EF5]"
                    />
                    <span>Emtia Nakliyat Sigortası Dahil</span>
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahmini Teslim Süresi</label>
                  <select
                    value={deliveryDuration}
                    onChange={(e) => setDeliveryDuration(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="Aynı Gün">Aynı Gün</option>
                    <option value="24 Saat">24 Saat</option>
                    <option value="2 Gün">2 Gün</option>
                    <option value="3-4 Gün">3-4 Gün</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Müşteriye Notunuz</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  <Link href="/app/carrier/isler" className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      className="w-full font-bold text-xs h-11"
                    >
                      Vazgeç
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className={`w-full font-black text-xs h-11 shadow-sm ${!isApproved ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                    isLoading={isSubmitting}
                  >
                    {!isApproved ? 'Teklif Ver (Onay Bekliyor)' : 'Teklifi Gönder'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Offer Success Modal (Spec Item 62) */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Teklifiniz Müşteriye Ulaştı! 🎉"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-2xl font-black text-[#0A1128] block">{parseOfferInput(price).price.toLocaleString('tr-TR')} TL</span>
            <span className="text-xs text-slate-500">
              {isPackagingIncluded ? 'Paketleme Dahil' : 'Paketlemesiz'} • {deliveryDuration}
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Müşteri teklifinizi inceledikten sonra platform üzerinden sizinle mesajlaşabilir veya işi doğrudan size verebilir.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button variant="primary" size="md" onClick={() => router.push('/app/carrier/tekliflerim')} className="w-full">
              Tekliflerimi Gör
            </Button>
            <Button variant="outline" size="md" onClick={() => router.push('/app/carrier/isler')} className="w-full">
              Benzer İşleri Gör
            </Button>
          </div>
        </div>
      </Modal>

      {/* Warning / Upgrade Modal */}
      <Modal
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        title={warningModalData?.title || 'Uyarı'}
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            {warningModalData?.subtitle}
          </p>

          {warningModalData?.limitBadge && (
            <div className="inline-block px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-black border border-slate-200">
              {warningModalData.limitBadge}
            </div>
          )}

          <div className="flex gap-3 pt-3">
            <Button variant="outline" size="md" className="flex-1 font-bold" onClick={() => setWarningModalOpen(false)}>
              Vazgeç
            </Button>
            <Link href={warningModalData?.actionLink || "/paketler"} className="flex-1" onClick={() => setWarningModalOpen(false)}>
              <Button variant="primary" size="md" className="w-full font-black text-xs" rightIcon={<ArrowRight className="w-4 h-4" />}>
                {warningModalData?.actionText || "Paketleri İncele & Yükselt"}
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
