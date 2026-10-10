import React from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Search, 
  MapPin, 
  Megaphone, 
  Share2, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  MessageSquare,
  TrendingUp,
  Award,
  Zap,
  Users,
  Clock,
  ChevronRight,
  Headphones
} from 'lucide-react';

const DUBAI_PHONE = '+971 58 518 8543';
const DUBAI_WA_NUMBER = '971585188543';

const createWhatsAppLink = (serviceName: string) => {
  const msg = `Merhaba, TaşınTeklif üzerinden ${serviceName} hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(msg)}`;
};

const SERVICES = [
  {
    id: 'web-tasarim',
    title: 'Nakliyat Web Sitesi Tasarımı',
    subtitle: 'Mobil Uyumlu, Ultra Hızlı & WhatsApp Butonlu Özel Tasarım',
    desc: 'Nakliyat firmanıza özel kurumsal, 0.8 saniyede açılan, Google uyumlu ve müşterilerin doğrudan WhatsApp veya telefonla anında arayabildiği profesyonel web siteleri üretiyoruz.',
    href: '/hizmetler/web-tasarim',
    icon: Globe,
    badge: 'En Çok Tercih Edilen',
    badgeClass: 'bg-orange-100 text-[#C23E00] border-orange-200',
    startingPrice: '3.500 TL\'den başlayan fiyatlarla',
    points: [
      'Domain & Yüksek Hızlı SSL Hosting dahil',
      '39 İlçe için özel SEO alt sayfaları',
      'Doğrudan WhatsApp & Tek Tıkla Ara çağrı butonları',
      'Kolay Türkçe yönetim paneli'
    ]
  },
  {
    id: 'google-seo',
    title: 'Google 1. Sayfa SEO',
    subtitle: 'Şehrinizde ve İlçenizde Aramalarda İlk Sayfaya Çıkın',
    desc: 'Google\'da "evden eve nakliyat", "şehirlerarası nakliyat" aramalarında firmanızı üst sıralara taşıyarak aracı komisyonu ödemeden her gün doğrudan müşteri kazandırıyoruz.',
    href: '/hizmetler/google-seo',
    icon: Search,
    badge: 'Kalıcı Müşteri Akışı',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    startingPrice: '1.250 TL / ay',
    points: [
      'İl & ilçe bazlı yerel anahtar kelime optimizasyonu',
      'Google Search Console & Schema zengin veri kurulumu',
      'Yüksek otoriteli sektörel backlink çalışmaları',
      'Haftalık ve aylık şeffaf sıra takip raporları'
    ]
  },
  {
    id: 'harita-seo',
    title: 'Google Haritalar & Yerel SEO',
    subtitle: 'Bölgenizdeki Müşterilerin İlk Tercihi Olun',
    desc: 'Google Haritalar işletme profilinizi doğrulayıp optimize ediyoruz. Haritada ilk 3 sırada yer alarak yakınınızda nakliyeci arayan yüzlerce müşterinin telefonunuzu aramasını sağlıyoruz.',
    href: '/hizmetler/harita-seo',
    icon: MapPin,
    badge: 'Doğrudan Telefon Çağrısı',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    startingPrice: '950 TL / ay',
    points: [
      'Google Business işletme profili kurulumu ve doğrulama',
      'Haritada ilk 3 sıra (Local Pack) yerel optimizasyonu',
      'Organik müşteri yorum ve yüksek yıldız puanı stratejisi',
      'Apple Maps & Yandex Navigasyon dizin kayıtları'
    ]
  },
  {
    id: 'google-reklamlari',
    title: 'Google Reklamları (Ads)',
    subtitle: 'Aynı Gün Telefonunuz Çalmaya Başlasın',
    desc: 'Evinin veya ofisinin taşınmasını isteyen müşteriler Google\'da arama yaptığı anda reklamınız en üstte çıksın. 450+ negatif kelime filtresiyle boşa bütçe harcamadan en doğru işleri alın.',
    href: '/hizmetler/google-reklamlari',
    icon: Megaphone,
    badge: 'Anında İş Garantisi',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    startingPrice: '750 TL / ay (yönetim)',
    points: [
      '450+ negatif kelime listesiyle gereksiz tıklamalara son',
      'Tıkla-Ara (Call-Only) mobil dönüşüm kampanyaları',
      'Şehirlerarası boş kamyon & dönüş seferleri hedeflemesi',
      'Haftalık şeffaf harcama ve arama performansı raporu'
    ]
  },
  {
    id: 'sosyal-medya',
    title: 'Sosyal Medya Reklamları',
    subtitle: 'Instagram & Meta Hedefli Kampanyalar',
    desc: 'Yeni ev kiralayan, ev satın alan veya taşınma arayışında olan kullanıcılara Instagram Reels ve Facebook reklamlarıyla ulaşıp doğrudan WhatsApp\'tan nakliye teklifleri toplayın.',
    href: '/hizmetler/sosyal-medya',
    icon: Share2,
    badge: 'Marka & Güven Artışı',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
    startingPrice: '1.250 TL / ay (yönetim)',
    points: [
      'Özel tasarım video reels ve görsel afiş hazırlığı',
      'Taşınma aşamasındaki kitleye nokta atışı demografik hedefleme',
      'Doğrudan WhatsApp\'a bağlanan teklif alma butonları',
      'Düşük mesaj başı maliyet ve yüksek dönüşüm optimizasyonu'
    ]
  }
];

