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
  Megaphone,
  Check,
  X,
  ChevronDown,
  TrendingUp,
  Award,
  Clock,
  Search,
  Flame,
  Target,
  BarChart3,
  Percent,
  Coins
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Başlangıç Ads Yönetimi",
    desc: "Düşük bütçeyle aynı gün telefonunun çalmasını isteyenler",
    price: "750 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: null,
    features: [
      "Google Ads Kurumsal Hesap Kurulumu",
      "1 Şehir / 10 Hedef Arama Grubu",
      "450+ Negatif Kelime Filtresi (Gereksiz Tıklama Yok)",
      "Tıkla-Ara (Call-Only) Mobil Kampanya",
      "Haftalık Harcama & Arama Özeti"
    ]
  },
  {
    name: "Profesyonel Ads Yönetimi",
    desc: "Haftanın her günü düzenli ev ve ofis taşıma bağlayan firmalar",
    price: "1.500 TL",
    period: "/ ay (yönetim)",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Gelişmiş Tıklama Başı Maliyet Düşürme (Kalite Puanı 10/10)",
      "Şehirlerarası Rota Hedeflemesi (Boş Dönüş Yakalama)",
      "Dönüşüm Takibi (WhatsApp & Telefon Aramaları)",
      "A/B Reklam Metin Testleri & Tıklama Artırıcılar",
      "Sahte Tıklama & Rakip IP Engelleme Koruması",
      "Bütçe İsrafını Önleme Garantisi"
    ]
  },
  {
    name: "Filo & VIP Ads Yönetimi",
    desc: "Yüksek bütçeli, çok araçlı büyük nakliyat ve lojistik filoları",
    price: "2.500 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: "MAKSİMUM HACİM",
    features: [
      "Sınırsız Şehir & Güzergah Kampanya Yönetimi",
      "Yapay Zeka Destekli Akıllı Teklif Stratejisi",
      "Gün İçi Saat Bazlı Bütçe Optimizasyonu",
      "Öncelikli 7/24 Google Ads Hesap Uzmanı",
      "Anlık Çağrı Kayıtları & ROI Analiz Raporu"
    ]
  }
];

const FAQS = [
  {
    q: "Reklam bütçesini kime ödüyorum?",
    a: "Reklam bütçenizi doğrudan kendi kredi kartınızla Google'a ödersiniz. Biz yalnızca profesyonel hesap kurulumu, negatif kelime filtrelemesi ve bütçenizin israf olmadan en çok müşteriye dönüşmesi için aylık yönetim hizmeti sunarız."
  },
  {
    q: "Reklamlarım ne zaman başlar ve telefonum ne zaman çalar?",
    a: "Hesap kurulumu tamamlandıktan sonra aynı gün (ortalama 2-3 saat içinde) reklamlarınız Google'da en tepede çıkmaya başlar ve ilk telefon çağrılarınızı almaya başlarsınız."
  },
  {
    q: "Rakiplerim reklamıma bilerek tıklayıp bütçemi bitirebilir mi?",
    a: "Hayır. Google'ın gelişmiş sahte tıklama (click fraud) koruma algoritmalarının yanı sıra, şüpheli rakip IP adreslerini reklam hedeflemesinden hariç tutarak bütçenizi koruma altına alıyoruz."
  },
  {
    q: "Negatif anahtar kelime neden bu kadar önemlidir?",
    a: "'Nakliye iş ilanları', 'nakliyat kamyonu oyunu', 'bedava nakliye' gibi nakliyatla ilgisiz veya iş arayan kişilerin aramalarını engelleyerek bütçenizin tek bir kuruşunun dahi boşa gitmesini önlüyoruz."
  }
];

