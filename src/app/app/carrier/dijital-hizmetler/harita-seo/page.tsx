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
  MapPin,
  Check,
  X,
  ChevronDown,
  Navigation,
  Globe,
  TrendingUp,
  Award,
  Clock,
  Search,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Harita Kurulum & Onay",
    desc: "Google Haritalar kaydı hiç olmayan veya onaylanamayanlar için",
    price: "1.200 TL",
    period: "tek seferlik",
    isFeatured: false,
    badge: null,
    features: [
      "Google Business Profil Resmi Açılışı",
      "Doğru Pin Konumu & K3 Hizmet Alanı Tanımı",
      "Kategori Optimizasyonu (Evden Eve Nakliyat)",
      "Logo, Araç & Ambalajlama Fotoğraf Yüklemesi",
      "Hızlı Doğrulama Süreç Yönetimi"
    ]
  },
  {
    name: "Harita 1. Sıra Yükseltme",
    desc: "İl ve ilçesinde haritalarda ilk 3 sıra (Google 3-Pack) hedefleyenler",
    price: "2.200 TL",
    period: "tek seferlik",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Yerel Harita SEO Algoritma Optimizasyonu",
      "İlçe Bazlı Anahtar Kelime Yerleşimi",
      "Müşteri Yorum Toplama Şablonu & QR Kod",
      "Rakipleri Geride Bırakan Hizmet Etiketleri",
      "Doğrudan Telefon Arama Çağrısı Artışı",
      "1 Ay Boyunca Sıralama Takibi & Destek"
    ]
  },
  {
    name: "Sürekli Harita Yönetimi & Koruma",
    desc: "Zirveyi bırakmak istemeyen ve düzenli yorum akışı isteyenler",
    price: "1.000 TL",
    period: "/ aylık",
    isFeatured: false,
    badge: "SÜREKLİ BÜYÜME",
    features: [
      "Haftalık Düzenli Gönderi & Fotoğraf Paylaşımı",
      "Olumsuz Yorum Kriz & Silme Yönetimi",
      "Sahte & Spam Rakip Haritalarını Google'a Şikayet",
      "Aylık Arama & Çağrı Performans Raporu",
      "Öncelikli 7/24 Harita Danışmanı"
    ]
  }
];

const FAQS = [
  {
    q: "Google Haritalarda 1. sıraya çıkmam ne kadar sürer?",
    a: "Doğrulama ve yerel optimizasyon çalışmalarımızın ardından ortalama 7 ila 14 gün içinde işletmeniz bulunduğunuz ilçe ve çevre lokasyonlarda ilk 3 sıraya (Google Maps 3-Pack) yükselir."
  },
  {
    q: "Harita kaydım askıya alındı (suspended), kurtarabilir misiniz?",
    a: "Evet! Google yönergelerine uygun resmi itiraz dosyası hazırlayarak, vergi levhası ve yetki belgelerinizle Google Türkiye destek ekibiyle iletişime geçiyor ve askıdaki profillerimizi yeniden aktif ediyoruz."
  },
  {
    q: "Arayan müşteriler doğrudan benim telefonuma mı gelir?",
    a: "Evet. Harita üzerindeki 'Ara' butonu doğrudan sizin belirlediğiniz şirket telefonunuza veya cep numaranıza bağlanır. Hiçbir aracı veya komisyon olmadan müşterilerle doğrudan anlaşırsınız."
  },
  {
    q: "Sahte rakip haritaları şikayet edip kaldırtabilir miyiz?",
    a: "Bölgenizde fiziksel varlığı veya yetki belgesi olmayan, sadece spam arama çekmek için açılmış sahte harita profillerini tespit edip Google kuralları çerçevesinde şikayet ederek kaldırtıyoruz; böylece gerçek sıralama size kalıyor."
  }
];

