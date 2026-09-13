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
  Coins,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: 'Başlangıç Ads Yönetimi',
    desc: 'Düşük bütçeyle aynı gün telefonunun çalmasını isteyenler',
    price: '750 TL',
    period: '/ ay (yönetim)',
    isFeatured: false,
    badge: null,
    features: [
      'Google Ads Kurumsal Hesap Kurulumu',
      '1 Şehir / 10 Hedef Arama Grubu',
      '450+ Negatif Kelime Filtresi (Gereksiz Tıklama Yok)',
      'Tıkla-Ara (Call-Only) Mobil Kampanya',
      'Haftalık Harcama & Arama Özeti'
    ]
  },
  {
    name: 'Profesyonel Ads Yönetimi',
    desc: 'Haftanın her günü düzenli ev ve ofis taşıma bağlayan firmalar',
    price: '1.500 TL',
    period: '/ ay (yönetim)',
    isFeatured: true,
    badge: 'EN ÇOK TERCİH EDİLEN',
    features: [
      'Gelişmiş Tıklama Başı Maliyet Düşürme (Kalite Puanı 10/10)',
      'Şehirlerarası Rota Hedeflemesi (Boş Dönüş Yakalama)',
      'Dönüşüm Takibi (WhatsApp & Telefon Aramaları)',
      'A/B Reklam Metin Testleri & Tıklama Artırıcılar',
      'Rakip Analizi & Konum Bazlı Negatifleme',
      'Haftalık Canlı Performans & Bütçe Raporu'
    ]
  },
  {
    name: 'Kurumsal & Filo Büyüme',
    desc: 'Çoklu araç filosu olan ve günlük 10+ ev taşıma hedefleyen kurumsal firmalar',
    price: '2.750 TL',
    period: '/ ay (yönetim)',
    isFeatured: false,
    badge: 'FİLOLAR İÇİN',
    features: [
      'Tüm Türkiye Geneli ve Çoklu Şehir Kampanyaları',
      'Dönüş Seferleri / Boş Kamyon Özel Kampanyası',
      'Google Haritalar Reklamları (Promoted Pins) Entegrasyonu',
      '7/24 Kampanya İzleme & Anlık Tıklama Koruması',
      'Özel Dijital Pazarlama Danışmanı & Günlük Raporlama'
    ]
  }
];

const FAQS = [
  {
    q: 'Google Ads reklam bütçesini kime ödüyorum?',
    a: 'Reklam bütçenizi (tıklama başı ücretleri) doğrudan kendi kredi kartınızla Google fatura sistemine ödersiniz. Biz yalnızca profesyonel hesap kurulumu, negatif kelime yönetimi ve maliyet düşürme danışmanlık hizmeti sunarız.'
  },
  {
    q: 'Gereksiz tıklamaları ve bütçemin boşa gitmesini nasıl engelliyorsunuz?',
    a: 'Taşımacılık sektöründe hazırladığımız 450+ özel negatif anahtar kelime havuzu sayesinde "nakliye iş ilanları", "nakliye oyunu", "nakliyat kamyonu fiyatı" gibi iş getirmeyecek tüm aramaları engelliyoruz. Reklamınız sadece gerçekten evini veya ofisini taşıtmak isteyenlere görünür.'
  },
  {
    q: 'Reklamlarım ne kadar sürede yayına girer?',
    a: 'Hesap kurulumu, anahtar kelime eşleşmeleri ve Tıkla-Ara uzantıları aynı gün ortalama 2-3 saat içinde tamamlanır ve Google onayından sonra aynı gün telefonlarınız çalmaya başlar.'
  },
  {
    q: 'Teklif başı maliyetleri nasıl düşürüyorsunuz?',
    a: 'Google reklamlarında kalite puanınız 10 üzerinden ne kadar yüksek olursa, tıklama başına rakiplerinizden %50 daha az ödersiniz. Reklam metni, açılış sayfası ve arama niyeti tam eşleştirilerek en düşük maliyetle en yüksek çağrı sayısı elde edilir.'
  }
];

