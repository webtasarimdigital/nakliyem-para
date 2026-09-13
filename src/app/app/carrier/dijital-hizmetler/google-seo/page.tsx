'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Search,
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Award,
  Globe,
  FileText,
  BarChart3,
  ExternalLink,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Temel Şehir SEO",
    desc: "Kendi şehrindeki aramalarda 1. sayfaya çıkmak isteyenler",
    price: "1.500 TL",
    period: "/ aylık",
    isFeatured: false,
    badge: null,
    features: [
      "1 İl & 10 Hedef Anahtar Kelime",
      "Sayfa İçi (On-Page) SEO & Hız Ayarı",
      "Mobil Uyumluluk & Başlık Optimizasyonu",
      "Google Search Console & Analitik Kurulumu",
      "Aylık Şeffaf Sıralama Takip Raporu"
    ]
  },
  {
    name: "Bölgesel Lider SEO",
    desc: "Şehirlerarası nakliyat ve yoğun rotalarda liderlik hedefleyenler",
    price: "2.500 TL",
    period: "/ aylık",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "25 Hedef Anahtar Kelime (İlçe İlçe)",
      "Şehirlerarası Rota Sayfaları (Örn: İst-Ankara)",
      "Sektörel Güçlü Nakliyat Backlink Çalışması",
      "Rakip Analizi & Pozisyon Çalma Stratejisi",
      "Haftalık Sıralama & Çağrı İlerleme Raporu",
      "1. Sayfa Garantili İlerleme Takibi"
    ]
  },
  {
    name: "Türkiye Geneli VIP SEO",
    desc: "81 ilde lider nakliyat ve lojistik filoları için",
    price: "4.500 TL",
    period: "/ aylık",
    isFeatured: false,
    badge: "TAM HAKİMİYET",
    features: [
      "50+ Genişletilmiş Anahtar Kelime Grubu",
      "Tüm Türkiye İlçe Bazlı İniş Sayfaları",
      "Sektörel Blog & Makale Üretim Havuzu",
      "Teknik SEO & Sunucu Yanıt Hızı Garantisi",
      "Öncelikli 7/24 Özel SEO Uzmanı Danışmanlığı"
    ]
  }
];

const FAQS = [
  {
    q: "Google SEO ile Google Reklamları (Ads) arasındaki fark nedir?",
    a: "Google Reklamlarında tıklama başına para ödersiniz ve bütçeniz bittiğinde reklamınız durur. Google SEO'da ise siteniz organik olarak 1. sıraya yerleşir; ayda 10.000 kişi de tıklasa Google'a tek kuruş tıklama ücreti ödemezsiniz. Müşteriler tamamen ücretsiz gelir."
  },
  {
    q: "Google'da 1. sayfaya çıkmam ne kadar zaman alır?",
    a: "SEO kalıcı bir yatırımdır. Yerel ilçe kelimelerinde ilk 30-45 günde ciddi yükselişler başlar. 'İstanbul evden eve nakliyat' gibi ana rekabetçi kelimelerde ise 2 ila 3 ay içinde 1. sayfa ve zirve pozisyonları elde edilir."
  },
  {
    q: "SEO çalışması durdurulursa sitem hemen geriye düşer mi?",
    a: "Hayır. Reklam gibi anında yok olmaz; sitenize kazandırdığımız teknik altyapı, zengin içerik ve kaliteli bağlantılar uzun aylar boyunca sitenizi üst sıralarda tutmaya devam eder."
  },
  {
    q: "Hangi kelimelerde yükseleceğimi nasıl seçiyoruz?",
    a: "Gerçekten müşteri getiren ve taşınmak isteyen insanların yazdığı kelimeleri analiz ediyoruz (Örn: 'Kadıköy evden eve nakliyat', 'İstanbul şehirlerarası nakliyat', 'asansörlü eşya taşıma'). Gereksiz aramalarla vakit kaybetmeyiz."
  }
];

