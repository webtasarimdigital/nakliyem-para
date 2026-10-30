import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Truck, ShieldCheck, CheckCircle2, ArrowLeft, Zap, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nakliyeci Üyelik ve Hizmet Sözleşmesi',
  description: 'TaşınTeklif nakliyat firması üyelik şartları, belge doğrulama esasları, abonelik planları ve komisyonsuz hizmet sözleşmesi maddeleri.',
  keywords: ['nakliyeci sözleşmesi', 'nakliyat üyelik şartları', 'k3 yetki belgesi doğrulama', 'komisyonsuz nakliye pazaryeri'],
  alternates: {
    canonical: '/nakliyeci-sozlesmesi',
  },
};

export default function NakliyeciSozlesmesiPage() {
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
            <Truck className="w-4 h-4" />
            <span>Taşıyıcı İş Ortaklığı İlkeleri</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111E38] tracking-tight mb-3">
            Nakliyeci Üyelik ve Hizmet Sözleşmesi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Son Güncelleme: 1 Eylül 2026 • Kurumsal Taşıyıcı Katılım Koşulları
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            İşbu Sözleşme; <strong>TaşınTeklif</strong> platformuna kayıt olarak dijital nakliye pazar yerinde teklif sunmak, nakliyeci defterini kullanmak ve operasyon yürütmek isteyen <strong>Nakliyat Şirketleri / Taşımacılar</strong> ile platform işleticisi arasındaki ticari ve yasal hak-yükümlülükleri belirler.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Doğrulama ve Yasal Belge Yükümlülüğü</h2>
            </div>
            <p>
              Platformun kalite ve güvenilirlik standardını korumak adına tüm taşımacıların aşağıdaki evrakları sisteme yüklemesi ve yönetim onayından geçmesi zorunludur:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Güncel Vergi Levhası (Nakliyat / Lojistik NACE kodlu),</li>
              <li>T.C. Ulaştırma ve Altyapı Bakanlığı tarafından tanzim edilmiş K3 (Ev ve Büro Eşyası Taşımacılığı) veya geçerli K1 Yetki Belgesi,</li>
              <li>Firma yetkilisinin kimlik beyanı,</li>
              <li>Araç filosu ruhsat örnekleri ve taşımacı mesleki yeterlilik evrakları.</li>
            </ul>
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
              <strong>Korsan Taşımacılığa Sıfır Tolerans:</strong> Yetki belgesi bulunmayan, sahte belge ibraz eden veya başka bir firmanın belgesini izinsiz kullanan hesaplar derhal kapatılır ve yasal mercilere bildirilir.
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Komisyonsuz Model ve Tek Geçerli Standart Fiyatlandırma</h2>
            </div>
            <p>
              Taşın Teklif, geleneksel komisyoncu mantığıyla çalışmaz. Nakliyeciden aldığı iş başına %15-20 gibi yüksek komisyonlar <strong>kesilmez</strong>. Nakliyeci, sabit aylık/yıllık paket üyeliği ile sisteme dahil olur ve müşteriye verdiği fiyatın %100&apos;ünü doğrudan kendisi tahsil eder.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-800">Platformda Geçerli Standart Paket Ücretleri:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li><strong>Başlangıç Paketi:</strong> 1.199 ₺/ay (Yıllık peşin alımda 11.990 ₺/yıl + KDV - 2 ay bedava). Aylık 15 teklif hakkı, 2 rota alarmı ve Defter erişimi.</li>
                <li><strong>Profesyonel Paket (En Çok Tercih Edilen):</strong> 2.990 ₺/ay (Yıllık peşin alımda 29.900 ₺/yıl + KDV - 2 ay bedava). <strong>7 Gün Ücretsiz Deneme (0 ₺ Provizyon)</strong>, aylık 50 teklif hakkı, 35 müşteri telefonu görme, onaylı rozet.</li>
                <li><strong>Filo / Kurumsal (Gold) Paket:</strong> 5.990 ₺/ay (Yıllık peşin alımda 59.900 ₺/yıl + KDV - 2 ay bedava). Sınırsız teklif, sınırsız müşteri telefonu, tam vitrin görünürlüğü ve VIP destek.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">7 Günlük Ücretsiz Deneme, Otomatik Yenileme, İptal ve İade Şartları</h2>
            </div>
            <p>
              Platformumuzda yeni kayıt olan kurumsal nakliyat firmalarına <strong>Profesyonel Paket</strong> için <strong>7 gün (168 saat) boyunca tamamen ücretsiz deneme (0 ₺ Provizyon)</strong> imkanı sağlanır.
            </p>
            <div className="space-y-2 text-slate-600 pl-1">
              <p><strong>• Deneme Süresi Başlangıcı &amp; 0 ₺ Provizyon:</strong> Firma, kredi veya banka kartını Dodo Payments altyapısıyla sisteme tanımladığı ve kart doğrulandığı an 7 günlük (168 saat) ücretsiz deneme süresi başlar. Bu aşamada karttan kesinlikle herhangi bir abonelik ücreti çekilmez (0 ₺ provizyon).</p>
              <p><strong>• İlk Tahsilat Zamanı:</strong> 7 günlük (168 saat) deneme süresi dolduğunda, firma üyeliğini iptal etmediği takdirde seçmiş olduğu periyoda göre (aylık 2.990 ₺ + KDV veya yıllık 29.900 ₺ + KDV) ilk periyot tahsilatı gerçekleştirilir ve e-Arşiv faturası düzenlenir.</p>
              <p><strong>• Deneme Süresinde İptal:</strong> Firma, 7 günlük deneme süresi dolmadan önce nakliyeci panelindeki <em>&quot;Abonelik &amp; Paket Yönetimi&quot;</em> sayfasından tek tıkla denemesini iptal edebilir. İptal edildiğinde karttan kesinlikle hiçbir ücret tahsil edilmez; kalan deneme süresi boyunca Profesyonel paket hakları kullanılabilir ve 7 günün sonunda hesap otomatik olarak Başlangıç paketine aktarılır.</p>
              <p><strong>• Otomatik Yenileme ve İstediğin An İptal:</strong> Ücretli abonelikler, faturalandırma dönemi bitiminde kesintisiz hizmet için otomatik yenilenir. Nakliyeci dilediği an ceza, taahhüt veya cayma bedeli ödemeksizin aboneliğini panelden iptal edebilir. İptal durumunda mevcut fatura dönemi bitene kadar tüm özellikler açık kalır, dönem bitince otomatik yenileme durdurulur.</p>
              <p><strong>• Paket Yükseltme ve Düşürme:</strong> Firmalar diledikleri an panelden paket yükseltebilir veya düşürebilir. Paket yükseltme işlemi anında yürürlüğe girer; paket düşürme ise mevcut ödenmiş dönemin bitiminde aktifleşir.</p>
              <p><strong>• Başarısız Ödemeler, 72 Saatlik Ek Süre (Grace Period) ve Sıfır Mükerrer Çekim:</strong> Yenileme gününde kart limitinin yetersiz olması durumunda sistem asla art arda tekrar tekrar çekim yaparak mükerrer tahsilat veya kullanıcı mağduriyeti yaratmaz. Firmaya 72 saatlik ek süre (Grace Period) tanınır ve panelden bilgi verilir. 72 saat içinde ödeme tamamlanmazsa paket Başlangıç düzeyine sınırlandırılır; habersiz veya fazladan para çekimi kesinlikle yapılmaz.</p>
              <p><strong>• Ücret İadesi:</strong> Dijital platform kullanım ve teklif hakkı ifa edildikten sonra geriye dönük kısmi/tam iade yapılmaz. Ancak teknik aksaklık kaynaklı mükerrer tahsilat söz konusu olursa fazladan çekilen tutar eksiksiz olarak derhal kullanıcının kartına iade edilir.</p>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Nakliyeci Defteri ve Pazar Yeri Kullanım Kuralları</h2>
            </div>
            <p>
              Nakliyeci Defteri, taşımacılar arasındaki boş dönüş, araç paylaşımı ve acil destek dayanışması amacıyla kurulmuştur. Bu alanda:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Meslek ahlakına ve rekabet hukukuna aykırı, karalayıcı ve hakaretamiz ifadeler kullanılamaz,</li>
              <li>Gerçek dışı güzergah veya kapasite bilgisi girilemez,</li>
              <li>Sektör dışı reklam, spam veya yanıltıcı bağlantı paylaşılamaz.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Müşteri Memnuniyeti, Yorumlar ve Puanlama</h2>
            </div>
            <p>
              Taşıma tamamlandıktan sonra müşteriler firma hakkında objektif değerlendirme ve 1-5 arası puanlama yapma hakkına sahiptir. TaşınTeklif, gerçek müşteri deneyimini yansıtan olumlu veya olumsuz yorumlara tarafsızlık ilkesi gereği müdahale etmez. Ancak küfür, hakaret ve ispatlanamayan iftiralar denetim ekibi tarafından incelenerek kaldırılabilir.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Üyeliğin Askıya Alınması ve Fesih</h2>
            </div>
            <p>
              Aşağıdaki hallerde firmanın üyeliği tek taraflı olarak geçici veya kalıcı olarak durdurulur:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>Müşteriye teklif verilen fiyattan farklı olarak taşınma günü haksız fiyat artışı dayatılması,</li>
              <li>Taşıma taahhüdüne mazeretsiz gelinmeyerek müşterinin mağdur edilmesi,</li>
              <li>Yetki belgesinin iptal edilmesi veya sahte evrak kullanımı,</li>
              <li>Platform kurallarına veya yasal mevzuata aykırı hareket edilmesi.</li>
            </ul>
          </section>

          <section id="veri-isleme-taahhudu" className="space-y-3 scroll-mt-24 p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-emerald-950">Müşteri Verileri İçin Veri İşleme Taahhüdü (KVKK)</h2>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              Taşıyıcı firma; TaşınTeklif üzerinden tarafına iletilen veya erişimine açılan müşteri kişisel verilerini (ad, soyad, telefon numarası, ev/ofis adresi, taşınma tarihi, eşya ve lokasyon bilgileri) 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili ikincil mevzuata tam uyumlu olarak işleyeceğini taahhüt eder.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-emerald-900/90 pl-1">
              <li><strong>Münhasır Amaç:</strong> Müşteri verileri yalnızca teklif hazırlama, taşıma operasyonunun planlanması ve nakliye hizmetinin ifası amacıyla kullanılabilir.</li>
              <li><strong>Üçüncü Kişilerle Paylaşım Yasağı:</strong> Müşteri verileri hiçbir surette üçüncü şahıslara, alt yüklenicilere (platform harici), reklam veya pazarlama amaçlı başka kuruluşlara aktarılamaz, satılamaz veya devredilemez.</li>
              <li><strong>İdari ve Teknik Tedbirler:</strong> Firma; verilerin kaybolmasını, yetkisiz kişilerin eline geçmesini ve sızdırılmasını engellemek üzere gerekli tüm güvenlik tedbirlerini almakla yükümlüdür.</li>
              <li><strong>Hizmet Sonu İmha:</strong> Taşıma hizmeti tamamlandıktan ve yasal saklama süreleri dolduktan sonra müşteri kişisel verileri güvenli yöntemlerle silinir veya imha edilir.</li>
            </ul>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <h3 className="font-bold text-[#111E38] text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-[#F95700]" /> İletişim ve Nakliyeci Destek Hattı
              </h3>
              <p>
                Sözleşme koşulları, belge doğrulama veya abonelik işlemleriyle ilgili sorularınız için <strong>bilgi@tasinteklif.com</strong> adresinden kurumsal destek ekibimize 7/24 ulaşabilirsiniz.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
