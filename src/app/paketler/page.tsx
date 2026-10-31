'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Check, X, Sparkles, ArrowRight, ChevronDown,
  Zap, Award, Shield, Star, Clock, Users,
  BookOpen, Bell, Phone, BarChart3, Globe, HelpCircle,
  ChevronUp, ShieldCheck, CheckCircle2, AlertCircle, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { TrialCardModal } from '@/components/subscription/TrialCardModal';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';
import { User, CarrierProfile } from '@/types';

// Plans configuration with Profesyonel as the Featured / 7-Day Free Trial Plan in the Center
const PLANS = [
  {
    id: 'starter',
    name: 'Başlangıç',
    tagline: 'Platformu denemek ve bölgesel işleri görmek isteyen yeni firmalar için',
    priceMonthly: 1199,
    priceYearly: 11990,
    yearlyMonthly: 999,
    hasTrial: false,
    trialBadge: null,
    color: 'border-slate-200',
    headerBg: 'bg-slate-50',
    isFeatured: false,
    badge: 'YENİ BAŞLAYAN',
    ctaText: 'Başlangıç Paketini Seç',
    ctaVariant: 'outline' as const,
    features: {
      trial: false,
      monthlyOfferLimit: '15 teklif / ay',
      customerPhoneAccess: false,
      notebookAccess: true,
      notebookPostLimit: '5 paylaşım / ay',
      routeAlarmLimit: '2 alarm',
      featuredHomepage: false,
      featuredNotebook: false,
      featuredCityPages: false,
      premiumBadge: false,
      analyticsAdvanced: false,
      digitalServicesDiscountPercent: null,
    }
  },
  {
    id: 'pro',
    name: 'Profesyonel',
    tagline: 'Aktif nakliyeciler ve düzenli taşıma yapan firmalar için tam donanım',
    priceMonthly: 2990,
    priceYearly: 29900,
    yearlyMonthly: 2491,
    hasTrial: true,
    trialBadge: '⭐ 7 GÜN ÜCRETSİZ DENEME (0 ₺)',
    color: 'border-[#F95700] ring-4 ring-[#F95700]/20 shadow-2xl',
    headerBg: 'bg-gradient-to-br from-[#0A1128] via-[#111E38] to-[#0A1128]',
    isFeatured: true,
    badge: '⭐ EN ÇOK TERCİH EDİLEN',
    ctaText: '7 Gün Ücretsiz Denemeyi Başlat',
    ctaVariant: 'primary' as const,
    features: {
      trial: true,
      monthlyOfferLimit: '50 teklif / ay',
      customerPhoneAccess: true,
      notebookAccess: true,
      notebookPostLimit: '20 paylaşım / ay',
      routeAlarmLimit: '5 alarm',
      featuredHomepage: false,
      featuredNotebook: true,
      featuredCityPages: true,
      premiumBadge: true,
      analyticsAdvanced: true,
      digitalServicesDiscountPercent: '%15 indirim',
    }
  },
  {
    id: 'gold',
    name: 'Filo / Kurumsal',
    tagline: 'Maksimum güç, sınırsız iş hacmi, filo ve tam görünürlük',
    priceMonthly: 5990,
    priceYearly: 59900,
    yearlyMonthly: 4991,
    hasTrial: false,
    trialBadge: null,
    color: 'border-slate-200',
    headerBg: 'bg-slate-50',
    isFeatured: false,
    badge: 'FİLO & KURUMSAL',
    ctaText: 'Filo Paketini Seç',
    ctaVariant: 'navy' as const,
    features: {
      trial: false,
      monthlyOfferLimit: 'Sınırsız teklif verme',
      customerPhoneAccess: true,
      notebookAccess: true,
      notebookPostLimit: 'Sınırsız Defter paylaşımı',
      routeAlarmLimit: 'Sınırsız rota alarmı',
      featuredHomepage: true,
      featuredNotebook: true,
      featuredCityPages: true,
      premiumBadge: true,
      analyticsAdvanced: true,
      digitalServicesDiscountPercent: '%25 indirim',
    }
  },
];

