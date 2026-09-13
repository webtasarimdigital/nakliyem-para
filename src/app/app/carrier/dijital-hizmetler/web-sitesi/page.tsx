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
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Başlangıç Web",
    desc: "Bireysel ve küçük ölçekli nakliyeciler için",
    price: "3.500 TL",
    period: "tek seferlik",
    isFeatured: false,
    badge: null,
    features: [
      "5 Sayfa Özel Nakliyat Tasarımı",
      ".com / .com.tr Alan Adı (1 Yıl Dahil)",
      "Yüksek Hızlı SSL Korumalı Hosting",
      "WhatsApp & Tek Tıkla Ara Butonları",
      "Mobil, Tablet & Masaüstü %100 Uyum",
      "Temel Google Harita Entegrasyonu"
    ]
  },
  {
    name: "Profesyonel Web",
    desc: "Şehirlerarası & evden eve çalışan nakliyat firmaları için",
    price: "6.500 TL",
    period: "tek seferlik",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "10 Sayfa Genişletilmiş Kurumsal Tasarım",
      "Müşteri Canlı Fiyat Hesaplama Formu",
      "İl & İlçe Nakliyat Rota Sayfaları",
      "Google SEO & Hız Optimizasyonu (PageSpeed 98+)",
      "Kurumsal E-Posta Hesapları (info@firmaniz.com)",
      "Müşteri Yorumları & Araç Filosu Galerisi",
      "1 Yıl Ücretsiz Teknik Destek & Yedekleme"
    ]
  },
  {
    name: "Kurumsal VIP Filo",
    desc: "Büyük filolar ve bölgesinde lider lojistik markaları",
    price: "12.000 TL",
    period: "tek seferlik",
    isFeatured: false,
    badge: "ÖZEL ÇÖZÜM",
    features: [
      "Sınırsız Sayfa & Dinamik Blog Yönetimi",
      "81 İl ve Yoğun Güzergah İniş Sayfaları (Landing Pages)",
      "Gelişmiş Teklif Takip & SMS Bildirim Paneli",
      "Google Ads & Harita Reklam Altyapısı",
      "Özel Tanıtım Videosu & Drone Çekimi Entegrasyonu",
      "Öncelikli 7/24 VIP Danışman"
    ]
  }
];

const FAQS = [
  {
    q: "Web sitem ne kadar sürede tamamlanır ve yayına alınır?",
    a: "Firma bilgilerinizi ve fotoğraflarınızı aldıktan sonra ortalama 3 iş günü içinde siteniz tasarımı, alan adı ve sunucu kurulumu tamamlanarak canlıya alınır."
  },
  {
    q: "Siteden gelen müşteri talepleri nereye düşer?",
    a: "Sitedeki 'Hemen Ara' ve 'WhatsApp ile Teklif Al' butonları doğrudan yetkili cep telefonunuza yönlendirilir. Ayrıca siteden teklif formu dolduran müşterilerin bilgileri anında e-postanıza ve WhatsApp'ınıza iletilir; aracı komisyonu olmadan görüşürsünüz."
  },
  {
    q: "Domain (alan adı) ve hosting için her yıl fahiş ücret öder miyim?",
    a: "Hayır. İlk yıl domain, yüksek hızlı bulut hosting ve SSL sertifikası tamamen ücretsizdir. 2. yıldan itibaren sadece standart yıllık sunucu ve alan adı yenileme maliyeti alınır, gizli masraf yoktur."
  },
  {
    q: "Kendi araç fotoğraflarımı ve logomu ekleyebilir miyim?",
    a: "Kesinlikle! Kendi araç filonuzu, asansörlü taşıma sisteminizi, ambalajlama fotoğraflarınızı ve logonuzu profesyonelce yerleştiriyoruz. Eğer logonuz yoksa modern bir nakliyat logosunu da hediye olarak hazırlıyoruz."
  }
];

