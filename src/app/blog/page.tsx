import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nakliyat Blog & Taşınma Rehberleri | Nakliyem Para',
  description: 'Ev taşırken dikkat edilmesi gerekenler, nakliyat fiyat hesaplama yöntemleri ve profesyonel ambalajlama ipuçları.',
  keywords: ['nakliyat blogu', 'taşınma rehberi', 'ev taşıma tavsiyeleri']
};

export const BLOG_POSTS = [
  {
    slug: 'evden-eve-nakliyat-fiyatlari-nasil-belirlenir',
    title: 'Evden Eve Nakliyat Fiyatları Nasıl Belirlenir?',
    summary: 'Oda sayısı, kat yükseklikleri, asansör ihtiyacı ve kilometre mesafesine göre 2026 yılı güncel nakliye maliyet faktörleri.',
    date: '20 Ağustos 2026',
    category: 'Fiyatlandırma & Rehber',
    readTime: '4 dk okuma'
  },
  {
    slug: 'nakliyat-firmasi-secerken-dikkat-edilmesi-gerekenler',
    title: 'Nakliyat Firması Seçerken Nelere Dikkat Edilmeli?',
    summary: 'K3 yetki belgesi, vergi levhası, emtia sigortası ve müşteri yorumlarının taşınma güvenliğindeki önemi.',
    date: '15 Ağustos 2026',
    category: 'Güvenlik & İpuçları',
    readTime: '5 dk okuma'
  },
  {
    slug: 'tasinma-oncesi-yapilmasi-gerekenler-kontrol-listesi',
    title: 'Taşınma Öncesi Yapılması Gerekenler: Adım Adım Kontrol Listesi',
    summary: 'Abonelik devirleri, koli hazırlığı, beyaz eşya sabitleme ve taşınma günü stresi azaltacak pratik adımlar.',
    date: '10 Ağustos 2026',
    category: 'Taşınma Rehberi',
    readTime: '6 dk okuma'
  }
];

export default function BlogListingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B3B8F] text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#146EF5]" />
          <span>Taşınma Bilgi Bankası</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
          Taşınmadan Önce Bilmeniz Gerekenler
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ev ve ofis taşınma süreçlerinde sorunsuz bir deneyim yaşamanız için uzman nakliyecilerin hazırladığı kapsamlı rehberler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            className="bg-white rounded-2xl border border-slate-200 hover:border-[#146EF5] p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-bold text-[#146EF5] bg-blue-50 px-2 py-0.5 rounded">{post.category}</span>
                <span>{post.readTime}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 group-hover:text-[#146EF5] transition-colors mb-2 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                {post.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{post.date}</span>
              <Link href={`/blog/${post.slug}`} className="text-xs font-bold text-[#146EF5] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Devamını Oku <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