export default function GoogleReklamlariPage() {
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
          <span className="text-[#0A1128] font-bold">Google Reklamları (Ads)</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-purple-600" />
            <span>Google Ads Nakliyat Reklam Yönetimi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Google'da Sponsorlu 1. Sırada Çıkın, Bugün Telefonunuz Çalsın
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Bütçenizi gereksiz tıklamalara kaptırmadan, sadece eşya taşıtmak isteyen gerçek müşterileri en düşük maliyetle doğrudan cep telefonunuza bağlayın.
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
            
            {/* ── BÖLÜM 1: GOOGLE ADS SPONSORLU 1. SIRA MOCKUP ── */}
            <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#1E1B4B] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 border border-purple-400/30 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    Canlı Sponsorlu Reklam Simülasyonu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-white">
                    Arama Yapanın Karşısına İlk Çıkan Siz Olun
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    "Acil nakliye", "evden eve taşıma" arayanlar doğrudan 'Hemen Ara' butonuna basarak size ulaşır.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-purple-400/10 border border-purple-400/30 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-300">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Aynı Gün Çağrı Garantisi</span>
                </div>
              </div>

              {/* Google Ads Mockup Card */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white text-slate-800 shadow-2xl overflow-hidden border border-slate-300">
                
                {/* Search Bar */}
                <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-300 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-2xs">
                    <Search className="w-4 h-4 text-[#4285F4]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">acil nakliye kamyonet istanbul ankara</span>
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 hidden sm:inline">
                    En Çok Kazandıran Kelime
                  </span>
                </div>

                {/* Ads Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* 1. SIRA: SPONSORLU REKLAM KUTUSU (ÖNE ÇIKARILMIŞ) */}
                  <div className="rounded-2xl border-2 border-purple-600 bg-purple-50/30 p-4 sm:p-5 shadow-sm relative space-y-3">
                    
                    {/* Sponsorlu Rozeti & Kalite Puanı */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[11px] text-slate-900 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded">
                          Sponsorlu
                        </span>
                        <span className="text-xs font-bold text-purple-900">
                          1. Sıra Reklamı
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Kalite Puanı: 10/10 (En Düşük Maliyet)</span>
                      </div>
                    </div>

                    {/* URL */}
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-5 rounded-full bg-[#111E38] text-white flex items-center justify-center font-black text-[10px]">
                        Y
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 text-xs block leading-none">Yıldız Nakliyat A.Ş.</span>
                        <span className="text-[11px] text-slate-400">https://www.yildiznakliyat.com.tr/acil-nakliye</span>
                      </div>
                    </div>

                    {/* Reklam Başlığı */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                        Aynı Gün Şehirlerarası Nakliyat | %40 Boş Dönüş İndirimi
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        İstanbul - Ankara ve İzmir güzergahlarında boş araçlarımızla ekonomik fiyat. 30 dakikada kapınızda, sigortalı & asansörlü eşya taşıma. Hemen arayın, anında sabit fiyat alın!
                      </p>
                    </div>

                    {/* Doğrudan Arama Uzantısı (Call Asset) */}
                    <div className="p-3 bg-white rounded-xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Hemen Yetkiliyle Görüşün</span>
                          <strong className="text-xs sm:text-sm font-black text-slate-900">0850 308 XX XX</strong>
                        </div>
                      </div>

                      <div className="bg-[#F95700] hover:bg-[#E04D00] text-white text-xs font-black py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Hemen Ara & Fiyat Al</span>
                      </div>
                    </div>

                    {/* Performans Özeti Şeridi */}
                    <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] font-bold">
                      <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                        <span className="text-slate-400 block">Tıklama Başı Maliyet</span>
                        <strong className="text-emerald-700 text-xs">4.20 TL (Çok Düşük)</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                        <span className="text-slate-400 block">Arama Oranı</span>
                        <strong className="text-purple-900 text-xs">%22.4 Doğrudan Çağrı</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-purple-100">
                        <span className="text-slate-400 block">ROI (Getiri)</span>
                        <strong className="text-orange-600 text-xs">39 Kat Ciro</strong>
                      </div>
                    </div>

                  </div>

                  {/* 2. SIRA: RAKİP REKLAM (PAHALI & SOLUK) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 opacity-50 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-200 px-1.5 rounded text-slate-700 font-bold">Sponsorlu</span>
                      <span className="text-[11px] text-slate-400">https://www.rakipreklam.com</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">Evden Eve Taşıma Hizmetleri</div>
                    <div className="text-[11px] text-slate-500">Maliyet: 14.50 TL (Kalite puanı düşük olduğu için çok para ödüyor)</div>
                  </div>

                </div>

              </div>

              {/* Alt Metrikler */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-400">450+</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Negatif Kelime Koruması</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">2 Saat</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Yayına Alınma Süresi</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-400">10 / 10</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Hedeflenen Kalite Puanı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-400">Tıkla-Ara</span>
                  <span className="text-[10px] text-slate-400 block font-medium">Doğrudan Çağrı Odaklı</span>
                </div>
              </div>

            </div>

            {/* ── BÖLÜM 2: ÖNCESİ / SONRASI KARŞILAŞTIRMASI ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">İş Hacminizdeki Değişim</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Öncesi vs. Profesyonel Ads Yönetimi Sonrası
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Google'a para dökmek değil, harcanan her 1 liranın 15 lira nakliye işi getirmesini sağlamak esastır.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ÖNCESİ */}
                <div className="rounded-2xl bg-red-50/70 border-2 border-red-200/80 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm border-b border-red-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-red-200/80 flex items-center justify-center text-red-700 font-black text-xs">
                      ✕
                    </div>
                    <span>Acemi / Kendi Başına Verilen Reklam</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>'Nakliye iş ilanları', 'nakliyat kamyonu' gibi alakasız aramalar bütçeyi 2 saatte tüketir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Düşük kalite puanı yüzünden her bir tıklamaya 15 - 20 TL fahiş ücret ödenir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>Gece yarısı gereksiz tıklamalara para gider, gündüz müşteri arayacak bütçe kalmaz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Sonuç:</strong> 1.500 TL bütçe harcanır, bağlanan iş: 0 veya 1.</span>
                    </li>
                  </ul>
                </div>

                {/* SONRASI */}
                <div className="rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200 pb-2.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-black text-xs">
                      ✓
                    </div>
                    <span>TaşınTeklif ile Profesyonel Ads Sonrası</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>450+ sektörel negatif kelime ile sadece cebinde nakliye parası olan müşteri tıklar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>10/10 Kalite puanıyla rakipler 15 TL öderken siz 4 TL'ye 1. sıradan çağrı alırsınız.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Yalnızca araçlarınızın boş olduğu güzergahlarda (Örn: İstanbul-Ankara dönüş) reklam yanar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Sonuç:</strong> 1.500 TL bütçe ile 35.000 TL - 50.000 TL nakliye işi kapatılır!</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ── BÖLÜM 3: ADS YÖNETİMİNDE NELER YAPIYORUZ? (4 TEMEL GÜÇ) ── */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1128]">Bütçenizi Nasıl 39 Kat Ciroya Dönüştürüyoruz?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Negatif Kelime Zırhı</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    İş arayanlar, fiyat araştırması yapanlar veya konuyla ilgisiz tıklamalar peşinen engellenir.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Tıkla-Ara (Call-Only) Odaklılık</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Kullanıcı reklama dokunduğu an direkt cep telefonunuz aranır; araya web sitesi bile girmeden sıcak teklif bağlanır.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Boş Dönüş Rota Hedeflemesi</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Kamyonunuz İzmir'e boş gitmesin diye tam yola çıkacağınız saatlerde İzmir yönü arayanlara reklam gösterilir.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#F95700] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">Haftalık Şeffaf Arama Raporu</h4>
                  <p className="text-xs text-slate-500 font-normal">
                    Hangi müşterinin ne arayarak sizi aradığını ve kaç kuruş harcandığını kalem kalem gösteren net rapor.
                  </p>
                </div>
              </div>
            </div>

            {/* ── BÖLÜM 4: PAKETLER & FİYATLANDIRMA ── */}
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Fiyatlar</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Google Ads Yönetim Paketleri
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
                        href={`https://wa.me/908503080000?text=Merhaba,%20${encodeURIComponent(pkg.name)}%20Ads%20paketi%20hakkında%20bilgi%20almak%20istiyorum.`}
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
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Reklam Bütçe Analizi</span>
                <h3 className="text-xl font-black text-white">Reklamınızı Hemen Başlatalım</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Aylık ne kadar bütçeyle kaç telefon çağrısı alabileceğinizi birlikte hesaplayalım.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20Google%20Ads%20reklam%20analizi%20için%20yazıyorum." 
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
