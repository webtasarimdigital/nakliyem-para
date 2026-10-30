'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Megaphone, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Truck, 
  ArrowUpRight,
  X,
  CheckCircle2,
  MapPin
} from 'lucide-react';

export interface SponsorBanner {
  id: string;
  companyName: string;
  city: string;
  category: 'nakliyeci' | 'asansor' | 'all';
  typeLabel: string;
  phone: string;
  secondaryPhone?: string;
  whatsapp?: string;
  imageSrc: string;
  isCustomImage?: boolean;
  highlightText: string;
  badge?: string;
}

const SPONSOR_BANNERS: SponsorBanner[] = [
  {
    id: 'toros',
    companyName: 'Toros Nakliyat',
    city: 'Adana',
    category: 'nakliyeci',
    typeLabel: 'Evden Eve & Şehirlerarası',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/toros-nakliyat.png',
    isCustomImage: true,
    highlightText: 'Kalitenin Bilinen Adresi · Adana Evden Eve Nakliyat Hizmetleri',
    badge: 'Pro Sponsor'
  },
  {
    id: 'kozcuoglu',
    companyName: 'Kozcuoğlu Evden Eve Nakliyat',
    city: 'İstanbul',
    category: 'nakliyeci',
    typeLabel: 'Google 1. Sıra · Sigortalı Taşıma',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/kozcuoglu-nakliyat.svg',
    highlightText: 'İstanbul İçi & Türkiye Geneli Asansörlü Taşımacılık',
    badge: 'Öne Çıkan'
  },
  {
    id: 'colakoglu',
    companyName: 'Çolakoğlu Nakliyat',
    city: 'Türkiye Geneli',
    category: 'nakliyeci',
    typeLabel: "1956'dan Beri Güvenle",
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/colakoglu-nakliyat.svg',
    highlightText: 'Kurumsal Ev, Villa ve Ofis Taşımacılığı & Depolama',
    badge: 'Kurumsal'
  },
  {
    id: 'egetur',
    companyName: 'Egetur Evden Eve Nakliyat',
    city: 'İzmir - İstanbul',
    category: 'nakliyeci',
    typeLabel: 'Sabit Fiyat Garantisi · K3 Belgeli',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/egetur-nakliyat.svg',
    highlightText: 'İzmir ⇄ İstanbul ⇄ Ankara Günlük Düzenli Seferler',
    badge: 'Pro Sponsor'
  },
  {
    id: 'oztas',
    companyName: 'Öztaş Evden Eve & Mobil Asansör',
    city: 'Balıkesir - Bandırma',
    category: 'asansor',
    typeLabel: '18. Kata Kadar Mobil Asansör Kiralama',
    phone: '',
    whatsapp: '',
    imageSrc: '/banners/oztas-nakliyat.svg',
    highlightText: 'Balıkesir, Bandırma, Gönen & Çevre İller Asansörlü Nakliyat',
    badge: 'Asansör'
  },
  {
    id: 'alkan',
    companyName: 'Alkan Evden Eve Nakliyat',
    city: 'Aydın - Ege',
    category: 'nakliyeci',
    typeLabel: 'Güvenli · Hızlı · Profesyonel',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/alkan-nakliyat.svg',
    highlightText: 'Aydın, Kuşadası, Didim, Nazilli Ege Bölge Nakliyatı',
    badge: 'Öne Çıkan'
  },
  {
    id: 'mersin-evren',
    companyName: 'Mersin Evren Asansörlü Nakliyat',
    city: 'Mersin - Çukurova',
    category: 'asansor',
    typeLabel: '21. Kata Kadar Hidrolik Asansör',
    phone: '',
    secondaryPhone: '',
    whatsapp: '',
    imageSrc: '/banners/mersin-evren-nakliyat.svg',
    highlightText: 'Mersin, Tarsus, Adana & Tüm Çukurova Asansör Kiralama',
    badge: 'Asansör'
  }
];

