'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[Admin Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-[#0A1128] mb-2">
          Sayfa Yüklenirken Bir Hata Oluştu
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          {error?.message || 'Veriler işlenirken beklenmeyen bir durum oluştu. Lütfen sayfayı yenilemeyi veya Dashboard üzerinden tekrar giriş yapmayı deneyin.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#e04d00] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Yeniden Dene
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
