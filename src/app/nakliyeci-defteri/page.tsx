'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Truck, 
  Package, 
  Plus,
  Calendar, 
  MapPin, 
  MoveRight, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  SlidersHorizontal,
  X,
  Send,
  MoreHorizontal,
  Home,
  Boxes,
  Building2,
  Armchair,
  Layers,
  ArrowRight,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { db } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { DefterPost, DefterPostCategory, MovingRequest } from '@/types';

const CATEGORY_CHIPS = [
  { id: 'ALL', label: 'Tümü', icon: Layers },
  { id: 'EMPTY_VEHICLE', label: 'Boş Araç', icon: Truck },
  { id: 'CARGO_JOB', label: 'Yük Arıyorum', icon: Package },
  { id: 'RETURN_TRIP', label: 'Boş Dönüş', icon: MoveRight },
  { id: 'PARTIAL_LOAD', label: 'Parsiyel / Parça', icon: Boxes },
  { id: 'ELEVATOR', label: 'Mobil Asansör', icon: Building2 }
];

// Helper: Canlı göreceli zaman formatı (3 dk önce, 15 dk önce vb.)
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
  const isCarrier = currentUser?.role === 'CARRIER';
  const carrier = db.getCarriers()[0];

  const [posts, setPosts] = useState<DefterPost[]>(db.getDefterPosts());
  const requests = db.getRequests();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [filterOrigin, setFilterOrigin] = useState('');
  const [filterDest, setFilterDest] = useState('');
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  // Composer Drawer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [postCategory, setPostCategory] = useState<DefterPostCategory>('EMPTY_VEHICLE');
  const [originCity, setOriginCity] = useState('Kayseri');
  const [originDistrict, setOriginDistrict] = useState('Merkez');
  const [destCity, setDestCity] = useState('Tüm Türkiye');
  const [vehicleType, setVehicleType] = useState('10 Teker Kapalı Kasa');
  const [capacityPercent, setCapacityPercent] = useState(100);
  const [content, setContent] = useState('');
  const [allowPhone, setAllowPhone] = useState(true);

  // Auth gate modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authActionPayload, setAuthActionPayload] = useState<{ id: string; type: 'POST' | 'PHONE' | 'MESSAGE' } | null>(null);

  // Quick Offer inputs on customer cards
  const [quickOfferPrices, setQuickOfferPrices] = useState<Record<string, string>>({});

  const handleOpenComposer = () => {
    if (!currentUser || currentUser.role !== 'CARRIER') {
      setAuthActionPayload({ id: 'new', type: 'POST' });
      setAuthModalOpen(true);
      return;
    }
    setIsComposerOpen(true);
  };

  const [inlinePostContent, setInlinePostContent] = useState('');
  const [inlinePostCategory, setInlinePostCategory] = useState<DefterPostCategory>('EMPTY_VEHICLE');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleInlinePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlinePostContent || inlinePostContent.trim().length < 10) {
      alert('Lütfen en az 10 karakter yazın.');
      return;
    }

    const user = db.getCurrentUser();
    if (!user) {
      setAuthActionPayload({ id: 'new', type: 'POST' });
      setAuthModalOpen(true);
      return;
    }

    const carrierObj = db.getCarriers()[0];
    const newPost: DefterPost = {
      id: `def_${Date.now()}`,
      carrierId: carrierObj.id,
      carrier: {
        ...carrierObj,
        companyName: user.role === 'CARRIER' ? (user.companyName || carrierObj.companyName) : (user.fullName || 'Bireysel Üye'),
        phone: user.phone || carrierObj.phone
      },
      category: inlinePostCategory,
      originCity: user.city || 'İstanbul',
      originDistrict: 'Merkez',
      destinationCity: 'Tüm Türkiye',
      destinationDistrict: 'Tümü',
      date: 'Bugün',
      vehicleType: 'Kamyonet / Kamyon',
      capacityPercent: 100,
      acceptsWaypoints: true,
      content: inlinePostContent.trim(),
      allowPhone: true,
      allowMessage: true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString()
    };

    db.addDefterPost(newPost);
    setPosts([newPost, ...db.getDefterPosts()]);
    setInlinePostContent('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: DefterPost = {
      id: `def_${Date.now()}`,
      carrierId: carrier.id,
      carrier,
      category: postCategory,
      originCity,
      originDistrict,
      destinationCity: destCity,
      destinationDistrict: 'Tümü',
      date: 'Bugün',
      vehicleType,
      capacityPercent,
      acceptsWaypoints: true,
      content: content || `${originCity} bölgesinde ${vehicleType} boş aracımız vardır. İşi olan meslektaşların ve müşterilerin bilgisine.`,
      allowPhone,
      allowMessage: true,
      status: 'ACTIVE',
      isSponsored: carrier.planId === 'plan_gold',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString()
    };

    db.addDefterPost(newPost);
    setPosts(db.getDefterPosts());
    setIsComposerOpen(false);
    setContent('');
  };

  const handleShowPhone = (id: string) => {
    if (!currentUser) {
      setAuthActionPayload({ id, type: 'PHONE' });
      setAuthModalOpen(true);
      return;
    }
    setRevealedPhones(prev => ({ ...prev, [id]: true }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (activeCategory !== 'ALL' && post.category !== activeCategory) return false;
    if (filterOrigin && post.originCity !== filterOrigin) return false;
    if (filterDest && post.destinationCity !== filterDest) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ── 1. HEADER (Human & Professional Community Look) ──────── */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Canlı Nakliye Borsası • 81 İl Aktif İlanlar</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
                Nakliyeci Defteri
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Boş araç, dönüş yükü ve kiralık mobil asansör paylaşım ağı. Doğrudan telefonla iletişim.
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              className="font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md shadow-orange-900/15 shrink-0 self-start sm:self-auto cursor-pointer"
              leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
              onClick={handleOpenComposer}
            >
              + Yeni İlan Bırak
            </Button>
          </div>
        </div>

        {/* ── 2. IMAGE 4 COMPOSER & CITY QUICK FILTERS ───────────────── */}
        {/* City Quick Pills (Image 4 exact) */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {['Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Mersin', 'Diyarbakır', 'Kocaeli'].map((cityName) => (
            <button
              key={cityName}
              type="button"
              onClick={() => setFilterOrigin(cityName === 'Tümü' ? '' : cityName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                (cityName === 'Tümü' && !filterOrigin) || filterOrigin === cityName
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {cityName}
            </button>
          ))}
        </div>

        {/* Inline Publishing Card (Image 4 exact) */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs mb-6 space-y-3">
          {/* Ban Warning Banner */}
          <div className="p-3 px-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>⚠️ Uyarı: Konu dışı veya yanıltıcı paylaşım yapmak süresiz ban sebebidir.</span>
          </div>

          {publishSuccess && (
            <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>İlanınız Defter&apos;e başarıyla eklendi!</span>
            </div>
          )}

          <form onSubmit={handleInlinePublish} className="space-y-3">
            <textarea
              value={inlinePostContent}
              onChange={(e) => setInlinePostContent(e.target.value)}
              rows={3}
              placeholder="En az 25 karakter yazın..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#FFD200] focus:outline-none resize-none bg-slate-50/50"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'EMPTY_VEHICLE', label: '🚛 Boş Araç' },
                  { id: 'CARGO_JOB', label: '📦 Yük / İş' },
                  { id: 'REQUEST', label: '📋 Talep' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setInlinePostCategory(cat.id as DefterPostCategory)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      inlinePostCategory === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="bg-[#FFD200] hover:bg-[#F5C400] text-black font-black text-xs sm:text-sm px-8 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors"
              >
                Yayınla
              </button>
            </div>
          </form>
        </div>

        {/* ── 3. SINGLE CLEAN CATEGORY FILTER TABS (Image 4 exact) ──────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {[
            { id: 'ALL', label: 'Tümü', count: 1454, icon: Layers },
            { id: 'CARGO_JOB', label: 'Yük / İş', count: 329, icon: Package },
            { id: 'REQUEST', label: 'Talepler', count: 92, icon: BookOpen },
            { id: 'EMPTY_VEHICLE', label: 'Boş Araç', count: 766, icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap select-none ${
                  isSelected
                    ? 'bg-[#0A1128] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#F95700]'}`} />
                <span>{tab.label}</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
        {/* ── 4. LIVE DEFTER POSTS FEED (Matching Reference Screenshot) ── */}
        <div className="space-y-5">
          {filteredPosts.map((post) => {
            const isPhoneRevealed = revealedPhones[post.id];

            return (
              <div
                key={post.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-300 transition-all p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Header: Carrier Logo, Name, Badge, Menu Dots */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                      {post.carrier.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/firma/${post.carrier.slug}`}
                          className="font-black text-sm sm:text-base text-[#0A1128] hover:text-[#F95700] transition-colors"
                        >
                          {post.carrier.companyName}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-0.5">
                        <span className="text-slate-600">Onaylı Firma</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                        {post.carrier.city && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>{post.carrier.city}</span>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-semibold">{formatRelativeTime(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Route & Category Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                    <span className="text-[#F95700] font-black">{post.originCity}</span>
                    {post.destinationCity && post.destinationCity !== 'Tüm Türkiye' && (
                      <>
                        <MoveRight className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-900 font-black">{post.destinationCity}</span>
                      </>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-black text-[#C23E00]">
                    <Truck className="w-3.5 h-3.5" />
                    <span>
                      {CATEGORY_CHIPS.find(c => c.id === post.category)?.label || 'Boş Araç'}
                    </span>
                  </div>

                  {post.capacityPercent && (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                      %{post.capacityPercent} Boş Kapasite
                    </span>
                  )}
                </div>

                {/* Bullet Points / Content (Clean text like reference image) */}
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  {post.content.split('\n').map((line, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-[#F95700] font-black mt-0.5">•</span>
                      <span>{line}</span>
                    </p>
                  ))}
                </div>

                {/* Footer Actions: Time + Mesaj + Numarayı Göster */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-medium">
                    {post.date || 'Bugün'} •
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Mesaj Butonu with green online dot */}
                    <Link href={isCarrier ? '/app/carrier/mesajlar' : '/app/customer/mesajlar'}>
                      <button className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-2 transition-colors cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                        <span>Mesaj</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </button>
                    </Link>

                    {/* Numarayı Göster Butonu */}
                    <button
                      onClick={() => handleShowPhone(post.id)}
                      className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>{isPhoneRevealed ? post.carrier.phone : 'Numarayı Göster'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CREATE POST MODAL ─────────────────────────────────── */}
      <Modal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        title="Defter'de Yeni İlan / Boş Araç Paylaş"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Paylaşım Türü</label>
            <select
              value={postCategory}
              onChange={e => setPostCategory(e.target.value as DefterPostCategory)}
              className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#F95700] focus:outline-none"
            >
              <option value="EMPTY_VEHICLE">🚛 Boş Araç Paylaşımı</option>
              <option value="RETURN_TRIP">🔄 Boş Dönüş Rotası</option>
              <option value="CARGO_JOB">📦 Yük Arıyorum</option>
              <option value="PARTIAL_LOAD">📦 Parsiyel / Parça Eşya</option>
              <option value="ELEVATOR">🏢 Kiralık Mobil Asansör</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Çıkış İli (Nereden?)</label>
              <select
                value={originCity}
                onChange={e => setOriginCity(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#F95700] focus:outline-none"
              >
                {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Varış / Güzergâh</label>
              <select
                value={destCity}
                onChange={e => setDestCity(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#F95700] focus:outline-none"
              >
                <option value="Tüm Türkiye">Tüm Türkiye (Yön Farketmez)</option>
                {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Araç Tipi</label>
            <input
              type="text"
              value={vehicleType}
              onChange={e => setVehicleType(e.target.value)}
              placeholder="Örn: 10 Teker Kapalı Kasa, Kamyonet, TIR"
              className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#F95700] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">İlan Açıklaması *</label>
            <textarea
              rows={3}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="• Kayseri'de boş aracımız var yön farketmez&#10;• İşi olan meslektaşların ve müşterilerin bilgisine"
              className="w-full p-3 rounded-2xl border-2 border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#F95700] focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1 font-bold"
              onClick={() => setIsComposerOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 font-black shadow-md"
            >
              İlanı Yayınla
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── INTENT AUTH MODAL ─────────────────────────────────── */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthActionPayload(null);
        }}
        targetRole="CARRIER"
        title="Defter'de Paylaşım Yapmak İçin Nakliyeci Girişi Yapın"
        subtitle="Boş araçlarınızı ve dönüş rotalarınızı paylaşmak, diğer nakliyecilerin numaralarına erişmek için onaylı nakliyeci hesabınıza giriş yapın veya 7 gün ücretsiz deneyin."
        onSuccess={() => {
          setAuthModalOpen(false);
          if (authActionPayload?.type === 'POST') {
            setIsComposerOpen(true);
          } else if (authActionPayload?.type === 'PHONE') {
            setRevealedPhones(prev => ({ ...prev, [authActionPayload.id]: true }));
          }
        }}
      />
    </div>
  );
}
