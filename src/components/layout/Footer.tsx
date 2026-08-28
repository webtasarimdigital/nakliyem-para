'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Phone, Mail, MapPin, Sparkles, BookOpen, ShoppingBag } from 'lucide-react';

export const Footer: React.FC = () => {
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
