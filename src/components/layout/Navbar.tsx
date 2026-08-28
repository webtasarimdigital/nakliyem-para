'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Truck, 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  BookOpen, 
  FileText, 
  ShoppingBag, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { db } from '@/lib/data/mock-db';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currentUser = db.getCurrentUser();

  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const registerDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target as Node)) {
        setRegisterDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    db.setCurrentUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const isCarrier = currentUser?.role === 'CARRIER';
  const isCustomer = currentUser?.role === 'CUSTOMER';
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPER_ADMIN';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-3">
        
        {/* LOGO */}
        <div className="flex items-center gap-6 xl:gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center shadow-md shadow-orange-950/20 group-hover:scale-105 transition-all shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-2xl tracking-tight text-[#0A1128] leading-none">
                NAKLİYEM<span className="text-[#F95700]">PARA</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold tracking-wider uppercase mt-0.5 sm:mt-1">
                Taşıma &amp; Nakliyeci İş Ağı
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS (Clean 3 main items with consistent icons) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri'}
              className={`px-3.5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                pathname?.includes('defter')
                  ? 'bg-orange-50 text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F95700]" />
              <span>Defter</span>
            </Link>

            <Link
              href={isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/app/carrier/isler'}
              className={`px-3.5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                pathname?.includes('talepler') || pathname?.includes('isler')
                  ? 'bg-orange-50 text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#F95700]" />
              <span>Talepler &amp; İşler</span>
            </Link>

            <Link
              href="/pazaryeri"
              className={`px-3.5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 ${
                pathname?.startsWith('/pazaryeri')
                  ? 'bg-orange-50 text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#F95700]" />
              <span>Pazaryeri</span>
            </Link>
          </nav>
        </div>

        {/* RIGHT ACTIONS: Teklif Al + Giriş / Kaydol (No wrap, clean spacing) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Main CTA: Teklif Al */}
          <Link href="/teklif-al" className="hidden sm:block">
            <Button
              variant="primary"
              size="md"
              className="font-black px-5 py-2.5 shadow-md shadow-orange-900/15 text-sm whitespace-nowrap"
            >
              Teklif Al
            </Button>
          </Link>

          {/* If Logged In User */}
          {currentUser ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-xs sm:text-sm font-bold text-slate-800"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0A1128] text-white flex items-center justify-center text-xs font-black">
                  {isCarrier ? 'N' : isCustomer ? 'M' : 'A'}
                </div>
                <span className="hidden md:inline font-black text-[#0A1128]">
                  {isCarrier ? 'Nakliyeci Paneli' : isCustomer ? 'Müşteri Paneli' : 'Admin'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase">Giriş Yapıldı</p>
                    <p className="text-xs font-black text-slate-800 truncate">{currentUser.email}</p>
                  </div>

                  {isCustomer && (
                    <>
                      <Link href="/app/customer" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Taşınma Merkezim
                      </Link>
                      <Link href="/app/customer/teklifler" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Gelen Teklifler
                      </Link>
                      <Link href="/app/customer/mesajlar" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Mesajlarım
                      </Link>
                    </>
                  )}

                  {isCarrier && (
                    <>
                      <Link href="/app/carrier" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Operasyon Merkezi
                      </Link>
                      <Link href="/app/carrier/isler" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Açık İşler &amp; Teklif Ver
                      </Link>
                      <Link href="/app/carrier/takvim" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        İş Takvimi &amp; Müsaitlik
                      </Link>
                      <Link href="/app/carrier/profil" className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        Firma Profilini Düzenle
                      </Link>
                    </>
                  )}

                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest Buttons: Giriş Yap & Kaydol */
            <div className="flex items-center gap-2">
              
              {/* Giriş Yap Dropdown */}
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => {
                    setLoginDropdownOpen(!loginDropdownOpen);
                    setRegisterDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black text-slate-700 hover:text-[#0A1128] hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <span>Giriş Yap</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                    <Link
                      href="/giris?role=musteri"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 hover:text-[#F95700] transition-colors text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C23E00] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-black">Müşteri Girişi</span>
                        <span className="block text-[10px] text-slate-400 font-medium">Taleplerini yönet</span>
                      </div>
                    </Link>

                    <Link
                      href="/giris?role=nakliyeci"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0A1128] text-white flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-black">Nakliyeci Girişi</span>
                        <span className="block text-[10px] text-slate-400 font-medium">İş bul &amp; teklif ver</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Kaydol Dropdown */}
              <div className="relative" ref={registerDropdownRef}>
                <button
                  onClick={() => {
                    setRegisterDropdownOpen(!registerDropdownOpen);
                    setLoginDropdownOpen(false);
                  }}
                  className="flex items-center gap-1 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-[#0A1128] hover:bg-[#132247] text-white text-xs sm:text-sm font-black transition-all shadow-xs cursor-pointer"
                >
                  <span>Kaydol</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                    <Link
                      href="/kayit?role=musteri"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 hover:text-[#F95700] transition-colors text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C23E00] flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-black">Müşteri Hesabı Oluştur</span>
                        <span className="block text-[10px] text-slate-400 font-medium">%100 Ücretsiz teklif al</span>
                      </div>
                    </Link>

                    <Link
                      href="/kayit?role=nakliyeci"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#0A1128] text-white flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-black">Nakliyeci Olarak Kaydol</span>
                        <span className="block text-[10px] text-emerald-600 font-bold">Gold Paket 7 Gün Ücretsiz</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU ACCORDION */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-xl">
          <nav className="space-y-1">
            <Link
              href={isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-black text-slate-800 hover:bg-slate-100"
            >
              <BookOpen className="w-4 h-4 text-[#F95700]" />
              <span>Nakliyeci Defteri</span>
            </Link>

            <Link
              href={isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/app/carrier/isler'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-black text-slate-800 hover:bg-slate-100"
            >
              <FileText className="w-4 h-4 text-[#F95700]" />
              <span>Açık İşler &amp; Talepler</span>
            </Link>

            <Link
              href="/pazaryeri"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-black text-slate-800 hover:bg-slate-100"
            >
              <ShoppingBag className="w-4 h-4 text-[#F95700]" />
              <span>Pazaryeri &amp; Araç İlanları</span>
            </Link>

            <Link
              href="/paketler"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-black text-slate-800 hover:bg-slate-100"
            >
              <Sparkles className="w-4 h-4 text-[#F95700]" />
              <span>Nakliyeci Abonelik Paketleri</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link href="/teklif-al" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="lg" className="w-full font-black">
                Ücretsiz Teklif Al 🚀
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
