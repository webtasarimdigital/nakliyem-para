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
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FileUploader } from '@/components/ui/FileUploader';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { CarrierProfile } from '@/types';
import { validateTCKimlik } from '@/lib/validation/tckn';

export default function CarrierOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const currentUser = typeof window !== 'undefined' ? db.getCurrentUser() : null;
  const existingCarrier = currentUser ? db.getCarriers().find(c => c.userId === currentUser.id || c.id === currentUser.carrierProfileId) : null;

  // Step 1: Account
  const [phone, setPhone] = useState(currentUser?.phone || existingCarrier?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || existingCarrier?.email || '');

  // Step 2: Company
  const [companyName, setCompanyName] = useState(currentUser?.companyName || existingCarrier?.companyName || '');
  const [authorizedName, setAuthorizedName] = useState(existingCarrier?.authorizedPersonName || '');
  const [authorizedSurname, setAuthorizedSurname] = useState(existingCarrier?.authorizedPersonSurname || '');
  const [shortBio, setShortBio] = useState(existingCarrier?.shortBio || '');

  // Step 3: Identity (Private)
  const [tcKimlik, setTcKimlik] = useState(existingCarrier?.nationalIdNumber || '');
  const [birthDate, setBirthDate] = useState(existingCarrier?.birthDate || '');

  // Step 4: Address
  const [city, setCity] = useState(existingCarrier?.city || 'İstanbul');
  const [district, setDistrict] = useState(existingCarrier?.district || '');

  // Step 5: Services
  const [services, setServices] = useState<string[]>(existingCarrier?.services || ['evden-eve']);
  const [hasMobileElevator, setHasMobileElevator] = useState(existingCarrier?.elevatorSpec?.hasElevator || false);
  const [maxElevatorFloor, setMaxElevatorFloor] = useState(existingCarrier?.elevatorSpec?.maxFloor || 12);

  // Step 6: Service Areas
  const [serviceAreas, setServiceAreas] = useState<string[]>(existingCarrier?.serviceAreas || ['TÜM_TÜRKİYE']);

  // Step 7: Documents - Boş başlar, fake dolu gelmez
  const [taxCertFiles, setTaxCertFiles] = useState<string[]>([]);
  const [identityFiles, setIdentityFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNextStep = () => {
    setErrorMessage('');

    if (step === 1) {
      const cleanPhone = phone.trim().replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setErrorMessage('Lütfen geçerli bir cep telefonu numarası giriniz (En az 10 hane).');
        return;
      }
    }

    if (step === 2) {
      if (!companyName.trim()) {
        setErrorMessage('Lütfen firma ticari unvanınızı giriniz.');
        return;
      }
    }

    if (step === 3) {
      const tcResult = validateTCKimlik(tcKimlik);
      if (!tcResult.isValid) {
        setErrorMessage(tcResult.error || 'Lütfen geçerli bir TC Kimlik Numarası giriniz.');
        return;
      }
      if (!birthDate) {
        setErrorMessage('Lütfen yetkili doğum tarihini giriniz.');
        return;
      }
    }

    if (step === 4) {
      if (services.length === 0) {
        setErrorMessage('Lütfen sunduğunuz nakliyat hizmetlerinden en az birini seçiniz.');
        return;
      }
    }

    if (step === 5) {
      if (serviceAreas.length === 0) {
        setErrorMessage('Lütfen hizmet verdiğiniz en az bir ili seçiniz.');
        return;
      }
    }

    setStep(step + 1);
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!companyName.trim()) {
      setStep(2);
      setErrorMessage('Lütfen firma ticari unvanınızı giriniz.');
      return;
    }

    const tcResult = validateTCKimlik(tcKimlik);
    if (!tcResult.isValid) {
      setStep(3);
      setErrorMessage(tcResult.error || 'Lütfen geçerli bir TC Kimlik Numarası giriniz.');
      return;
    }

    const carrierId = existingCarrier?.id || currentUser?.carrierProfileId || `carr_${Date.now()}`;
    const userId = currentUser?.id || `user_carr_${Date.now()}`;
    const hasBothDocs = taxCertFiles.length > 0 && identityFiles.length > 0;

    const newCarrier: CarrierProfile = {
      id: carrierId,
      userId: userId,
      companyName: companyName.trim(),
      slug: companyName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      authorizedPersonName: authorizedName.trim() || 'Yetkili',
      authorizedPersonSurname: authorizedSurname.trim(),
      nationalIdNumber: tcKimlik.trim(),
      birthDate,
      phone: phone.trim(),
      email: email.trim(),
      shortBio: shortBio.trim() || `${companyName} profesyonel taşımacılık hizmetleri.`,
      city: city || 'İstanbul',
      district: district || 'Merkez',
      services: services.length > 0 ? services : ['evden-eve'],
      serviceAreas: serviceAreas.length > 0 ? serviceAreas : ['TÜM_TÜRKİYE'],
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
      isProfileCompleted: true,
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      responseRatePercent: 100,
      joinedAt: existingCarrier?.joinedAt || new Date().toISOString(),
      createdAt: existingCarrier?.createdAt || new Date().toISOString()
    };

    // Save to mock-db
    db.addCarrier(newCarrier);

    // Save documents if uploaded - All set to PENDING for admin review
    if (taxCertFiles.length > 0) {
      db.addDocument({
        id: `doc_tax_${Date.now()}`,
        carrierId,
        type: 'TAX_CERTIFICATE',
        title: 'Vergi Levhası',
        fileName: taxCertFiles[0].split('/').pop() || 'vergi_levhasi.pdf',
        fileUrl: taxCertFiles[0],
        status: 'PENDING',
        uploadedAt: new Date().toISOString()
      });
    }

    if (identityFiles.length > 0) {
      db.addDocument({
        id: `doc_id_${Date.now()}`,
        carrierId,
        type: 'IDENTITY',
        title: 'Yetkili Kimlik Belgesi',
        fileName: identityFiles[0].split('/').pop() || 'kimlik.jpg',
        fileUrl: identityFiles[0],
        status: 'PENDING',
        uploadedAt: new Date().toISOString()
      });
    }

    // Update currentUser state
    db.setCurrentUser({
      ...(currentUser || {
        id: userId,
        email: email.trim(),
        role: 'CARRIER',
        createdAt: new Date().toISOString()
      }),
      role: 'CARRIER',
      companyName: newCarrier.companyName,
      phone: newCarrier.phone,
      carrierProfileId: newCarrier.id
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-changed'));
      window.dispatchEvent(new Event('storage'));
    }

    router.push('/app/carrier');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Step Header */}
      <div className="mb-8">
        <span className="text-xs font-black text-[#111E38] uppercase tracking-wider block mb-1">
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
              className={`h-2 rounded-full transition-all duration-300 ${
                step >= s.id ? 'bg-[#111E38]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            {errorMessage}
          </div>
        )}

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
                placeholder="Örn: 0532 123 45 67"
                className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kurumsal E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Örn: info@firmaniz.com"
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
              <label className="block font-bold text-slate-700 mb-1">Firma Ticari Unvanı / Marka Adı *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Örn: Yıldız Nakliyat Ltd. Şti."
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
                  placeholder="Örn: Ahmet"
                  className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Yetkili Soyadı</label>
                <input
                  type="text"
                  value={authorizedSurname}
                  onChange={(e) => setAuthorizedSurname(e.target.value)}
                  placeholder="Örn: Yılmaz"
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
                placeholder="Örn: Şehirler arası ve evden eve garantili sigortalı nakliyat hizmeti."
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
              🔒 Bu bilgiler asla müşterilere veya arama motorlarına açık olarak gösterilmez; yalnızca resmi firma doğrulaması için kullanılır.
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">TC Kimlik Numarası *</label>
                {tcKimlik.length === 11 && (
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${
                    validateTCKimlik(tcKimlik).isValid ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {validateTCKimlik(tcKimlik).isValid ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Geçerli T.C. Kimlik</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{validateTCKimlik(tcKimlik).error}</span>
                      </>
                    )}
                  </span>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={tcKimlik}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                  setTcKimlik(val);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="11 haneli T.C. Kimlik Numaranız"
                className={`w-full p-3 rounded-xl border font-semibold tracking-wider transition-colors ${
                  tcKimlik.length === 11
                    ? validateTCKimlik(tcKimlik).isValid
                      ? 'border-emerald-500 bg-emerald-50/20 text-slate-900'
                      : 'border-red-400 bg-red-50/20 text-slate-900'
                    : 'border-slate-300'
                }`}
              />
              <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                11 haneli olmalı, 0 ile başlayamaz ve son rakamı tek sayı olamaz.
              </span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Doğum Tarihi *</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
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
                    className="w-4 h-4 accent-[#111E38]"
                  />
                  <span className="font-semibold text-slate-800">{s.label}</span>
                </label>
              ))}
            </div>

            {/* Mobile Elevator Spec */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3 mt-4">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-[#0A1128]">
                <input
                  type="checkbox"
                  checked={hasMobileElevator}
                  onChange={(e) => setHasMobileElevator(e.target.checked)}
                  className="w-5 h-5 accent-[#111E38]"
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
                    className="w-4 h-4 accent-[#111E38]"
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
                TaşınTeklif güvenli nakliyat ağı için Vergi Levhası ve Yetkili Kimlik belgesi zorunludur.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span className="font-black block mb-1">⚠️ Önemli Güvenlik Kuralı:</span>
              Kimlik ve Vergi Levhası yüklenmeden profiliniz <strong>Onaysız</strong> kalır ve açık taleplere <strong>teklif verme yetkisi açılmaz</strong>. Lütfen belgelerinizi eksiksiz yükleyiniz.
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
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(step - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="min-w-[130px] font-bold text-sm h-11"
            >
              Geri
            </Button>
          ) : <div />}

          {step < 6 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNextStep}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="min-w-[130px] font-bold text-sm h-11"
            >
              Devam Et
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleComplete}
              rightIcon={<ShieldCheck className="w-4 h-4" />}
              className="font-bold text-sm h-11 px-6"
            >
              Başvuruyu Tamamla & Gönder
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
