import Link from 'next/link';
import { Truck, ArrowRight, Home, Search, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-xl mx-auto">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F95700] to-[#e04d00] shadow-xl shadow-orange-900/20 mb-6 mx-auto">
          <Truck className="w-12 h-12 text-white" strokeWidth={1.8} />
        </div>

        {/* 404 Number & Title */}
        <div className="relative mb-6">
          <span className="text-[120px] sm:text-[160px] font-black text-slate-100 leading-none select-none block pointer-events-none tracking-tight">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-[#0A1128]">
              Sayfa Bulunamadı
            </span>
          </div>
        </div>

        {/* Friendly Message */}
        <p className="text-slate-500 text-sm sm:text-base font-medium mb-8 leading-relaxed max-w-md mx-auto">
          Aradığınız sayfa taşınmış, yayından kaldırılmış ya da yanlış yazılmış olabilir. Merak etmeyin, sizi doğru güzergâha ulaştıralım.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#e04d00] text-white font-black text-sm transition-all shadow-md shadow-orange-900/20 active:scale-[0.98] cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/teklif-al"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-[#F95700] text-[#0A1128] hover:text-[#F95700] font-black text-sm transition-all bg-white shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#F95700]" />
            Ücretsiz Teklif Al
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t border-slate-100">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#F95700]" />
            Hızlı Menü & Popüler Sayfalar
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { href: '/evden-eve-nakliyat', label: 'Evden Eve Nakliyat' },
              { href: '/nakliyeciler', label: 'Nakliyeciler' },
              { href: '/nakliyeci-defteri', label: 'Nakliyeci Defteri' },
              { href: '/talepler', label: 'Tüm Talepler' },
              { href: '/pazaryeri', label: 'Pazaryeri' },
              { href: '/giris', label: 'Giriş Yap' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:border-[#F95700] hover:text-[#F95700] hover:bg-orange-50/40 transition-colors bg-white shadow-2xs"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}