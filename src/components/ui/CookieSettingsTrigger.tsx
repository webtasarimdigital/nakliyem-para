'use client';

import React from 'react';
import { Settings2 } from 'lucide-react';

export function CookieSettingsTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('open-cookie-settings'));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04F00] text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
    >
      <Settings2 className="w-4 h-4" />
      <span>Çerez Tercihlerini Yönet &amp; Güncelle</span>
    </button>
  );
}
