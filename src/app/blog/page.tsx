import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { BookOpen, Calendar, ArrowRight, Sparkles, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BLOG_POSTS } from '@/lib/data/blog-posts';

export const metadata: Metadata = {
  title: 'Nakliyat Blog & Taşınma Rehberleri',
  description: 'Evden eve nakliyat fiyatları 2026, nakliyat firması seçimi, K3 yetki belgesi ve taşınma öncesi yapılacaklar rehberi.',
  keywords: ['nakliyat blogu', 'taşınma rehberi', 'ev taşıma tavsiyeleri', 'nakliyat fiyatları 2026'],
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogListingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-4">
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: '/' },
            { name: 'Blog & Rehberler', url: '/blog' },
          ]}
        />
      </div>
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B3B8F] text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#146EF5]" />
          <span>Taşınma Bilgi Bankası</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111E38] mb-3">
          Taşınmadan Önce Bilmeniz Gerekenler
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Ev ve ofis taşınma süreçlerinde sorunsuz bir deneyim yaşamanız için uzman nakliyecilerin hazırladığı kapsamlı rehberler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            className="bg-white rounded-3xl border border-slate-200 hover:border-[#F95700] p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="font-bold text-[#F95700] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h2 className="font-extrabold text-[#111E38] text-base group-hover:text-[#F95700] transition-colors mb-2 line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                {post.summary}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {post.date}
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-black text-[#F95700] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
              >
                İncele <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

