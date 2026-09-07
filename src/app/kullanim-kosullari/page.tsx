import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Scale, FileText, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları ve Hizmet Şartları | TaşınTeklif',
  description: 'TaşınTeklif platform kullanım koşulları, aracı hizmet sağlayıcı yasal statüsü, müşteri ve nakliyeci sorumluluk maddeleri.',
  keywords: ['kullanım koşulları', 'taşınteklif sözleşmesi', 'nakliyat hizmet şartları', 'pazaryeri sorumluluk reddi']
};

export default function KullanimKosullariPage() {
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
            <Scale className="w-4 h-4" />
            <span>Platform Yasal Çerçevesi</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111E38] tracking-tight mb-3">
            Kullanım Koşulları
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Son Güncelleme: 1 Eylül 2026 • TaşınTeklif Kullanıcı Sözleşmesi
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed font-medium flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Önemli Yasal Bilgilendirme (Aracı Hizmet Sağlayıcı Rolü):</strong> TaşınTeklif (tasinteklif.com), 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca bir <strong>Aracı Hizmet Sağlayıcı</strong>&apos;dır. Platform, nakliye hizmetini bizzat ifa eden bir taşımacı şirket değildir; taşınmak isteyen müşteriler ile bağımsız nakliyat firmalarını dijital ortamda buluşturan bir teknoloji pazaryeridir.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Tanımlar ve Taraflar</h2>
            </div>
            <p>
              İşbu sözleşmede geçen terimler aşağıdaki anlamları ifade eder:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Platform:</strong> TaşınTeklif Teknoloji ve Bilişim Hizmetleri tarafından işletilen tasinteklif.com web sitesi ve mobil arayüzleri.</li>
              <li><strong>Müşteri:</strong> Taşınma, ofis taşıma, parça eşya veya depolama talebi açarak teklif toplayan gerçek veya tüzel kişi.</li>
              <li><strong>Nakliyeci / Firma:</strong> Platforma üye olup müşterilere fiyat teklifi sunan, bağımsız taşıma yetki belgesine sahip nakliyat şirketi.</li>
              <li><strong>Talep:</strong> Müşterinin sisteme girdiği oda sayısı, adres, tarih ve eşya detaylarını içeren taşıma ilanı.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Müşteri İçin Ücretsiz Hizmet Modeli</h2>
            </div>
            <p>
              Müşterilerin TaşınTeklif üzerinde talep açması, firmalardan gelen teklifleri incelemesi, nakliye şirketlerinin profillerini ve müşteri yorumlarını okuması <strong>tamamen ve her zaman ücretsizdir</strong>. Platform, müşteriden teklif alma veya rezervasyon aşamasında herhangi bir komisyon ya da hizmet bedeli talep etmez.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Müşteri Yükümlülükleri ve Doğru Bilgi Beyanı</h2>
            </div>
            <p>
              Müşteri, talep formunda taşınacak eşyaların oda sayısını, bina kat durumunu, asansör kullanılabilirliğini ve özel ağırlıktaki eşyaları (piyano, kasa vb.) eksiksiz ve doğru beyan etmekle yükümlüdür. Yanlış veya eksik bilgi verilmesi durumunda taşınma günü doğabilecek ek ücretler veya gecikmelerden Platform sorumlu tutulamaz.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Taşıma Sözleşmesi ve Ödeme Esasları</h2>
            </div>
            <p>
              Müşteri ve seçtiği nakliyat firması, taşıma gününden önce aralarında fiziki veya dijital bir Taşıma Sözleşmesi ve Emtia Sigortası akdetmelidir. Taşıma bedelinin ödenmesi doğrudan müşteri ile nakliyeci firma arasında (elden, havale veya firma POS&apos;u ile) kararlaştırılır. Platform ödemeye aracılık etmez ve taşıma ücretini tahsil etmez.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Nakliyeci Sorumlulukları ve Belge Standartları</h2>
            </div>
            <p>
              Platforma kayıt olan tüm taşımacılar, Karayolu Taşıma Yönetmeliği gereğince ilgili faaliyet için zorunlu olan K3 / K1 yetki belgelerine ve vergi levhasına sahip olduklarını taahhüt eder. Nakliyeciler sundukları tekliflerin arkasında durmak ve müşteriye taahhüt ettikleri paketleme, asansör ve montaj standartlarını eksiksiz yerine getirmekle yükümlüdür.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Sorumluluk Reddi Beyanı (Disclaimer)</h2>
            </div>
            <p>
              Taşınma esnasında meydana gelebilecek eşya hasarları, kırılmalar, taşıma günü gecikmeleri veya müşteri ile firma arasındaki bireysel anlaşmazlıklarda TaşınTeklif doğrudan hukuki veya maddi bir taraf değildir. Ancak Platform, haksız fiilde bulunan, taahhüdüne uymayan veya müşteri mağduriyeti yaratan nakliye firmalarının hesaplarını askıya alma, üyeliklerini iptal etme ve sisteme erişimlerini kalıcı olarak engelleme hakkını saklı tutar.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Fikri ve Sınai Mülkiyet Hakları</h2>
            </div>
            <p>
              tasinteklif.com sitesinin tüm marka hakları, yazılım kodları, tasarımı, metinleri, logoları ve veritabanı yapısı TaşınTeklif&apos;e aittir. Önceden yazılı izin alınmaksızın kısmen dahi kopyalanamaz, çoğaltılamaz veya scraping yöntemleriyle çekilemez.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <h3 className="font-bold text-[#111E38] text-base">Uyuşmazlık Çözümü ve Yetkili Mahkemeler</h3>
              <p>
                İşbu sözleşmenin uygulanmasından doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti Kanunları uygulanır ve İstanbul Merkez (Çağlayan) Mahkemeleri ile İcra Daireleri yetkilidir. Sorularınız için <strong>bilgi@tasinteklif.com</strong> adresinden bize ulaşabilirsiniz.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
