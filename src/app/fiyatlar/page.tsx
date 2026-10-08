'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calculator, 
  Truck, 
  ShieldCheck, 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Package, 
  Layers, 
  Warehouse, 
  PhoneCall, 
  Clock, 
  Award,
  Zap,
  MapPin,
  Calendar
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { INTERCITY_ROUTES } from '@/lib/data/routes-data';

export default function FiyatlarPage() {
  const [activeTab, setActiveTab] = useState<'customer' | 'carrier'>('customer');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const breadcrumbItems = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Fiyatlar & Tarifeler', url: '/fiyatlar' },
  ];

  // Customer Moving Tiers
  const CUSTOMER_TIERS = [
    {
      id: 'tier-1',
      title: '1+1 Daire Taşıma',
      badge: 'Ekonomik & Hızlı',
      popular: false,
      desc: 'Yalnız yaşayanlar, öğrenciler ve az eşyalı 1+1 evler için ideal paket.',
      localPrice: '₺12.000 – ₺16.500',
      intercityPrice: '₺22.000 – ₺32.000',
      features: [
        'Standart çift kat balonlu patpat ambalajlama',
        '2 Profesyonel taşıma personeli + 1 marangoz',
        'Kapalı kasa hijyenik kamyonet / küçük kamyon',
        'Yatak odası & gardırop söküm ve kurulumu',
        'Beyaz eşyaların koruyucu ambalajla taşınması',
        '500.000 ₺ Emtia nakliyat sigortası',
      ],
      ctaText: '1+1 İçin Teklif Al',
      ctaUrl: '/teklif-al',
    },
    {
      id: 'tier-2',
      title: '2+1 Daire Taşıma',
      badge: '⭐ En Çok Tercih Edilen',
      popular: true,
      desc: 'Çekirdek aileler ve standart hacimli evler için tam donanımlı taşıma.',
      localPrice: '₺16.000 – ₺24.000',
      intercityPrice: '₺28.000 – ₺44.000',
      features: [
        'A Kalite kraft kağıt ve havalı naylon paketleme',
        '3 Uzman taşıma personeli + 1 usta marangoz',
        'Orta boy çelik kasa nakliyat kamyonu',
        'Tüm mobilyaların titiz montaj ve demontajı',
        'Koltuk takımı ve yataklar için streç kaplama',
        '1.000.000 ₺ Kapsamlı nakliyat emtia sigortası',
        'Sabit fiyat sözleşmesi (sürpriz masrafsız)',
      ],
      ctaText: '2+1 İçin Teklif Al',
      ctaUrl: '/teklif-al',
    },
    {
      id: 'tier-3',
      title: '3+1 & 4+1 Geniş Ev',
      badge: 'Geniş Aile & Villa',
      popular: false,
      desc: 'Yoğun eşyalı büyük daireler, dubleksler ve villalar için kapsamlı çözüm.',
      localPrice: '₺24.000 – ₺36.000',
      intercityPrice: '₺38.000 – ₺62.000',
      features: [
        'Tüm kırılacak mutfak & cam eşyaların kolilenmesi',
        '4-5 Deneyimli personel + 1 uzman mobilya ustası',
        'Büyük boy 10 teker kapalı kasa evden eve aracı',
        'Dış cephe mobil asansör önceliği',
        'Avizeler ve duvara monte ünitelerin sökümü',
        '2.000.000 ₺ Değerinde tam kasko sigorta',
        'Anahtar teslim eksiksiz oda yerleşimi',
      ],
      ctaText: 'Geniş Ev İçin Teklif Al',
      ctaUrl: '/teklif-al',
    },
    {
      id: 'tier-4',
      title: 'Parça Eşya Taşıma',
      badge: 'Bütçe Dostu',
      popular: false,
      desc: 'Tekil mobilya, beyaz eşya, öğrenci eşyası veya 5-20 koli için parsiyel taşıma.',
      localPrice: '₺3.500 – ₺7.500',
      intercityPrice: '₺6.500 – ₺14.000',
      features: [
        'Parça eşyaya özel koruyucu sarım ve ambalaj',
        'Aynı güzergaha giden araçta parsiyel yerleşim',
        '%50\'ye varan maliyet tasarrufu',
        'Kapıdan kapıya teslimat ve kurulum desteği',
        'Taşıma boyunca anlık SMS ve konum takibi',
      ],
      ctaText: 'Parça Eşya Teklifi Al',
      ctaUrl: '/teklif-al',
    },
  ];

  // Extra Services Price Table
  const EXTRA_SERVICES = [
    { name: 'Dış Cephe Mobil Asansör', unit: 'Kat Başı (1 cephe)', price: '₺2.500 – ₺4.500', desc: 'Merdiven darlığı veya yüksek katlarda güvenli indirme/çıkarma' },
    { name: 'Güvenlikli Eşya Depolama', unit: 'Aylık (Oda Bazlı)', price: '₺2.500 – ₺6.000', desc: '7/24 kamera ve nem kontrolü olan kilitli depolama alanı' },
    { name: 'Kapsamlı Koli & Ambalaj Seti', unit: 'Paket Halinde', price: '₺1.500 – ₺3.000', desc: '30 koli, patpat rulosu, bantlar ve etiketleme seti' },
    { name: 'Ağır Eşya (Piyano / Kasa / Bilardo)', unit: 'Adet Başı', price: '₺3.000 – ₺6.000', desc: 'Özel kızaklı ve vinçli hassas taşıma ekibi' },
    { name: 'Standart Marangozluk Montajı', unit: 'Daire Başı', price: 'ÜCRETSİZ', desc: 'Tüm standart paket tekliflerimizde ücrete dahildir' },
  ];

  // Carrier Subscription Plans
  const CARRIER_PLANS = [
    {
      name: 'Başlangıç',
      tagline: 'Platformu denemek ve bölgedeki işleri görmek isteyenler için',
      monthlyPrice: 1250,
      yearlyPrice: 1042,
      features: [
        'Ayda 25 teklif verme hakkı',
        'Nakliyeci Defteri erişimi (10 paylaşım/ay)',
        '2 Adet şehir rota alarmı',
        'Temel firma profil sayfası',
        'E-posta destek hattı',
      ],
      cta: 'Başlangıç Paketi',
      url: '/paketler',
      popular: false,
    },
    {
      name: 'Gold (En Popüler)',
      tagline: 'Maksimum müşteri, sınırsız iş ve tam dijital görünürlük',
      monthlyPrice: 4850,
      yearlyPrice: 4042,
      trial: '7 GÜN ÜCRETSİZ DENEME (0 TL)',
      features: [
        'Sınırsız teklif verme hakkı',
        'Müşteri doğrudan telefon & WhatsApp erişimi',
        'Sınırsız Nakliyeci Defteri ilanı & yük bulma',
        'Sınırsız rota alarmı (Anlık bildirim)',
        'Ana sayfa ve şehir sayfalarında vitrin önceliği',
        '⭐ Onaylı Güvenilir Nakliyeci Rozeti',
        'Öncelikli 7/24 VIP müşteri desteği',
        'Dijital hizmetlerde %25 indirim',
      ],
      cta: '7 Gün Ücretsiz Başla (0 TL)',
      url: '/paketler',
      popular: true,
    },
    {
      name: 'Pro',
      tagline: 'Düzenli iş alan ve dönüş rotalarını dolduran nakliyeciler için',
      monthlyPrice: 2450,
      yearlyPrice: 2042,
      features: [
        'Ayda 100 teklif verme hakkı',
        'Müşteri telefon numarasına erişim',
        'Ayda 40 Nakliyeci Defteri paylaşımı',
        '5 Adet şehir rota alarmı',
        'Firma profilinde doğrulanmış rozet',
        'Haftalık iş performans analitiği',
      ],
      cta: 'Pro Paketini Seç',
      url: '/paketler',
      popular: false,
    },
  ];

  const FAQS = [
    {
      q: 'Evden eve nakliyat fiyatları neye göre belirlenir?',
      a: 'Nakliyat ücreti öncelikle oda sayısı (eşya hacmi), bina kat durumu, asansör gereksinimi ve iki adres arasındaki kilometre mesafesine göre hesaplanır. TaşınTeklif\'te talep açtığınızda tüm bu detaylar firmalara iletilir ve net fiyat teklifi verilir.',
    },
    {
      q: 'Taşınma günü ekstra veya sürpriz masraf çıkar mı?',
      a: 'Hayır. TaşınTeklif üzerinden anlaştığınız yetkili nakliyeci ile teklifte belirtilen şartlar doğrultusunda sabit fiyat sözleşmesi yapılır. Bilgilendirilmeyen ek kat veya odalar haricinde sonradan ek ücret talep edilemez.',
    },
    {
      q: 'Teklif almak ücretli midir? Komisyon kesiliyor mu?',
      a: 'Kesinlikle hayır. Müşteriler için talep oluşturmak ve teklif almak %100 ücretsizdir. Hiçbir aracı komisyonu kesilmez.',
    },
    {
      q: 'Mobilyaların montajı ve paketleme fiyata dahil mi?',
      a: 'Evet. Teklif kartlarında belirtildiği üzere standart ve geniş ev paketlerinde usta marangoz tarafından mobilyaların sökülmesi, ambalajlanması ve yeni evde kurulması hizmete dahildir.',
    },
    {
      q: 'Şehirlerarası nakliyat eşya sigortası neleri kapsar?',
      a: 'Tüm şehirlerarası taşımalarımızda eşyalarınız sefer başlangıcından teslimata kadar kaza, yangın, devrilme ve yol risklerine karşı emtia nakliyat sigortası ile teminat altındadır.',
    },
    {
      q: 'Nakliyeciler için deneme paketi var mı?',
      a: 'Evet. Nakliyat firmaları Gold paketimizi kredi kartı ile 7 gün boyunca tamamen 0 TL\'ye deneyebilir ve memnun kalmadığı takdirde tek tıkla iptal edebilir.',
    },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#F95700] text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              <span>2026 Şeffaf Fiyat Rehberi &amp; Tarifeler</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              Taşınma ve Nakliyat Fiyatları<br />
              <span className="text-[#F95700]">Şeffaf, Sabit ve Komisyonsuz</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              Taşınma öncesi net bütçenizi bilin, gizli masraflarla karşılaşmayın. 
              1+1 daireden villa taşımacılığına, parça eşyadan şehirlerarası seferlere güncel piyasa fiyat tarifeleri.
            </p>

            {/* Trust Checks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>%0 Komisyon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>Sabit Fiyat Sözü</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>K3 Belgeli Nakliyeci</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
                <span>Emtia Sigortalı</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Customer vs Carrier) */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm inline-flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-5 py-3 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-[#111E38] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-4 h-4 text-[#F95700]" />
              <span>Taşınma Fiyatları (Müşteriler İçin)</span>
            </button>
            <button
              onClick={() => setActiveTab('carrier')}
              className={`px-5 py-3 rounded-xl font-extrabold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'carrier'
                  ? 'bg-[#111E38] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#F95700]" />
              <span>Nakliyeci Üyelik Paketleri</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CUSTOMER PRICING CONTENT */}
        {activeTab === 'customer' && (
          <div className="space-y-12">
            {/* 4 Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CUSTOMER_TIERS.map(tier => (
                <div
                  key={tier.id}
                  className={`bg-white rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all hover:shadow-xl ${
                    tier.popular
                      ? 'border-[#F95700] ring-4 ring-[#F95700]/15 relative shadow-lg'
                      : 'border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div>
                    {tier.popular && (
                      <div className="inline-block px-3 py-1 rounded-full bg-[#F95700] text-white text-[11px] font-black uppercase tracking-wider mb-3">
                        {tier.badge}
                      </div>
                    )}
                    {!tier.popular && (
                      <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold tracking-wider mb-3">
                        {tier.badge}
                      </div>
                    )}

                    <h3 className="text-xl font-black text-[#111E38] mb-1.5">{tier.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-5">{tier.desc}</p>

                    {/* Prices */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Şehir İçi:</span>
                        <span className="text-sm font-extrabold text-[#111E38]">{tier.localPrice}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                        <span className="text-xs font-semibold text-slate-500">Şehirlerarası:</span>
                        <span className="text-sm font-extrabold text-[#F95700]">{tier.intercityPrice}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2.5 mb-6">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                        Dahil Olanlar
                      </span>
                      <ul className="space-y-2">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-snug">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={tier.ctaUrl}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                      tier.popular
                        ? 'bg-[#F95700] hover:bg-orange-600 text-white shadow-md shadow-orange-500/25'
                        : 'bg-slate-900 hover:bg-[#111E38] text-white'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Extra Services Unit Prices Table */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-[#111E38]">Ek Hizmetler ve Birim Fiyatları</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Taşınma planınıza isteğe bağlı olarak ekleyebileceğiniz özel ekipman ve operasyonel hizmetler.
                  </p>
                </div>
                <Link
                  href="/mesafe-hesaplama"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#F95700] hover:underline"
                >
                  Detaylı Mesafe Hesapla →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Hizmet Tanımı</th>
                      <th className="py-3 px-4">Birim / Kriter</th>
                      <th className="py-3 px-4 text-right">2026 Ortalama Fiyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {EXTRA_SERVICES.map((srv, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#111E38]">{srv.name}</div>
                          <div className="text-xs text-slate-500">{srv.desc}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-600 whitespace-nowrap">
                          {srv.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right font-black text-sm whitespace-nowrap text-[#F95700]">
                          {srv.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Intercity Routes Table */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-[#111E38]">Popüler Şehirlerarası Hatlar Ortalama Fiyatları</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    En yoğun kullanılan güzergahlarda 2026 yılı anahtar teslim ev taşıma rayiçleri.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Dönüş Aracı İndirimleri Mevcut
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INTERCITY_ROUTES.map(route => {
                  const home2plus1Price = route.prices2026.find(p => p.homeType.includes('2+1'))?.priceRange || '₺26.000 – ₺38.000';
                  return (
                    <Link
                      key={route.slug}
                      href={`/rota/${route.slug}`}
                      className="group p-5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#111E38] group-hover:text-[#F95700] transition-colors">
                          {route.originCity} → {route.destinationCity}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{route.distanceKm} km</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500">2+1 Ortalama:</span>
                        <span className="text-sm font-black text-[#F95700]">{home2plus1Price}</span>
                      </div>
                      <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between">
                        <span>Süre: ~{route.durationHours}</span>
                        <span className="text-[#F95700] group-hover:translate-x-0.5 transition-transform">İncele →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Distance Calculator Teaser */}
            <div className="bg-gradient-to-r from-orange-500 to-[#F95700] rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/20">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black tracking-tight">Kendi Güzergahınızın Fiyatını Hesaplayın</h3>
                <p className="text-sm text-orange-100 max-w-xl">
                  Şehir içi veya şehirlerarası taşınmalarınızda tam km mesafesini, tahmini yakıt maliyetini 
                  ve oda sayısına göre kesin bütçenizi hesaplayıcımızla 10 saniyede öğrenin.
                </p>
              </div>
              <Link
                href="/mesafe-hesaplama"
                className="px-6 py-3.5 rounded-2xl bg-white text-[#111E38] hover:bg-slate-100 font-black text-sm whitespace-nowrap transition-all shadow-md shrink-0 flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-[#F95700]" />
                <span>Mesafe &amp; Fiyat Hesapla</span>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 2: CARRIER SUBSCRIPTION CONTENT */}
        {activeTab === 'carrier' && (
          <div className="space-y-12">
            {/* Billing Cycle Switcher */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[#111E38] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Aylık Ödeme
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[#111E38] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Yıllık Ödeme</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                    %20 Avantaj
                  </span>
                </button>
              </div>
            </div>

            {/* Carrier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CARRIER_PLANS.map((plan, i) => {
                const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-3xl p-7 border flex flex-col justify-between transition-all hover:shadow-xl ${
                      plan.popular
                        ? 'border-[#F95700] ring-4 ring-[#F95700]/15 relative shadow-lg'
                        : 'border-slate-200/80 shadow-sm'
                    }`}
                  >
                    <div>
                      {plan.trial && (
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-black uppercase tracking-wider mb-3">
                          {plan.trial}
                        </div>
                      )}
                      {!plan.trial && plan.popular && (
                        <div className="inline-block px-3 py-1 rounded-full bg-[#F95700] text-white text-[11px] font-black uppercase tracking-wider mb-3">
                          En Popüler
                        </div>
                      )}
                      {!plan.popular && (
                        <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold mb-3">
                          Standart
                        </div>
                      )}

                      <h3 className="text-2xl font-black text-[#111E38] mb-1">{plan.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">{plan.tagline}</p>

                      <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-100">
                        <span className="text-3xl sm:text-4xl font-black text-[#111E38]">
                          ₺{price.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-xs font-bold text-slate-400">/ ay</span>
                        {billingCycle === 'yearly' && (
                          <span className="text-[10px] text-emerald-600 font-bold ml-2">Yıllık faturalandırılır</span>
                        )}
                      </div>

                      <div className="space-y-3 mb-8">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                          Paket Ayrıcalıkları
                        </span>
                        <ul className="space-y-2.5">
                          {plan.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium leading-snug">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href={plan.url}
                      className={`w-full py-4 rounded-xl font-extrabold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                        plan.popular
                          ? 'bg-[#F95700] hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-slate-900 hover:bg-[#111E38] text-white'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Carrier Benefits Section */}
            <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-[#F95700] flex items-center justify-center font-black">
                  %0
                </div>
                <h4 className="font-extrabold text-base">Sıfır Komisyon</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  İşi aldığınızda TaşınTeklif&apos;e komisyon veya aracı bedeli ödemezsiniz. Kazancınızın %100&apos;ü sizde kalır.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base">Doğrudan Müşteri İletişimi</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Müşterinin telefon numarası ve WhatsApp bilgisine anında erişerek pazarlık yapabilir, hemen anlaşabilirsiniz.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base">Boş Dönüşleri Doldurun</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nakliyeci Defteri ile boş dönen araçlarınızı Türkiye genelindeki diğer nakliyeciler ve yük ilanları ile doldurun.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#F95700] uppercase tracking-wider">
              Merak Edilenler
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38]">
              Fiyatlandırma Hakkında Sıkça Sorulan Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Taşınma maliyetleri, sözleşmeler ve ödeme süreçleri hakkında en çok sorulan soruların yanıtları.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
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
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Conversion Banner (CTA) */}
        <div className="bg-gradient-to-br from-[#111E38] via-[#1B2A4A] to-[#111E38] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#F95700]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              Hemen Başlayın
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Taşınma Bütçenizi Şimdi Belirleyin
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              2 dakikada ücretsiz talep oluşturun, bölgenizdeki en iyi K3 belgeli firmalardan 
              komisyonsuz fiyat teklifleri alın ve karşılaştırın.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/teklif-al"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F95700] hover:bg-orange-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Ücretsiz Teklif Al</span>
              </Link>
              <Link
                href="/site-haritasi"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Site Haritası &amp; Şehirler</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
