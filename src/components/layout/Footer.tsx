'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Mail, MessageSquare } from 'lucide-react';
import { openSupportChat } from '@/components/ui/SupportChatWidget';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#111E38] text-white border-t border-slate-800 pt-12 sm:pt-16 pb-24 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid: 2 cols on mobile, 5 cols on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-slate-800/80">
          
          {/* Col 1: Brand & Apps (Spans 2 cols on mobile, 2 cols on lg) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <img 
                src="/images/logo-white.png" 
                alt="TaşınTeklif" 
                className="h-12 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105" 
              />
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
              Türkiye&apos;nin en güvenilir evden eve nakliyat, kurumsal taşımacılık, Nakliyeci Defteri ve lojistik pazaryeri platformu.
            </p>

            <div className="flex flex-col gap-2 pt-1 text-xs font-bold text-slate-300">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  %100 Doğrulanmış Firmalar
                </span>
              </div>
              <a href="mailto:bilgi@tasinteklif.com" className="inline-flex items-center gap-2 text-slate-300 hover:text-[#F95700] transition-colors font-semibold">
                <Mail className="w-4 h-4 text-[#F95700]" />
                bilgi@tasinteklif.com
              </a>
            </div>

            {/* Mobil Uygulamalarımız — App Store & Google Play */}
            <div className="pt-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-[#F95700] mb-2.5">
                Mobil Uygulamamızı İndirin
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* App Store Button */}
                <a
                  href="#app-store"
                  onClick={e => e.preventDefault()}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-md group cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
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

          {/* Col 2: Services (Side by side with Col 3 on mobile) */}
          <div className="col-span-1 space-y-3">
            <h3 className="font-black text-sm text-[#F95700] uppercase tracking-wider">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/evden-eve-nakliyat" className="hover:text-[#F95700] transition-colors">Evden Eve Nakliyat</Link></li>
              <li><Link href="/ofis-tasima" className="hover:text-[#F95700] transition-colors">Ofis & Kurumsal Taşıma</Link></li>
              <li><Link href="/parca-esya-tasima" className="hover:text-[#F95700] transition-colors">Parça Eşya Taşıma</Link></li>
              <li><Link href="/esya-depolama" className="hover:text-[#F95700] transition-colors">Eşya Depolama</Link></li>
              <li><Link href="/mesafe-hesaplama" className="hover:text-[#F95700] transition-colors">Mesafe Hesaplama</Link></li>
            </ul>
          </div>

          {/* Col 3: Carrier & Network (Side by side with Col 2 on mobile) */}
          <div className="col-span-1 space-y-3">
            <h3 className="font-black text-sm text-[#F95700] uppercase tracking-wider">Nakliyeci İş Ağı</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/nakliyeci-defteri" className="hover:text-[#F95700] transition-colors font-bold text-orange-300">Nakliyeci Defteri</Link></li>
              <li><Link href="/pazaryeri" className="hover:text-[#F95700] transition-colors">Pazaryeri & Asansör</Link></li>
              <li><Link href="/nakliyeciler" className="hover:text-[#F95700] transition-colors">Nakliyeci Başvurusu</Link></li>
              <li><Link href="/paketler" className="hover:text-[#F95700] transition-colors">Abonelik Paketleri</Link></li>
              <li><Link href="/nakliyat-firmalari" className="hover:text-[#F95700] transition-colors">Firma Rehberi</Link></li>
            </ul>
          </div>

          {/* Col 4: Corporate & Legal (Spans 2 cols on mobile with 2 sub-columns of links) */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <h3 className="font-black text-sm text-[#F95700] uppercase tracking-wider">Kurumsal & Yasal</h3>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-300 font-medium">
              <li><Link href="/nakliyat-rehberi" className="hover:text-[#F95700] transition-colors">Taşınma Rehberi</Link></li>
              <li><Link href="/blog" className="hover:text-[#F95700] transition-colors">Blog & İpuçları</Link></li>
              <li><Link href="/kullanim-kosullari" className="hover:text-[#F95700] transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/gizlilik" className="hover:text-[#F95700] transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/kvkk" className="hover:text-[#F95700] transition-colors">KVKK Aydınlatma</Link></li>
              <li><Link href="/cerez-politikasi" className="hover:text-[#F95700] transition-colors">Çerez Politikası</Link></li>
              <li><Link href="/nakliyeci-sozlesmesi" className="hover:text-[#F95700] transition-colors">Nakliyeci Sözleşmesi</Link></li>
              <li>
                <button
                  onClick={() => openSupportChat()}
                  className="hover:text-[#F95700] transition-colors font-bold text-orange-300 flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#F95700] shrink-0" />
                  <span>Bize Ulaşın (Canlı Destek)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Middle Bar: Social Icons (Left) & Payment / Trust Badges (Right) from Image 2 */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800/80">
          
          {/* Social Icons (White circular buttons with dark icons) */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com/tasinteklif"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#111E38] hover:bg-[#F95700] hover:text-white transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/tasinteklif"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#111E38] hover:bg-[#F95700] hover:text-white transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/company/tasinteklif"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#111E38] hover:bg-[#F95700] hover:text-white transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/tasinteklif"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-[#111E38] hover:bg-[#F95700] hover:text-white transition-all flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>

          {/* Payment & Trust Badges (Mastercard, VISA, iyzico) */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            {/* Mastercard */}
            <div className="flex items-center" title="Mastercard Güvenli Ödeme">
              <svg className="h-6 w-9 shrink-0" viewBox="0 0 38 24" fill="none">
                <circle cx="14" cy="12" r="10" fill="#EB001B" />
                <circle cx="24" cy="12" r="10" fill="#F79E1B" fillOpacity="0.88" />
              </svg>
            </div>

            <div className="w-px h-5 bg-slate-200" />

            {/* VISA */}
            <div className="flex items-center px-1" title="Visa Güvenli Ödeme">
              <svg className="h-5 w-12 shrink-0" viewBox="0 0 60 20" fill="none">
                <text x="0" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18" fontWeight="900" fontStyle="italic" fill="#1434CB" letterSpacing="0.5">
                  VISA
                </text>
              </svg>
            </div>

            <div className="w-px h-5 bg-slate-200" />

            {/* iyzico ile Öde */}
            <div className="flex items-baseline gap-1 pl-1 shrink-0" title="iyzico ile Güvenli Ödeme">
              <span className="font-black text-[#1E3A8A] text-sm tracking-tight">iyzico</span>
              <span className="text-[10px] text-slate-600 font-bold whitespace-nowrap">ile Öde</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} TaşınTeklif. Tüm hakları saklıdır.</p>
          <p className="text-[11px] text-slate-500 text-center md:text-right">
            TaşınTeklif bir aracı hizmet sağlayıcıdır. Taşıma ücreti doğrudan anlaşmalı nakliyeciye ödenir.
          </p>
        </div>

      </div>
    </footer>
  );
};
