'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Award, 
  Check, 
  Save, 
  Camera, 
  Truck,
  ExternalLink,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  CreditCard,
  ArrowRight,
  Clock,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db, SEED_PLANS } from '@/lib/data/mock-db';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

const SERVICES_LIST = [
  { id: 'evden-eve', label: 'Evden Eve Nakliyat' },
  { id: 'ofis-tasima', label: 'Ofis / İşyeri Taşıma' },
  { id: 'sehirler-arasi', label: 'Şehirlerarası Nakliyat' },
  { id: 'mobil-asansor', label: 'Mobil Asansörlü Taşıma' },
  { id: 'parca-esya', label: 'Parça Eşya Taşımacılığı' },
  { id: 'depolama', label: 'Eşya Depolama' }
];

export default function CarrierProfileEditorPage() {
  const carrier = db.getCarriers()[0];
  const [sub, setSub] = useState(db.getCarrierSubscription(carrier.id));
  const currentPlan = SEED_PLANS.find(p => p.id === carrier.planId) || SEED_PLANS[2];

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SERVICES' | 'ELEVATOR' | 'CONTACT' | 'SUBSCRIPTION' | 'DOCUMENTS'>('GENERAL');
  const [companyName, setCompanyName] = useState(carrier.companyName);
  const [shortBio, setShortBio] = useState(carrier.shortBio);
  const [description, setDescription] = useState(carrier.description || '');
  const [phone, setPhone] = useState(carrier.phone);
  const [whatsapp, setWhatsapp] = useState(carrier.whatsapp || carrier.phone);
  const [email, setEmail] = useState(carrier.email);
  const [city, setCity] = useState(carrier.city);
  const [district, setDistrict] = useState(carrier.district);
  const [services, setServices] = useState<string[]>(carrier.services);
  const [serviceAreas, setServiceAreas] = useState<string[]>(carrier.serviceAreas);
  const [hasElevator, setHasElevator] = useState(carrier.elevatorSpec?.hasElevator || false);
  const [maxFloor, setMaxFloor] = useState(carrier.elevatorSpec?.maxFloor || 15);
  const [elevatorDesc, setElevatorDesc] = useState(carrier.elevatorSpec?.description || '');

  // Evraklar
  const [carrierDocs, setCarrierDocs] = useState(db.getDocumentsForCarrier(carrier.id));
  const [uploadedNotice, setUploadedNotice] = useState('');

  // Kalan gün hesabı
  const periodEndDate = new Date(sub.currentPeriodEnd);
  const now = new Date();
  const diffTime = periodEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleCancelSub = () => {
    const updated = db.cancelCarrierSubscription(carrier.id);
    setSub(updated);
  };

  const handleRenewSub = () => {
    const updated = db.renewCarrierSubscription(carrier.id);
    setSub(updated);
  };

  const handleUploadMockDoc = (type: 'IDENTITY' | 'TAX_CERTIFICATE') => {
    const title = type === 'IDENTITY' ? 'Yetkili Kimlik Belgesi' : 'Vergi Levhası Belgesi';
    const fileName = type === 'IDENTITY' ? 'kimlik_on_yuz_yeni.jpg' : 'guncel_vergi_levhasi.pdf';
    
    db.addDocument({
      id: `doc_${Date.now()}`,
      carrierId: carrier.id,
      type,
      title,
      fileName,
      fileUrl: type === 'IDENTITY' ? '/mock-files/kimlik.jpg' : '/mock-files/vergi_levhasi.pdf',
      status: 'PENDING',
      uploadedAt: new Date().toISOString()
    });

    setCarrierDocs(db.getDocumentsForCarrier(carrier.id));
    setUploadedNotice(`${title} başarıyla yüklendi. İnceleme sırasına alındı.`);
    setTimeout(() => setUploadedNotice(''), 4000);
  };

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleService = (sId: string) => {
    setServices(prev => prev.includes(sId) ? prev.filter(s => s !== sId) : [...prev, sId]);
  };

  const toggleCity = (cityName: string) => {
    setServiceAreas(prev => prev.includes(cityName) ? prev.filter(c => c !== cityName) : [...prev, cityName]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCarrier(carrier.id, {
      companyName,
      shortBio,
      description,
      phone,
      whatsapp,
      email,
      city,
      district,
      services,
      serviceAreas,
      elevatorSpec: {
        hasElevator,
        elevatorType: 'VEHICLE_MOUNTED',
        maxFloor,
        description: elevatorDesc,
        isVerified: true
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const popularCities = TURKEY_CITIES.filter(c => c.isPopular);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            Kurumsal Firma Profili
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Müşterilerin ve meslektaşlarınızın görüntüleyeceği firma bilgilerinizi, araç ve asansör kapasitenizi yönetin.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/firma/${carrier.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="font-bold text-xs" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              Profilimi Önizle
            </Button>
          </Link>
        </div>
      </div>

      {/* Verification Status Banner (Spec requirement) */}
      {carrier.verificationStatus === 'PENDING' ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold mb-6 flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-sm text-amber-900">
              ⚠️ Onaysız Profil — Henüz firmamız tarafından doğrulanmış profil değilsiniz
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Yüklediğiniz kimlik ve vergi levhanız inceleme aşamasındadır. <strong>12 saat içinde onay & red durumunuz sonuçlandırılacaktır.</strong> Bu süreçte profilinizi düzenleyebilir ve araç ekleyebilirsiniz; ancak müşterilere teklif verme ve mesaj gönderme haklarınız onay sonrasında aktif edilecektir.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('DOCUMENTS')}
              className="text-xs font-black text-[#F95700] hover:underline cursor-pointer flex items-center gap-1 pt-1"
            >
              <span>Evrak Durumunu Görüntüle / Yeni Belge Yükle →</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>✓ Doğrulanmış Onaylı Profil — Tüm platform yetkileriniz aktiftir.</span>
        </div>
      )}

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-black mb-6 flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Değişiklikleriniz başarıyla kaydedildi ve kamuya açık profilinize yansıtıldı.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'GENERAL', label: 'Genel & Tanıtım' },
          { id: 'SUBSCRIPTION', label: 'Abonelik & Paket' },
          { id: 'DOCUMENTS', label: 'Doğrulama & Evraklar' },
          { id: 'SERVICES', label: 'Hizmetler & Şehirler' },
          { id: 'ELEVATOR', label: 'Mobil Asansör' },
          { id: 'CONTACT', label: 'İletişim & Adres' },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#0A1128] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* TAB 1: GENERAL INFO */}
        {activeTab === 'GENERAL' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 animate-fade-in">
            {/* Status Summary */}
            <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="verified" size="md" />
                {carrier.planId === 'plan_gold' && <Badge variant="gold" size="md" />}
              </div>
              <span className="text-xs font-bold text-slate-600">
                {carrier.completedJobsCount} Başarılı Taşıma · Puan: {carrier.rating} ★
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Firma Ticari Unvanı *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Kısa Tanıtım Sloganı (Kartlarda görünür) *</label>
              <input
                type="text"
                required
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-200 font-medium text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Detaylı Kurumsal Açıklama &amp; Standartlar</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Firma geçmişiniz, kullandığınız ambalaj malzemeleri, araç filonuz ve taşınma güvenceleriniz hakkında bilgi verin..."
                className="w-full p-3.5 rounded-2xl border-2 border-slate-200 font-medium text-sm text-slate-900 focus:border-[#F95700] focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* TAB: SUBSCRIPTION (Abonelik ve Kalan Gün) */}
        {activeTab === 'SUBSCRIPTION' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1.5">
                  Mevcut Üyelik Durumu
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                  {currentPlan.name} Paketi
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Aboneliğinizin kalan süresini takip edebilir veya dilediğiniz an iptal edebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-black">
                  ⏳ {daysRemaining} Gün Kaldı
                </span>
                {sub.status === 'CANCELED' ? (
                  <span className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 text-xs font-black">
                    İptal Edildi
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Aktif
                  </span>
                )}
              </div>
            </div>

            {/* Plan Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-bold block mb-1">Aylık Tutar</span>
                <span className="text-lg font-black text-slate-900">
                  {currentPlan.priceMonthly.toLocaleString('tr-TR')} TL / Ay
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-bold block mb-1">Sonraki Yenileme</span>
                <span className="text-sm font-black text-slate-900">
                  {periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-bold block mb-1">Kayıtlı Kart</span>
                <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-500" />
                  •••• {sub.cardLastFour || '4242'}
                </span>
              </div>
            </div>

            {/* Cancel or Renew Banner */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-black text-[#0A1128]">
                  {sub.status === 'CANCELED' ? 'Abonelik İptal Durumu' : 'Aboneliği İptal Etmek mi İstiyorsunuz?'}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-lg">
                  {sub.status === 'CANCELED'
                    ? `Aboneliğiniz iptal edilmiştir. ${periodEndDate.toLocaleDateString('tr-TR')} tarihine kadar mevcut avantajlarınızı kullanabilirsiniz.`
                    : 'İptal ettiğinizde dönem sonuna kadar tüm teklif verme ve Gold ayrıcalıklarınız devam eder, sonraki dönem ücret tahsil edilmez.'}
                </p>
              </div>

              {sub.status === 'CANCELED' ? (
                <button
                  type="button"
                  onClick={handleRenewSub}
                  className="px-4 py-2.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Aboneliği Yeniden Başlat
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelSub}
                  className="px-4 py-2.5 rounded-xl border-2 border-red-200 hover:bg-red-50 text-red-600 font-black text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Aboneliği İptal Et
                </button>
              )}
            </div>

            <div className="pt-2 text-right">
              <Link href="/app/carrier/abonelik">
                <span className="text-xs font-black text-[#F95700] hover:underline inline-flex items-center gap-1 cursor-pointer">
                  <span>Paket Değiştir / Yükseltme Seçeneklerini Gör</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* TAB: DOCUMENTS (Doğrulama ve Evraklar) */}
        {activeTab === 'DOCUMENTS' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block mb-1.5">
                Resmi Doğrulama & Yetki Belgeleri
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Firma Evrakları & İnceleme Durumu
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Taşınma güvenliği için kimlik ve vergi levhanız Ulaştırma Bakanlığı kurallarınca incelenir.
              </p>
            </div>

            {uploadedNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadedNotice}</span>
              </div>
            )}

            {/* Durum Kartı */}
            <div className={`p-5 rounded-2xl border-2 ${
              carrier.verificationStatus === 'APPROVED'
                ? 'bg-emerald-50/40 border-emerald-300 text-emerald-900'
                : 'bg-amber-50/40 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-start gap-3">
                {carrier.verificationStatus === 'APPROVED' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-black">
                    {carrier.verificationStatus === 'APPROVED'
                      ? '✓ Tebrikler, Doğrulanmış Kurumsal Profilsiniz!'
                      : '⚠️ Onaysız Profil — Henüz firmamız tarafından doğrulanmış profil değilsiniz'}
                  </h4>
                  <p className="text-xs font-medium mt-1 leading-relaxed">
                    {carrier.verificationStatus === 'APPROVED'
                      ? 'Firma kimlik ve vergi levhanız onaylanmıştır. Tüm müşterilere teklif verebilir ve doğrudan mesaj gönderebilirsiniz.'
                      : 'Evraklarınız inceleme sırasındadır. 12 saat içinde onay & red durumunuz verilecektir. Bu sürede mesaj gönderemezsiniz.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Yüklü Evraklar Listesi */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Yüklenmiş Belgeleriniz
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Kimlik */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0A1128] block">Yetkili Kimlik Görseli</span>
                      <span className="text-[11px] text-slate-400 font-medium">Nüfus Cüzdanı / Sürücü Belgesi</span>
                      <div className="mt-2">
                        {carrierDocs.some(d => d.type === 'IDENTITY' && d.status === 'APPROVED') ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            ✓ Onaylandı
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            ⏳ İncelemede (12 Saat)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUploadMockDoc('IDENTITY')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 hover:text-[#F95700] text-xs font-bold transition-colors cursor-pointer"
                    title="Yeniden Yükle"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Vergi Levhası */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0A1128] block">Vergi Levhası Belgesi</span>
                      <span className="text-[11px] text-slate-400 font-medium">Güncel Vergi Levhası veya K3 Belgesi</span>
                      <div className="mt-2">
                        {carrierDocs.some(d => d.type === 'TAX_CERTIFICATE' && d.status === 'APPROVED') ? (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            ✓ Onaylandı
                          </span>
                        ) : (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            ⏳ İncelemede (12 Saat)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUploadMockDoc('TAX_CERTIFICATE')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-600 hover:text-[#F95700] text-xs font-bold transition-colors cursor-pointer"
                    title="Yeniden Yükle"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Action Box */}
            <div className="p-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 text-center space-y-3">
              <p className="text-xs font-bold text-slate-600">
                Belgelerinizi güncellemek veya ek yetki evrakı yüklemek için aşağıdaki butonları kullanabilirsiniz:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUploadMockDoc('IDENTITY')}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#F95700] text-slate-800 text-xs font-black transition-all cursor-pointer shadow-2xs"
                >
                  + Yeni Kimlik Görseli Yükle
                </button>
                <button
                  type="button"
                  onClick={() => handleUploadMockDoc('TAX_CERTIFICATE')}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#F95700] text-slate-800 text-xs font-black transition-all cursor-pointer shadow-2xs"
                >
                  + Yeni Vergi Levhası Yükle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES & CITIES */}
        {activeTab === 'SERVICES' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-3">Verilen Hizmet Türleri</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES_LIST.map(svc => {
                  const isChecked = services.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => toggleService(svc.id)}
                      className={`p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                        isChecked
                          ? 'border-[#F95700] bg-orange-50/50 text-[#C23E00] font-black'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{svc.label}</span>
                      {isChecked && <Check className="w-4 h-4 text-[#F95700]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Hizmet Verilen İller &amp; Rotalar</label>
              <p className="text-xs text-slate-500 font-medium mb-3">Seçtiğiniz illere açılan taşıma talepleri ve rota eşleşmeleri size öncelikli iletilir.</p>
              
              <div className="flex flex-wrap gap-2">
                {popularCities.map(c => {
                  const isSelected = serviceAreas.includes(c.name);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCity(c.name)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0A1128] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '} {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ELEVATOR SPEC */}
        {activeTab === 'ELEVATOR' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 animate-fade-in">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasElevator}
                  onChange={e => setHasElevator(e.target.checked)}
                  className="w-5 h-5 accent-[#F95700] rounded cursor-pointer"
                />
                <div>
                  <span className="font-black text-sm text-[#0A1128] block">Firmamıza ait Araç Üstü Mobil Asansörümüz Mevcuttur</span>
                  <span className="text-xs text-slate-500 font-medium">Profilinizde mobil asansör rozeti görüntülenir ve asansör talep eden işlerde öne çıkarsınız.</span>
                </div>
              </label>
            </div>

            {hasElevator && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Maksimum Ulaşılabilir Kat Yüksekliği</label>
                  <select
                    value={maxFloor}
                    onChange={e => setMaxFloor(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {[5, 8, 10, 12, 15, 18, 20, 24].map(f => (
                      <option key={f} value={f}>{f}. Kata Kadar ({f * 3} metre)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Asansör Açıklaması &amp; Şartlar</label>
                  <textarea
                    rows={3}
                    value={elevatorDesc}
                    onChange={e => setElevatorDesc(e.target.value)}
                    placeholder="Örn: Operatörlü araç üstü hidrolik asansör, dar sokak kurulumuna uygun..."
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-medium text-sm text-slate-900 focus:border-[#F95700] focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CONTACT & ADDRESS */}
        {activeTab === 'CONTACT' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Telefon Numarası *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">WhatsApp İletişim Hattı</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Kurumsal E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full p-3 rounded-2xl border-2 border-slate-200 font-medium text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Merkez İl</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">İlçe</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full p-3 rounded-2xl border-2 border-slate-200 font-bold text-sm text-slate-900 focus:border-[#F95700] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="font-black px-10 shadow-lg shadow-orange-900/20"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
