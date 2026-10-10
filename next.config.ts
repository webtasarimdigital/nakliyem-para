import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // 301 Kalıcı SEO Yönlendirmeleri (Legacy & Alternatif URL'ler)
      {
        source: '/ev-tasima',
        destination: '/evden-eve-nakliyat',
        permanent: true,
      },
      {
        source: '/ofis-tasimaciligi',
        destination: '/ofis-tasima',
        permanent: true,
      },
      {
        source: '/parca-esya',
        destination: '/parca-esya-tasima',
        permanent: true,
      },
      {
        source: '/depolama',
        destination: '/esya-depolama',
        permanent: true,
      },
      {
        source: '/defter',
        destination: '/nakliyeci-defteri',
        permanent: true,
      },
      {
        source: '/firmalar',
        destination: '/nakliyat-firmalari',
        permanent: true,
      },
      {
        source: '/nakliyeci-ol',
        destination: '/kayit?role=nakliyeci',
        permanent: true,
      },
      {
        source: '/nakliyatci-kayit',
        destination: '/kayit?role=nakliyeci',
        permanent: true,
      },
      {
        source: '/bize-ulasin',
        destination: '/iletisim',
        permanent: true,
      },
      {
        source: '/kayit/nakliyeci',
        destination: '/kayit?role=nakliyeci',
        permanent: true,
      },
      {
        source: '/kayit/musteri',
        destination: '/kayit?role=musteri',
        permanent: true,
      },
      {
        source: '/nakliyat-fiyatlari',
        destination: '/fiyatlar',
        permanent: true,
      },
      {
        source: '/pazaryeri/v4',
        destination: '/pazaryeri',
        permanent: true,
      },
      {
        source: '/pazaryeri/v5',
        destination: '/pazaryeri',
        permanent: true,
      },
      {
        source: '/hizmetler/web-sitesi',
        destination: '/hizmetler/web-tasarim',
        permanent: true,
      },
      // Eski blog slug'ları kalıcı 301 yönlendirmesi
      {
        source: '/blog/nakliyat-firmasi-secerken-dikkat-edilmesi-gerekenler',
        destination: '/blog/nakliyat-firmasi-nasil-secilir',
        permanent: true,
      },
      {
        source: '/blog/evden-eve-nakliyat-fiyatlari-nasil-belirlenir',
        destination: '/blog/evden-eve-nakliyat-fiyatlari-2026',
        permanent: true,
      },
      {
        source: '/blog/tasinma-oncesi-yapilmasi-gerekenler-kontrol-listesi',
        destination: '/blog/tasinma-oncesi-yapilacaklar-kontrol-listesi',
        permanent: true,
      },
      // Eski /app/carrier ve /app/customer yollarını Türkçe SEO uyumlu yollara yönlendir
      {
        source: '/app/carrier',
        destination: '/nakliyeci',
        permanent: false,
      },
      {
        source: '/app/carrier/:path*',
        destination: '/nakliyeci/:path*',
        permanent: false,
      },
      {
        source: '/app/customer',
        destination: '/musteri',
        permanent: false,
      },
      {
        source: '/app/customer/:path*',
        destination: '/musteri/:path*',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // Türkçe & SEO Uyumlu Nakliyeci Paneli URL'leri (/nakliyeci -> /app/carrier)
      {
        source: '/nakliyeci',
        destination: '/app/carrier',
      },
      {
        source: '/nakliyeci/:path*',
        destination: '/app/carrier/:path*',
      },
      // Türkçe & SEO Uyumlu Müşteri Paneli URL'leri (/musteri -> /app/customer)
      {
        source: '/musteri',
        destination: '/app/customer',
      },
      {
        source: '/musteri/:path*',
        destination: '/app/customer/:path*',
      },
    ];
  },
};

export default nextConfig;