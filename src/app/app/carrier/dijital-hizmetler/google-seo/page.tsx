'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Award,
  Clock,
  Search,
  Target,
  BarChart3,
  Globe,
  Lock,
  Layers,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: 'Yerel SEO Başlangıç',
    desc: 'Kendi ilçesinde ve çevre ilçelerde 1. sayfaya çıkmak isteyen nakliyeciler',
    price: '1.250 TL',
    period: '/ ay',
    isFeatured: false,
    badge: null,
    features: [
      '1 Ana Şehir & 5 İlçe İç Sayfa SEO Yapılandırması',
      'Google Arama Konsolu (Search Console) ve Analytics Kurulumu',
      'Site İçi Başlık, Meta Açıklama & H1-H3 Etiket Optimizasyonu',
      'Site Açılış Hızı Optimizasyonu (Mobil & Masaüstü)',
      'Aylık Sıralama & Tıklama Takip Raporu'
    ]
  },
  {
    name: 'İl Geneli SEO Liderliği',
    desc: 'Büyükşehirde (örn: İstanbul geneli) tüm ilçelerde 1. sayfayı hedefleyenler',
    price: '2.500 TL',
    period: '/ ay',
    isFeatured: true,
    badge: 'EN ÇOK TERCİH EDİLEN',
    features: [
      '39 İlçe İçin Özel URL & SEO Sayfaları (örn: /kadikoy-nakliyat)',
      'Şehirlerarası Nakliyat Rota Sayfaları (Ankara, İzmir, Antalya vb.)',
      'Google Schema Taşımacılık İşletme Zengin Sonuç İşaretlemesi',
      'Yüksek Otoriteli Sektörel Tanıtım & Backlink Çalışması',
      'Rakip Firma Sıralama Analizi & Boşluk Tespiti',
      'Haftalık Anahtar Kelime Sıralama Raporu'
    ]
  },
  {
    name: 'Türkiye Geneli Kurumsal SEO',
    desc: '81 ilde ve tüm anahtar kelimelerde zirveyi hedefleyen filo firmaları',
    price: '4.500 TL',
    period: '/ ay',
    isFeatured: false,
    badge: 'FİLOLAR İÇİN',
    features: [
      '81 İl x 3 Hizmet (Evden Eve, Parça Eşya, Ofis) Dinamik URL Havuzu',
      'Hepsiburada/Sahibinden Kalitesinde SEO Mimarisi',
      'Basın Bülteni ve Ulusal Haber Sitelerinden Otoriter Backlinkler',
      'Özel SEO Uzmanı & Canlı Pozisyon Takip Paneli',
      '7/24 Google Algoritma Güncelleme Koruması'
    ]
  }
];

const FAQS = [
  {
    q: 'Google SEO ile Google Ads (Reklamlar) arasındaki fark nedir?',
    a: 'Google Ads ile sponsorlu sırada çıkıp her tıklamaya para ödersiniz ve bütçe bittiğinde reklam durur. Google SEO ise sitenizi organik olarak ilk sayfaya ve 1. sıraya taşır. Gelen yüzlerce telefon ve tıklama için Google\'a hiçbir ücret ödemezsiniz; trafik tamamen ücretsiz ve kalıcıdır.'
  },
  {
    q: '1. sayfaya veya ilk sıralara ne kadar sürede çıkarız?',
    a: 'SEO bir maratondur. İlçe bazlı aramalarda (örn: /pendik-evden-eve-nakliyat) 3 ila 6 hafta içinde ilk sayfaya yükselme başlar. Ana kelimelerde (örn: /istanbul-nakliyat) zirveye yerleşmek düzenli çalışmayla genellikle 2-3 ayı bulur. Ancak çıkıldığında kalıcı müşteri akışı sağlar.'
  },
  {
    q: 'İç sayfa URL mimarisi neden önemlidir?',
    a: 'Google aramalarında kullanıcılar sadece genel kelimeleri aramaz; "Kadıköy evden eve nakliyat", "Beşiktaş parça eşya taşıma", "İstanbul Ankara nakliyat" gibi özel aramalar yaparlar. Sitenizde her ilçe ve güzergah için özel optimize edilmiş URL sayfaları bulunduğunda, her aramada 1. sırada sadece siz çıkarsınız.'
  },
  {
    q: 'SEO çalışması bittiğinde sıralamam hemen düşer mi?',
    a: 'Hayır. Organik SEO ile kazanılan pozisyonlar sağlam bir teknik temele ve içerik kalitesine dayandığı için hemen düşmez. Rakiplerin ataklarına karşı aylık hafif bakım ve takip önerilmekle birlikte, kalıcılığı reklamlara göre kat kat yüksektir.'
  }
];

