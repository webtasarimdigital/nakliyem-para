'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Truck, 
  Package, 
  Plus, 
  MapPin, 
  MoveRight, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Users,
  TrendingUp,
  Search,
  X,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { db } from '@/lib/data/mock-db';
import { DefterPost, DefterPostCategory } from '@/types';

// Helper: Canlı göreceli zaman formatı
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Az önce';
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    if (isNaN(diffMs)) return 'Az önce';
    const diffMin = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  } catch {
    return 'Az önce';
  }
}

// Firma adından 2 harfli avatar baş harfi oluşturma
function getInitials(name: string): string {
  if (!name) return 'NK';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function NakliyeciDefteriPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
    const handleAuthChange = () => {
      setCurrentUser(db.getCurrentUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const [posts, setPosts] = useState<DefterPost[]>(() => db.getDefterPosts());

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  // Inline Composer State
  const [inlineContent, setInlineContent] = useState('');
  const [inlineError, setInlineError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Auth gate modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    title: string;
    subtitle: string;
    targetRole: 'CUSTOMER' | 'CARRIER';
  }>({
    title: 'Defter\'de Paylaşım Yapmak İçin Giriş Yapın',
    subtitle: 'Boş araç ve dönüş yükü ilanı paylaşabilmek için lütfen nakliyeci hesabınıza giriş yapın.',
    targetRole: 'CARRIER'
  });

  // "Yayınla" tıklandığında kontrol
  const handlePublishClick = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError('');

    const user = db.getCurrentUser();

    // 1. Giriş yapmamış kullanıcı -> Üyelik Girişi Modalını Aç
    if (!user) {
      setAuthModalConfig({
        title: 'İlan Paylaşmak İçin Giriş Yapın',
        subtitle: 'Defter\'de boş araç ve yük duyurusu yapabilmek için lütfen nakliyeci hesabınıza giriş yapın veya ücretsiz üye olun.',
        targetRole: 'CARRIER'
      });
      setAuthModalOpen(true);
      return;
    }

    // 2. Müşteri rolünde giriş yapılmışsa
    if (user.role !== 'CARRIER') {
      setInlineError('Defter paylaşımları nakliyat firmalarına özeldir. Lütfen nakliyeci hesabınızla giriş yapın.');
      return;
    }

    // 3. Karakter sayısı kontrolü (en az 25 karakter)
    if (inlineContent.trim().length < 25) {
      setInlineError('Lütfen ilanınız hakkında en az 25 karakter detaylı bilgi yazınız.');
      return;
    }

    // 4. İlanı yayınla
    const carrierObj = db.getCarriers().find(c => c.userId === user.id || c.id === user.carrierProfileId) || db.getCarriers()[0];
    const newPost: DefterPost = {
      id: `def_${Date.now()}`,
      carrierId: carrierObj.id,
      carrier: {
        ...carrierObj,
        companyName: user.companyName || carrierObj.companyName,
        phone: user.phone || carrierObj.phone
      },
      category: 'EMPTY_VEHICLE',
      originCity: user.city || 'İstanbul',
      originDistrict: 'Merkez',
      destinationCity: 'Tüm Türkiye',
      destinationDistrict: 'Tümü',
      date: 'Bugün',
      vehicleType: 'Kapalı Kasa Nakliye Aracı',
      capacityPercent: 100,
      acceptsWaypoints: true,
      content: inlineContent.trim(),
      allowPhone: true,
      allowMessage: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString()
    };

    db.addDefterPost(newPost);
    setPosts([newPost, ...db.getDefterPosts()]);
    setInlineContent('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 5000);
  };

  // Numarayı Göster veya Mesaj butonuna tıklandığında
  const handleActionWithAuth = (id: string, actionType: 'PHONE' | 'MESSAGE') => {
    if (!currentUser) {
      setAuthModalConfig({
        title: actionType === 'PHONE' ? 'Numarayı Görmek İçin Giriş Yapın' : 'Mesaj Göndermek İçin Giriş Yapın',
        subtitle: 'İlan sahibi nakliyeci ile doğrudan görüşmek ve iletişim kurmak için lütfen hesabınıza giriş yapın.',
        targetRole: 'CARRIER'
      });
      setAuthModalOpen(true);
      return;
    }

    if (actionType === 'PHONE') {
      setRevealedPhones(prev => ({ ...prev, [id]: true }));
    }
  };

  // Filtrelenmiş ilanlar
  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'CARGO_JOB' && post.category !== 'CARGO_JOB') return false;
    if (activeCategory === 'EMPTY_VEHICLE' && post.category !== 'EMPTY_VEHICLE') return false;
    if (activeCategory === 'RETURN_TRIP' && post.category !== 'RETURN_TRIP') return false;
    if (filterOrigin && post.originCity !== filterOrigin && post.destinationCity !== filterOrigin) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = post.content.toLowerCase().includes(q) ||
                    post.carrier.companyName.toLowerCase().includes(q) ||
                    post.originCity.toLowerCase().includes(q) ||
                    post.destinationCity.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── 1. ÜST BANNER (Rakip Görsel 2 ile Birebir) ── */}
        <Link href="/teklif-al" className="block mb-5 group">
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 flex items-center justify-between shadow-xs hover:border-[#F95700]/40 transition-all">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 font-black shadow-xs group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-[#111E38] tracking-tight truncate">
                  Hemen teklif al
                </h4>
                <p className="text-xs text-slate-500 font-medium truncate">
                  Talep oluştur, nakliyecilerden teklif al ve fiyatları karşılaştır.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-orange-50 group-hover:text-[#F95700] text-slate-600 flex items-center justify-center transition-colors shrink-0 ml-3">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* ── 2. 3'LÜ İSTATİSTİK KARTLARI (Rakip Görsel 2 ile Birebir) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {/* Kart 1: İş Paylaşıldı */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-center shadow-xs">
            <div className="w-7 h-7 mx-auto mb-1.5 text-amber-500 flex items-center justify-center">
              <Package className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">1.421</div>
            <div className="text-xs font-bold text-slate-700 mt-1">İş Paylaşıldı</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Son 7 gün</div>
          </div>

          {/* Kart 2: Aktif Nakliyat Firması */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-center shadow-xs">
            <div className="w-7 h-7 mx-auto mb-1.5 text-amber-500 flex items-center justify-center">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">6.522</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Aktif</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Nakliyat Firması</div>
          </div>

          {/* Kart 3: İş Hacmi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 text-center shadow-xs">
            <div className="w-7 h-7 mx-auto mb-1.5 text-amber-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">104,80M ₺</div>
            <div className="text-xs font-bold text-slate-700 mt-1">İş Hacmi ⓘ</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Son 30 gün</div>
          </div>
        </div>

        {/* ── 3. DEFTER BAŞLIĞI & ARAMA ── */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <h1 className="text-2xl sm:text-3xl font-black text-[#111E38] tracking-tight">
            Defter
          </h1>
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              showSearch || searchQuery
                ? 'bg-orange-50 border-orange-200 text-[#F95700]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
            title="Arama Yap"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Arama Alanı (Açıldığında) */}
        {showSearch && (
          <div className="mb-3 animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="İl, ilçe, firma adı veya yük detayına göre filtrele..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-[#111E38] placeholder:text-slate-400 focus:border-[#F95700] focus:outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── 4. ŞEHİR FİLTRE HAPLARI (Rakip Görsel 2 ile Birebir) ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Mersin', 'Diyarbakır', 'Kocaeli'].map((cityName) => {
            const isSelected = (cityName === 'Tümü' && !filterOrigin) || filterOrigin === cityName;
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => setFilterOrigin(cityName === 'Tümü' ? '' : cityName)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#111E38] text-white border border-[#111E38] shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>

        {/* ── 5. YAYINLA / KOMPOZÖR ALANI (Rakip Görsel 2 ile Birebir - Herkese Açık) ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-5 shadow-xs">
          <form onSubmit={handlePublishClick}>
            <textarea
              value={inlineContent}
              onChange={(e) => {
                setInlineContent(e.target.value);
                if (inlineError) setInlineError('');
              }}
              rows={3}
              placeholder="En az 25 karakter yazın... Boş araç, dönüş rotası veya iş paylaşımınızı meslektaşlarınıza duyurun."
              className="w-full border-0 p-1 text-sm text-[#111E38] placeholder:text-slate-400 focus:outline-none resize-none bg-transparent"
            />

            {inlineError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2 mb-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{inlineError}</span>
              </div>
            )}

            {publishSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 mb-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>İlanınız Defter&apos;e başarıyla yayınlandı!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <span className="text-[11px] font-medium text-slate-400">
                {inlineContent.trim().length} / 25 karakter
              </span>
              <button
                type="submit"
                className="bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Yayınla
              </button>
            </div>
          </form>
        </div>

        {/* ── 6. KATEGORİ FİLTRE SEKMELERİ (Rakip Görsel 2 ile Birebir) ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {[
            { id: 'ALL', label: 'Tümü', count: 1421, icon: Layers },
            { id: 'CARGO_JOB', label: 'Yük / İş', count: 310, icon: Package },
            { id: 'RETURN_TRIP', label: 'Talepler', count: 91, icon: BookOpen },
            { id: 'EMPTY_VEHICLE', label: 'Boş Araç', count: 765, icon: Truck },
          ].map((tab) => {
            const isSelected = activeCategory === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#111E38] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 7. İLAN LİSTESİ (Rakip Görsel 2 stili, Temiz & Okunaklı) ── */}
        <div className="space-y-3.5">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
              <Package className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-[#111E38]">İlan Bulunamadı</h3>
              <p className="text-xs text-slate-500">Seçtiğiniz filtrelere uygun aktif Defter ilanı bulunmuyor.</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const initials = getInitials(post.carrier.companyName);
              const isPhoneRevealed = revealedPhones[post.id];

              return (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Üst Satır: Avatar + Firma Adı + Menü */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 border border-amber-300/80 text-[#8F4E00] font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/firma/${post.carrier.slug}`}
                            className="font-bold text-sm sm:text-base text-[#111E38] hover:text-[#F95700] transition-colors"
                          >
                            {post.carrier.companyName}
                          </Link>
                          {post.carrier.verificationStatus === 'APPROVED' && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">
                          {post.carrier.joinedAt ? `${new Date(post.carrier.joinedAt).getFullYear()} katıldı` : 'Onaylı Nakliyeci'} · {post.originCity} · {formatRelativeTime(post.createdAt)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rozetler (Rota + Durum) */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-bold text-[#C23E00]">
                      <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                      <span>{post.originCity}</span>
                      <MoveRight className="w-3 h-3 text-orange-400" />
                      <span>{post.destinationCity}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      🚛 {post.category === 'EMPTY_VEHICLE' ? 'Boş Araç' : post.category === 'CARGO_JOB' ? 'Yük / İş' : 'Talep'}
                    </span>

                    {post.capacityPercent && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                        %{post.capacityPercent} Kapasite
                      </span>
                    )}
                  </div>

                  {/* Açıklama Metni (Nokta ile vurgulu) */}
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-3.5">
                    <span className="text-[#F95700] font-black mr-1.5">•</span>
                    {post.content}
                  </div>

                  {/* Alt Satır: Tarih/Araç ve Aksiyon Butonları */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="text-slate-400 font-medium text-xs">
                      {post.date} · {post.vehicleType}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleActionWithAuth(post.id, 'MESSAGE')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>Mesaj</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleActionWithAuth(post.id, 'PHONE')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#C23E00] border border-orange-200 font-bold transition-all cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#F95700]" />
                        <span>
                          {isPhoneRevealed ? (post.carrier.phone || '0532 555 00 00') : 'Numarayı Göster'}
                        </span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ── AUTH GİRİŞ/KAYIT MODALI ── */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        targetRole={authModalConfig.targetRole}
        title={authModalConfig.title}
        subtitle={authModalConfig.subtitle}
        onSuccess={() => {
          setAuthModalOpen(false);
          setCurrentUser(db.getCurrentUser());
        }}
      />

    </div>
  );
}
