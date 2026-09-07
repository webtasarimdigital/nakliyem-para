import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Lock, ShieldCheck, Mail, ArrowLeft, EyeOff, CreditCard, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gizlilik ve Güvenlik Politikası | TaşınTeklif',
  description: 'TaşınTeklif müşteri ve nakliyeci gizlilik taahhüdü, telefon numarası koruma protokolü, SSL güvenliği ve veri saklama standartları.',
  keywords: ['gizlilik politikası', 'veri güvenliği', 'müşteri gizliliği', 'nakliyat telefon koruması']
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#F95700] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Ana Sayfaya Dön
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#F95700] text-xs font-bold mb-4 border border-orange-200/60">
            <Lock className="w-4 h-4" />
            <span>Kullanıcı Güvenliği Taahhüdümüz</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111E38] tracking-tight mb-3">
            Gizlilik ve Güvenlik Politikası
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Son Güncelleme: 1 Eylül 2026 • TaşınTeklif Güvencesi
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            TaşınTeklif olarak kullanıcılarımızın gizliliğini en temel hak olarak görüyoruz. Bu metin, platformumuzu kullanan ev &amp; ofis sahipleri ile nakliyeci iş ortaklarımızın kişisel ve kurumsal bilgilerinin nasıl korunduğunu şeffaf bir biçimde açıklamaktadır.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold">İletişim Bilgilerinin Gizliliği (Anti-Spam Koruması)</h2>
            </div>
            <p>
              Müşteri memnuniyetini zedeleyen en büyük problemlerden biri olan gereksiz arama ve spam bombardımanını önlemek için TaşınTeklif şu kuralları tavizsiz uygular:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#111E38] text-sm">
                  <EyeOff className="w-4 h-4 text-emerald-600" /> Arama Motorlarına Kapalı
                </div>
                <p className="text-xs text-slate-600">
                  Telefon numaranız, adresiniz ve tam adınız Google gibi arama motorlarının indeksine asla dahil edilmez, kamuya açık sergilenmez.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#111E38] text-sm">
                  <UserCheck className="w-4 h-4 text-[#F95700]" /> Yalnızca Onaylı Nakliyeciler
                </div>
                <p className="text-xs text-slate-600">
                  Telefon numaranız yalnızca talep formunda izin vermeniz durumunda, talebinize fiyat teklifi sunan doğrulanmış ve K3 lisanslı nakliyeciye gösterilir.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Ödeme ve Kredi Kartı Bilgileri Güvenliği</h2>
            </div>
            <p>
              Nakliyeci firmalarımızın abonelik ve dijital hizmet alımlarında kullandıkları kredi kartı verileri en üst düzey PCI-DSS Seviye 1 uyumlu lisanslı ödeme kuruluşları (BDDK lisanslı altyapılar) aracılığıyla tokenize edilerek işlenir.
            </p>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <CreditCard className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Kredi Kartı Saklamama Güvencesi:</strong> Kredi kartı numaranız, son kullanma tarihiniz ve CVV kodunuz TaşınTeklif sunucularında <strong>asla tutulmaz ve saklanmaz</strong>. Tüm işlemler 3D Secure onay kodu ile bankanızın kendi güvenli ekranı üzerinden gerçekleşir.
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Nakliyeci Firma Belgelerinin Korunması</h2>
            </div>
            <p>
              Doğrulama sürecinde firmalardan talep edilen vergi levhası, yetki belgeleri (K3), araç ruhsatları ve yetkili kimlik fotokopileri yalnızca yönetim ve onay ekiplerimizin erişebildiği izole özel sunucularda (Private Storage) şifreli saklanır. Bu belgeler hiçbir zaman kamuya açık yayınlanmaz.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Üçüncü Taraflarla Veri Paylaşımı Yasağı</h2>
            </div>
            <p>
              TaşınTeklif, kullanıcılarının iletişim veya işlem verilerini gelir elde etmek amacıyla üçüncü taraf reklam ağlarına, pazarlama ajanslarına veya veri simsarlarına <strong>kesinlikle devretmez, kiralayamaz ve satamaz</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Hesap Silme ve Verilerin Temizlenmesi</h2>
            </div>
            <p>
              Müşteriler veya nakliyeci firmalar diledikleri zaman hesaplarının ve kişisel verilerinin sistemlerimizden kalıcı olarak silinmesini talep edebilir. Talebiniz üzerine mevzuattaki yasal muhasebe saklama süreleri haricindeki tüm taşınma talepleri, mesaj geçmişi ve profil bilgileri sistemlerimizden geri döndürülemez şekilde silinir.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <h3 className="font-bold text-[#111E38] text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F95700]" /> Gizlilik Soruları ve Destek
              </h3>
              <p>
                Gizlilik politikamız veya verilerinizin güvenliği hakkında sorularınız için her zaman <strong>bilgi@tasinteklif.com</strong> e-posta adresi üzerinden gizlilik ekibimizle iletişime geçebilirsiniz.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
