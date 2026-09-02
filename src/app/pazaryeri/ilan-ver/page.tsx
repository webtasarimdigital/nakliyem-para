'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Check,
  Truck,
  Package,
  Settings2,
  Wrench,
  AlertCircle,
  ImagePlus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/data/mock-db';

type Step = 'CATEGORY' | 'DETAILS' | 'PHOTOS' | 'CONTACT' | 'PREVIEW';

const CATEGORY_OPTIONS = [
  { id: 'KAMYON', label: 'Kamyon', description: 'Kapalı / Açık / Tenteli kasa', icon: '🚛' },
  { id: 'KAMYONET', label: 'Kamyonet', description: 'Panelvan, Kapalı Kasa, Pikap', icon: '🚐' },
  { id: 'CEKICI', label: 'Çekici & TIR', description: 'Yarı Römork Çekicisi', icon: '🚌' },
  { id: 'DORSE', label: 'Dorse & Yarı Römork', description: 'Tenteli, Frigorifik, Silo', icon: '🏗️' },
  { id: 'ASANSOR', label: 'Mobil Asansör', description: 'Araç Üstü Hidrolik Asansör', icon: '🏢' },
  { id: 'EKIPMAN', label: 'Taşıma Ekipmanı', description: 'Transpalet, Forklift, Vinç', icon: '⚙️' },
  { id: 'MALZEME', label: 'Ambalaj Malzeme', description: 'Naylon, Kutu, Bant, Köpük', icon: '📦' },
];

const BRANDS = ['Mercedes', 'MAN', 'Volvo', 'Scania', 'Iveco', 'Ford', 'Fiat', 'Renault', 'Isuzu', 'Mitsubishi', 'DAF', 'Diğer'];
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Samsun', 'Trabzon', 'Mersin'];