const ADVANTAGES = [
  {
    title: 'Sektöre Özel Uzmanlık',
    desc: 'Genel reklam ajansları nakliyatın dilini bilmez. Biz kamyon boş dönüşlerinden asansörlü taşımaya kadar sektörün tüm ihtiyaçlarını bilen uzman bir ekibiz.',
    icon: Award
  },
  {
    title: 'Aracı Komisyonlarına Son',
    desc: 'Taşınma portallarına her iş için %15-%25 komisyon ödemek yerine, kendi web siteniz ve Google hesabınız üzerinden komisyonsuz doğrudan müşteriyi bağlayın.',
    icon: TrendingUp
  },
  {
    title: 'Ultra Hızlı Kurulum',
    desc: 'Web siteniz 3-5 iş gününde hazır, Google reklamlarınız ve harita optimizasyonunuz 24 saat içinde yayına alınır. Vakit kaybetmeden iş almaya başlarsınız.',
    icon: Zap
  },
  {
    title: 'Dubai Merkezli Güvence',
    desc: 'Uluslararası standartlarda hizmet kalitesi, şeffaf sözleşme ve Dubai merkez ofisimizden +971 58 518 8543 üzerinden 7/24 kesintisiz müşteri desteği.',
    icon: Headphones
  }
];

const STEPS = [
  {
    step: '01',
    title: 'İhtiyaç & Bölge Analizi',
    desc: 'Çalıştığınız şehirleri, araç kapasitenizi ve hedeflerinizi değerlendirip size özel dijital büyüme yol haritası çıkarıyoruz.'
  },
  {
    step: '02',
    title: 'Altyapı & Kampanya Kurulumu',
    desc: 'Web sitenizi hazırlıyor, Google Haritalar, SEO veya Ads kampanyalarınızı en yüksek kalite puanlarıyla kuruyoruz.'
  },
  {
    step: '03',
    title: 'Telefon & Teklif Akışı',
    desc: 'Aramalar doğrudan cep telefonunuza ve WhatsApp hattınıza yönlenir. Müşterilerinizle aracısız hemen pazarlık yapabilirsiniz.'
  },
  {
    step: '04',
    title: 'Sürekli Takip & Büyüme',
    desc: 'Her hafta bütçenizi optimize ediyor, yeni ilçeler ekliyor ve firmanızın cirosunu düzenli olarak artırıyoruz.'
  }
];

const FAQS = [
  {
    q: 'Bu hizmetlerden yararlanmak için TaşınTeklif üyesi olmak zorunlu mu?',
    a: 'Hayır. TaşınTeklif Dijital Büyüme Ajansı tüm nakliye firmalarına, bağımsız kamyon sahiplerine ve lojistik şirketlerine açıktır. Üye olmadan da dilediğiniz hizmet için teklif alabilirsiniz.'
  },
  {
    q: 'Teklif almak ve süreci başlatmak için ne yapmalıyım?',
    a: 'Sayfamızdaki "WhatsApp ile Teklif Al" butonuna tıklayarak veya doğrudan +971 58 518 8543 Dubai müşteri hattımıza yazarak aynı gün içinde firmanıza özel fiyat teklifi ve detaylı analiz alabilirsiniz.'
  },
  {
    q: 'Google reklamlarında bütçeyi kime ödüyorum?',
    a: 'Reklam harcama bütçenizi doğrudan kendi kredi kartınızla Google veya Meta şirketlerine ödersiniz. Biz kampanya yönetimi, negatif kelime filtreleme ve kalite optimizasyonu hizmeti veririz.'
  },
  {
    q: 'Web sitesi yaptırdığımda hosting ve domain ücreti ödüyor muyum?',
    a: 'İlk yıl .com veya .com.tr alan adınız, yüksek hızlı SSL sertifikalı kurumsal hosting ve e-posta adresleriniz paket ücretine dahildir.'
  }
];

