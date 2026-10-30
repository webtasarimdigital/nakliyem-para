'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  Building2, 
  RefreshCw, 
  HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';

function OdemeSonucContent() {
  const searchParams = useSearchParams();
  const planKey = (searchParams?.get('plan') || 'gold').toLowerCase();
  const cycle = (searchParams?.get('cycle') || 'monthly').toLowerCase();
  const statusParam = (searchParams?.get('status') || '').toLowerCase().trim();
  const paymentId = searchParams?.get('payment_id') || searchParams?.get('paymentId') || '';
  const email = searchParams?.get('email') || '';
  const isTrial = searchParams?.get('trial') === 'true';

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [carrierData, setCarrierData] = useState<any>(null);

  // Validate status: Dodo Payments returns 'succeeded' on successful payment, 'failed' or 'cancelled' on error.
  const isSuccess = statusParam === 'succeeded' || statusParam === 'success' || statusParam === 'paid' || statusParam === 'active';

  useEffect(() => {
    // CRITICAL: NEVER activate subscription or grant access if payment failed or was not confirmed as successful!
    if (!isSuccess) {
      return;
    }

    const user = db.getCurrentUser();
    setCurrentUser(user);

    const planIdMap: Record<string, string> = {
      starter: 'plan_starter',
      pro: 'plan_pro',
      gold: 'plan_gold',
    };
    const targetPlanId = planIdMap[planKey] || 'plan_pro';

    if (user) {
      let carrier = db.getCurrentCarrier();
      if (!carrier) {
        carrier = db.getCarriers().find(c => c.userId === user.id || c.id === user.carrierProfileId) || null;
      }
      if (carrier) {
        if (isTrial) {
          // 7 günlük deneme kart kaydı
          db.recordCarrierCardAdded(carrier.id);
          const updated = db.getCarrierById(carrier.id);
          setCarrierData(updated);
          if (updated) {
            updateFirestoreCarrier(carrier.id, {
              hasCardAdded: true,
              trialStatus: updated.trialStatus,
              planId: updated.planId
            }).catch(() => {});
          }
        } else {
          // Normal ödeme / paket yenileme
          db.updateCarrier(carrier.id, { planId: targetPlanId, trialStatus: 'CONVERTED', autoRenew: true });
          db.renewCarrierSubscription(carrier.id, targetPlanId);
          const updated = db.getCarrierById(carrier.id);
          setCarrierData(updated);
          updateFirestoreCarrier(carrier.id, { planId: targetPlanId, trialStatus: 'CONVERTED' }).catch(() => {});
        }
      }
    }
  }, [isSuccess, planKey, isTrial]);

  const planTitles: Record<string, string> = {
    starter: 'Başlangıç Paketi',
    pro: 'Pro Paketi',
    gold: 'Gold (En Üst) Paketi',
  };
  const planTitle = planTitles[planKey] || 'Gold Paketi';

  // ── FAILURE / CANCELLED STATE ──
  if (!isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-200/90 p-6 sm:p-8 shadow-xl text-center">
          
          {/* Failed Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
            <XCircle className="w-9 h-9" />
          </div>

          {/* Safe Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Ödeme Tamamlanamadı</span>
          </div>

          <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
            Ödeme İşlemi Başarısız Oldu
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 leading-relaxed">
            <strong className="text-[#111E38]">{planTitle}</strong> ({cycle === 'yearly' ? 'Yıllık' : 'Aylık'}) için başlatılan ödeme işlemi bankanız veya ödeme altyapısı tarafından onaylanmadı.
          </p>

          {/* Details Box */}
          <div className="bg-red-50/40 border border-red-100 rounded-2xl p-4 my-6 text-left space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between pb-2 border-b border-red-100 font-medium">
              <span className="text-slate-500">İşlem Durumu:</span>
              <span className="font-bold text-red-600">
                {statusParam === 'cancelled' || statusParam === 'canceled' ? 'Kullanıcı Tarafından İptal Edildi' : 'Ödeme Alınamadı / Başarısız'}
              </span>
            </div>
            {paymentId && (
              <div className="flex items-center justify-between pb-2 border-b border-red-100 font-medium">
                <span className="text-slate-500">Ödeme Referansı:</span>
                <span className="font-mono text-[11px] font-bold text-slate-700">{paymentId}</span>
              </div>
            )}
            <div className="pt-1 text-[11px] text-slate-600 space-y-1 font-medium leading-relaxed">
              <p>• Kredi veya banka kartınızdan herhangi bir ücret tahsil edilmemiştir.</p>
              <p>• Kart limiti, 3D Secure onay şifresi veya internet alışverişi izinlerinizi kontrol edip tekrar deneyebilirsiniz.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <Link href="/paketler" className="block w-full">
              <Button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
                <RefreshCw className="w-4 h-4" />
                <span>Tekrar Dene (Paketlere Dön)</span>
              </Button>
            </Link>

            <Link href="/iletisim" className="block w-full">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Destek ve Müşteri Hizmetleri</span>
              </button>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400 mt-5">
            Sorun yaşamaya devam ederseniz <strong>bilgi@tasinteklif.com</strong> adresinden bize ulaşabilirsiniz.
          </p>

        </div>
      </div>
    );
  }

  // ── SUCCESS STATE ──
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Secure Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isTrial ? 'Kart Doğrulaması Başarılı (0 ₺)' : '256-bit SSL Güvenli Ödeme Onaylandı'}</span>
        </div>

        <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
          {isTrial ? '7 Gün Ücretsiz PRO Başlatıldı! 🎉' : 'Ödemeniz Onaylandı! 🎉'}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {isTrial ? (
            <>
              Bugün kartınızdan <strong>0 ₺</strong> çekildi. <strong className="text-[#F95700]">7 gün boyunca Profesyonel Paket</strong> ayrıcalıklarından ücretsiz yararlanabilirsiniz.
            </>
          ) : (
            <>
              <strong className="text-[#F95700]">{planTitle}</strong> ({cycle === 'yearly' ? 'Yıllık' : 'Aylık'}) üyeliğiniz firmanıza başarıyla tanımlandı.
            </>
          )}
        </p>

        {/* Benefits Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-6 text-left space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-[#F95700] shrink-0" />
            <span>{isTrial ? '50 Teklif & 35 Müşteri Telefonu kilidi açıldı' : 'Sınırsız teklif verme ve müşteri aramaları aktif edildi'}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Truck className="w-4 h-4 text-[#F95700] shrink-0" />
            <span>{isTrial ? '20 Defter İlanı & Dönüş Yükü bildirimleri' : 'Nakliyeci Defteri ve Dönüş Yükü paneli açıldı'}</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isTrial ? '7 Gün sonra ₺2.990 / ay ile devam eder (İstediğiniz an iptal edebilirsiniz)' : 'Firma profiliniz vitrin sıralamasına yükseltildi'}</span>
          </div>
        </div>

        <Link href="/app/carrier" className="block w-full">
          <Button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
            <span>Nakliyeci Paneline Git</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <p className="text-[11px] text-slate-400 mt-4">
          {isTrial 
            ? 'Deneme süreniz boyunca dilediğiniz zaman üyeliğinizi iptal edebilirsiniz. 7 gün dolmadan ücret çekilmez.' 
            : 'Faturanız ve ödeme makbuzunuz sistemimize kayıtlı e-posta adresinize iletilmiştir.'}
        </p>

      </div>
    </div>
  );
}

export default function OdemeSonucPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <OdemeSonucContent />
    </Suspense>
  );
}
