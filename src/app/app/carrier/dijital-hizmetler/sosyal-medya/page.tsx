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
  Share2,
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Heart,
  MessageCircle,
  Bookmark,
  Users,
  Eye,
  Camera,
  Layers,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Sosyal Medya Başlangıç",
    desc: "Instagram'da kurumsal profil görünümü ve ilk reklamını vermek isteyenler",
    price: "1.250 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: null,
    features: [
      "Meta Business Kurumsal Reklam Hesabı Kurulumu",
      "Instagram & Facebook Sayfası Profesyonel Düzenleme",
      "Bölgesel Hedefleme (Şehir & İlçe Odaklı Reklam)",
      "WhatsApp'a Doğrudan Bağlanan İlan Formatı",
      "Aylık Harcama & Gelen Mesaj Raporu"
    ]
  },
  {
    name: "Profesyonel Büyüme & Lead",
    desc: "Her hafta düzenli evden eve taşıma rezervasyonu almak isteyen nakliyeciler",
    price: "2.250 TL",
    period: "/ ay (yönetim)",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Yeni Ev Arayanlar & Taşınma Hazırlığındaki Kitle Hedeflemesi",
      "8 Adet Profesyonel Nakliyat Reklam Görseli & Metin Hazırlığı",
      "Instagram Reels & Hikaye (Story) Özel Video Reklamları",
      "A/B Testleri ile En Düşük Mesaj Başı Maliyet Optimizasyonu",
      "Doğrudan WhatsApp Butonu ile Anında Teklif Verme Akışı",
      "Haftalık Canlı Performans & Mesaj Takip Raporu"
    ]
  },
  {
    name: "Tam Kapsamlı Sosyal Medya & Filo",
    desc: "Bölgesinde marka olmak ve sürekli rezervasyon doldurmak isteyen büyük filolar",
    price: "3.750 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: "FİLOLAR İÇİN",
    features: [
      "Tüm Türkiye veya Çoklu Şehir Seferleri İçin Geniş Reklam Kampanyası",
      "Aylık 16 Adet Özel Tasarım Görsel + Reels Video Kurgusu",
      "Müşteri Yorum & Güven Videoları Sponsorlu Yayını",
      "Yeniden Pazarlama (Retargeting) ile Sayfayı Gezenleri Geri Kazanma",
      "Özel Sosyal Medya Danışmanı & 7/24 Kampanya Optimizasyonu"
    ]
  }
];

const FAQS = [
  {
    q: "Instagram reklamlarında bütçeyi kime ödüyorum?",
    a: "Reklam harcamanızı doğrudan kendi kredi kartınızla Meta (Facebook/Instagram) şirketine ödersiniz. Biz hedef kitle belirleme, reklam tasarımı, metin yazımı ve mesaj maliyetlerini düşürme danışmanlığı sağlarız."
  },
  {
    q: "Gelen müşteriler benimle nasıl iletişime geçiyor?",
    a: "Reklamın altındaki 'WhatsApp'tan Fiyat Al' butonuna tıklayan müşteriler doğrudan sizin işletme WhatsApp hattınıza yönlendirilir ve 'Merhaba, evden eve nakliyat için fiyat almak istiyorum' mesajıyla anında yazışma başlar."
  },
  {
    q: "Hedef kitleyi nasıl seçiyorsunuz?",
    a: "Meta'nın gelişmiş algoritmaları sayesinde 'yeni ev kiralayanlar', 'evlilik hazırlığında olanlar', 'gayrimenkul sayfalarını takip edenler' ve belirlediğiniz ilçelerde oturanlar hedeflenir. Böylece reklamınız sadece gerçekten taşınacak kişilere gösterilir."
  },
  {
    q: "Reklam görsellerini ve videolarını siz mi hazırlıyorsunuz?",
    a: "Evet. Firmanızın logosunu, araç fotoğraflarını ve sunduğunuz hizmetleri (asansörlü, ambalajlı, marangozlu) profesyonel grafik ve video formatlarına dönüştürerek onayınıza sunuyoruz."
  }
];

