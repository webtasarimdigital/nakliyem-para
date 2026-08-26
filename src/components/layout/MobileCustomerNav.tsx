'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, CheckSquare, MessageSquare, User } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

export const MobileCustomerNav: React.FC = () => {
  const pathname = usePathname();
  const currentUser = db.getCurrentUser();

  // Only show if customer or guest
  if (currentUser && currentUser.role !== 'CUSTOMER') return null;

  const items = [
    { label: 'Ana Sayfa', href: '/app/customer', icon: Home, exact: true },
    { label: 'Talepler', href: '/app/customer/taleplerim', icon: FileText },
    { label: 'Teklifler', href: '/app/customer/teklifler', icon: CheckSquare },
    { label: 'Mesajlar', href: '/app/customer/mesajlar', icon: MessageSquare },
    { label: 'Hesabım', href: '/app/customer/profil', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe shadow-lg">
      <div className="flex items-center justify-around h-15 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
                isActive ? 'text-[#146EF5] font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
