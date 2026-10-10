import { MetadataRoute } from 'next';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { BLOG_POSTS } from '@/lib/data/blog-posts';
import { INTERCITY_ROUTES } from '@/lib/data/routes-data';
import { db } from '@/lib/data/mock-db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tasinteklif.com';
  const now = new Date();

  // 1. Ana Statik Rotalar
  const staticRoutes = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/teklif-al', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/evden-eve-nakliyat', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/ofis-tasima', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/parca-esya-tasima', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/esya-depolama', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/nakliyat-firmalari', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/nakliyeci-defteri', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/pazaryeri', priority: 0.8, changeFreq: 'daily' as const },
    { path: '/nakliyeciler', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/paketler', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/hakkimizda', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/ekibimiz', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/nasil-calisir', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/nakliyeciler-icin', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/musteriler-icin', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/iletisim', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/nakliyat-rehberi', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/mesafe-hesaplama', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/fiyatlar', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/site-haritasi', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/kullanim-kosullari', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/gizlilik', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/kvkk', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/cerez-politikasi', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/nakliyeci-sozlesmesi', priority: 0.5, changeFreq: 'yearly' as const },
  ].map(r => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFreq,
    priority: r.priority,
  }));

  // 2. Şehirlerarası Popüler Rotalar (/rota/[slug])
  const routeUrls = INTERCITY_ROUTES.map(route => ({
    url: `${baseUrl}/rota/${route.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Blog Yazıları & Rehberler (/blog/[slug])
  const blogUrls = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 4. Şehir Dizinleri (/nakliyat-firmalari/[city])
  const cityDirectoryUrls = TURKEY_CITIES.map(city => ({
    url: `${baseUrl}/nakliyat-firmalari/${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: city.isPopular ? 0.9 : 0.7,
  }));

  // 5. Hizmet + Şehir Sayfaları (/evden-eve-nakliyat/[city])
  const cityServiceUrls = TURKEY_CITIES.slice(0, 20).map(city => ({
    url: `${baseUrl}/evden-eve-nakliyat/${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: city.isPopular ? 0.85 : 0.65,
  }));

  // 6. Onaylı Firma Profilleri (/firma/[slug])
  const carriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED');
  const carrierUrls = carriers.map(c => ({
    url: `${baseUrl}/firma/${c.slug || c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...routeUrls,
    ...blogUrls,
    ...cityDirectoryUrls,
    ...cityServiceUrls,
    ...carrierUrls,
  ];
}
