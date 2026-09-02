'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Smartphone, X, Apple, Play } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

export const GlobalAppBand: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const settings = db.getSettings();

  if (pathname?.startsWith('/admin') || !settings.mobileAppBandActive || !isVisible) {
    return null;
  }

  return (
    <div className="bg-[#F95700] text-white text-xs border-b border-orange-600 relative z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left copy */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 rounded-lg bg-white/20 text-white shrink-0">
            <Smartphone className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="font-black tracking-tight">{settings.mobileAppBandTitle}</span>
            <span className="hidden md:inline text-white/90 ml-1.5 font-medium">
              {settings.mobileAppBandSubtitle}
            </span>
          </div>
        </div>

        {/* Right download buttons */}
        <div className="flex items-center gap-2">
          <a
            href={settings.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A1128] hover:bg-[#132247] text-white font-black text-[11px] transition-all shadow-xs"
          >
            <Apple className="w-3.5 h-3.5 fill-current" />
            <span>App Store</span>
          </a>

          <a
            href={settings.googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A1128] hover:bg-[#132247] text-white font-black text-[11px] transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#F95700]" />
            <span>Google Play</span>
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-white/80 hover:text-white rounded transition-colors ml-1 cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
