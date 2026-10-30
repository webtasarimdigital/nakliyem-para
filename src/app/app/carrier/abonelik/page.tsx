'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  ArrowRight,
  Zap,
  Clock,
  Lock,
  FileText,
  Printer,
  CheckCircle2,
  RefreshCw,
  X
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';
import { SubscriptionPlan, CarrierProfile, CarrierSubscription, CarrierInvoice } from '@/types';

export default function CarrierSubscriptionPage() {
  const [carrier, setCarrier] = React.useState<CarrierProfile | null>(null);
  const [sub, setSub] = React.useState<CarrierSubscription | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const plans = db.getPlans();

  React.useEffect(() => {
    const syncData = () => {
      const currentUser = db.getCurrentUser();
      let activeCarrier = db.getCurrentCarrier();
      if (!activeCarrier && currentUser) {
        activeCarrier = db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) || null;
      }
      setCarrier(activeCarrier);
      if (activeCarrier) {
        setSub(db.getCarrierSubscription(activeCarrier.id));
        setInvoices(db.getCarrierInvoices(activeCarrier.id));
      }
      setIsLoaded(true);
    };

    syncData();
    window.addEventListener('storage', syncData);
    window.addEventListener('auth-changed', syncData);
    window.addEventListener('invoice-added', syncData);
    return () => {
      window.removeEventListener('storage', syncData);
      window.removeEventListener('auth-changed', syncData);
      window.removeEventListener('invoice-added', syncData);
    };
  }, []);

  const [invoices, setInvoices] = useState<CarrierInvoice[]>([]);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<CarrierInvoice | null>(null);
  const [changePlanModalOpen, setChangePlanModalOpen] = useState(false);
  const [targetPlanForChange, setTargetPlanForChange] = useState<SubscriptionPlan | null>(null);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [cardUpdateModalOpen, setCardUpdateModalOpen] = useState(false);

  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState<SubscriptionPlan | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardError, setCardError] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardError('');
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardError('');
    const value = e.target.value;
    const clean = value.replace(/\D/g, '').slice(0, 4);

    if (clean.length === 0) {
      setCardExpiry('');
      return;
    }

    if (clean.length === 1) {
      if (Number(clean) > 1) {
        setCardExpiry(`0${clean}/`);
        return;
      }
      setCardExpiry(clean);
      return;
    }

    let month = clean.slice(0, 2);
    if (Number(month) > 12) month = '12';
    if (Number(month) === 0) month = '01';

    if (clean.length > 2) {
      setCardExpiry(`${month}/${clean.slice(2, 4)}`);
    } else {
      if (cardExpiry.endsWith('/') && value.length < cardExpiry.length) {
        setCardExpiry(month.slice(0, 1));
      } else {
        setCardExpiry(`${month}/`);
      }
    }
  };

  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardError('');
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvc(raw);
  };

  const currentPlan = carrier ? (plans.find(p => p.id === carrier.planId) || plans[0]) : plans[0];

  // Kalan gün hesabı & deneme durumu
  const now = new Date();
  const isTrial = Boolean(
    carrier?.trialStatus === 'ACTIVE_TRIAL' &&
    carrier?.trialEndsAt &&
    new Date(carrier.trialEndsAt).getTime() > now.getTime()
  );
  const periodEndDate = isTrial && carrier?.trialEndsAt
    ? new Date(carrier.trialEndsAt)
    : (sub ? new Date(sub.currentPeriodEnd) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  const diffTime = periodEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleCancelSubscription = async () => {
    if (!carrier) return;
    setIsCancelling(true);
    try {
      await fetch('/api/dodo/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carrierId: carrier.id }),
      });
    } catch (err) {
      console.warn('Subscription cancel API error:', err);
    }
    const updated = db.cancelCarrierSubscription(carrier.id);
    const updatedCarrier = db.getCarrierById(carrier.id) || { ...carrier, autoRenew: false };
    setSub(updated);
    setCarrier(updatedCarrier);
    setIsCancelling(false);
    setCancelModalOpen(false);
  };

  const handleRenewSubscription = () => {
    if (!carrier) return;
    const targetPlan = carrier.planId === 'plan_gold' ? 'plan_gold' : 'plan_pro';
    const updated = db.renewCarrierSubscription(carrier.id, targetPlan);
    const freshCarrier = db.getCarrierById(carrier.id) || { ...carrier, planId: targetPlan, trialStatus: 'CONVERTED' as const, autoRenew: true };
    setSub(updated);
    setCarrier(freshCarrier);
    updateFirestoreCarrier(carrier.id, { planId: targetPlan, trialStatus: 'CONVERTED' }).catch(() => {});
  };

  const isPastDue = sub?.status === 'PAST_DUE';
  const graceEndMs = sub?.gracePeriodEndsAt ? new Date(sub.gracePeriodEndsAt).getTime() : 0;
  const graceHoursRemaining = Math.max(0, Math.ceil((graceEndMs - now.getTime()) / (1000 * 60 * 60)));

  const handleChangePlanConfirm = (targetPlan: SubscriptionPlan) => {
    if (!carrier) return;
    setIsChangingPlan(true);

    const planTierOrder: Record<string, number> = {
      plan_starter: 1,
      starter: 1,
      plan_pro: 2,
      pro: 2,
      plan_gold: 3,
      gold: 3,
    };
    const currentTier = planTierOrder[carrier.planId] || 1;
    const targetTier = planTierOrder[targetPlan.id] || 1;
    const isDowngrade = targetTier < currentTier;

    const updatedSub = db.changeCarrierPlan(carrier.id, targetPlan.id, isDowngrade);
    const freshCarrier = db.getCarrierById(carrier.id) || {
      ...carrier,
      planId: isDowngrade ? carrier.planId : targetPlan.id,
      autoRenew: !isDowngrade,
    };
    setSub(updatedSub);
    setCarrier(freshCarrier);
    setInvoices(db.getCarrierInvoices(carrier.id));

    if (!isDowngrade) {
      updateFirestoreCarrier(carrier.id, { planId: targetPlan.id, trialStatus: 'CONVERTED' }).catch(() => {});
    }

    setIsChangingPlan(false);
    setChangePlanModalOpen(false);
    setTargetPlanForChange(null);
  };

  const handleUpdateCardAndClearPastDue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrier) return;
    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) {
      setCardError('Lütfen 16 haneli kart numaranızı giriniz.');
      return;
    }
    setIsActivating(true);
    setTimeout(() => {
      const targetPlan = carrier.planId === 'plan_gold' ? 'plan_gold' : 'plan_pro';
      const updated = db.renewCarrierSubscription(carrier.id, targetPlan);
      const freshCarrier = db.getCarrierById(carrier.id) || { ...carrier, planId: targetPlan, trialStatus: 'CONVERTED' as const, autoRenew: true };
      setSub(updated);
      setCarrier(freshCarrier);
      setInvoices(db.getCarrierInvoices(carrier.id));
      setIsActivating(false);
      setCardUpdateModalOpen(false);
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
    }, 600);
  };

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForTrial || !carrier) return;

    const rawCard = cardNumber.replace(/\s/g, '');
    if (rawCard.length < 16) {
      setCardError('Lütfen 16 haneli kart numaranızı eksiksiz giriniz.');
      return;
    }
    if (cardExpiry.length < 5) {
      setCardError('Lütfen geçerli bir son kullanma tarihi giriniz (AA/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setCardError('Lütfen 3 haneli güvenlik kodunu (CVC) giriniz.');
      return;
    }

    setCardError('');
    setIsActivating(true);
    setTimeout(async () => {
      const hasUsedTrial = carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED';
      const isTrial = !hasUsedTrial && (selectedPlanForTrial.trialDays > 0 || selectedPlanForTrial.id === 'plan_pro');
      let updatedCarrier: CarrierProfile;
      let updatedSub: CarrierSubscription;

      if (isTrial) {
        db.recordCarrierCardAdded(carrier.id, rawCard.slice(-4));
        db.startCarrierTrial(carrier.id);
        const fresh = db.getCarrierById(carrier.id);
        updatedCarrier = fresh || {
          ...carrier,
          planId: 'plan_pro',
          hasCardAdded: true,
          trialStatus: 'ACTIVE_TRIAL',
          trialStartedAt: new Date().toISOString(),
          trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString()
        };
        updatedSub = db.getCarrierSubscription(carrier.id);
        
        try {
          await updateFirestoreCarrier(carrier.id, {
            planId: 'plan_pro',
            hasCardAdded: true,
            trialStatus: updatedCarrier.trialStatus,
            trialStartedAt: updatedCarrier.trialStartedAt,
            trialEndsAt: updatedCarrier.trialEndsAt,
          });
        } catch (err) {
          console.warn('Firestore trial sync warning:', err);
        }
      } else {
        // Doğrudan satın alma / abonelik yenileme — Tüm Pro/Gold yetkilerini anında aç
        updatedSub = db.renewCarrierSubscription(carrier.id, selectedPlanForTrial.id);
        const fresh = db.getCarrierById(carrier.id);
        updatedCarrier = fresh || { ...carrier, planId: selectedPlanForTrial.id, trialStatus: 'CONVERTED' as const, autoRenew: true };
        try {
          await updateFirestoreCarrier(carrier.id, {
            planId: selectedPlanForTrial.id,
            trialStatus: 'CONVERTED',
          });
        } catch (err) {
          console.warn('Firestore plan sync warning:', err);
        }
      }

      setCarrier(updatedCarrier);
      setSub(updatedSub);
      setIsActivating(false);
      setSelectedPlanForTrial(null);
      setCardNumber('');
      setCardExpiry('');
      setCardCvc('');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-changed'));
        window.dispatchEvent(new Event('storage'));
      }
    }, 800);
  };

  const isCanceled = sub?.status === 'CANCELED' || sub?.cancelAtPeriodEnd;

  if (!isLoaded || !carrier || !sub) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-8 h-8 border-4 border-[#F95700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back to Operation Center */}
      <div className="mb-6">
        <Link
          href="/app/carrier"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#F95700] bg-white hover:bg-orange-50/50 px-3.5 py-2 rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-[#F95700]" />
          <span>← Teklif Durumları&apos;na Dön</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Abonelik & Paket Yönetimi
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            Firma Üyeliğiniz ve Ayrıcalıklarınız
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Teklif haklarınızı, alarmlarınızı ve sponsorlu reklam görünürlüğünüzü yönetin.
          </p>
        </div>
      </div>

      {/* ⚠️ GRACE PERIOD WARNING BANNER (When payment failed) */}
      {isPastDue && (
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
              <AlertCircle className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-black text-xs">
                  72 Saat Ek Süre (Grace Period)
                </span>
                <span className="text-xs font-bold text-amber-800">
                  {graceHoursRemaining > 0 ? `${graceHoursRemaining} saat kaldı` : 'Süre doldu'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#111E38] mt-1">
                Son Abonelik Yenileme Ödemeniz Alınamadı
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5 max-w-2xl leading-relaxed">
                Banka veya kart bakiyesi nedeniyle tahsilat yapılamadı ({sub?.failedPaymentReason || 'Bakiye yetersiz'}). <strong>Haklarınız ek süre boyunca kesintisiz devam etmektedir.</strong> Sistemimiz asla habersiz tekrar tekrar para çekmez veya mükerrer tahsilat yapmaz. Lütfen kart bilgilerinizi güncelleyin.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCardUpdateModalOpen(true)}
            className="w-full md:w-auto font-black text-xs px-4 py-2.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white border-none shadow-md cursor-pointer"
          >
            Kartı Güncelle &amp; Ödemeyi Tamamla
          </Button>
        </div>
      )}

      {/* ACTIVE / CANCELED SUBSCRIPTION BANNER */}
      <div className={`bg-white rounded-2xl border-2 p-6 sm:p-8 mb-10 shadow-sm ${
        isPastDue ? 'border-amber-400 bg-amber-50/20' : isCanceled ? 'border-red-300 bg-red-50/20' : currentPlan.id === 'plan_gold' ? 'border-amber-300' : currentPlan.id === 'plan_pro' ? 'border-blue-300' : 'border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {currentPlan.id === 'plan_gold' ? (
                <Badge variant="gold" size="md" />
              ) : currentPlan.id === 'plan_pro' ? (
                <Badge variant="pro" size="md" />
              ) : (
                <span className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Başlangıç
                </span>
              )}

              {isPastDue ? (
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Ödeme Bekleniyor (Ek Süre)
                </span>
              ) : isCanceled ? (
                <span className="text-xs font-black text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                  İptal Talebi Alındı
                </span>
              ) : (
                <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Aktif Paket
                </span>
              )}
              {currentPlan.priceMonthly > 0 && (
                <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {daysRemaining} Gün Kaldı
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
              {currentPlan.name} Paketi
            </h2>

            <p className="text-xs sm:text-sm text-slate-600">
              {sub?.status === 'TRIALING' || carrier.planId === 'trial' ? (
                <>
                  7 günlük ücretsiz deneme sürecindesiniz. Deneme süresi boyunca tüm Profesyonel özelliklerini ücretsiz kullanabilirsiniz.
                </>
              ) : isCanceled ? (
                <>
                  <span className="text-emerald-700 font-bold block mb-1">✓ Aboneliğiniz ve otomatik yenileme başarıyla iptal edildi.</span>
                  Dönem sonuna (<strong className="text-[#0A1128]">{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>) kadar haklarınız geçerlidir. Süre bitiminde veya sonrasında kartınızdan kesinlikle hiçbir ücret çekilmeyecektir (0 ₺).
                </>
              ) : (
                <>
                  Sonraki Yenileme Tarihi: <strong className="text-[#0A1128]">{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> • Aylık Ücret: <strong className="text-[#0A1128]">{currentPlan.priceMonthly.toLocaleString('tr-TR')} TL / Ay</strong>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const target = currentPlan.id === 'plan_gold' ? (plans.find(p => p.id === 'plan_pro') || plans[1]) : (plans.find(p => p.id === 'plan_gold') || plans[2]);
                setTargetPlanForChange(target);
                setChangePlanModalOpen(true);
              }}
              className="text-xs font-bold w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800"
            >
              Paket Değiştir
            </Button>

            {currentPlan.priceMonthly > 0 && (
              isCanceled ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRenewSubscription}
                  className="text-xs font-bold w-full sm:w-auto"
                >
                  Aboneliği Yeniden Başlat
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelModalOpen(true)}
                  className="text-xs text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto font-bold"
                >
                  Aboneliği İptal Et
                </Button>
              )
            )}
          </div>
        </div>

        {/* Dynamic Entitlements List */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Teklif Verme Hakkı</span>
            <span className="font-bold text-emerald-700">
              {currentPlan.id === 'plan_starter' ? 'Günde 3 Adet Ücretsiz' : currentPlan.id === 'plan_pro' ? 'Aylık 100 Teklif' : 'Sınırsız Teklif'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Müşteri Telefon Erişimi</span>
            <span className={`font-bold ${currentPlan.features.customerPhoneAccess ? 'text-emerald-700' : 'text-slate-400'}`}>
              {currentPlan.features.customerPhoneAccess ? '✓ Açık' : 'Kapalı (Gold/Pro)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Sponsor Reklamı</span>
            <span className={`font-bold ${currentPlan.id === 'plan_gold' ? 'text-amber-700' : 'text-slate-400'}`}>
              {currentPlan.id === 'plan_gold' ? 'Ana Sayfa + Defter' : 'Yok (Gold ile Açık)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-0.5">Rota Alarm Limiti</span>
            <span className="font-bold text-emerald-700">
              {currentPlan.features.routeAlarmLimit === 'unlimited' ? 'Sınırsız' : `${currentPlan.features.routeAlarmLimit} Adet`}
            </span>
          </div>
        </div>
      </div>

      {/* 3 PLAN COMPARISON CARDS (Spec Item 105) */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#0A1128] mb-2">Tüm Paketler</h2>
        <p className="text-xs text-slate-500 mb-6">İhtiyacınıza uygun paketi seçerek 7 gün ücretsiz deneyebilirsiniz.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = p.id === carrier.planId;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border-2 transition-all p-6 shadow-xs flex flex-col justify-between ${
                  p.id === 'plan_gold'
                    ? 'border-amber-400 bg-amber-50/10'
                    : isCurrent
                    ? 'border-[#146EF5]'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-black text-[#0A1128]">{p.name}</h3>
                    {p.badge && (
                      <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {p.tagline}
                  </p>

                  <div className="mb-6">
                    <span className="text-3xl font-black text-[#0A1128]">{p.priceMonthly.toLocaleString('tr-TR')} TL</span>
                    <span className="text-xs text-slate-500 font-medium"> / Ay + KDV</span>
                  </div>

                  {/* Feature list */}
                  <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{p.features.monthlyOfferLimit === 'unlimited' ? 'Sınırsız Teklif Hakkı' : `Aylık ${p.features.monthlyOfferLimit} Teklif Hakkı`}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{p.features.customerPhoneAccess ? 'Müşteri Telefon Numarası Erişimi' : 'Müşteri Telefon Erişimi Yok'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{p.features.routeAlarmLimit === 'unlimited' ? 'Sınırsız Rota Alarmı' : `${p.features.routeAlarmLimit} Rota Alarmı`}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Defter İş Ağı Tam Erişimi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{p.features.featuredHomepage ? 'Ana Sayfada Sponsorlu Firma Reklamı' : 'Sponsorlu Reklam Yok'}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  {isCurrent ? (
                    <Button variant="secondary" size="md" className="w-full" disabled>
                      Mevcut Paketiniz
                    </Button>
                  ) : (
                    <Button
                      variant={p.id === 'plan_gold' ? 'gold' : 'primary'}
                      size="md"
                      className="w-full"
                      onClick={() => {
                        if (carrier.hasCardAdded || sub.status === 'ACTIVE' || sub.status === 'PAST_DUE') {
                          setTargetPlanForChange(p);
                          setChangePlanModalOpen(true);
                        } else {
                          setSelectedPlanForTrial(p);
                        }
                      }}
                    >
                      {carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED' ? 'Bu Pakete Geç' : '7 Gün Ücretsiz Dene'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ÖDEME VE FATURA GEÇMİŞİ (E-ARŞİV) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 text-[#F95700] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#111E38]">
                Ödeme ve Fatura Geçmişi (e-Arşiv)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Abonelik tahsilatları, provizyon onayları ve resmi e-Arşiv fatura kayıtlarınız.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
            Toplam {invoices.length} Kayıt
          </span>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            Henüz oluşturulmuş bir fatura veya provizyon kaydınız bulunmamaktadır.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Tarih</th>
                  <th className="p-3">Fatura No</th>
                  <th className="p-3">Hizmet / Paket</th>
                  <th className="p-3">Tutar</th>
                  <th className="p-3">Ödeme Yöntemi</th>
                  <th className="p-3">Durum</th>
                  <th className="p-3 text-right">e-Arşiv</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-medium whitespace-nowrap">{inv.date}</td>
                    <td className="p-3 font-mono font-bold text-[#111E38] whitespace-nowrap">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3 font-bold text-slate-800">{inv.planName}</td>
                    <td className="p-3 font-black text-[#111E38] whitespace-nowrap">
                      {inv.totalAmount === 0 ? '0 ₺ (Provizyon)' : `${inv.totalAmount.toLocaleString('tr-TR')} TL`}
                    </td>
                    <td className="p-3 text-slate-600 whitespace-nowrap">
                      {inv.paymentMethod} {inv.cardLastFour ? `(**** ${inv.cardLastFour})` : ''}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {inv.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ödendi
                        </span>
                      ) : inv.status === 'FAILED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          Başarısız
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                          İade
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoiceForModal(inv)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#F95700] hover:text-white text-slate-700 font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Fatura Görüntüle</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7-DAY TRIAL OR SUBSCRIPTION ACTIVATION MODAL */}
      <Modal
        isOpen={!!selectedPlanForTrial}
        onClose={() => {
          setSelectedPlanForTrial(null);
          setCardError('');
        }}
        title={carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED' ? `${selectedPlanForTrial?.name} Paketini Başlat` : '7 Gün Ücretsiz Denemenizi Başlatın'}
      >
        {selectedPlanForTrial && (
          <form onSubmit={handleStartTrial} className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0A1128] block text-base">{selectedPlanForTrial.name} Paket</span>
                <span className="text-xs text-slate-500">
                  {carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED' 
                    ? `${selectedPlanForTrial.priceMonthly.toLocaleString('tr-TR')} TL / Ay` 
                    : `${selectedPlanForTrial.priceMonthly.toLocaleString('tr-TR')} TL / Ay (7 gün sonra)`}
                </span>
              </div>
              <Badge variant="gold" size="sm" />
            </div>

            {/* Transparent Billing Notice */}
            <div className="p-4 rounded-xl bg-[#EAF3FF] border border-blue-200 text-xs text-[#0B3B8F] leading-relaxed space-y-1">
              <strong className="block font-bold">
                {carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED' ? 'Anında Tam Yetki & Aktivasyon' : 'Bugün Hiçbir Ücret Alınmaz'}
              </strong>
              <p>
                {carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED'
                  ? 'Aboneliğiniz tanımlanır tanımlanmaz tüm ilanlara teklif verme ve müşteri telefonu görme yetkiniz anında açılacaktır.'
                  : '7 günlük ücretsiz kullanımınız bittikten sonra seçtiğiniz paket üzerinden üyeliğiniz otomatik yenilenir. İstediğiniz zaman tek tıkla iptal edebilirsiniz.'}
              </p>
            </div>

            {cardError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{cardError}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kart Numarası</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full p-2.5 pl-3 pr-10 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm"
                  />
                  <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Son Kullanma</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="AA / YY"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={handleCardExpiryChange}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CVV</label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="000"
                      maxLength={3}
                      value={cardCvc}
                      onChange={handleCardCvcChange}
                      className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm text-center"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL ile güvenli ve şifrelenmiş kart doğrulaması</span>
              </div>
            </div>

            <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
              <Button
                variant="outline"
                size="md"
                type="button"
                className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 text-center"
                onClick={() => {
                  setSelectedPlanForTrial(null);
                  setCardError('');
                }}
              >
                Vazgeç
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isActivating} className="w-full sm:w-auto font-black text-xs sm:text-sm py-2.5 sm:py-3 text-center">
                {carrier.trialStatus === 'EXPIRED' || carrier.trialStatus === 'CONVERTED' ? 'Aboneliği Aktif Et' : 'Denemeyi Başlat'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Modal (Spec Item 22) */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title={isTrial ? '7 Günlük Ücretsiz Deneme İptali' : 'Aboneliğinizi İptal Etmek İstediğinize Emin misiniz?'}
      >
        <div className="space-y-4 text-xs sm:text-sm">
          {isTrial ? (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-black text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>%100 Ücretsiz Bitiş Garantisi (0 ₺)</span>
              </div>
              <p>
                7 günlük ücretsiz denemenizi iptal ettiğinizde <strong>{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> tarihine kadar Pro haklarınız kesintisiz devam eder.
              </p>
              <div className="p-2 rounded-lg bg-white/80 border border-emerald-200 font-black text-emerald-800">
                🛡️ 7 gün dolduğunda kartınızdan <strong>KESİNLİKLE HİÇBİR ÜCRET ÇEKİLMEYECEKTİR (0 ₺)</strong>.
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-black text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Gelecek Ay Yenileme İptali</span>
              </div>
              <p>
                Aboneliğinizi iptal ettiğinizde <strong>{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> tarihine kadar Pro hesabınız geçerlidir.
              </p>
              <div className="p-2 rounded-lg bg-white/80 border border-amber-200 font-black text-amber-800">
                📅 Dönem sonunda gelecek ay için <strong>kartınızdan herhangi bir ücret çekilmeyecektir</strong>.
              </div>
            </div>
          )}

          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <Button variant="outline" size="md" className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 text-center" onClick={() => setCancelModalOpen(false)} disabled={isCancelling}>
              Vazgeç (Aboneliği Koru)
            </Button>
            <Button variant="danger" size="md" className="w-full sm:w-auto font-black text-xs sm:text-sm py-2.5 sm:py-3 text-center" onClick={handleCancelSubscription} disabled={isCancelling}>
              {isCancelling ? 'İptal Ediliyor...' : (isTrial ? 'Denemeyi İptal Et (0 ₺ Garantili)' : 'Aboneliği İptal Et')}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── PAKET DEĞİŞTİRME MODALI (YÜKSELT / DÜŞÜR) ── */}
      <Modal
        isOpen={changePlanModalOpen}
        onClose={() => {
          setChangePlanModalOpen(false);
          setTargetPlanForChange(null);
        }}
        title="Abonelik Paketini Değiştir"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600 font-medium">
            Geçmek istediğiniz yeni paketi seçin. Üst pakete geçiş anında aktif olur; alt pakete geçiş ise mevcut fatura döneminizin bitiminde devreye girer.
          </p>

          <div className="space-y-2.5">
            {plans.map((p) => {
              const isCurrent = p.id === carrier.planId;
              const isSelected = targetPlanForChange?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => !isCurrent && setTargetPlanForChange(p)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isCurrent
                      ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-[#F95700] bg-orange-50/40 ring-2 ring-[#F95700]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{p.name} Paketi</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                          Mevcut
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {p.features.monthlyOfferLimit === 'unlimited' ? 'Sınırsız teklif' : `Aylık ${p.features.monthlyOfferLimit} teklif`} · {p.features.customerPhoneAccess ? 'Müşteri telefonu açık' : 'Telefon kapalı'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#111E38] text-sm block">
                      {p.priceMonthly.toLocaleString('tr-TR')} TL
                    </span>
                    <span className="text-[10px] text-slate-400">/ Ay + KDV</span>
                  </div>
                </div>
              );
            })}
          </div>

          {targetPlanForChange && targetPlanForChange.id !== carrier.planId && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
              <strong>Değişiklik Şartları:</strong>
              <p>
                {targetPlanForChange.priceMonthly > currentPlan.priceMonthly
                  ? `Seçilen ${targetPlanForChange.name} paketine geçiş anında onaylanacak ve yeni haklarınız derhal hesabınıza tanımlanacaktır.`
                  : `Seçilen ${targetPlanForChange.name} paketi, mevcut döneminizin sonu olan ${periodEndDate.toLocaleDateString('tr-TR')} tarihinden itibaren geçerli olacaktır. O tarihe kadar mevcut haklarınız kesilmez.`}
              </p>
            </div>
          )}

          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 text-center"
              onClick={() => {
                setChangePlanModalOpen(false);
                setTargetPlanForChange(null);
              }}
            >
              Vazgeç
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!targetPlanForChange || targetPlanForChange.id === carrier.planId || isChangingPlan}
              isLoading={isChangingPlan}
              className="w-full sm:w-auto font-black text-xs sm:text-sm py-2.5 sm:py-3 text-center"
              onClick={() => targetPlanForChange && handleChangePlanConfirm(targetPlanForChange)}
            >
              Paket Değişikliğini Onayla
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── KART BİLGİSİ GÜNCELLEME VE EK SÜRE ÖDEME MODALI ── */}
      <Modal
        isOpen={cardUpdateModalOpen}
        onClose={() => {
          setCardUpdateModalOpen(false);
          setCardError('');
        }}
        title="Kart Bilgilerini Güncelle &amp; Ödemeyi Tamamla"
      >
        <form onSubmit={handleUpdateCardAndClearPastDue} className="space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed space-y-1">
            <strong>72 Saatlik Ek Süre Kapsamında Güvenli Tahsilat:</strong>
            <p>
              Yeni kart bilgileriniz kaydedilecek ve yalnızca 1 defalık geciken yenileme bedeli ({currentPlan.priceMonthly.toLocaleString('tr-TR')} TL + KDV) tahsil edilecektir. Asla mükerrer veya habersiz çekim yapılmaz.
            </p>
          </div>

          {cardError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{cardError}</span>
            </div>
          )}

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kart Numarası</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full p-2.5 pl-3 pr-10 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm"
                />
                <CreditCard className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Son Kullanma</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="AA / YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={handleCardExpiryChange}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm text-center"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CVC</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="000"
                  maxLength={3}
                  value={cardCvc}
                  onChange={handleCardCvcChange}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold tracking-wider text-slate-900 focus:border-[#F95700] focus:ring-1 focus:ring-[#F95700] outline-hidden text-sm text-center"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <Button
              variant="outline"
              size="md"
              type="button"
              className="w-full sm:w-auto font-bold text-xs sm:text-sm py-2.5 sm:py-3 text-center"
              onClick={() => setCardUpdateModalOpen(false)}
            >
              Vazgeç
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isActivating}
              className="w-full sm:w-auto font-black text-xs sm:text-sm py-2.5 sm:py-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Kartı Kaydet &amp; Borcu Öde
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── RESMİ E-ARŞİV FATURA GÖRÜNTÜLEYİCİ MODAL ── */}
      {selectedInvoiceForModal && (
        <Modal
          isOpen={!!selectedInvoiceForModal}
          onClose={() => setSelectedInvoiceForModal(null)}
          title="e-Arşiv Fatura Belgesi"
        >
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Printable Invoice Sheet */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-slate-800">
              {/* Invoice Top Brand */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-black text-[#111E38] tracking-tight">Taşın Teklif</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Dijital Lojistik &amp; Pazar Yeri Platformu</p>
                  <p className="text-[11px] text-slate-500 font-mono">tasinteklif.com · bilgi@tasinteklif.com</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 font-mono font-bold text-[11px] text-slate-700">
                    e-ARŞİV FATURA
                  </span>
                  <p className="font-mono font-bold text-xs text-[#111E38] mt-1">
                    {selectedInvoiceForModal.invoiceNumber}
                  </p>
                  <p className="text-[11px] text-slate-500">Tarih: {selectedInvoiceForModal.date}</p>
                </div>
              </div>

              {/* Customer / Carrier Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Sayın / Alıcı</span>
                  <span className="font-bold text-[#111E38] text-sm block mt-0.5">
                    {carrier.companyName}
                  </span>
                  <span className="text-slate-600 block mt-0.5">
                    Yetkili: {carrier.authorizedPersonName ? `${carrier.authorizedPersonName} ${carrier.authorizedPersonSurname || ''}`.trim() : carrier.companyName}
                  </span>
                  <span className="text-slate-600 block">Tel: {carrier.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Düzenleyen</span>
                  <span className="font-bold text-[#111E38] text-sm block mt-0.5">Taşın Teklif</span>
                  <span className="text-slate-600 block mt-0.5">Vergi Dairesi: Beşiktaş V.D.</span>
                  <span className="text-slate-600 block">Vergi No: 8392019482</span>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-2">Hizmet Açıklaması</th>
                      <th className="py-2 text-center">Dönem</th>
                      <th className="py-2 text-right">Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 font-bold text-slate-800">
                        {selectedInvoiceForModal.planName}
                      </td>
                      <td className="py-2.5 text-center text-slate-500">
                        {selectedInvoiceForModal.billingPeriod}
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-800">
                        {selectedInvoiceForModal.amount.toLocaleString('tr-TR')} TL
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <div className="w-48 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Ara Toplam:</span>
                    <span>{selectedInvoiceForModal.amount.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>KDV (%20):</span>
                    <span>{selectedInvoiceForModal.taxAmount.toLocaleString('tr-TR')} TL</span>
                  </div>
                  <div className="flex justify-between font-black text-[#111E38] text-sm pt-1 border-t border-slate-200">
                    <span>Genel Toplam:</span>
                    <span>
                      {selectedInvoiceForModal.totalAmount === 0 
                        ? '0 ₺' 
                        : `${selectedInvoiceForModal.totalAmount.toLocaleString('tr-TR')} TL`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status Stamp */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <div className="text-slate-500 space-y-0.5">
                  <p><strong>Ödeme Yöntemi:</strong> {selectedInvoiceForModal.paymentMethod}</p>
                  <p><strong>PCI-DSS Doğrulama:</strong> Dodo Payments Güvenli Altyapı</p>
                </div>
                <div className={`px-3 py-1 rounded-full font-black text-xs ${
                  selectedInvoiceForModal.status === 'PAID'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedInvoiceForModal.status === 'PAID' ? '✓ TAHSİL EDİLDİ' : '✗ ÖDEME BAŞARISIZ'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setSelectedInvoiceForModal(null)}
                className="w-full sm:w-auto font-bold text-xs"
              >
                Kapat
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => window.print()}
                className="w-full sm:w-auto font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / PDF İndir</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