export default function SubServicePage() {
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
          <span className="text-[#0A1128] font-bold">Web Sitesi Hizmeti</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-[#F95700] border border-orange-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nakliyecilere Özel Dönüşüm Odaklı Web Çözümleri</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Nakliyat Firmanıza Özel Profesyonel Web Sitesi
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Google uyumlu, telefon trafiği çeken, 1 saniyede açılan ve müşterinin doğrudan cep telefonunuzu aramasını sağlayan anahtar teslim nakliye sitesi.
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
            
            {/* ── BÖLÜM 1: BİLGİSAYAR & MOBİL EKRANI CANLI MOCKUP ── */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Canlı Örnek Şablon
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-white">
                    Müşterilerinizin Göreceği Modern Deneyim
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Masaüstünde kurumsal güven, telefonda tek tıkla arama & WhatsApp teklifi.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200">
                  <Laptop className="w-4 h-4 text-orange-400" />
                  <span>Desktop + Mobil Uyumlu</span>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div className="relative pt-2 pb-4">
                
                {/* 1. MASAÜSTÜ EKRANI (LAPTOP BROWSER) */}
                <div className="w-full max-w-2xl mx-auto rounded-2xl bg-[#1E293B] border border-slate-700 shadow-2xl overflow-hidden">
                  
                  {/* Browser Window Header */}
                  <div className="bg-slate-800/90 px-4 py-2.5 border-b border-slate-700 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Address Bar */}
                    <div className="flex-1 max-w-sm bg-slate-900/90 rounded-lg px-3 py-1 flex items-center gap-2 text-[11px] text-slate-300 font-mono border border-slate-700/60 mx-auto">
                      <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400 font-semibold">https://</span>
                      <span className="truncate text-slate-200 font-semibold">www.yildiznakliyat.com.tr</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-semibold hidden sm:block">
                      ⚡ 0.7s
                    </div>
                  </div>

                  {/* Browser Body / Web Site İçeriği */}
                  <div className="bg-white text-slate-800 p-4 sm:p-6 space-y-4">
                    
                    {/* Site Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#111E38] text-[#F95700] flex items-center justify-center font-black text-sm">
                          Y
                        </div>
                        <div>
                          <div className="font-black text-xs sm:text-sm text-[#111E38] leading-tight">YILDIZ NAKLİYAT</div>
                          <div className="text-[9px] text-slate-400 font-semibold">Şehirlerarası & Evden Eve</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <PhoneCall className="w-3 h-3 text-[#F95700]" />
                          <span>0850 308 XX XX</span>
                        </div>
                        <div className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </div>
                      </div>
                    </div>

                    {/* Site Hero Banner */}
                    <div className="rounded-xl bg-gradient-to-r from-[#111E38] to-[#1E3A8A] text-white p-4 sm:p-5 relative overflow-hidden">
                      <div className="relative z-10 max-w-sm space-y-2">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[10px] font-bold">
                          ★ 4.9 Puan · 420+ Memnun Taşıma
                        </div>
                        <h3 className="text-sm sm:text-lg font-black text-white leading-tight">
                          İstanbul Evden Eve Nakliyat & Asansörlü Taşıma
                        </h3>
                        <p className="text-[11px] text-slate-200 leading-snug">
                          K3 Yetki Belgeli, sigortalı ve marangozlu taşımacılıkta 15 yıllık tecrübe.
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <span className="bg-[#F95700] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                            Fiyat Hesapla
                          </span>
                          <span className="text-[10px] text-slate-300 font-medium">
                            Sabit Fiyat Garantisi
                          </span>
                        </div>
                      </div>

                      {/* Dekoratif Kamyon İkonu */}
                      <div className="absolute right-2 -bottom-2 text-white/10 hidden sm:block pointer-events-none">
                        <Truck className="w-32 h-32" />
                      </div>
                    </div>

                    {/* Site Hızlı Hesaplama Kutucuğu */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Nereden</span>
                        <strong className="text-slate-800 text-xs font-bold">Kadıköy</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Nereye</span>
                        <strong className="text-slate-800 text-xs font-bold">İzmir</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-2xs">
                        <span className="text-[10px] text-slate-400 block font-medium">Oda Sayısı</span>
                        <strong className="text-[#F95700] text-xs font-bold">3+1 Daire</strong>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. MOBİL EKRANI (OVERLAPPING IPHONE MOCKUP) */}
                <div className="absolute -bottom-2 sm:-bottom-4 -right-1 sm:right-6 w-44 sm:w-56 rounded-3xl bg-[#090D16] p-2 border-2 border-slate-600 shadow-2xl z-20">
                  {/* Phone Notch */}
                  <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-1.5" />
                  
                  {/* Phone Screen Content */}
                  <div className="bg-white rounded-2xl p-2.5 space-y-2 text-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="font-black text-[10px] text-[#111E38]">YILDIZ NAKLİYAT</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    <div className="bg-blue-900 text-white rounded-lg p-2 text-center space-y-1">
                      <div className="text-[9px] font-bold text-orange-300">İstanbul Nakliyat</div>
                      <div className="text-[10px] font-black leading-tight">Asansörlü & Sigortalı</div>
                    </div>

                    {/* Sabit Arama Butonları */}
                    <div className="space-y-1 pt-1">
                      <div className="w-full bg-[#F95700] text-white py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                        <PhoneCall className="w-2.5 h-2.5" />
                        <span>Hemen Ara: 0850...</span>
                      </div>
                      <div className="w-full bg-emerald-500 text-white py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs">
                        <MessageCircle className="w-2.5 h-2.5" />
                        <span>WhatsApp Teklif</span>
                      </div>
                    </div>

                    <div className="text-center pt-1 border-t border-slate-100">
                      <span className="text-[8px] font-bold text-slate-400">⚡ Google Hızı: 99/100</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Alt Bilgi Şeridi */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-400">0.8 sn</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Açılış Hızı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">%100</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Mobil Uyumlu</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-400">0 Komisyon</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Doğrudan Çağrı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-400">SSL + Domain</span>
                  <span className="text-[10px] text-slate-400 block font-medium">1 Yıl Dahil</span>
                </div>
              </div>

            </div>

            {/* ── BÖLÜM 2: ÖNCESİ / SONRASI KARŞILAŞTIRMASI ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Gerçek Farkı Görün</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Öncesi vs. TaşınTeklif Web Sitesi Sonrası
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Web sitesi sadece bir kartvizit değildir; firmanızın en çok müşteri getiren 7/24 satış temsilcisidir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ÖNCESİ (KÖTÜ SENARYO) */}
                <div className="rounded-2xl bg-red-50/70 border-2 border-red-200/80 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b border-red-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-200/80 flex items-center justify-center text-red-700 font-black text-xs">
                      ✕
                    </div>
                    <span>Web Sitesi Olmayan / Eski Siteli Firma</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Müşteri adınızı Google'da arayınca bulamaz, korsan nakliyeci sanarak vazgeçer.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Fiyat kıran aracı komisyonculara ve spotçulara mecbur kalırsınız.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Kendi araç filonuzu, asansörünüzü ve referanslarınızı gösteremezsiniz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Aylık doğrudan müşteri:</strong> Yalnızca 1 - 3 eş-dost referansı.</span>
                    </li>
                  </ul>
                </div>

                {/* SONRASI (BAŞARILI SENARYO) */}
                <div className="rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>TaşınTeklif ile Profesyonel Web Sitesi</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Google'da .com alan adınızla en üst düzey kurumsal güven oluşturursunuz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Aracı komisyonu ödemeden müşteriler doğrudan WhatsApp'ınıza ve telefonunuza düşer.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Fiyat hesaplayıcı ile müşteri ortalama bütçesini bilerek sizi arar, pazarlık kısalır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Aylık doğrudan müşteri:</strong> 25 - 45+ doğrudan ve karlı taşıma işi!</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ── BÖLÜM 3: NASIL ÇALIŞIR? (3 GÜNLÜK SÜREÇ) ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Hızlı & Zahmetsiz</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  3 Günde Sitenizi Nasıl Canlıya Alıyoruz?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 relative">
                  <div className="w-8 h-8 rounded-xl bg-[#111E38] text-white flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-[#0A1128]">Bilgileri Alıyoruz</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Firmanızın adı, iletişim numaralarınız ve varsa araç fotoğraflarınızı WhatsApp üzerinden alıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 relative">
                  <div className="w-8 h-8 rounded-xl bg-[#F95700] text-white flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-[#0A1128]">Tasarım & Kurulum</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Özel nakliyat şablonunuzu, fiyat hesaplayıcıyı, rotaları ve SEO altyapısını eksiksiz hazırlıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 relative">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-[#0A1128]">Yayın & Çağrı Başlasın</h4>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed">
                    Domain ve SSL ayarlarını yaparak sitenizi canlıya alıyoruz; Google Haritalar kaydınıza bağlıyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* ── BÖLÜM 4: PAKETLER & FİYATLANDIRMA ── */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Fiyatlar</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  İhtiyacınıza Uygun Web Sitesi Paketi
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
                        href={`https://wa.me/908503080000?text=Merhaba,%20${encodeURIComponent(pkg.name)}%20web%20sitesi%20paketi%20hakkında%20bilgi%20almak%20istiyorum.`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Ön Danışmanlık</span>
                <h3 className="text-xl font-black text-white">Sitenizi Birlikte Planlayalım</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanız için en uygun alan adını ve şablonu belirleyelim, aynı gün çalışmaya başlayalım.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20web%20sitesi%20hizmeti%20hakkında%20danışmanlık%20almak%20istiyorum." 
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
