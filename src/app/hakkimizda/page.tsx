import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  Award,
  Users,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  HeartHandshake,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Hakkımızda & Vizyonumuz',
  description: 'TaşınTeklif nedir? Türkiye genelinde 81 ilde K3 belgeli nakliyecileri ve taşınmak isteyen müşterileri buluşturan komisyonsuz yeni nesil nakliyat pazaryeri.',
  alternates: {
    canonical: '/hakkimizda',
  },
};

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Kurumsal', url: '/hakkimizda' },
                { name: 'Hakkımızda', url: '/hakkimizda' },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Güvenilir Nakliyat Vizyonu</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              Taşınmanın En Şeffaf &amp; <br />
              <span className="text-[#F95700]">Güvenilir Platformu</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              TaşınTeklif; taşınma sektöründeki belgesiz aracılık, son dakika ek masrafları ve iletişimsizlik sorunlarını çözmek amacıyla kurulmuş tarafsız teknoloji platformudur.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111E38]">%100 Belge Doğrulama</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sistemimizdeki tüm nakliye şirketlerinin Ulaştırma Bakanlığı K3 Yetki Belgesi, Vergi Levhası ve Adli Sicili operasyon ekibimizce titizlikle incelenir.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111E38]">%0 Aracı Komisyonu</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Müşterilerden de nakliyecilerden de taşıma bedeli üzerinden komisyon almıyoruz. Müşteri doğrudan nakliyeciyle el sıkışır, sürpriz yaşamaz.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#111E38]">Nakliyeci Defteri Borsası</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Meslektaşlar arası boş dönüş ve parsiyel yük paylaşımı sağlayarak kamyonların boş dönmesini önlüyor, karbon ayak izini ve taşıma maliyetini düşürüyoruz.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">Rakamlarla TaşınTeklif</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-[#F95700] block">81 İl</span>
              <span className="text-xs text-slate-300">Tüm Türkiye Kapsamı</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-[#F95700] block">10.000+</span>
              <span className="text-xs text-slate-300">Mutlu Taşınma</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-[#F95700] block">500+</span>
              <span className="text-xs text-slate-300">Onaylı K3 Nakliyeci</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-[#F95700] block">4.8 / 5</span>
              <span className="text-xs text-slate-300">Müşteri Memnuniyeti</span>
            </div>
          </div>
        </div>

        {/* Ekibimiz Teaser Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">
              Çekirdek Kadromuz
            </span>
            <h3 className="text-2xl font-black text-[#111E38] tracking-tight">
              TaşınTeklif&apos;in Arkasındaki Ekiple Tanışın
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Lojistik yöneticileri, yazılım mimarları, operasyon uzmanları ve müşteri danışmanlarımızla 81 ilde kesintisiz hizmet sunuyoruz.
            </p>
          </div>

          <Link
            href="/ekibimiz"
            className="px-6 py-3.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <Users className="w-4 h-4" />
            <span>Ekibimiz Sayfasını İncele</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
