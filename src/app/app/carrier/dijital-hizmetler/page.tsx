'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Globe, 
  Search, 
  MapPin, 
  Megaphone, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  Users,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const SERVICES_LIST = [
  {
    id: 'web-sitesi',
    title: 'Web Sitesi Hizmeti',
    subtitle: 'Mobil Uyumlu & Teklif Formlu Özel Tasarım',
    desc: 'Nakliyat firmanıza özel kurumsal, hızlı yüklenen, Google uyumlu ve müşterilerin doğrudan WhatsApp veya telefonla ulaşabildiği profesyonel web sitesi.',
    href: '/app/carrier/dijital-hizmetler/web-sitesi',
    icon: Globe,
    badge: 'En Çok Tercih Edilen',
    badgeColor: 'bg-orange-100 text-[#C23E00]',
    price: '3.500 TL\'den başlayan fiyatlarla',
    points: ['Domain & Hosting dahil', 'WhatsApp hızlı teklif butonu', 'Mobil & tablet %100 uyumlu', 'SEO altyapısı hazır']
  },
  {
    id: 'google-seo',
    title: 'Google SEO Hizmeti',
    subtitle: 'Şehrinizde Google Arama Sonuçlarında 1. Sayfa',
    desc: 'Google\'da \"evden eve nakliyat\", \"şehirlerarası nakliyat\" gibi aramalarda firmanızı üst sıralara taşıyarak komisyonsuz doğrudan müşteri kazandırıyoruz.',
    href: '/app/carrier/dijital-hizmetler/google-seo',
    icon: Search,
    badge: 'Organik Trafik',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    price: '1.500 TL / aylık',
    points: ['Anahtar kelime analizi', 'İl & ilçe bazlı yerel optimizasyon', 'Aylık şeffaf sıralama raporu', 'Rakiplerin önüne geçme garantisi']
  },
  {
    id: 'harita-seo',
    title: 'Harita SEO (Google Maps)',
    subtitle: 'Bölgenizdeki Müşterilerin İlk Tercihi Olun',
    desc: 'Google Haritalar işletme profilinizi doğrulayıp optimize ediyoruz. Yakınınızda nakliyeci arayan müşterilerin doğrudan sizi aramasını sağlıyoruz.',
    href: '/app/carrier/dijital-hizmetler/harita-seo',
    icon: MapPin,
    badge: 'Hızlı Çağrı',
    badgeColor: 'bg-blue-100 text-blue-800',
    price: '1.200 TL / tek seferlik kurulum',
    points: ['Google Business profil kurulumu', 'Harita kategori optimizasyonu', 'Olumlu yorum yönetimi kılavuzu', 'Doğrudan arama çağrısı artışı']
  },
  {
    id: 'google-reklamlari',
    title: 'Google Reklamları (Ads)',
    subtitle: 'Aynı Gün Telefonunuz Çalmaya Başlasın',
    desc: 'Taşınmak isteyen müşteriler arama yaptığı anda firmanız en tepede çıksın. Bütçenizi gereksiz tıklamalara harcamadan en doğru müşterilere ulaştırıyoruz.',
    href: '/app/carrier/dijital-hizmetler/google-reklamlari',
    icon: Megaphone,
    badge: 'Anında Müşteri',
    badgeColor: 'bg-purple-100 text-purple-800',
    price: 'Yönetim: 750 TL / ay + Reklam Bütçesi',
    points: ['Negatif anahtar kelime filtreleme', 'Dönüşüm odaklı arama reklamları', 'Haftalık harcama ve arama raporu', 'Yüksek teklif verme verimliliği']
  },
  {
    id: 'sosyal-medya',
    title: 'Sosyal Medya Reklamları',
    subtitle: 'Instagram & Facebook Hedefli Kampanyalar',
    desc: 'Ev taşıma döneminde olan, yeni ev kiralayan veya satın alan kullanıcılara özel hedefli video ve görsel reklamlarla marka bilinirliği ve müşteri toplayın.',
    href: '/app/carrier/dijital-hizmetler/sosyal-medya',
    icon: Share2,
    badge: 'Marka Değeri',
    badgeColor: 'bg-pink-100 text-pink-800',
    price: '1.800 TL / aylık',
    points: ['Özel tasarım video ve bannerlar', 'Yeni ev tutan hedef kitle seçimi', 'Instagram & Facebook entegrasyonu', 'Aylık performans raporu']
  }
];

export default function DijitalHizmetlerPage() {
  const router = useRouter();

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user || user.role !== 'CARRIER') {
      router.push('/giris?role=nakliyeci');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] border border-orange-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nakliyecilere Özel Dijital Ajans Çözümleri</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Dijital Hizmetler Merkezi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-3xl leading-relaxed">
            Firmanızı dijital dünyada güçlendirin. Web sitesi, Google arama sonuçları, harita sıralaması ve reklam yönetimiyle doğrudan müşteriye ulaşın, aracı komisyonlarından kurtulun.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <CarrierDigitalSidebar />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Value Proposition Hero Banner */}
            <div className="bg-gradient-to-r from-[#0A1128] via-[#132247] to-[#1E3264] text-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#F95700]/20 text-[#F95700] border border-[#F95700]/30 inline-block">
                  Komisyonsuz Kendi Müşterilerinizi Bulun
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Nakliyat firmanızı arayan müşteriler önce Google\'a bakar.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
                  Platformumuz üzerinden gelen işlerin yanı sıra, kendi kurumsal web siteniz ve Google reklamlarınızla her ay onlarca doğrudan taşıma işi bağlayın.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> %100 Memnuniyet Garantisi
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Nakliyat Sektörüne Özel Deneyim
                  </span>
                </div>
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="space-y-4">
              {SERVICES_LIST.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div 
                    key={svc.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-[#F95700]/60 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F95700] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-base sm:text-lg text-[#0A1128] group-hover:text-[#F95700] transition-colors">
                              {svc.title}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${svc.badgeColor}`}>
                              {svc.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-semibold">{svc.subtitle}</p>
                          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed pt-1 max-w-2xl">
                            {svc.desc}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <span className="text-xs font-bold text-[#F95700] block">{svc.price}</span>
                        <Link href={svc.href} className="inline-block mt-2">
                          <Button variant="outline" size="sm" className="font-bold text-xs group-hover:bg-[#F95700] group-hover:text-white group-hover:border-[#F95700] transition-all">
                            Detayları İncele →
                          </Button>
                        </Link>
                      </div>

                    </div>

                    {/* Feature Points */}
                    <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {svc.points.map((pt, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
