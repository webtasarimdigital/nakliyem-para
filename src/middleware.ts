import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/giris geldiyse /admin'e yönlendir
  if (pathname === '/admin/giris') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // /admin alt sayfaları (/admin/uyeler, /admin/gelir vb.) için token kontrolü:
  // Eğer giriş yapılmamışsa doğrudan /admin (giriş formuna) yönlendir
  if (pathname.startsWith('/admin/') && pathname !== '/admin') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
