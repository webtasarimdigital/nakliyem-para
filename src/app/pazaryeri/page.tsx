'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Filter, 
  Search, 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  Camera,
  Heart,
  Share2,
  ChevronRight,
  Truck,
  ShoppingBag,
  Package,
  Wrench,
  Star,
  ShieldCheck,
  ArrowUpDown,
  AlertCircle
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';
import { Button } from '@/components/ui/Button';

export interface VehicleListing {
  id: string;
  category: 'KAMYON' | 'KAMYONET' | 'CEKICI' | 'DORSE' | 'ASANSOR' | 'EKIPMAN' | 'MALZEME';
  title: string;
  price: number;
  priceLabel: string;
  isNegotiable: boolean;
  condition: 'SIFIR' | 'IKINCI_EL';
  year?: number;
  km?: number;
  transmission?: 'Manuel' | 'Otomatik' | 'Yarı Otomatik';
  fuel?: 'Dizel' | 'Benzin' | 'LPG' | 'Elektrik';
  brand?: string;
  model?: string;
  city: string;
  district: string;
  sellerName: string;
  sellerJoinYear: string;
  sellerPhone: string;
  isVerified: boolean;
  photos: string[];
  description: string;
  specs?: { label: string; value: string }[];
  createdAt: string;
  viewCount: number;
}

// Örnek ilanlar - mock data
const SAMPLE_LISTINGS: VehicleListing[] = [
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
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
    ],
    description: 'Muayene yıl sonuna kadar var\n760 uzunluk kayarperde kayarçatı\nkasa sıfır 2 aylık',
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
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800',
    ],
    description: '2021 model Ford Transit, kapalı kasa, hasar kayıtsız, tam bakımlı.',
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
    priceLabel: 'Fiyat Sorununuz',
    isNegotiable: true,
    condition: 'IKINCI_EL',
    city: 'İstanbul',
    district: 'Kadıköy',
    sellerName: 'Boğaziçi Nakliyat',
    sellerJoinYear: '2019',
    sellerPhone: '0532 890 12 34',
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
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
  {
    id: 'v4',
    category: 'CEKICI',
    title: '2018 Volvo FH 500 Çekici',
    price: 2850000,
    priceLabel: '2.850.000 TL',
    isNegotiable: true,
    condition: 'IKINCI_EL',
    year: 2018,
    km: 432000,
    transmission: 'Otomatik',
    fuel: 'Dizel',
    brand: 'Volvo',
    model: 'FH 500',
    city: 'Ankara',
    district: 'Yenimahalle',
    sellerName: 'Başkent Ekspres Lojistik',
    sellerJoinYear: '2018',
    sellerPhone: '0533 456 78 90',
    isVerified: true,
    photos: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800',
    ],
    description: '2018 model Volvo FH 500 Çekici, otomatik vites, tam bakımlı, hasar kayıtsız.',
    specs: [
      { label: 'YIL', value: '2018' },
      { label: 'KM', value: '432.000 km' },
      { label: 'VİTES', value: 'Otomatik' },
      { label: 'YAKIT', value: 'Dizel' },
    ],
    createdAt: 'Mayıs 2024',
    viewCount: 1087
  },
  {
    id: 'v5',
    category: 'MALZEME',
    title: 'Çift Kat Balonlu Patpat Naylon 100m Rulo',
    price: 1250,
    priceLabel: '1.250 TL / Rulo',
    isNegotiable: false,
    condition: 'SIFIR',
    city: 'İzmir',
    district: 'Bornova',
    sellerName: 'Ege Güven Tedarik',
    sellerJoinYear: '2022',
    sellerPhone: '0535 678 90 12',
    isVerified: false,
    photos: [],
    description: '1. kalite çift kat balonlu patpat naylon, mobilya koruma için ideal. Toplu alımda indirim.',
    specs: [
      { label: 'UZUNLUK', value: '100 Metre' },
      { label: 'TİP', value: 'Çift Kat Balonlu' },
      { label: 'RENK', value: 'Şeffaf' },
      { label: 'STOK', value: 'Mevcut' },
    ],
    createdAt: 'Ağustos 2024',
    viewCount: 234
  },
];

const CATEGORIES = [
  { id: 'ALL', label: 'Tüm İlanlar', icon: ShoppingBag },
  { id: 'KAMYON', label: 'Kamyon', icon: Truck },
  { id: 'KAMYONET', label: 'Kamyonet', icon: Truck },
  { id: 'CEKICI', label: 'Çekici & TIR', icon: Truck },
  { id: 'DORSE', label: 'Dorse & Yarı Römork', icon: Truck },
  { id: 'ASANSOR', label: 'Mobil Asansör', icon: Settings2 },
  { id: 'EKIPMAN', label: 'Taşıma Ekipmanı', icon: Wrench },
  { id: 'MALZEME', label: 'Ambalaj Malzeme', icon: Package },
];

