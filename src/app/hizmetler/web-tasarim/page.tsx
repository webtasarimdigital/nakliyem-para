'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  PhoneCall, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Laptop,
  Smartphone,
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
    ? `Merhaba, TaşınTeklif üzerinden Nakliyat Web Sitesi (${packageName}) hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`
    : `Merhaba, TaşınTeklif üzerinden Nakliyat Web Sitesi Tasarımı hakkında detaylı bilgi ve fiyat teklifi almak istiyorum.`;
  return `https://wa.me/${DUBAI_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

const PACKAGES = [
  {
    name: 'Başlangıç Web Sitesi',
    desc: 'Bireysel ve tek araçlı nakliyeciler için kurumsal dijital vitrin',
    price: '3.500 TL',
    period: 'tek seferlik',
    isFeatured: false,
    badge: null,
    features: [
      '5 Temel Sayfa (Ana Sayfa, Hakkımızda, Hizmetler, Filo, İletişim)',
      '.com veya .com.tr Alan Adı (1 Yıl Ücretsiz Dahil)',
      'Yüksek Hızlı SSL Korumalı Kurumsal Hosting',
      'WhatsApp & Tek Tıkla Ara Çağrı Butonları',
      'Mobil, Tablet & Masaüstü %100 Uyumlu Tasarım',
      'Google Harita ve İşletme Konumu Entegrasyonu'
    ]
  },
  {
    name: 'Profesyonel SEO Nakliyat Sitesi',
    desc: 'İlçe aramalarından doğrudan müşteri toplamak isteyen nakliyat firmaları',
    price: '6.500 TL',
    period: 'tek seferlik',
    isFeatured: true,
    badge: 'EN ÇOK TERCİH EDİLEN',
    features: [
      '39 İlçe İçin Özel SEO Uyumlu URL İç Sayfaları (örn: /kadikoy-nakliyat)',
      'Şehirlerarası Rota Sayfaları (İstanbul - Ankara, İzmir vb.)',
      'Canlı Nakliyat Fiyat Hesaplama Modülü (Oda ve Mesafe Bazlı)',
      '0.8 Saniye Ultra Hızlı Açılış (Google Core Web Vitals 100/100)',
      'Google Schema Taşımacılık İşletme Zengin Sonuç Yapısı',
      'Sınırsız Araç ve Referans Fotoğrafı Ekleme Paneli',
      '1 Yıllık Kurumsal Hosting, SSL ve 5 Adet Kurumsal E-posta'
    ]
  },
  {
    name: 'Kurumsal Filo & Lojistik Portalı',
    desc: 'Çok şubeli, geniş araç filolu ve Türkiye geneli çalışan lojistik firmaları',
    price: '12.000 TL',
    period: 'tek seferlik',
    isFeatured: false,
    badge: 'FİLOLAR İÇİN',
    features: [
      '81 İl ve Tüm İlçeler İçin Dinamik SEO URL Sayfa Mimarisi',
      'Online Talep Toplama & Canlı Teklif Verme Altyapısı',
      'Gelişmiş Çoklu Şube ve Garaj Konumları Haritası',
      'Özel Müşteri Yorum & Güven Doğrulama Modülü',
      'Google Ads ve Meta Piksel Tam Dönüşüm Takip Entegrasyonu',
      'Öncelikli 7/24 Teknik Destek & Yedekleme Garantisi'
    ]
  }
];

const FEATURES_GRID = [
  {
    title: '0.8 Saniye Ultra Hızlı Açılış',
    desc: 'Ağır WordPress temaları yerine modern ve ultra hızlı kod altyapısıyla siteniz göz açıp kapayıncaya kadar açılır. Google hız testlerinden tam puan alır.',
    icon: Zap
  },
  {
    title: '39 İlçe Özel URL Mimarisi',
    desc: 'Kadıköy, Beşiktaş, Ümraniye... Her ilçe için özel hazırlanmış SEO sayfaları sayesinde bölgesel aramalarda rakiplerinizin hemen önüne geçersiniz.',
    icon: Globe
  },
  {
    title: 'WhatsApp & Tek Tıkla Arama',
    desc: 'Sitenize giren ziyaretçi doğrudan cep telefonunuza veya WhatsApp hattınıza yönlendirilir. Form doldurma zahmeti olmadan anında işi bağlarsınız.',
    icon: PhoneCall
  },
  {
    title: 'Canlı Fiyat Hesaplayıcı',
    desc: 'Müşteriler oda sayısı (1+1, 2+1, 3+1) ve mesafe seçerek anında tahmini fiyat alabilir, teklif talebini WhatsApp üzerinden size ulaştırabilir.',
    icon: Laptop
  },
  {
    title: 'Google Schema Zengin Sonuçlar',
    desc: 'Google arama sonuçlarında firma puanınız, çalışma saatleriniz ve hizmet bölgeleriniz zengin snippet olarak yıldızlarla listelenir.',
    icon: Star
  },
  {
    title: 'Kolay Türkçe Panel',
    desc: 'Telefonunuzdan araç fotoğraflarınızı yükleyebilir, yeni referanslar ekleyebilir ve telefon numaranızı istediğiniz zaman güncelleyebilirsiniz.',
    icon: Layers
  }
];

const FAQS = [
  {
    q: 'Sitem ne kadar sürede tamamlanıp teslim edilir?',
    a: 'Alan adı kaydı, SSL kurulumu, 39 ilçe SEO sayfaları ve içerikler ortalama 3 ila 5 iş günü içinde eksiksiz olarak yayına alınır. WhatsApp ve telefon numaralarınız test edilerek teslim edilir.'
  },
  {
    q: 'Web sitem Google\'da ilçe aramalarında nasıl çıkar?',
    a: 'Siteniz sadece ana sayfadan ibaret olmaz; her ilçe ve güzergah için özel optimize edilmiş URL\'ler oluşturulur (örn: /kadikoy-evden-eve-nakliyat, /ankara-sehirlerarasi-nakliyat). Google botları bu sayfaları indekslediğinde, o ilçeden arayan müşteriler doğrudan sizin sayfanıza ulaşır.'
  },
  {
    q: 'Telefonumdan web sitesindeki yazıları veya araç resimlerini değiştirebilir miyim?',
    a: 'Evet. Size teslim edeceğimiz Türkçe yönetim panelinden yeni kamyonlarınızın fotoğraflarını, telefon numaranızı ve referanslarınızı 1 dakikada güncelleyebilirsiniz.'
  },
  {
    q: 'Hosting ve domain için sonraki yıl ne kadar öderim?',
    a: 'İlk yıl tüm alan adı, SSL ve hosting ücretleri pakete dahildir. Sonraki yıllarda sadece yıllık standart sunucu barındırma ve domain yenileme maliyeti yansıtılır, gizli ücret çıkmaz.'
  }
];

export default function WebTasarimPage() {
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
            <span className="text-[#111E38] font-bold">Web Sitesi Tasarımı</span>
          </nav>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/20 to-[#F8FAFC] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#F95700] text-xs font-black tracking-wide uppercase mb-6 shadow-xs">
            <Globe className="w-4 h-4 text-[#F95700]" />
            <span>Nakliyat Sektörüne Özel Web Tasarım</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111E38] tracking-tight leading-tight max-w-4xl mx-auto">
            Telefonunuzu Çaldıran, <span className="text-[#F95700]">Komisyonsuz Müşteri Kazandıran</span> Web Siteleri
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            0.8 saniyede açılan, mobil uyumlu, tek tıkla arama ve WhatsApp teklif butonlu profesyonel nakliyat web siteleriyle bölgenizin lider firması olun.
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
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> 3-5 Günde Teslim</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-orange-500" /> 0.8 sn Ultra Hız</span>
            <span className="flex items-center gap-1.5"><Smartphone className="w-4 h-4 text-blue-600" /> %100 Mobil Uyumlu</span>
          </div>

        </div>
      </section>

      {/* ── PACKAGES SECTION ── */}
      <section id="paketler" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Şeffaf Fiyatlandırma</span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
            İhtiyacınıza Uygun Web Sitesi Paketleri
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Gizli masraf yok. Domain, hosting, SSL ve SEO altyapısı fiyata dahildir.
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
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paket Kapsamı</span>
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

      {/* ── FEATURES GRID ── */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Teknik Üstünlükler</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight mt-1">
              Nakliyat Sektörüne Özel Çözümler
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Sıradan siteler müşteri kaybettirir. TaşınTeklif altyapısı telefon çağrısı ve rezervasyon getirmek için tasarlandı.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES_GRID.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-orange-200 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-[#111E38] tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQS ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">Aklınızda Kalmasın</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight mt-1">
            Sıkça Sorulan Sorular
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

      {/* ── DUBAI WHATSAPP CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700] block mb-2">Hemen Başlayalım</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Firmanız İçin Modern Bir Web Sitesi İstiyor Musunuz?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Dubai destek hattımızla görüşün, firmanızın alan adını kontrol edelim ve 3 gün içinde sitenizi yayına alalım.
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
              <span>WhatsApp ile Hemen Yazın</span>
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
