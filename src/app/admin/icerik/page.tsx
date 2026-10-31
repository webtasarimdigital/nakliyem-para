'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Save, 
  Check, 
  Smartphone, 
  Sparkles,
  Layers,
  BookOpen,
  Store,
  Truck,
  Trash2,
  Search,
  Phone,
  Mail,
  ShieldAlert,
  Plus,
  AlertCircle,
  Ban,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';
import { DefterPost, MovingRequest, BannedEntity } from '@/types';

export default function AdminContentManagerPage() {
  const [activeTab, setActiveTab] = useState<'defter' | 'pazaryeri' | 'talepler' | 'karaliste' | 'mobil'>('defter');
  const [settings, setSettings] = useState(db.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search filters
  const [defterSearch, setDefterSearch] = useState('');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [bannedSearch, setBannedSearch] = useState('');

  // Manual ban inputs
  const [manualBanValue, setManualBanValue] = useState('');
  const [manualBanType, setManualBanType] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [manualBanName, setManualBanName] = useState('');
  const [manualBanReason, setManualBanReason] = useState('');

  // Data lists
  const [defterPosts, setDefterPosts] = useState<DefterPost[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<any[]>([]);
  const [requests, setRequests] = useState<MovingRequest[]>([]);
  const [bannedList, setBannedList] = useState<BannedEntity[]>([]);

  useEffect(() => {
    setDefterPosts(db.getDefterPosts());
    setMarketplaceListings(db.getMarketplaceListings());
    setRequests(db.getRequests());
    setBannedList(db.getBannedEntities());
  }, [refreshKey]);

  // Content deletion handlers
  const handleDeleteDefterPost = (post: DefterPost) => {
    const author = (post as any).companyName || post.carrier?.companyName || (post as any).authorName || 'İlan Sahibi';
    const dest = post.destinationCity || (post as any).destCity || '';
    if (!confirm(`"${author}" adlı kullanıcının "${post.originCity} → ${dest}" paylaşımlı defter ilanını kalıcı olarak silmek istiyor musunuz?`)) return;
    db.deleteDefterPost(post.id);
    setNotice('Defter paylaşımı başarıyla silindi ve yayından kaldırıldı.');
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeleteMarketplaceListing = (listing: any) => {
    if (!confirm(`"${listing.title}" başlıklı pazaryeri ilanını kalıcı olarak silmek istiyor musunuz?`)) return;
    db.deleteMarketplaceListing(listing.id);
    setNotice('Pazaryeri ilanı başarıyla silindi ve yayından kaldırıldı.');
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleDeleteMovingRequest = (request: MovingRequest) => {
    if (!confirm(`"${request.requestCode || request.id}" kodlu "${request.originCity} → ${request.destinationCity}" taşınma talebini kalıcı olarak silmek istiyor musunuz?`)) return;
    db.deleteMovingRequest(request.id);
    setNotice('Taşınma talebi başarıyla silindi ve platformdan kaldırıldı.');
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleUnban = (id: string, value: string) => {
    if (!confirm(`"${value}" kaydının engelini kaldırmak istediğinize emin misiniz?`)) return;
    db.unbanEntity(id);
    setNotice(`"${value}" kaydının engeli kaldırıldı.`);
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleManualBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBanValue.trim()) return;

    if (manualBanType === 'PHONE') {
      db.banEntity({
        phone: manualBanValue.trim(),
        name: manualBanName.trim() || 'Manuel Yasaklanan Numara',
        reason: manualBanReason.trim() || 'Yönetici tarafından doğrudan kara listeye eklendi'
      });
    } else {
      db.banEntity({
        email: manualBanValue.trim(),
        name: manualBanName.trim() || 'Manuel Yasaklanan E-posta',
        reason: manualBanReason.trim() || 'Yönetici tarafından doğrudan kara listeye eklendi'
      });
    }

    setNotice(`"${manualBanValue}" başarıyla kara listeye eklendi.`);
    setManualBanValue('');
    setManualBanName('');
    setManualBanReason('');
    setRefreshKey(k => k + 1);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Filtered views
  const filteredDefter = defterPosts.filter(p => {
    if (!defterSearch.trim()) return true;
    const q = defterSearch.toLowerCase();
    const company = (p as any).companyName || p.carrier?.companyName || '';
    const author = (p as any).authorName || p.carrier?.authorizedPersonName || '';
    const origin = p.originCity || '';
    const dest = p.destinationCity || (p as any).destCity || '';
    const phone = (p as any).carrierPhone || p.carrier?.phone || '';
    const msg = p.content || (p as any).message || '';

    return (
      company.toLowerCase().includes(q) ||
      author.toLowerCase().includes(q) ||
      origin.toLowerCase().includes(q) ||
      dest.toLowerCase().includes(q) ||
      phone.includes(q) ||
      msg.toLowerCase().includes(q)
    );
  });

  const filteredMarketplace = marketplaceListings.filter(l => {
    if (!marketplaceSearch.trim()) return true;
    const q = marketplaceSearch.toLowerCase();
    return (
      (l.title && l.title.toLowerCase().includes(q)) ||
      (l.category && l.category.toLowerCase().includes(q)) ||
      (l.city && l.city.toLowerCase().includes(q)) ||
      (l.phone && String(l.phone).includes(q)) ||
      (l.sellerName && l.sellerName.toLowerCase().includes(q))
    );
  });

  const filteredRequests = requests.filter(r => {
    if (!requestSearch.trim()) return true;
    const q = requestSearch.toLowerCase();
    return (
      (r.requestCode && r.requestCode.toLowerCase().includes(q)) ||
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.customerPhone && r.customerPhone.includes(q)) ||
      (r.originCity && r.originCity.toLowerCase().includes(q)) ||
      (r.destinationCity && r.destinationCity.toLowerCase().includes(q))
    );
  });

  const filteredBanned = bannedList.filter(b => {
    if (!bannedSearch.trim()) return true;
    const q = bannedSearch.toLowerCase();
    return (
      (b.value && b.value.toLowerCase().includes(q)) ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.reason && b.reason.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Üst Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-[#0A1128]">
            İçerik & Paylaşım Moderasyonu
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Defter paylaşımlarını, ikinci el ve asansör ilanlarını, müşteri taleplerini denetleyin ve yasaklı paylaşımları anında silin.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" /> {notice}
        </div>
      )}

      {/* Sekmeler */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('defter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'defter'
              ? 'border-[#F95700] text-[#F95700] bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Nakliyeci Defteri</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-black">
            {defterPosts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pazaryeri')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pazaryeri'
              ? 'border-[#F95700] text-[#F95700] bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Pazaryeri İlanları</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-black">
            {marketplaceListings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('talepler')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'talepler'
              ? 'border-[#F95700] text-[#F95700] bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Müşteri Talepleri</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-black">
            {requests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('karaliste')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'karaliste'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Kara Liste (Yasaklılar)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-700 font-black">
            {bannedList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mobil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'mobil'
              ? 'border-[#F95700] text-[#F95700] bg-orange-50/50'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobil Uygulama Bandı</span>
        </button>
      </div>

      {/* SEKME 1: NAKLİYECİ DEFTERİ */}
      {activeTab === 'defter' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={defterSearch}
                onChange={e => setDefterSearch(e.target.value)}
                placeholder="Firma, yazar, telefon veya şehir ara..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Toplam: {filteredDefter.length} paylaşım
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Firma & Yazar</th>
                  <th className="px-4 py-3">Tür & Güzergâh</th>
                  <th className="px-4 py-3">Telefon & İletişim</th>
                  <th className="px-4 py-3">Mesaj Özeti</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDefter.map(post => {
                  const company = (post as any).companyName || post.carrier?.companyName || (post as any).authorName || 'İsimsiz Firma';
                  const author = (post as any).authorName || post.carrier?.authorizedPersonName || '';
                  const dest = post.destinationCity || (post as any).destCity || '—';
                  const phone = (post as any).carrierPhone || post.carrier?.phone || '';
                  const msg = post.content || (post as any).message || '—';
                  const postType = String(post.category || (post as any).type || 'DEFTER');
                  const categoryLabels: Record<string, string> = {
                    EMPTY_VEHICLE: 'Boş Araç',
                    EMPTY_TRUCK: 'Boş Araç',
                    CARGO_JOB: 'Yük / İş',
                    NEED_LOAD: 'Yük Arıyor',
                    RETURN_TRIP: 'Dönüş Yolu',
                    PARTIAL_LOAD: 'Parça Yük',
                    ELEVATOR: 'Asansör',
                    STAFF: 'Eleman',
                    EQUIPMENT: 'Ekipman',
                  };

                  return (
                    <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-bold text-[#0A1128] block">{company}</span>
                        {author && company !== author && (
                          <span className="text-[11px] text-slate-400 font-medium">Yetkili: {author}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black bg-orange-100 text-[#F95700]">
                            {categoryLabels[postType] || postType}
                          </span>
                          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {post.originCity || '—'} → {dest}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {phone ? (
                          <a href={`tel:${phone}`} className="font-bold text-slate-800 hover:text-[#F95700] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {phone}
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-slate-600 line-clamp-2 leading-relaxed font-normal">
                          {msg}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteDefterPost(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Defter Paylaşımını Siteden Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredDefter.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                Arama kriterine uygun defter paylaşımı bulunamadı.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 2: PAZARYERİ & EKİPMAN İLANLARI */}
      {activeTab === 'pazaryeri' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={marketplaceSearch}
                onChange={e => setMarketplaceSearch(e.target.value)}
                placeholder="İlan başlığı, kategori, şehir veya telefon ara..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Toplam: {filteredMarketplace.length} ilan
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">İlan Başlığı</th>
                  <th className="px-4 py-3">Kategori & Şehir</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">İlan Sahibi & Telefon</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMarketplace.map(listing => (
                  <tr key={listing.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#0A1128] block">{listing.title || 'Başlıksız İlan'}</span>
                      {listing.description && (
                        <span className="text-[11px] text-slate-400 line-clamp-1">{listing.description}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                          {listing.category || 'Pazaryeri'}
                        </span>
                        <div className="text-[11px] font-medium text-slate-600">
                          {listing.city || 'Belirtilmedi'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-black text-[#0A1128]">
                      {listing.price ? `₺${Number(listing.price).toLocaleString('tr-TR')}` : 'Fiyat Belirtilmedi'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-800 block">{listing.sellerName || listing.contactName || 'İsimsiz'}</span>
                      {(listing.phone || listing.sellerPhone) && (
                        <a href={`tel:${listing.phone || listing.sellerPhone}`} className="text-xs text-slate-500 hover:text-[#F95700] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {listing.phone || listing.sellerPhone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteMarketplaceListing(listing)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="İlanı Siteden Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredMarketplace.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                Pazaryerinde yayında aktif ilan bulunmuyor.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: MÜŞTERİ TALEPLERİ */}
      {activeTab === 'talepler' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={requestSearch}
                onChange={e => setRequestSearch(e.target.value)}
                placeholder="Talep kodu (#1042), müşteri adı, telefon veya şehir ara..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Toplam: {filteredRequests.length} talep
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Talep Kodu & Müşteri</th>
                  <th className="px-4 py-3">Güzergâh</th>
                  <th className="px-4 py-3">Telefon</th>
                  <th className="px-4 py-3">Hizmet Türü & Durum</th>
                  <th className="px-4 py-3">Tarih</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-black text-[#F95700] block">{req.requestCode || `#${req.id}`}</span>
                      <span className="font-bold text-[#0A1128]">{req.customerName || 'Müşteri'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {req.originCity || '—'} {req.originDistrict ? `(${req.originDistrict})` : ''} → {req.destinationCity || '—'} {req.destinationDistrict ? `(${req.destinationDistrict})` : ''}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {req.customerPhone ? (
                        <a href={`tel:${req.customerPhone}`} className="font-bold text-slate-800 hover:text-[#F95700] flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {req.customerPhone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {req.serviceCategory || 'EVDEN_EVE'}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          Durum: {req.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteMovingRequest(req)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold text-xs border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Talebi Platformdan Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-xs font-medium">
                Arama kriterine uygun taşınma talebi bulunamadı.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEKME 4: KARA LİSTE (YASAKLILAR) */}
      {activeTab === 'karaliste' && (
        <div className="space-y-6">
          {/* Manuel Yasaklama Formu */}
          <form onSubmit={handleManualBan} className="bg-white rounded-2xl border border-red-200 p-5 shadow-xs">
            <h3 className="text-sm font-black text-red-700 flex items-center gap-2 mb-3">
              <Ban className="w-4 h-4" /> Yeni Numara veya E-posta Yasakla (Kara Listeye Ekle)
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Buraya ekleyeceğiniz telefon numarası veya e-posta adresi sistem genelinde derhal engellenir. Bu bilgilerle giriş yapılamaz ve yeni hesap açılamaz.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Tür</label>
                <select
                  value={manualBanType}
                  onChange={e => setManualBanType(e.target.value as any)}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-bold bg-slate-50"
                >
                  <option value="PHONE">Telefon Numarası</option>
                  <option value="EMAIL">E-posta Adresi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  {manualBanType === 'PHONE' ? 'Telefon (05XX...)' : 'E-posta (ornek@mail.com)'}
                </label>
                <input
                  type="text"
                  value={manualBanValue}
                  onChange={e => setManualBanValue(e.target.value)}
                  placeholder={manualBanType === 'PHONE' ? '0532 000 00 00' : 'ornek@mail.com'}
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-bold focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">İsim / Firma (Opsiyonel)</label>
                <input
                  type="text"
                  value={manualBanName}
                  onChange={e => setManualBanName(e.target.value)}
                  placeholder="Kişi veya Firma Adı"
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Yasaklama Nedeni</label>
                <input
                  type="text"
                  value={manualBanReason}
                  onChange={e => setManualBanReason(e.target.value)}
                  placeholder="Dolandırıcılık, spam vb."
                  className="w-full p-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Ban className="w-3.5 h-3.5" />
                Kara Listeye Ekle
              </button>
            </div>
          </form>

          {/* Yasaklılar Tablosu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={bannedSearch}
                  onChange={e => setBannedSearch(e.target.value)}
                  placeholder="Yasaklı numara, e-posta veya isim ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Kayıtlı Yasaklı: {filteredBanned.length}
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Tür</th>
                    <th className="px-4 py-3">Yasaklı Değer (Numara / Mail)</th>
                    <th className="px-4 py-3">İsim / Açıklama</th>
                    <th className="px-4 py-3">Yasaklanma Nedeni</th>
                    <th className="px-4 py-3">Tarih</th>
                    <th className="px-4 py-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBanned.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                          b.type === 'PHONE' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {b.type === 'PHONE' ? 'Telefon' : b.type === 'EMAIL' ? 'E-posta' : b.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {b.value}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {b.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-normal">
                        {b.reason || 'Sistem kuralları ihlali'}
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {b.bannedAt ? new Date(b.bannedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleUnban(b.id, b.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Engeli Kaldır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBanned.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs font-medium">
                  Kara listede kayıtlı yasaklı üye veya numara bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEKME 5: MOBİL BANT AYARLARI */}
      {activeTab === 'mobil' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> İçerik ayarları başarıyla kaydedildi.
            </div>
          )}

          <h2 className="text-base font-bold text-[#0A1128] border-b border-slate-100 pb-3">
            Mobil Uygulama İndirme Bandı Metinleri
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Üst Bant Başlığı</label>
              <input
                type="text"
                value={settings.mobileAppBandTitle}
                onChange={(e) => setSettings({ ...settings, mobileAppBandTitle: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Üst Bant Alt Açıklaması</label>
              <input
                type="text"
                value={settings.mobileAppBandSubtitle}
                onChange={(e) => setSettings({ ...settings, mobileAppBandSubtitle: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">App Store Linki</label>
                <input
                  type="text"
                  value={settings.appStoreUrl}
                  onChange={(e) => setSettings({ ...settings, appStoreUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Google Play Linki</label>
                <input
                  type="text"
                  value={settings.googlePlayUrl}
                  onChange={(e) => setSettings({ ...settings, googlePlayUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
              İçerikleri Kaydet
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
