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
  TrendingUp,
  Award,
  Clock,
  Search,
  Navigation,
  Globe,
  Flame,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: 'İlçe Harita Liderliği',
    desc: 'Kendi ilçesinde Google Haritalar ilk 3 sırada yer almak isteyen nakliyeciler',
    price: '950 TL',
    period: '/ ay',
    isFeatured: false,
    badge: null,
    features: [
      'Google İşletme Profili (Google Business) Kurulumu ve Doğrulama',
      '1 İlçe Odaklı Harita SEO ve Konum Optimizasyonu',
      'Doğru Kategori Seçimi (Evden Eve Nakliyat, Şehirlerarası)',
      'Hizmet Alanları ve Mahalle Tanımlamaları',
      'Aylık Harita Görüntülenme & Arama Raporu'
    ]
  },
  {
    name: 'Bölgesel Harita Dominasyonu',
    desc: 'İstanbul veya büyükşehirde birden fazla ilçede haritada 1. sırada çıkmak isteyenler',
    price: '1.950 TL',
    period: '/ ay',
    isFeatured: true,
    badge: 'EN ÇOK TERCİH EDİLEN',
    features: [
      'Ana Konum + Çevre 5 İlçe Harita Eşleşmesi',
      'Google Haritalar Yerel Arama Sıralama Yükseltme',
      'Organik Müşteri Yorum Toplama Sistemi (Yıldız Puanı 4.9+)',
      'Yerel Dizin ve Navigasyon Kayıtları (Yandex, Apple Maps vb.)',
      'Fotoğraf, Logo ve Yetki Belgesi Zengin İçerik Yüklemesi',
      'Haftalık Arama ve Doğrudan Çağrı Raporu'
    ]
  },
  {
    name: 'Mega Şehir & Çoklu Şube Harita Ağı',
    desc: 'Büyük filolar ve birden fazla garaj/şube konumu olan kurumsal nakliyat firmaları',
    price: '3.450 TL',
    period: '/ ay',
    isFeatured: false,
    badge: 'FİLOLAR İÇİN',
    features: [
      'Tüm Şehir Geneli ve Çoklu Şube / Garaj Harita Ağ Kurulumu',
      'Google Harita Reklamları (Promoted Pin) Entegrasyonu',
      'Negatif ve Sahte Yorum Temizleme / İtiraz Desteği',
      '7/24 Harita Pozisyon İzleme ve Rakip Hamle Takibi',
      'Özel Yerel SEO Danışmanı ve Öncelikli Destek'
    ]
  }
];

const FAQS = [
  {
    q: 'Google Haritalar\'da üst sıralara çıkmak neden bu kadar önemli?',
    a: 'Telefonundan "en yakın nakliyeci" veya "Kadıköy evden eve nakliyat" araması yapan müşterilerin %78\'i doğrudan harita sonuçlarında ilk 3 sırada çıkan firmayı arar. Haritada üst sırada olmak, her gün ücretsiz ve komisyonsuz onlarca telefon çağrısı demektir.'
  },
  {
    q: 'Haritada yükselmek için fiziksel bir dükkan veya ofis şart mı?',
    a: 'Hayır. Google İşletme Profilinde "Hizmet Verilen Bölge" olarak kayıt açarak dükkan adresi göstermeden de bölgenizde haritalarda 1. sırada yer alabilirsiniz.'
  },
  {
    q: 'Rakiplerimin yüzlerce yorumu var, onları geçebilir miyim?',
    a: 'Google Haritalar sadece yorum sayısına değil; profil doluluğuna, doğru kategori eşleşmesine, yanıt hızına, fotoğraf güncelliğine ve yerel SEO sinyallerine bakar. Doğru optimizasyonla 2-4 hafta içinde rakiplerinizi geride bırakabilirsiniz.'
  },
  {
    q: 'Haritadan gelen aramalar için Google\'a para öder miyim?',
    a: 'Hayır. Harita optimizasyonu organik bir yerel SEO çalışmasıdır. Gelen yüzlerce çağrı ve yol tarifi tamamen ücretsizdir.'
  }
];

