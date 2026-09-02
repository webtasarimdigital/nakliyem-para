'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Layers,
  Inbox,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Navigation,
  Headphones,
  HelpCircle,
  Settings
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

interface CustomerSidebarProps {
  activeTab?: 'home' | 'requests' | 'offers' | 'tracking' | 'messages' | 'companies' | 'distance' | 'support' | 'help' | 'settings';
}

export function CustomerSidebar({ activeTab }: CustomerSidebarProps) {
  const pathname = usePathname();
  const currentUser = db.getCurrentUser();
  const requests = db.getRequests();
  const offers = db.getOffers();

  const displayName = currentUser?.fullName || (currentUser as any)?.name || 'Hakan Yavaş';
  const nameParts = displayName.trim().split(' ');
  const initials = nameParts.length > 1
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  // Counts
  const requestCount = requests.length || 1;
  const offerCount = offers.length || 2;
  const unreadMessagesCount = 0;
  const trackingCount = 0;

  const isCurrent = (tab: string, path: string) => {
    if (activeTab) return activeTab === tab;
    return pathname === path || (path !== '/app/customer' && pathname?.startsWith(path));
  };

  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-6 shrink-0 self-start">
      
      {/* 1. User Header (Image exact: HY in purple/magenta circle, hakan yavaş, Bireysel Üye) */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-full bg-[#B23B72] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-sm text-[#0A1128] truncate">
            {displayName}
          </h3>
          <p className="text-xs text-slate-500 font-semibold">
            Bireysel Üye
          </p>
        </div>
      </div>

      {/* 2. Navigation Menu Links with Badges */}
      <nav className="space-y-1">
        {/* Anasayfa */}
        <Link
          href="/app/customer"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isCurrent('home', '/app/customer')
              ? 'bg-slate-100 text-slate-900 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Home className="w-4 h-4 text-slate-500" />
            <span>Anasayfa</span>
          </div>
        </Link>

        {/* Taleplerim */}
        <Link
          href="/app/customer/taleplerim"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isCurrent('requests', '/app/customer/taleplerim')
              ? 'bg-slate-100 text-slate-900 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Taleplerim</span>
          </div>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {requestCount}
          </span>
        </Link>

        {/* Gelen Teklifler */}
        <Link
          href="/app/customer/teklifler"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isCurrent('offers', '/app/customer/teklifler')
              ? 'bg-slate-100 text-slate-900 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Inbox className="w-4 h-4 text-slate-500" />
            <span>Gelen Teklifler</span>
          </div>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {offerCount}
          </span>
        </Link>

        {/* Nakliyat Takip */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>Nakliyat Takip</span>
          </div>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {trackingCount}
          </span>
        </div>

        {/* Mesajlar */}
        <Link
          href="/app/customer/mesajlar"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isCurrent('messages', '/app/customer/mesajlar')
              ? 'bg-slate-100 text-slate-900 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-slate-500" />
            <span>Mesajlar</span>
          </div>
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
            {unreadMessagesCount}
          </span>
        </Link>

        {/* Divider */}
        <div className="border-t border-slate-100 my-2 pt-1" />

        {/* Firma Sorgula */}
        <Link
          href="/nakliyat-firmalari"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <span>Firma Sorgula</span>
          </div>
        </Link>

        {/* Mesafe Hesaplama */}
        <Link
          href="/mesafe-hesaplama"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <Navigation className="w-4 h-4 text-slate-500" />
            <span>Mesafe Hesaplama</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="border-t border-slate-100 my-2 pt-1" />

        {/* Canlı Destek */}
        <a
          href="https://wa.me/905320000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <Headphones className="w-4 h-4 text-amber-500" />
            <span>Canlı Destek</span>
          </div>
        </a>

        {/* Yardım Merkezi */}
        <Link
          href="/nakliyat-rehberi"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Yardım Merkezi</span>
          </div>
        </Link>

        {/* Ayarlar */}
        <Link
          href="/app/customer/profil"
          className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all ${
            isCurrent('settings', '/app/customer/profil')
              ? 'bg-slate-100 text-slate-900 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Ayarlar</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