const COMPARISON_ROWS: { key: keyof typeof PLANS[0]['features']; label: string; info?: string }[] = [
  { key: 'trial', label: '7 Gün Ücretsiz Deneme' },
  { key: 'monthlyOfferLimit', label: 'Aylık Teklif Verme Hakkı' },
  { key: 'customerPhoneAccess', label: 'Müşteri Telefon Numarası Görme' },
  { key: 'notebookAccess', label: 'Nakliyeci Defteri Erişimi' },
  { key: 'notebookPostLimit', label: 'Defter İlan & Boş Araç Limiti' },
  { key: 'routeAlarmLimit', label: 'Akıllı Rota Alarmı' },
  { key: 'featuredHomepage', label: 'Ana Sayfada Öne Çıkma' },
  { key: 'featuredNotebook', label: 'Defterde Sponsorlu Gösterim' },
  { key: 'featuredCityPages', label: 'Şehir Sayfalarında Üst Sıralar' },
  { key: 'premiumBadge', label: 'Onaylı Premium Firma Rozeti' },
  { key: 'analyticsAdvanced', label: 'İş & Eşleşme Analitikleri' },
  { key: 'digitalServicesDiscountPercent', label: 'Dijital Hizmetlerde Özel İndirim' },
];

const FAQS = [
  { q: 'Profesyonel paketteki 7 günlük ücretsiz deneme nasıl çalışır?', a: 'En popüler paketimiz olan Profesyonel paketi seçtiğinizde ilk 7 gün boyunca hiçbir ücret ödemeden tüm özellikleri (aylık 50 teklif, müşteri telefonu görme, vitrin gösterimleri) hemen kullanabilirsiniz. Memnun kalmazsanız süre bitmeden tek tıkla kolayca iptal edebilirsiniz.' },
  { q: 'Yıllık ödemede 2 ay bedava avantajı nedir?', a: 'Aboneliğinizi yıllık peşin tercih ettiğinizde 12 ay yerine sadece 10 ay ücreti ödersiniz. Tam 2 ay platform kullanımınız hediye edilir.' },
  { q: 'İstediğim zaman paket değiştirebilir miyim?', a: 'Evet. Hesabınızdan dilediğiniz an üst veya alt pakete geçiş yapabilir ya da aboneliğinizi yenileme tarihinde sonlandırabilirsiniz.' },
  { q: 'Müşterilerden para alınıyor mu?', a: 'Hayır. Müşteriler için talep açmak ve teklif almak %100 ücretsizdir. Nakliyecilerimiz abonelik modeli ile diledikleri kadar işe teklif verip müşteriyle doğrudan anlaşır.' },
  { q: 'Ödeme yöntemleri nelerdir?', a: 'Kredi kartı ve banka kartı ile 3D Secure güvencesiyle anında ödeme yapabilirsiniz.' }
];

function PaketlerContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams?.get('plan');
  const cycleParam = searchParams?.get('cycle');

  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Auth & Carrier State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [carrier, setCarrier] = useState<CarrierProfile | null>(null);

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    title: string;
    subtitle: string;
    targetRole: 'CUSTOMER' | 'CARRIER';
  }>({
    title: 'Paket Seçimi İçin Giriş Yapın',
    subtitle: 'Seçtiğiniz paketi firmanıza tanımlamak ve teklif vermeye başlamak için lütfen nakliyeci hesabınıza giriş yapın.',
    targetRole: 'CARRIER'
  });
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<typeof PLANS[0] | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);
  const [upgradeSuccessPlan, setUpgradeSuccessPlan] = useState<typeof PLANS[0] | null>(null);

  useEffect(() => {
    if (cycleParam === 'yearly') {
      setBilling('yearly');
    }
  }, [cycleParam]);

  useEffect(() => {
    if (!planParam) return;
    const target = PLANS.find(p => p.id === planParam.toLowerCase());
    if (target) {
      const timer = setTimeout(() => {
        const u = db.getCurrentUser();
        if (!u) {
          setAuthModalConfig({
            title: 'Paket Seçimi İçin Giriş Yapın',
            subtitle: `${target.name} paketini firmanıza tanımlamak ve teklif vermeye başlamak için lütfen nakliyeci hesabınıza giriş yapın.`,
            targetRole: 'CARRIER'
          });
          setAuthModalOpen(true);
        } else if (u.role === 'CUSTOMER' && !u.isMasterUser) {
          setCustomerModalOpen(true);
        } else {
          setSelectedPlanForUpgrade(target);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [planParam]);

  const handleDodoCheckout = async (plan: typeof PLANS[0]) => {
    try {
      setIsRedirectingToCheckout(true);
      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: plan.id,
          billingCycle: billing,
          customer: {
            email: currentUser?.email || carrier?.email,
            name: currentUser?.fullName || carrier?.companyName || 'Nakliyeci',
            phone: currentUser?.phone || carrier?.phone,
          },
          metadata: {
            carrierId: carrier?.id || '',
            userId: currentUser?.id || '',
            planKey: plan.id,
            billingCycle: billing,
          }
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || 'Ödeme oturumu başlatılamadı. Lütfen tekrar deneyin.');
        setIsRedirectingToCheckout(false);
      }
    } catch (err: any) {
      alert(err.message || 'Ödeme servisine bağlanırken bir hata oluştu.');
      setIsRedirectingToCheckout(false);
    }
  };

  useEffect(() => {
    const syncUser = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        let c = db.getCurrentCarrier();
        if (!c) {
          c = db.getCarriers().find(item => item.userId === user.id || item.id === user.carrierProfileId) || null;
        }
        setCarrier(c);
      } else {
        setCarrier(null);
      }
    };
    syncUser();

    window.addEventListener('auth-changed', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('auth-changed', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const getCarrierNormalizedPlanId = (planId?: string): 'starter' | 'pro' | 'gold' => {
    if (!planId) return 'starter';
    if (planId === 'plan_gold' || planId === 'gold') return 'gold';
    if (planId === 'plan_pro' || planId === 'pro') return 'pro';
    return 'starter';
  };

  const isCurrentPlan = (planId: string) => {
    if (!carrier) return false;
    return getCarrierNormalizedPlanId(carrier.planId) === planId;
  };

  const getPrice = (plan: typeof PLANS[0]) =>
    billing === 'monthly' ? plan.priceMonthly : plan.yearlyMonthly;

  const handlePlanClick = (plan: typeof PLANS[0]) => {
    // 1. Giriş yapmamış kullanıcı -> Giriş / Kayıt Modalını aç
    if (!currentUser) {
      setSelectedPlanForUpgrade(null);
      setAuthModalConfig({
        title: plan.hasTrial ? '7 Gün Ücretsiz Deneme İçin Giriş Yapın' : 'Paket Seçimi İçin Giriş Yapın',
        subtitle: 'Seçtiğiniz paketi firmanıza tanımlamak ve teklif vermeye başlamak için lütfen nakliyeci hesabınıza giriş yapın.',
        targetRole: 'CARRIER'
      });
      setAuthModalOpen(true);
      return;
    }

    // 2. Müşteri rolündeyse -> Müşteri bilgilendirme modalını aç (Master kullanıcı muaftır)
    if (currentUser.role === 'CUSTOMER' && !currentUser.isMasterUser) {
      setCustomerModalOpen(true);
      return;
    }

    // 3. Nakliyeci giriş yapmışsa:
    if (isCurrentPlan(plan.id)) {
      return;
    }

    if (plan.id === 'pro' || plan.hasTrial) {
      setTrialModalOpen(true);
      return;
    }

    // Yükseltme / Deneme Başlatma modalını aç
    setSelectedPlanForUpgrade(plan);
  };

  const confirmUpgrade = async () => {
    if (!selectedPlanForUpgrade) return;
    setIsActivating(true);

    const planIdMap: Record<string, string> = {
      starter: 'plan_starter',
      pro: 'plan_pro',
      gold: 'plan_gold'
    };
    const targetDbPlanId = planIdMap[selectedPlanForUpgrade.id] || 'plan_gold';

    let activeCarrier = carrier;
    if (!activeCarrier && currentUser) {
      const newCarrierId = currentUser.carrierProfileId || `carr_${currentUser.id}`;
      activeCarrier = {
        id: newCarrierId,
        userId: currentUser.id,
        companyName: currentUser.companyName || currentUser.fullName || '',
        slug: (currentUser.companyName || currentUser.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        authorizedPersonName: currentUser.fullName || '',
        authorizedPersonSurname: '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        shortBio: '',
        city: currentUser.city || '',
        district: currentUser.district || '',
        services: ['evden-eve'],
        serviceAreas: ['TÜM_TÜRKİYE'],
        verificationStatus: 'PENDING',
        verificationBadges: { identityVerified: false, taxVerified: false, transportPermitVerified: false, elevatorVerified: false },
        planId: targetDbPlanId,
        rating: 0,
        reviewCount: 0,
        completedJobsCount: 0,
        responseRatePercent: 100,
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isSeed: false,
      };
      db.addCarrier(activeCarrier);
    } else if (activeCarrier) {
      db.updateCarrier(activeCarrier.id, { 
        planId: targetDbPlanId,
        trialStatus: 'CONVERTED',
        autoRenew: true,
      });
      db.renewCarrierSubscription(activeCarrier.id, targetDbPlanId);
    }

    if (activeCarrier) {
      updateFirestoreCarrier(activeCarrier.id, { 
        planId: targetDbPlanId,
        trialStatus: 'CONVERTED',
      }).catch(() => {});
    }

    if (currentUser && activeCarrier) {
      db.setCurrentUser({
        ...currentUser,
        carrierProfileId: activeCarrier.id,
      });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new Event('storage'));
    }

    setTimeout(() => {
      setIsActivating(false);
      const planDone = selectedPlanForUpgrade;
      setSelectedPlanForUpgrade(null);
      setUpgradeSuccessPlan(planDone);
      if (activeCarrier) {
        setCarrier({ ...activeCarrier, planId: targetDbPlanId });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-[#F95700] text-xs font-bold mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nakliyeci İşletim Sistemi Planları</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111E38] leading-tight mb-4 tracking-tight">
            Firmanız İçin En Güçlü Paketi Seçin
          </h1>
          <p className="text-slate-600 font-medium text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Müşteriye %100 ücretsiz. En avantajlı paketlerimizle hemen başlayın, sınırsız iş teklifi verin.
          </p>

          {/* Billing Toggle (Aylık / Yıllık 2 Ay Bedava) */}
          <div className="inline-flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1.5 gap-1.5 shadow-inner">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-white text-[#111E38] shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aylık Ödeme
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                billing === 'yearly'
                  ? 'bg-[#F95700] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yıllık Ödeme
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                2 Ay Bedava
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── 3 PLAN CARDS (CENTER: GOLD TOP TIER PROMINENT) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 py-8 mb-16 items-center">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border-2 transition-all flex flex-col relative ${
                plan.isFeatured
                  ? `${plan.color} lg:-translate-y-3 z-10`
                  : `${plan.color} shadow-md`
              }`}
            >
              {/* Featured Badge on Top of Center Card */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#F95700] text-white font-black text-xs uppercase tracking-wider shadow-md whitespace-nowrap z-20 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {plan.badge}
                </div>
              )}

              {/* Header Box */}
              <div className={`${plan.headerBg} p-6 sm:p-7 rounded-t-[22px] ${plan.isFeatured ? 'text-white' : 'text-[#111E38]'}`}>
                
                {/* 7 Days Free Trial Banner for Top Tier */}
                {plan.hasTrial && (
                  <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black tracking-wide shadow-sm animate-pulse whitespace-nowrap">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{plan.trialBadge}</span>
                  </div>
                )}

                <h2 className="text-2xl sm:text-3xl font-black mb-1 tracking-tight">{plan.name}</h2>
                <p className={`text-xs sm:text-sm font-medium min-h-[36px] sm:min-h-[40px] flex items-center ${plan.isFeatured ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.tagline}
                </p>

                <div className="mt-5 pt-4 border-t border-current/15">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight">{getPrice(plan).toLocaleString('tr-TR')}</span>
                    <span className={`text-sm font-bold ${plan.isFeatured ? 'text-slate-300' : 'text-slate-500'}`}>
                      TL / ay
                    </span>
                  </div>
                  {billing === 'yearly' && (
                    <p className={`text-xs font-bold mt-1 ${plan.isFeatured ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      Yıllık {plan.priceYearly.toLocaleString('tr-TR')} TL (2 ay hediye)
                    </p>
                  )}

                  {plan.hasTrial && (
                    <div className="mt-3.5 p-3 rounded-2xl bg-white/10 border border-white/20 text-center space-y-0.5 backdrop-blur-xs">
                      <div className="text-xs font-black text-emerald-300">
                        Bugün 0 ₺ · 7 gün ücretsiz deneme
                      </div>
                      <div className="text-[11px] text-slate-300 font-medium">
                        7 gün sonra ₺2.990/ay · İstediğin an iptal
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features List */}
              <div className="p-6 sm:p-7 flex-1 space-y-3.5">
                {/* Trial highlight item */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-orange-50 border border-orange-200/60 text-[#111E38] font-black text-xs">
                  <ShieldCheck className="w-4 h-4 text-[#F95700] shrink-0" />
                  <span>Anında başlar, taahhütsüz güvenli üyelik</span>
                </div>

                {COMPARISON_ROWS.filter(r => r.key !== 'trial').map(row => {
                  const val = plan.features[row.key];
                  return (
                    <div key={row.key} className="flex items-center gap-2.5">
                      {typeof val === 'boolean' ? (
                        val ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 text-emerald-600 font-black" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <X className="w-3 h-3 text-slate-300" />
                          </div>
                        )
                      ) : (
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isFeatured ? 'bg-[#F95700]/15 text-[#F95700]' : 'bg-slate-100 text-slate-700'}`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className={`text-xs sm:text-sm font-medium ${typeof val === 'boolean' && !val ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {typeof val === 'boolean' ? row.label : `${row.label}: `}
                        {typeof val !== 'boolean' && <strong className={plan.isFeatured ? 'text-[#F95700]' : 'text-[#111E38]'}>{val}</strong>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Action */}
              <div className="p-6 sm:p-7 pt-0">
                {isCurrentPlan(plan.id) ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled
                    className="w-full font-black text-sm sm:text-base bg-emerald-50 text-emerald-800 border-2 border-emerald-300 py-3.5 cursor-default"
                  >
                    ✓ Mevcut Paketiniz (Aktif)
                  </Button>
                ) : (
                  <Button
                    variant={plan.ctaVariant}
                    size="lg"
                    onClick={() => handlePlanClick(plan)}
                    className={`w-full font-black text-sm sm:text-base cursor-pointer ${plan.isFeatured ? 'shadow-xl shadow-orange-900/25 py-4' : ''}`}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    {plan.ctaText}
                  </Button>
                )}
                <p className="text-center text-[11px] text-slate-400 font-medium mt-2.5">
                  {isCurrentPlan(plan.id)
                    ? 'Aboneliğiniz şu anda bu paket üzerinden aktiftir'
                    : 'Taahhüt yok · İstediğin an iptal'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── DETAYLI KARŞILAŞTIRMA TABLOSU ───────────────────── */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38]">Tüm Plan Özelliklerini Karşılaştırın</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">İhtiyacınıza en uygun teklif ve görünürlük kapasitesini seçin</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-black text-slate-500 uppercase tracking-wider p-4 sm:p-5 w-56">Özellik / Kapsam</th>
                    {PLANS.map((plan) => (
                      <th key={plan.id} className={`text-center p-4 sm:p-5 ${plan.isFeatured ? 'bg-orange-50/70 border-x-2 border-[#F95700]/30' : ''}`}>
                        <div className="font-black text-sm text-[#111E38]">{plan.name}</div>
                        <div className={`text-lg font-black mt-0.5 ${plan.isFeatured ? 'text-[#F95700]' : 'text-slate-800'}`}>
                          {getPrice(plan).toLocaleString('tr-TR')} TL
                          <span className="text-xs font-medium text-slate-400">/ay</span>
                        </div>
                        {plan.hasTrial && (
                          <span className="inline-block mt-1 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            7 Gün Ücretsiz
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, ri) => (
                    <tr key={row.key} className={`border-b border-slate-100 last:border-0 ${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                      <td className="p-4 sm:p-5 text-xs sm:text-sm font-bold text-slate-800">{row.label}</td>
                      {PLANS.map((plan) => {
                        const val = plan.features[row.key];
                        return (
                          <td key={plan.id} className={`p-4 sm:p-5 text-center ${plan.isFeatured ? 'bg-orange-50/40 border-x-2 border-[#F95700]/30 font-bold' : ''}`}>
                            {typeof val === 'boolean' ? (
                              val ? (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 font-black">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-300">
                                  ✕
                                </span>
                              )
                            ) : (
                              <span className={`text-xs sm:text-sm font-bold ${plan.isFeatured ? 'text-[#F95700]' : 'text-slate-700'}`}>
                                {val as string}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Bottom Action Row */}
                  <tr className="border-t-2 border-slate-200 bg-white">
                    <td className="p-4 sm:p-5 font-black text-xs text-slate-400">Paket Seçimi</td>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className={`p-4 sm:p-5 text-center ${plan.isFeatured ? 'bg-orange-50/40 border-x-2 border-[#F95700]/30' : ''}`}>
                        <Button
                          variant={isCurrentPlan(plan.id) ? 'secondary' : plan.isFeatured ? 'primary' : 'outline'}
                          size="sm"
                          disabled={isCurrentPlan(plan.id)}
                          onClick={() => handlePlanClick(plan)}
                          className={`font-black text-xs ${isCurrentPlan(plan.id) ? 'cursor-default opacity-75' : 'cursor-pointer'}`}
                        >
                          {isCurrentPlan(plan.id) ? '✓ Mevcut' : `${plan.name} Seç`}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── İŞ MODELİ: MÜŞTERİYE %100 ÜCRETSİZ ──────────────── */}
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white mb-16 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F95700]/20 border border-[#F95700]/30 text-[#F95700] text-xs font-black mb-4">
            Gelir &amp; Büyüme Modeli
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Müşteriden Sıfır Komisyon — Tamamen Nakliyeci Odaklı Büyüme
          </h2>
          <p className="text-slate-300 font-medium max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
            Platformumuz aradan çekilir, müşteriye ücretsizdir. Nakliyecilerimiz sabit abonelikle sınırsız teklif verir, müşteriyle doğrudan pazarlık yapıp %100 kârla işini alır.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            {[
              { icon: '🚀', title: 'Yüksek Müşteri Trafiği', desc: 'Müşteriden hiçbir komisyon alınmadığı için platforma her gün yüzlerce gerçek taşıma talebi düşer.' },
              { icon: '📱', title: 'Doğrudan İletişim', desc: 'Telefon görme ve teklif sistemiyle müşteriyle doğrudan görüşür, fiyatınızı siz belirlersiniz.' },
              { icon: '🛠️', title: 'Komple Operasyon Paketi', desc: 'İş takvimi, boş dönüş optimizasyonu, nakliyeci defteri ve rota alarmları tek ekranda.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-black text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SSS ACCORDION ────────────────────────────────────── */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-[#111E38] mb-6 text-center">Sıkça Sorulan Sorular</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-[#111E38] text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-[#F95700] shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BOTTOM CTA ────────────────────────────────────────── */}
        <div className="text-center pb-16">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border-2 border-[#F95700]/30 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38] mb-2">
              En Üst Paket Gold ile Hemen Başlayın
            </h2>
            <p className="text-slate-600 font-medium text-sm sm:text-base max-w-xl mx-auto mb-6">
              Sınırsız teklif verme, müşteri telefonlarına doğrudan erişim ve vitrinde öne çıkma ayrıcalıklarıyla kazancınızı katlayın.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handlePlanClick(PLANS.find(p => p.id === 'gold')!)}
              className="font-black px-10 py-4 text-base shadow-xl shadow-orange-900/20 cursor-pointer"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Gold Paket ile Hemen Başlayın 🚀
            </Button>
            <p className="text-xs text-slate-400 font-medium mt-3">
              Sorularınız için: <span className="text-[#F95700] font-bold select-text">bilgi@tasinteklif.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── NAKLİYECİ PAKET YÜKSELTME / 7 GÜN ÜCRETSİZ DENEME MODALI ── */}
      {/* ── NAKLİYECİ PAKET SEÇİMİ VE GÜVENLİ ÖDEME MODALI ── */}
      <Modal
        isOpen={!!selectedPlanForUpgrade && !authModalOpen && !customerModalOpen && !trialModalOpen && !!currentUser}
        onClose={() => !isRedirectingToCheckout && setSelectedPlanForUpgrade(null)}
        title="Paket Seçimi & Güvenli Ödeme"
        maxWidth="lg"
      >
        {selectedPlanForUpgrade && (
          <div className="space-y-4 sm:space-y-5">
            {/* Firma Bilgi Şeridi */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#111E38] text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                  {(carrier?.companyName || currentUser?.companyName || 'NK').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aktif Nakliye Firması</div>
                  <div className="text-xs sm:text-sm font-black text-[#111E38] flex items-center gap-1.5 truncate">
                    <span className="truncate">{carrier?.companyName || currentUser?.companyName || 'Nakliye Firması'}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-slate-400">Mevcut Durum</div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[11px] font-bold">
                  {carrier?.planId === 'plan_gold' ? 'Gold Üye' : carrier?.planId === 'plan_pro' ? 'Pro Üye' : 'Standart'}
                </span>
              </div>
            </div>

            {/* Seçilen Paket Özeti */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-100 text-[#F95700] text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Seçilen Paket
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#111E38] mt-1 tracking-tight truncate">
                    {selectedPlanForUpgrade.name} Paketi
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedPlanForUpgrade.tagline}
                  </p>
                </div>

                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-100 shrink-0">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111E38] tracking-tight whitespace-nowrap">
                    {getPrice(selectedPlanForUpgrade).toLocaleString('tr-TR')} TL
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-bold">
                    {billing === 'yearly' ? 'Yıllık Peşin (Özel İndirimli)' : 'Aylık Üyelik'}
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-orange-100/80 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Taahhütsüz üyelik — Dilediğiniz zaman tek tıkla iptal edebilirsiniz.</span>
              </div>
            </div>

            {/* Kazanılacak Haklar Listesi */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paket Kapsamındaki Ayrıcalıklar:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {selectedPlanForUpgrade.features.monthlyOfferLimit}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {selectedPlanForUpgrade.features.customerPhoneAccess ? 'Müşteri Telefon Numarası Görme' : 'Telefon Numarası Gizli'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {selectedPlanForUpgrade.features.routeAlarmLimit}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {selectedPlanForUpgrade.features.featuredHomepage ? 'Ana Sayfa & Defterde Öne Çıkma' : 'Standart Sıralama'}
                  </span>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <button
                type="button"
                onClick={() => handleDodoCheckout(selectedPlanForUpgrade)}
                disabled={isRedirectingToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 text-center"
              >
                {isRedirectingToCheckout ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Ödeme Sayfasına Yönlendiriliyor...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 shrink-0" />
                    <span>Güvenli Öde ({getPrice(selectedPlanForUpgrade).toLocaleString('tr-TR')} TL)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isRedirectingToCheckout}
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="w-full py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center block"
              >
                Vazgeç ve Kapat
              </button>

              {/* Güven Rozeti */}
              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>256-bit SSL ve 3D Secure Lisanslı Güvenli Ödeme Altyapısı</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── TEBRİKLER / BAŞARI MODALI ── */}
      <Modal
        isOpen={!!upgradeSuccessPlan}
        onClose={() => setUpgradeSuccessPlan(null)}
        maxWidth="md"
      >
        {upgradeSuccessPlan && (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                Abonelik Başlatıldı
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">
                Tebrikler! {upgradeSuccessPlan.name} Aktif Edildi 🎉
              </h2>
              <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
                <strong className="text-[#111E38]">{carrier?.companyName || currentUser?.companyName || 'Firmanız'}</strong> için 
                {upgradeSuccessPlan.hasTrial ? ' 7 günlük ücretsiz deneme başladı.' : ' üyeliğiniz tanımlandı.'} Artık tüm ilanlara sınırsız teklif verebilir ve müşteri telefonlarını doğrudan görebilirsiniz.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 text-left space-y-1.5 font-bold">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Günlük 3 teklif kotası kaldırıldı (Sınırsız Teklif)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Müşteri cep telefonları görünür hale getirildi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Defter &amp; Ana Sayfada öne çıkan firma rozeti eklendi</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link href="/app/carrier/isler" className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full font-black text-sm sm:text-base py-3.5 shadow-lg shadow-orange-900/20 cursor-pointer"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Hemen İş Havuzuna Git (Teklif Ver)
                </Button>
              </Link>
              <Link href="/app/carrier" className="block w-full">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Operasyon Merkezi&apos;ne Dön
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MÜŞTERİ HESABI İÇİN BİLGİLENDİRME MODALI ── */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Paketler Nakliyat Firmalarına Özeldir"
        maxWidth="md"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-[#146EF5] flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#111E38]">
              Platformumuz Müşteriler İçin %100 Ücretsizdir!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
              Ev veya ofis taşıtmak isteyen müşterilerimizden hiçbir abonelik, teklif alma veya komisyon ücreti alınmaz. Bu sayfadaki paketler, taşıma işi alan nakliye firmalarına aittir.
            </p>
          </div>
          <div className="space-y-2 pt-1">
            <Link href="/teklif-al" className="block w-full">
              <Button variant="primary" size="md" className="w-full font-black text-xs sm:text-sm py-2.5 sm:py-3">
                Ücretsiz Taşınma Talebi Oluştur →
              </Button>
            </Link>
            <Link href="/kayit?role=nakliyeci" rel="nofollow" className="block w-full">
              <Button variant="outline" size="md" className="w-full font-bold text-xs text-slate-700 py-2">
                Nakliye Firması Hesabı Aç
              </Button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* ── GİRİŞ YAPILMAMIŞSA GİRİŞ / KAYIT MODALI ── */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setSelectedPlanForUpgrade(null);
        }}
        targetRole={authModalConfig.targetRole}
        title={authModalConfig.title}
        subtitle={authModalConfig.subtitle}
        onSuccess={() => {
          setAuthModalOpen(false);
          const user = db.getCurrentUser();
          setCurrentUser(user);
          let c = db.getCurrentCarrier();
          if (!c && user) {
            c = db.getCarriers().find(item => item.userId === user.id || item.id === user.carrierProfileId) || null;
          }
          setCarrier(c);
          if (planParam) {
            const target = PLANS.find(p => p.id === planParam.toLowerCase());
            if (target) {
              setSelectedPlanForUpgrade(target);
            }
          }
        }}
      />

      {/* 7-Day Trial Card Modal (Görsel 2) */}
      <TrialCardModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        onSuccess={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
            window.dispatchEvent(new Event('storage'));
          }
        }}
      />
    </div>
  );
}

export default function PaketlerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <PaketlerContent />
    </Suspense>
  );
}
