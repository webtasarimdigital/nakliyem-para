import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/app/',
          '/api/',
          '/nakliyeci/',
          '/musteri/',
          '/giris',
          '/kayit',
          '/sifremi-unuttum',
          '/dogrula',
          '/*?*', // Filtreleme ve arama parametrelerinin gereksiz taranmasını önler
        ],
      },
    ],
    sitemap: 'https://www.tasinteklif.com/sitemap.xml',
  };
}
