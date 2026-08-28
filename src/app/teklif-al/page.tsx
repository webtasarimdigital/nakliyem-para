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
  CheckCircle2,
  Video,
  Layers,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { RadioCard } from '@/components/ui/RadioCard';
import { FileUploader } from '@/components/ui/FileUploader';
import { IntentAuthModal } from '@/components/ui/IntentAuthModal';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { MovingRequest, ServiceCategory } from '@/types';

// Room item checklist definitions
const ROOM_ITEMS: Record<string, string[]> = {
  'Salon': ['Koltuk Takımı (3+3+1)', 'TV Ünitesi & Sehpa', 'Yemek Masası & Sandalyeler', 'Büyük Kitaplık / Vitrin', 'Piyano / Özel Eşya'],
  'Yatak Odası': ['Çift Kişilik Baza / Yatak', '6 Kapılı Gardırop (Demonte)', 'Şifonyer & Aynalık', '2 Adet Komodin'],
  'Mutfak': ['Buzdolabı', 'Bulaşık Makinesi', 'Fırın / Ocak', 'Mutfak Masası & 4 Sandalye', 'Kırılacak Koli Sayısı (~10+)'],
  'Çocuk / Çalışma Odası': ['Tek Kişilik Yatak', 'Çalışma Masası & Koltuk', '3 Kapılı Dolap', 'Kitaplık'],
  'Balkon & Diğer': ['Çamaşır Makinesi', 'Kurutma Makinesi', 'Balkon Mobilyası / Salıncak', 'Bisiklet / Spor Aleti']
};

function RequestWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Room item checklist state
  const [showDetailedItems, setShowDetailedItems] = useState(false);
  const [selectedRoomItems, setSelectedRoomItems] = useState<Record<string, string[]>>({});
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newCustomItem, setNewCustomItem] = useState('');

  const [photos, setPhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [allowPhoneCall, setAllowPhoneCall] = useState(true);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync with searchParams
  useEffect(() => {
    if (searchParams?.get('originCity')) setOriginCity(searchParams.get('originCity')!);
    if (searchParams?.get('destCity')) setDestCity(searchParams.get('destCity')!);
    if (searchParams?.get('size')) setHomeSize(searchParams.get('size')!);
  }, [searchParams]);

  const originDistricts = TURKEY_CITIES.find(c => c.name === originCity)?.districts || [];
  const destDistricts = TURKEY_CITIES.find(c => c.name === destinationCity)?.districts || [];

  const toggleRoomItem = (room: string, item: string) => {
    setSelectedRoomItems(prev => {
      const current = prev[room] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [room]: updated };
    });
  };

  const handleAddCustomItem = () => {
    if (!newCustomItem.trim()) return;
    setCustomItems(prev => [...prev, newCustomItem.trim()]);
    setNewCustomItem('');
  };

  const handleRemoveCustomItem = (idx: number) => {
    setCustomItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, totalSteps + 1));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublish = () => {
    const user = db.getCurrentUser();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    // Compile items description into notes if room checklist was used
    let compiledNotes = notes;
    const roomKeys = Object.keys(selectedRoomItems);
    const hasRoomSelections = roomKeys.some(r => selectedRoomItems[r]?.length > 0) || customItems.length > 0;

    if (hasRoomSelections) {
      const roomSummary = roomKeys
        .filter(r => selectedRoomItems[r]?.length > 0)
        .map(r => `[${r}]: ${selectedRoomItems[r].join(', ')}`)
        .join(' | ');
      const customSummary = customItems.length > 0 ? ` [Özel Eşyalar]: ${customItems.join(', ')}` : '';
      compiledNotes = compiledNotes ? `${compiledNotes}\n\nEşya Listesi: ${roomSummary}${customSummary}` : `Eşya Listesi: ${roomSummary}${customSummary}`;
    }

    const newRequest: MovingRequest = {
      id: `req_${Date.now()}`,
      requestCode: `#${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: user.id || 'cust_demo',
      customerName: 'Ahmet Yılmaz',
      customerPhone: user.phone || '0532 111 22 33',
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
      notes: compiledNotes,
      status: 'ACTIVE',
      offersCount: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.addRequest(newRequest);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-3">
          Talebiniz Başarıyla Yayınlandı! 🎉
        </h1>

        <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
          Talebiniz bölgenizdeki yetki belgeli nakliyecilere iletildi. Firmalar detayları inceleyip tekliflerini oluşturmaya başladı.
        </p>

        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 inline-flex items-center gap-3 text-xs text-orange-950 font-bold mb-8">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] animate-pulse" />
          <span>Canlı Teklif Bildirimi: Teklifler geldikçe SMS ve panelden bilgilendirileceksiniz.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            className="font-black w-full sm:w-auto shadow-lg shadow-orange-900/15"
            onClick={() => router.push('/app/customer/teklifler')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Gelen Teklifleri İncele
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="font-bold w-full sm:w-auto"
            onClick={() => router.push('/app/customer')}
          >
            Taşınma Merkezime Git
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 mb-2">
          <span>Adım {step} / {totalSteps + 1}</span>
          <span className="text-[#F95700]">
            {step === 1 && 'Hizmet Türü'}
            {step === 2 && 'Nereden / Nereye'}
            {step === 3 && 'Ev & Eşya Büyüklüğü'}
            {step === 4 && 'Taşınma Tarihi'}
            {step === 5 && 'Bina & Kat Bilgileri'}
            {step === 6 && 'Paketleme & Ek Hizmetler'}
            {step === 7 && 'Fotoğraflar & Video Ekspertiz'}
            {step === 8 && 'İletişim & Gizlilik'}
            {step === 9 && 'Talebi Onayla & Yayınla'}
          </span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#F95700] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 animate-fade-in">
        
        {/* STEP 1: SERVICE TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Ne tür bir nakliyat hizmeti arıyorsunuz?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                İhtiyacınıza en uygun taşıma tipini seçin.
              </p>
            </div>

            <RadioCard
              options={[
                {
                  value: 'EVDEN_EVE',
                  title: 'Evden Eve Nakliyat',
                  description: 'Ev eşyalarınızı ambalajlama, asansör ve montaj dahil güvenle taşıyın.',
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
                  description: 'Tek parça mobilya, beyaz eşya veya birkaç koli parça yük taşıması.',
                  icon: <Package className="w-5 h-5" />
                },
                {
                  value: 'ESYA_DEPOLAMA',
                  title: 'Eşya Depolama',
                  description: 'Eşyalarınız için güvenli, temiz, nem kontrolü olan kilitli depo odaları.',
                  icon: <Warehouse className="w-5 h-5" />
                }
              ]}
              value={serviceCategory}
              onChange={(val) => setServiceCategory(val as ServiceCategory)}
              columns={2}
            />
          </div>
        )}

        {/* STEP 2: ROUTE */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Nereden nereye taşınacaksınız?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Şehirlerarası veya şehir içi mesafe nakliye teklifini doğrudan belirler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Origin */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />
                  Çıkış Adresi (Nereden)
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">İl</label>
                  <select
                    value={originCity}
                    onChange={(e) => {
                      setOriginCity(e.target.value);
                      const d = TURKEY_CITIES.find(c => c.name === e.target.value)?.districts;
                      if (d && d.length > 0) setOriginDistrict(d[0]);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">İlçe</label>
                  <select
                    value={originDistrict}
                    onChange={(e) => setOriginDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {originDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Destination */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 space-y-3 bg-slate-50/50">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Varış Adresi (Nereye)
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">İl</label>
                  <select
                    value={destinationCity}
                    onChange={(e) => {
                      setDestCity(e.target.value);
                      const d = TURKEY_CITIES.find(c => c.name === e.target.value)?.districts;
                      if (d && d.length > 0) setDestDistrict(d[0]);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {TURKEY_CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">İlçe</label>
                  <select
                    value={destinationDistrict}
                    onChange={(e) => setDestDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {destDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HOME SIZE & OPTIONAL ROOM CHECKLIST (Prompt 235) */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Taşınacak Ev &amp; Eşya Büyüklüğü
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Eşya hacmi, nakliyecinin tahsis edeceği kamyon boyutunu ve personel sayısını belirler.
              </p>
            </div>

            <RadioCard
              options={[
                { value: '1+0', title: '1+0 / Stüdyo', description: 'Küçük kamyonet yeterli (1-2 personel)' },
                { value: '1+1', title: '1+1 Daire', description: 'Orta boy kapalı kasa araç (2-3 personel)' },
                { value: '2+1', title: '2+1 Daire', description: 'Standart nakliye kamyonu (3-4 personel)', badge: 'En Yaygın' },
                { value: '3+1', title: '3+1 Daire', description: 'Büyük boy kapalı kasa nakliye kamyonu (4-5 personel)' },
                { value: '4+1+', title: '4+1 ve Üzeri / Villa', description: 'Ekstra büyük TIR veya 2 araç (5+ personel)' },
                { value: 'single_item', title: 'Parça Eşya / Koli', description: 'Tekil mobilya veya birkaç koli' }
              ]}
              value={homeSize}
              onChange={(val) => setHomeSize(val)}
              columns={2}
            />

            {/* Optional Room-by-Room Checklist Toggle (Prompt 235) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetailedItems(!showDetailedItems)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#F95700] transition-colors cursor-pointer bg-slate-50/50"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Layers className="w-5 h-5 text-[#F95700]" />
                  <div>
                    <p className="text-sm font-black text-[#0A1128]">Eşyalarımı Oda Oda Detaylı Eklemek İstiyorum (Opsiyonel)</p>
                    <p className="text-xs text-slate-500 font-medium">Teklif doğruluğunu artırır, sürpriz ek ücretleri önler.</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#F95700]">
                  {showDetailedItems ? 'Gizle ▲' : 'Eşya Seç ▼'}
                </span>
              </button>

              {showDetailedItems && (
                <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 animate-fade-in">
                  {Object.entries(ROOM_ITEMS).map(([room, items]) => (
                    <div key={room} className="space-y-2">
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">{room}</h4>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => {
                          const isSelected = selectedRoomItems[room]?.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleRoomItem(room, item)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#F95700] text-white shadow-xs'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Custom Items Add */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Özel / Listede Olmayan Eşya Ekle</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCustomItem}
                        onChange={e => setNewCustomItem(e.target.value)}
                        placeholder="Örn: Koşu bandı, akvaryum, mermer masa..."
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:border-[#F95700] focus:outline-none"
                      />
                      <Button
                        type="button"
                        variant="navy"
                        size="sm"
                        className="font-black text-xs px-4"
                        onClick={handleAddCustomItem}
                      >
                        Ekle
                      </Button>
                    </div>
                    {customItems.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {customItems.map((ci, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-xs font-bold bg-orange-100 text-orange-950 px-2.5 py-1 rounded-lg">
                            {ci}
                            <Trash2 className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => handleRemoveCustomItem(idx)} />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: MOVING DATE */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Taşınma Tarihiniz Ne Zaman?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Tarih esnekliği olan talepler nakliyecilerin boş araçlarıyla eşleşerek daha uygun fiyat avantajı sağlar.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Hedef Taşınma Tarihi
                </label>
                <input
                  type="date"
                  value={movingDate}
                  onChange={(e) => setMovingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDateFlexible}
                    onChange={(e) => setIsDateFlexible(e.target.checked)}
                    className="w-4 h-4 accent-[#F95700] rounded"
                  />
                  <div>
                    <span className="text-sm font-black text-[#0A1128] block">Tarihim ± birkaç gün esneyebilir</span>
                    <span className="text-xs text-slate-500 font-medium">Boş dönüş yapan nakliyecilerden ekstra indirimli teklifler alabilirsiniz.</span>
                  </div>
                </label>
              </div>

              {isDateFlexible && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">Esneklik Aralığı:</span>
                  {[1, 3, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFlexibleDays(days)}
                      className={`px-3 py-1 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                        flexibleDays === days
                          ? 'bg-[#F95700] text-white border-[#F95700] shadow-xs'
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
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Bina Kat ve Asansör Bilgileri
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Çıkış ve varış binasındaki asansör ve kat koşulları fiyatı doğrudan belirler.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Çıkış Binası */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />
                  Çıkış Binası
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Kaçıncı Kat?</label>
                  <select
                    value={originFloor}
                    onChange={(e) => setOriginFloor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(f => (
                      <option key={f} value={f}>{f === 0 ? 'Giriş Kat / Zemin' : `${f}. Kat`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={originHasElevator}
                      onChange={(e) => setOriginHasElevator(e.target.checked)}
                      className="w-4 h-4 accent-[#F95700] rounded"
                    />
                    <span>Bina içi eşya taşımaya uygun asansör var</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={originRequiresMobileElevator}
                      onChange={(e) => setOriginRequiresMobileElevator(e.target.checked)}
                      className="w-4 h-4 accent-[#F95700] rounded"
                    />
                    <span>Dış cephe mobil asansörü gerekebilir</span>
                  </label>
                </div>
              </div>

              {/* Varış Binası */}
              <div className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Varış Binası
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Kaçıncı Kat?</label>
                  <select
                    value={destinationFloor}
                    onChange={(e) => setDestFloor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-[#F95700] focus:outline-none"
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(f => (
                      <option key={f} value={f}>{f === 0 ? 'Giriş Kat / Zemin' : `${f}. Kat`}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={destinationHasElevator}
                      onChange={(e) => setDestHasElevator(e.target.checked)}
                      className="w-4 h-4 accent-[#F95700] rounded"
                    />
                    <span>Bina içi eşya taşımaya uygun asansör var</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={destinationRequiresMobileElevator}
                      onChange={(e) => setDestRequiresMobileElevator(e.target.checked)}
                      className="w-4 h-4 accent-[#F95700] rounded"
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
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Paketleme ve Ek Hizmet Tercihiniz
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Eşyaların ambalajlanması ve marangozluk konusundaki tercihinizi belirleyin.
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
                  description: 'Tüm mobilyalar, beyaz eşyalar ve ufak eşyalar firma tarafından patpat naylon ile sarılsın.'
                },
                {
                  value: 'CUSTOMER_PACKS',
                  title: 'Kendim Paketlerim',
                  description: 'Ufak eşyaları kendim kolilerim, firma sadece kaba mobilya ve beyaz eşyaları taşısın.'
                }
              ]}
              value={packagingPreference}
              onChange={(val) => setPackagingPreference(val as any)}
              columns={1}
            />

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Ek Hizmetler</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'disassembly_assembly', label: 'Mobilya Sökme & Montaj (Marangoz)' },
                  { id: 'white_goods_connection', label: 'Beyaz Eşya Tesisat Bağlantısı' },
                  { id: 'insured', label: 'Emtia Nakliyat Sigortası' },
                  { id: 'storage', label: 'Geçici Eşya Depolama' }
                ].map((extra) => (
                  <label
                    key={extra.id}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 cursor-pointer transition-all ${
                      extraServices.includes(extra.id)
                        ? 'border-[#F95700] bg-orange-50/50 text-[#C23E00] font-black'
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
                      className="w-4 h-4 accent-[#F95700] rounded"
                    />
                    <span>{extra.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PHOTOS & VIDEO EKSPERTİZ (Prompt 234) */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Fotoğraf &amp; Video Ekspertiz (Opsiyonel)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Eşyalarınızı veya odalarınızı kısaca gösteren fotoğraflar eklemek net ve sürprizsiz teklif almanızı sağlar.
              </p>
            </div>

            {/* Video Ekspertiz Teaser Box (Prompt 234) */}
            <div className="p-4 rounded-2xl bg-[#0A1128] text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F95700] flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-white">Evinizi Kısaca Gösterin</p>
                <p className="text-xs text-slate-300 font-medium">Salon, merdiven ve bina girişini çekip yükleyerek görüntülü teklif alabilirsiniz.</p>
              </div>
            </div>

            <FileUploader
              label="Eşya / Oda Fotoğrafları"
              description="Salon, oda veya kaba mobilyaların fotoğraflarını yükleyin."
              maxFiles={6}
              files={photos}
              onChange={setPhotos}
              mode="photos"
            />

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Nakliyecilere Ek Açıklama Notu
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Buzdolabı, çamaşır makinesi, 1 salon takımı ve yaklaşık 20 koli eşyamız var. Bina girişi düz ayaktır..."
                className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium focus:border-[#F95700] focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 8: PRIVACY & PHONE PERMISSION */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                İletişim &amp; Gizlilik Tercihiniz
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Telefon numaranız spam çağrılara karşı gizlenir. Yalnızca onaylı nakliyecilere izin verebilirsiniz.
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-orange-200 bg-orange-50/40 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#F95700] text-white shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0A1128]">
                      Teklif Veren Onaylı Firmalar Beni Telefonla Arayabilsin
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      Açarsanız cep telefon numaranız yalnızca belgeleri onaylanmış yetkili nakliyecilere gösterilir.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={allowPhoneCall}
                  onChange={(e) => setAllowPhoneCall(e.target.checked)}
                  className="w-6 h-6 accent-[#F95700] rounded cursor-pointer mt-1"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Telefon iznini kapatsanız dahi firmalarla platform içi güvenli mesajlaşma üzerinden dilediğiniz gibi yazışabilir ve teklif alabilirsiniz.
              </span>
            </div>
          </div>
        )}

        {/* STEP 9: REVIEW & PUBLISH */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A1128]">
                Talebinizi Gözden Geçirin
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Bilgilerinizi kontrol edin ve tek tıkla onaylı firmalara ulaştırın.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden">
              <div className="p-4 flex items-center justify-between bg-slate-50/50">
                <div>
                  <span className="text-slate-400 font-black uppercase text-[10px] block mb-1">Rota</span>
                  <RouteDisplay
                    originCity={originCity}
                    originDistrict={originDistrict}
                    destinationCity={destinationCity}
                    destinationDistrict={destinationDistrict}
                    size="sm"
                  />
                </div>
                <button onClick={() => setStep(2)} className="text-[#F95700] font-black hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-black uppercase text-[10px] block mb-1">Eşya &amp; Tarih</span>
                  <span className="font-bold text-slate-800 text-sm">{homeSize} • {movingDate} ({isDateFlexible ? `±${flexibleDays} gün esnek` : 'Kesin Tarih'})</span>
                </div>
                <button onClick={() => setStep(3)} className="text-[#F95700] font-black hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-black uppercase text-[10px] block mb-1">Kat ve Asansör</span>
                  <span className="font-bold text-slate-800">Çıkış: {originFloor}. Kat • Varış: {destinationFloor}. Kat</span>
                </div>
                <button onClick={() => setStep(5)} className="text-[#F95700] font-black hover:underline">Düzenle</button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 font-black uppercase text-[10px] block mb-1">Paketleme</span>
                  <span className="font-bold text-slate-800">
                    {packagingPreference === 'BOTH_OFFERS' ? 'İkisi İçin de Teklif İstiyorum' : packagingPreference === 'CARRIER_PACKS' ? 'Firma Paketlesin' : 'Kendim Paketlerim'}
                  </span>
                </div>
                <button onClick={() => setStep(6)} className="text-[#F95700] font-black hover:underline">Düzenle</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 font-medium">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Önemli Bilgilendirme:</strong> Müşteri için talep açmak ve teklifleri karşılaştırmak %100 ücretsizdir. Anlaştığınız firmaya doğrudan taşıma günü ödeme yaparsınız.
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
              className="font-bold"
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
              className="font-black shadow-md"
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
              className="font-black shadow-lg shadow-orange-900/15 px-8"
            >
              Talebi Ücretsiz Yayınla 🚀
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
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <RequestWizardContent />
    </Suspense>
  );
}
