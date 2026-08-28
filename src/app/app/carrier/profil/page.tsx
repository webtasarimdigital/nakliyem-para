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
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
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

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SERVICES' | 'ELEVATOR' | 'CONTACT'>('GENERAL');
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

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-black mb-6 flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600" /> Değişiklikleriniz başarıyla kaydedildi ve kamuya açık profilinize yansıtıldı.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'GENERAL', label: 'Genel & Tanıtım' },
          { id: 'SERVICES', label: 'Hizmetler & Şehirler' },
          { id: 'ELEVATOR', label: 'Mobil Asansör' },
          { id: 'CONTACT', label: 'İletişim & Adres' },
        ].map(t => (
          <button
            key={t.id}
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
