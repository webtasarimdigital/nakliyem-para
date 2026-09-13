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
  Laptop,
  Smartphone,
  Check,
  X,
  Lock,
  ChevronDown,
  Truck,
  MessageCircle,
  Clock,
  Award,
  Layers,
  Search,
  ExternalLink,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Başlangıç Web Sitesi",
    desc: "Bireysel ve küçük ölçekli nakliyeciler için kurumsal vitrin",
    price: "3.500 TL",
    period: "tek seferlik",
    isFeatured: false,
    badge: null,
    features: [
      "5 Temel Sayfa (Ana Sayfa, Hakkımızda, Hizmetler, Filo, İletişim)",
      ".com veya .com.tr Alan Adı (1 Yıl Ücretsiz Dahil)",
      "Yüksek Hızlı SSL Korumalı Hosting",
      "WhatsApp & Tek Tıkla Ara Çağrı Butonları",
      "Mobil, Tablet & Masaüstü %100 Uyumlu Tasarım",
      "Google Harita ve İşletme Konumu Entegrasyonu"
    ]
  },
  {
    name: "Profesyonel SEO Nakliyat Sitesi",
    desc: "İlçe aramalarından doğrudan müşteri toplamak isteyen nakliyat firmaları",
    price: "6.500 TL",
    period: "tek seferlik",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "39 İlçe İçin Özel SEO Uyumlu URL İç Sayfaları (örn: /kadikoy-nakliyat)",
      "Şehirlerarası Rota Sayfaları (İstanbul - Ankara, İzmir vb.)",
      "Canlı Nakliyat Fiyat Hesaplama Modülü (Oda ve Mesafe Bazlı)",
      "0.8 Saniye Ultra Hızlı Açılış (Google Core Web Vitals 100/100)",
      "Google Schema Taşımacılık İşletme Zengin Sonuç Yapısı",
      "Sınırsız Araç ve Referans Fotoğrafı Ekleme Paneli",
      "1 Yıllık Kurumsal Hosting, SSL ve 5 Adet Kurumsal E-posta"
    ]
  },
  {
    name: "Kurumsal Filo & Lojistik Portalı",
    desc: "Çok şubeli, geniş araç filolu ve Türkiye geneli çalışan kurumsal lojistik firmaları",
    price: "12.000 TL",
    period: "tek seferlik",
    isFeatured: false,
    badge: "FİLOLAR İÇİN",
    features: [
      "81 İl ve Tüm İlçeler İçin Dinamik SEO URL Sayfa Mimarisi",
      "Online Talep Toplama & Canlı Teklif Verme Altyapısı",
      "Gelişmiş Çoklu Şube ve Garaj Konumları Haritası",
      "Özel Müşteri Yorum & Güven Doğrulama Modülü",
      "Google Ads ve Meta Piksel Tam Dönüşüm Takip Entegrasyonu",
      "Öncelikli 7/24 Teknik Destek & Yedekleme Garantisi"
    ]
  }
];

const FAQS = [
  {
    q: "Sitem ne kadar sürede tamamlanıp teslim edilir?",
    a: "Alan adı kaydı, SSL kurulumu, 39 ilçe SEO sayfaları ve içerikler ortalama 3 ila 5 iş günü içinde eksiksiz olarak yayına alınır. WhatsApp ve telefon numaralarınız test edilerek teslim edilir."
  },
  {
    q: "Web sitem Google'da ilçe aramalarında nasıl çıkar?",
    a: "Siteniz sadece ana sayfadan ibaret olmaz; her ilçe ve güzergah için özel optimize edilmiş URL'ler oluşturulur (örn: /kadikoy-evden-eve-nakliyat, /ankara-sehirlerarasi-nakliyat). Google botları bu sayfaları indekslediğinde, o ilçeden arayan müşteriler doğrudan sizin sayfanıza ulaşır."
  },
  {
    q: "Telefonumdan web sitesindeki yazıları veya araç resimlerini değiştirebilir miyim?",
    a: "Evet. Size vereceğimiz son derece kolay Türkçe yönetim panelinden yeni araçlarınızın fotoğraflarını, telefon numaranızı ve referanslarınızı 1 dakikada güncelleyebilirsiniz."
  },
  {
    q: "Alan adı ve hosting için her yıl ek ücret ödeyecek miyim?",
    a: "İlk 1 yıl boyunca .com/.com.tr alan adı, yüksek hızlı bulut hosting ve kurumsal e-postalarınız pakete dahildir. Sonraki yıllarda sadece yıllık standart yenileme bedeli uygulanır, sürpriz ücret çıkmaz."
  }
];

