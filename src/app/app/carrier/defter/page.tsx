'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Truck, 
  Package, 
  Edit3, 
  Plus, 
  Calendar, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Filter,
  Users,
  Wrench,
  Award,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { DefterPost, DefterPostCategory } from '@/types';

function CarrierDefterContent() {
  const searchParams = useSearchParams();
  const carrier = db.getCarriers()[0];
  const [posts, setPosts] = useState<DefterPost[]>(db.getDefterPosts());
  const [category, setCategory] = useState<string>('ALL');

  // Composer Drawer State (Spec Item 76-77)
  const [composerOpen, setComposerOpen] = useState(searchParams?.get('action') === 'create');
  const [postCategory, setPostCategory] = useState<DefterPostCategory>(
    (searchParams?.get('category') as DefterPostCategory) || 'EMPTY_VEHICLE'
  );
  const [originCity, setOriginCity] = useState('Trabzon');
  const [originDistrict, setOriginDistrict] = useState('Ortahisar');
  const [destCity, setDestCity] = useState('İstanbul');
  const [destDistrict, setDestDistrict] = useState('Tümü');
  const [postDate, setPostDate] = useState('Yarın');
  const [vehicleType, setVehicleType] = useState('10 Teker Kamyon');
  const [capacityPercent, setCapacityPercent] = useState(70);
  const [acceptsWaypoints, setAcceptsWaypoints] = useState(true);
  const [content, setContent] = useState('');
  const [allowPhone, setAllowPhone] = useState(true);

  // Phone reveals
  const [phoneReveals, setPhoneReveals] = useState<{ [postId: string]: boolean }>({});

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
      destinationDistrict: destDistrict,
      date: postDate,
      vehicleType,
      capacityPercent,
      acceptsWaypoints,
      content: content || `${originCity} → ${destCity} yönünde ${vehicleType} aracımız boştur. Güzergâh üzeri yük veya parça eşya kabul edilir.`,
      allowPhone,
      allowMessage: true,
      status: 'ACTIVE',
      isSponsored: carrier.planId === 'plan_gold',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3 * 86400000).toISOString()
    };

    db.addDefterPost(newPost);
    setPosts(db.getDefterPosts());
    setComposerOpen(false);
    setContent('');
  };

  const handleMarkFilled = (postId: string) => {
    db.updateDefterPost(postId, { status: 'COMPLETED' });
    setPosts(db.getDefterPosts());
  };

  const filteredPosts = posts.filter(p => {
    if (category === 'ALL') return true;
    return p.category === category;
  });

  const categories = [
    { id: 'ALL', label: 'Tüm Paylaşımlar', icon: BookOpen },
    { id: 'EMPTY_VEHICLE', label: 'Boş Araç', icon: Truck },
    { id: 'CARGO_JOB', label: 'Yük / İş Paylaşımı', icon: Package },
    { id: 'PARTIAL_LOAD', label: 'Parça Eşya Alanı', icon: Layers },
    { id: 'ELEVATOR', label: 'Kiralık Mobil Asansör', icon: Edit3 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Nakliyeciler Arası İş Ağı
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Nakliyeci Defteri
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Meslektaşlarınızla boş araç, dönüş rotası ve yük paylaşın.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setComposerOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Paylaşım Yap
        </Button>
      </div>

      {/* Horizontal Category Filter Chips (Spec Item 75) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#146EF5] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Feed on Left, Sidebars on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Defter Feed (Spec Item 78) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`bg-white rounded-2xl border-2 transition-all p-5 sm:p-6 shadow-xs ${
                post.isSponsored
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[#146EF5] shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Link href={`/firma/${post.carrier.slug}`} className="font-bold text-sm text-slate-900 hover:text-[#146EF5]">
                        {post.carrier.companyName}
                      </Link>
                      {post.carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                      <Badge variant="verified" size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {post.category === 'EMPTY_VEHICLE' ? 'Boş Araç Paylaşımı' : post.category === 'ELEVATOR' ? 'Mobil Asansör' : 'Yük / Parça Paylaşımı'} • Az önce
                    </span>
                  </div>
                </div>

                {post.isSponsored && (
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    Sponsorlu
                  </span>
                )}
              </div>

              {/* Route & Specs */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                <RouteDisplay
                  originCity={post.originCity}
                  originDistrict={post.originDistrict}
                  destinationCity={post.destinationCity}
                  destinationDistrict={post.destinationDistrict}
                  size="md"
                />

                <div className="flex flex-wrap gap-3 text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-200">
                  <span>📅 <strong>Tarih:</strong> {post.date}</span>
                  {post.vehicleType && <span>🚛 <strong>Araç:</strong> {post.vehicleType}</span>}
                  {post.capacityPercent && (
                    <span className="text-emerald-700 font-bold">
                      📦 <strong>Kapasite:</strong> %{post.capacityPercent} Boş
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
                {post.content}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link href={`/app/carrier/mesajlar`}>
                    <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                      Mesaj Gönder
                    </Button>
                  </Link>

                  {phoneReveals[post.id] ? (
                    <a href={`tel:${post.carrier.phone}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        {post.carrier.phone}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Phone className="w-3.5 h-3.5" />}
                      onClick={() => setPhoneReveals({ ...phoneReveals, [post.id]: true })}
                    >
                      Telefonu Gör
                    </Button>
                  )}
                </div>

                {post.carrierId === carrier.id && post.status === 'ACTIVE' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-emerald-700 font-semibold"
                    onClick={() => handleMarkFilled(post.id)}
                  >
                    ✓ Aracım Doldu (Kapat)
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right 1 Col: Alarms & Sponsor Box (Spec Item 75) */}
        <div className="space-y-6">
          {/* Quick Route Alarm Shortcut */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Defter Alarmları</h3>
            <p className="text-xs text-slate-500 mb-4">
              Takip ettiğiniz rotada yeni bir boş araç veya yük paylaşıldığında bildirim alın.
            </p>
            <Link href="/app/carrier/alarmlar">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Yeni Alarm Oluştur →
              </Button>
            </Link>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-5 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-[#0B3B8F]">Defter Kullanım Kuralları</h4>
            <p>• Yalnızca doğrulanmış nakliyat firmaları paylaşım yapabilir.</p>
            <p>• Aracınız dolduğunda &quot;Aracım Doldu&quot; butonuna basarak gereksiz çağrıları önleyin.</p>
            <p>• Gerçek dışı ilanlar moderatörler tarafından kaldırılır.</p>
          </div>
        </div>
      </div>

      {/* Composer BottomSheet / Modal (Spec Item 76-77) */}
      <BottomSheet
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Yeni Defter Paylaşımı Yap"
      >
        <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
          {/* Quick Category Selection */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Paylaşım Türü</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'EMPTY_VEHICLE', label: 'Boş Araç' },
                { id: 'CARGO_JOB', label: 'Yük / İş' },
                { id: 'ELEVATOR', label: 'Mobil Asansör' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPostCategory(cat.id as any)}
                  className={`py-2 px-3 rounded-lg border font-bold text-center transition-colors ${
                    postCategory === cat.id
                      ? 'bg-[#146EF5] text-white border-[#146EF5]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Origin / Dest */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Çıkış İli</label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {TURKEY_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Varış İli</label>
              <select
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {TURKEY_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Vehicle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tarih / Zaman</label>
              <input
                type="text"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                placeholder="Örn: Yarın, 28 Ağustos"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Araç / Kapasite</label>
              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                placeholder="Örn: 10 Teker (%70 Boş)"
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Açıklama</label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Örn: Yarın Trabzon'dan İstanbul'a döneceğim. 10 teker aracım boş. Güzergâh üzeri yük veya parça eşya alabilirim..."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Defter&apos;e Paylaş
            </Button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}

export default function CarrierDefterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Yükleniyor...</div>}>
      <CarrierDefterContent />
    </Suspense>
  );
}
