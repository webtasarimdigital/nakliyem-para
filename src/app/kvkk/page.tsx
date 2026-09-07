import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni | TaşınTeklif',
  description: '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca TaşınTeklif veri işleme ilkeleri, müşteri ve nakliyeci hakları, veri güvenliği ve aydınlatma metni.',
  keywords: ['kvkk aydınlatma metni', 'kişisel verilerin korunması', 'taşınteklif veri güvenliği', 'nakliyat gizlilik hakları']
};

export default function KvkkPage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>6698 Sayılı Kanun Uyarınca</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111E38] tracking-tight mb-3">
            KVKK Aydınlatma Metni
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Son Güncelleme: 1 Eylül 2026 • Yürürlük Sürümü: 2.1
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <strong>TaşınTeklif</strong> (&quot;Platform&quot;), 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili ikincil mevzuat kapsamında <strong>Veri Sorumlusu</strong> sıfatıyla, hizmetlerimizden faydalanan bireysel/kurumsal müşterilerimizin ve platforma kayıtlı taşımacı iş ortaklarımızın kişisel verilerini en yüksek güvenlik standartlarında işlemekte ve korumaktadır.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Veri Sorumlusunun Kimliği</h2>
            </div>
            <p>
              İşbu Aydınlatma Metni kapsamında veri sorumlusu; Türkiye Cumhuriyeti kanunlarına uygun olarak faaliyet gösteren ve <strong>tasinteklif.com</strong> internet sitesini işleten <strong>TaşınTeklif Teknoloji ve Bilişim Hizmetleri</strong>&apos;dir.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p><strong>Platform:</strong> TaşınTeklif Dijital Nakliyat ve Lojistik Pazaryeri</p>
              <p><strong>İnternet Adresi:</strong> https://tasinteklif.com</p>
              <p><strong>KVKK İletişim &amp; Başvuru:</strong> bilgi@tasinteklif.com</p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold">İşlenen Kişisel Veri Kategorileri</h2>
            </div>
            <p>
              Platformumuzda sunulan nakliye teklifi alma, ilan verme ve nakliyeci defteri hizmetlerinin ifası amacıyla aşağıdaki kategorilerde kişisel veriler işlenmektedir:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-[#111E38] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Müşteri Verileri
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  <li>Ad, soyad ve hesap kimlik bilgileri</li>
                  <li>Telefon numarası ve e-posta adresi</li>
                  <li>Taşınma başlangıç ve varış adresi / il / ilçe</li>
                  <li>Bina katı, asansör varlığı ve oda sayısı (örn. 2+1, 3+1)</li>
                  <li>Eşya listesi ve yüklenen eşya fotoğrafları</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <h3 className="font-bold text-[#111E38] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#F95700]" /> Nakliyeci Firma Verileri
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  <li>Ticari unvan, vergi levhası ve vergi dairesi</li>
                  <li>Firma yetkilisi ad, soyad ve kimlik bilgileri</li>
                  <li>K3 / K1 / Yetki Belgesi ve oda kayıt belgeleri</li>
                  <li>Araç plakaları, ruhsat belgeleri ve filo bilgisi</li>
                  <li>Abonelik faturalandırma ve ödeme işlem referansları</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Kişisel Verilerin İşlenme Amaçları</h2>
            </div>
            <p>
              Toplanan kişisel verileriniz, KVKK&apos;nın 5. ve 6. maddelerinde belirtilen şartlara uygun olarak aşağıdaki amaçlarla işlenmektedir:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
              <li>Müşterilerin oluşturduğu taşınma taleplerinin ilgili güzergahtaki doğrulanmış nakliyecilere iletilmesi,</li>
              <li>Müşteri ile teklif veren firma arasında şeffaf ve güvenli bir tekliflendirme sürecinin yürütülmesi,</li>
              <li>Nakliyat firmalarının yetki belgelerinin (K3 vb.) kontrol edilerek korsan ve belgesiz taşımacılığın engellenmesi,</li>
              <li>5651 sayılı Kanun uyarınca erişim loglarının tutulması ve siber güvenlik kontrollerinin sağlanması,</li>
              <li>Abonelik, fatura ve muhasebe süreçlerinin yasal mevzuata uygun şekilde yürütülmesi,</li>
              <li>Olası uyuşmazlıklarda müşteri ve taşıyıcı haklarının korunması ve ispat yükümlülüğünün yerine getirilmesi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Kişisel Verilerin Aktarımı ve Gizlilik İlkeleri</h2>
            </div>
            <p>
              TaşınTeklif, kişisel verilerinizi <strong>hiçbir koşulda reklam veya pazarlama amaçlı üçüncü şahıslara satmaz ya da kiralamaz</strong>. Verileriniz yalnızca aşağıdaki taraflara sınırlı olarak aktarılır:
            </p>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                <strong>Telefon Numarası Gizliliği Güvencesi:</strong> Müşteri telefon numaraları web sitemizde arama motorlarına veya genel ziyaretçilere açık olarak asla yayınlanmaz. Telefon numarası, yalnızca müşterinin talep formunda onay vermesi halinde, talebe teklif sunan doğrulanmış nakliyat firmasına teklif süresince gösterilir.
              </div>
              <p>
                Ayrıca yasal zorunluluk gereği mahkemeler, icra daireleri, kolluk kuvvetleri ve T.C. Ulaştırma ve Altyapı Bakanlığı gibi yetkili kamu kurum ve kuruluşlarından gelen resmi talepler doğrultusunda bilgi aktarımı yapılabilir.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Kişisel Veri Toplama Yöntemi ve Hukuki Sebebi</h2>
            </div>
            <p>
              Kişisel verileriniz; web sitemiz üzerindeki teklif oluşturma formları, üyelik kayıt ekranları, nakliyeci defteri gönderi alanları, çağrı/destek yazışmaları ve çerezler vasıtasıyla tamamen dijital ve otomatik yöntemlerle toplanmaktadır.
            </p>
            <p>
              Bu veriler; KVKK madde 5/2 uyarınca <em>&quot;bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması&quot;</em>, <em>&quot;veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi&quot;</em> ve <em>&quot;ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması&quot;</em> hukuki sebeplerine dayanarak işlenmektedir.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Veri Güvenliği ve Saklama Tedbirleri</h2>
            </div>
            <p>
              TaşınTeklif, kişisel verilerinizin hukuka aykırı olarak işlenmesini, erişilmesini önlemek ve muhafazasını sağlamak amacıyla uluslararası endüstri standartlarında teknik ve idari tedbirleri uygulamaktadır:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Web sitesi trafiği 256-bit SSL / TLS uçtan uca şifreleme ile korunur.</li>
              <li>Nakliyeci belgeleri (K3, ruhsat, kimlik) halka kapalı izole private storage bulut sunucularında saklanır.</li>
              <li>Veri tabanlarımız güvenlik duvarları (firewall) ve yetkisiz erişim önleme sistemleriyle 7/24 izlenir.</li>
              <li>Mevzuatta öngörülen saklama süreleri sona erdiğinde kişisel veriler re&apos;sen veya talep üzerine silinir ya da anonim hale getirilir.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="text-lg sm:text-xl font-bold">KVKK Madde 11 Kapsamındaki Haklarınız</h2>
            </div>
            <p>
              KVKK&apos;nın 11. maddesi uyarınca veri sahibi olarak Platformumuza başvurarak:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
              <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
              <li>KVKK 7. maddesi kapsamında verilerin silinmesini veya yok edilmesini isteme,</li>
              <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <h3 className="font-bold text-[#111E38] text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F95700]" /> Haklarınızı Kullanmak İçin Başvuru
              </h3>
              <p>
                Yukarıda sıralanan haklarınızı kullanmak üzere taleplerinizi kayıtlı e-posta adresinizden <strong>bilgi@tasinteklif.com</strong> adresine iletebilirsiniz. Başvurularınız en geç 30 (otuz) gün içerisinde ücretsiz olarak sonuçlandırılacaktır.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
