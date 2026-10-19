'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, Truck, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';

function OdemeSonucContent() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get('plan') || 'gold';
  const cycle = searchParams.get('cycle') || 'monthly';
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);

    const planIdMap: Record<string, string> = {
      starter: 'plan_starter',
      pro: 'plan_pro',
      gold: 'plan_gold',
    };
    const targetPlanId = planIdMap[planKey] || 'plan_gold';

    if (user) {
      let carrier = db.getCurrentCarrier();
      if (!carrier) {
        carrier = db.getCarriers().find(c => c.userId === user.id || c.id === user.carrierProfileId) || null;
      }
      if (carrier) {
        db.updateCarrier(carrier.id, { planId: targetPlanId, verificationStatus: 'APPROVED' });
        db.renewCarrierSubscription(carrier.id);
        updateFirestoreCarrier(carrier.id, { planId: targetPlanId, verificationStatus: 'APPROVED' }).catch(() => {});
      }
    }
  }, [planKey]);

  const planTitles: Record<string, string> = {
    starter: 'Başlangıç Paketi',
    pro: 'Pro Paketi',
    gold: 'Gold (En Üst) Paketi',
  };
  const planTitle = planTitles[planKey] || 'Gold Paketi';

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Dodo Payments Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 mb-3">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Dodo Payments Güvenli Ödeme Altyapısı</span>
        </div>

        <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
          Ödemeniz Onaylandı! 🎉
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          <strong className="text-[#F95700]">{planTitle}</strong> ({cycle === 'yearly' ? 'Yıllık' : 'Aylık'}) üyeliğiniz firmanıza başarıyla tanımlandı.
        </p>

        {/* Benefits Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 my-6 text-left space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-[#F95700] shrink-0" />
            <span>Sınırsız teklif verme ve müşteri aramaları aktif edildi</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Truck className="w-4 h-4 text-[#F95700] shrink-0" />
            <span>Nakliyeci Defteri ve Dönüş Yükü paneli açıldı</span>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Firma profiliniz vitrin sıralamasına yükseltildi</span>
          </div>
        </div>

        <Link href="/app/carrier" className="block w-full">
          <Button className="w-full bg-[#F95700] hover:bg-[#E04D00] text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
            <span>Nakliyeci Paneline Git</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <p className="text-[11px] text-slate-400 mt-4">
          Faturanız ve ödeme makbuzunuz Dodo Payments tarafından e-posta adresinize iletilmiştir.
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