export default function GoogleSeoServicePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user) {
      router.push('/giris?role=nakliyeci');
      return;
    }
    setCurrentUser(user);
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
            <span>Google Organik Arama Liderliği & İç Sayfa SEO Mimarisi</span>
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
            
            {/* BÖLÜM 1: GERÇEK GOOGLE ARAMA EKRANI (TEMİZ BEYAZ KART - MAVİLİKLER KALDIRILDI) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Gerçek Google Arama Ekranı & Pozisyon Liderliği
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-[#0A1128]">
                    Google Organik Arama Sonuçlarında Zirve Pozisyon
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Müşterilerin %78'i reklamlara değil, Google'ın güvendiği organik 1. sayfa sonuçlarına tıklar.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Kalıcı ve Ücretsiz Ziyaretçi</span>
                </div>
              </div>

              {/* Gerçek Google Search Ekranı (Browser Çerçevesinde) */}
              <div className="w-full rounded-2xl bg-white text-slate-800 shadow-md overflow-hidden border border-slate-300">
                
                {/* Browser Tab & Address Bar Header */}
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                  </div>
                  <div className="flex-1 max-w-md bg-white border border-slate-300 rounded-full px-4 py-1.5 text-xs text-slate-600 flex items-center gap-2 font-mono shadow-2xs mx-auto truncate">
                    <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 truncate">https://www.google.com/search?q=istanbul+nakliyat</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Google SERP Canlı</span>
                </div>

                {/* Real Google Search Screenshot Image */}
                <div className="relative w-full bg-slate-50 border-b border-slate-200">
                  <img
                    src="/images/google-search-nakliyat.png" 
                    alt="İstanbul Nakliyat Google Arama 1. Sayfa Gerçek Ekran Görüntüsü" 
                    className="w-full h-auto object-contain block max-h-[500px] mx-auto"
                  />
                </div>

                {/* Ekran Altı Detay & Başarı İstatistiği */}
                <div className="p-4 sm:p-5 bg-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black">
                        ✓ 1. Sayfa Organik Pozisyon
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Arama Terimi: "istanbul nakliyat"
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      Aylık Ortalama Aranma Hacmi: <strong>165.000+ Arama</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-center">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block font-medium">Aylık Organik Çağrı</span>
                      <strong className="text-emerald-700 text-sm sm:text-base font-black">450+ Doğrudan Telefon</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block font-medium">Tıklama Başı Maliyet</span>
                      <strong className="text-slate-800 text-sm sm:text-base font-black">0 TL (Tamamen Ücretsiz)</strong>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-500 block font-medium">Kalıcılık Süresi</span>
                      <strong className="text-[#F95700] text-sm sm:text-base font-black">Yıllarca 1. Sayfa</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600">%78</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Organik Tercih Oranı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">39 İlçe</span>
                  <span className="text-[10px] text-slate-500 block font-medium">SEO Uyumlu İç Sayfa URL</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600">0.8 sn</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Mobil Sayfa Açılış Hızı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600">Komisyonsuz</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Tüm İşler Firmanıza Kalır</span>
                </div>
              </div>

            </div>

            {/* BÖLÜM 2: ARTILARI VE EKSİLERİ (HİZMET ANALİZİ) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Hizmet Analizi</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Google SEO Hizmetinin Artıları ve Dikkat Edilmesi Gerekenler
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Organik arama liderliğinin firmanıza sağlayacağı avantajlar ve bilinmesi gereken süreç dinamikleri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* ARTILARI */}
                <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200/80 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>Güçlü Yanları (Artıları)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Tıklama Başı Maliyet Yok:</strong> Günde 1.000 kişi sitenize girse de Google'a 1 kuruş bile ödemezsiniz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>En Yüksek Müşteri Güveni:</strong> İnsanlar reklamlara şüpheyle yaklaşırken organik ilk sıradaki nakliyeciyi sektörün 1 numarası olarak görür.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Kalıcı Dijital Değer:</strong> Reklam gibi bütçe bittiğinde kapanmaz; siteniz aylarca ilk sayfada kalarak düzenli iş getirmeye devam eder.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>İlçe & Güzergah Hakimiyeti:</strong> Kadıköy'den Beşiktaş'a, Ankara seferinden İzmir'e yüzlerce farklı aramadan müşteri çeker.</span>
                    </li>
                  </ul>
                </div>

                {/* DİKKAT EDİLMESİ GEREKENLER (EKSİLERİ) */}
                <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200/80 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-black text-xs">
                      !
                    </div>
                    <span>Dikkat Edilmesi Gerekenler (Eksileri)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Zaman ve Sabır İster:</strong> Google algoritmalarının sitenizi tarayıp 1. sıraya oturtması genellikle 3-8 hafta sürer (ilk gün sonuç beklenemez).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Rakipler de Çalışır:</strong> İlk sayfadaki diğer nakliyat siteleri de rekabet ettiği için periyodik takip ve içerik güncellemesi gerekir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Teknik Altyapı Şarttır:</strong> Hızlı açılmayan, mobil uyumsuz veya SSL sertifikası olmayan amatör siteler SEO'da yükselemez.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* BÖLÜM 3: PAKETLER VE FİYATLANDIRMA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf SEO Paketleri</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Bölgenizde 1 Numaralı Nakliyeci Olun
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Her ay yüzlerce evden eve taşıma müşterisini doğrudan Google organik aramalardan kazanın.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PACKAGES.map((pkg, i) => (
                  <div 
                    key={i} 
                    className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between ${
                      pkg.isFeatured 
                        ? 'border-2 border-[#F95700] bg-orange-50/20 shadow-md relative' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {pkg.badge && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F95700] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {pkg.badge}
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-black text-base text-[#0A1128]">{pkg.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{pkg.desc}</p>
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
                        href={`https://wa.me/908503080000?text=${encodeURIComponent(`Merhaba, ${pkg.name} SEO paketi hakkında bilgi ve analiz almak istiyorum.`)}`}
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

            {/* BÖLÜM 4: SSS */}
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

            {/* BÖLÜM 5: WHATSAPP ÇAĞRISI */}
            <div className="bg-[#0A1128] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 text-center sm:text-left relative z-10">
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Kelime & Sıralama Analizi</span>
                <h3 className="text-xl font-black text-white">Sitenizin Google Sıralamasını Analiz Edelim</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Mevcut web sitenizin veya bölgenizdeki anahtar kelimelerin potansiyelini birlikte inceleyelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20Google%20SEO%20analizi%20için%20yazıyorum." 
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