export default function HaritaSeoPage() {
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
          <span className="text-[#0A1128] font-bold">Harita SEO (Google Maps)</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Haritalarda Yerel Liderlik</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Google Haritalarda 1. Sıraya Çıkın, Telefonlarınız Hiç Susmasın
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            İlçenizde veya şehrinizde nakliyeci arayan yüzlerce müşteri doğrudan haritadaki 'Ara' butonuna basarak yetkili telefonunuza ulaşsın.
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
            
            {/* ── BÖLÜM 1: GOOGLE HARİTALAR CANLI SIRALAMA MOCKUP ── */}
            <div className="bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0B132B] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Canlı Google Maps Arama Simülasyonu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-white">
                    "İstanbul Nakliyeci" Aramasında 1. Sırada Siz Olun
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Haritada ilk 3'e giren firmalar, bölgedeki telefon aramalarının %78'ini tek başına toplar.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>+5 Sıra Yükselme Garantisi</span>
                </div>
              </div>

              {/* Google Maps Realistic Interface Mockup */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-300">
                
                {/* Search Bar */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 flex items-center gap-2 shadow-2xs">
                    <Search className="w-4 h-4 text-[#4285F4]" />
                    <span className="text-xs font-bold text-slate-800">istanbul nakliyeci</span>
                    <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">Haritalarda Ara</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-200/70 px-2.5 py-2 rounded-xl">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>Kadıköy / İst</span>
                  </div>
                </div>

                {/* Simulated Map Strip */}
                <div className="h-20 bg-slate-100 relative overflow-hidden border-b border-slate-200 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
                  {/* Pin 1 (You - Big & Highlighted) */}
                  <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <span className="bg-[#111E38] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md border border-orange-500">
                      ★ 1. SIRA SİZİN İŞLETME
                    </span>
                    <MapPin className="w-8 h-8 text-[#F95700] fill-[#F95700] -mt-1 drop-shadow-md" />
                  </div>
                  {/* Pin 2 & 3 (Competitors) */}
                  <div className="absolute left-1/4 top-3 opacity-40 flex flex-col items-center">
                    <span className="bg-slate-700 text-white text-[8px] px-1.5 rounded">Rakip B</span>
                    <MapPin className="w-5 h-5 text-slate-500 fill-slate-400" />
                  </div>
                  <div className="absolute right-1/4 top-4 opacity-40 flex flex-col items-center">
                    <span className="bg-slate-700 text-white text-[8px] px-1.5 rounded">Rakip C</span>
                    <MapPin className="w-5 h-5 text-slate-500 fill-slate-400" />
                  </div>
                </div>

                {/* Local 3-Pack Results List */}
                <div className="p-3 sm:p-4 space-y-3">
                  
                  {/* 1. SIRA: SİZİN İŞLETMENİZ (VURGULANMIŞ KUTUCUK) */}
                  <div className="rounded-2xl border-2 border-[#F95700] bg-orange-50/40 p-3.5 sm:p-4 shadow-sm relative space-y-2.5 transition-all">
                    
                    {/* Yükseliş & 1. Sıra Rozeti */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>1. SIRA (▲ +5 Sıra Yükseldi!)</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-[#F95700]" />
                        <span>En Çok Aranan İşletme</span>
                      </div>
                    </div>

                    {/* İşletme Başlık & Puan */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-sm sm:text-base text-[#111E38]">
                          ⭐ SİZİN İŞLETMENİZ · Evden Eve Nakliyat
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="font-bold text-amber-600 flex items-center">
                          4.9 ★★★★★
                        </span>
                        <span className="text-slate-400">(198 Gerçek Yorum)</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">Doğrulanmış İşletme</span>
                      </div>
                    </div>

                    {/* Açıklama & Konum */}
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Kadıköy, İstanbul ve Çevresi · <strong>Şimdi Açık (24 Saat)</strong></span>
                      </p>
                      <p className="text-slate-500 pl-5">
                        Hizmetler: Sigortalı Taşıma, Asansörlü Araç Filosu, Şehirlerarası Nakliye
                      </p>
                    </div>

                    {/* Aksiyon Butonları (Google Maps Tarzı) */}
                    <div className="pt-2 border-t border-orange-200/70 flex flex-wrap items-center gap-2">
                      <div className="flex-1 min-w-[130px] bg-[#F95700] hover:bg-[#E04D00] text-white py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>📞 Ara (0850 308...)</span>
                      </div>
                      <div className="bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs">
                        <Navigation className="w-3 h-3 text-blue-600" />
                        <span>Yol Tarifi</span>
                      </div>
                      <div className="bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-2xs">
                        <Globe className="w-3 h-3 text-slate-600" />
                        <span>Web Sitesi</span>
                      </div>
                    </div>

                    {/* Haftalık İstatistik Notu */}
                    <div className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 p-2 rounded-lg flex items-center justify-between">
                      <span>📊 Son 7 günde haritadan doğrudan gelen arama:</span>
                      <strong className="text-emerald-900 font-black text-xs">184 Çağrı</strong>
                    </div>

                  </div>

                  {/* 2. SIRA: RAKİP İŞLETME (SOLUK / ARKA PLANDA) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 opacity-60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-700">2. Rakip Nakliyat A</div>
                      <div className="text-[11px] text-slate-500">3.8 ★★★☆☆ (19 Yorum) · Kadıköy</div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      Haftada ~15 arama
                    </div>
                  </div>

                  {/* 3. SIRA: RAKİP İŞLETME (SOLUK) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 opacity-40 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-700">3. Rakip Nakliyat B</div>
                      <div className="text-[11px] text-slate-500">4.1 ★★★★☆ (28 Yorum) · Üsküdar</div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400">
                      Haftada ~10 arama
                    </div>
                  </div>

                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-400">%78</span>
                  <span className="text-[10px] text-slate-400 block font-medium">İlk 3'e Tıklama Oranı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">0 TL</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Tıklama Başı Maliyet</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-400">7 - 14 Gün</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Sıralama Yükselme</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-400">Mavi Rozet</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Resmi Doğrulama</span>
                </div>
              </div>

            </div>

            {/* ── BÖLÜM 2: ÖNCESİ / SONRASI KARŞILAŞTIRMASI ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">İş Hacminizdeki Değişim</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Öncesi vs. Harita SEO Sonrası
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Evini taşıtacak insanların %80'i önce Google Haritalar'dan en yakın ve en yüksek puanlı nakliyeciyi arar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ÖNCESİ */}
                <div className="rounded-2xl bg-red-50/70 border-2 border-red-200/80 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b border-red-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-200/80 flex items-center justify-center text-red-700 font-black text-xs">
                      ✕
                    </div>
                    <span>Harita SEO Yapılmamış İşletme</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Haritada 15. sayfada veya kaydı hiç yok; yakınınızdaki müşteri sizi göremez.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Yanlış kategori ve eksik anahtar kelimeler yüzünden Google haritada göstermez.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Askıya alınmış (suspended) veya doğrulanamamış hesap riski.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Aylık doğrudan arama:</strong> Yalnızca 0 - 3 tesadüfi çağrı.</span>
                    </li>
                  </ul>
                </div>

                {/* SONRASI */}
                <div className="rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>TaşınTeklif ile 1. Sıra Harita SEO Sonrası</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>İl ve ilçenizde nakliye arayan herkesin karşısına 1. sırada ve harita pininizle çıkarsınız.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Müşteriler doğrudan 'Ara' butonuna basar; komisyonsuz, sıcak müşteri yetkilinize bağlanır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>5 yıldızlı gerçek yorum toplama QR sistemiyle güvenilirlik en tepeye çıkar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Aylık doğrudan arama:</strong> 60 - 150+ karlı doğrudan taşıma çağrısı!</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ── BÖLÜM 3: HARİTA SEO'DA NELER YAPIYORUZ? (4 TEMEL GÜÇ) ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1128]">Harita SEO Hizmetimizde Neler Yapıyoruz?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Profil Onayı & Askı Kurtarma</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Google İşletme profilinizi resmi belgelerle onaylatıyor, askıdaki hesapları hızlıca açtırıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F95700] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">İlçe İlçe Hizmet Alanı Tanımı</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Yalnızca dükkanın olduğu sokakta değil, hedeflediğiniz tüm çevre ilçelerde haritada çıkmanızı sağlıyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Otomatik 5 Yıldız Yorum Sistemi</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Taşıma bittiğinde müşterilerinize tek tıkla 5 yıldız vermesini sağlayan özel SMS & WhatsApp bağlantıları kuruyoruz.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Spam Rakip Haritalarını Temizleme</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Bölgenizde korsan şekilde sahte adreslerle açılmış rakip haritalರನ್ನು tespit edip sildiriyoruz.
                  </p>
                </div>
              </div>
            </div>

            {/* ── BÖLÜM 4: PAKETLER & FİYATLANDIRMA ── */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Fiyatlar</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Harita SEO Paketleri
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
                        href={`https://wa.me/908503080000?text=Merhaba,%20${encodeURIComponent(pkg.name)}%20harita%20paketi%20hakkında%20bilgi%20almak%20istiyorum.`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Harita Analizi</span>
                <h3 className="text-xl font-black text-white">Haritanızı Birlikte İnceleyelim</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanızın Google Haritalar'daki mevcut konumunu ve rakiplerinizi ücretsiz analiz edelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20harita%20SEO%20ücretsiz%20analiz%20için%20yazıyorum." 
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
