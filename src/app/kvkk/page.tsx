import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | Nakliyem Para',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.'
};

export default function KvkkPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-4">
          KVKK Aydınlatma Metni
        </h1>

        <p>
          Nakliyem Para olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca veri sorumlusu sıfatıyla kişisel verilerinizin güvenliğine ve gizliliğine azami hassasiyet göstermekteyiz.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">1. İşlenen Kişisel Veriler</h2>
        <p>
          Platformumuz üzerinden talep oluşturan müşterilerden ad, soyad, telefon numarası, e-posta adresi ve taşınma lokasyon bilgileri; nakliyeci firmalardan ise ticari unvan, vergi levhası, yetkili kimlik bilgileri ve araç ruhsatları toplanmaktadır.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">2. Verilerin Korunması ve Gizlilik</h2>
        <p>
          Müşteri telefon numaraları yalnızca müşterinin açık rıza ve onayı doğrultusunda doğrulanmış nakliyat firmalarına teklif iletimi için gösterilir. Firmaların kimlik ve vergi belgeleri private storage alanlarında saklanır ve kamuya açık olarak paylaşılmaz.
        </p>

        <h2 className="text-base font-bold text-[#0A1128] pt-2">3. İletişim ve Haklarınız</h2>
        <p>
          KVKK 11. maddesi kapsamındaki haklarınızı kullanmak için <strong>destek@nakliyempara.com</strong> adresine yazılı olarak başvurabilirsiniz.
        </p>
      </div>
    </div>
  );
}
