import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Truck,
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BookOpen,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Nakliyat Firmaları İçin İş ve Müşteri Bulma Platformu',
  description: 'Nakliyeciler için %0 komisyonlu müşteri bulma platformu. 7 gün ücretsiz deneme, Nakliyeci Defteri dönüş yükleri ve kurumsal profil vitrini.',
  alternates: {
    canonical: '/nakliyeciler-icin',
  },
};

export default function NakliyecilerIcinPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="bg-gradient-to-r from-[#111E38] to-[#1c305c] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-orange-400 text-xs font-bold border border-white/20">
              <Truck className="w-3.5 h-3.5" />
              <span>Taşıyıcı ve Nakliyeci Ekosistemi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Kamyonunuz Hiç Boş Kalmasın: <br />
              <span className="text-[#F95700]">Hemen Müşteri Bulun!</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
              Aracı komisyonu olmadan doğrudan müşteriyle görüşün. 81 ilde açılan evden eve ve ofis taşıma taleplerine anında teklif verin.
            </p>

            <div className="pt-3 flex flex-wrap gap-3">
              <Link href="/kayit?role=nakliyeci">
                <Button variant="primary" size="lg" className="font-black px-8 shadow-lg shadow-orange-950/40" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  7 Gün Ücretsiz Başla
                </Button>
              </Link>
              <Link href="/paketler">
                <Button variant="outline" size="lg" className="font-bold border-slate-600 text-white hover:bg-slate-800">
                  Abonelik Paketleri
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <span className="text-2xl">💰</span>
            <h3 className="font-extrabold text-lg text-[#111E38]">%0 Komisyon Kesintisi</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Teklifiniz onaylandığında kazancınızdan yüzde kesmiyoruz. Paranızı taşıma günü müşteriden doğrudan tahsil edersiniz.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <span className="text-2xl">🚛</span>
            <h3 className="font-extrabold text-lg text-[#111E38]">Nakliyeci Defteri Borsası</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Şehirlerarası gidişlerde boş dönmeyin. Diğer meslektaşlarınızla dönüş yükü, parsiyel eşya ve kiralık mobil asansör paylaşın.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-3">
            <span className="text-2xl">⭐</span>
            <h3 className="font-extrabold text-lg text-[#111E38]">Google Uyumlu Kurumsal Vitrin</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Firmanız için özel Google indeksli profil sayfası, doğrulanmış K3 rozeti ve gerçek müşteri değerlendirmeleriyle itibar kazanın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
