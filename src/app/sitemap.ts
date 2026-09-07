import { MetadataRoute } from 'next';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tasinteklif.com';

  const staticRoutes = [
    '',
    '/teklif-al',
    '/nakliyeci-defteri',
    '/pazaryeri',
    '/nakliyat-firmalari',
    '/evden-eve-nakliyat',
    '/ofis-tasima',
    '/parca-esya-tasima',
    '/esya-depolama',
    '/mesafe-hesaplama',
    '/nakliyat-rehberi',
    '/blog',
    '/paketler',
    '/nakliyeciler',
    '/giris',
    '/kayit',
    '/kullanim-kosullari',
    '/gizlilik',
    '/kvkk',
    '/cerez-politikasi',
    '/nakliyeci-sozlesmesi',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const cityRoutes = TURKEY_CITIES.map(city => ({
    url: `${baseUrl}/nakliyat-firmalari/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: city.isPopular ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...cityRoutes];
}
