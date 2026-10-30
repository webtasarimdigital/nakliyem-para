import { NextRequest, NextResponse } from 'next/server';

// Maintenance mode is ACTIVE (Site bakım moduna alındı)
const IS_MAINTENANCE_MODE = true;
const BYPASS_SECRET = process.env.MAINTENANCE_BYPASS_SECRET || 'tasin2026';
const BYPASS_COOKIE_NAME = 'tasinteklif_maintenance_bypass';

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 0. Admin Giriş yönlendirmesi & Admin Güvenlik Kontrolleri
  if (pathname === '/admin/giris') {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (pathname.startsWith('/admin/') && pathname !== '/admin') {
    const adminToken = req.cookies.get('admin_token')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // 1. SİTE CANLIDA (Bakım Modu Kapalı)
  // Bakım modu aktif değilse tüm ziyaretçiler siteye doğrudan erişebilir.
  const isMaintenanceActive = IS_MAINTENANCE_MODE || req.cookies.get('tasinteklif_maintenance_mode')?.value === '1';

  if (!isMaintenanceActive) {
    // Bakım sayfasına gitmeye çalışanları ana sayfaya yönlendir
    if (pathname === '/bakim') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // 2. Secret bypass via query parameter (?bypass=tasin2026 or ?preview=tasin2026)
  const queryBypass = searchParams.get('bypass') || searchParams.get('admin_pass') || searchParams.get('preview');
  if (queryBypass && queryBypass === BYPASS_SECRET) {
    const cleanUrl = req.nextUrl.clone();
    cleanUrl.searchParams.delete('bypass');
    cleanUrl.searchParams.delete('admin_pass');
    cleanUrl.searchParams.delete('preview');

    const res = NextResponse.redirect(cleanUrl);
    res.cookies.set(BYPASS_COOKIE_NAME, '1', {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      httpOnly: false,
      sameSite: 'lax',
    });
    return res;
  }

  // 2. Allow essential assets, Admin console, Payment webhooks, and the Maintenance page
  const isExcluded =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/admin') ||
    pathname === '/api/dodo/webhook' ||
    pathname.startsWith('/admin') ||
    pathname === '/bakim' ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/banners') ||
    pathname.startsWith('/mock-photos') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.json');

  if (isExcluded) {
    return NextResponse.next();
  }

  // 3. Check for bypass cookie OR active admin session
  const hasBypassCookie = req.cookies.get(BYPASS_COOKIE_NAME)?.value === '1';
  const hasAdminCookie = !!req.cookies.get('admin_token')?.value;

  if (hasBypassCookie || hasAdminCookie) {
    return NextResponse.next();
  }

  // 4. Block API calls with JSON 503
  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Sistem şu anda planlı bakım modundadır.' },
      { status: 503, headers: { 'Retry-After': '3600' } }
    );
  }

  // 5. Redirect all public web visitors to /bakim
  const bakimUrl = new URL('/bakim', req.url);
  return NextResponse.redirect(bakimUrl);
}

export default proxy;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
