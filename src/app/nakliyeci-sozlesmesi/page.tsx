import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Truck, ShieldCheck, CheckCircle2, ArrowLeft, Zap, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nakliyeci Üyelik ve Hizmet Sözleşmesi | TaşınTeklif',
  description: 'TaşınTeklif nakliyat firması katılım şartları, K3 belge doğrulama protokolü, abonelik planları, komisyonsuz çalışma esasları ve hizmet sözleşmesi.',
  keywords: ['nakliyeci sözleşmesi', 'nakliyat üyelik şartları', 'k3 yetki belgesi doğrulama', 'komisyonsuz nakliye pazaryeri']
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
              <h2 className="text-lg sm:text-xl font-bold">Komisyonsuz Model ve Şeffaf Fiyatlandırma</h2>
            </div>
            <p>
              TaşınTeklif, geleneksel komisyoncu mantığıyla çalışmaz. Nakliyeciden aldığı iş başına %15-20 gibi yüksek komisyonlar <strong>kesilmez</strong>. Nakliyeci, sabit aylık/yıllık paket üyeliği ile sisteme dahil olur ve müşteriye verdiği fiyatın %100&apos;ünü doğrudan kendisi tahsil eder.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">7 Günlük Ücretsiz Deneme ve İptal Hakkı</h2>
            </div>
            <p>
              Gold paketini seçen yeni nakliyecilerimize <strong>7 gün boyunca tamamen ücretsiz ve sınırsız deneme</strong> imkanı sağlanır. Bu süre zarfında nakliyeci platformu test edebilir, müşteri taleplerine teklif verebilir ve Nakliyeci Defteri&apos;ni kullanabilir.
            </p>
            <p>
              Deneme süresi sona ermeden önce iptal talebinde bulunulursa hiçbir ücret tahsil edilmez. Üyeliğini devam ettiren firmalar, seçtikleri faturalandırma periyodu (aylık veya 2 ay bedava avantajlı yıllık) üzerinden güvenli kart çekimiyle yenilenir. Firmalar diledikleri an panelden aboneliklerini tek tıkla durdurabilir.
            </p>
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
