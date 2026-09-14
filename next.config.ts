import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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