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
  Award,
  Clock,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Video,
  Eye,
  MousePointerClick,
  Users
} from 'lucide-react';

const InstagramIcon = ({ className = "w-3 h-3" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    name: "Instagram & FB Başlangıç",
    desc: "Sosyal medyada kurumsal bir vitrin kurmak ve güven tazelemek isteyenler",
    price: "1.800 TL",
    period: "/ ay",
    isFeatured: false,
    badge: null,
    features: [
      "Haftalık 3 Özel Tasarım Görsel & Post",
      "Profesyonel Profil & Bio / Kapak Tasarımı",
      "Taşınma Öncesi / Sonrası Güven Gönderileri",
      "Temel İl / İlçe Hedef Kitle Reklam Kurulumu",
      "Aylık Gösterim & Takipçi Raporu"
    ]
  },
  {
    name: "Aktif Müşteri Kampanyası",
    desc: "Doğrudan WhatsApp'ına haftalık 15-20 yeni taşıma işi bağlamak isteyenler",
    price: "3.200 TL",
    period: "/ ay",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Haftalık 5 Profesyonel Reels & Video Kurgusu",
      "Ev Kiralayan & Emlak Arayanlara Özel Nokta Atışı Hedefleme",
      "Tıkla-WhatsApp Doğrudan Teklif Reklamları",
      "Hazır Teklif & WhatsApp Müşteri Karşılama Şablonları",
      "Spam Yorum Filtreleme & Hızlı Yanıt Kılavuzu",
      "Haftalık Harcama & ROI Dönüşüm Raporu"
    ]
  },
  {
    name: "Full Ajans & Filo Paketi",
    desc: "Bölgesinin en bilinen 1 numaralı nakliyat markası olmak isteyen filolar",
    price: "5.500 TL",
    period: "/ ay",
    isFeatured: false,
    badge: "MAKSİMUM GÜVEN & CİRO",
    features: [
      "Instagram, Facebook, TikTok & YouTube Yönetimi",
      "Drone & Profesyonel Saha Çekim Yönlendirmesi",
      "Bölgesel Emlakçılarla Çapraz Reklam İş Birlikleri",
      "Yapay Zeka Destekli Akıllı Reklam Bütçe Dağıtımı",
      "7/24 Hesap & Yorum Moderasyonu",
      "Öncelikli Özel Sosyal Medya Danışmanı"
    ]
  }
];

const FAQS = [
  {
    q: "Fotoğraf ve videoları kim çekecek, ekibimizin profesyonel kamerası yok?",
    a: "Profesyonel kameraya ihtiyacınız yok! Taşıma esnasında cep telefonunuzla çekeceğiniz 10-15 saniyelik ambalajlama veya asansör kurulum videolarını bize WhatsApp'tan yollamanız yeterli. Grafik ve kurgu ekibimiz logonuzu, iletişim numaranızı ve profesyonel müzikleri ekleyerek harika reels videolarına dönüştürür."
  },
  {
    q: "Instagram ve Facebook'tan gerçekten nakliyat müşterisi çıkar mı?",
    a: "Kesinlikle evet. Meta'nın gelişmiş yapay zekası sayesinde reklamlarınızı sadece son 30 günde emlak sitelerini gezen, ev kiralayan veya evlilik hazırlığı yapan kişilere gösteriyoruz. Bu kişiler zaten taşınmak zorunda olduğu için teklif butonuna anında basıyorlar."
  },
  {
    q: "Reklam bütçesini kime ödüyorum?",
    a: "Reklam harcama bütçeniz doğrudan kendi kredi kartınızdan Meta'ya (Instagram/Facebook) yansır. Biz bütçenizin en verimli şekilde, boş tıklamalara gitmeden sadece taşınacak kişilere ulaşmasını sağlayan yönetim ve kreatif hizmeti sunarız."
  },
  {
    q: "Sosyal medyadan gelen müşteriler WhatsApp'ıma nasıl ulaşıyor?",
    a: "Reklamın altındaki 'WhatsApp'tan Fiyat Al' butonuna tıklayan müşteri başka hiçbir sayfada beklemeden doğrudan sizin WhatsApp sohbetinize yönlendirilir ve otomatik hazır mesajla ('Merhaba, ev taşıma fiyatı alabilir miyim?') sohbete başlar."
  }
];