export default function HaritaSeoServicePage() {
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
          <span className="text-[#0A1128] font-bold">Harita SEO (Google Maps)</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Haritalar Yerel Arama Optimizasyonu</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Google Haritalar'da 1. Sırada Çıkın, Bölgenizdeki Müşterileri Toplayın
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Telefonundan "en yakın nakliyeci" arayan müşterilerin karşısına ilk siz çıkın. Reklam ücreti ödemeden, her hafta doğrudan telefonunuza gelen onlarca aramayla işlerinizi katlayın.
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
            
            {/* BÖLÜM 1: GOOGLE HARİTALAR CANLI SIRALAMA MOCKUP (TEMİZ BEYAZ KART - KOYU ARKA PLAN KALDIRILDI) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Canlı Google Maps Arama Simülasyonu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-[#0A1128]">
                    "İstanbul Nakliyeci" Aramasında 1. Sırada Siz Olun
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Haritada ilk 3'e giren firmalar, bölgedeki telefon aramalarının %78'ini tek başına toplar.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>+5 Sıra Yükselme Garantisi</span>
                </div>
              </div>

              {/* Google Maps Realistic Interface Mockup */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white text-slate-800 shadow-md overflow-hidden border border-slate-300">
                
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

                {/* Simulated Map Strip (Temiz Aydınlık Harita) */}
                <div className="h-24 bg-gradient-to-r from-emerald-50 via-blue-50 to-orange-50 relative overflow-hidden border-b border-slate-200 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
                  {/* Pin 1 (You - Big & Highlighted) */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="bg-[#0A1128] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md border border-[#F95700]">
                      ★ 1. SIRA SİZİN İŞLETME
                    </span>
                    <MapPin className="w-8 h-8 text-[#F95700] fill-[#F95700] -mt-1 drop-shadow-md" />
                  </div>
                  {/* Pin 2 & 3 (Competitors) */}
                  <div className="absolute left-1/4 top-3 opacity-50 flex flex-col items-center">
                    <span className="bg-slate-600 text-white text-[8px] px-1.5 rounded">Rakip B</span>
                    <MapPin className="w-5 h-5 text-slate-400 fill-slate-400" />
                  </div>
                  <div className="absolute right-1/4 top-4 opacity-50 flex flex-col items-center">
                    <span className="bg-slate-600 text-white text-[8px] px-1.5 rounded">Rakip C</span>
                    <MapPin className="w-5 h-5 text-slate-400 fill-slate-400" />
                  </div>
                </div>

                {/* Local 3-Pack Results List */}
                <div className="p-3 sm:p-4 space-y-3">
                  
                  {/* 1. SIRA: SİZİN İŞLETMENİZ (VURGULANMIŞ KUTUCUK) */}
                  <div className="rounded-2xl border-2 border-[#F95700] bg-orange-50/20 p-3.5 sm:p-4 shadow-xs relative space-y-2.5 transition-all">
                    
                    {/* Yükseliş & 1. Sıra Rozeti */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>1. SIRA (▲ +5 Sıra Yükseldi!)</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        <Flame className="w-3 h-3 text-[#F95700]" />
                        <span>En Çok Çağrı Alan Konum</span>
                      </div>
                    </div>

                    {/* İşletme Başlığı & Yıldızlar */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base">
                          Yıldız Evden Eve Nakliyat & Asansörlü Taşıma
                        </h3>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          ✓ Onaylı
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="font-black text-amber-600 flex items-center gap-0.5">
                          4.9 <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        </span>
                        <span className="text-slate-500">(148 Yorum)</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-600 font-medium">Evden Eve Nakliyat Şirketi</span>
                      </div>
                    </div>

                    {/* Konum ve Çalışma Saatleri */}
                    <div className="text-xs text-slate-600 space-y-0.5">
                      <p>📍 Kadıköy / İstanbul · 15 yılı aşkın tecrübe</p>
                      <p className="text-emerald-700 font-bold">● Açık 24 saat · (0850) 308 XX XX</p>
                    </div>

                    {/* Hızlı Aksiyon Butonları */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="bg-[#F95700] hover:bg-[#e04d00] text-white py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                        <PhoneCall className="w-3 h-3" />
                        <span>Hemen Ara</span>
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
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600">%78</span>
                  <span className="text-[10px] text-slate-500 block font-medium">İlk 3'e Tıklama Oranı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">0 TL</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Tıklama Başı Maliyet</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600">7 - 14 Gün</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Sıralama Yükselme</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600">Mavi Rozet</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Resmi Doğrulama</span>
                </div>
              </div>

            </div>

            {/* BÖLÜM 2: ARTILARI VE EKSİLERİ (HİZMET ANALİZİ) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Hizmet Analizi</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Google Harita SEO'nun Artıları ve Dikkat Edilmesi Gerekenler
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Yerel aramalarda 1. sıraya yerleşmenin faydaları ve dikkat edilmesi gereken noktalar.
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
                      <span><strong>Doğrudan Telefon Çağrısı:</strong> Müşteri web sitesine bile girmeden haritadaki "Ara" butonuna basıp sizi arar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>0 TL Reklam Maliyeti:</strong> Haritadan gelen yüzlerce arama için Google'a tek bir kuruş tıklama parası ödemezsiniz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Bölgesel Güven:</strong> Yüksek puanlı ve onaylı harita profili müşteri gözünde firmanızı o bölgenin en yetkili nakliyecisi yapar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Hızlı Yükselme:</strong> Web SEO'suna göre haritalarda doğru adımlarla 1-2 hafta içinde ilk 3'e çıkmak mümkündür.</span>
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
                      <span><strong>Yorum Yönetimi Önemlidir:</strong> 1 yıldızlı kötü yorumlar puanı düşürebilir; düzenli memnun müşteri yorumu toplanmalıdır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Mesafe Etkisi:</strong> Google arayan kişinin konumuna göre sonuç verir; bu nedenle çevre ilçelere hizmet verildiği doğru kodlanmalıdır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Profil Güncelliği:</strong> Çalışma saatleri ve fotoğraflar güncel tutulmazsa Google profili geriye itebilir.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* BÖLÜM 3: PAKETLER VE FİYATLANDIRMA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Harita Paketleri</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Haritada Rakiplerinizin Önüne Geçin
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  İlk 3 sırada yer alarak bölgenizdeki evden eve taşıma taleplerini toplamaya başlayın.
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
                        href={`https://wa.me/908503080000?text=${encodeURIComponent(`Merhaba, ${pkg.name} harita SEO paketi hakkında bilgi almak istiyorum.`)}`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Konum Analizi</span>
                <h3 className="text-xl font-black text-white">Google Harita Konumunuzu İnceleyelim</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanızın Google Haritalar'daki mevcut konumunu ve bölgenizdeki ilk 3 rakibin durumunu ücretsiz analiz edelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20Google%20Harita%20SEO%20analizi%20için%20yazıyorum." 
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