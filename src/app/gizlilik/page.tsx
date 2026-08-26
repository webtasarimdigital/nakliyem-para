import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Nakliyem Para',
  description: 'Nakliyem Para kullanıcı ve firma gizlilik politikası ilkeleri.'
};

export default function GizlilikPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
          Gizlilik Politikası
        </h1>

        <p>
          Gizliliğiniz bizim için en üst düzeyde öneme sahiptir. Nakliyem Para olarak topladığımız tüm kişisel verileri endüstri standardı güvenlik protokolleri ile korumaktayız.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">1. İletişim Bilgilerinin Gizliliği</h2>
        <p>
          Müşterilerin telefon numaraları asla arama motorlarına veya üye olmayan ziyaretçilere açık olarak yayınlanmaz. Yalnızca talepte açıkça onay veren müşterilerin iletişim bilgileri ilgili teklifi ileten onaylı nakliyeciye gösterilir.
        </p>

        <h2 className="text-base font-bold text-slate-900 pt-2">2. Ödeme Bilgileri Güvenliği</h2>
        <p>
          Nakliyeci aboneliklerinde kullanılan kredi kartı bilgileri PCI-DSS uyumlu lisanslı ödeme kuruluşları altyapısında tokenize edilerek saklanır. Kart bilgileriniz sunucularımızda tutulmaz.
        </p>
      </div>
    </div>
  );
}
