import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası | Nakliyem Para',
  description: 'Nakliyem Para çerez kullanımı ve tercihleri.'
};

export default function CerezPolitikasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
          Çerez (Cookie) Politikası
        </h1>
        <p>
          Web sitemizde kullanıcı deneyiminizi geliştirmek, oturum tercihlerinizi hatırlamak ve sistem performansını analiz etmek amacıyla zorunlu ve işlevsel çerezler kullanılmaktadır.
        </p>
      </div>
    </div>
  );
}
