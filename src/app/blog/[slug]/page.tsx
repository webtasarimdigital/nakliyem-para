'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] mb-6">
        <ArrowLeft className="w-4 h-4" /> Tüm Rehberlere Dön
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="font-bold text-[#146EF5] bg-blue-50 px-2.5 py-0.5 rounded">Fiyatlandırma & Rehber</span>
            <span>•</span>
            <span>20 Ağustos 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0A1128] leading-tight">
            Evden Eve Nakliyat Fiyatları Nasıl Belirlenir?
          </h1>
        </div>

        {/* Article Body */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Ev taşınma sürecinde en çok merak edilen konulardan biri nakliyat firmalarının fiyat tekliflerini nasıl hesapladığıdır. Sektördeki profesyonel şirketler fiyat teklifini oluştururken 4 ana faktörü göz önünde bulundurur:
          </p>

          <h2 className="text-lg font-bold text-[#0A1128] pt-2">1. Eşya Hacmi ve Oda Sayısı</h2>
          <p>
            1+1, 2+1 veya 3+1 dairelerde eşya yoğunluğuna göre kamyonun boyutu (kamyonet, 10 teker kapalı kasa) ve taşıma ekibinde yer alacak marangoz ve taşıyıcı sayısı belirlenir.
          </p>

          <h2 className="text-lg font-bold text-[#0A1128] pt-2">2. Kat Yükseklikleri ve Asansör Durumu</h2>
          <p>
            Binada geniş ve yük taşımaya uygun asansör bulunmuyorsa ve kat 3 veya daha yüksekse, dış cephe hidrolik mobil asansörü kurulması gerekebilir. Bu durum hem eşyaların çizilmesini önler hem de taşıma süresini yarı yarıya kısaltır.
          </p>

          <h2 className="text-lg font-bold text-[#0A1128] pt-2">3. Mesafe ve Yakıt Giderleri</h2>
          <p>
            Şehirler arası taşımacılıkta gidiş mesafesi, köprü/otoyol geçiş ücretleri ve dönüş yükü bulabilme potansiyeli fiyata doğrudan yansır.
          </p>
        </div>

        {/* Embedded Contextual Quote CTA */}
        <div className="p-6 rounded-2xl bg-[#EAF3FF] border border-blue-200 text-center space-y-3">
          <h3 className="text-base font-bold text-[#0A1128]">Eviniz İçin Net Fiyat Öğrenmek İster misiniz?</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Taşınma bilgilerinizi girin, bölgenizdeki onaylı nakliyat firmalarından 2 dakika içinde ücretsiz teklif alın.
          </p>
          <Link href="/teklif-al">
            <Button variant="primary" size="md">Ücretsiz Nakliyat Teklifi Al</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
