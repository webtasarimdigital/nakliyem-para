'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  CheckSquare, 
  ShieldCheck, 
  Camera, 
  Phone, 
  Building2, 
  ArrowRight,
  RotateCcw,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { Modal } from '@/components/ui/Modal';
import { ReviewForm } from '@/components/ui/ReviewForm';
import { db } from '@/lib/data/mock-db';

export default function CustomerRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const req = db.getRequestById(resolvedParams.id) || db.getRequests()[0];
  const offers = db.getOffersForRequest(req?.id || '');

  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState('Platformdaki firmayla anlaştım');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const currentUser = db.getCurrentUser();
  const assignedCarrier = req?.assignedCarrierId ? db.getCarriers().find(c => c.id === req.assignedCarrierId) : null;
  const isEligibleForReview = req && (req.status === 'ASSIGNED' || req.status === 'CLOSED') && !!req.assignedCarrierId;
  const existingReview = req ? db.getReviewByRequest(req.id) : undefined;

  if (!req) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-slate-500">Talep bulunamadı.</p>
        <Link href="/app/customer/taleplerim">
          <Button variant="primary" size="sm" className="mt-4">Taleplerime Dön</Button>
        </Link>
      </div>
    );
  }

  const lowestOfferPrice = offers.length > 0 
    ? Math.min(...offers.map(o => o.price)) 
    : null;

  const handleCloseRequest = () => {
    db.updateRequest(req.id, {
      status: 'CLOSED',
      closedReason: closeReason
    });
    setCloseModalOpen(false);
    router.refresh();
  };

  const handleReopenRequest = () => {
    db.updateRequest(req.id, {
      status: 'ACTIVE'
    });
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button & top title */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={currentUser?.role === 'CARRIER' ? "/app/carrier/isler" : "/app/customer/taleplerim"}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128]"
        >
          <ArrowLeft className="w-4 h-4" /> {currentUser?.role === 'CARRIER' ? 'Açık İşlere Dön' : 'Taleplerime Dön'}
        </Link>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'CARRIER' ? (
            <Link href={`/app/carrier/isler/${req.id}`}>
              <Button variant="primary" size="sm" className="font-black">
                Bu İşe Teklif Ver
              </Button>
            </Link>
          ) : req.status === 'ACTIVE' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCloseModalOpen(true)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Talebi Kapat
            </Button>
          ) : req.status === 'CLOSED' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReopenRequest}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Talebi Yeniden Aç
            </Button>
          ) : null}
        </div>
      </div>

      {/* Main Grid: Details on Left, Offers on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#0A1128] bg-slate-100 px-2.5 py-1 rounded-md">
                  Talep {req.requestCode}
                </span>
                <Badge variant={req.status === 'ACTIVE' ? 'verified' : req.status === 'ASSIGNED' ? 'success' : 'danger'}>
                  {req.status === 'ACTIVE' ? 'Aktif (Teklif Alıyor)' : req.status === 'ASSIGNED' ? 'Firma Anlaşıldı' : 'Kapatıldı'}
                </Badge>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(req.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>

            <div className="py-2">
              <RouteDisplay
                originCity={req.originCity}
                originDistrict={req.originDistrict}
                destinationCity={req.destinationCity}
                destinationDistrict={req.destinationDistrict}
                size="lg"
              />
            </div>
          </div>

          {/* Details Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3">
              Taşıma Detayları
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Eşya & Ev Büyüklüğü</span>
                <span className="text-sm font-bold text-slate-800">{req.homeSize} Ev Eşyası</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Taşınma Tarihi</span>
                <span className="text-sm font-bold text-slate-800">
                  {req.movingDate} {req.isDateFlexible && `(±${req.flexibleDays} gün esnek)`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Çıkış Binası</span>
                <span className="text-sm font-bold text-slate-800">
                  {req.originFloor}. Kat {req.originHasElevator ? '• Asansör Var' : '• Merdiven'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Varış Binası</span>
                <span className="text-sm font-bold text-slate-800">
                  {req.destinationFloor}. Kat {req.destinationHasElevator ? '• Asansör Var' : '• Merdiven'}
                </span>
              </div>
            </div>

            {/* Packaging & Extras */}
            <div>
              <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Paketleme & Ek Hizmetler</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0B3B8F] font-semibold border border-blue-100">
                  {req.packagingPreference === 'CARRIER_PACKS' ? 'Firma Paketlesin' : req.packagingPreference === 'BOTH_OFFERS' ? 'İkisi İçin de Teklif' : 'Kendim Paketlerim'}
                </span>
                {req.extraServices.map(ext => (
                  <span key={ext} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    {ext === 'disassembly_assembly' ? 'Mobilya Sökme & Montaj' : ext === 'insured' ? 'Nakliyat Sigortası' : ext}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {req.notes && (
              <div>
                <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">Müşteri Açıklaması</h3>
                <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {req.notes}
                </p>
              </div>
            )}

            {/* Photos */}
            {req.photos && req.photos.length > 0 && (
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

            {/* ── YILDIZ & YORUM ALANI (Hizmet Sonrası) ── */}
            <div className="pt-6 border-t border-slate-200">
              {isEligibleForReview ? (
                existingReview ? (
                  /* Zaten Değerlendirilmiş */
                  <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                          ✓
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-emerald-950">Değerlendirmeniz Kaydedildi</h4>
                          <p className="text-xs text-emerald-700 font-medium">
                            {assignedCarrier?.companyName || 'Nakliye Firması'} için verdiğiniz puan ve yorum yayınlandı.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 text-amber-500 font-black text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{existingReview.rating}.0</span>
                        <span className="text-xs text-slate-400 font-normal">/ 5</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-emerald-100 text-xs text-slate-700 font-medium leading-relaxed">
                      &ldquo;{existingReview.comment}&rdquo;
                    </div>

                    {existingReview.reply && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <strong className="text-[#F95700] block mb-0.5">{assignedCarrier?.companyName} Yanıtı:</strong>
                        <p className="text-slate-600 font-medium">{existingReview.reply}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Hizmet Alınmış Ama Henüz Yorumlanmamış */
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-[#F95700]/30 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F95700]/10 text-[#F95700] text-[11px] font-black">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Hizmet Tamamlandı
                        </div>
                        <h4 className="text-base font-black text-[#0A1128]">
                          Taşınma Deneyiminizi Değerlendirin
                        </h4>
                        <p className="text-xs text-slate-600 font-medium max-w-lg">
                          <strong>{assignedCarrier?.companyName || 'Anlaştığınız firma'}</strong> ile taşınmanız tamamlandı. Diğer müşterilere yol göstermek için yıldız ve yorum bırakın.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(true)}
                        className="px-5 py-3 rounded-xl bg-[#F95700] hover:bg-[#e04f00] text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-orange-900/20 whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Star className="w-4 h-4 fill-current" />
                        <span>Yorum &amp; Yıldız Bırak</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                /* Henüz Hizmet Alınmamış / Anlaşılmamış */
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-500">
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <p>
                    <strong>Yorum &amp; Puanlama Kuralı:</strong> Sadece bir nakliye firmasıyla anlaşıp taşınması tamamlanan onaylı müşteriler değerlendirme yapabilir.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Offers Card (Spec Item 57) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-md shadow-blue-900/5 sticky top-24">
            <h3 className="text-base font-bold text-[#0A1128] mb-1">
              Gelen Teklifler
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Bu talep için nakliyat firmalarından teklifler toplanıyor.
            </p>

            <div className="p-4 rounded-xl bg-[#EAF3FF] border border-blue-100 text-center mb-6">
              <span className="text-3xl font-black text-[#0B3B8F] block">
                {offers.length} Teklif
              </span>
              {lowestOfferPrice && (
                <span className="text-xs text-emerald-700 font-bold mt-1 block">
                  En Düşük: {lowestOfferPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
            </div>

            <Link href={`/app/customer/teklifler`}>
              <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Teklifleri Karşılaştır & Gör
              </Button>
            </Link>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-2">
              <p>✓ Tüm teklifler KDV ve sigorta detaylarını içerir.</p>
              <p>✓ İstediğiniz firmayla tek tıkla mesajlaşabilirsiniz.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {reviewModalOpen && assignedCarrier && (
        <ReviewForm
          requestId={req.id}
          carrierId={assignedCarrier.id}
          carrierName={assignedCarrier.companyName}
          customerId={req.customerId || currentUser?.id || 'cust_1'}
          customerName={req.customerName || 'Müşteri'}
          originCity={req.originCity}
          destinationCity={req.destinationCity}
          onSuccess={() => {
            setReviewModalOpen(false);
            router.refresh();
          }}
          onClose={() => setReviewModalOpen(false)}
        />
      )}

      {/* Close Request Modal */}
      <Modal
        isOpen={closeModalOpen}
        onClose={() => setCloseModalOpen(false)}
        title="Taşıma Talebini Kapat"
        subtitle="Talebinizi kapattığınızda nakliyecilerden yeni teklif gelmeyecektir."
      >
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-slate-700">Kapatma Sebebiniz:</label>
          <div className="space-y-2 text-xs">
            {[
              'Platformdaki firmayla anlaştım',
              'Platform dışında firma buldum',
              'Taşınmaktan vazgeçtim',
              'Tarihi ileri bir zamana erteledim',
              'Diğer'
            ].map(reason => (
              <label key={reason} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="closeReason"
                  value={reason}
                  checked={closeReason === reason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className="w-4 h-4 text-[#146EF5]"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCloseModalOpen(false)}>Vazgeç</Button>
            <Button variant="danger" size="sm" onClick={handleCloseRequest}>Talebi Kapat</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
