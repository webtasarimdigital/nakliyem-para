'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Megaphone, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  Zap, 
  Filter, 
  Target,
  BarChart3,
  Check,
  ChevronRight,
  MessageSquare,
  Award,
  ChevronDown,
  Headphones
} from 'lucide-react';

const DUBAI_WA_NUMBER = '971585188543';

const createWhatsAppLink = (packageName?: string) => {
  const text = packageName
    ? `Merhaba, TaşınTeklif üzerinden Google Ads Reklam Yönetimi (${packageName}) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Merhaba, TaşınTeklif üzerinden Google Ads Reklam Yönetimi hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

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

const ADVANTAGES = [
  {
    title: '450+ Negatif Kelime Filtresi',
    desc: '"Kamyon kiralama", "nakliye iş ilanları", "ucuz koli" gibi gereksiz aramalarda bütçenizin 1 kuruşu bile çöpe gitmez.',
    icon: Filter
  },
  {
    title: 'Aynı Gün Telefon Çağrısı',
    desc: 'Kampanyanız kurulduktan hemen sonra telefonunuz çalmaya başlar. Bekleme süresi olmadan hemen iş bağlarsınız.',
    icon: PhoneCall
  },
  {
    title: 'Boş Kamyon & Dönüş Seferleri',
    desc: 'İstanbul\'dan Ankara\'ya giden kamyonunuzun dönüşünü doldurmak için güzergah odaklı özel kampanyalar açıyoruz.',
    icon: Target
  },
  {
    title: 'Düşük Tıklama Başı Maliyet',
    desc: 'Yüksek kalite puanı ve özel reklam başlıklarıyla rakiplerinizin yarı fiyatına en tepede listelenmenizi sağlıyoruz.',
    icon: Zap
  }
];

const FAQS = [
  {
    q: 'Google Ads reklam bütçesini kime ödüyorum?',
    a: 'Reklam harcama bütçenizi doğrudan kendi kredi kartınızla Google Ads hesabınıza yüklersiniz. Biz hesabınızın profesyonel kurulumu, negatif anahtar kelime filtrelemesi ve günlük optimizasyonu için yönetim ücreti alırız.'
  },
  {
    q: 'Günlük ne kadar reklam bütçesi ayırmalıyım?',
    a: 'Küçük ve orta ölçekli yerel bir nakliyeci için günlük 150 - 300 TL bütçe genellikle günde 3-6 doğrudan müşteri telefonu almak için yeterlidir. Bütçeyi dilediğiniz gün artırabilir veya durdurabilirsiniz.'
  },
  {
    q: 'Rakipler reklamlarıma tıklayarak bütçemi bitirebilir mi?',
    a: 'Google\'ın gelişmiş sahte tıklama koruma algoritmasına ek olarak, şüpheli IP adreslerini engelleyen koruma kurallarımız sayesinde bütçenizin kötüye kullanılmasını engelliyoruz.'
  },
  {
    q: 'Reklamlar ne kadar sürede yayına alınır?',
    a: 'Google Ads hesabınız ve anahtar kelimeleriniz onaylandıktan sonra ortalama 24 saat içerisinde kampanyalarınız canlıya alınır ve ilk aramalar gelmeye başlar.'
  }
];

export default function GoogleReklamlariPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#F95700] transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/hizmetler" className="hover:text-[#F95700] transition-colors">Hizmetler</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#111E38] font-bold">Google Ads Reklamları</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <Megaphone className="w-4 h-4 text-purple-600" />
            <span>Google Ads Arama Reklamları Yönetimi</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Aynı Gün Telefonunuz Çalsın, <span className="text-[#F95700]">Bütçeniz Boşa Gitmesin</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            450+ negatif kelime filtresiyle gereksiz tıklamalara son verin. Sadece evini ve ofisini taşımak isteyen gerçek müşterilere ulaşarak araçlarınızı doldurun.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp ile Teklif Al</span>
            </a>

            <a
              href="#paketler"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#111E38] font-bold text-sm border border-slate-200 shadow-xs transition-all"
            >
              <span>Yönetim Paketlerini İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><Filter className="w-4 h-4 text-purple-600" /> 450+ Negatif Kelime</span>
            <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-emerald-600" /> Tıkla-Ara Odaklı</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-orange-500" /> 24 Saatte Yayında</span>
          </div>

        </div>
      </section>

      {/* ── PACKAGES SECTION ── */}
      <section id="paketler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Ads Yönetim Paketleri</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Firmanıza Uygun Reklam Yönetim Planı
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Şeffaf yönetim ücreti. Reklam bütçenizi istediğiniz zaman artırın veya durdurun.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.isFeatured
                  ? 'bg-white border-2 border-[#F95700] shadow-2xl scale-[1.02] z-10'
                  : 'bg-white border border-slate-200 shadow-md hover:border-slate-300'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F95700] text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md">
                  {pkg.badge}
                </div>
              )}

              <div>
                <h3 className="text-xl font-black text-[#111E38] tracking-tight">{pkg.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{pkg.desc}</p>

                <div className="mt-6 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#111E38]">{pkg.price}</span>
                  <span className="text-xs text-slate-400 font-bold">{pkg.period}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hizmet Kapsamı</span>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <Check className="w-4 h-4 text-[#F95700] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <a
                  href={createWhatsAppLink(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-black text-xs transition-all ${
                    pkg.isFeatured
                      ? 'bg-[#F95700] hover:bg-[#E04D00] text-white shadow-lg shadow-orange-500/25'
                      : 'bg-[#111E38] hover:bg-[#1A2E56] text-white shadow-md'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Bu Paket İçin Teklif Al</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Yüksek Verim</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Neden TaşınTeklif Ads Yönetimi?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#111E38] tracking-tight">{adv.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{adv.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Merak Edilenler</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight mt-1">
            Google Ads Reklamları Hakkında Sorular
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-black text-sm text-[#111E38] hover:text-[#F95700] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700] block mb-2">Telefonunuz Bugün Çalsın</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Google Ads Kampanyanızı Bugün Başlatalım
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Çalıştığınız bölgeyi ve bütçenizi WhatsApp üzerinden iletin, aynı gün negatif kelimelerle korunan reklamınızı kuralım.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs shadow-lg shadow-orange-500/30 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp ile Kampanya Başlat</span>
            </a>
            <a
              href="tel:+971585188543"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-orange-400" />
              <span>+971 58 518 8543</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
