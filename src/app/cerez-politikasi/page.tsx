import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Cookie, ShieldCheck, ArrowLeft, Settings, Info, CheckCircle2 } from 'lucide-react';
import { CookieSettingsTrigger } from '@/components/ui/CookieSettingsTrigger';

export const metadata: Metadata = {
  title: 'Çerez (Cookie) Politikası',
  description: 'TaşınTeklif çerez kullanım ilkeleri, zorunlu ve işlevsel çerezler, çerezlerin nasıl yönetileceği ve tarayıcı ayarları rehberi.',
  keywords: ['çerez politikası', 'cookie politikası', 'taşınteklif çerez tercihleri', 'gizlilik ve çerezler'],
  alternates: {
    canonical: '/cerez-politikasi',
  },
};

export default function CerezPolitikasiPage() {
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
            <Cookie className="w-4 h-4" />
            <span>Şeffaf Çerez Yönetimi</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111E38] tracking-tight mb-3">
            Çerez (Cookie) Politikası
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Son Güncelleme: 1 Eylül 2026 • Bilgilendirme Metni
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            Taşın Teklif olarak internet sitemizi ziyaret eden kullanıcılarımızın deneyimini zenginleştirmek, sayfa hızını optimize etmek ve oturum güvenliğini sağlamak amacıyla çerezler (cookies) kullanmaktayız. İşbu metin hangi çerezleri ne amaçla kullandığımızı açıklar.
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-10 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Çerez (Cookie) Nedir?</h2>
            </div>
            <p>
              Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler web sitesinin düzgün çalışmasını, form adımlarınızın kaybolmamasını ve oturumunuzun güvenle devam etmesini sağlar. Çerezler kişisel bilgisayarınızdaki dosyalara erişemez ve virüs içermez.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Sitemizde Kullanılan Çerezler, Sağlayıcıları ve Saklama Süreleri</h2>
            </div>
            <p>
              Platformumuzda kullanılan çerezlerin kategorisi, sağlayıcısı, kullanım amacı ve tarayıcınızda tutulma süreleri aşağıdaki tabloda detaylandırılmıştır:
            </p>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3">Çerez Adı</th>
                    <th className="p-3">Sağlayıcı</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Saklama Süresi</th>
                    <th className="p-3">Kullanım Amacı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">tt_session</td>
                    <td className="p-3">Taşın Teklif</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Zorunlu</span></td>
                    <td className="p-3">Oturum Süresince</td>
                    <td className="p-3">Kullanıcı oturumunun güvenli bir şekilde sürdürülmesi ve sayfa geçişlerinde durumun korunması.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">tt_auth_token</td>
                    <td className="p-3">Taşın Teklif</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Zorunlu</span></td>
                    <td className="p-3">30 Gün</td>
                    <td className="p-3">Giriş yapan müşteri veya nakliyat firmasının kimlik doğrulamasının güvenle hatırlanması.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">tt_cookie_consent_v1</td>
                    <td className="p-3">Taşın Teklif</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Zorunlu</span></td>
                    <td className="p-3">1 Yıl</td>
                    <td className="p-3">Kullanıcının KVKK kapsamındaki çerez izin ve onay tercihlerinin kaydedilmesi.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">dodo_checkout_*</td>
                    <td className="p-3">Dodo Payments</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Zorunlu</span></td>
                    <td className="p-3">Oturum Süresince</td>
                    <td className="p-3">Abonelik ve 0 ₺ provizyon işlemlerinde PCI-DSS güvenlik standartlarının ve dolandırıcılık önleme kontrollerinin sağlanması.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">_ga, _ga_*</td>
                    <td className="p-3">Google Analytics</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Analitik</span></td>
                    <td className="p-3">2 Yıl</td>
                    <td className="p-3">Ziyaretçilerin siteyi nasıl kullandığını, sayfa yükleme hızlarını anonim olarak ölçümleme (Kullanıcı onayı ile çalışır).</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">_gid</td>
                    <td className="p-3">Google Analytics</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">Analitik</span></td>
                    <td className="p-3">24 Saat</td>
                    <td className="p-3">Kullanıcı etkileşimlerini gün bazında anonim olarak gruplama.</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#111E38]">_fbp</td>
                    <td className="p-3">Meta (Facebook)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">Pazarlama</span></td>
                    <td className="p-3">3 Ay</td>
                    <td className="p-3">İlgi alanlarına uygun nakliye kampanyalarının sunulması (Kullanıcı onayı ile çalışır).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Çerez Tercihleri ve Açık Rızanın Yönetilmesi</h2>
            </div>
            <p>
              Taşın Teklif üzerinde zorunlu teknik çerezler haricindeki analitik ve pazarlama çerezleri yalnızca sizin <strong>açık rızanız</strong> ile işleme alınır. Tercihlerinizi dilediğiniz an tek tıkla değiştirebilir, onay verebilir veya önceden verdiğiniz onayı geri çekebilirsiniz.
            </p>
            
            <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#111E38] text-sm">Çerez İzinlerinizi Yönetin</h3>
                <p className="text-xs text-slate-600">
                  Analitik ve pazarlama çerez izinlerinizi anında güncelleyin.
                </p>
              </div>
              <CookieSettingsTrigger />
            </div>

            <p className="text-xs text-slate-600">
              Ayrıca dilediğiniz zaman internet tarayıcınızın ayarlarından da çerez kullanımını kısıtlayabilir veya silebilirsiniz:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1 text-xs">
              <li><strong>Google Chrome:</strong> Ayarlar &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Diğer Site Verileri</li>
              <li><strong>Apple Safari:</strong> Tercihler &gt; Gizlilik &gt; Tüm Çerezleri Engelle</li>
              <li><strong>Mozilla Firefox:</strong> Seçenekler &gt; Gizlilik ve Güvenlik &gt; Çerezler ve Site Verileri</li>
              <li><strong>Microsoft Edge:</strong> Ayarlar &gt; Çerezler ve Site İzinleri &gt; Çerezleri Yönet</li>
            </ul>
            <p className="text-xs text-slate-500 italic">
              * Not: Zorunlu teknik çerezlerin tarayıcıdan tamamen engellenmesi durumunda teklif formu adımları veya kullanıcı giriş paneli beklenen şekilde çalışmayabilir.
            </p>
          </section>

          <section className="pt-4 border-t border-slate-200">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-2">
              <h3 className="font-bold text-[#111E38] text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-[#F95700]" /> Çerez Politikası İletişim
              </h3>
              <p>
                Çerez kullanımımızla ilgili her türlü görüş ve sorunuz için <strong>bilgi@tasinteklif.com</strong> adresi üzerinden bize ulaşabilirsiniz.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
