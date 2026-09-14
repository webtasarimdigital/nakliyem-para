import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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