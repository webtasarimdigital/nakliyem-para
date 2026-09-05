import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları ve Platform Sorumluluk Reddi | Nakliyem Para',
  description: 'Nakliyem Para platform kullanım koşulları, üyelik şartları ve taşıma sorumluluk maddeleri.'
};

export default function KullanimKosullariPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-4">
          Kullanım Koşulları
        </h1>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-medium">
          <strong>Önemli Yasal Bilgilendirme:</strong> Nakliyem Para platformu bir aracı hizmet sağlayıcıdır. Taşıma ücretini tahsil etmez ve nakliyat operasyonunun bizzat tarafı değildir. Müşteriler taşıma sözleşmesini ve ödeme detaylarını anlaştıkları nakliyeci ile doğrudan kararlaştırır.
        </div>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">1. Hizmetin Kapsamı</h2>
        <p>
          Platform, ev ve ofis taşıtmak isteyen müşteriler ile hizmet veren bağımsız nakliyat firmalarını dijital ortamda bir araya getiren bir pazar yeri ve iletişim altyapısı sunar.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">2. Ücretsiz Teklif Alma</h2>
        <p>
          Müşteriler için talep oluşturmak, firmalarla yazışmak ve teklif almak tamamen ücretsizdir.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">3. Nakliyeci Sorumlulukları</h2>
        <p>
          Kayıt olan tüm nakliyeciler sundukları hizmetlerin, verdikleri fiyat tekliflerinin ve eşya güvenliğinin yasal sorumluluğunu kendileri üstlenir.
        </p>
      </div>
    </div>
  );
}