export default function HizmetlerHubPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#F95700] transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#111E38] font-bold">Hizmetler</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#F95700] text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#F95700]" />
            <span>TaşınTeklif Dijital Büyüme Ajansı</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Nakliyat Firmanızı İnternette Büyütün, <span className="text-[#F95700]">Komisyonsuz Doğrudan Müşteri</span> Kazanın
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Aracı komisyonlarına son verin! Web sitesi, Google 1. sayfa SEO, Harita kaydı, Google Ads ve Instagram reklamlarıyla firmanızın telefonu aralıksız çalsın.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <a
              href={createWhatsAppLink('Tüm Dijital Büyüme Hizmetleri')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp ile Hemen Teklif Al</span>
            </a>

            <a
              href="#hizmetler-listesi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#111E38] font-bold text-sm border border-slate-200 shadow-xs transition-all"
            >
              <span>Hizmetleri İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Dubai & WhatsApp Direct Bar */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 max-w-xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Dubai İletişim Hattı:</span>
              <a href="tel:+971585188543" className="font-black text-[#111E38] hover:text-[#F95700] transition-colors">
                {DUBAI_PHONE}
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DSO-IFZA, Dubai Silicon Oasis</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5 HİZMET KARTLARI ── */}
      <section id="hizmetler-listesi" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Profesyonel Çözümler</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Taşımacılık Sektörüne Özel 5 Dijital Hizmet
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            İhtiyacınıza uygun hizmeti seçin, paket detaylarını inceleyin ve doğrudan WhatsApp hattımızdan en iyi teklifi alın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-orange-200"
              >
                {/* Header with Icon & Badge */}
                <div className="p-6 sm:p-7 border-b border-slate-100 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F95700] group-hover:text-white transition-all shadow-xs">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${srv.badgeClass}`}>
                        {srv.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#111E38] tracking-tight group-hover:text-[#F95700] transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-bold text-[#F95700] mt-0.5">
                      {srv.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                    {srv.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#F95700] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Price & Actions */}
                <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fiyatlandırma</span>
                    <span className="text-xs font-black text-[#111E38]">{srv.startingPrice}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href={srv.href}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#111E38] font-bold text-xs border border-slate-200 transition-colors"
                    >
                      <span>İncele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={createWhatsAppLink(srv.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs shadow-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Teklif Al</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6th Card: All-In-One Full Package Callout */}
          <div className="bg-gradient-to-br from-[#111E38] to-[#1A2E56] rounded-3xl p-6 sm:p-7 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-[#F95700] border border-orange-500/30 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#F95700]" />
              </div>

              <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 block mb-1">
                360° Filo & Şirket Büyütme
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Tüm Hizmetler Tek Pakette
              </h3>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-medium">
                Web sitesi + Google SEO + Google Haritalar + Google Ads ve Sosyal Medya yönetimini tek çatı altında indirimli olarak birleştirin. Şehrinizin 1 numaralı nakliye markası olun.
              </p>

              <div className="mt-6 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Tek faturada tüm dijital pazarlama</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Özel dijital büyüme danışmanı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Dubai ofisimizden öncelikli 7/24 destek</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-700/60">
              <a
                href={createWhatsAppLink('Tam Kapsamlı 360 Derece Filo Paketi')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs shadow-lg shadow-orange-500/25 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>360° Paket Teklifi Al</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AVANTAJLAR SECTION ── */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Neden TaşınTeklif?</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Nakliyat Sektörünü Bilen Ajans Farkı
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Sıradan reklam ajansları nakliyatın dilinden anlamaz. Biz 10 yıldır nakliyeciler için yazılım ve müşteri kazandırma sistemleri üretiyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition-colors">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100/80 text-[#F95700] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#111E38] tracking-tight">
                    {adv.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4 ADIMDA ÇALIŞMA SÜRECİ ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Adım Adım Süreç</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Firmanızı Nasıl Zirveye Taşıyoruz?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Karmaşık teknik terimler yok. Şeffaf, hızlı ve doğrudan sonuç odaklı 4 adımlı büyüme planı.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((st, idx) => (
            <div key={idx} className="relative bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-3xl font-black text-orange-200 block mb-2">{st.step}</span>
              <h3 className="text-base font-black text-[#111E38] tracking-tight">{st.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Merak Edilenler</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight mt-1">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Hizmetlerimizle ilgili aklınıza takılan soruların yanıtları
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <h3 className="text-sm sm:text-base font-black text-[#111E38]">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUBAI WHATSAPP CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-[#111E38] via-[#1A2E56] to-[#111E38] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Headphones className="w-3.5 h-3.5" />
              Doğrudan İletişim Hattı
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Firmanız İçin En Uygun Büyüme Planını Birlikte Çıkaralım
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed font-medium">
              Dubai ofisimiz ve uzman destek ekibimizle WhatsApp üzerinden anında görüşün. Firmanızın web sitesini ve rakiplerinizi ücretsiz analiz edelim.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={createWhatsAppLink('Genel Teklif ve Analiz')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm shadow-xl shadow-orange-500/30 transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp ile Hemen Yazın</span>
              </a>

              <a
                href="tel:+971585188543"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-orange-400" />
                <span>+971 58 518 8543</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
              DSO-IFZA, IFZA Properties, Dubai Silicon Oasis • Çalışma Saatleri: 09:00 - 19:00
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
