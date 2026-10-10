'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  TrendingUp, 
  Target,
  BarChart3,
  Globe,
  Check,
  ChevronRight,
  MessageSquare,
  Award,
  Layers,
  ChevronDown,
  Headphones
} from 'lucide-react';

const DUBAI_WA_NUMBER = '971585188543';

const createWhatsAppLink = (packageName?: string) => {
  const text = packageName
    ? `Merhaba, TaşınTeklif üzerinden Google SEO Hizmeti (${packageName}) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Merhaba, TaşınTeklif üzerinden Google SEO Hizmeti hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

const PACKAGES = [
  {
    name: 'Yerel SEO Başlangıç',
    desc: 'Kendi ilçesinde ve çevre ilçelerde 1. sayfaya çıkmak isteyen nakliyeciler',
    price: '1.250 TL',
    period: '/ ay',
    isFeatured: false,
    badge: null,
    features: [
      '1 Ana Şehir & 5 İlçe İç Sayfa SEO Yapılandırması',
      'Google Arama Konsolu (Search Console) ve Analytics Kurulumu',
      'Site İçi Başlık, Meta Açıklama & H1-H3 Etiket Optimizasyonu',
      'Site Açılış Hızı Optimizasyonu (Mobil & Masaüstü)',
      'Aylık Sıralama & Tıklama Takip Raporu'
    ]
  },
  {
    name: 'İl Geneli SEO Liderliği',
    desc: 'Büyükşehirde (örn: İstanbul geneli) tüm ilçelerde 1. sayfayı hedefleyenler',
    price: '2.500 TL',
    period: '/ ay',
    isFeatured: true,
    badge: 'EN ÇOK TERCİH EDİLEN',
    features: [
      '39 İlçe İçin Özel URL & SEO Sayfaları (örn: /kadikoy-nakliyat)',
      'Şehirlerarası Nakliyat Rota Sayfaları (Ankara, İzmir, Antalya vb.)',
      'Google Schema Taşımacılık İşletme Zengin Sonuç İşaretlemesi',
      'Yüksek Otoriteli Sektörel Tanıtım & Backlink Çalışması',
      'Rakip Firma Sıralama Analizi & Boşluk Tespiti',
      'Haftalık Anahtar Kelime Sıralama Raporu'
    ]
  },
  {
    name: 'Türkiye Geneli Kurumsal SEO',
    desc: '81 ilde ve tüm anahtar kelimelerde zirveyi hedefleyen filo firmaları',
    price: '4.500 TL',
    period: '/ ay',
    isFeatured: false,
    badge: 'FİLOLAR İÇİN',
    features: [
      '81 İl x 3 Hizmet (Evden Eve, Parça Eşya, Ofis) Dinamik URL Havuzu',
      'Hepsiburada/Sahibinden Kalitesinde SEO Mimarisi',
      'Basın Bülteni ve Ulusal Haber Sitelerinden Otoriter Backlinkler',
      'Özel SEO Uzmanı & Canlı Pozisyon Takip Paneli',
      '7/24 Google Algoritma Güncelleme Koruması'
    ]
  }
];

const ADVANTAGES = [
  {
    title: 'Ücretsiz & Kalıcı Telefon Trafiği',
    desc: 'Reklamlarda bütçeniz bittiğinde telefon çalmayı keser. Organik SEO\'da ise 1. sayfaya çıktığınızda her gün onlarca çağrı tamamen ücretsiz gelir.',
    icon: TrendingUp
  },
  {
    title: 'İlçe Odaklı Arama Hakimiyeti',
    desc: 'Müşteriler sadece "nakliyat" değil, "Beşiktaş evden eve", "Maltepe nakliye" arar. Özel URL mimarimiz sayesinde her ilçeden iş bağlarsınız.',
    icon: Target
  },
  {
    title: 'Google Schema Zengin Sonuçlar',
    desc: 'Arama sonuçlarında yıldız puanlarınız, telefon butonunuz ve işletme bilgileriniz zengin görünüm ile tıklama oranını 3 kat artırır.',
    icon: Star
  },
  {
    title: 'Şeffaf Haftalık Raporlama',
    desc: 'Hangi kelimede kaçıncı sıradasınız, web sitenizi kaç kişi ziyaret etti, hepsini şeffaf panellerimizden canlı takip edersiniz.',
    icon: BarChart3
  }
];

const FAQS = [
  {
    q: 'Google SEO ile Google Ads (Reklamlar) arasındaki fark nedir?',
    a: 'Google Ads ile her tıklama için para ödersiniz ve bütçe bittiğinde reklam durur. Google SEO ise sitenizi organik olarak ilk sayfaya taşır; gelen telefonlar için Google\'a hiçbir ücret ödemezsiniz ve etkisi kalıcıdır.'
  },
  {
    q: '1. sayfaya veya ilk sıralara ne kadar sürede çıkarız?',
    a: 'İlçe bazlı aramalarda (örn: /pendik-evden-eve-nakliyat) genellikle 3 ila 6 hafta içinde ilk sayfaya yükselme başlar. Ana kelimelerde kalıcı liderlik 2-3 aylık düzenli çalışmayla pekişir.'
  },
  {
    q: 'İç sayfa URL mimarisi neden bu kadar önemlidir?',
    a: 'Taşınmak isteyen kullanıcıların %85\'i kendi ilçesini arar. Sitenizde her ilçe için bağımsız optimize edilmiş sayfalar olduğunda Google sizi o ilçede 1 numara gösterir.'
  },
  {
    q: 'SEO çalışması bittiğinde sıralamam hemen düşer mi?',
    a: 'Hayır. Organik SEO teknik altyapı ve kaliteli içerik üzerine kurulduğu için kalıcıdır. Reklamlar gibi anında kesilmez.'
  }
];

export default function GoogleSeoPage() {
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
            <span className="text-[#111E38] font-bold">Google SEO</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#F95700] text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <Search className="w-4 h-4 text-[#F95700]" />
            <span>Google Organik 1. Sayfa Sıralaması</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Google Aramalarında İlk Sayfaya Çıkın, <span className="text-[#F95700]">Aracı Komisyonlarına Son</span> Verin
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Müşteriler &ldquo;Kadıköy evden eve nakliyat&rdquo; veya &ldquo;şehirlerarası nakliye&rdquo; aradığında doğrudan sizi bulsun. Reklam bütçesi harcamadan kalıcı telefon çağrıları kazanın.
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
              <span>SEO Paketlerini İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Şeffaf Sıra Takibi</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-600" /> 39 İlçe Mimarisi</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-orange-500" /> Kalıcı Organik Trafik</span>
          </div>

        </div>
      </section>

      {/* ── PACKAGES SECTION ── */}
      <section id="paketler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Aylık SEO Paketleri</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Hedefinize Uygun SEO Planını Seçin
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Taahhüt yok. Aylık düzenli çalışma, canlı sıra raporu ve garantili yükseliş.
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Neden Organik SEO?</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Taşımacılıkta 1. Sayfada Olmanın Gücü
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
            Google SEO Hakkında Sorular
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700] block mb-2">Hemen Sıralamanızı Yükseltin</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Web Sitenizin Ücretsiz SEO Analizini Yapalım
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Mevcut web sitenizi inceleyelim, eksiklerinizi ve rakiplerinizin önüne geçirecek adımları WhatsApp üzerinden paylaşalım.
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
              <span>WhatsApp ile Ücretsiz Analiz İste</span>
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
