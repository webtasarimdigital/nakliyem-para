'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function BakimPage() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const trimmed = secretKey.trim();
    // Valid bypass key
    if (trimmed === 'tasin2026') {
      // Set 30-day bypass cookie
      document.cookie = 'tasinteklif_maintenance_bypass=1; path=/; max-age=2592000; SameSite=Lax';
      setAuthSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
    } else {
      setAuthError('Geçersiz erişim anahtarı. Lütfen kontrol ediniz.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#F95700]/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#F95700] flex items-center justify-center text-white font-black shadow-lg shadow-orange-950/50">
            T
          </div>
          <span className="font-black text-xl tracking-tight text-white">
            TAŞIN<span className="text-[#F95700]">TEKLİF</span>
          </span>
        </div>

        <button
          onClick={() => setShowAuthModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-orange-400" />
          <span>Yetkili Girişi</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-extrabold mb-6 animate-pulse">
          <Wrench className="w-4 h-4 text-[#F95700]" />
          <span>Sistem Altyapı & Bakım Çalışması</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl leading-tight sm:leading-tight mb-4">
          Daha İyisi İçin <span className="text-[#F95700]">Sistemlerimizi</span> Güncelliyoruz
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
          TaşınTeklif olarak siz değerli müşterilerimize ve nakliyeci iş ortaklarımıza daha hızlı, güvenli ve kesintisiz bir nakliyat pazaryeri deneyimi sunmak amacıyla platform genelinde kapsamlı bir teknik revizyon ve optimizasyon yürütüyoruz.
        </p>

        {/* Feature/Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-10 text-left">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#F95700] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Planlı Güncelleme</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Veritabanı ve sunucu altyapımız güçlendirilmektedir. Kısa süre içinde tekrar yayında olacağız.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Verileriniz Güvende</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mevcut üyelikleriniz, talepleriniz ve bakiyeleriniz eksiksiz olarak muhafaza edilmektedir.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">7/24 Çağrı Desteği</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Devam eden taşınma süreçleriniz ve acil destek ihtiyaçlarınız için müşteri temsilcilerimize ulaşabilirsiniz.
            </p>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-2xl w-full text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-[#F95700]" />
            <span>Müşteri Hizmetleri:</span>
            <strong className="text-white select-text">+971 58 518 8543</strong>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-[#F95700]" />
            <span>Destek E-posta:</span>
            <strong className="text-white select-text">bilgi@tasinteklif.com</strong>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-500 border-t border-white/5">
        <p>© 2026 Taşın Teklif. Tüm hakları saklıdır.</p>
      </footer>

      {/* Authorized Access Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111E38] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#F95700]/20 text-[#F95700] flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-center text-white mb-1">
              Yetkili Önizleme Erişimi
            </h3>
            <p className="text-xs text-slate-400 text-center mb-5">
              Bakım modunu geçici olarak atlayıp site içeriğini ve yönetimi görüntülemek için erişim anahtarınızı girin.
            </p>

            {authSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4" /> Erişim onaylandı! Yönlendiriliyorsunuz...
              </div>
            ) : (
              <form onSubmit={handleBypassSubmit} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Erişim Şifresi
                  </label>
                  <input
                    type="password"
                    placeholder="Şifrenizi girin..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#F95700] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#F95700] hover:bg-orange-600 text-white font-extrabold text-sm transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Siteyi Aç (Önizleme)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center">
                  <a
                    href="/admin"
                    className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    Doğrudan Admin Paneline Git →
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