export default function GoogleAdsServicePage() {
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
          <span className="text-[#0A1128] font-bold">Google Reklamları (Ads)</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF3EE] text-[#C23E00] border border-[#F95700]/30 text-xs font-bold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-[#F95700]" />
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
            
            {/* BÖLÜM 1: GOOGLE ADS SPONSORLU 1. SIRA MOCKUP (TEMİZ BEYAZ KART - ARKA PLAN MAVİLİĞİ VE MOR KALDIRILDI) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 shadow-sm border border-slate-200 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#F95700] animate-pulse" />
                    Canlı Sponsorlu Reklam Simülasyonu
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black mt-2 text-[#0A1128]">
                    Arama Yapanın Karşısına İlk Çıkan Siz Olun
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    "Acil nakliye", "evden eve taşıma" arayanlar doğrudan 'Hemen Ara' butonuna basarak size ulaşır.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-[#C23E00] px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Flame className="w-4 h-4 text-[#F95700]" />
                  <span>Aynı Gün Çağrı Garantisi</span>
                </div>
              </div>

              {/* Google Ads Mockup Card */}
              <div className="w-full max-w-2xl mx-auto rounded-2xl bg-white text-slate-800 shadow-md overflow-hidden border border-slate-200">
                
                {/* Search Bar */}
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-xs">
                    <Search className="w-4 h-4 text-[#4285F4]" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">acil nakliye kamyonet istanbul ankara</span>
                  </div>
                  <span className="text-[10px] text-[#F95700] font-bold bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200 hidden sm:inline">
                    En Çok Kazandıran Kelime
                  </span>
                </div>

                {/* Ads Content */}
                <div className="p-4 sm:p-5 space-y-4">
                  
                  {/* 1. SIRA: SPONSORLU REKLAM KUTUSU (ÖNE ÇIKARILMIŞ) */}
                  <div className="rounded-2xl border-2 border-[#F95700] bg-orange-50/20 p-4 sm:p-5 shadow-sm relative space-y-3">
                    
                    {/* Sponsorlu Rozeti & Kalite Puanı */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[11px] text-slate-900 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded">
                          Sponsorlu
                        </span>
                        <span className="text-xs font-bold text-slate-800">
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
                    <div className="p-3 bg-white rounded-xl border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
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
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block">Tıklama Başı Maliyet</span>
                        <strong className="text-emerald-700 text-xs">4.20 TL (Çok Düşük)</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block">Arama Oranı</span>
                        <strong className="text-slate-800 text-xs">%22.4 Doğrudan Çağrı</strong>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-slate-400 block">ROI (Getiri)</span>
                        <strong className="text-[#F95700] text-xs">39 Kat Ciro</strong>
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
              <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div>
                  <span className="text-base sm:text-lg font-black text-emerald-600">450+</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Negatif Kelime Koruması</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-[#F95700]">2 Saat</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Yayına Alınma Süresi</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-blue-600">10 / 10</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Hedeflenen Kalite Puanı</span>
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-amber-600">Tıkla-Ara</span>
                  <span className="text-[10px] text-slate-500 block font-medium">Doğrudan Çağrı Odaklı</span>
                </div>
              </div>

            </div>

            {/* BÖLÜM 2: ARTILARI VE EKSİLERİ (HİZMET ANALİZİ) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Hizmet Analizi</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Google Ads Hizmetinin Artıları ve Dikkat Edilmesi Gerekenler
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Hangi durumlarda Google Ads en kârlı çözümdür, nerede dikkatli bütçe yönetimi gerekir?
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
                      <span><strong>Anında Sonuç:</strong> Reklam açıldığı gün telefonunuz çalmaya başlar, bekleme süresi yoktur.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Nokta Atışı Talep:</strong> "Hemen nakliye kamyonet" gibi acil ihtiyaç sahiplerine doğrudan ulaşır.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Konum ve Saat Kontrolü:</strong> Reklamlarınızı sadece boş aracınızın olduğu güzergahta ve çalışma saatlerinizde açabilirsiniz.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Ölçülebilir Ciro:</strong> Harcanan her 1 TL'nin kaç telefon araması ve kaç taşınma işine dönüştüğü anlık izlenir.</span>
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
                      <span><strong>Sürekli Bütçe Gerektirir:</strong> Reklam bütçeniz bittiği anda sponsorlu sıradan düşersiniz (kalıcı değildir).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Acemi Yönetimde Yüksek Maliyet:</strong> Negatif kelime filtresi yapılmazsa bütçe 2 saatte alakasız aramalara tükenir.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Web Sitesi Kalitesi Önemlidir:</strong> Reklama tıklayan müşteri sitenizi güvenilir bulmazsa aramadan çıkar (bu yüzden SEO & Web Sitesi ile desteklenmelidir).</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* BÖLÜM 3: PAKETLER VE FİYATLANDIRMA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Şeffaf Yönetim Paketleri</span>
                <h3 className="text-lg sm:text-2xl font-black text-[#0A1128] mt-1">
                  Firmanız İçin En Uygun Ads Paketini Seçin
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Gizli ücret yok, taahhüt yok. İstediğiniz ay durdurun veya bütçenizi büyütün.
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
                        href={`https://wa.me/908503080000?text=${encodeURIComponent(`Merhaba, ${pkg.name} Ads paketi hakkında bilgi almak istiyorum.`)}`}
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