'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Truck, ShieldCheck, Phone, Mail, MapPin, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#0A1128] text-white border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand (2/5 on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center font-bold shadow-md shadow-orange-950/30">
                <Truck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                NAKLİYEM<span className="text-[#F95700]">PARA</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
              Türkiye&apos;nin en güvenilir evden eve nakliyat, kurumsal taşımacılık, Nakliyeci Defteri ve lojistik pazaryeri platformu.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs font-bold text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                %100 Doğrulanmış Firmalar
              </span>
            </div>

            {/* Mobil Uygulamalarımız — App Store & Google Play */}
            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Mobil Uygulamamızı İndirin</p>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* App Store Button */}
                <a
                  href="#app-store"
                  onClick={e => e.preventDefault()}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-md group cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.95 2.77.99.08 2.03-.51 2.68-1.27z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] font-medium text-slate-400 block leading-none">App Store&apos;dan</span>
                    <span className="text-xs font-black text-white block mt-0.5 tracking-tight group-hover:text-white">İndirin</span>
                  </div>
                </a>

                {/* Google Play Button */}
                <a
                  href="#google-play"
                  onClick={e => e.preventDefault()}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-md group cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.352-.338-.61-.83-.61-1.428V3.242c0-.598.258-1.09.61-1.428zm10.89 10.893l2.301-2.301-9.61-5.548 7.309 7.849zm0 .586l-7.309 7.85 9.61-5.549-2.301-2.301zm1.172-1.172l3.418-1.973c.974-.562.974-1.479 0-2.041l-3.418-1.973-2.008 2.008 2.008 1.979z" />
                  </svg>
                  <div className="text-left">
                    <span className="text-[9px] font-medium text-slate-400 block leading-none">Google Play&apos;den</span>
                    <span className="text-xs font-black text-white block mt-0.5 tracking-tight group-hover:text-white">Edinin</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white uppercase tracking-wider">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/evden-eve-nakliyat" className="hover:text-[#F95700] transition-colors">Evden Eve Nakliyat</Link></li>
              <li><Link href="/ofis-tasima" className="hover:text-[#F95700] transition-colors">Ofis & Kurumsal Taşıma</Link></li>
              <li><Link href="/parca-esya-tasima" className="hover:text-[#F95700] transition-colors">Parça Eşya Taşıma</Link></li>
              <li><Link href="/esya-depolama" className="hover:text-[#F95700] transition-colors">Eşya Depolama</Link></li>
              <li><Link href="/mesafe-hesaplama" className="hover:text-[#F95700] transition-colors">Mesafe Hesaplama</Link></li>
            </ul>
          </div>

          {/* Col 3: Carrier & Network */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white uppercase tracking-wider">Nakliyeci İş Ağı</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/nakliyeci-defteri" className="hover:text-[#F95700] transition-colors font-bold text-orange-300">Nakliyeci Defteri</Link></li>
              <li><Link href="/pazaryeri" className="hover:text-[#F95700] transition-colors">Pazaryeri & Asansör</Link></li>
              <li><Link href="/nakliyeciler" className="hover:text-[#F95700] transition-colors">Nakliyeci Başvurusu</Link></li>
              <li><Link href="/paketler" className="hover:text-[#F95700] transition-colors">Abonelik Paketleri</Link></li>
              <li><Link href="/nakliyat-firmalari" className="hover:text-[#F95700] transition-colors">Firma Rehberi</Link></li>
            </ul>
          </div>

          {/* Col 4: Corporate & Legal */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-white uppercase tracking-wider">Kurumsal & Yasal</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/nakliyat-rehberi" className="hover:text-[#F95700] transition-colors">Taşınma Rehberi</Link></li>
              <li><Link href="/blog" className="hover:text-[#F95700] transition-colors">Blog & İpuçları</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-[#F95700] transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/gizlilik" className="hover:text-[#F95700] transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kvkk" className="hover:text-[#F95700] transition-colors">KVKK Aydınlatma</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Nakliyem Para. Tüm hakları saklıdır.</p>
          <p className="text-[11px] text-slate-500 text-center md:text-right">
            Nakliyem Para bir aracı hizmet sağlayıcıdır. Taşıma ücreti doğrudan anlaşmalı nakliyeciye ödenir.
          </p>
        </div>
      </div>
    </footer>
  );
};
