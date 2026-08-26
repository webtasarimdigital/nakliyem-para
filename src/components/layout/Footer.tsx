import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

export const Footer: React.FC = () => {
  const popularCities = TURKEY_CITIES.filter(c => c.isPopular).slice(0, 8);

  return (
    <footer className="bg-[#0D1B2A] text-white pt-14 pb-20 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#146EF5] text-white flex items-center justify-center font-bold">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white leading-none">
                  NAKLİYEM<span className="text-[#146EF5]">PARA</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                  Türkiye Nakliyat & İş Ağı
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Evden eve nakliyat, ofis taşıma ve şehirler arası taşımacılıkta müşteriler ile doğrulanmış profesyonel nakliyat firmalarını buluşturan modern dijital platform.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#146EF5]" />
                <span>0850 300 00 00 (Hafta içi 09:00 - 18:00)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#146EF5]" />
                <span>destek@nakliyempara.com</span>
              </div>
            </div>
          </div>

          {/* Hizmetler Col */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Hizmetlerimiz</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/evden-eve-nakliyat" className="hover:text-white transition-colors">
                  Evden Eve Nakliyat
                </Link>
              </li>
              <li>
                <Link href="/ofis-tasima" className="hover:text-white transition-colors">
                  Ofis ve İşyeri Taşıma
                </Link>
              </li>
              <li>
                <Link href="/parca-esya-tasima" className="hover:text-white transition-colors">
                  Parça Eşya Taşımacılığı
                </Link>
              </li>
              <li>
                <Link href="/esya-depolama" className="hover:text-white transition-colors">
                  Eşya Depolama Hizmeti
                </Link>
              </li>
              <li>
                <Link href="/mesafe-hesaplama" className="hover:text-white transition-colors">
                  Şehirler Arası Mesafe & Süre
                </Link>
              </li>
            </ul>
          </div>

          {/* Nakliyat Firmaları Col */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Popüler Şehirler</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {popularCities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/nakliyat-firmalari/${city.slug}`} className="hover:text-white transition-colors">
                    {city.name} Nakliyat Firmaları
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nakliyeciler & Kurumsal Col */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Nakliyeciler & Bilgi</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/nakliyeciler" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  ★ Nakliyeci Üyeliği (7 Gün Ücretsiz)
                </Link>
              </li>
              <li>
                <Link href="/nakliyeci-defteri" className="hover:text-white transition-colors">
                  Nakliyeci Defteri (İş Ağı)
                </Link>
              </li>
              <li>
                <Link href="/paketler" className="hover:text-white transition-colors">
                  Abonelik Paketleri
                </Link>
              </li>
              <li>
                <Link href="/nakliyat-rehberi" className="hover:text-white transition-colors">
                  Taşınma Rehberi & Tavsiyeler
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Sektörel Blog
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="hover:text-white transition-colors">
                  KVKK Aydınlatma
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="hover:text-white transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} Nakliyem Para. Tüm hakları saklıdır. Platform nakliye hizmeti bedelini tahsil etmez; teklif ve karşılaştırma aracıdır.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/gizlilik" className="hover:text-slate-400">Gizlilik Politikası</Link>
            <Link href="/cerez-politikasi" className="hover:text-slate-400">Çerez Politikası</Link>
            <Link href="/nakliyeci-sozlesmesi" className="hover:text-slate-400">Nakliyeci Sözleşmesi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
