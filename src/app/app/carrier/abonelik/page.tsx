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
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/data/mock-db';
import { SubscriptionPlan, CarrierProfile, CarrierSubscription } from '@/types';

export default function CarrierSubscriptionPage() {
  const [carrier, setCarrier] = React.useState<CarrierProfile | null>(null);
  const [sub, setSub] = React.useState<CarrierSubscription | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const plans = db.getPlans();

  React.useEffect(() => {
    const currentUser = db.getCurrentUser();
    let activeCarrier = db.getCurrentCarrier();
    if (!activeCarrier && currentUser) {
      activeCarrier = db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) || null;
    }
    setCarrier(activeCarrier);
    if (activeCarrier) {
      setSub(db.getCarrierSubscription(activeCarrier.id));
    }
    setIsLoaded(true);
  }, []);

  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState<SubscriptionPlan | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const currentPlan = carrier ? (plans.find(p => p.id === carrier.planId) || plans[0]) : plans[0];

  // Kalan gün hesabı
  const periodEndDate = sub ? new Date(sub.currentPeriodEnd) : new Date();
  const now = new Date();
  const diffTime = periodEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleCancelSubscription = () => {
    if (!carrier) return;
    const updated = db.cancelCarrierSubscription(carrier.id);
    setSub(updated);
    setCancelModalOpen(false);
  };

  const handleRenewSubscription = () => {
    if (!carrier) return;
    const updated = db.renewCarrierSubscription(carrier.id);
    setSub(updated);
  };

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForTrial || !carrier) return;

    setIsActivating(true);
    setTimeout(() => {
      db.updateCarrier(carrier.id, { planId: selectedPlanForTrial.id });
      const updatedSub = db.renewCarrierSubscription(carrier.id);
      const updatedCarrier = db.getCarrierById(carrier.id) || { ...carrier, planId: selectedPlanForTrial.id };
      setCarrier(updatedCarrier);
      setSub(updatedSub);
      setIsActivating(false);
      setSelectedPlanForTrial(null);
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
          <span>← Operasyon Merkezi&apos;ne Dön</span>
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

      {/* ACTIVE / CANCELED SUBSCRIPTION BANNER */}
      <div className={`bg-white rounded-2xl border-2 p-6 sm:p-8 mb-10 shadow-sm ${
        isCanceled ? 'border-red-300 bg-red-50/20' : currentPlan.id === 'plan_gold' ? 'border-amber-300' : currentPlan.id === 'plan_pro' ? 'border-blue-300' : 'border-slate-200'
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
                  Başlangıç (Ücretsiz)
                </span>
              )}

              {isCanceled ? (
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
              {currentPlan.priceMonthly === 0 ? (
                <>
                  Ücretsiz Başlangıç paketindesiniz. Her gün <strong className="text-[#0A1128]">3 adet ücretsiz teklif verme hakkınız</strong> bulunmaktadır. Daha fazla teklif ve telefon erişimi için paket yükseltebilirsiniz.
                </>
              ) : isCanceled ? (
                <>
                  Aboneliğiniz iptal edildi. Dönem sonuna (<strong className="text-[#0A1128]">{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>) kadar tüm haklarınız geçerlidir. Otomatik yenilenmeyecektir.
                </>
              ) : (
                <>
                  Sonraki Yenileme Tarihi: <strong className="text-[#0A1128]">{periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> • Aylık Ücret: <strong className="text-[#0A1128]">{currentPlan.priceMonthly.toLocaleString('tr-TR')} TL / Ay</strong>
                </>
              )}
            </p>
          </div>

          {currentPlan.priceMonthly > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              {isCanceled ? (
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
              )}
            </div>
          )}
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
                      onClick={() => setSelectedPlanForTrial(p)}
                    >
                      7 Gün Ücretsiz Dene
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-DAY TRIAL START MODAL (Spec Item 21) */}
      <Modal
        isOpen={!!selectedPlanForTrial}
        onClose={() => setSelectedPlanForTrial(null)}
        title="7 Gün Ücretsiz Denemenizi Başlatın"
      >
        {selectedPlanForTrial && (
          <form onSubmit={handleStartTrial} className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0A1128] block text-base">{selectedPlanForTrial.name} Paket</span>
                <span className="text-xs text-slate-500">{selectedPlanForTrial.priceMonthly} TL / Ay (7 gün sonra)</span>
              </div>
              <Badge variant="gold" size="sm" />
            </div>

            {/* Transparent Billing Notice (Spec Item 21) */}
            <div className="p-4 rounded-xl bg-[#EAF3FF] border border-blue-200 text-xs text-[#0B3B8F] leading-relaxed space-y-1">
              <strong className="block font-bold">Bugün Hiçbir Ücret Alınmaz</strong>
              <p>
                7 günlük ücretsiz kullanımınız bittikten sonra seçtiğiniz paket üzerinden üyeliğiniz otomatik yenilenir. İstediğiniz zaman tek tıkla iptal edebilirsiniz.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kart Numarası</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Son Kullanma</label>
                  <input
                    type="text"
                    required
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CVV</label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlanForTrial(null)}>
                Vazgeç
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isActivating}>
                Denemeyi Başlat
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Cancel Modal (Spec Item 22) */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Aboneliğinizi İptal Etmek İstediğinize Emin misiniz?"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-slate-600">
            Aboneliğinizi iptal ettiğinizde dönem sonuna (<strong>25 Eylül</strong>) kadar mevcut Gold ve teklif verme avantajlarınızdan yararlanmaya devam edebilirsiniz.
          </p>
          <div className="pt-4 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCancelModalOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="danger" size="sm" onClick={handleCancelSubscription}>
              Aboneliği İptal Et
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
