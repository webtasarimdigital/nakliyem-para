'use client';

import React, { useEffect } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CarrierDigitalSidebar } from '@/components/layout/CarrierDigitalSidebar';
import { db } from '@/lib/data/mock-db';

const PACKAGES = [
  {
    "name": "Başlangıç Web",
    "desc": "Bireysel ve küçük ölçekli nakliyeciler için",
    "price": "3.500 TL",
    "period": "tek seferlik",
    "isFeatured": false,
    "features": [
      "5 Sayfa Özel Tasarım",
      ".com / .com.tr Domain Dahil",
      "1 Yıl Yüksek Hızlı Hosting",
      "WhatsApp Hızlı Teklif Butonu",
      "Mobil & Tablet %100 Uyum"
    ]
  },
  {
    "name": "Profesyonel Web",
    "desc": "Şehirlerarası nakliyat firmaları için ideal",
    "price": "6.500 TL",
    "period": "tek seferlik",
    "isFeatured": true,
    "features": [
      "10 Sayfa Kurumsal Tasarım",
      "Fiyat Hesaplama & Teklif Formu",
      "Google Harita & SEO Altyapısı",
      "Kurumsal E-Posta Hesapları",
      "7/24 Kesintisiz Destek",
      "SSL Güvenlik Sertifikası"
    ]
  },
  {
    "name": "Kurumsal VIP",
    "desc": "Geniş araç filosu olan büyük lojistik firmaları",
    "price": "12.000 TL",
    "period": "tek seferlik",
    "isFeatured": false,
    "features": [
      "Sınırsız Sayfa & Blog Yönetimi",
      "Çoklu İl & İlçe Sayfaları",
      "Müşteri Yorum Modülü",
      "Google Reklam Entegrasyonu",
      "1 Yıl Ücretsiz Bakım & Güncelleme"
    ]
  }
];
const FEATURES = [
  {
    "title": "Nakliyat Odaklı Tasarım",
    "desc": "Genel değil, sadece evden eve ve eşya taşıma sektörüne özel dönüşüm odaklı şablonlar."
  },
  {
    "title": "Anında Çağrı Alın",
    "desc": "Sitenize giren müşteri tek tıkla doğrudan yetkili numaranızı arar veya WhatsApp yazar."
  },
  {
    "title": "Hızlı ve Güvenli",
    "desc": "1 saniyenin altında açılan modern Next.js mimarisiyle Google hız puanı 95+."
  },
  {
    "title": "Tam Yönetim",
    "desc": "İçerikleri, fotoğrafları ve referanslarınızı kolayca güncelleyebileceğiniz sade yönetim."
  }
];

export default function SubServicePage() {
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
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
          <Link href="/app/carrier/dijital-hizmetler" className="hover:text-[#F95700]">Dijital Hizmetler</Link>
          <span>/</span>
          <span className="text-[#0A1128] font-bold">Web Sitesi Hizmeti</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] border border-orange-200 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mobil Uyumlu Özel Tasarım</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] tracking-tight">
            Web Sitesi Hizmeti
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-3xl leading-relaxed">
            Nakliyat firmanıza özel kurumsal, hızlı yüklenen, Google uyumlu ve müşterilerin doğrudan WhatsApp veya telefonla ulaşabildiği profesyonel web sitesi.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-4">
            <CarrierDigitalSidebar />
          </div>

          <div className="lg:col-span-8 space-y-6">
            
            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PACKAGES.map((pkg, idx) => (
                <div 
                  key={idx}
                  className={`rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between border-2 ${
                    pkg.isFeatured
                      ? 'bg-white border-[#F95700] shadow-md relative'
                      : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {pkg.isFeatured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F95700] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      En Çok Tercih Edilen
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-black text-base text-[#0A1128]">{pkg.name}</h3>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{pkg.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-2xl font-black text-[#0A1128]">{pkg.price}</span>
                      {pkg.period && <span className="text-xs text-slate-400 font-bold ml-1">{pkg.period}</span>}
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-100">
                      {pkg.features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
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
                        Hemen Başla →
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Why Choose Us Features */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0A1128]">Neden NakliyemPara Dijital Çözümleri?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {FEATURES.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center shrink-0 font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#0A1128]">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-[#0A1128] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-bold text-[#F95700] uppercase tracking-wider">Ücretsiz Danışmanlık</span>
                <h3 className="text-xl font-black text-white">Kararsız mısınız? Uzmanımızla Görüşün</h3>
                <p className="text-xs text-slate-300 font-normal max-w-md">
                  Firmanızın mevcut dijital durumunu analiz edelim, bütçenize en uygun büyüme planını birlikte çizelim.
                </p>
              </div>
              <a 
                href="https://wa.me/908503080000?text=Merhaba,%20dijital%20hizmetler%20ücretsiz%20danışmanlık%20için%20yazıyorum." 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="primary" size="lg" className="font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-orange-950/20" leftIcon={<PhoneCall className="w-4 h-4" />}>
                  WhatsApp Destek Hattı
                </Button>
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
