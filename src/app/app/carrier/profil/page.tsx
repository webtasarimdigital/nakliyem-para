'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Check, 
  Pencil, 
  Camera, 
  Truck,
  ExternalLink,
  Sparkles,
  AlertCircle,
  FileText,
  CreditCard,
  ArrowRight,
  Clock,
  Upload,
  X,
  Plus,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db, SEED_PLANS } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

const ALL_SERVICES = [
  { id: 'evden-eve', label: 'Evden Eve Nakliyat' },
  { id: 'ofis-tasima', label: 'Ofis / İşyeri Taşıma' },
  { id: 'sehirler-arasi', label: 'Şehirlerarası Nakliyat' },
  { id: 'mobil-asansor', label: 'Mobil Asansörlü Taşıma' },
  { id: 'parca-esya', label: 'Parça Eşya Taşımacılığı' },
  { id: 'depolama', label: 'Eşya Depolama' }
];

export default function CarrierProfileEditorPage() {
  const [carrier, setCarrier] = useState(db.getCarriers()[0]);
  const [sub, setSub] = useState(db.getCarrierSubscription(carrier.id));
  const [carrierDocs, setCarrierDocs] = useState(db.getDocumentsForCarrier(carrier.id));
  const currentPlan = SEED_PLANS.find(p => p.id === carrier.planId) || SEED_PLANS[2];

  // Modals state
  const [editBioOpen, setEditBioOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [editServicesOpen, setEditServicesOpen] = useState(false);

  // Form states for modals
  const [tempCompanyName, setTempCompanyName] = useState(carrier.companyName);
  const [tempShortBio, setTempShortBio] = useState(carrier.shortBio);
  const [tempDescription, setTempDescription] = useState(carrier.description || '');
  const [tempPhone, setTempPhone] = useState(carrier.phone);
  const [tempWhatsapp, setTempWhatsapp] = useState(carrier.whatsapp || carrier.phone);
  const [tempEmail, setTempEmail] = useState(carrier.email);
  const [tempCity, setTempCity] = useState(carrier.city);
  const [tempDistrict, setTempDistrict] = useState(carrier.district);
  const [tempServices, setTempServices] = useState(carrier.services || []);
  const [tempHasElevator, setTempHasElevator] = useState(carrier.elevatorSpec?.hasElevator || false);
  const [tempMaxFloor, setTempMaxFloor] = useState(carrier.elevatorSpec?.maxFloor || 15);

  const [notification, setNotification] = useState('');

  // Hidden file input refs for real file selection
  const identityInputRef = useRef<HTMLInputElement>(null);
  const taxInputRef = useRef<HTMLInputElement>(null);

  // Days remaining calculation
  const periodEndDate = new Date(sub.currentPeriodEnd);
  const now = new Date();
  const diffTime = periodEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Save Bio & Details
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCarrier(carrier.id, {
      companyName: tempCompanyName,
      shortBio: tempShortBio,
      description: tempDescription,
    });
    setCarrier(db.getCarriers()[0]);
    setEditBioOpen(false);
    showNotification('Kurumsal bilgiler başarıyla güncellendi.');
  };

  // Save Contact
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCarrier(carrier.id, {
      phone: tempPhone,
      whatsapp: tempWhatsapp,
      email: tempEmail,
      city: tempCity,
      district: tempDistrict,
    });
    setCarrier(db.getCarriers()[0]);
    setEditContactOpen(false);
    showNotification('İletişim ve konum bilgileri güncellendi.');
  };

  // Save Services
  const handleSaveServices = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCarrier(carrier.id, {
      services: tempServices,
      elevatorSpec: {
        hasElevator: tempHasElevator,
        maxFloor: tempMaxFloor,
        description: tempHasElevator ? `${tempMaxFloor}. kata kadar hidrolik mobil asansör` : 'Asansör hizmeti bulunmuyor.'
      }
    });
    setCarrier(db.getCarriers()[0]);
    setEditServicesOpen(false);
    showNotification('Hizmetler ve asansör bilgileri güncellendi.');
  };

  // Real File Upload Handler (FileReader Base64)
  const handleRealFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'IDENTITY' | 'TAX_CERTIFICATE') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      const title = type === 'IDENTITY' ? 'Yetkili Kimlik Belgesi' : 'Vergi Levhası Belgesi';

      db.addDocument({
        id: `doc_${Date.now()}`,
        carrierId: carrier.id,
        type,
        title,
        fileName: file.name,
        fileUrl: (base64Data as string) || '',
        status: 'PENDING',
        uploadedAt: new Date().toISOString()
      });

      setCarrierDocs(db.getDocumentsForCarrier(carrier.id));
      showNotification(`${title} (${file.name}) yüklendi. 12 saat içinde incelenecektir.`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A1128] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-white/20 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── TOP HERO BANNER (Dışarıdan İnsanların Gördüğü Görünüm) ── */}
      <div className="bg-[#0A1128] text-white pt-8 pb-12 border-b border-slate-800 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-white text-[#F95700] p-1 flex items-center justify-center shadow-xl border-2 border-white/20">
                  <div className="w-full h-full rounded-2xl bg-orange-50 flex items-center justify-center">
                    <Truck className="w-12 h-12 stroke-[2.2]" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{carrier.companyName}</h1>
                  {carrier.verificationStatus === 'APPROVED' ? (
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Onaylı Firma
                    </span>
                  ) : (
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Onay Bekleniyor
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 font-semibold flex-wrap mt-1">
                  <div className="flex items-center text-amber-400 gap-1 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{carrier.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({carrier.reviewCount} Değerlendirme)</span>
                  </div>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                    {carrier.city} / {carrier.district}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400">{carrier.completedJobsCount}+ Başarılı Taşıma</span>
                </div>
              </div>
            </div>

            {/* Önizleme Butonu */}
            <div className="flex items-center gap-2">
              <Link href={`/firma/${carrier.slug}`} target="_blank">
                <button className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Kamu Profilini Gör</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Onaysız Profil 12 Saat Uyarısı */}
          {carrier.verificationStatus === 'PENDING' && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white font-bold">⚠️ Onaysız Profil — Belgeleriniz İnceleme Aşamasındadır</strong>
                Firmamız tarafından 12 saat içinde onay veya ret durumu sonuçlandırılacaktır. Kimlik ve Vergi Levhanızı aşağıdan yükleyebilirsiniz.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── İÇERİK KARTLARI & DÜZENLEME KALEMLERİ ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 space-y-6">

        {/* KART 1: Kurumsal Profil & Biyografi */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative group">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#F95700]" />
              <span>Kurumsal Profil &amp; Tanıtım</span>
            </h2>
            <button
              onClick={() => {
                setTempCompanyName(carrier.companyName);
                setTempShortBio(carrier.shortBio);
                setTempDescription(carrier.description || '');
                setEditBioOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F95700] font-black text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Slogan / Kısa Biyografi</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{carrier.shortBio}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Firma Tanıtım Metni</span>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mt-0.5">
                {carrier.description || 'Henüz detaylı firma açıklaması girilmemiş.'}
              </p>
            </div>
          </div>
        </div>

        {/* KART 2: İletişim & Konum Bilgileri */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative group">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#F95700]" />
              <span>İletişim &amp; Konum</span>
            </h2>
            <button
              onClick={() => {
                setTempPhone(carrier.phone);
                setTempWhatsapp(carrier.whatsapp || carrier.phone);
                setTempEmail(carrier.email);
                setTempCity(carrier.city);
                setTempDistrict(carrier.district);
                setEditContactOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F95700] font-black text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sabit / Mobil Tel</span>
              <p className="text-xs font-black text-slate-800 mt-1">{carrier.phone}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">WhatsApp Hattı</span>
              <p className="text-xs font-black text-emerald-900 mt-1">{carrier.whatsapp || carrier.phone}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Merkez Şehir / İlçe</span>
              <p className="text-xs font-black text-slate-800 mt-1">{carrier.city} / {carrier.district}</p>
            </div>
          </div>
        </div>

        {/* KART 3: Sunulan Hizmetler & Mobil Asansör */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative group">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#F95700]" />
              <span>Hizmetler &amp; Asansör Donanımı</span>
            </h2>
            <button
              onClick={() => {
                setTempServices(carrier.services || []);
                setTempHasElevator(carrier.elevatorSpec?.hasElevator || false);
                setTempMaxFloor(carrier.elevatorSpec?.maxFloor || 15);
                setEditServicesOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F95700] font-black text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Aktif Hizmet Alanları</span>
              <div className="flex flex-wrap gap-2">
                {carrier.services.map(s => {
                  const label = ALL_SERVICES.find(item => item.id === s)?.label || s;
                  return (
                    <span key={s} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                      ✓ {label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-3 text-xs font-bold text-slate-700">
              <span className="text-amber-500">🏢 Mobil Asansör:</span>
              <span>{carrier.elevatorSpec?.hasElevator ? `Var (${carrier.elevatorSpec.maxFloor}. Kata Kadar Araç Üstü)` : 'Yok'}</span>
            </div>
          </div>
        </div>

        {/* KART 4: Resmi Evraklar & Doğrulama (Gerçek Dosya Seçimi) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F95700]" />
                <span>Doğrulama &amp; Resmi Evraklar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bilgisayarınızdan gerçek kimlik veya vergi levhası yükleyin. Admin panelinde önizlenecektir.
              </p>
            </div>
          </div>

          {/* Gizli file inputlar */}
          <input
            type="file"
            ref={identityInputRef}
            onChange={(e) => handleRealFileUpload(e, 'IDENTITY')}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <input
            type="file"
            ref={taxInputRef}
            onChange={(e) => handleRealFileUpload(e, 'TAX_CERTIFICATE')}
            accept="image/*,application/pdf"
            className="hidden"
          />

          {/* Yükleme Butonları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#F95700] transition-colors bg-slate-50/50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-black text-slate-800 block">1. Yetkili Kimlik Belgesi</span>
                <span className="text-[11px] text-slate-500 font-medium">Nüfus cüzdanı ön yüz veya ehliyet fotoğrafı (JPG, PNG)</span>
              </div>
              <button
                type="button"
                onClick={() => identityInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-orange-50 hover:text-[#F95700] hover:border-orange-300 font-bold text-xs text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Fotoğraf / Belge Seç</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#F95700] transition-colors bg-slate-50/50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-black text-slate-800 block">2. Güncel Vergi Levhası</span>
                <span className="text-[11px] text-slate-500 font-medium">Gelir İdaresi Başkanlığı onaylı vergi levhası (PDF, JPG)</span>
              </div>
              <button
                type="button"
                onClick={() => taxInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200 hover:bg-orange-50 hover:text-[#F95700] hover:border-orange-300 font-bold text-xs text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Fotoğraf / PDF Seç</span>
              </button>
            </div>
          </div>

          {/* Yüklü Belgeler Listesi */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Yüklenmiş Belgeler</span>
            {carrierDocs.length > 0 ? (
              carrierDocs.map(doc => (
                <div key={doc.id} className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 truncate">
                    {doc.fileUrl && doc.fileUrl.startsWith('data:image') ? (
                      <img src={doc.fileUrl} alt={doc.title} className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs shrink-0">
                        📄
                      </div>
                    )}
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-800 block truncate">{doc.title}</span>
                      <span className="text-[10px] text-slate-400 truncate">{doc.fileName}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shrink-0 ${
                    doc.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {doc.status === 'APPROVED' ? '✓ Onaylandı' : doc.status === 'REJECTED' ? '✕ Reddedildi' : '⏳ İnceleniyor'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Henüz yüklenmiş resmi belge bulunmuyor.</p>
            )}
          </div>
        </div>

        {/* KART 5: Abonelik & Paket Durumu */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-black text-[#0A1128] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#F95700]" />
              <span>Abonelik &amp; Paket Durumu</span>
            </h2>
            <Link href="/app/carrier/abonelik">
              <span className="text-xs font-black text-[#F95700] hover:underline">Paketleri İncele →</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900">{currentPlan.name}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {sub.status === 'ACTIVE' ? 'Aktif Üyelik' : 'İptal Edildi'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Kalan Süre: <strong className="text-slate-800">⏳ {daysRemaining} Gün Kaldı</strong> (Bitiş: {new Date(sub.currentPeriodEnd).toLocaleDateString('tr-TR')})
              </p>
            </div>

            <div className="flex items-center gap-2">
              {sub.cancelAtPeriodEnd ? (
                <button
                  onClick={() => {
                    const updated = db.renewCarrierSubscription(carrier.id);
                    setSub(updated);
                    showNotification('Aboneliğiniz yeniden başlatıldı.');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F95700] text-white font-black text-xs hover:bg-[#E04D00] transition-all cursor-pointer shadow-sm"
                >
                  Aboneliği Devam Ettir
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Aboneliğinizi dönem sonunda iptal etmek istediğinize emin misiniz?')) {
                      const updated = db.cancelCarrierSubscription(carrier.id);
                      setSub(updated);
                      showNotification('Aboneliğiniz dönem sonunda sonlanacak şekilde ayarlandı.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Aboneliği İptal Et
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL 1: Biyografi & Firma Bilgisi Düzenleme ── */}
      {editBioOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0A1128]">Kurumsal Bilgileri Düzenle</h3>
              <button onClick={() => setEditBioOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBio} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Firma Ünvanı</label>
                <input
                  type="text"
                  value={tempCompanyName}
                  onChange={e => setTempCompanyName(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Slogan / Kısa Biyografi</label>
                <input
                  type="text"
                  value={tempShortBio}
                  onChange={e => setTempShortBio(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Detaylı Tanıtım Açıklaması</label>
                <textarea
                  rows={4}
                  value={tempDescription}
                  onChange={e => setTempDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditBioOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F95700] text-white font-black text-xs hover:bg-[#E04D00] shadow-sm cursor-pointer"
                >
                  Kaydet &amp; Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: İletişim & Konum Düzenleme ── */}
      {editContactOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0A1128]">İletişim &amp; Konum Bilgileri</h3>
              <button onClick={() => setEditContactOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Telefon Numarası</label>
                <input
                  type="tel"
                  value={tempPhone}
                  onChange={e => setTempPhone(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">WhatsApp Numarası</label>
                <input
                  type="tel"
                  value={tempWhatsapp}
                  onChange={e => setTempWhatsapp(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">Şehir</label>
                  <select
                    value={tempCity}
                    onChange={e => setTempCity(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                  >
                    {TURKEY_CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">İlçe</label>
                  <input
                    type="text"
                    value={tempDistrict}
                    onChange={e => setTempDistrict(e.target.value)}
                    required
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditContactOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F95700] text-white font-black text-xs hover:bg-[#E04D00] shadow-sm cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Hizmetler & Asansör Düzenleme ── */}
      {editServicesOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-[#0A1128]">Hizmetler &amp; Donanım</h3>
              <button onClick={() => setEditServicesOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServices} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Verilen Hizmetler</label>
                <div className="space-y-2">
                  {ALL_SERVICES.map(srv => {
                    const isChecked = tempServices.includes(srv.id);
                    return (
                      <label key={srv.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-slate-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setTempServices(tempServices.filter(s => s !== srv.id));
                            } else {
                              setTempServices([...tempServices, srv.id]);
                            }
                          }}
                          className="w-4 h-4 text-[#F95700] rounded focus:ring-0"
                        />
                        <span className="text-xs font-bold text-slate-800">{srv.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempHasElevator}
                    onChange={e => setTempHasElevator(e.target.checked)}
                    className="w-4 h-4 text-[#F95700] rounded focus:ring-0"
                  />
                  <span className="text-xs font-black text-slate-800">Firmamıza ait Araç Üstü Mobil Asansör var</span>
                </label>

                {tempHasElevator && (
                  <div className="pl-6">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Maksimum Kat Kapasitesi</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={tempMaxFloor}
                      onChange={e => setTempMaxFloor(Number(e.target.value))}
                      className="w-28 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditServicesOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#F95700] text-white font-black text-xs hover:bg-[#E04D00] shadow-sm cursor-pointer"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