export default function GoogleSeoPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== 'CARRIER') {
      router.push('/giris?role=nakliyeci');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
          <Link href="/app/carrier/dijital-hizmetler" className="hover:text-[#F95700]">Dijital Hizmetler</Link>
          <span>/</span>
          <span className="text-[#0A1128] font-bold">Google SEO Hizmeti</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Organik Arama Liderliği</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Google'da "İstanbul Nakliyat" Aramasında 1. Sayfa ve Zirve
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Reklamlara tık başı yüzlerce lira ödemeden, her gün Google'da evden eve nakliyeci arayan binlerce müşteriden komisyonsuz doğrudan telefon çağrısı alın.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Sol Sidebar */}
          <div className="lg:col-span-4">
            <CarrierDigitalSidebar />
          </div>

          {/* Sağ Ana İçerik */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* ── BÖLÜM 1: GOOGLE SERP CANLI ARAMA MOCKUP ── */}
            <div className="bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Canlı Google Arama Simülasyonu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-white">
                    Google Organik Arama Sonuçlarında 1. Sıra
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Müşterilerin en çok tıkladığı ve güvendiği 1. organik pozisyonda sizin siteniz yer alsın.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Ücretsiz Tıklama Akışı</span>
                </div>
              </div>

              {/* Google SERP Card Mockup */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-300">
                
                {/* Google Search Bar */}
                <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-300 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xs">
                    <Search className="w-4 h-4 text-[#4285F4]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">istanbul evden eve nakliyat</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                    Yaklaşık 1.840.000 sonuç (0,31 sn)
                  </div>
                </div>

                {/* SERP Sonuçları */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* 1. SIRA ORGANİK SONUÇ: SİZİN İŞLETME SİTESİ (VURGULANMIŞ) */}
                  <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/30 p-4 sm:p-5 shadow-sm relative space-y-2.5">
                    
                    {/* 1. Sıra Rozeti */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>GOOGLE 1. SIRA (▲ +14 Pozisyon Yükseldi!)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Organik Lider
                      </span>
                    </div>

                    {/* URL ve Breadcrumb */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-5 rounded-full bg-[#111E38] text-white flex items-center justify-center font-black text-[10px]">
                        Y
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 text-xs block leading-none">Yıldız Evden Eve Nakliyat</span>
                        <span className="text-[11px] text-slate-400">https://www.yildiznakliyat.com.tr › istanbul-evden-eve-nakliyat</span>
                      </div>
                    </div>

                    {/* Başlık (Mavi Google Linki) */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                        İstanbul Evden Eve Nakliyat | Sigortalı & Asansörlü Taşıma
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        İstanbul'un 39 ilçesinde sigortalı, marangozlu ve asansörlü evden eve nakliyat. Sözleşmeli sabit fiyat garantisi, temiz ambalajlama ve profesyonel çelik kasalı araç filosu. Hemen arayın, ücretsiz fiyat teklifi alın!
                      </p>
                    </div>

                    {/* Sitelinks (Google Alt Bağlantıları) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60">
                      <div className="p-2 rounded-lg bg-white border border-emerald-100 text-center">
                        <span className="text-[11px] font-bold text-[#1a0dab] block">Asansörlü Taşıma</span>
                        <span className="text-[9px] text-slate-400">Yüksek katlara kolay</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-emerald-100 text-center">
                        <span className="text-[11px] font-bold text-[#1a0dab] block">Şehirlerarası Rota</span>
                        <span className="text-[9px] text-slate-400">81 ile günlük sefer</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-emerald-100 text-center">
                        <span className="text-[11px] font-bold text-[#1a0dab] block">Fiyat Hesaplama</span>
                        <span className="text-[9px] text-slate-400">Oda sayısına göre</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-emerald-100 text-center">
                        <span className="text-[11px] font-bold text-[#1a0dab] block">Müşteri Yorumları</span>
                        <span className="text-[9px] text-slate-400">★ 4.9 Puan (420+)</span>
                      </div>
                    </div>

                    {/* Başarı İstatistiği */}
                    <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 p-2 rounded-lg flex items-center justify-between mt-2">
                      <span>📈 Bu pozisyonun getirdiği aylık ücretsiz ziyaretçi:</span>
                      <strong className="text-emerald-950 font-black text-xs">3.450 Tekil Müşteri / Ay</strong>
                    </div>

                  </div>

                  {/* 2. SIRA: RAKİP SİTE (SOLUK) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 opacity-50 space-y-1">
                    <div className="text-[11px] text-slate-400">https://www.rakipnakliyat-a.com</div>
                    <div className="text-xs font-bold text-slate-700">İstanbul Nakliyat Firmaları - Evden Eve</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">Evden eve nakliye ve eşya taşıma hizmetleri için bizi arayın...</div>
                  </div>

                  {/* 3. SIRA: RAKİP SİTE (SOLUK) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 opacity-30 space-y-1">
                    <div className="text-[11px] text-slate-400">https://www.rakipnakliyat-b.com</div>
                    <div className="text-xs font-bold text-slate-700">En Uygun İstanbul Evden Eve Nakliye</div>
                  </div>

                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-400">0 TL</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Tıklama Ücreti</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">3.400+</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Aylık Organik Ziyaret</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-400">1. Sayfa</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Kalıcı Pozisyon</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-400">39 İlçe</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Yerel İniş Sayfaları</span>
                </div>
              </div>

            </div>

            {/* ── BÖLÜM 2: ÖNCESİ / SONRASI KARŞILAŞTIRMASI ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">İş Hacminizdeki Değişim</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Öncesi vs. Google SEO Sonrası
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Reklamlar bütçeniz bitince durur; SEO ise sitenizi kalıcı bir müşteri mıknatısına dönüştürür.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ÖNCESİ */}
                <div className="rounded-2xl bg-red-50/70 border-2 border-red-200/80 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b border-red-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-200/80 flex items-center justify-center text-red-700 font-black text-xs">
                      ✕
                    </div>
                    <span>SEO Çalışması Olmayan Firma</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Google'ın 4. veya 5. sayfasında kayıptır; müşterilerin %95'i ilk 3 sonuçtan sonra bakmaz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Her bir iş için komisyonculara ve spotçulara %20 - %30 komisyon ödemek zorunda kalır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Reklam bütçesi durdurulduğu gün telefonlar tamamen susar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Aylık organik müşteri:</strong> 0 - 1 tesadüfi arama.</span>
                    </li>
                  </ul>
                </div>

                {/* SONRASI */}
                <div className="rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>TaşınTeklif ile 1. Sıra Google SEO Sonrası</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>"İstanbul evden eve nakliyat", "Kadıköy nakliye" gibi en değerli aramalarda 1. sırada yer alır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Tıklama başı tek kuruş ödemeden, her gün Google'dan doğrudan arayan gerçek müşteriler gelir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Komisyonsuz, kendi fiyatını kendi belirleyen ve aracısız çalışan lider firma imajı.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Aylık organik müşteri:</strong> 35 - 75+ doğrudan ve yüksek karlı taşıma işi!</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ── BÖLÜM 3: SEO SÜRECİ & ÇALIŞMALARIMIZ ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1128]">Nakliyeciler İçin Özel SEO Mimarisi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">İlçe & Rota Sayfaları (Landing Pages)</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    "Kadıköy Nakliyat", "Beşiktaş Evden Eve", "İstanbul - İzmir Nakliye" gibi onlarca özel rota sayfası açıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">1 Saniyenin Altında Mobil Hız (Core Web Vitals)</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Google hız puanını 95 üzerine çıkararak sitenizin rakiplerinden daha hızlı indekslenmesini sağlıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F95700] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Sektörel Güçlü Backlinkler</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Güvenilir nakliyat dizinleri ve haber portallarından sitenize otoriter bağlantılar kazandırıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Haftalık Şeffaf Sıralama Raporu</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Kelimelerinizin her hafta kaçıncı sıraya çıktığını ve ne kadar organik çağrı aldığınızı raporluyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* ── BÖLÜM 4: PAKETLER & FİYATLANDIRMA ── */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Fiyatlar</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Google SEO Paketleri
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PACKAGES.map((pkg, idx) => (
                  <div 
                    key={idx}
                    className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between border-2 ${
                      pkg.isFeatured
                        ? 'bg-white border-[#F95700] shadow-md relative'
                        : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F95700] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        {pkg.badge}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-black text-base text-[#0A1128]">{pkg.name}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{pkg.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-2xl font-black text-[#0A1128]">{pkg.price}</span>
                        {pkg.period && <span className="text-xs text-slate-400 font-bold ml-1">{pkg.period}</span>}
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-100">
                        {pkg.features.map((feat, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <a 
                        href={`https://wa.me/908503080000?text=Merhaba,%20${encodeURIComponent(pkg.name)}%20SEO%20paketi%20hakkında%20bilgi%20almak%20istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button 
                          variant={pkg.isFeatured ? 'primary' : 'outline'} 
                          size="md" 
                          className="w-full font-bold text-xs rounded-xl"
                        >
                          Hemen Başla →
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BÖLÜM 5: SIKÇA SORULAN SORULAR (SSS) ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1128]">Sıkça Sorulan Sorular</h3>
              <div className="space-y-2.5 pt-2">
                {FAQS.map((faq, fIdx) => (
                  <div 
                    key={fIdx} 
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0A1128] hover:bg-slate-50 cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === fIdx ? 'rotate-180 text-[#F95700]' : ''}`} />
                    </button>
                    {openFaq === fIdx && (
                      <div className="p-4 pt-0 text-xs text-slate-600 font-medium leading-relaxed bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── BÖLÜM 6: DOĞRUDAN İLETİŞİM & WHATSAPP ÇAĞRISI ── */}
            <div className="bg-[#0A1128] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz SEO Analizi</span>
                <h3 className="text-xl font-black text-white">Sitenizi Birlikte İnceleyelim</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Mevcut sitenizin Google sıralamalarını ve hangi kelimelerden müşteri kazanabileceğinizi ücretsiz çıkartalım.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20Google%20SEO%20ücretsiz%20analiz%20için%20yazıyorum." 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0 relative z-10"
              >
                <Button variant="primary" size="lg" className="font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-orange-950/20" leftIcon={<PhoneCall className="w-4 h-4" />}>
                  WhatsApp Destek Hattı
                </Button>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
