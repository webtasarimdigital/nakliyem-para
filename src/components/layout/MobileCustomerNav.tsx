'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Plus, FileText, ShoppingBag } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

const LEFT_ITEMS = [
  { label: 'Ana Sayfa', href: '/', icon: Home, exact: true },
  { label: 'Defter', href: '/nakliyeci-defteri', icon: BookOpen, exact: false },
];

const RIGHT_ITEMS = [
  { label: 'Talepler', href: '/talepler', icon: FileText, exact: false },
  { label: 'Pazaryeri', href: '/pazaryeri', icon: ShoppingBag, exact: false },
];

const FAB = {
  label: 'İlan Ver',
  href: '/teklif-al',
  icon: Plus,
};

export const MobileCustomerNav: React.FC = () => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    const handleAuth = () => setCurrentUser(db.getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  // Hide on carrier dashboard and admin paths
  if (
    pathname?.startsWith('/app/carrier') ||
    pathname?.startsWith('/admin')
  ) {
    return null;
  }

  const isCustomer = currentUser?.role === 'CUSTOMER';
  const taleplerHref = isCustomer ? '/app/customer/taleplerim#customer-requests-content' : '/talepler';

  const isActive = (href: string, exact: boolean) => {
    if (href.startsWith('/app/customer/taleplerim') || href === '/talepler') {
      return pathname?.startsWith('/app/customer/taleplerim') || pathname === '/talepler';
    }
    if (exact) return pathname === href;
    return pathname?.startsWith(href) ?? false;
  };

  const handleTaleplerClick = (e: React.MouseEvent) => {
    if (pathname === '/app/customer/taleplerim' || pathname === '/app/customer') {
      const targetId = pathname === '/app/customer/taleplerim' ? 'customer-requests-content' : 'customer-dashboard-content';
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        const navOffset = 75;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }
  };

  const navItemClass = (active: boolean) =>
    `flex flex-col items-center justify-center flex-1 h-full py-1 gap-0.5 transition-colors ${
      active
        ? 'text-[#F95700] font-bold'
        : 'text-[#6B7280] hover:text-[#F95700]'
    }`;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Left 2 items */}
        {LEFT_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href} className={navItemClass(active)}>
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}

        {/* Center FAB */}
        <div className="flex flex-col items-center justify-center flex-1 -mt-4">
          <Link
            href={FAB.href}
            className="flex flex-col items-center gap-1 group"
            aria-label={FAB.label}
          >
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[#F95700] shadow-lg ring-4 ring-white transition-transform group-active:scale-95">
              <FAB.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-[10px] leading-none text-[#6B7280] font-medium">
              {FAB.label}
            </span>
          </Link>
        </div>

        {/* Right 2 items */}
        {RIGHT_ITEMS.map((item) => {
          const isTalepler = item.label === 'Talepler';
          const href = isTalepler ? taleplerHref : item.href;
          const Icon = item.icon;
          const active = isActive(href, item.exact);
          return (
            <Link
              key={item.href}
              href={href}
              onClick={isTalepler ? handleTaleplerClick : undefined}
              className={navItemClass(active)}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
