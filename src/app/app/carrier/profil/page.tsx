'use client';

import React, { useState } from 'react';
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
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function CarrierProfileEditorPage() {
  const carrier = db.getCarriers()[0];

  const [companyName, setCompanyName] = useState(carrier.companyName);
  const [shortBio, setShortBio] = useState(carrier.shortBio);
  const [description, setDescription] = useState(carrier.description || '');
  const [phone, setPhone] = useState(carrier.phone);
  const [whatsapp, setWhatsapp] = useState(carrier.whatsapp || carrier.phone);
  const [email, setEmail] = useState(carrier.email);
  const [city, setCity] = useState(carrier.city);
  const [district, setDistrict] = useState(carrier.district);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      district
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Firma Profilini Düzenle
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Müşterilerin ve meslektaşlarınızın görüntüleyeceği kurumsal profil bilgileri.
          </p>
        </div>

        <a href={`/firma/${carrier.slug}`} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            Public Profili Önizle ↗
          </Button>
        </a>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> Değişiklikler başarıyla kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="verified" size="md" />
            {carrier.planId === 'plan_gold' && <Badge variant="gold" size="md" />}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {carrier.completedJobsCount} Başarılı Taşıma
          </span>
        </div>

        {/* Company name */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Firma Ticari Unvanı</label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
          />
        </div>

        {/* Short bio */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Kısa Tanıtım (Kartlarda görünen)</label>
          <textarea
            rows={2}
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>

        {/* Long description */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Detaylı Firma Açıklaması</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed"
          />
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Telefon Numarası</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">WhatsApp Hattı</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Merkez İl</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Merkez İlçe</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-semibold"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
