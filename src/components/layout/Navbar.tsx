'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Truck, 
  Menu, 
  X, 
  User, 
  Bell, 
  ShieldCheck, 
  PlusCircle, 
  LogOut, 
  Layers, 
  Briefcase, 
  BookOpen, 
  MessageSquare,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const currentUser = db.getCurrentUser();

  const handlePersonaSwitch = (role: 'CUSTOMER' | 'CARRIER' | 'ADMIN' | 'GUEST') => {
    db.switchPersona(role);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'GUEST') {
      router.push('/');
    } else if (role === 'CUSTOMER') {
      router.push('/app/customer');
    } else if (role === 'CARRIER') {
      router.push('/app/carrier');
    } else if (role === 'ADMIN') {
      router.push('/admin');
    }
    router.refresh();
  };

  const isCarrierPortal = pathname?.startsWith('/app/carrier') || pathname?.startsWith('/app/defter') || pathname?.startsWith('/app/isler') || pathname?.startsWith('/app/alarmlar');
  const isCustomerPortal = pathname?.startsWith('/app/customer');
  const isAdminPortal = pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#146EF5] to-[#0B3B8F] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-slate-900 leading-none">
                NAKLİYEM<span className="text-[#146EF5]">PARA</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                Taşıma & İş Ağı
              </span>
            </div>
          </Link>

          {/* Desktop Public Navigation */}
          {!isCarrierPortal && !isCustomerPortal && !isAdminPortal && (
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/evden-eve-nakliyat"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/evden-eve-nakliyat' ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Evden Eve Nakliyat
              </Link>
              <Link
                href="/nakliyat-firmalari"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname?.startsWith('/nakliyat-firmalari') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Nakliyat Firmaları
              </Link>
              <Link
                href="/nakliyeci-defteri"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/nakliyeci-defteri' ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Nakliyeci Defteri
              </Link>
              <Link
                href="/paketler"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/paketler' ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Paketler
              </Link>
              <Link
                href="/mesafe-hesaplama"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === '/mesafe-hesaplama' ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Mesafe & Ücret
              </Link>
            </nav>
          )}

          {/* Desktop Carrier Top Navigation */}
          {isCarrierPortal && (
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/app/carrier/isler"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/carrier/isler') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                İşler (Talepler)
              </Link>
              <Link
                href="/app/carrier/defter"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/carrier/defter') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Defter (İş Ağı)
              </Link>
              <Link
                href="/app/carrier/alarmlar"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/carrier/alarmlar') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Alarmlarım
              </Link>
              <Link
                href="/app/carrier/tekliflerim"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/carrier/tekliflerim') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Tekliflerim
              </Link>
              <Link
                href="/app/carrier/isini-buyut"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                  pathname?.startsWith('/app/carrier/isini-buyut') ? 'bg-amber-100 text-amber-900' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                İşini Büyüt
              </Link>
            </nav>
          )}

          {/* Desktop Customer Top Navigation */}
          {isCustomerPortal && (
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/app/customer"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname === '/app/customer' ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Genel Bakış
              </Link>
              <Link
                href="/app/customer/taleplerim"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/customer/taleplerim') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Taleplerim
              </Link>
              <Link
                href="/app/customer/teklifler"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/customer/teklifler') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Gelen Teklifler
              </Link>
              <Link
                href="/app/customer/mesajlar"
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  pathname?.startsWith('/app/customer/mesajlar') ? 'bg-[#EAF3FF] text-[#146EF5]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Mesajlar
              </Link>
            </nav>
          )}
        </div>

        {/* Right CTA / Persona Switcher / User Profile */}
        <div className="flex items-center gap-3">
          {/* Persona Switcher (Demo helper for quick role switching) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#146EF5]" />
              <span>Rol: {currentUser ? (currentUser.role === 'CUSTOMER' ? 'Müşteri' : currentUser.role === 'CARRIER' ? 'Nakliyeci' : 'Admin') : 'Misafir'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in text-xs font-medium">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Görünüm Değiştir</div>
                <button
                  onClick={() => handlePersonaSwitch('CUSTOMER')}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-[#146EF5] flex items-center justify-between"
                >
                  <span>Müşteri Paneli</span>
                  {currentUser?.role === 'CUSTOMER' && <span className="text-emerald-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handlePersonaSwitch('CARRIER')}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-[#146EF5] flex items-center justify-between"
                >
                  <span>Nakliyeci Paneli</span>
                  {currentUser?.role === 'CARRIER' && <span className="text-emerald-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => handlePersonaSwitch('ADMIN')}
                  className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-[#146EF5] flex items-center justify-between"
                >
                  <span>Yönetici (Admin)</span>
                  {currentUser?.role === 'ADMIN' && <span className="text-emerald-600 font-bold">✓</span>}
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => handlePersonaSwitch('GUEST')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-100 text-slate-600 flex items-center justify-between"
                >
                  <span>Misafir (Çıkış)</span>
                  {!currentUser && <span className="text-emerald-600 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          {!currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/nakliyeciler" className="text-xs font-semibold text-slate-600 hover:text-[#146EF5] px-3 py-2">
                Nakliyeciyim
              </Link>
              <Link href="/teklif-al">
                <Button variant="primary" size="sm">
                  Ücretsiz Teklif Al
                </Button>
              </Link>
            </div>
          ) : currentUser.role === 'CUSTOMER' ? (
            <div className="flex items-center gap-2">
              <Link href="/teklif-al">
                <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-3.5 h-3.5" />}>
                  Yeni Talep Aç
                </Button>
              </Link>
            </div>
          ) : currentUser.role === 'CARRIER' ? (
            <div className="flex items-center gap-2">
              <Link href="/app/carrier/isler">
                <Button variant="primary" size="sm">
                  İş Bul ({db.getRequests().filter(r => r.status === 'ACTIVE').length})
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/admin">
              <Button variant="primary" size="sm">
                Yönetim Paneli
              </Button>
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-lg">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/evden-eve-nakliyat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Evden Eve Nakliyat
            </Link>
            <Link
              href="/nakliyat-firmalari"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Nakliyat Firmaları
            </Link>
            <Link
              href="/nakliyeci-defteri"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Nakliyeci Defteri
            </Link>
            <Link
              href="/paketler"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Paketler & Fiyatlar
            </Link>
            <Link
              href="/mesafe-hesaplama"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Mesafe & Maliyet Hesapla
            </Link>
            <Link
              href="/nakliyeciler"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#146EF5] bg-[#EAF3FF]"
            >
              Nakliyeciler İçin (7 Gün Ücretsiz)
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/teklif-al" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                Ücretsiz Teklif Al
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
