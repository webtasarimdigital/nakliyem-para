'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Truck, 
  Building2, 
  Package, 
  Warehouse, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  Check, 
  MapPin, 
  ShieldCheck, 
  Upload, 
  Phone, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RadioCard } from '@/components/ui/RadioCard';
import { FileUploader } from '@/components/ui/FileUploader';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { MovingRequest, ServiceCategory } from '@/types';

function RequestWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step indicator (1 to 8, and 9 for summary)
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form State
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>('EVDEN_EVE');
  const [originCity, setOriginCity] = useState(searchParams?.get('originCity') || 'İstanbul');
  const [originDistrict, setOriginDistrict] = useState(searchParams?.get('originDistrict') || 'Kadıköy');
  const [destinationCity, setDestCity] = useState(searchParams?.get('destCity') || 'Ankara');
  const [destinationDistrict, setDestDistrict] = useState(searchParams?.get('destDistrict') || 'Çankaya');
  
  const [homeSize, setHomeSize] = useState('2+1');
  const [movingDate, setMovingDate] = useState('2026-09-15');
  const [isDateFlexible, setIsDateFlexible] = useState(true);
  const [flexibleDays, setFlexibleDays] = useState(3);

  const [originFloor, setOriginFloor] = useState(3);
  const [originHasElevator, setOriginHasElevator] = useState(false);
  const [originRequiresMobileElevator, setOriginRequiresMobileElevator] = useState(true);
  const [originTruckAccess, setOriginTruckAccess] = useState(true);

  const [destinationFloor, setDestFloor] = useState(4);
  const [destinationHasElevator, setDestHasElevator] = useState(true);
  const [destinationRequiresMobileElevator, setDestRequiresMobileElevator] = useState(false);
  const [destinationTruckAccess, setDestTruckAccess] = useState(true);

  const [packagingPreference, setPackagingPreference] = useState<'CARRIER_PACKS' | 'CUSTOMER_PACKS' | 'BOTH_OFFERS'>('BOTH_OFFERS');
  const [extraServices, setExtraServices] = useState<string[]>(['disassembly_assembly', 'insured']);
  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [allowPhoneCall, setAllowPhoneCall] = useState(true);

  // Auth & Completion State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  const currentUser = db.getCurrentUser();

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePublish = () => {
    const user = db.getCurrentUser();
    if (!user) {
      // Prompt auth modal without losing state
      setAuthModalOpen(true);
      return;
    }

    // Save moving request
    const newReqId = `req_${Date.now()}`;
    const newRequest: MovingRequest = {
      id: newReqId,
      requestCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: user.id,
      customerName: user.phone || 'Müşteri',
      customerPhone: user.phone,
      allowPhoneCall,
      serviceCategory,
      originCity,
      originDistrict,
      destinationCity,
      destinationDistrict,
      homeSize,
      movingDate,
      isDateFlexible,
      flexibleDays,
      originFloor,
      originHasElevator,
      originHasFreightElevator: false,
      originRequiresMobileElevator,
      originTruckAccess,
      destinationFloor,
      destinationHasElevator,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator,
      destinationTruckAccess,
      packagingPreference,
      extraServices,
      photos,
      notes,
      status: 'ACTIVE',
      offersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.addRequest(newRequest);
    setCreatedRequestId(newReqId);
    setIsSubmitted(true);
  };

  const originDistricts = TURKEY_CITIES.find(c => c.name === originCity)?.districts || [];
  const destDistricts = TURKEY_CITIES.find(c => c.name === destinationCity)?.districts || [];

  // Success screen
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
          Talebiniz Yayında! 🎉
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          <strong>{originCity} ({originDistrict}) → {destinationCity} ({destinationDistrict})</strong> rotasındaki onaylı nakliyat firmalarına bildirim gönderildi. İlk teklifler birkaç dakika içinde panelinize düşmeye başlayacaktır.
        </p>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 inline-flex items-center gap-3 text-xs text-[#0B3B8F] font-medium mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Canlı Teklif Takibi: 0 Teklif Alındı</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push(`/app/customer/taleplerim`)}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Taleplerimi ve Teklifleri Gör
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/')}
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Adım {step} / {totalSteps + 1}</span>
          <span className="text-[#146EF5]">
            {step === 1 && 'Hizmet Türü'}
            {step === 2 && 'Nereden / Nereye'}
            {step === 3 && 'Ev & Eşya Büyüklüğü'}
            {step === 4 && 'Taşınma Tarihi'}
            {step === 5 && 'Çıkış & Varış Katları'}
            {step === 6 && 'Paketleme & Ek Hizmetler'}
            {step === 7 && 'Fotoğraflar & Detaylar'}
            {step === 8 && 'İletişim & Arama İzni'}
            {step === 9 && 'Talebi Kontrol Edin'}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#146EF5] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-2xl shadow-lg shadow-blue-900/5 border border-slate-200 p-6 sm:p-8 animate-fade-in">
        {/* STEP 1: SERVICE TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Ne tür bir nakliyat hizmeti arıyorsunuz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                İhtiyacınıza en uygun taşıma tipini seçin.
              </p>
            </div>

            <RadioCard
              options={[
                {
                  value: 'EVDEN_EVE',
                  title: 'Evden Eve Nakliyat',
                  description: 'Ev eşyalarınızı ambalajlama ve montaj dahil güvenle taşıyın.',
                  icon: <Truck className="w-5 h-5" />
                },
                {
                  value: 'OFIS_TASIMA',
                  title: 'Ofis / İşyeri Taşıma',
                  description: 'İşyeri, dükkan veya şirket ekipmanlarının profesyonel nakliyesi.',
                  icon: <Building2 className="w-5 h-5" />
                },
                {
                  value: 'PARCA_ESYA',
                  title: 'Parça Eşya Taşımacılığı',
                  description: 'Tek parça mobilya, beyaz eşya veya birkaç koli taşıması.',
                  icon: <Package className="w-5 h-5" />
                },
                {
                  value: 'ESYA_DEPOLAMA',
                  title: 'Eşya Depolama',
                  description: 'Eşyalarınız için güvenli, temiz ve kilitli özel depolama.',
                  icon: <Warehouse className="w-5 h-5" />
                }
              ]}
              value={serviceCategory}
              onChange={(val) => setServiceCategory(val as ServiceCategory)}
              columns={2}
            />
          </div>
        )}

        {/* STEP 2: ORIGIN & DESTINATION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Nereden nereye taşınacaksınız?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Çıkış ve varış adresinizin şehir ve ilçesini belirtin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#146EF5]" />
                  Çıkış Noktası (Nereden?)
                </label>
                <div className="space-y-2">
                  <select
                    value={originCity}
                    onChange={(e) => {
                      setOriginCity(e.target.value);
                      const c = TURKEY_CITIES.find(item => item.name === e.target.value);
                      if (c && c.districts[0]) setOriginDistrict(c.districts[0]);
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white text-slate-800"
                  >
                    {TURKEY_CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={originDistrict}
                    onChange={(e) => setOriginDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
                  >
                    {originDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Varış Noktası (Nereye?)
                </label>
                <div className="space-y-2">
                  <select
                    value={destinationCity}
                    onChange={(e) => {
                      setDestCity(e.target.value);
                      const c = TURKEY_CITIES.find(item => item.name === e.target.value);
                      if (c && c.districts[0]) setDestDistrict(c.districts[0]);
                    }}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold bg-white text-slate-800"
                  >
                    {TURKEY_CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={destinationDistrict}
                    onChange={(e) => setDestDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
                  >
                    {destDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HOME SIZE */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Evinizin / Eşyanızın Büyüklüğü Nedir?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Doğru araç kapasitesi ve personel sayısı belirlenmesi için önemlidir.
              </p>
            </div>

            <RadioCard
              options={[
                { value: 'studio', title: 'Stüdyo / 1+0', description: 'Az eşyalı küçük ev veya oda' },
                { value: '1+1', title: '1+1 Ev', description: 'Standart 1 salon 1 oda eşyası' },
                { value: '2+1', title: '2+1 Ev', description: 'Orta büyüklükte ev eşyası (En yaygın)', badge: 'Popüler' },
                { value: '3+1', title: '3+1 Ev', description: 'Geniş aile evi eşyası' },
                { value: '4+1', title: '4+1 ve Üzeri', description: 'Büyük daire veya dubleks' },
                { value: 'single_item', title: 'Parça / Az Eşya', description: 'Koltuk, beyaz eşya, koli' }
              ]}
              value={homeSize}
              onChange={(val) => setHomeSize(val as string)}
              columns={3}
            />
          </div>
        )}

        {/* STEP 4: DATE & FLEXIBILITY */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Ne zaman taşınmak istiyorsunuz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Tarih esnekliği olan müşteriler daha uygun fiyatlı dönüş araçlarından faydalanabilir.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Taşınma Tarihi</label>
              <input
                type="date"
                value={movingDate}
                onChange={(e) => setMovingDate(e.target.value)}
                className="w-full sm:w-64 p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#146EF5]"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-slate-800 block">Tarihim Esnek</span>
                  <span className="text-xs text-slate-500">Nakliyeciler dönüş araçlarına göre daha ekonomik fiyatlar sunabilir.</span>
                </div>
                <input
                  type="checkbox"
                  checked={isDateFlexible}
                  onChange={(e) => setIsDateFlexible(e.target.checked)}
                  className="w-5 h-5 rounded text-[#146EF5] cursor-pointer"
                />
              </div>

              {isDateFlexible && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Esneklik:</span>
                  {[1, 3, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFlexibleDays(days)}
                      className={`px-3 py-1 text-xs rounded-lg font-bold border transition-colors ${
                        flexibleDays === days
                          ? 'bg-[#146EF5] text-white border-[#146EF5]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ±{days} Gün
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: BUILDING & ELEVATOR SPECS */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Bina Kat ve Asansör Bilgileri
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Çıkış ve varış binasındaki koşullar fiyatı doğrudan belirler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Çıkış Binası */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#146EF5]" />
                  Çıkış Binası
                </h3>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">Kaçıncı Kat?</label>
                  <select
                    value={originFloor}
                    onChange={(e) => setOriginFloor(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(f => (
                      <option key={f} value={f}>{f === 0 ? 'Giriş Kat / Zemin' : `${f}. Kat`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={originHasElevator}
                      onChange={(e) => setOriginHasElevator(e.target.checked)}
                      className="w-4 h-4 rounded text-[#146EF5]"
                    />
                    <span>Bina içi eşya taşımaya uygun asansör var</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={originRequiresMobileElevator}
                      onChange={(e) => setOriginRequiresMobileElevator(e.target.checked)}
                      className="w-4 h-4 rounded text-[#146EF5]"
                    />
                    <span>Dış cephe mobil asansörü gerekebilir</span>
                  </label>
                </div>
              </div>

              {/* Varış Binası */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Varış Binası
                </h3>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">Kaçıncı Kat?</label>
                  <select
                    value={destinationFloor}
                    onChange={(e) => setDestFloor(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(f => (
                      <option key={f} value={f}>{f === 0 ? 'Giriş Kat / Zemin' : `${f}. Kat`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={destinationHasElevator}
                      onChange={(e) => setDestHasElevator(e.target.checked)}
                      className="w-4 h-4 rounded text-[#146EF5]"
                    />
                    <span>Bina içi eşya taşımaya uygun asansör var</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={destinationRequiresMobileElevator}
                      onChange={(e) => setDestRequiresMobileElevator(e.target.checked)}
                      className="w-4 h-4 rounded text-[#146EF5]"
                    />
                    <span>Dış cephe mobil asansörü gerekebilir</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: PACKAGING & EXTRAS */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Paketleme Tercihiniz Nedir?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Eşyaların ambalajlanması konusundaki tercihinizi belirtin.
              </p>
            </div>

            <RadioCard
              options={[
                {
                  value: 'BOTH_OFFERS',
                  title: 'İkisi İçin de Teklif İstiyorum',
                  description: 'Nakliyeciler hem paketlemeli hem paketlemesiz alternatif fiyat versin.',
                  badge: 'Tavsiye Edilen'
                },
                {
                  value: 'CARRIER_PACKS',
                  title: 'Firma Paketlesin (A\'dan Z\'ye)',
                  description: 'Tüm mobilyalar, beyaz eşyalar ve ufak eşyalar firma tarafından sarılsın.'
                },
                {
                  value: 'CUSTOMER_PACKS',
                  title: 'Kendim Paketlerim',
                  description: 'Ufak eşyaları kolilerim, firma sadece kaba mobilyaları taşısın.'
                }
              ]}
              value={packagingPreference}
              onChange={(val) => setPackagingPreference(val as any)}
              columns={1}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Ek Hizmetler</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'disassembly_assembly', label: 'Mobilya Sökme & Montaj (Marangoz)' },
                  { id: 'white_goods_connection', label: 'Beyaz Eşya Tesisat Bağlantısı' },
                  { id: 'insured', label: 'Emtia Nakliyat Sigortası' },
                  { id: 'storage', label: 'Geçici Eşya Depolama' }
                ].map((extra) => (
                  <label
                    key={extra.id}
                    className={`p-3 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      extraServices.includes(extra.id)
                        ? 'border-[#146EF5] bg-blue-50/50 text-[#0B3B8F] font-semibold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={extraServices.includes(extra.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setExtraServices([...extraServices, extra.id]);
                        } else {
                          setExtraServices(extraServices.filter(id => id !== extra.id));
                        }
                      }}
                      className="w-4 h-4 rounded text-[#146EF5]"
                    />
                    <span>{extra.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PHOTOS & NOTES */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Fotoğraf ve Özel Detaylar (Opsiyonel)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Eşyalarınızın fotoğrafını eklemek firmalardan çok daha kesin ve net fiyat teklifleri almanızı sağlar.
              </p>
            </div>

            <FileUploader
              label="Eşya Fotoğrafları"
              description="Salon, oda veya kaba mobilyaların fotoğraflarını yükleyin."
              maxFiles={6}
              files={photos}
              onChange={setPhotos}
              mode="photos"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nakliyecilerin Bilmesi Gereken Ek Açıklama
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Buzdolabı, çamaşır makinesi, 1 salon takımı ve yaklaşık 20 koli eşyamız var. Bina girişi düz ayaktır..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#146EF5] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: PHONE CALL PERMISSION */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Firmalar Sizinle Nasıl İletişim Kursun?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Gizliliğinize önem veriyoruz. İletişim tercihlerinizi siz belirlersiniz.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-blue-200 bg-[#EAF3FF]/40 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#146EF5] text-white shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Teklif Veren Firmalar Beni Telefonla Arayabilsin
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Açarsanız cep telefon numaranız yalnızca teklif veren ve belgeleri onaylanmış yetkili nakliyecilere gösterilir.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={allowPhoneCall}
                  onChange={(e) => setAllowPhoneCall(e.target.checked)}
                  className="w-6 h-6 rounded text-[#146EF5] cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Telefon iznini kapatsanız dahi firmalarla platform içi güvenli mesajlaşma üzerinden dilediğiniz gibi yazışabilir ve teklif alabilirsiniz.
              </span>
            </div>
          </div>
        )}

        {/* STEP 9: SUMMARY & REVIEW */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Talebinizi Kontrol Edin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Bilgilerinizi gözden geçirin ve tek tıkla bölgenizdeki firmalara ulaştırın.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Rota:</span>
                  <RouteDisplay
                    originCity={originCity}
                    originDistrict={originDistrict}
                    destinationCity={destinationCity}
                    destinationDistrict={destinationDistrict}
                    size="sm"
                  />
                </div>
                <button onClick={() => setStep(2)} className="text-[#146EF5] font-bold hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Eşya & Tarih:</span>
                  <span className="font-semibold text-slate-800">{homeSize} • {movingDate} ({isDateFlexible ? `±${flexibleDays} gün esnek` : 'Kesin Tarih'})</span>
                </div>
                <button onClick={() => setStep(3)} className="text-[#146EF5] font-bold hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Kat ve Asansör:</span>
                  <span className="font-semibold text-slate-800">Çıkış: {originFloor}. Kat • Varış: {destinationFloor}. Kat</span>
                </div>
                <button onClick={() => setStep(5)} className="text-[#146EF5] font-bold hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Paketleme:</span>
                  <span className="font-semibold text-slate-800">
                    {packagingPreference === 'BOTH_OFFERS' ? 'İkisi İçin de Teklif İstiyorum' : packagingPreference === 'CARRIER_PACKS' ? 'Firma Paketlesin' : 'Kendim Paketlerim'}
                  </span>
                </div>
                <button onClick={() => setStep(6)} className="text-[#146EF5] font-bold hover:underline">Düzenle</button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Önemli Bilgilendirme:</strong> Nakliyat ücreti platform üzerinden tahsil edilmez. Anlaştığınız firmaya taşıma gününde doğrudan ödeme yaparsınız.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Geri
            </Button>
          ) : (
            <div />
          )}

          {step < 9 ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Devam Et
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handlePublish}
              rightIcon={<Sparkles className="w-4 h-4" />}
            >
              Talebi Yayınla 🎉
            </Button>
          )}
        </div>
      </div>

      {/* Guest Authentication Modal on Step 9 Publish */}
      <IntentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        targetRole="CUSTOMER"
        title="Talebinizi Yayınlamak İçin Hesabınızı Oluşturun"
        subtitle="Doldurduğunuz tüm taşınma bilgileri korunacak ve talebiniz anında doğrulanmış nakliyecilere iletilecektir."
        onSuccess={() => {
          setAuthModalOpen(false);
          handlePublish();
        }}
      />
    </div>
  );
}

export default function RequestWizardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Yükleniyor...</div>}>
      <RequestWizardContent />
    </Suspense>
  );
}