export default function SosyalMedyaServicePage() {
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
          <span className="text-[#0A1128] font-bold">Sosyal Medya Reklamları</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold mb-2">
            <Share2 className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram & Facebook Nakliyat Reklam Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Instagram'da Gerçek Taşınma Reklamlarıyla Haftalık 25+ İş Bağlayın
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Yeni ev kiralayan ve taşınma hazırlığında olan müşterileri Instagram & Facebook üzerinden nokta atışı yakalayın. Doğrudan WhatsApp hattınıza gelen taleplerle araçlarınızı her gün dolu tutun.
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
            
            {/* BÖLÜM 1: GERÇEK İNSTAGRAM REKLAMI MOCKUP (TEMİZ BEYAZ KART - UZUN AI KARTLARINDAN ARINDIRILMIŞ) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    Gerçek Instagram Sponsorlu İlan Görünümü
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-[#0A1128]">
                    Müşterilerinizin Instagram Akışında Göreceği Reklam
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gereksiz uzun metinler olmadan; doğrudan göze hitap eden, temiz ve WhatsApp teklifi getiren gerçek reklam formatı.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Hedef Kitle: Ev Arayanlar</span>
                </div>
              </div>

              {/* REALISTIC INSTAGRAM POST CARD MOCKUP */}
              <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-300 shadow-lg overflow-hidden font-sans">
                
                {/* 1. Profile Header */}
                <div className="p-3 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[#F95700] text-xs">
                        YN
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-slate-900">yildiznakliyat.official</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <span>Sponsorlu</span>
                        <span>•</span>
                        <span className="text-slate-600 font-semibold">İstanbul & Çevresi</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm font-bold tracking-widest cursor-pointer px-1">•••</span>
                </div>

                {/* 2. Visual Ad Banner (Real Moving Company Photo Scene) */}
                <div className="relative bg-slate-900 aspect-square flex flex-col justify-between overflow-hidden text-white">
                  
                  {/* Real Moving Truck Scene Image Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-10" />
                  
                  {/* Background Photo Placeholder with realistic truck overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <div className="text-center space-y-2 p-6 z-0">
                      <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center text-4xl shadow-inner">
                        🚛
                      </div>
                      <h4 className="text-lg font-black text-white tracking-wide">
                        YILDIZ NAKLİYAT
                      </h4>
                      <p className="text-xs text-slate-300 max-w-xs mx-auto">
                        Evden Eve Nakliyat & 15. Kat Modüler Asansörlü Taşımacılık
                      </p>
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="relative z-20 p-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#F95700] text-white text-[10px] font-black shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> %20 Erken Rezervasyon İndirimi
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-slate-200">
                      Kadıköy / Moda
                    </span>
                  </div>

                  {/* Bottom Features Strip Over Image */}
                  <div className="relative z-20 p-3.5 bg-gradient-to-t from-black/90 to-transparent space-y-1">
                    <div className="text-sm font-black text-white">
                      Çift Kat Patpat Ambalaj · Marangozlu Söküm-Montaj · Sigortalı
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-300 font-medium">
                      <span>✓ 15 Yıllık Tecrübe</span>
                      <span>•</span>
                      <span>✓ Sözleşmeli Sabit Fiyat</span>
                      <span>•</span>
                      <span>★ 4.9 Puan</span>
                    </div>
                  </div>

                </div>

                {/* 3. Instagram Action CTA Bar (En Çok Dönüşüm Sağlayan Bar) */}
                <div className="bg-[#F8FAFC] px-3.5 py-2.5 border-y border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Taşınma Fiyatınızı 2 Dakikada Öğrenin</span>
                    <span className="text-[10px] text-slate-500 font-medium">WhatsApp'tan hemen oda sayısını yazın</span>
                  </div>
                  <div className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Fiyat Al →</span>
                  </div>
                </div>

                {/* 4. Instagram Engagement Icons */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-800">
                      <Heart className="w-5 h-5 text-red-500 fill-red-500 cursor-pointer" />
                      <MessageCircle className="w-5 h-5 cursor-pointer" />
                      <Share2 className="w-5 h-5 cursor-pointer" />
                    </div>
                    <Bookmark className="w-5 h-5 text-slate-600 cursor-pointer" />
                  </div>

                  <div className="text-xs font-black text-slate-900">
                    1.428 beğenme
                  </div>

                  {/* 5. Authentic Caption */}
                  <div className="text-xs text-slate-800 leading-relaxed">
                    <strong className="font-black text-slate-900 mr-1.5">yildiznakliyat.official</strong>
                    İstanbul içi ve şehirlerarası evden eve nakliyatta %20 erken rezervasyon indirimi! 📦 Profesyonel marangoz, çift kat patpat ambalaj ve asansörlü taşıma hizmetimizle eşyalarınız 1 günde yeni yuvanızda. Profildeki linkten veya WhatsApp butonundan 2 dakikada sabit fiyat alın! 🚛✨
                    <div className="text-[11px] text-blue-600 font-medium mt-1">
                      #evdenevenakliyat #istanbultasima #asansorlunakliyat #nakliyatfirmalari
                    </div>
                  </div>
                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600">3.50 TL</span>
                  <span className="text-[10px] text-slate-500 block font-medium">WhatsApp Mesaj Başı Maliyet</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">25+ İş / Hafta</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Ortalama Bağlanan Rezervasyon</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600">2.5 Milyon</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Bölgesel Erişim Havuzu</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600">Doğrudan Hat</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Komisyonsuz WhatsApp Sohbeti</span>
                </div>
              </div>

            </div>

            {/* BÖLÜM 2: ARTILARI VE EKSİLERİ (HİZMET ANALİZİ) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Hizmet Analizi</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Sosyal Medya Reklamlarının Artıları ve Dikkat Edilmesi Gerekenler
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sosyal medya reklamları firmanıza nasıl iş getirir ve Google reklamlarından farkı nedir?
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
                      <span><strong>Görsel Güven Yaratır:</strong> Eşyaların sarılışını ve hidrolik asansörü video olarak gören müşteri firmanıza hemen güvenir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Nokta Atışı Kitle:</strong> Yeni ev kiralayan veya evlilik aşamasındaki ailelere doğrudan ulaşarak talep yaratır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Doğrudan WhatsApp İletişimi:</strong> Müşteri telefon numarası aramadan tek tıkla WhatsApp sohbeti başlatır ve eşya fotoğraflarını gönderir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Marka Bilinirliği:</strong> Bölgenizde herkes sizin araçlarınızı ve logonuzu sürekli görerek bilinirliğinizi artırır.</span>
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
                      <span><strong>Acil İhtiyaç Google Kadar Yüksek Değildir:</strong> Akışta gezinirken gören müşteri hemen yarın değil, 2 hafta sonraki taşınma için fiyat sorabilir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Temiz Görsel ve Video İster:</strong> Kalitesiz veya bulanık araç fotoğrafları reklamın etkisini düşürür.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Hızlı WhatsApp Cevabı Şarttır:</strong> Fiyat soran müşteriye 10 dakika içinde cevap verilmezse başka bir firmaya yazabilir.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* BÖLÜM 3: PAKETLER VE FİYATLANDIRMA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Sosyal Medya Paketleri</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Sosyal Medyadan Müşteri Kazanmaya Başlayın
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tüm paketlerde profesyonel görsel tasarımı, hedef kitle yönetimi ve WhatsApp entegrasyonu dahildir.
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
                        href={`https://wa.me/908503080000?text=${encodeURIComponent(`Merhaba, ${pkg.name} sosyal medya reklam paketi hakkında bilgi almak istiyorum.`)}`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Sosyal Medya Danışmanlığı</span>
                <h3 className="text-xl font-black text-white">Instagram Reklamınızı Birlikte Başlatalım</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanız için hazırlanacak örnek Instagram reklam görselini ve tahmini mesaj sayılarını hemen WhatsApp'tan iletelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20sosyal%20medya%20reklamları%20için%20yazıyorum." 
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