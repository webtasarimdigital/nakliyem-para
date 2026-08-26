'use client';

import React, { useState } from 'react';
import { Smartphone, X, Apple, Play } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

export const GlobalAppBand: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const settings = db.getSettings();

  if (!settings.mobileAppBandActive || !isVisible) {
    return null;
  }

  return (
    <div className="bg-[#0D1B2A] text-white text-xs border-b border-slate-800 relative z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left copy */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="p-1 rounded-md bg-[#146EF5] text-white shrink-0">
            <Smartphone className="w-3.5 h-3.5" />
          </span>
          <div>
            <span className="font-semibold">{settings.mobileAppBandTitle}</span>
            <span className="hidden md:inline text-slate-400 ml-1.5 font-normal">
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
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors border border-white/10"
          >
            <Apple className="w-3.5 h-3.5 fill-current" />
            <span>App Store</span>
          </a>

          <a
            href={settings.googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors border border-white/10"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Google Play</span>
          </a>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors ml-1"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
