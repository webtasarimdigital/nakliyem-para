import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Kapsamlı Ev ve Ofis Taşınma Rehberi | Nakliyem Para',
  description: 'Taşınma öncesinde, taşınma gününde ve sonrasında yapılması gereken tüm adımları içeren pratik rehber.',
  keywords: ['nakliyat rehberi', 'ev taşınma tavsiyeleri', 'koli hazırlama rehberi']
};

export default function NakliyatRehberiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="border-b border-slate-100 pb-6">
          <span className="text-xs font-bold text-[#146EF5] uppercase tracking-wider block mb-1">
            Rehber & Tavsiyeler
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            Adım Adım Taşınma Rehberi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Taşınma stresini ortadan kaldıracak uzman kontrol listesi ve pratik ipuçları.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <h2 className="text-base font-bold text-[#0B3B8F]">1. Taşınmadan 2 Hafta Önce</h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">✓ Elektrik, su, doğalgaz ve internet abonelik iptal/devir randevularını alın.</li>
              <li className="flex items-center gap-2">✓ Kullanmadığınız eşyaları ayırın veya bağışlayın.</li>
              <li className="flex items-center gap-2">✓ Platform üzerinden taşıma talebinizi açarak firmalardan erken teklif toplayın.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <h2 className="text-base font-bold text-emerald-900">2. Taşınmadan 3 Gün Önce</h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">✓ Buzdolabının içini boşaltın ve çözülmesi için fişini çekin.</li>
              <li className="flex items-center gap-2">✓ Değerli ziynet ve önemli resmi evraklarınızı ayrı bir çantada kendiniz için ayırın.</li>
              <li className="flex items-center gap-2">✓ Bina yönetimlerine taşınma saatini ve asansör kullanımını bildirin.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
            <h2 className="text-base font-bold text-amber-900">3. Taşınma Günü</h2>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">✓ Nakliye ekibine hassas ve kırılacak kolileri önceden gösterin.</li>
              <li className="flex items-center gap-2">✓ Yeni evde mobilyaların konulacağı odaları önceden belirleyin.</li>
              <li className="flex items-center gap-2">✓ Taşıma tamamlandığında tüm odaları son kez kontrol edin.</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 text-center">
          <Link href="/teklif-al">
            <Button variant="primary" size="lg">
              Hemen Taşıma Talebi Oluştur
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
