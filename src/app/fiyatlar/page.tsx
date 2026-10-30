'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  PhoneCall, 
  Zap, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  Building2, 
  FileText, 
  Bell, 
  Share2, 
  Clock, 
  Star,
  Users,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Modal } from '@/components/ui/Modal';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { TrialCardModal } from '@/components/subscription/TrialCardModal';
import { db } from '@/lib/data/mock-db';
import { User, CarrierProfile } from '@/types';

export default function FiyatlarPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [liveStats, setLiveStats] = useState(() => db.getPlatformLiveStats());

  // Auth & Carrier State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [carrier, setCarrier] = useState<CarrierProfile | null>(null);

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    title: string;
    subtitle: string;
    targetRole: 'CUSTOMER' | 'CARRIER';
  }>({
    title: 'Paket Seçimi İçin Giriş Yapın',
    subtitle: 'Seçtiğiniz paketi firmanıza tanımlamak için lütfen nakliyeci hesabınıza giriş yapın.',
    targetRole: 'CARRIER'
  });
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<any | null>(null);
  const [isRedirectingToCheckout, setIsRedirectingToCheckout] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      setLiveStats(db.getPlatformLiveStats());
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

  const handlePlanClick = (plan: typeof PLANS[0]) => {
    const user = currentUser || db.getCurrentUser();
    if (!user) {
      setAuthModalConfig({
        title: 'Paket Seçimi İçin Giriş Yapın',
        subtitle: `${plan.name} paketini firmanıza tanımlamak ve teklif vermeye başlamak için lütfen nakliyeci hesabınıza giriş yapın.`,
        targetRole: 'CARRIER'
      });
      setSelectedPlanForUpgrade(plan);
      setAuthModalOpen(true);
      return;
    }

    if (user.role === 'CUSTOMER' && !user.isMasterUser) {
      setCustomerModalOpen(true);
      return;
    }

    if (plan.id === 'pro' || (plan as any).trialBadge) {
      setTrialModalOpen(true);
      return;
    }

    setSelectedPlanForUpgrade(plan);
  };

  const handleDodoCheckout = async (plan: any) => {
    try {
      setIsRedirectingToCheckout(true);
      const user = currentUser || db.getCurrentUser();
      let c = carrier;
      if (!c && user) {
        c = db.getCurrentCarrier() || db.getCarriers().find(item => item.userId === user.id || item.id === user.carrierProfileId) || null;
      }

      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planKey: plan.id,
          billingCycle,
          customer: {
            email: user?.email || c?.email,
            name: user?.fullName || c?.companyName || 'Nakliyeci',
            phone: user?.phone || c?.phone,
          },
          metadata: {
            carrierId: c?.id || '',
            userId: user?.id || '',
            planKey: plan.id,
            billingCycle,
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const breadcrumbItems = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Fiyatlandırma', url: '/fiyatlar' },
  ];

  // 3 Core Subscription Plans
  const PLANS = [
    {
      id: 'starter',
      name: 'Başlangıç',
      nametag: 'Yeni Başlayanlar',
      desc: 'Platformu denemek ve bölgesel işleri görmek isteyen yeni firmalar için ideal başlangıç.',
      monthlyPrice: 1199,
      yearlyMonthlyPrice: 999,
      yearlyTotal: 11990,
      isFeatured: false,
      badge: 'YENİ BAŞLAYAN',
      trialBadge: null,
      ctaText: 'Başlangıç Paketini Seç',
      ctaUrl: '/paketler?plan=starter',
      features: [
        'Aylık 15 teklif verme hakkı',
        'Nakliyeci Defteri (5 paylaşım / ay)',
        '5 adet müşteri telefonu görme',
        '2 adet akıllı rota alarmı',
        'Temel firma profil sayfası',
        'E-posta destek hattı',
      ],
    },
    {
      id: 'pro',
      name: 'Profesyonel',
      nametag: 'En Avantajlı',
      desc: 'Müşteri telefonlarına doğrudan ulaşıp düzenli iş almak isteyen nakliyeciler için.',
      monthlyPrice: 2990,
      yearlyMonthlyPrice: 2491,
      yearlyTotal: 29900,
      isFeatured: true,
      badge: 'En Popüler',
      trialBadge: '⭐ 7 GÜN ÜCRETSİZ DENEME (0 ₺)',
      ctaText: '7 Gün Ücretsiz Denemeyi Başlat',
      ctaUrl: '/paketler?plan=pro',
      features: [
        '⭐ 7 Gün Ücretsiz Deneme (0 ₺ Provizyon)',
        'Aylık 50 teklif verme hakkı',
        '35 Müşteri telefon numarasına doğrudan erişim',
        'Ayda 20 Nakliyeci Defteri paylaşımı & boş araç',
        '5 adet akıllı rota alarmı',
        'Doğrulanmış Pro firma rozeti',
        'Haftalık iş performans analitiği',
        'Dijital hizmetlerde %15 indirim',
        'Öncelikli destek hattı',
      ],
    },
    {
      id: 'gold',
      name: 'Filo / Kurumsal',
      nametag: 'Ekipler & Filolar',
      desc: 'Maksimum güç, sınırsız doğrudan müşteri telefonu ve tam vitrin görünürlüğü.',
      monthlyPrice: 5990,
      yearlyMonthlyPrice: 4991,
      yearlyTotal: 59900,
      isFeatured: false,
      badge: 'Kurumsal Filo',
      trialBadge: null,
      ctaText: 'Filo Paketini Seç',
      ctaUrl: '/paketler?plan=gold',
      features: [
        'Sınırsız teklif verme hakkı',
        'Sınırsız müşteri doğrudan telefon ve WhatsApp erişimi',
        'Sınırsız Nakliyeci Defteri ilanı & dönüş yükü',
        'Sınırsız akıllı rota alarmı (Anlık bildirim)',
        'Ana sayfa ve şehir sayfalarında 1. sıra vitrin',
        '⭐ Defter sayfasında sağ sponsor banner vitrini (Logolu Reklam)',
        '⭐ Onaylı Altın Nakliyeci Rozeti',
        'Gelişmiş iş & kazanç analitikleri',
        'Dijital hizmetlerde (SEO & Reklam) %25 indirim',
        '7/24 VIP Özel Müşteri Temsilcisi',
      ],
    },
  ];

  // Comprehensive Comparison Matrix (Matches top cards & database 100%)
  const COMPARISON_ROWS = [
    { label: '7 Gün Ücretsiz Deneme (0 ₺)', starter: '—', pro: '✓ 7 Gün Ücretsiz (0 ₺)', gold: '—' },
    { label: 'Aylık Teklif Verme Limiti', starter: '15 Teklif / Ay', pro: '50 Teklif / Ay', gold: 'Sınırsız Teklif' },
    { label: 'Müşteri Telefon & WhatsApp Erişimi', starter: '5 Müşteri / Ay', pro: '35 Müşteri / Ay', gold: 'Sınırsız Doğrudan İletişim' },
    { label: 'Nakliyeci Defteri İlan Limiti', starter: '5 İlan / Ay', pro: '20 İlan / Ay', gold: 'Sınırsız Paylaşım' },
    { label: 'Akıllı Rota Alarmları (SMS & Bildirim)', starter: '2 Alarm', pro: '5 Alarm', gold: 'Sınırsız Şehir Alarmı' },
    { label: 'Ana Sayfa Vitrininde Öne Çıkma', starter: '—', pro: '—', gold: '1. Sıra Sponsorlu Vitrin' },
    { label: 'Defter Sağ Banner Reklam Vitrini', starter: '—', pro: '—', gold: 'Logolu Sponsor Bannerı' },
    { label: 'Şehir Sayfalarında Üst Sıralar', starter: '—', pro: 'Öncelikli Listeleme', gold: '1. Sıra Vitrin' },
    { label: 'Doğrulanmış Firma Rozeti', starter: 'Temel Profil', pro: 'Doğrulanmış Pro Rozeti', gold: '⭐ Altın Onay Rozeti' },
    { label: 'Pazar Yeri & Asansör İlanı', starter: '2 İlan / Ay', pro: '10 İlan / Ay', gold: 'Sınırsız İlan' },
    { label: 'Boş Dönüş Yük Eşleştirmesi', starter: 'Standart', pro: 'Öncelikli Eşleşme', gold: 'Anlık VIP Bildirim' },
    { label: 'Dijital Hizmetler İndirimi (Google & Harita SEO)', starter: '—', pro: '%15 İndirim', gold: '%25 İndirim' },
    { label: 'Destek Düzeyi', starter: 'E-posta Destek', pro: 'Öncelikli Destek', gold: '7/24 Özel VIP Temsilci' },
  ];

  // FAQ Items
  const FAQS = [
    {
      q: 'Profesyonel paketteki 7 günlük ücretsiz deneme nasıl çalışır?',
      a: 'Profesyonel paketi seçtiğinizde ilk 7 gün boyunca hiçbir ücret ödemeden aylık 50 teklif hakkı, doğrudan müşteri telefonu ve vitrin avantajlarını anında kullanmaya başlarsınız. 7 gün dolmadan dilediğiniz zaman tek tıkla iptal edebilirsiniz.',
    },
    {
      q: 'Yıllık ödeme avantajı nasıl çalışır?',
      a: 'Yıllık peşin ödemede 12 ay yerine yalnızca 10 ay ücreti ödersiniz. Tam 2 ay platform kullanımınız hediye edilir ve %20 net tasarruf sağlarsınız.',
    },
    {
      q: 'Teklif hakkım biterse ne olur?',
      a: 'Aylık teklif kotanız dolduğunda panelinizden dilediğiniz zaman üst pakete geçebilir veya ek teklif paketleri satın alarak iş almaya kesintisiz devam edebilirsiniz.',
    },
    {
      q: 'Aldığım taşıma işlerinden komisyon kesilir mi?',
      a: 'Kesinlikle hayır! TaşınTeklif\'te iş bedelinden hiçbir yüzde veya komisyon kesilmez. Kazancınızın %100\'ü doğrudan sizde kalır.',
    },
    {
      q: 'Aboneliğimi istediğim zaman iptal edebilir miyim?',
      a: 'Evet. Hiçbir taahhüt veya cayma bedeli yoktur. Dilediğiniz an iptal edebilirsiniz; ödemiş olduğunuz dönemin sonuna kadar tüm özellikleriniz aktif kalır.',
    },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* ── HEADER & GİRİŞ BİLGİ ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="mb-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F95700] uppercase tracking-wider mb-1.5">
                <Truck className="w-4 h-4" />
                <span>Nakliyeci Abonelik Paketleri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">
                Fiyatlar &amp; Tarifeler
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl leading-relaxed">
                %0 komisyonla doğrudan müşteri bulun, dönüş yüklerinizi Nakliyeci Defteri ile doldurun. En avantajlı paketlerle firmanızı öne çıkarın.
              </p>
            </div>

            {/* Fatura Dönemi Değiştirici (Aylık vs Yıllık) */}
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex items-center gap-1.5 shrink-0 shadow-inner self-start md:self-end">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#111E38] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-[#F95700] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yıllık Ödeme</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-[#F95700]'
                    : 'bg-orange-50 text-[#F95700] border border-orange-200'
                }`}>
                  %20 İndirim
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── ANA PLAN KARTLARI (3 SÜTUN GRID) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map(plan => {
            const price = billingCycle === 'yearly' ? plan.yearlyMonthlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all bg-white relative ${
                  plan.isFeatured
                    ? 'border-2 border-[#F95700] ring-4 ring-[#F95700]/15 shadow-2xl lg:-translate-y-2'
                    : 'border border-slate-200/90 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Crown Ribbon on Top of Featured Card (Never breaks or wraps) */}
                {plan.isFeatured && plan.trialBadge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 sm:px-4 py-1 rounded-full bg-gradient-to-r from-[#F95700] to-[#FF7020] text-white font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap z-20 flex items-center gap-1.5 border border-white/20">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{plan.trialBadge}</span>
                  </div>
                )}

                <div>
                  {/* Top Badges (Zero-wrap, guaranteed single-line per badge) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                      {plan.nametag}
                    </span>
                    {plan.isFeatured ? (
                      <span className="text-[11px] font-black text-[#F95700] bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0 shadow-2xs">
                        ⭐ {plan.badge}
                      </span>
                    ) : plan.badge ? (
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#111E38] mb-2 min-h-[36px] flex items-center">
                    {plan.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 min-h-[44px] sm:min-h-[48px] flex items-center">
                    {plan.desc}
                  </p>

                  {/* Price Block (Always vertically aligned across all 3 cards) */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-1 min-h-[96px] flex flex-col justify-center">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#111E38]">
                        ₺{price.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-xs font-bold text-slate-400">/ ay</span>
                    </div>
                    {billingCycle === 'yearly' ? (
                      <div className="text-[11px] font-bold text-[#F95700]">
                        Yıllık ₺{plan.yearlyTotal.toLocaleString('tr-TR')} peşin (2 ay hediye)
                      </div>
                    ) : (
                      <div className="text-[11px] font-medium text-slate-400">
                        Aylık periyotla faturalandırılır
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="text-[11px] font-bold text-slate-500 mb-6 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F95700]" />
                    <span>Taahhüt yok · İstediğin an tek tıkla iptal et</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Paket Kapsamı
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-semibold leading-snug">
                          <Check className="w-4 h-4 text-[#F95700] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.isFeatured
                      ? 'bg-[#F95700] hover:bg-[#E04D00] text-white shadow-xl shadow-orange-500/30'
                      : 'bg-[#111E38] hover:bg-[#1A2E56] text-white shadow-md'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. KURUMSAL FİLO & BİRLİKLER ÖZEL ÇÖZÜMÜ (EMLIVO .pz-agency BENZERİ) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-br from-[#111E38] via-[#1B2A4A] to-[#111E38] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F95700]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F95700]/20 text-orange-300 text-xs font-black uppercase tracking-wider border border-[#F95700]/30">
                Özel Kurumsal Plan
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Büyük Filolar, Lojistik Birlikleri ve Kooperatifler İçin
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-medium">
                10&apos;dan fazla nakliye aracı olan filolar, bölgesel nakliyat odaları, çoklu şoför hesapları 
                ve toplu ilan aktarımı — filonuza göre özel olarak fiyatlandırılır.
              </p>
              <div className="pt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#F95700]">Size Özel</span>
                <span className="text-xs text-slate-400 font-semibold">/ aylık veya yıllık teklif</span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> Çoklu Şoför Paneli
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> Sınırsız İlan &amp; Teklif
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> Toplu Defter Yönetimi
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> Özel Sponsorlu Vitrin
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> 7/24 Özel Temsilci
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#F95700]">✓</span> Kurumsal Fatura &amp; KDV
                </div>
              </div>

              <Link href="/iletisim" className="block w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-[#111E38] font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                  <span>Özel Teklif Al</span>
                  <ArrowRight className="w-4 h-4 text-[#F95700]" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. TÜM ÖZELLİKLERİ KARŞILAŞTIRIN TABLOSU ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38]">
              Tüm Paket Özelliklerini Karşılaştırın
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Her paketin sunduğu teklif hakları, erişim sınırları ve vitrin ayrıcalıklarını inceleyin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-black uppercase tracking-wider text-slate-600">
                  <th className="py-4 px-4 sm:px-6 rounded-l-2xl">Özellik</th>
                  <th className="py-4 px-4 text-center">Başlangıç</th>
                  <th className="py-4 px-4 text-center bg-orange-50/60 text-[#F95700] border-x-2 border-[#F95700]/30">Profesyonel (Popüler)</th>
                  <th className="py-4 px-4 sm:px-6 text-center rounded-r-2xl">Filo / Kurumsal (Gold)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 text-slate-800 font-bold">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600">
                      {row.starter}
                    </td>
                    <td className="py-3.5 px-4 text-center bg-orange-50/30 text-[#F95700] font-black border-x-2 border-[#F95700]/20">
                      {row.pro}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center text-slate-700 font-bold">
                      {row.gold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. İSTATİSTİK ŞERİDİ (GÜVEN KANITI - CANLI VERİTABANI) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#111E38]">{liveStats.approvedCarriersCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doğrulanmış Nakliyeci</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#F95700]">{liveStats.totalRequestsCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam Taşıma Talebi</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#111E38]">81 İl</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Kapsama Ağı</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#F95700]">{liveStats.averageRating} / 5</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Müşteri Puanı ({liveStats.totalReviewsCount} Değerlendirme)</div>
          </div>
        </div>
      </section>

      {/* ── 7. SIKÇA SORULAN SORULAR AKORDEONU ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#F95700] uppercase tracking-wider">
              Aklınıza Takılanlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38]">
              Nakliyeci Abonelikleri Hakkında Sıkça Sorulan Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Paket yükseltme, deneme süresi ve ödeme ayrıntılarıyla ilgili merak edilenler.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/90 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left font-extrabold text-sm text-[#111E38] hover:text-[#F95700] flex items-center justify-between gap-4 transition-colors cursor-pointer bg-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#F95700]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. MÜŞTERİLER İÇİN BİLGİLENDİRME ŞERİDİ ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-orange-50/60 border border-orange-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#F95700] text-white flex items-center justify-center font-black shrink-0">
              ℹ
            </span>
            <div className="text-slate-700">
              <strong className="text-[#111E38]">Taşınmak isteyen bir müşteri misiniz?</strong>{' '}
              Müşteriler için talep açmak ve teklif almak <strong>%100 ücretsizdir</strong>. Komisyon ödemeden en iyi nakliyecilerden teklif alabilirsiniz.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/teklif-al"
              className="px-4 py-2 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-extrabold text-xs transition-all shadow-xs"
            >
              Ücretsiz Teklif Al
            </Link>
            <Link
              href="/nakliyat-rehberi"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#111E38] font-bold text-xs transition-all"
            >
              Taşınma Rehberi
            </Link>
          </div>
        </div>
      </section>

      {/* ── 9. ALT DÖNÜŞÜM BANNERI (CTA) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-gradient-to-r from-[#111E38] to-[#1A2E56] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F95700]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-orange-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              Hemen Başlayın
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              TaşınTeklif ile Nakliye İşinizi Şimdi Büyütün
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              TaşınTeklif ile sınırsız iş teklifi verin, müşterilerle doğrudan görüşün ve kamyonunuzu hiç boş bırakmayın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handlePlanClick(PLANS[1])}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Hemen Paketinizi Seçin</span>
              </button>
              <Link
                href="/nakliyeci-defteri"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Nakliyeci Defteri&apos;ni İncele</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SATIN ALMA / GÜVENLİ ÖDEME MODALI ── */}
      <Modal
        isOpen={!!selectedPlanForUpgrade && !authModalOpen && !customerModalOpen}
        onClose={() => !isRedirectingToCheckout && setSelectedPlanForUpgrade(null)}
        title="Paket Seçimi & Güvenli Ödeme"
        maxWidth="lg"
      >
        {selectedPlanForUpgrade && (
          <div className="space-y-4 sm:space-y-6">
            {/* Paket ve Fiyat Özeti Kutusu */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-orange-50/70 to-amber-50/40 border border-orange-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#F95700] bg-orange-100/70 px-2.5 py-0.5 rounded-full">
                      Seçilen Paket
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {billingCycle === 'yearly' ? 'Yıllık Abonelik (2 Ay Hediye)' : 'Aylık Yenilenen'}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111E38] mt-1.5">
                    {selectedPlanForUpgrade.name} Paketi
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedPlanForUpgrade.desc}
                  </p>
                </div>

                <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-orange-100">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#111E38] tracking-tight whitespace-nowrap">
                    {(billingCycle === 'yearly' ? selectedPlanForUpgrade.yearlyTotal : selectedPlanForUpgrade.monthlyPrice).toLocaleString('tr-TR')} TL
                  </div>
                  <div className="text-xs text-slate-400 font-bold">
                    {billingCycle === 'yearly' ? 'Yıllık Peşin (Özel İndirimli)' : 'Aylık Üyelik'}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-orange-100/80 flex items-center gap-2 text-xs text-slate-600 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Taahhütsüz üyelik — Dilediğiniz zaman tek tıkla iptal edebilirsiniz.</span>
              </div>
            </div>

            {/* Kazanılacak Haklar Listesi */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paket Kapsamındaki Ayrıcalıklar:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedPlanForUpgrade.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-800">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5 sm:space-y-3">
              <button
                type="button"
                onClick={() => handleDodoCheckout(selectedPlanForUpgrade)}
                disabled={isRedirectingToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm sm:text-base min-h-[46px] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all cursor-pointer disabled:opacity-60"
              >
                {isRedirectingToCheckout ? (
                  <>
                    <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ödeme Sayfasına Yönlendiriliyor...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Güvenli Öde ({(billingCycle === 'yearly' ? selectedPlanForUpgrade.yearlyTotal : selectedPlanForUpgrade.monthlyPrice).toLocaleString('tr-TR')} TL)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isRedirectingToCheckout}
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-center block"
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

      {/* ── MÜŞTERİ BİLGİLENDİRME MODALI ── */}
      <Modal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        title="Müşteri Hesabı ile Giriş Yapıldı"
        maxWidth="md"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#111E38]">
              Nakliyeci Abonelik Paketleri
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Bu paketler taşımacılık hizmeti sunan profesyonel nakliyat firmaları içindir. Ev veya ofis taşıtmak isteyen müşterilerimiz için sistemimiz <strong>%100 ücretsizdir</strong>.
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCustomerModalOpen(false)}
              className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Kapat
            </button>
            <Link href="/teklif-al" className="w-full sm:flex-1">
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-xs shadow-sm transition-colors"
              >
                Ücretsiz Teklif Al
              </button>
            </Link>
          </div>
        </div>
      </Modal>

      {/* ── GİRİŞ / KAYIT MODALI ── */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
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
          const user = db.getCurrentUser();
          setCurrentUser(user);
          let c = db.getCurrentCarrier();
          if (!c && user) {
            c = db.getCarriers().find(item => item.userId === user.id || item.id === user.carrierProfileId) || null;
          }
          setCarrier(c);
        }}
      />
    </div>
  );
}
