'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  Navigation, 
  Target,
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
    ? `Merhaba, TaşınTeklif üzerinden Harita SEO (${packageName}) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Merhaba, TaşınTeklif üzerinden Harita SEO (Google Maps) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

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

const ADVANTAGES = [
  {
    title: 'Doğrudan Arama Çağrısı',
    desc: 'Haritalarda çıkan müşteriler sitenizde dolaşmadan tek tuşla "Ara" butonuna tıklar. Sıcak ve acil taşınacak müşteriye ilk siz ulaşırsınız.',
    icon: PhoneCall
  },
  {
    title: 'Local 3-Pack Önceliği',
    desc: 'Google aramalarında web sitelerinden bile önce gelen 3 harita kutusunda yer alarak tüm rakiplerinizi geride bırakırsınız.',
    icon: Navigation
  },
  {
    title: 'Yüksek Güven & 5 Yıldız',
    desc: 'Doğrulanmış resmi işletme rozeti ve gerçek müşteri yorumları sayesinde müşterilerin teklifinizi hemen kabul etmesini sağlar.',
    icon: Star
  },
  {
    title: 'Sıfır Komisyon',
    desc: 'Harita aramalarından gelen müşteriler için aracı platformlara hiçbir komisyon ödemezsiniz; tüm gelir kasanızda kalır.',
    icon: ShieldCheck
  }
];

const FAQS = [
  {
    q: 'Google Haritalar\'da üst sıralara çıkmak neden bu kadar önemli?',
    a: 'Telefonundan "en yakın nakliyeci" veya "Kadıköy evden eve nakliyat" araması yapan müşterilerin %78\'i doğrudan harita sonuçlarında ilk 3 sırada çıkan firmayı arar. Haritada üst sırada olmak, her gün ücretsiz onlarca doğrudan telefon çağrısı demektir.'
  },
  {
    q: 'Google İşletme Profilim askıya alındıysa (suspension) düzeltebilir misiniz?',
    a: 'Evet. Resmi K3/K1 yetki belgeleriniz ve vergi levhanızla Google Business Destek ekibine doğrudan itiraz dosyası hazırlayarak askıdaki profilinizi tekrar aktif hale getirebiliyoruz.'
  },
  {
    q: 'Olumsuz veya sahte rakip yorumlarını sildirebilir miyiz?',
    a: 'Google Topluluk Kuralları\'nı ihlal eden asılsız, küfürlü veya rakipler tarafından kasıtlı atılan sahte yorumları raporlayıp kaldırılması için yasal süreçleri işletiyoruz.'
  },
  {
    q: 'Birden fazla şubemiz veya garajımız varsa ne yapmalıyız?',
    a: 'Her ilçe veya garajınız için ayrı optimize edilmiş lokasyon profilleri kurup hepsini tek bir kurumsal ana işletme hesabında birbirine bağlayarak bölgesel dominasyon sağlıyoruz.'
  }
];

export default function HaritaSeoPage() {
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
            <span className="text-[#111E38] font-bold">Harita SEO (Google Maps)</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Google Haritalar & Yerel İşletme Görünürlüğü</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Bölgenizde Haritada İlk 3 Sıraya Çıkın, <span className="text-[#F95700]">Telefonunuz Doğrudan</span> Çalsın
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Yakınınızda evden eve nakliyeci arayan müşteriler harita sonuçlarında sizi görsün. Tek tuşla arama ve rota alma özellikleriyle sıcak müşterileri anında yakalayın.
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
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Profil Doğrulama</span>
            <span className="flex items-center gap-1.5"><Navigation className="w-4 h-4 text-blue-600" /> İlk 3 Sıra Hedefi</span>
            <span className="flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-orange-500" /> Doğrudan Arama Artışı</span>
          </div>

        </div>
      </section>

      {/* ── PACKAGES SECTION ── */}
      <section id="paketler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Harita SEO Paketleri</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            Bölgenize Uygun Harita Planı
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            İlçe veya şehir geneli harita sıralamanızı yükseltip telefon çağrılarınızı katlayın.
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Harita Görünürlüğü</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Google Maps&apos;te Lider Olmanın Avantajları
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
            Google Haritalar Hakkında Sorular
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
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700] block mb-2">Haritanızı Canlandıralım</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Google Harita Profilinizin Ücretsiz Durum Raporunu Alın
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              İşletme profilinizin eksiklerini, kategori hatalarını ve haritada ilk 3 sıraya çıkış adımlarını analiz edip WhatsApp&apos;tan paylaşalım.
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
              <span>WhatsApp ile Ücretsiz Harita Analizi</span>
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
