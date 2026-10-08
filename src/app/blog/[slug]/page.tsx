import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Sparkles,
  HelpCircle,
  Truck,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { JsonLd } from '@/components/seo/JsonLd';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/data/blog-posts';
import { buildArticleSchema, buildFAQSchema } from '@/lib/seo/schema';

export async function generateStaticParams() {
  return BLOG_POSTS.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Yazı Bulunamadı',
      robots: { index: false },
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'tr_TR',
      title: `${post.title} | TaşınTeklif`,
      description: post.metaDescription,
      publishedTime: post.isoDate,
      authors: [post.author],
      url: `https://tasinteklif.com/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.metaDescription,
    slug: post.slug,
    datePublished: post.isoDate,
    author: post.author,
  });

  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <JsonLd data={articleSchema} />
      {post.content.faqs && post.content.faqs.length > 0 && (
        <JsonLd data={buildFAQSchema(post.content.faqs)} />
      )}

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { name: 'Ana Sayfa', url: '/' },
            { name: 'Blog', url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-100 pb-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="font-bold text-[#F95700] bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {post.author}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#111E38] leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {post.content.lead}
          </p>
        </header>

        {/* Article Sections */}
        <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          {post.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg sm:text-2xl font-black text-[#111E38] tracking-tight pt-2">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
              {section.listItems && section.listItems.length > 0 && (
                <ul className="space-y-2 pt-1 pl-1">
                  {section.listItems.map((item, lIdx) => (
                    <li
                      key={lIdx}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-slate-800 font-medium bg-orange-50/40 p-3 rounded-xl border border-orange-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#F95700] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Sıkça Sorulan Sorular (Varsa) */}
          {post.content.faqs && post.content.faqs.length > 0 && (
            <section className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#F95700] uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Sıkça Sorulan Sorular</span>
              </div>
              <div className="space-y-3">
                {post.content.faqs.map((faq, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                  >
                    <h3 className="text-sm sm:text-base font-extrabold text-[#111E38]">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bağlamsal İç Link Kutusu */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 space-y-3">
            <h3 className="font-extrabold text-sm sm:text-base text-[#111E38]">
              Şehrinizdeki Onaylı Nakliyecileri Keşfedin
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Türkiye genelinde 81 ilde K3 belgeli firmalardan komisyonsuz teklif alın:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { name: 'İstanbul Nakliyat', url: '/nakliyat-firmalari/istanbul' },
                { name: 'Ankara Nakliyat', url: '/nakliyat-firmalari/ankara' },
                { name: 'İzmir Nakliyat', url: '/nakliyat-firmalari/izmir' },
                { name: 'İstanbul - Ankara Rotası', url: '/rota/istanbul-ankara-nakliyat' },
                { name: 'İstanbul - İzmir Rotası', url: '/rota/istanbul-izmir-nakliyat' },
                { name: 'Evden Eve Nakliyat', url: '/evden-eve-nakliyat' },
              ].map(link => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#111E38] hover:text-[#F95700] border border-orange-200/80 text-xs font-bold transition-all shadow-2xs"
                >
                  {link.name} →
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Embedded Contextual Quote CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#111E38] text-white text-center space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>%100 Ücretsiz &amp; Komisyonsuz</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Eviniz İçin Anında Net Fiyat Öğrenin
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Taşınma bilgilerinizi girin, bölgenizdeki onaylı ve sigortalı nakliyat firmalarından 2 dakika içinde teklif toplayıp karşılaştırın.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/teklif-al">
              <Button
                variant="primary"
                size="lg"
                className="font-black px-8 shadow-lg shadow-orange-900/30"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Ücretsiz Teklif Al
              </Button>
            </Link>
            <Link href="/nakliyat-firmalari">
              <Button
                variant="outline"
                size="lg"
                className="font-bold border-slate-700 text-white hover:bg-slate-800"
              >
                Firmaları İncele
              </Button>
            </Link>
          </div>
        </div>
      </article>

      {/* Diğer Rehberler */}
      <section className="mt-12 space-y-6">
        <h2 className="text-xl font-black text-[#111E38]">Diğer Taşınma Rehberleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherPosts.map(p => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#F95700] transition-all shadow-2xs hover:shadow-md group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#F95700] uppercase tracking-wider block mb-1">
                  {p.category}
                </span>
                <h4 className="font-extrabold text-xs sm:text-sm text-[#111E38] group-hover:text-[#F95700] transition-colors line-clamp-2">
                  {p.title}
                </h4>
              </div>
              <span className="text-[11px] text-slate-400 font-bold mt-3 block">
                {p.readTime} →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
