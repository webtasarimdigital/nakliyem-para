'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/uyeler', label: 'Üyeler', icon: Users },
  { href: '/admin/gelir', label: 'Gelir', icon: TrendingUp },
  { href: '/admin/dogrulamalar', label: 'Doğrulamalar', icon: ShieldCheck },
  { href: '/admin/paketler', label: 'Paketler', icon: Award },
  { href: '/admin/dijital-hizmetler', label: 'Dijital Hizmetler', icon: Sparkles },
  { href: '/admin/reklamlar', label: 'Reklamlar', icon: Layers },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, don't show admin navbar
  if (pathname === '/admin/giris') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      localStorage.removeItem('admin_token_active');
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
      router.push('/admin/giris');
    }
  };

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Persistent Global Admin Header */}
      <header className="bg-[#0A1128] text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-[#F95700] flex items-center justify-center text-white shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <span className="font-black text-sm tracking-tight text-white block">
                    TaşınTeklif <span className="text-[#F95700]">Yönetim</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                    Admin Kontrol Paneli
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#F95700] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Quick Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Ana Platforma Git"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Siteyi Gör</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold transition-colors cursor-pointer border border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loggingOut ? 'Çıkılıyor...' : 'Çıkış'}</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Menüyü Aç"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0A1128] px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#F95700] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between">
              <Link
                href="/"
                target="_blank"
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Siteye Git
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Çıkış Yap
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
