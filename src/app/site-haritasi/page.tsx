import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Compass, 
  Truck, 
  Calculator, 
  MapPin, 
  BookOpen, 
  Building2, 
  Scale, 
  HelpCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { BLOG_POSTS } from '@/lib/data/blog-posts';
import { INTERCITY_ROUTES } from '@/lib/data/routes-data';

export const metadata: Metadata = {
  title: 'Site Haritası — Tüm Sayfalar, Şehirler ve Nakliyat Hizmetleri',
  description: 'TaşınTeklif üzerindeki tüm sayfalar tek yerde: evden eve nakliyat, şehirlerarası rotalar, 81 il firma rehberleri, hesaplayıcılar, blog ve kurumsal sayfalar.',
  keywords: ['taşınteklif site haritası', 'nakliyat sayfaları', '81 il evden eve nakliyat', 'nakliyat firmaları dizini'],
  alternates: {
    canonical: '/site-haritasi',
  },
};

export default function SiteHaritasiPage() {
  const breadcrumbItems = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Site Haritası', url: '/site-haritasi' },
  ];

  const siteMapSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Site Haritası — TaşınTeklif',
    description: 'TaşınTeklif üzerindeki tüm nakliyat hizmetleri, 81 il rehberleri ve araçlar.',
    url: 'https://tasinteklif.com/site-haritasi',
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <JsonLd data={siteMapSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#F95700] text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>İç Linkleme &amp; Dizin Merkezi</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111E38] tracking-tight">
              Site Haritası
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              TaşınTeklif üzerindeki tüm sayfalar tek yerde — evden eve nakliyat çözümleri, 81 il firma rehberleri, 
              popüler şehirlerarası rotalar, hesaplayıcı araçlar ve kurumsal sayfalar.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-500">
              <span className="px-3 py-1 bg-slate-100 rounded-lg">✓ 580+ İndekslenebilir Sayfa</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg">✓ 81 İl Nakliyat Dizini</span>
              <span className="px-3 py-1 bg-slate-100 rounded-lg">✓ 2026 Güncel Veriler</span>
            </div>
          </div>
        </div>

        {/* Main Grid: 6 Categorized Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* 1. Ana Hizmetlerimiz */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Ana Nakliyat Hizmetleri</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/evden-eve-nakliyat" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Evden Eve Nakliyat</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/ofis-tasima" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Ofis &amp; Kurumsal Taşıma</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/parca-esya-tasima" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Parça Eşya Taşıma</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/esya-depolama" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Eşya Depolama Hizmeti</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyat-firmalari" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Tüm Nakliyat Firmaları Dizini</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/fiyatlar" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>2026 Taşınma Fiyat Tarifeleri</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <Link href="/teklif-al" className="text-xs font-black text-[#F95700] flex items-center gap-1.5 hover:gap-2 transition-all">
                Hemen Ücretsiz Teklif Al <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 2. Hesaplayıcılar & Araçlar */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Hesaplayıcılar &amp; Araçlar</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/fiyatlar" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span className="font-bold text-[#F95700]">2026 Fiyatlar &amp; Paketler</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/mesafe-hesaplama" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Mesafe &amp; Fiyat Hesaplayıcı</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/teklif-al" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Taşıma Talebi Oluştur</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/talepler" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Canlı Nakliyat Talepleri Havuzu</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyeci-defteri" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nakliyeci Defteri (Boş Araç &amp; Yük)</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/pazaryeri" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Pazaryeri &amp; Asansör Kiralama</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/pazaryeri/ilan-ver" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Pazaryeri İlanı Ekle</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <Link href="/mesafe-hesaplama" className="text-xs font-black text-blue-600 flex items-center gap-1.5 hover:gap-2 transition-all">
                Mesafe &amp; Maliyet Hesapla <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 3. Popüler Şehirlerarası Rotalar */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Şehirlerarası Rotalar</h2>
              </div>
              <ul className="space-y-3">
                {INTERCITY_ROUTES.map(route => (
                  <li key={route.slug}>
                    <Link href={`/rota/${route.slug}`} className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                      <span>{route.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <Link href="/rota/istanbul-ankara-nakliyat" className="text-xs font-black text-emerald-600 flex items-center gap-1.5 hover:gap-2 transition-all">
                İstanbul-Ankara Rota Detayı <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 4. Blog & Taşınma Rehberi */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Taşınma Rehberi &amp; Blog</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span className="font-bold text-purple-700">Tüm Blog Yazıları</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyat-rehberi" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Adım Adım Taşınma Rehberi</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                {BLOG_POSTS.map(post => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-[#F95700] transition-colors">
                      <span className="truncate pr-2">{post.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F95700] shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <Link href="/blog" className="text-xs font-black text-purple-600 flex items-center gap-1.5 hover:gap-2 transition-all">
                Tüm Rehberleri Oku <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 5. Kurumsal & Platform */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Kurumsal &amp; Platform</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/hakkimizda" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Hakkımızda</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nasil-calisir" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nasıl Çalışır?</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyeciler-icin" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nakliyeciler İçin Avantajlar</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/musteriler-icin" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Müşteriler İçin Güvenceler</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/paketler" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nakliyeci Üyelik Paketleri</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyeciler" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nakliyeci Ol (Kayıt)</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>İletişim &amp; Destek</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <Link href="/hakkimizda" className="text-xs font-black text-amber-600 flex items-center gap-1.5 hover:gap-2 transition-all">
                TaşınTeklif Hakkında Bilgi <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 6. Yasal & Sözleşmeler */}
          <section className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#111E38]">Yasal &amp; Güvenlik</h2>
              </div>
              <ul className="space-y-3">
                <li>
                  <Link href="/kullanim-kosullari" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Kullanım Koşulları</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/gizlilik" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Gizlilik Politikası</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/kvkk" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>KVKK Aydınlatma Metni</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/cerez-politikasi" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Çerez Politikası</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
                <li>
                  <Link href="/nakliyeci-sozlesmesi" className="group flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-[#F95700] transition-colors">
                    <span>Nakliyeci Taşıma Sözleşmesi</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#F95700] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="pt-5 mt-6 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 6698 Sayılı KVKK Uyumlu
              </span>
            </div>
          </section>

        </div>

        {/* 81 İl Nakliyat Firmaları Dizini (Direct Crawl Links) */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#F95700] uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4" />
                <span>81 İl Kapsamında Yerel Hizmet</span>
              </div>
              <h2 className="text-2xl font-black text-[#111E38]">
                Şehirlere Göre Nakliyat Firmaları
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Türkiye&apos;nin 81 ilindeki K3 belgeli, sigortalı ve müşteri puanlı evden eve nakliyat firmalarını inceleyin.
              </p>
            </div>
            <Link
              href="/nakliyat-firmalari"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-[#F95700] font-bold text-xs hover:bg-[#F95700] hover:text-white transition-all shrink-0"
            >
              Tüm Firmalar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 81 Cities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TURKEY_CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/nakliyat-firmalari/${city.slug}`}
                className="group p-2.5 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-xs font-bold text-slate-700 hover:text-[#F95700] flex items-center justify-between"
              >
                <span className="truncate">{city.name}</span>
                <span className="text-[10px] text-slate-400 font-normal group-hover:text-[#F95700]">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 81 İl Ortalama Fiyat Rehberleri */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>İl Bazlı Fiyat Tarifeleri</span>
              </div>
              <h2 className="text-2xl font-black text-[#111E38]">
                Şehirlere Göre Nakliyat Fiyatları (2026)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Her ilin yerel rayiçleri, ortalama 1+1, 2+1, 3+1 ev taşıma maliyetleri ve tasarruf önerileri.
              </p>
            </div>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all shrink-0"
            >
              Genel Fiyat Listesi <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 81 Cities Price Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TURKEY_CITIES.map(city => (
              <Link
                key={city.slug}
                href={`/nakliyat-fiyatlari/${city.slug}`}
                className="group p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center justify-between"
              >
                <span className="truncate">{city.name} Fiyatları</span>
                <span className="text-[10px] text-slate-400 font-normal group-hover:text-emerald-700">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Emlivo Style Support & Callout Card (.sup box) */}
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F95700]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-orange-300 text-xs font-bold tracking-wider uppercase border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F95700]" />
              7/24 Taşınma ve Destek Hattı
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Aklınıza takılan bir soru mu var?<br />
              <span className="text-[#F95700]">Uzman ekibimiz bir tık uzağınızda.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              İster müşteri olun teklif almak isteyin, ister nakliyeci olun iş ağımıza katılmak isteyin; 
              haftanın 7 günü sorularınızı yanıtlamaya hazırız.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/teklif-al"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#F95700] hover:bg-orange-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Ücretsiz Teklif Al</span>
              </Link>

              <a
                href="mailto:bilgi@tasinteklif.com"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-orange-400" />
                <span>bilgi@tasinteklif.com</span>
              </a>

              <Link
                href="/iletisim"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white text-[#111E38] hover:bg-slate-100 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#F95700]" />
                <span>İletişime Geç</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
