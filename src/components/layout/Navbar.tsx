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
  ArrowRight,
  Calculator
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center shadow-md shadow-orange-950/20 group-hover:scale-105 transition-all">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-[#0A1128] leading-none">
                NAKLİYEM<span className="text-[#F95700]">PARA</span>
              </span>
              <span className="text-[11px] text-slate-500 font-bold tracking-wider uppercase mt-1">
                Taşıma & Nakliyeci İş Ağı
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS: Defter, Talepler, Pazaryeri */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-2">
            <Link
              href={isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname?.includes('defter')
                  ? 'bg-[#FFF4ED] text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F95700]" />
              <span>Defter</span>
            </Link>

            <Link
              href={isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/app/carrier/isler'}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname?.includes('talepler') || pathname?.includes('isler')
                  ? 'bg-[#FFF4ED] text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#F95700]" />
              <span>Talepler & İşler</span>
            </Link>

            <Link
              href="/pazaryeri"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/pazaryeri'
                  ? 'bg-[#FFF4ED] text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#F95700]" />
              <span>Pazaryeri</span>
            </Link>

            <Link
              href="/nakliyat-firmalari"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname?.startsWith('/nakliyat-firmalari')
                  ? 'bg-[#FFF4ED] text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              Firmalar
            </Link>

            <Link
              href="/mesafe-hesaplama"
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === '/mesafe-hesaplama'
                  ? 'bg-[#FFF4ED] text-[#F95700]'
                  : 'text-slate-700 hover:text-[#0A1128] hover:bg-slate-100'
              }`}
            >
              Mesafe & Ücret
            </Link>
          </nav>
        </div>

        {/* RIGHT AREA: TEKLİF AL + GİRİŞ YAP + KAYDOL */}
        <div className="flex items-center gap-3">
          
          {/* TEKLİF AL BUTTON (Prominent Primary CTA) */}
          <Link href="/teklif-al" className="hidden sm:inline-flex">
            <Button variant="primary" size="md" className="font-extrabold shadow-md">
              Teklif Al
            </Button>
          </Link>

          {!currentUser ? (
            /* UNAUTHENTICATED STATE: Giriş Yap & Kaydol dropdowns */
            <div className="hidden md:flex items-center gap-2">
              {/* Giriş Yap Dropdown */}
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => {
                    setLoginDropdownOpen(!loginDropdownOpen);
                    setRegisterDropdownOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-[#0A1128] hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Giriş Yap</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in">
                    <Link
                      href="/giris?role=customer"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FFF4ED] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-[#F95700] group-hover:bg-[#F95700] group-hover:text-white transition-colors">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block group-hover:text-[#F95700]">
                          Müşteri Girişi
                        </span>
                        <span className="text-xs text-slate-500">
                          Taleplerinizi ve teklifleri görün
                        </span>
                      </div>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <Link
                      href="/giris?role=carrier"
                      onClick={() => setLoginDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-slate-100 text-[#0A1128] group-hover:bg-[#0A1128] group-hover:text-white transition-colors">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block group-hover:text-[#0A1128]">
                          Nakliyeci Girişi
                        </span>
                        <span className="text-xs text-slate-500">
                          İşler, Defter ve teklif paneli
                        </span>
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
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-[#0A1128] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <span>Kaydol</span>
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-fade-in">
                    <Link
                      href="/kayit/musteri"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FFF4ED] transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-orange-100 text-[#F95700] group-hover:bg-[#F95700] group-hover:text-white transition-colors">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block group-hover:text-[#F95700]">
                          Müşteri Olarak Kaydol
                        </span>
                        <span className="text-xs text-slate-500">
                          Ücretsiz teklif al ve karşılaştır
                        </span>
                      </div>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <Link
                      href="/kayit/nakliyeci"
                      onClick={() => setRegisterDropdownOpen(false)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-slate-900 block group-hover:text-[#0A1128]">
                          Nakliyeci Firma Kaydı
                        </span>
                        <span className="text-xs text-slate-500">
                          7 Gün Ücretsiz İş Ağı Deneyimi
                        </span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* LOGGED-IN USER PROFILE & DASHBOARD CTA */
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold flex items-center gap-2 border border-slate-200 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F95700] text-white flex items-center justify-center text-xs font-black">
                  {currentUser.role === 'CARRIER' ? 'N' : currentUser.role === 'CUSTOMER' ? 'M' : 'A'}
                </div>
                <span className="hidden sm:inline">
                  {currentUser.role === 'CARRIER' ? 'Nakliyeci Paneli' : currentUser.role === 'CUSTOMER' ? 'Müşteri Paneli' : 'Yönetim Paneli'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fade-in text-xs font-semibold">
                  <div className="px-4 py-2 border-b border-slate-100 text-slate-500 text-[11px]">
                    Giriş Yapıldı: <strong className="text-slate-900">{currentUser.phone || currentUser.email}</strong>
                  </div>

                  {isCustomer && (
                    <>
                      <Link
                        href="/app/customer"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Genel Bakış
                      </Link>
                      <Link
                        href="/app/customer/taleplerim"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Taleplerim
                      </Link>
                      <Link
                        href="/app/customer/teklifler"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Gelen Teklifler
                      </Link>
                      <Link
                        href="/app/customer/mesajlar"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Mesajlar
                      </Link>
                    </>
                  )}

                  {isCarrier && (
                    <>
                      <Link
                        href="/app/carrier"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Nakliyeci Paneli
                      </Link>
                      <Link
                        href="/app/carrier/isler"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Açık İşler
                      </Link>
                      <Link
                        href="/app/carrier/defter"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Nakliyeci Defteri
                      </Link>
                      <Link
                        href="/app/carrier/tekliflerim"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Verdiğim Teklifler
                      </Link>
                      <Link
                        href="/app/carrier/abonelik"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                      >
                        Abonelik & Paketler
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2.5 hover:bg-[#FFF4ED] hover:text-[#F95700]"
                    >
                      Admin Yönetim Paneli
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <Link
              href={isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-[#FFF4ED] hover:text-[#F95700]"
            >
              <BookOpen className="w-5 h-5 text-[#F95700]" />
              <span>Nakliyeci Defteri</span>
            </Link>

            <Link
              href={isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/app/carrier/isler'}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-[#FFF4ED] hover:text-[#F95700]"
            >
              <FileText className="w-5 h-5 text-[#F95700]" />
              <span>Talepler & İşler</span>
            </Link>

            <Link
              href="/pazaryeri"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-[#FFF4ED] hover:text-[#F95700]"
            >
              <ShoppingBag className="w-5 h-5 text-[#F95700]" />
              <span>Pazaryeri (Araç & Ekipman)</span>
            </Link>

            <Link
              href="/nakliyat-firmalari"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-slate-50"
            >
              <Building2 className="w-5 h-5 text-slate-500" />
              <span>Nakliyat Firmaları</span>
            </Link>

            <Link
              href="/mesafe-hesaplama"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-base font-bold text-slate-900 hover:bg-slate-50"
            >
              <Calculator className="w-5 h-5 text-slate-500" />
              <span>Mesafe & Maliyet Hesapla</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <Link href="/teklif-al" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <Button variant="primary" size="lg" className="w-full font-bold">
                Ücretsiz Teklif Al
              </Button>
            </Link>

            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="navy" size="md" className="w-full">
                    Kaydol
                  </Button>
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-bold text-red-600 border border-red-200 rounded-xl"
              >
                Çıkış Yap
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