export function DefterRightRail() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'CARRIER' | 'ELEVATOR'>('ALL');
  const [selectedBanner, setSelectedBanner] = useState<SponsorBanner | null>(null);

  const filteredBanners = SPONSOR_BANNERS.filter((banner) => {
    if (activeTab === 'CARRIER') return banner.category === 'nakliyeci';
    if (activeTab === 'ELEVATOR') return banner.category === 'asansor';
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* ── 1. BURADA YER ALIN / REKLAM CTA KARTI ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111E38] via-[#1a2d52] to-[#111E38] rounded-2xl p-4 border border-slate-700/60 shadow-lg text-white">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#F95700]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F95700] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3" />
              Pro Reklam Alanı
            </span>
            <span className="text-[11px] text-amber-400 font-bold">
              En Yüksek Paket Avantajı
            </span>
          </div>

          <div>
            <h3 className="text-base font-black tracking-tight text-white leading-snug">
              Bu Alanda Firmanız Yer Alsın!
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Her gün binlerce nakliyeci meslektaşınıza ve ev taşıyan müşteriye doğrudan ulaşın. Logolu bannerınızı hemen yayınlayalım.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://wa.me/971585188543?text=Merhaba%2C%20Defter%20sayfas%C4%B1ndaki%20sa%C4%9F%20banner%20reklam%20alan%C4%B1nda%20firmam%C4%B1n%20yer%20almas%C4%B1n%C4%B1%20istiyorum.%20Fiyat%20ve%20detaylar%C4%B1%20%C3%B6%C4%9Frenebilir%20miyim%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#F95700] to-[#FF7020] hover:from-[#E04D00] hover:to-[#F95700] text-white font-black text-xs shadow-md transition-all group"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Hemen Reklam Ver</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <Link
              href="/fiyatlar"
              className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors border border-white/10"
              title="Paketleri İncele"
            >
              Paketler
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. SEKMELER (Nakliyeci / Asansör / Tümü) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-[#111E38] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tümü ({SPONSOR_BANNERS.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('CARRIER')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'CARRIER'
                ? 'bg-[#111E38] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Nakliyeci
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ELEVATOR')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ELEVATOR'
                ? 'bg-[#111E38] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Asansör
          </button>
        </div>
      </div>

      {/* ── 3. BANNER LİSTESİ (Dikey Akış) ── */}
      <div className="space-y-3">
        {filteredBanners.map((banner) => (
          <div
            key={banner.id}
            className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-[#F95700]/50 hover:shadow-md transition-all"
          >
            {/* Banner Görseli */}
            <div 
              onClick={() => setSelectedBanner(banner)}
              className="relative w-full aspect-[2.65/1] bg-slate-900 cursor-pointer overflow-hidden block"
            >
              <Image
                src={banner.imageSrc}
                alt={banner.companyName}
                fill
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                priority={banner.id === 'toros'}
              />
              
              {/* Üst Rozet */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-black text-amber-400 border border-amber-400/40">
                  {banner.badge || 'Pro Sponsor'}
                </span>
              </div>
            </div>

            {/* Banner Alt Bilgi ve Aksiyon Butonları */}
            <div className="p-3 bg-white space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-[#111E38] truncate group-hover:text-[#F95700] transition-colors">
                      {banner.companyName}
                    </h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {banner.city} · {banner.typeLabel}
                  </p>
                </div>
              </div>

              {/* Hızlı Arama & WhatsApp Butonları (Fake/Örnek veri olduğu için numara boş bırakıldı ve tıklama pasife alındı) */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <div
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-200/80 font-bold text-xs select-none cursor-default"
                  title="İletişim numarası aktif değil"
                >
                  <Phone className="w-3 h-3 text-slate-300" />
                  <span>{banner.phone || ''}</span>
                </div>

                <div
                  className="p-1.5 rounded-xl bg-slate-50 text-slate-300 border border-slate-200/80 shrink-0 cursor-not-allowed select-none"
                  title="Mesajlaşma aktif değil"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBanner(banner)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shrink-0 cursor-pointer"
                  title="Firma Detayları"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4. ALT BİLGİLENDİRME ROZETİ ── */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-center space-y-1">
        <p className="text-[11px] text-slate-600 font-semibold">
          ⭐ Pro Paket veya Reklam Sponsorluğu
        </p>
        <p className="text-[10px] text-slate-400">
          Defter sağ vitrin alanında yer almak için Dubai Merkez hattımızla iletişime geçebilirsiniz.
        </p>
        <a
          href="https://wa.me/971585188543?text=Merhaba%2C%20Defter%20sa%C4%9F%20banner%20alan%C4%B1%20i%C3%A7in%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[11px] text-[#F95700] hover:underline font-bold mt-1"
        >
          +971 58 518 8543 WhatsApp &rarr;
        </a>
      </div>

      {/* ── 5. FİRMA İLETİŞİM / DETAY MODALI ── */}
      {selectedBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scale-up my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto">
            {/* Modal Banner Görseli */}
            <div className="relative w-full aspect-[2.65/1] bg-slate-900">
              <Image
                src={selectedBanner.imageSrc}
                alt={selectedBanner.companyName}
                fill
                className="object-cover object-center"
              />
              <button
                type="button"
                onClick={() => setSelectedBanner(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal İçerik */}
            <div className="p-4 sm:p-5 space-y-3.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base sm:text-lg font-black text-[#111E38] truncate">
                    {selectedBanner.companyName}
                  </h3>
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedBanner.city} · {selectedBanner.typeLabel}
                </p>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  {selectedBanner.highlightText}
                </p>
              </div>

              {/* Telefonlar & İletişim (Fake sponsorlar için pasif) */}
              <div className="space-y-2">
                {selectedBanner.phone ? (
                  <a
                    href={`tel:${selectedBanner.phone.replace(/\s+/g, '')}`}
                    className="flex flex-wrap items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#C23E00] font-black text-xs sm:text-sm transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="w-4 h-4 text-[#F95700] shrink-0" />
                      <span className="truncate">Hemen Ara: {selectedBanner.phone}</span>
                    </div>
                    <span className="text-xs font-bold bg-[#F95700] text-white px-2.5 py-1 rounded-lg shrink-0">
                      Ara
                    </span>
                  </a>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center space-y-1.5">
                    <p className="text-xs font-bold text-slate-700">
                      Bu firma alanı örnek reklam / sponsorluk tanıtımıdır.
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Doğrudan arama ve WhatsApp mesajlaşma henüz aktif edilmemiştir.
                    </p>
                    <a
                      href="https://wa.me/971585188543?text=Merhaba%2C%20Defter%20sa%C4%9F%20banner%20alan%C4%B1nda%20reklam%20vermek%20istiyorum."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#e04e00] text-white font-bold text-xs transition-colors mt-1"
                    >
                      <Megaphone className="w-3.5 h-3.5" />
                      Reklam Vermek İstiyorum
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setSelectedBanner(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
