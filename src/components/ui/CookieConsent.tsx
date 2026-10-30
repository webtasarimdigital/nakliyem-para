'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, Shield, Check, X, Settings2, ExternalLink } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'tt_cookie_consent_v1';

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Modal state
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setShowBanner(true);
      } else {
        const parsed: CookiePreferences = JSON.parse(saved);
        setAnalyticsAllowed(!!parsed.analytics);
        setMarketingAllowed(!!parsed.marketing);
      }
    } catch {
      setShowBanner(true);
    }

    const handleOpenSettings = () => {
      setShowModal(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const savePreferences = (preferences: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: preferences }));
    } catch {
      // ignore localStorage quota error
    }
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsAllowed(true);
    setMarketingAllowed(true);
    savePreferences(prefs);
  };

  const handleRejectNonEssential = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsAllowed(false);
    setMarketingAllowed(false);
    savePreferences(prefs);
  };

  const handleSaveCustom = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: analyticsAllowed,
      marketing: marketingAllowed,
      timestamp: new Date().toISOString(),
    };
    savePreferences(prefs);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Bottom Sticky Banner */}
      {showBanner && !showModal && (
        <aside
          role="region"
          aria-label="Çerez ve Gizlilik Tercihleri Bildirimi"
          className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl transition-transform animate-in fade-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#F95700] flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <p>
                  <strong>Çerez Tercihleriniz ve Gizliliğiniz:</strong> Sitemizin temel işlevlerini yürütmek, oturum güvenliğini sağlamak ve deneyiminizi geliştirmek için zorunlu çerezler kullanmaktayız. Açık rızanız doğrultusunda performans, analitik ve pazarlama çerezleri de kullanılabilmektedir.{' '}
                  <Link href="/cerez-politikasi" className="text-[#F95700] font-bold underline hover:text-[#d44800]">
                    Çerez Politikamızı
                  </Link>{' '}
                  ve{' '}
                  <Link href="/kvkk" className="text-[#F95700] font-bold underline hover:text-[#d44800]">
                    Aydınlatma Metnimizi
                  </Link>{' '}
                  inceleyebilirsiniz.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 md:flex-none px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Tercihleri Yönet</span>
              </button>

              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="flex-1 md:flex-none px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors cursor-pointer text-center"
              >
                Reddet
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto px-5 py-2 text-xs font-extrabold text-white bg-[#F95700] hover:bg-[#E04F00] shadow-md shadow-orange-500/20 rounded-xl transition-all cursor-pointer text-center"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Preferences Management Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0A1128]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-7 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#111E38]">
                    Çerez Tercihlerini Özelleştir
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    6698 Sayılı KVKK Uyarınca Açık Rıza Yönetimi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              {/* Mandatory */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Zorunlu ve Güvenlik Çerezleri</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Her Zaman Aktif
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Sitenin temel fonksiyonlarının yerine getirilmesi, üye girişi, oturum güvenliği ve form akışının korunması için zorunludur. Kapatılamaz.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Örnekler: tt_session, tt_auth, tt_csrf, tt_cookie_consent
                </div>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Performans ve Analitik Çerezleri</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analyticsAllowed}
                      onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F95700]"></div>
                  </label>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Sayfaların kullanım sıklığını, gezinme yollarını ve hata oranlarını anonim olarak ölçümlememize imkan tanır. Kimliğinizi tespit etmez.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Örnekler: _ga, _gid, tt_perf (Google Analytics / Platform Analitiği)
                </div>
              </div>

              {/* Marketing */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Pazarlama ve Hedefleme Çerezleri</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingAllowed}
                      onChange={(e) => setMarketingAllowed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F95700]"></div>
                  </label>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Sizin ilgi alanlarınıza uygun nakliye kampanyalarını ve duyuruları göstermek amacıyla iş ortaklarımız aracılığıyla kullanılabilir.
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Örnekler: _fbp, tt_mkt (Meta / Google Reklam)
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
              >
                Tümünü Reddet
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer text-center"
                >
                  Tümünü Kabul Et
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04F00] text-xs font-extrabold text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer text-center"
                >
                  Seçimlerimi Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
