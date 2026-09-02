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
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Package,
  Settings,
  Briefcase
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

  // Dynamic reactive current user state
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Read on client mount and pathname change
    setCurrentUser(db.getCurrentUser());

    const handleAuthChange = () => {
      setCurrentUser(db.getCurrentUser());
    };

    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [pathname]);

  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const registerDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target as Node)) setLoginDropdownOpen(false);
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target as Node)) setRegisterDropdownOpen(false);
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) setUserDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Admin routes have their own dedicated admin header; hide public navbar
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleLogout = () => {
    db.setCurrentUser(null);
    setCurrentUser(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const isCarrier = currentUser?.role === 'CARRIER';
  const isCustomer = currentUser?.role === 'CUSTOMER';

  // Display name helper
  const displayName = isCarrier 
    ? (currentUser?.companyName || 'Mahmut Nakliyat')
    : (currentUser?.fullName || currentUser?.name || currentUser?.email?.split('@')[0] || 'Ömer Faruk');

  const avatarInitial = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/97 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* ── DESKTOP BAR (h-16 on md+, 3-column grid) ── */}
      <div className="hidden md:grid md:grid-cols-3 items-center max-w-7xl mx-auto px-6 h-16">

        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 w-fit">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-[#0A1128] leading-none">
              NAKLİYEM<span className="text-[#F95700]">PARA</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">
              Taşıma &amp; Nakliyeci İş Ağı
            </span>
          </div>
        </Link>

        {/* Center: Nav Links */}
        <nav className="flex items-center justify-center gap-1">
          <Link
            href={isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri'}
            className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${pathname?.includes('defter') ? 'bg-orange-50 text-[#F95700]' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            <BookOpen className="w-4 h-4 text-[#F95700] shrink-0" />
            Defter
          </Link>

          <Link
            href={isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/talepler'}
            className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${pathname?.includes('talepler') || pathname?.includes('isler') ? 'bg-orange-50 text-[#F95700]' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            <FileText className="w-4 h-4 text-[#F95700] shrink-0" />
            {isCustomer ? 'Taleplerim' : 'Talepler'}
          </Link>

          {/* Clean 'Teklif Al' without orange background per user request */}
          <Link
            href="/teklif-al"
            className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${pathname?.startsWith('/teklif-al') ? 'bg-orange-50 text-[#F95700]' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            <Truck className="w-4 h-4 text-[#F95700] shrink-0" />
            Teklif Al
          </Link>

          {!isCustomer && (
            <Link
              href="/pazaryeri"
              className={`px-3 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-1.5 whitespace-nowrap ${pathname?.startsWith('/pazaryeri') ? 'bg-orange-50 text-[#F95700]' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <ShoppingBag className="w-4 h-4 text-[#F95700] shrink-0" />
              Pazaryeri
            </Link>
          )}
        </nav>

        {/* Right: Auth Profile or Login/Register */}
        <div className="flex items-center justify-end gap-2">
          {currentUser ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer text-sm font-bold text-slate-800 shadow-xs"
              >
                <div className={`w-8 h-8 rounded-xl ${isCarrier ? 'bg-[#0A1128] text-white' : 'bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white'} flex items-center justify-center text-xs font-black shadow-sm`}>
                  {avatarInitial}
                </div>
                <div className="text-left flex flex-col">
                  <span className="font-black text-xs text-[#0A1128] leading-tight max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 leading-none">
                    {isCarrier ? 'Nakliye Firması' : isCustomer ? 'Bireysel Müşteri' : 'Yönetici'}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-black text-slate-900 truncate">{displayName}</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{currentUser.email || currentUser.phone}</p>
                  </div>

                  {isCustomer && (
                    <div className="py-1">
                      <Link href="/app/customer/taleplerim" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <FileText className="w-3.5 h-3.5 text-[#F95700]" />
                        Taşınma Taleplerim
                      </Link>
                      <Link href="/app/customer/teklifler" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <Truck className="w-3.5 h-3.5 text-[#F95700]" />
                        Gelen Teklifler
                      </Link>
                      <Link href="/app/customer/mesajlar" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <MessageSquare className="w-3.5 h-3.5 text-[#F95700]" />
                        Mesajlarım
                      </Link>
                      <Link href="/app/customer/profil" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        Profilim &amp; Ayarlar
                      </Link>
                    </div>
                  )}

                  {isCarrier && (
                    <div className="py-1">
                      <Link href="/app/carrier/isler" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <Briefcase className="w-3.5 h-3.5 text-[#F95700]" />
                        Açık İşler &amp; Teklif Ver
                      </Link>
                      <Link href="/app/carrier/defter" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <BookOpen className="w-3.5 h-3.5 text-[#F95700]" />
                        Nakliyeci Defteri
                      </Link>
                      <Link href="/app/carrier/mesajlar" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <MessageSquare className="w-3.5 h-3.5 text-[#F95700]" />
                        Mesajlarım
                      </Link>
                      <Link href="/app/carrier/profil" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <User className="w-3.5 h-3.5 text-[#F95700]" />
                        Kamu Vitrin Profilim
                      </Link>
                      <Link href="/app/carrier/abonelik" onClick={() => setUserDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-orange-50 hover:text-[#F95700] transition-colors">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        Abonelik &amp; Paketim
                      </Link>
                    </div>
                  )}

                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative" ref={loginDropdownRef}>
                <button
                  onClick={() => { setLoginDropdownOpen(!loginDropdownOpen); setRegisterDropdownOpen(false); }}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-black text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Giriş Yap <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in space-y-1">
                    <Link href="/giris?role=musteri" onClick={() => setLoginDropdownOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-slate-800 font-black text-xs transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#C23E00] flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5" /></div>
                      <span>Müşteri Girişi</span>
                    </Link>
                    <Link href="/giris?role=nakliyeci" onClick={() => setLoginDropdownOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 font-black text-xs transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-[#0A1128] text-white flex items-center justify-center shrink-0"><Truck className="w-3.5 h-3.5" /></div>
                      <span>Nakliyeci Girişi</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Kaydol with Orange background per user request */}
              <div className="relative" ref={registerDropdownRef}>
                <button
                  onClick={() => { setRegisterDropdownOpen(!registerDropdownOpen); setLoginDropdownOpen(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white text-sm font-black transition-all shadow-md shadow-orange-900/20 cursor-pointer"
                >
                  Kaydol <ChevronDown className="w-3.5 h-3.5 text-white/80" />
                </button>
                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fade-in space-y-1">
                    <Link href="/kayit?role=musteri" onClick={() => setRegisterDropdownOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-orange-50 text-slate-800 font-black text-xs transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#C23E00] flex items-center justify-center shrink-0"><User className="w-3.5 h-3.5" /></div>
                      <span>Müşteri Hesabı</span>
                    </Link>
                    <Link href="/kayit?role=nakliyeci" onClick={() => setRegisterDropdownOpen(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-slate-800 font-black text-xs transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-[#0A1128] text-white flex items-center justify-center shrink-0"><Truck className="w-3.5 h-3.5" /></div>
                      <span>Nakliyeci Kaydı</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE BAR (logo + hamburger only) ── */}
      <div className="md:hidden flex items-center justify-between px-4 h-14">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center shadow-sm">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-black text-lg tracking-tight text-[#0A1128]">
            NAKLİYEM<span className="text-[#F95700]">PARA</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <Link
              href={isCarrier ? '/app/carrier/profil' : '/app/customer/profil'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-black text-slate-800"
            >
              <div className={`w-5 h-5 rounded-full ${isCarrier ? 'bg-[#0A1128]' : 'bg-[#F95700]'} text-white flex items-center justify-center text-[10px]`}>
                {avatarInitial}
              </div>
              <span className="max-w-[70px] truncate">{displayName}</span>
            </Link>
          ) : (
            <Link href="/kayit" className="px-3 py-1.5 rounded-xl bg-[#F95700] text-white text-xs font-black shadow-sm">
              Kaydol
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menü"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU PANEL ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 animate-fade-in shadow-xl">
          {currentUser && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${isCarrier ? 'bg-[#0A1128]' : 'bg-[#F95700]'} text-white flex items-center justify-center font-black text-sm`}>
                  {avatarInitial}
                </div>
                <div>
                  <div className="font-black text-xs text-[#0A1128]">{displayName}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{currentUser.email || currentUser.phone}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="text-xs font-bold text-red-600 hover:underline">
                Çıkış
              </button>
            </div>
          )}

          <nav className="space-y-1">
            {[
              { href: isCarrier ? '/app/carrier/defter' : '/nakliyeci-defteri', label: 'Defter', icon: <BookOpen className="w-4 h-4 text-[#F95700]" /> },
              { href: isCarrier ? '/app/carrier/isler' : isCustomer ? '/app/customer/taleplerim' : '/talepler', label: isCustomer ? 'Taleplerim' : 'Talepler', icon: <FileText className="w-4 h-4 text-[#F95700]" /> },
              { href: '/teklif-al', label: 'Teklif Al', icon: <Truck className="w-4 h-4 text-[#F95700]" /> },
              ...(!isCustomer ? [{ href: '/pazaryeri', label: 'Pazaryeri', icon: <ShoppingBag className="w-4 h-4 text-[#F95700]" /> }] : []),
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-black transition-all text-slate-800 hover:bg-slate-100"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {!currentUser ? (
            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2">
              <Link href="/giris" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full font-black text-sm">Giriş Yap</Button>
              </Link>
              <Link href="/kayit" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full font-black text-sm">Kaydol</Button>
              </Link>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Oturumu Kapat
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