export default function SosyalMedyaPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

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
          <span className="text-[#0A1128] font-bold">Sosyal Medya Reklamları</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold mb-2">
            <Share2 className="w-3.5 h-3.5 text-pink-600" />
            <span>Instagram & Facebook Nakliyat Büyüme Paketi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Sosyal Medyadan Haftalık 20+ Doğrudan Taşıma İşi Bağlayın
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Yeni ev kiralayan ve taşınma hazırlığında olan müşterileri Instagram & Facebook üzerinden nokta atışı yakalayın. Kurumsal video ve reels içerikleriyle bölgenizin en güvenilir nakliyecisi olun.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <CarrierDigitalSidebar />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* LIVE INSTAGRAM & META AD MOCKUP */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-black tracking-wide">
                      <InstagramIcon className="w-3 h-3" /> CANLI REKLAM ÖN İZLEMESİ
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Mobil Feed Görünümü</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-[#0A1128] mt-1.5">
                    Müşterilerinizin Instagram ve Facebook'ta Göreceği Reklam
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ● Aktif Kampanya
                  </span>
                </div>
              </div>

              {/* The Realistic Instagram Feed Card Mockup */}
              <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden font-sans">
                
                {/* Instagram Header */}
                <div className="p-3.5 flex items-center justify-between border-b border-slate-100 bg-white">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 p-[2px]">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-[#F95700] text-xs">
                        YN
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">yildiznakliyat.official</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">✓</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <span>Sponsorlu</span>
                        <span>•</span>
                        <span className="text-purple-600 font-bold">İstanbul & Çevresi</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 font-black text-sm px-2">•••</button>
                </div>

                {/* Target Audience Bar */}
                <div className="bg-purple-50/80 px-3.5 py-1.5 border-b border-purple-100 flex items-center justify-between text-[10px] font-bold text-purple-800">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-purple-600" /> Hedef Kitle: Ev Kiralayanlar & Yeni Ev Arayanlar
                  </span>
                  <span className="bg-purple-200/70 px-1.5 py-0.5 rounded text-[9px] text-purple-900 font-extrabold">TAM İSABET</span>
                </div>

                {/* Instagram Visual Content (Elevator Moving Truck Mockup Scene) */}
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 aspect-[4/3] flex flex-col justify-between overflow-hidden">
                  
                  {/* Subtle Grid / Truck graphic simulated background */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#F95700] text-white text-[10px] font-black shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> %20 Erken Rezervasyon İndirimi
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-slate-200">
                      Moda / Kadıköy
                    </span>
                  </div>

                  {/* Center Graphic Showcase */}
                  <div className="relative z-10 text-center py-2 space-y-2">
                    <div className="inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                      <div className="text-3xl">🚛 🏢 📦</div>
                    </div>
                    <div>
                      <div className="text-base font-black tracking-tight text-white drop-shadow-sm">
                        14. Kat Modüler Asansörlü Taşıma
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium drop-shadow-xs">
                        Sıfır Hasar • Çift Kat Patpat Ambalaj • Sigortalı
                      </p>
                    </div>
                  </div>

                  {/* Bottom Interactive Feature Bar */}
                  <div className="relative z-10 flex items-center justify-between bg-black/40 backdrop-blur-md rounded-xl p-2 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-black">
                        ✓
                      </div>
                      <div className="text-left">
                        <div className="text-[11px] font-black text-white leading-tight">Marangozlu Montaj Dahil</div>
                        <div className="text-[9px] text-emerald-300 font-medium">Uzman Kadro ile Aynı Gün Teslimat</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-white text-slate-900 px-2.5 py-1 rounded-lg">
                      Sabit Fiyat
                    </span>
                  </div>
                </div>

                {/* Call To Action Direct WhatsApp Button */}
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between cursor-pointer hover:opacity-95 transition-opacity">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-200 animate-pulse" />
                    <div>
                      <div className="text-xs font-black leading-tight">WhatsApp'tan Hemen Fiyat Al</div>
                      <div className="text-[10px] text-emerald-100 font-medium">1 Dakikada Ücretsiz Keşif & Fiyat Teklifi</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>

                {/* Instagram Action Icons */}
                <div className="p-3.5 space-y-2.5 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setLiked(!liked)} 
                        className={`transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-slate-700 hover:text-slate-900'}`}
                      >
                        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="text-slate-700 hover:text-slate-900">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button className="text-slate-700 hover:text-slate-900">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => setSaved(!saved)}
                      className={`transition-colors ${saved ? 'text-slate-900 fill-slate-900' : 'text-slate-700 hover:text-slate-900'}`}
                    >
                      <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-black text-slate-900">
                    {liked ? '1.481 beğenme' : '1.480 beğenme'}
                  </div>

                  {/* Caption */}
                  <div className="text-xs text-slate-800 leading-relaxed">
                    <span className="font-black text-slate-950 mr-1.5">yildiznakliyat.official</span>
                    Kadıköy Moda'da 14. kattan sıfır hasarla ev taşıma teslimatımız tamamlandı! 🚛 Koltuk ve beyaz eşyalarınız çift kat patpat ile sarılır, marangozumuzca kurulur. Taşınmanızı şansa bırakmayın, profildeki WhatsApp linkinden 2 dakikada fiyat alın! 📲✨
                  </div>

                  <div className="text-[10px] text-slate-400 font-semibold space-x-1.5 pt-0.5">
                    <span className="text-blue-600">#evdenevenakliyat</span>
                    <span className="text-blue-600">#kadıköynakliyat</span>
                    <span className="text-blue-600">#asansörlütaşımacılık</span>
                  </div>

                  <div className="text-[10px] text-slate-400 uppercase pt-1 font-semibold">
                    1 GÜN ÖNCE
                  </div>
                </div>

              </div>

              {/* Campaign Performance Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
                  <TrendingUp className="w-4 h-4 text-[#F95700]" />
                  <span>Ortalama Bir Sosyal Medya Kampanyamızın Gerçek Sonuçları:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-[#0A1128]">24.500+</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-0.5">Hedefli Gösterim</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-emerald-600">42 Adet</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-0.5">WhatsApp Teklif Talebi</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-purple-600">1.15 TL</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-0.5">Teklif Başına Maliyet</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="text-lg sm:text-xl font-black text-[#F95700]">14 Taşınma</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-0.5">Bağlanan İş (1 Ayda)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BEFORE / AFTER COMPARISON SECTION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
                  <span>Karşılaştırma Tablosu</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0A1128] tracking-tight">
                  Sosyal Medyası Olmayan vs. TaşınTeklif İle Yönetilen Nakliyeci
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Müşteriler artık taşınmadan önce firmanın Instagram hesabına girip işçiliğine bakıyor. İşte fark:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* ÖNCESİ / Amatör Durum */}
                <div className="rounded-2xl border-2 border-red-200 bg-red-50/40 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-red-200 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-red-600" /> ÖNCESİ (Sosyal Medyası Olmayan)
                    </span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Güven Kaybı</span>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Güvensizlik:</strong> Müşteri "Bu firma gerçek mi, eşyam kaybolur mu?" diyerek teklifinizi reddeder.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Bulanık Amatör Fotoğraflar:</strong> Araç arkası ya da karanlıkta çekilmiş rastgele fotoğraflar ucuzcu algısı yaratır.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Sürekli Fiyat Kırma:</strong> Müşteri firmanıza güvenmediği için sürekli indirim ister, ucuza taşımak zorunda kalırsınız.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span><strong>Aracılara Mahkumiyet:</strong> Kendi doğrudan müşteriniz olmadığı için komisyoncu platformlara bağımlı kalırsınız.</span>
                    </li>
                  </ul>
                </div>

                {/* SONRASI / TaşınTeklif İle */}
                <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-5 sm:p-6 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Önerilen
                  </div>

                  <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> SONRASI (TaşınTeklif İle)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Yüksek Prestij</span>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Anında Kurumsal Güven:</strong> Asansör kurulumu ve pırıl pırıl ambalaj videolarını gören müşteri ilk görüşte ikna olur.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Nokta Atışı Hedefleme:</strong> Sadece ev tutan ve taşınma aşamasındaki gerçek hedef kitleye gösterilen reklamlar.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>%35 Daha Yüksek Fiyata İş Bağlama:</strong> Kurumsal imajınız sayesinde kaliteden ödün vermeden karlı fiyat verirsiniz.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Doğrudan WhatsApp İletişimi:</strong> Aracısız, komisyonsuz, doğrudan telefonunuza gelen haftalık onlarca sıcak müşteri.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* HOW IT WORKS - 4 PILLARS */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#0A1128]">
                  Sosyal Medya Yönetiminde Ne Yapıyoruz?
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Siz sadece sahada nakliye işinizi yapın; içerik, montaj ve müşteri çekme tarafını biz çözelim.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center shrink-0 font-black text-sm">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0A1128]">1. Reels & Video Prodüksiyonu</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Sahanızdan ilettiğiniz ham video ve fotoğrafları logolu, müzikli ve dikkat çeken profesyonel reels formatına getiriyoruz.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-black text-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0A1128]">2. Taşınma Arayan Kitle Hedeflemesi</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Reklamları rastgele herkese değil; emlak sitelerini gezen, yeni ev kiralayan veya evlilik aşamasında olan kişilere gösteriyoruz.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black text-sm">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0A1128]">3. Tıkla-WhatsApp Entegrasyonu</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      Reklamı gören müşteri tek tıkla doğrudan sizin WhatsApp hattınıza yönlendirilir. Form doldurma zahmeti olmadan anında teklif alır.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black text-sm">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-xs sm:text-sm text-[#0A1128]">4. Satışa Dönüştüren Cevap Şablonları</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                      WhatsApp ve DM'den gelen müşterilere vereceğiniz hazır teklif metinleri ile müşterinin başka firmaya gitmesini önlüyoruz.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PACKAGES GRID */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-black text-[#0A1128] tracking-tight">Sosyal Medya Paketleri</h3>
                  <p className="text-xs text-slate-500 font-medium">İhtiyacınıza ve araç filonuza en uygun paketi seçin.</p>
                </div>
                <span className="text-xs font-bold text-slate-400">Taahhüt yok, istediğiniz ay durdurabilirsiniz</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PACKAGES.map((pkg, idx) => (
                  <div 
                    key={idx}
                    className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between border-2 ${
                      pkg.isFeatured
                        ? 'bg-white border-[#F95700] shadow-lg relative'
                        : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {pkg.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F95700] text-white text-[10px] font-black uppercase tracking-wider shadow-xs whitespace-nowrap">
                        {pkg.badge}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-black text-base text-[#0A1128]">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1 min-h-[32px]">{pkg.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-2xl font-black text-[#0A1128]">{pkg.price}</span>
                        {pkg.period && <span className="text-xs text-slate-400 font-bold ml-1">{pkg.period}</span>}
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-slate-100">
                        {pkg.features.map((feat, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <a 
                        href={`https://wa.me/908503080000?text=Merhaba,%20${encodeURIComponent(pkg.name)}%20paketi%20hakkında%20bilgi%20almak%20istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button 
                          variant={pkg.isFeatured ? 'primary' : 'outline'} 
                          size="md" 
                          className="w-full font-bold text-xs rounded-xl"
                        >
                          Paketi Seç & Başla →
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ ACCORDION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#F95700]" />
                <h3 className="text-lg font-black text-[#0A1128]">Sıkça Sorulan Sorular</h3>
              </div>

              <div className="divide-y divide-slate-100 pt-2">
                {FAQS.map((faq, fi) => (
                  <div key={fi} className="py-3.5">
                    <button
                      onClick={() => setOpenFaq(openFaq === fi ? null : fi)}
                      className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-[#0A1128] hover:text-[#F95700] transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === fi ? 'rotate-180 text-[#F95700]' : 'text-slate-400'}`} />
                    </button>
                    {openFaq === fi && (
                      <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DIRECT WHATSAPP CTA BOX */}
            <div className="bg-gradient-to-r from-[#0A1128] via-[#111c3d] to-[#1a2b5c] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-700/40">
                  Ücretsiz Sosyal Medya Analizi
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Mevcut Hesabınızı İnceleyelim
                </h3>
                <p className="text-xs text-slate-300 font-normal max-w-md leading-relaxed">
                  Instagram ve Facebook profilinizi ücretsiz analiz edelim. Hangi bölgeden ayda kaç nakliye işi toplayabileceğinizin fizibilitesini çıkaralım.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20nakliyat%20sosyal%20medya%20yönetimi%20için%20ücretsiz%20danışmanlık%20almak%20istiyorum." 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="primary" size="lg" className="font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-orange-950/30" leftIcon={<PhoneCall className="w-4 h-4" />}>
                  WhatsApp'tan Analiz İste
                </Button>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