export default function WebSitesiServicePage() {
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
          <span className="text-[#0A1128] font-bold">Web Sitesi Hizmeti</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold mb-2">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>Nakliyat Web Sitesi Hizmeti (İç Sayfa URL SEO Uyumlu)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Firmanıza Özel Web Sitesi: İlçe URL Mimarisiyle Donatılmış Satış Makinesi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Sadece bir kartvizit değil; Google'da her ilçe aramasında ilk sayfalarda çıkan, mobil cihazlarda tek tıkla arama ve WhatsApp teklifi getiren anahtar teslim nakliyat sitesi.
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
            
            {/* BÖLÜM 1: BİLGİSAYAR & MOBİL EKRANI CANLI MOCKUP (TEMİZ BEYAZ KART) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Canlı Örnek Tasarım & Cihaz Uyumu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-[#0A1128]">
                    Masaüstü Bilgisayar & Akıllı Telefon Görünümü
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Masaüstünde kurumsal güven veren tasarım, telefonda tek tıkla arama ve WhatsApp teklifi.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700">
                  <Laptop className="w-4 h-4 text-[#F95700]" />
                  <span>Desktop + Mobil %100 Uyumlu</span>
                </div>
              </div>

              {/* BİLGİSAYAR + TELEFON ÇİFT CİHAZ MOCKUP ALANI */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
                
                {/* 1. MASAÜSTÜ BİLGİSAYAR MOCKUP (8/12) */}
                <div className="xl:col-span-8 rounded-2xl bg-white border border-slate-300 shadow-lg overflow-hidden">
                  
                  {/* Laptop Screen Top Header */}
                  <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex-1 max-w-xs bg-slate-900 rounded-lg px-3 py-1 flex items-center gap-1.5 text-[11px] text-slate-300 font-mono border border-slate-700 mx-auto truncate">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-semibold">https://</span>
                      <span className="text-white font-bold truncate">www.yildiznakliyat.com.tr</span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">⚡ 0.7 sn Hızlı</span>
                  </div>

                  {/* Web Sitesi İçeriği */}
                  <div className="p-4 sm:p-5 bg-white space-y-3.5">
                    
                    {/* Site Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#0A1128] text-[#F95700] flex items-center justify-center font-black text-sm shadow-xs">
                          YN
                        </div>
                        <div>
                          <span className="font-black text-xs sm:text-sm text-[#0A1128] block leading-tight">YILDIZ NAKLİYAT</span>
                          <span className="text-[9px] text-slate-400 font-semibold">Evden Eve & Şehirlerarası</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                          <PhoneCall className="w-3 h-3 text-[#F95700]" />
                          0850 308 XX XX
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 px-2 py-1 rounded-md shadow-xs">
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </span>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="rounded-xl bg-gradient-to-r from-[#0A1128] via-[#16213e] to-[#0A1128] text-white p-4 relative overflow-hidden">
                      <div className="relative z-10 max-w-xs space-y-1.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#F95700]/20 text-[#F95700] text-[9px] font-black border border-[#F95700]/30">
                          ★ 4.9 Puan · K3 Yetki Belgeli
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          İstanbul Evden Eve Nakliyat & Asansörlü Taşıma
                        </h4>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          Marangozlu söküm-montaj, sigortalı taşıma ve çift kat ambalajlama garantisi.
                        </p>
                        <div className="pt-1 flex items-center gap-2">
                          <span className="bg-[#F95700] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Fiyat Hesapla →
                          </span>
                          <span className="text-[9px] text-slate-300 font-medium">Sabit Fiyat</span>
                        </div>
                      </div>
                      <div className="absolute right-2 -bottom-2 text-white/10 pointer-events-none hidden sm:block">
                        <Truck className="w-24 h-24" />
                      </div>
                    </div>

                    {/* SEO İç Sayfa URL Yapısı Gösterimi (Kullanıcı İsteği) */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
                          🔗 Google SEO Uyumlu İç Sayfa URL Mimarisi
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Otomatik İlçe Sayfaları
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">/kadikoy-evden-eve-nakliyat</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">/besiktas-nakliyat</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">/sehirlerarasi-nakliyat</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[#F95700] font-bold">+36 İlçe URL</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. AKILLI TELEFON (SMARTPHONE) MOCKUP (4/12) */}
                <div className="xl:col-span-4 max-w-[260px] mx-auto w-full rounded-[32px] bg-slate-900 p-2.5 shadow-2xl border-4 border-slate-800 relative">
                  {/* Telefon Çentiği / Dynamic Island */}
                  <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>

                  {/* Telefon Ekranı */}
                  <div className="bg-white rounded-[22px] overflow-hidden text-slate-800 text-[11px] flex flex-col justify-between h-[360px] border border-slate-200">
                    
                    {/* Mobil Header */}
                    <div className="p-2.5 bg-[#0A1128] text-white flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-[#F95700] text-white font-black text-[10px] flex items-center justify-center">Y</span>
                        <span className="font-bold text-[10px]">Yıldız Nakliyat</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">Açık 7/24</span>
                    </div>

                    {/* Mobil İçerik */}
                    <div className="p-2.5 space-y-2 flex-1 overflow-hidden">
                      <div className="rounded-lg bg-orange-50 border border-orange-200 p-2 text-center space-y-0.5">
                        <span className="text-[9px] font-black text-[#C23E00] uppercase block">Hızlı Fiyat Teklifi</span>
                        <strong className="text-[11px] text-[#0A1128] block">30 Dakikada Kapınızda</strong>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-500">
                          <span>K3 Yetki Belgesi:</span>
                          <strong className="text-emerald-700">Var ✓</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Asansörlü Taşıma:</span>
                          <strong className="text-slate-800">15. Kata Kadar</strong>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Sigortalı Nakliyat:</span>
                          <strong className="text-slate-800">Tam Kapsam</strong>
                        </div>
                      </div>

                      <div className="text-[9px] text-center text-slate-400 font-medium">
                        ornek.com.tr mobil deneyimi
                      </div>
                    </div>

                    {/* Mobil Yapışkan Çağrı Butonları (En Çok İş Getiren Kısım) */}
                    <div className="p-2 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-1.5">
                      <div className="bg-[#F95700] text-white py-2 px-1 rounded-lg text-center font-black text-[10px] flex items-center justify-center gap-1 shadow-xs">
                        <PhoneCall className="w-3 h-3" />
                        <span>Hemen Ara</span>
                      </div>
                      <div className="bg-emerald-600 text-white py-2 px-1 rounded-lg text-center font-black text-[10px] flex items-center justify-center gap-1 shadow-xs">
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600">%100</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Mobil & Tablet Uyumu</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">3-5 Gün</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Teslim & Yayına Alma</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600">39 İlçe URL</span>
                  <span className="text-[10px] text-slate-500 block font-medium">SEO İç Sayfa Mimarisi</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600">Ücretsiz SSL</span>
                  <span className="text-[10px] text-slate-500 block font-medium">1 Yıl Hosting Dahil</span>
                </div>
              </div>

            </div>

            {/* BÖLÜM 2: ARTILARI VE EKSİLERİ (HİZMET ANALİZİ) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Karşılaştırma</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Özel Nakliyat Sitesi ile Sıradan Şablonların Karşılaştırması (Artıları / Eksikleri)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Neden sıradan bir web sitesi iş getirmezken, sektöre özel iç sayfa mimarili site telefonları çaldırır?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* ARTILARI */}
                <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200/80 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>Firmanıza Özel Nakliyat Sitemiz (Artıları)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>İç Sayfa URL Mimarisi:</strong> /kadikoy-nakliyat, /besiktas-nakliyat gibi her ilçe için ayrı sayfa sayesinde Google aramalarından doğrudan müşteri çeker.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>0.8 sn Ultra Hızlı Açılış:</strong> Mobil cihazlarda beklemeden açılır; müşteri kaçmadan tek tıkla arama yapar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>WhatsApp & Çağrı Dönüşüm Odaklı:</strong> Sayfanın her yerinde hazır hesaplama ve arama butonlarıyla gelen ziyaretçiyi işe çevirir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Kurumsal Prestij & Güven:</strong> K3 yetki belgesi, sigorta sertifikaları ve müşteri yorumlarıyla kurumsal kimliğinizi güçlendirir.</span>
                    </li>
                  </ul>
                </div>

                {/* EKSİLERİ / SIRADAN SİTELERİN HATALARI */}
                <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm border-b border-amber-200/80 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-black text-xs">
                      !
                    </div>
                    <span>Sıradan / Hazır Şablon Sitelerin Hataları (Eksileri)</span>
                  </div>
                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Tek Sayfadır, İlçe Aramalarında Çıkmaz:</strong> İç sayfaları olmadığı için Google ilçe aramalarında sitenizi indekslemez ve göstermez.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Yavaş Açılır (4-6 sn):</strong> Ağır hazır WordPress temaları telefonda geç açıldığı için müşteri beklemeden siteyi terk eder.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Dönüşüm Araçları Eksiktir:</strong> Fiyat hesaplama veya WhatsApp hızlı teklif butonu bulunmadığından giren ziyaretçi telefon etmez.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* BÖLÜM 3: PAKETLER VE FİYATLANDIRMA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Web Paketleri</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Firmanıza En Uygun Web Sitesi Paketini Seçin
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Tüm paketlerde ilk yıl alan adı, hosting, SSL ve teknik destek dahildir.
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
                        href={`https://wa.me/908503080000?text=${encodeURIComponent(`Merhaba, ${pkg.name} web sitesi paketi hakkında örnek demo ve bilgi almak istiyorum.`)}`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Canlı Demo İncelemesi</span>
                <h3 className="text-xl font-black text-white">Firmanıza Özel Web Sitenizi Hazırlayalım</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanızın adına hazır örnek şablonu ve ilçe SEO mimarisini hemen WhatsApp'tan gönderelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20nakliyat%20web%20sitesi%20demolarını%20görmek%20istiyorum." 
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