export default function PazaryeriPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    const handleAuth = () => setCurrentUser(db.getCurrentUser());
    window.addEventListener('auth-changed', handleAuth);
    window.addEventListener('storage', handleAuth);
    return () => {
      window.removeEventListener('auth-changed', handleAuth);
      window.removeEventListener('storage', handleAuth);
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const allListings = [...db.getMarketplaceListings(), ...SAMPLE_LISTINGS];

  const filteredListings = allListings.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
    return 0; // 'newest'
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#C23E00] text-xs font-bold mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-[#F95700]" />
                <span>Nakliyat Ticaret Merkezi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#0A1128]">
                Nakliyat Pazaryeri
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                {filteredListings.length} aktif ilan • Kamyon, Asansör, Ekipman ve Ambalaj
              </p>
            </div>

            <Link href="/pazaryeri/ilan-ver">
              <Button 
                variant="primary" 
                size="lg" 
                className="font-black shadow-lg shadow-orange-900/15"
                leftIcon={<Plus className="w-5 h-5" />}
              >
                Ücretsiz İlan Ver
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Araç markası, model, şehir ara..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-[#F95700] focus:ring-0 text-sm sm:text-base font-medium bg-white text-[#0A1128] shadow-xs"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          
          {/* LEFT SIDEBAR: Category Filter */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs sticky top-28">
              <h3 className="font-black text-sm text-[#0A1128] uppercase tracking-wider mb-3">Kategoriler</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const count = cat.id === 'ALL' 
                    ? SAMPLE_LISTINGS.length 
                    : SAMPLE_LISTINGS.filter(l => l.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#F95700] text-white shadow-sm'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{cat.label}</span>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
                        selectedCategory === cat.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Listings Grid */}
          <div className="flex-1 min-w-0">
            
            {/* Mobile Category Scroll */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#F95700] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Ban Warning Banner (Only visible to logged-in members) */}
            {currentUser && (
              <div className="mb-4 p-3.5 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>⚠️ Uyarı: Konu dışı veya yanıltıcı paylaşım yapmak süresiz ban sebebidir.</span>
              </div>
            )}

            {/* Sort & Count Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">
                <strong className="text-[#0A1128]">{sortedListings.length}</strong> ilan listeleniyor
              </span>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm font-bold text-slate-700 border border-slate-200 rounded-xl px-3 py-2 bg-white cursor-pointer"
                >
                  <option value="newest">En Yeni İlanlar</option>
                  <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="views">En Çok Görüntülenen</option>
                </select>
              </div>
            </div>

            {/* Listings */}
            <div className="space-y-4">
              {sortedListings.map((listing) => (
                <Link key={listing.id} href={`/pazaryeri/${listing.id}`} className="block group">
                  <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-[#F95700] hover:shadow-lg transition-all overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      
                      {/* Photo */}
                      <div className="w-full sm:w-64 h-48 sm:h-auto bg-slate-100 shrink-0 relative overflow-hidden">
                        {listing.photos.length > 0 ? (
                          <img
                            src={listing.photos[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-12 h-12 text-slate-300" />
                          </div>
                        )}
                        {listing.photos.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-[#0A1128]/60 text-white text-xs font-bold">
                            {listing.photos.length} fotoğraf
                          </div>
                        )}
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                            listing.condition === 'SIFIR' 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-700 text-white'
                          }`}>
                            {listing.condition === 'SIFIR' ? 'Sıfır' : '2. El'}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h2 className="text-lg sm:text-xl font-black text-[#0A1128] group-hover:text-[#F95700] transition-colors leading-snug">
                              {listing.title}
                            </h2>
                            <button 
                              onClick={(e) => e.preventDefault()}
                              className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="text-2xl sm:text-3xl font-black text-[#F95700] mb-3">
                            {listing.priceLabel}
                            {listing.isNegotiable && (
                              <span className="text-xs sm:text-sm font-bold text-slate-400 ml-2">
                                (Pazarlık Payı Var)
                              </span>
                            )}
                          </div>

                          {/* Specs Grid */}
                          {listing.specs && listing.specs.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                              {listing.specs.map((spec: any, i: number) => (
                                <div key={i} className="text-xs">
                                  <span className="block text-slate-400 font-black uppercase tracking-wider text-[10px] mb-0.5">
                                    {spec.label}
                                  </span>
                                  <span className="font-bold text-[#0A1128]">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                            {listing.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{listing.city}, {listing.district}</span>
                            </div>
                            {listing.isVerified && (
                              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Onaylı Firma</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 font-medium">
                              {listing.viewCount} görüntülenme
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#F95700] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-[#0A1128] text-lg mb-1">Sonuç bulunamadı</h3>
                <p className="text-sm text-slate-500">Farklı bir kategori veya arama terimi deneyin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
