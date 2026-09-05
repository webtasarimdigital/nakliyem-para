'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  UserCheck, 
  MapPin, 
  Truck, 
  UploadCloud, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/ui/FileUploader';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { CarrierProfile } from '@/types';

export default function CarrierOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Account
  const [phone, setPhone] = useState('0530 456 78 90');
  const [email, setEmail] = useState('info@marmaralider.com');

  // Step 2: Company
  const [companyName, setCompanyName] = useState('Marmara Lider Nakliyat');
  const [authorizedName, setAuthorizedName] = useState('Mehmet');
  const [authorizedSurname, setAuthorizedSurname] = useState('Arslan');
  const [shortBio, setShortBio] = useState('Bursa ve Marmara genelinde güvenilir ev & ofis taşımacılığı.');

  // Step 3: Identity (Private)
  const [tcKimlik, setTcKimlik] = useState('12345678901');
  const [birthDate, setBirthDate] = useState('1985-05-12');

  // Step 4: Address
  const [city, setCity] = useState('Bursa');
  const [district, setDistrict] = useState('Nilüfer');

  // Step 5: Services
  const [services, setServices] = useState<string[]>(['evden-eve', 'ofis-tasima', 'sehirler-arasi']);
  const [hasMobileElevator, setHasMobileElevator] = useState(false);
  const [maxElevatorFloor, setMaxElevatorFloor] = useState(12);

  // Step 6: Service Areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(['Bursa', 'İstanbul', 'Yalova', 'Balıkesir']);

  // Step 7: Documents
  const [taxCertFiles, setTaxCertFiles] = useState<string[]>(['/mock-files/vergi_levhasi.pdf']);
  const [identityFiles, setIdentityFiles] = useState<string[]>(['/mock-files/kimlik.jpg']);

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const newCarrier: CarrierProfile = {
      id: `carr_${Date.now()}`,
      userId: `user_carr_${Date.now()}`,
      companyName,
      slug: companyName.toLowerCase().replace(/\s+/g, '-'),
      authorizedPersonName: authorizedName,
      authorizedPersonSurname: authorizedSurname,
      nationalIdNumber: tcKimlik,
      birthDate,
      phone,
      email,
      shortBio,
      city,
      district,
      services,
      serviceAreas,
      verificationStatus: 'PENDING',
      verificationBadges: {
        identityVerified: false,
        taxVerified: false,
        transportPermitVerified: false,
        elevatorVerified: false
      },
      elevatorSpec: hasMobileElevator ? {
        hasElevator: true,
        maxFloor: maxElevatorFloor,
        isVerified: false
      } : undefined,
      planId: 'plan_starter',
      rating: 0,
      reviewCount: 0,
      completedJobsCount: 0,
      responseRatePercent: 100,
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    db.addCarrier(newCarrier);
    db.switchPersona('CARRIER');
    router.push('/app/carrier/onay-bekleniyor');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Step Header */}
      <div className="mb-8">
        <span className="text-xs font-bold text-[#146EF5] uppercase tracking-wider block mb-1">
          Nakliyeci Firma Onboarding
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
          Firmanızı Kaydedin & Büyütün
        </h1>

        {/* Progress pills */}
        <div className="grid grid-cols-6 gap-2 mt-6">
          {[
            { id: 1, label: 'Hesap' },
            { id: 2, label: 'Firma' },
            { id: 3, label: 'Kimlik' },
            { id: 4, label: 'Hizmetler' },
            { id: 5, label: 'Bölgeler' },
            { id: 6, label: 'Belgeler' }
          ].map((s) => (
            <div
              key={s.id}
              className={`h-1.5 rounded-full transition-colors ${
                step >= s.id ? 'bg-[#146EF5]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* STEP 1: ACCOUNT */}
        {step === 1 && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-[#0A1128]">1. İletişim & Giriş Bilgileri</h2>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firma Telefon Numarası (Giriş için)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kurumsal E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>
        )}

        {/* STEP 2: COMPANY */}
        {step === 2 && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-[#0A1128]">2. Firma ve Yetkili Bilgileri</h2>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firma Ticari Unvanı / Marka Adı</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Yetkili Adı</label>
                <input
                  type="text"
                  value={authorizedName}
                  onChange={(e) => setAuthorizedName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Yetkili Soyadı</label>
                <input
                  type="text"
                  value={authorizedSurname}
                  onChange={(e) => setAuthorizedSurname(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kısa Tanıtım Yazısı</label>
              <textarea
                rows={2}
                value={shortBio}
                onChange={(e) => setShortBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        )}

        {/* STEP 3: IDENTITY (PRIVATE) */}
        {step === 3 && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-[#0A1128]">3. Yetkili Kimlik Doğrulama</h2>
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-slate-600">
              🔒 Bu bilgiler asla müşterilere veya arama motorlarına açık olarak gösterilmez; yalnızca firma doğrulaması için kullanılır.
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">TC Kimlik Numarası</label>
              <input
                type="text"
                maxLength={11}
                value={tcKimlik}
                onChange={(e) => setTcKimlik(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Doğum Tarihi</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>
        )}

        {/* STEP 4: SERVICES & ELEVATOR */}
        {step === 4 && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-[#0A1128]">4. Sunduğunuz Nakliyat Hizmetleri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { id: 'evden-eve', label: 'Evden Eve Nakliyat' },
                { id: 'sehirler-arasi', label: 'Şehirler Arası Nakliyat' },
                { id: 'ofis-tasima', label: 'Ofis ve İşyeri Taşıma' },
                { id: 'parca-esya', label: 'Parça Eşya Taşımacılığı' },
                { id: 'depolama', label: 'Eşya Depolama Hizmeti' }
              ].map(s => (
                <label key={s.id} className="p-3 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={services.includes(s.id)}
                    onChange={(e) => {
                      if (e.target.checked) setServices([...services, s.id]);
                      else setServices(services.filter(item => item !== s.id));
                    }}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span className="font-semibold text-slate-800">{s.label}</span>
                </label>
              ))}
            </div>

            {/* Mobile Elevator Spec (Spec Item 12) */}
            <div className="p-4 rounded-xl border-2 border-blue-200 bg-[#EAF3FF]/40 space-y-3 mt-4">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0A1128]">
                <input
                  type="checkbox"
                  checked={hasMobileElevator}
                  onChange={(e) => setHasMobileElevator(e.target.checked)}
                  className="w-5 h-5 text-[#146EF5]"
                />
                <span>Kendi bünyemizde Mobil Asansör Hizmeti Veriyoruz</span>
              </label>

              {hasMobileElevator && (
                <div className="pt-2 text-xs">
                  <label className="block text-slate-700 font-semibold mb-1">Maksimum Çıkabildiği Kat</label>
                  <input
                    type="number"
                    value={maxElevatorFloor}
                    onChange={(e) => setMaxElevatorFloor(Number(e.target.value))}
                    className="w-32 p-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: SERVICE AREAS */}
        {step === 5 && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h2 className="text-lg font-bold text-[#0A1128]">5. Hizmet Verdiğiniz Şehirler</h2>
            <p className="text-xs text-slate-500">
              Bu illerde açılan müşteri talepleri otomatik olarak panelinize düşer.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border border-slate-200 rounded-xl">
              {TURKEY_CITIES.map(c => (
                <label key={c.id} className="flex items-center gap-2 text-xs p-1.5 hover:bg-slate-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceAreas.includes(c.name)}
                    onChange={(e) => {
                      if (e.target.checked) setServiceAreas([...serviceAreas, c.name]);
                      else setServiceAreas(serviceAreas.filter(item => item !== c.name));
                    }}
                    className="w-4 h-4 text-[#146EF5]"
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: DOCUMENTS UPLOAD */}
        {step === 6 && (
          <div className="space-y-6 text-xs sm:text-sm">
            <div>
              <h2 className="text-lg font-bold text-[#0A1128]">6. Doğrulama Belgeleri Yükleme</h2>
              <p className="text-xs text-slate-500 mt-1">
                Zorunlu belgeleriniz yönetici ekibimizce onaylandıktan sonra 7 günlük ücretsiz denemeniz başlar.
              </p>
            </div>

            <div className="space-y-4">
              <FileUploader
                label="Vergi Levhası (Zorunlu)"
                description="Güncel şirket vergi levhanızın PDF veya fotoğrafı"
                maxFiles={1}
                files={taxCertFiles}
                onChange={setTaxCertFiles}
                mode="document"
              />

              <FileUploader
                label="Yetkili Kimlik Belgesi (Zorunlu)"
                description="Firma yetkilisinin ön yüz kimlik belgesi"
                maxFiles={1}
                files={identityFiles}
                onChange={setIdentityFiles}
                mode="document"
              />
            </div>
          </div>
        )}

        {/* Stepper Navigation */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(step - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Geri
            </Button>
          ) : <div />}

          {step < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => setStep(step + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Devam Et
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleComplete}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Başvuruyu Tamamla & Gönder
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
