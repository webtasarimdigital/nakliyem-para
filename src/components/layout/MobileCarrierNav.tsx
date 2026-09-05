'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Briefcase, BookOpen, Plus, MessageSquare, User, Truck, Package, Edit3 } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { db } from '@/lib/data/mock-db';

export const MobileCarrierNav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const currentUser = db.getCurrentUser();

  // Only show on carrier dashboard pages
  if (!pathname?.startsWith('/app/carrier')) return null;

  const handleQuickAction = (category: string) => {
    setSheetOpen(false);
    router.push(`/app/carrier/defter?action=create&category=${category}`);
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-lg">
        <div className="flex items-center justify-around h-15 px-2 relative">
          {/* İşler */}
          <Link
            href="/app/carrier/isler"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
              pathname?.startsWith('/app/carrier/isler') ? 'text-[#F95700] font-bold' : 'text-slate-500'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">İşler</span>
          </Link>

          {/* Defter */}
          <Link
            href="/app/carrier/defter"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
              pathname?.startsWith('/app/carrier/defter') ? 'text-[#F95700] font-bold' : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Defter</span>
          </Link>

          {/* Center '+' action button */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => setSheetOpen(true)}
              className="w-12 h-12 rounded-full bg-[#F95700] text-white flex items-center justify-center shadow-lg -mt-5 hover:scale-105 active:scale-95 transition-all border-4 border-white"
              aria-label="Paylaşım Yap"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {/* Mesajlar */}
          <Link
            href="/app/carrier/mesajlar"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
              pathname?.startsWith('/app/carrier/mesajlar') ? 'text-[#F95700] font-bold' : 'text-slate-500'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Mesajlar</span>
          </Link>

          {/* Hesabım */}
          <Link
            href="/app/carrier/profil"
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${
              pathname?.startsWith('/app/carrier/profil') || pathname?.startsWith('/app/carrier/abonelik') ? 'text-[#146EF5] font-bold' : 'text-slate-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Hesabım</span>
          </Link>
        </div>
      </nav>

      {/* Quick Action Bottom Sheet */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Ne Paylaşmak İstiyorsunuz?"
      >
        <div className="space-y-3">
          <button
            onClick={() => handleQuickAction('EMPTY_VEHICLE')}
            className="w-full flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 hover:border-[#146EF5] hover:bg-[#EAF3FF]/40 text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-[#146EF5]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Boş Aracım Var</span>
              <span className="text-xs text-slate-500">Dönüş rotanızı veya boş kapasitenizi meslektaşlarla paylaşın.</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('CARGO_JOB')}
            className="w-full flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 hover:border-[#146EF5] hover:bg-[#EAF3FF]/40 text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Yük / İş Paylaş</span>
              <span className="text-xs text-slate-500">Yetişemediğiniz veya paslamak istediğiniz işi meslektaşlara duyurun.</span>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('ELEVATOR')}
            className="w-full flex items-center gap-3.5 p-4 rounded-xl border border-slate-200 hover:border-[#146EF5] hover:bg-[#EAF3FF]/40 text-left transition-colors"
          >
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 block">Mobil Asansör İlanı</span>
              <span className="text-xs text-slate-500">Bölgenizdeki kiralık mobil asansörünüzü saatlik/günlük duyurun.</span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  );
};
