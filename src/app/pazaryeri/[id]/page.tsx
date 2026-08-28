'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2,
  Phone,
  MessageSquare,
  Heart,
  Share2,
  ShieldCheck,
  Star,
  Eye,
  Flag,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Same listing data (in real app this would come from a shared store/API)
const SAMPLE_LISTINGS = [
  {
    id: 'v1',
    category: 'KAMYON',
    title: '2005 Mercedes 2523',
    price: 1790000,
    priceLabel: '1.790.000 TL',
    isNegotiable: true,
    condition: 'IKINCI_EL',
    year: 2005,
    km: 615000,
    transmission: 'Manuel',
    fuel: 'Dizel',
    brand: 'Mercedes',
    model: '2523',
    city: 'Samsun',
    district: 'Samsun',
    sellerName: 'Çöpoğlu Nakliyat',
    sellerJoinYear: '2020',
    sellerPhone: '0505 000 00 01',
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=1200&auto=format&fit=crop',
    ],
    description: 'Muayene yıl sonuna kadar var\n760 uzunluk kayarperde kayarçatı\nkasa sıfır 2 aylık\n\nAraç bakımları yapılmış olup sorunsuz çalışmaktadır. Ciddi alıcılar arayabilir.',
    specs: [
      { label: 'YIL', value: '2005' },
      { label: 'KM', value: '615.000 km' },
      { label: 'VİTES', value: 'Manuel' },
      { label: 'YAKIT', value: 'Dizel' },
    ],
    createdAt: 'Ağustos 2020',
    viewCount: 1243
  },
  {
    id: 'v2',
    category: 'KAMYONET',
    title: '2021 Ford Transit Kapalı Kasa',
    price: 1250000,
    priceLabel: '1.250.000 TL',
    isNegotiable: false,
    condition: 'IKINCI_EL',
    year: 2021,
    km: 87000,
    transmission: 'Manuel',
    fuel: 'Dizel',
    brand: 'Ford',
    model: 'Transit',
    city: 'İstanbul',
    district: 'Pendik',
    sellerName: 'Marmara Lojistik',
    sellerJoinYear: '2021',
    sellerPhone: '0505 000 00 02',
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200',
    ],
    description: '2021 model Ford Transit, kapalı kasa, hasar kayıtsız, tam bakımlı. Hemen teslim.',
    specs: [
      { label: 'YIL', value: '2021' },
      { label: 'KM', value: '87.000 km' },
      { label: 'VİTES', value: 'Manuel' },
      { label: 'YAKIT', value: 'Dizel' },
    ],
    createdAt: 'Temmuz 2024',
    viewCount: 521
  },
  {
    id: 'v3',
    category: 'ASANSOR',
    title: '18. Kat Hidrolik Araç Üstü Mobil Asansör',
    price: 0,
    priceLabel: 'Fiyat Sorunuz',
    isNegotiable: true,
    condition: 'IKINCI_EL',
    year: undefined,
    km: undefined,
    transmission: undefined,
    fuel: undefined,
    brand: undefined,
    model: undefined,
    city: 'İstanbul',
    district: 'Kadıköy',
    sellerName: 'Boğaziçi Nakliyat',
    sellerJoinYear: '2019',
    sellerPhone: '0532 890 12 34',
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200',
    ],
    description: 'Operatörlü, 18. Kata kadar, 400 kg taşıma kapasitesi, Anadolu Yakası hızlı servis.',
    specs: [
      { label: 'TİP', value: 'Araç Üstü Hidrolik' },
      { label: 'KAT', value: '18. Kata Kadar' },
      { label: 'KAPASİTE', value: '400 kg' },
      { label: 'OPERATÖR', value: 'Dahil' },
    ],
    createdAt: 'Haziran 2024',
    viewCount: 892
  },
];

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = SAMPLE_LISTINGS.find(l => l.id === id) || SAMPLE_LISTINGS[0];
  
  const [activePhoto, setActivePhoto] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [messageText, setMessageText] = useState('Bu ilan hakkında bilgi alabilir miyim?');
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const handlePrevPhoto = () => {
    setActivePhoto(prev => prev === 0 ? listing.photos.length - 1 : prev - 1);
  };

  const handleNextPhoto = () => {
    setActivePhoto(prev => prev === listing.photos.length - 1 ? 0 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-6">
          <Link href="/" className="hover:text-[#F95700]">Ana Sayfa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/pazaryeri" className="hover:text-[#F95700]">Pazaryeri</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Photos & Description (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Main Photo */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="relative aspect-video bg-slate-900">
                {listing.photos.length > 0 ? (
                  <img
                    src={listing.photos[activePhoto]}
                    alt={listing.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => setShowFullGallery(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <div className="text-center">
                      <Settings2 className="w-16 h-16 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-medium opacity-60">Fotoğraf yok</p>
                    </div>
                  </div>
                )}

                {/* Photo Navigation */}
                {listing.photos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-black">
                      {listing.photos.length} fotoğraf
                    </div>
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                      {listing.photos.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActivePhoto(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${i === activePhoto ? 'bg-white w-4' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {listing.photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {listing.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePhoto(i)}
                      className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        i === activePhoto ? 'border-[#F95700]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing Title & Price */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      listing.condition === 'SIFIR' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {listing.condition === 'SIFIR' ? 'Sıfır' : 'İkinci El'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                      Yayında
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
                    {listing.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-[#F95700] transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-3xl sm:text-4xl font-black text-[#F95700] mb-1">
                {listing.priceLabel}
              </div>
              {listing.isNegotiable && (
                <p className="text-sm text-slate-500 font-medium">Pazarlık payı mevcuttur</p>
              )}

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="font-bold text-slate-700">{listing.city}, {listing.district}</span>
                <span>•</span>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.viewCount} görüntülenme</span>
              </div>
            </div>

            {/* Technical Specs Card */}
            {listing.specs && listing.specs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <h2 className="font-black text-[#0A1128] text-lg mb-4 pb-3 border-b border-slate-100">
                  Araç Bilgileri
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {listing.specs.map((spec, i) => (
                    <div key={i} className="space-y-1">
                      <span className="block text-[11px] text-slate-400 font-black uppercase tracking-wider">
                        {spec.label}
                      </span>
                      <span className="block text-base font-black text-slate-900">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <h2 className="font-black text-[#0A1128] text-lg mb-4 pb-3 border-b border-slate-100">
                İlan Açıklaması
              </h2>
              <div className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {listing.description}
              </div>
            </div>

            {/* Report */}
            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">
              <Flag className="w-3.5 h-3.5" />
              <span>Bu ilanı şikayet et</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Contact Card & Seller (1/3) */}
          <div className="space-y-4">
            
            {/* Seller Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F95700] to-[#E04D00] text-white flex items-center justify-center font-black text-lg">
                  {listing.sellerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[#0A1128] text-sm leading-tight">
                      {listing.sellerName}
                    </h3>
                    {listing.isVerified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {listing.sellerJoinYear}&apos;dan beri üye
                  </p>
                </div>
              </div>

              {/* Primary CTA: Show Phone */}
              <div className="space-y-3">
                {showPhone ? (
                  <a href={`tel:${listing.sellerPhone}`} className="block w-full">
                    <Button variant="navy" size="lg" className="w-full font-black text-base shadow-md" leftIcon={<Phone className="w-5 h-5" />}>
                      {listing.sellerPhone}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="navy"
                    size="lg"
                    className="w-full font-black text-base shadow-md"
                    leftIcon={<Phone className="w-5 h-5" />}
                    onClick={() => setShowPhone(true)}
                  >
                    Numarayı Göster
                  </Button>
                )}

                {/* Inline Message */}
                {messageSent ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 text-center">
                    ✓ Mesajınız gönderildi, satıcı en kısa sürede yanıtlayacak.
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#F95700] text-xs sm:text-sm font-medium bg-white text-slate-900"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="font-black shrink-0 px-4"
                      onClick={() => setMessageSent(true)}
                    >
                      Gönder
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 font-medium leading-relaxed">
              <strong className="block font-black mb-1">⚠️ Güvenli Alışveriş İpuçları</strong>
              Aracı satın almadan önce mutlaka yerinde görerek teknik inceleme yaptırın. Peşin ödeme yapmadan önce araç sahipliğini ve muayenesini kontrol edin.
            </div>

            {/* Price Alert */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-center">
              <p className="text-xs text-slate-500 font-medium mb-2">Bu fiyat için bir sonraki ilanı takip edin</p>
              <Button variant="outline" size="sm" className="w-full font-bold text-xs">
                Fiyat Düşünce Haber Ver
              </Button>
            </div>

            {/* Similar Listings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
              <h3 className="font-black text-sm text-[#0A1128] mb-3">Benzer İlanlar</h3>
              <div className="space-y-3">
                {SAMPLE_LISTINGS.filter(l => l.id !== listing.id && l.category === listing.category).slice(0, 2).map(l => (
                  <Link key={l.id} href={`/pazaryeri/${l.id}`} className="flex gap-3 group">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {l.photos[0] ? (
                        <img src={l.photos[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate group-hover:text-[#F95700] transition-colors">
                        {l.title}
                      </p>
                      <p className="text-xs font-black text-[#F95700]">{l.priceLabel}</p>
                      <p className="text-[11px] text-slate-400">{l.city}</p>
                    </div>
                  </Link>
                ))}
                {SAMPLE_LISTINGS.filter(l => l.id !== listing.id && l.category === listing.category).length === 0 && (
                  <Link href="/pazaryeri" className="text-xs text-[#F95700] font-bold hover:underline">
                    Tüm ilanları gör →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal */}
      {showFullGallery && listing.photos.length > 0 && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowFullGallery(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          <img
            src={listing.photos[activePhoto]}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={handleNextPhoto}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-bold">
            {activePhoto + 1} / {listing.photos.length}
          </div>
        </div>
      )}
    </div>
  );
}
