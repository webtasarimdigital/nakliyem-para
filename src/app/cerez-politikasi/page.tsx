import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Cookie, ShieldCheck, ArrowLeft, Settings, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Çerez (Cookie) Politikası | TaşınTeklif',
  description: 'TaşınTeklif çerez kullanım ilkeleri, zorunlu ve işlevsel çerezler, çerezlerin nasıl yönetileceği ve tarayıcı ayarları rehberi.',
  keywords: ['çerez politikası', 'cookie politikası', 'taşınteklif çerez tercihleri', 'gizlilik ve çerezler']
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
            TaşınTeklif olarak internet sitemizi ziyaret eden kullanıcılarımızın deneyimini zenginleştirmek, sayfa hızını optimize etmek ve oturum güvenliğini sağlamak amacıyla çerezler (cookies) kullanmaktayız. İşbu metin hangi çerezleri ne amaçla kullandığımızı açıklar.
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
              <h2 className="text-lg sm:text-xl font-bold">Sitemizde Kullanılan Çerez Türleri</h2>
            </div>
            <p>Platformumuzda yalnızca hizmetin gerektirdiği temel amaçlarla çerezler kullanılır:</p>
            
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-[#111E38] text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Zorunlu ve Teknik Çerezler
                </h3>
                <p className="text-xs text-slate-600">
                  Web sitesinin temel işlevlerini yerine getirebilmesi için şarttır. Teklif oluşturma adımlarında seçtiğiniz oda sayısının, il-ilçe tercihlerinizin ve giriş oturumunuzun korunmasını sağlar. Bu çerezler kapatılamaz.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-[#111E38] text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F95700]" /> İşlevsel Çerezler
                </h3>
                <p className="text-xs text-slate-600">
                  Kullanıcı tercihlerini (örneğin seçilen şehir filtreleri, nakliyeci defteri sekme tercihleri veya tema ayarları) hatırlayarak bir sonraki ziyaretinizde size özel pratik bir deneyim sunar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-[#111E38] text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Performans ve Analitik Çerezleri
                </h3>
                <p className="text-xs text-slate-600">
                  Hangi sayfaların daha çok ziyaret edildiğini, formlardaki hata oranlarını ve genel site performansını anonim istatistiki verilerle ölçümlememize yarar. Bu veriler kimliğinizle eşleştirilmez.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#111E38]">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Çerez Tercihleri Nasıl Yönetilir?</h2>
            </div>
            <p>
              Dilediğiniz zaman internet tarayıcınızın ayarlarından çerez kullanımını kısıtlayabilir, engelleyebilir veya mevcut çerezleri silebilirsiniz:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-1">
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
