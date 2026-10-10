'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  Video, 
  Target,
  MessageCircle,
  Check,
  ChevronRight,
  MessageSquare,
  Award,
  ChevronDown,
  Headphones,
  Users
} from 'lucide-react';

const DUBAI_WA_NUMBER = '971585188543';

const createWhatsAppLink = (packageName?: string) => {
  const text = packageName
    ? `Merhaba, TaşınTeklif üzerinden Sosyal Medya Reklamları (${packageName}) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Merhaba, TaşınTeklif üzerinden Sosyal Medya Reklam Yönetimi hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

const PACKAGES = [
  {
    name: "Sosyal Medya Başlangıç",
    desc: "Instagram'da kurumsal profil görünümü ve ilk reklamını vermek isteyenler",
    price: "1.250 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: null,
    features: [
      "Meta Business Kurumsal Reklam Hesabı Kurulumu",
      "Instagram & Facebook Sayfası Profesyonel Düzenleme",
      "Bölgesel Hedefleme (Şehir & İlçe Odaklı Reklam)",
      "WhatsApp'a Doğrudan Bağlanan İlan Formatı",
      "Aylık Harcama & Gelen Mesaj Raporu"
    ]
  },
  {
    name: "Profesyonel Büyüme & Lead",
    desc: "Her hafta düzenli evden eve taşıma rezervasyonu almak isteyen nakliyeciler",
    price: "2.250 TL",
    period: "/ ay (yönetim)",
    isFeatured: true,
    badge: "EN ÇOK TERCİH EDİLEN",
    features: [
      "Yeni Ev Arayanlar & Taşınma Hazırlığındaki Kitle Hedeflemesi",
      "8 Adet Profesyonel Nakliyat Reklam Görseli & Metin Hazırlığı",
      "Instagram Reels & Hikaye (Story) Özel Video Reklamları",
      "A/B Testleri ile En Düşük Mesaj Başı Maliyet Optimizasyonu",
      "Doğrudan WhatsApp Butonu ile Anında Teklif Verme Akışı",
      "Haftalık Canlı Performans & Mesaj Takip Raporu"
    ]
  },
  {
    name: "Tam Kapsamlı Sosyal Medya & Filo",
    desc: "Bölgesinde marka olmak ve sürekli rezervasyon doldurmak isteyen büyük filolar",
    price: "3.750 TL",
    period: "/ ay (yönetim)",
    isFeatured: false,
    badge: "FİLOLAR İÇİN",
    features: [
      "Tüm Türkiye veya Çoklu Şehir Seferleri İçin Geniş Reklam Kampanyası",
      "Aylık 16 Adet Özel Tasarım Görsel + Reels Video Kurgusu",
      "Müşteri Yorum & Güven Videoları Sponsorlu Yayını",
      "Yeniden Pazarlama (Retargeting) ile Sayfayı Gezenleri Geri Kazanma",
      "Özel Sosyal Medya Danışmanı & 7/24 Kampanya Optimizasyonu"
    ]
  }
];

const ADVANTAGES = [
  {
    title: "Taşınmaya Hazırlanan Kitle",
    desc: "Yeni ev kiralayan, ev satın alan veya mobilya bakan kullanıcılara nokta atışı demografik hedeflemeyle ulaşırız.",
    icon: Target
  },
  {
    title: "Reels & Video Gücü",
    desc: "Asansörlü taşımacılık, profesyonel paketleme ve temiz araç filonuzu gösteren videolar müşteride %100 güven oluşturur.",
    icon: Video
  },
  {
    title: "Tek Tıkla WhatsApp Mesajı",
    desc: "Kullanıcı reklamı gördüğü an tek tıkla doğrudan WhatsApp hattınıza 'Merhaba, teklif almak istiyorum' mesajı atar.",
    icon: MessageCircle
  },
  {
    title: "Marka Bilinirliği & Güven",
    desc: "Bölgenizde binlerce kişiye firmanızın adını duyurarak en çok bilinen ve aranan nakliye şirketi haline gelirsiniz.",
    icon: Star
  }
];

const FAQS = [
  {
    q: "Instagram reklamlarında bütçeyi kime ödüyorum?",
    a: "Reklam harcamanızı doğrudan kendi kredi kartınızla Meta (Facebook/Instagram) şirketine ödersiniz. Biz hedef kitle belirleme, reklam tasarımı, metin yazımı ve mesaj maliyetlerini düşürme danışmanlığı sağlarız."
  },
  {
    q: "Gelen mesajlar nereye düşüyor?",
    a: "Reklama tıklayan müşteriler doğrudan firmanızın WhatsApp hattına yönlendirilir. Müşteriyle anında konuşup evinin oda sayısını ve taşınma tarihini öğrenerek fiyat verebilirsiniz."
  },
  {
    q: "Görselleri ve videoları kim hazırlıyor?",
    a: "Firmanızın araç ve taşıma fotoğraflarını bize iletmeniz yeterli. Profesyonel tasarım ekibimiz afişleri, kampanya sloganlarını ve video kurgularını sizin için hazırlar."
  },
  {
    q: "Sosyal medya reklamları ne kadar sürede sonuç verir?",
    a: "Reklamlar yayına girdikten birkaç saat sonra bölgenizdeki kullanıcıların akışında görünmeye başlar ve aynı gün ilk WhatsApp mesajları gelmeye başlar."
  }
];

export default function SosyalMedyaPage() {
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
            <span className="text-[#111E38] font-bold">Sosyal Medya Reklamları</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <Share2 className="w-4 h-4 text-pink-600" />
            <span>Instagram & Meta Nakliyat Reklamları</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Yeni Ev Arayanları Yakalayın, <span className="text-[#F95700]">WhatsApp&apos;tan Anında</span> Teklif Verin
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Instagram Reels ve video reklamlarla taşınmaya hazırlanan kişilere tam zamanında ulaşın. Güven veren paylaşımlarla aracısız rezervasyon toplayın.
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
              <span>Paketleri İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-pink-600" /> Reels & Afiş Tasarımı</span>
            <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4 text-emerald-600" /> Doğrudan WhatsApp</span>
            <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-600" /> Nokta Atışı Kitle</span>
          </div>

        </div>
      </section>

      {/* ── PACKAGES SECTION ── */}
      <section id="paketler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Sosyal Medya Paketleri</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Hedefinize Uygun Kampanya Planı
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Aylık şeffaf yönetim. Reklam afişleri ve video kurguları ekibimiz tarafından hazırlanır.
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Görsel Güç</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Sosyal Medyada Güven Kazanın
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
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
            Sosyal Medya Reklamları Hakkında Sorular
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700] block mb-2">Hemen Başlayalım</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Instagram Reklamlarınızı Bugün Yayına Alalım
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Araç resimlerinizi ve logo dosyanızı WhatsApp&apos;tan iletin, afiş ve video kurgularınızı hazırlayıp reklamınızı başlatalım.
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
              <span>WhatsApp ile Reklam Başlat</span>
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
