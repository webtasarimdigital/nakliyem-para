'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Phone,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

export default function CarrierVerificationPendingPage() {
  const carrier = db.getCarriers()[db.getCarriers().length - 1] || db.getCarriers()[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
        <Clock className="w-9 h-9" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128] mb-3">
        Firmanızı İnceliyoruz 🕒
      </h1>

      <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto mb-8">
        <strong>{carrier.companyName}</strong> adına yüklediğiniz kimlik ve vergi levhası belgeleri yetkili ekibimiz tarafından kontrol edilmektedir. Onay işlemi genellikle 2 saat içinde tamamlanır.
      </p>

      {/* Verification Checklist (Spec Item 11) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-left mb-8 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Doğrulama Aşamaları
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Firma ve Yetkili Bilgileri Kaydedildi</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Hizmet Türleri ve Rota Bölgeleri Belirlendi</span>
          </div>

          <div className="flex items-center gap-3 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Vergi Levhası ve Kimlik Belgeleri Yüklendi</span>
          </div>

          <div className="flex items-center gap-3 text-amber-700 font-bold bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span>Yönetici Ekibi Belge Kontrolü (Devam Ediyor)</span>
          </div>
        </div>
      </div>

      {/* 7 Day Trial Alert */}
      <div className="p-4 rounded-xl bg-[#EAF3FF] border border-blue-200 text-xs text-[#0B3B8F] text-left flex items-start gap-3 mb-8">
        <Sparkles className="w-4 h-4 text-[#146EF5] shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Onay Sonrası 7 Gün Ücretsiz Deneme</strong>
          <span>
            Firmanız doğrulandığı anda hiçbir ücret ödemeden 7 günlük tam kapsamlı deneme üyeliğiniz otomatik olarak başlayacaktır.
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/app/carrier/abonelik">
          <Button variant="primary" size="md">
            Üyelik Paketlerini İncele
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="md">
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
