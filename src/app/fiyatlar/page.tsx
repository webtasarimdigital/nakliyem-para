'use client';

import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function FiyatlarPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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
      desc: 'Platformu denemek ve bölgedeki iş hacmini görmek isteyen yeni firmalar için ideal başlangıç.',
      monthlyPrice: 1250,
      yearlyMonthlyPrice: 1042,
      yearlyTotal: 12500,
      isFeatured: false,
      badge: null,
      trialBadge: null,
      ctaText: 'Başlangıç Paketini Seç',
      ctaUrl: '/paketler?plan=starter',
      features: [
        'Aylık 25 teklif verme hakkı',
        'Nakliyeci Defteri (10 paylaşım / ay)',
        '2 adet akıllı rota alarmı',
        'Temel firma profil sayfası',
        'E-posta destek hattı',
      ],
    },
    {
      id: 'gold',
      name: 'Gold',
      nametag: 'En Avantajlı',
      desc: 'Maksimum güç, sınırsız iş teklifi, doğrudan müşteri telefonu ve tam vitrin görünürlüğü.',
      monthlyPrice: 4850,
      yearlyMonthlyPrice: 4042,
      yearlyTotal: 48500,
      isFeatured: true,
      badge: '⭐ EN ÇOK TERCİH EDİLEN',
      trialBadge: '7 GÜN ÜCRETSİZ DENEME (0 ₺)',
      ctaText: '7 Gün Ücretsiz Başla (0 ₺)',
      ctaUrl: '/paketler?plan=gold',
      features: [
        'Sınırsız teklif verme hakkı',
        'Müşteri doğrudan telefon ve WhatsApp erişimi',
        'Sınırsız Nakliyeci Defteri ilanı & dönüş yükü',
        'Sınırsız akıllı rota alarmı (Anlık bildirim)',
        'Ana sayfa ve şehir sayfalarında 1. sıra vitrin',
        '⭐ Onaylı Altın Nakliyeci Rozeti',
        'Gelişmiş iş & kazanç analitikleri',
        'Dijital hizmetlerde (SEO & Reklam) %25 indirim',
        '7/24 VIP Özel Müşteri Temsilcisi',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      nametag: 'Aktif Nakliyeciler',
      desc: 'Düzenli taşıma işi alan ve dönüş rotalarını dolduran profesyonel nakliyeciler için.',
      monthlyPrice: 2450,
      yearlyMonthlyPrice: 2042,
      yearlyTotal: 24500,
      isFeatured: false,
      badge: null,
      trialBadge: null,
      ctaText: 'Pro Paketini Seç',
      ctaUrl: '/paketler?plan=pro',
      features: [
        'Aylık 100 teklif verme hakkı',
        'Müşteri telefon numarasına doğrudan erişim',
        'Ayda 40 Nakliyeci Defteri paylaşımı',
        '8 adet akıllı rota alarmı',
        'Doğrulanmış firma rozeti',
        'Haftalık iş performans analitiği',
        'Dijital hizmetlerde %10 indirim',
        'Öncelikli destek hattı',
      ],
    },
  ];

  // Comprehensive Comparison Matrix
  const COMPARISON_ROWS = [
    { label: 'Aylık Teklif Verme Limiti', starter: '25 Teklif', gold: 'Sınırsız Teklif', pro: '100 Teklif', highlightGold: true },
    { label: 'Müşteri Telefon & WhatsApp Erişimi', starter: '—', gold: 'Sınırsız Doğrudan İletişim', pro: '100 Müşteri / Ay', highlightGold: true },
    { label: 'Nakliyeci Defteri İlan Limiti', starter: '10 İlan / Ay', gold: 'Sınırsız Paylaşım', pro: '40 İlan / Ay', highlightGold: true },
    { label: 'Akıllı Rota Alarmları (SMS & Bildirim)', starter: '2 Alarm', gold: 'Sınırsız Şehir Alarmı', pro: '8 Alarm', highlightGold: true },
    { label: 'Ana Sayfa Vitrininde Öne Çıkma', starter: '—', gold: '1. Sıra Sponsorlu Vitrin', pro: '—', highlightGold: true },
    { label: 'Şehir Sayfalarında Üst Sıralar', starter: '—', gold: 'Öncelikli Üst Sıra', pro: 'Standart Listeleme', highlightGold: true },
    { label: 'Doğrulanmış Firma Rozeti', starter: 'Temel Profil', gold: '⭐ Altın Onay Rozeti', pro: 'Doğrulanmış Rozet', highlightGold: true },
    { label: 'Pazar Yeri & Asansör İlanı', starter: '3 İlan / Ay', gold: 'Sınırsız İlan', pro: '15 İlan / Ay', highlightGold: true },
    { label: 'Boş Dönüş Yük Eşleştirmesi', starter: 'Standart', gold: 'Anlık VIP Bildirim', pro: 'Öncelikli Eşleşme', highlightGold: true },
    { label: 'Dijital Hizmetler İndirimi (Google & Harita SEO)', starter: '—', gold: '%25 İndirim', pro: '%10 İndirim', highlightGold: true },
    { label: 'Destek Düzeyi', starter: 'E-posta Destek', gold: '7/24 Özel VIP Temsilci', pro: 'Öncelikli Destek', highlightGold: true },
  ];

  // FAQ Items
  const FAQS = [
    {
      q: 'Gold paketteki 7 günlük ücretsiz deneme nasıl çalışır?',
      a: 'Gold paketi seçtiğinizde ilk 7 gün boyunca hiçbir ücret ödemeden sınırsız teklif, doğrudan müşteri telefonu ve vitrin ayrıcalıklarını anında kullanmaya başlarsınız. 7 gün dolmadan dilediğiniz zaman tek tıkla iptal edebilirsiniz.',
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
      {/* ── 1. HERO HEADER ── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 pt-10 pb-16 sm:pb-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#F95700] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Fiyatlandırma &amp; Üyelik Planları
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-[1.12]">
              Nakliyat Yazılımı Fiyatları <br />
              <span className="text-[#F95700]">ve Paket Ücretleri</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl">
              Nakliyat profesyonelleri ve taşıyıcı firmalar için şeffaf, esnek ve avantajlı planlar. 
              İhtiyacınıza uygun planı seçin, komisyonsuz iş alın ve kazancınızı katlayın.
            </p>

            {/* Trust Checks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>Taahhüt yok, istediğin an iptal et</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>%0 Komisyon — Kazanç tamamen sizin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>7 gün Gold deneme 0 ₺ · Peşinatsız</span>
              </div>
            </div>
          </div>

          {/* Billing Switcher (Aylık vs Yıllık) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#111E38] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-[#111E38] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Yıllık Ödeme</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                  %20 Avantaj
                </span>
              </button>
            </div>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              ⭐ Yıllık peşin ödemede 2 ay kullanım hediye edilir.
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. LANSMAN BANNERI ── */}
      <div className="bg-gradient-to-r from-[#111E38] via-[#1B2A4A] to-[#111E38] text-white py-3.5 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 flex-wrap text-xs font-bold">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
              Lansman Fiyatı
            </span>
            <span>Bu avantajlı fiyatlar 2026 yılı platform lansman dönemine özeldir.</span>
          </div>
          <span className="text-slate-400 text-[11px] hidden md:inline">
            Fiyat artışlarından etkilenmemek için planınızı bugün sabitleyin.
          </span>
        </div>
      </div>

      {/* ── 3. ANA PLAN KARTLARI (3 SÜTUN GRID) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {PLANS.map(plan => {
            const price = billingCycle === 'yearly' ? plan.yearlyMonthlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all bg-white relative ${
                  plan.isFeatured
                    ? 'border-2 border-[#F95700] ring-4 ring-[#F95700]/15 shadow-2xl lg:-translate-y-2'
                    : 'border border-slate-200/90 shadow-md hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {plan.nametag}
                    </span>
                    {plan.trialBadge && (
                      <span className="text-[10px] font-black text-white bg-emerald-500 px-3 py-1 rounded-full uppercase tracking-wider">
                        {plan.trialBadge}
                      </span>
                    )}
                    {plan.badge && !plan.trialBadge && (
                      <span className="text-[10px] font-black text-white bg-[#F95700] px-3 py-1 rounded-full uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#111E38] mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    {plan.desc}
                  </p>

                  {/* Price Block */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-[#111E38]">
                        ₺{price.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-xs font-bold text-slate-400">/ ay</span>
                    </div>
                    {billingCycle === 'yearly' ? (
                      <div className="text-[11px] font-bold text-emerald-600">
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
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={plan.ctaUrl} className="w-full block">
                  <button
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      plan.isFeatured
                        ? 'bg-[#F95700] hover:bg-[#E04D00] text-white shadow-xl shadow-orange-500/30'
                        : 'bg-[#111E38] hover:bg-[#1A2E56] text-white shadow-md'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
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
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">Size Özel</span>
                <span className="text-xs text-slate-400 font-semibold">/ aylık veya yıllık teklif</span>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Çoklu Şoför Paneli
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Sınırsız İlan &amp; Teklif
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Toplu Defter Yönetimi
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Özel Sponsorlu Vitrin
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 7/24 Özel Temsilci
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Kurumsal Fatura &amp; KDV
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
                  <th className="py-4 px-4 text-center bg-orange-50/60 text-[#F95700]">Gold (Popüler)</th>
                  <th className="py-4 px-4 sm:px-6 text-center rounded-r-2xl">Pro</th>
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
                    <td className="py-3.5 px-4 text-center bg-orange-50/30 text-[#F95700] font-black">
                      {row.gold}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-center text-slate-600">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. İSTATİSTİK ŞERİDİ (GÜVEN KANITI) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#111E38]">1.850+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Nakliyeci</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#F95700]">45.000+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verilen İş Teklifi</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#111E38]">81 İl</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aktif Kapsama Ağı</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">%98</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firma Memnuniyeti</div>
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
              Gold paketi 7 gün boyunca tamamen 0 ₺&apos;ye deneyin. Sınırsız iş teklifi verin, 
              müşterilerle doğrudan görüşün ve kamyonunuzu hiç boş bırakmayın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/kayit?role=nakliyeci"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>7 Gün Ücretsiz Başla</span>
              </Link>
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
    </div>
  );
}
