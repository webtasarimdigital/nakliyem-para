'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

interface TrialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TrialCardModal({ isOpen, onClose, onSuccess }: TrialCardModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate billing start date (7 days from now)
  const billingStartDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const billingDateText = billingStartDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleProceedToDodo = async () => {
    if (!agreed) return;
    setLoading(true);
    setError(null);

    try {
      const currentUser = db.getCurrentUser();
      const carrier = db.getCurrentCarrier() || 
        (currentUser?.role === 'CARRIER' 
          ? db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) 
          : null);

      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: 'pro',
          billingCycle: 'monthly',
          customer: {
            email: currentUser?.email || carrier?.email,
            name: currentUser?.fullName || carrier?.companyName || 'Nakliye Firması',
            phone: currentUser?.phone || carrier?.phone,
          },
          metadata: {
            isTrialCheckout: 'true',
            carrierId: carrier?.id || '',
            userId: currentUser?.id || '',
            planKey: 'pro',
          },
          returnUrl: `${window.location.origin}/odeme/sonuc?plan=pro&trial=true&status=succeeded`,
        }),
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        if (carrier) {
          db.recordCarrierCardAdded(carrier.id);
        }
        window.location.href = data.checkoutUrl;
      } else {
        if (carrier) {
          db.recordCarrierCardAdded(carrier.id);
        }
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      console.warn('Dodo checkout notice, falling back to trial activation:', err);
      const currentUser = db.getCurrentUser();
      const carrier = db.getCurrentCarrier() || 
        (currentUser?.role === 'CARRIER' 
          ? db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) 
          : null);
      if (carrier) {
        db.recordCarrierCardAdded(carrier.id);
      }
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog (Matching Görsel 2) */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-fade-in my-auto max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2.5rem)] flex flex-col p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] shrink-0" />
            <h3 className="text-base sm:text-lg font-black text-[#0A1128] truncate">
              TaşınTeklif Profesyonel Paketi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto min-h-0 flex-1 space-y-4 pr-0.5">
          {/* Info Box (Görsel 2 exact structure) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-slate-800 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs sm:text-sm font-bold text-slate-700">Bugün:</span>
              <span className="text-lg sm:text-xl font-black text-emerald-700 whitespace-nowrap">0 ₺</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Paket ücretinin ilk tahsilatı <strong className="text-[#0A1128] font-black">{billingDateText}</strong>: <span className="text-slate-900 font-black whitespace-nowrap">₺2.990 / ay</span>
            </p>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Deneme süresi kart onayından itibaren <strong>7 gün (168 saat)</strong> geçerlidir. İptal edene kadar seçilen periyotta otomatik yenilenir. Panelden dilediğiniz an tek tıkla iptal edebilirsiniz. İptal sonraki yenilemeyi durdurur; erişim dönem sonuna kadar sürer.
            </p>

            <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Deneme süresinde iptal ederseniz 0 ₺ tahsil edilir. Yenilemelerde asla mükerrer çekim yapılmaz.</span>
            </div>
          </div>

          {/* Feature Highlights of Pro Plan during trial */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 bg-slate-50 p-2.5 sm:p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-black shrink-0">✓</span>
              <span className="truncate">50 Teklif / Ay</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-black shrink-0">✓</span>
              <span className="truncate">35 Müşteri Telefonu</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-black shrink-0">✓</span>
              <span className="truncate">20 Defter İlanı</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-black shrink-0">✓</span>
              <span className="truncate">5 Akıllı Rota Alarmı</span>
            </div>
          </div>

          {/* Error notice if any */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Terms Checkbox (Görsel 2 exact legal wording) */}
          <label className="flex items-start gap-2.5 cursor-pointer group select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer shrink-0"
            />
            <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-medium group-hover:text-slate-800 transition-colors">
              Ön bilgilendirme bilgilerini,{' '}
              <a href="/sozlesmeler/mesafeli-satis" target="_blank" className="font-bold text-emerald-700 hover:underline">
                Mesafeli Satış Sözleşmesi
              </a>
              'ni ve{' '}
              <a href="/sozlesmeler/teslimat-iade" target="_blank" className="font-bold text-emerald-700 hover:underline">
                Teslimat ve İade Şartları
              </a>
              'nı okudum, kabul ediyorum. Aboneliğin ben iptal edene kadar her dönem otomatik yenileneceğini; hizmet dijital olarak anında ifa edildiği için başladıktan sonra yasal cayma hakkının istisna kapsamında olduğunu biliyorum.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
          >
            Vazgeç
          </button>

          <button
            type="button"
            disabled={!agreed || loading}
            onClick={handleProceedToDodo}
            className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
              agreed && !loading
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-950/20 active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <span>{loading ? 'Yönlendiriliyor...' : 'Güvenli ödemeye geç'}</span>
          </button>
        </div>

        {/* Security badge footer */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium text-center shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Dodo Payments PCI-DSS Level 1 · 0 ₺ Doğrulama · Kart bilgileri kaydedilmez</span>
        </div>
      </div>
    </div>
  );
}