export default function IlanVerPage() {
  const [step, setStep] = useState<Step>('CATEGORY');
  const [form, setForm] = useState({
    category: '',
    title: '',
    condition: 'IKINCI_EL',
    brand: '',
    model: '',
    year: '',
    km: '',
    transmission: 'Manuel',
    fuel: 'Dizel',
    bodyType: '',
    price: '',
    isNegotiable: false,
    city: '',
    district: '',
    description: '',
    photos: [] as string[],
    sellerName: '',
    sellerPhone: '',
    isPhoneVisible: true,
  });

  const steps: Step[] = ['CATEGORY', 'DETAILS', 'PHOTOS', 'CONTACT', 'PREVIEW'];
  const stepLabels = ['Kategori', 'Detaylar', 'Fotoğraflar', 'İletişim', 'Önizleme'];
  const stepIndex = steps.indexOf(step);
  const isVehicle = ['KAMYON', 'KAMYONET', 'CEKICI', 'DORSE'].includes(form.category);

  const [validationError, setValidationError] = useState('');

  const nextStep = () => {
    setValidationError('');

    if (step === 'CATEGORY') {
      if (!form.category) {
        setValidationError('Lütfen bir kategori seçiniz.');
        return;
      }
    } else if (step === 'DETAILS') {
      if (isVehicle) {
        if (!form.brand) {
          setValidationError('Lütfen araç markasını seçiniz.');
          return;
        }
        if (!form.model || form.model.trim().length === 0) {
          setValidationError('Lütfen model / seri bilgisini giriniz.');
          return;
        }
        if (!form.year) {
          setValidationError('Lütfen model yılını giriniz.');
          return;
        }
      } else {
        if (!form.title || form.title.trim().length === 0) {
          setValidationError('Lütfen ilan başlığını giriniz.');
          return;
        }
      }

      if (!form.price || Number(form.price) <= 0) {
        setValidationError('Lütfen geçerli bir satış fiyatı giriniz.');
        return;
      }
      if (!form.city) {
        setValidationError('Lütfen bulunduğunuz şehri seçiniz.');
        return;
      }
      if (!form.district || form.district.trim().length === 0) {
        setValidationError('Lütfen ilçe bilgisini giriniz.');
        return;
      }
    } else if (step === 'CONTACT') {
      if (!form.sellerName || form.sellerName.trim().length < 3) {
        setValidationError('Lütfen adınızı ve soyadınızı eksiksiz giriniz.');
        return;
      }
      const cleanPhone = form.sellerPhone.replace(/[^0-9]/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        setValidationError('Lütfen en az 10 haneli geçerli bir telefon numarası giriniz.');
        return;
      }
      if (!form.description || form.description.trim().length < 10) {
        setValidationError('Lütfen en az 10 karakterlik bir ilan açıklaması giriniz.');
        return;
      }
    }

    const next = steps[stepIndex + 1];
    if (next) setStep(next);
  };

  const prevStep = () => {
    setValidationError('');
    const prev = steps[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const update = (key: string, value: string | boolean) => {
    setValidationError('');
    setForm(f => ({ ...f, [key]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);

    const generatedTitle = form.title || `${form.brand || ''} ${form.model || form.category}`.trim();
    const newListing = {
      id: `listing_${Date.now()}`,
      category: form.category,
      title: generatedTitle,
      price: Number(form.price),
      priceLabel: `${Number(form.price).toLocaleString('tr-TR')} TL`,
      isNegotiable: form.isNegotiable,
      condition: form.condition,
      year: Number(form.year) || 2022,
      km: Number(form.km) || 0,
      transmission: form.transmission,
      fuel: form.fuel,
      brand: form.brand,
      model: form.model,
      city: form.city,
      district: form.district,
      sellerName: form.sellerName,
      sellerJoinYear: '2026',
      sellerPhone: form.sellerPhone,
      isVerified: true,
      photos: form.photos.length > 0 ? form.photos : ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800'],
      description: form.description,
      createdAt: 'Bugün',
      viewCount: 1
    };

    db.addMarketplaceListing(newListing);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0A1128] mb-3">İlanınız Alındı!</h2>
          <p className="text-slate-600 font-medium leading-relaxed mb-8">
            İlanınız incelemeye alındı. Onaylanması birkaç saat içinde gerçekleşecek ve yayına girecek.
          </p>
          <div className="space-y-3">
            <Link href="/pazaryeri">
              <Button variant="primary" size="lg" className="w-full font-black">
                Pazaryerini İncele
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full font-bold">
                Ana Sayfaya Dön
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/pazaryeri" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#F95700] font-bold mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Pazaryerine Dön
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            Ücretsiz İlan Ver
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Aracınızı veya ekipmanınızı hızla satışa çıkarın.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mb-8 bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <button
                onClick={() => i < stepIndex && setStep(s)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  s === step 
                    ? 'bg-[#F95700] text-white'
                    : i < stepIndex
                      ? 'text-emerald-700 cursor-pointer hover:bg-emerald-50'
                      : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                {i < stepIndex ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-black border-current">
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:block">{stepLabels[i]}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-1 ${i < stepIndex ? 'bg-emerald-200' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">

          {/* STEP 1: CATEGORY */}
          {step === 'CATEGORY' && (
            <div>
              <h2 className="text-xl font-black text-[#0A1128] mb-1">Ne satmak istiyorsunuz?</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Bir kategori seçin</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CATEGORY_OPTIONS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => update('category', cat.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-[#F95700] ${
                      form.category === cat.id 
                        ? 'border-[#F95700] bg-orange-50' 
                        : 'border-slate-200 hover:bg-orange-50/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-black text-[#0A1128] text-sm">{cat.label}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{cat.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 'DETAILS' && (
            <div>
              <h2 className="text-xl font-black text-[#0A1128] mb-1">İlan Detayları</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Aracınız veya ürününüz hakkında bilgi verin</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Durum</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ id: 'SIFIR', label: 'Sıfır' }, { id: 'IKINCI_EL', label: 'İkinci El' }].map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => update('condition', opt.id)}
                        className={`py-2.5 rounded-xl border-2 text-sm font-black transition-all cursor-pointer ${
                          form.condition === opt.id ? 'border-[#F95700] bg-orange-50 text-[#F95700]' : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {isVehicle && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Marka</label>
                        <select
                          value={form.brand}
                          onChange={(e) => update('brand', e.target.value)}
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white"
                        >
                          <option value="">Seçin</option>
                          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Model</label>
                        <input
                          type="text"
                          value={form.model}
                          onChange={(e) => update('model', e.target.value)}
                          placeholder="Örn: 2523, Transit..."
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Yıl</label>
                        <input
                          type="number"
                          value={form.year}
                          onChange={(e) => update('year', e.target.value)}
                          placeholder="2005"
                          min="1980" max="2025"
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">KM</label>
                        <input
                          type="number"
                          value={form.km}
                          onChange={(e) => update('km', e.target.value)}
                          placeholder="250000"
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Vites</label>
                        <select
                          value={form.transmission}
                          onChange={(e) => update('transmission', e.target.value)}
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white"
                        >
                          <option>Manuel</option>
                          <option>Otomatik</option>
                          <option>Yarı Otomatik</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Yakıt</label>
                        <select
                          value={form.fuel}
                          onChange={(e) => update('fuel', e.target.value)}
                          className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white"
                        >
                          <option>Dizel</option>
                          <option>Benzin</option>
                          <option>LPG</option>
                          <option>Elektrik</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Fiyat (TL)</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => update('price', e.target.value)}
                      placeholder="1.500.000"
                      className="flex-1 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                    />
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={form.isNegotiable}
                        onChange={(e) => update('isNegotiable', e.target.checked)}
                        className="w-4 h-4 accent-[#F95700]"
                      />
                      Pazarlıklı
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Şehir</label>
                    <select
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none bg-white"
                    >
                      <option value="">Seçin</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">İlçe</label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => update('district', e.target.value)}
                      placeholder="İlçe adı"
                      className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Açıklama</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    rows={4}
                    placeholder="Araç veya ürün hakkında detaylı açıklama yazın..."
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS */}
          {step === 'PHOTOS' && (
            <div>
              <h2 className="text-xl font-black text-[#0A1128] mb-1">Fotoğraflar</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">
                Daha fazla fotoğraf = daha fazla ilgi. En az 3 fotoğraf eklemenizi öneririz.
              </p>

              {/* Mock Upload Zone */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-[#F95700] transition-colors cursor-pointer">
                <ImagePlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold text-slate-700 mb-1">Fotoğraf Ekle</p>
                <p className="text-xs text-slate-500 font-medium">PNG, JPG — Maks 5 MB, en fazla 16 fotoğraf</p>
                <Button variant="outline" size="sm" className="mt-4 font-bold">
                  Galeriden Seç
                </Button>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
                <strong className="font-black">İpucu:</strong> Önce araç fotoğrafı, ardından kasa içi, motor ve arka fotoğraflarını ekleyin.
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT */}
          {step === 'CONTACT' && (
            <div>
              <h2 className="text-xl font-black text-[#0A1128] mb-1">İletişim Bilgileri</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Alıcıların size nasıl ulaşacağını belirleyin</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Ad Soyad / Firma Adı</label>
                  <input
                    type="text"
                    value={form.sellerName}
                    onChange={(e) => update('sellerName', e.target.value)}
                    placeholder="Firma veya ad soyad"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={form.sellerPhone}
                    onChange={(e) => update('sellerPhone', e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#F95700] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="phoneVisible"
                    checked={form.isPhoneVisible}
                    onChange={(e) => update('isPhoneVisible', e.target.checked)}
                    className="w-4 h-4 accent-[#F95700]"
                  />
                  <label htmlFor="phoneVisible" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Telefon numaramı ilana göster
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 font-medium leading-relaxed">
                      İlanınız yayına girmeden önce ekibimiz tarafından incelenecektir. Bu işlem genellikle 2-4 saat sürmektedir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PREVIEW */}
          {step === 'PREVIEW' && (
            <div>
              <h2 className="text-xl font-black text-[#0A1128] mb-1">İlanınızı İnceleyin</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Yayına girmeden önce bilgilerinizi kontrol edin</p>

              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Kategori</span>
                      <span className="font-bold text-slate-900">{CATEGORY_OPTIONS.find(c => c.id === form.category)?.label || '—'}</span>
                    </div>
                    {form.brand && (
                      <div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Marka / Model</span>
                        <span className="font-bold text-slate-900">{form.brand} {form.model}</span>
                      </div>
                    )}
                    {form.year && (
                      <div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Yıl</span>
                        <span className="font-bold text-slate-900">{form.year}</span>
                      </div>
                    )}
                    {form.km && (
                      <div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">KM</span>
                        <span className="font-bold text-slate-900">{parseInt(form.km).toLocaleString('tr-TR')} km</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Fiyat</span>
                      <span className="font-black text-[#F95700] text-base">
                        {form.price ? `${parseInt(form.price).toLocaleString('tr-TR')} TL` : '—'}
                        {form.isNegotiable && ' (Pazarlıklı)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-0.5">Şehir</span>
                      <span className="font-bold text-slate-900">{form.city || '—'}</span>
                    </div>
                  </div>
                  {form.description && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1">Açıklama</span>
                      <p className="text-sm text-slate-700 font-medium">{form.description}</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-sm font-black text-slate-700 mb-3">İletişim</h3>
                  <div className="text-sm font-medium text-slate-700 space-y-1">
                    <p>{form.sellerName || '—'}</p>
                    <p>{form.isPhoneVisible ? form.sellerPhone || '—' : 'Telefon gizli'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              size="md"
              onClick={prevStep}
              disabled={stepIndex === 0}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
              className="font-bold"
            >
              Geri
            </Button>

            {step === 'PREVIEW' ? (
              <Button
                variant="primary"
                size="lg"
                className="font-black px-8 shadow-lg shadow-orange-900/15"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'İlanı Yayınla 🚀'}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={nextStep}
                disabled={step === 'CATEGORY' && !form.category}
                rightIcon={<ChevronRight className="w-4 h-4" />}
                className="font-black"
              >
                İleri
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
