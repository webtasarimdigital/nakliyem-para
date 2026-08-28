'use client';

import React, { useState } from 'react';
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

export default function NakliyeciDefteriPage() {
  const currentUser = db.getCurrentUser();
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

        {/* ── 1. HEADER (Title & Subtitle, No dark hero) ──────── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] tracking-tight">
              Nakliyeci Defteri
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Canlı boş araç, dönüş rotaları ve nakliyeciler arası iş paylaşım ağı
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            className="font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl shadow-md shadow-orange-900/15 shrink-0"
            leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
            onClick={handleOpenComposer}
          >
            İlan Paylaş
          </Button>
        </div>

        {/* ── 2. INLINE SOCIAL POST COMPOSER BOX ───────────────── */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A1128] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'N'}
            </div>
            <button
              type="button"
              onClick={handleOpenComposer}
              className="flex-1 text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-xs sm:text-sm font-medium text-slate-400 transition-colors cursor-pointer"
            >
              Bugün boş aracınız, dönüş yükünüz veya kiralık asansörünüz var mı? Hemen paylaşın...
            </button>
          </div>

          {/* Quick Action Category Badges */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setPostCategory('EMPTY_VEHICLE'); handleOpenComposer(); }}
              className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-[#C23E00] text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Truck className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Boş Araç Paylaş</span>
            </button>

            <button
              onClick={() => { setPostCategory('RETURN_TRIP'); handleOpenComposer(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <MoveRight className="w-3.5 h-3.5 text-[#F95700]" />
              <span>Dönüş Rotası</span>
            </button>

            <button
              onClick={() => { setPostCategory('ELEVATOR'); handleOpenComposer(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Mobil Asansör</span>
            </button>

            <button
              onClick={() => { setPostCategory('PARTIAL_LOAD'); handleOpenComposer(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Boxes className="w-3.5 h-3.5 text-amber-500" />
              <span>Parsiyel Yük</span>
            </button>
          </div>
        </div>

        {/* ── 3. CATEGORY PILLS FILTER BAR ────────────────────── */}
        <div className="flex gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {CATEGORY_CHIPS.map((tab) => {
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
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#F95700]'}`} />
                <span>{tab.label}</span>
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
                        <span className="text-slate-600">Gümüş Üye</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
                        {post.carrier.city && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>{post.carrier.city}</span>
                          </>
                        )}
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
