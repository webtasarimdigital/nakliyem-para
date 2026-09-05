'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, 
  Search, 
  MapPin, 
  Megaphone, 
  Share2, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Headphones
} from 'lucide-react';

const DIGITAL_MENU_ITEMS = [
  {
    title: 'Dijital Hizmetler',
    href: '/app/carrier/dijital-hizmetler',
    icon: Sparkles,
    badge: 'Tümü',
    exact: true
  },
  {
    title: 'Web Sitesi Hizmeti',
    href: '/app/carrier/dijital-hizmetler/web-sitesi',
    icon: Globe,
    badge: 'Özel Tasarım'
  },
  {
    title: 'Google SEO Hizmeti',
    href: '/app/carrier/dijital-hizmetler/google-seo',
    icon: Search,
    badge: '1. Sayfa'
  },
  {
    title: 'Harita SEO (Google Maps)',
    href: '/app/carrier/dijital-hizmetler/harita-seo',
    icon: MapPin,
    badge: 'Yerel Güç'
  },
  {
    title: 'Google Reklamları (Ads)',
    href: '/app/carrier/dijital-hizmetler/google-reklamlari',
    icon: Megaphone,
    badge: 'Anında Arama'
  },
  {
    title: 'Sosyal Medya Reklamları',
    href: '/app/carrier/dijital-hizmetler/sosyal-medya',
    icon: Share2,
    badge: 'Hedef Kitle'
  }
];

export const CarrierDigitalSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full space-y-4">
      {/* Brand Header */}
      <div className="bg-[#0A1128] text-white p-5 rounded-3xl shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#F95700] text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Dijital Büyüme</h3>
            <span className="text-[10px] font-semibold text-emerald-400">Nakliyecilere Özel</span>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Firmanızın Google aramalarında, haritalarda ve web dünyasında 1. sırada yer almasını sağlayan anahtar teslim dijital ajans çözümleri.
        </p>
      </div>

      {/* Navigation List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 sm:p-3 shadow-xs space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Hizmet Menüsü
        </div>
        {DIGITAL_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all font-medium text-xs sm:text-sm ${
                isActive
                  ? 'bg-orange-50 text-[#F95700] font-bold shadow-2xs border border-orange-100'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0A1128]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-[#F95700] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.title}</span>
              </div>
              
              <div className="flex items-center gap-1 shrink-0">
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive 
                      ? 'bg-[#F95700] text-white' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#F95700]' : 'text-slate-400'}`} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Support Card */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-4 text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-[#0A1128] flex items-center justify-center mx-auto shadow-2xs">
          <Headphones className="w-5 h-5 text-[#F95700]" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-[#0A1128]">Dijital Danışman Desteği</h4>
          <p className="text-[11px] text-slate-500 font-normal mt-0.5">
            Hangi paketin firmanıza uygun olduğunu ücretsiz analiz edelim.
          </p>
        </div>
        <a 
          href="https://wa.me/908503080000?text=Merhaba,%20nakliyem-para%20dijital%20hizmetleri%20hakkında%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <PhoneCall className="w-3.5 h-3.5 text-white" />
          <span>WhatsApp Danışma Hattı</span>
        </a>
      </div>
    </aside>
  );
};
