import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nakliyeci Üyelik ve Hizmet Sözleşmesi | Nakliyem Para',
  description: 'Nakliyat firmaları için platform katılım, abonelik ve Defter kullanım kuralları sözleşmesi.'
};

export default function NakliyeciSozlesmesiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-4">
          Nakliyeci Üyelik Sözleşmesi
        </h1>

        <p>
          İşbu sözleşme, Nakliyem Para platformuna kayıt olan nakliyat firmaları ile platform işleticisi arasındaki hak ve yükümlülükleri düzenler.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">1. Doğrulama ve Belge Yükümlülüğü</h2>
        <p>
          Kayıt olan nakliyeci, sunduğu vergi levhası, yetkili kimliği ve taşıma yetki belgelerinin doğruluğunu taahhüt eder.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">2. 7 Günlük Deneme ve Otomatik Yenileme</h2>
        <p>
          Firma doğrulaması onaylandıktan sonra tanımlanan 7 günlük deneme süresi sonunda iptal talebinde bulunulmadığı takdirde seçilen paket üzerinden üyelik yenilenir. Firma dilediği zaman abonelik panelinden üyeliğini tek tıkla iptal edebilir.
        </p>
      </div>
    </div>
  );
}
