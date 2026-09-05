'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Target, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/data/mock-db';
import { DigitalService, DigitalServiceLead } from '@/types';

export default function CarrierDigitalGrowthPage() {
  const carrier = db.getCarriers()[0];
  const services = db.getDigitalServices();

  const [selectedService, setSelectedService] = useState<DigitalService | null>(null);
  const [phone, setPhone] = useState(carrier.phone);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const newLead: DigitalServiceLead = {
      id: `lead_${Date.now()}`,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      carrierId: carrier.id,
      companyName: carrier.companyName,
      authorizedPerson: `${carrier.authorizedPersonName} ${carrier.authorizedPersonSurname}`,
      phone,
      email: carrier.email,
      city: carrier.city,
      notes,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.addLead(newLead);
    setIsSubmitted(true);
    setSelectedService(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header (Spec Item 100) */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3 border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Firma Büyütme Çözümleri</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] mb-2">
          Firmanızı Dijitalde Büyütün 🚀
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Google aramalarında, haritalarda ve profesyonel web sitesiyle bölgenizdeki binlerce müşteriye platform dışında da doğrudan telefonla ulaşın.
        </p>
      </div>

      {/* Services Grid (Spec Item 101) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-6 sm:p-7 transition-all shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#146EF5] flex items-center justify-center font-bold">
                  {srv.slug.includes('web') && <Globe className="w-6 h-6" />}
                  {srv.slug.includes('google-ads') && <Target className="w-6 h-6" />}
                  {srv.slug.includes('seo') && <TrendingUp className="w-6 h-6" />}
                  {srv.slug.includes('maps') && <MapPin className="w-6 h-6" />}
                </div>

                <span className="text-xs font-bold text-[#0A1128] bg-slate-100 px-2.5 py-1 rounded-lg">
                  {srv.startingPrice}
                </span>
              </div>

              <h3 className="text-lg font-black text-[#0A1128] group-hover:text-[#146EF5] transition-colors mb-2">
                {srv.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {srv.shortDesc}
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-slate-700 mb-6">
                {srv.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setSelectedService(srv)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ücretsiz Ön Görüşme İste
            </Button>
          </div>
        ))}
      </div>

      {/* How it works (Spec Item 102) */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Nasıl Çalışır?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center text-xs">
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#146EF5] text-white font-bold flex items-center justify-center mx-auto">1</span>
            <strong className="block text-sm">Firmanızı Analiz Ederiz</strong>
            <p className="text-slate-400">Mevcut araç filonuzu ve ana çalışma hatlarınızı inceleriz.</p>
          </div>
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#146EF5] text-white font-bold flex items-center justify-center mx-auto">2</span>
            <strong className="block text-sm">Bölgenizi Belirleriz</strong>
            <p className="text-slate-400">Hedef şehir ve ilçelerdeki nakliye arama hacmini tespit ederiz.</p>
          </div>
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-[#146EF5] text-white font-bold flex items-center justify-center mx-auto">3</span>
            <strong className="block text-sm">Kampanyaları Hazırlarız</strong>
            <p className="text-slate-400">En etkili reklam metinleri ve web sayfası dönüşüm yapısını kurarız.</p>
          </div>
          <div className="space-y-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto">4</span>
            <strong className="block text-sm">Doğrudan Çağrı Alın</strong>
            <p className="text-slate-400">Bölgenizdeki müşterilerin telefon aramaları anında hattınıza düşer.</p>
          </div>
        </div>
      </div>

      {/* Lead Request Modal (Spec Item 103) */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService ? `${selectedService.title} - Ön Görüşme` : ''}
        subtitle="Uzman dijital pazarlama ekibimiz firmanıza özel strateji için 30 dakika içinde sizinle iletişime geçecektir."
      >
        {selectedService && (
          <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Firma Adı</label>
              <input
                type="text"
                disabled
                value={carrier.companyName}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-100 font-semibold text-slate-700"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Ulaşılabilecek Telefon Numarası</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Öncelikli Hedef Şehriniz / İlçe</label>
              <input
                type="text"
                defaultValue={carrier.city}
                className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Özel İstek veya Sorularınız</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Örn: Aylık ortalama 5.000 TL bütçe ile Kadıköy ve Ataşehir'de Google Ads vermek istiyorum..."
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full font-bold">
                Talebi İlet (Ücretsiz)
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Success Notification Modal */}
      <Modal
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
        title="Talebiniz Alındı! 🚀"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700">
            Dijital hizmet danışmanımız en kısa sürede telefon numaranızdan sizinle iletişime geçerek firmanıza özel yol haritasını paylaşacaktır.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={() => setIsSubmitted(false)} className="w-full">
              Tamam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
