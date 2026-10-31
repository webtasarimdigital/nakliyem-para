import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  verifyAdminSessionToken,
  checkRateLimit,
  recordFailedAttempt,
  resetFailedAttempts,
} from '@/lib/auth/admin-auth';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const rateLimitKey = `login_${clientIp}`;

  // 1. Kaba Kuvvet (Brute Force) Saldırı Kontrolü
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.resetInMs / (60 * 1000));
    return NextResponse.json(
      {
        error: `Çok fazla hatalı giriş denemesi yapıldı. Güvenlik nedeniyle hesabınız ${minutesLeft} dakika süreyle kilitlenmiştir. Lütfen daha sonra tekrar deneyin.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir.' },
        { status: 400 }
      );
    }

    // 2. Kriptografik Şifre ve Kullanıcı Doğrulaması (scrypt + timingSafeEqual)
    const isMatched = await verifyAdminCredentials(username, password);

    if (isMatched) {
      // Başarılı giriş — Hatalı deneme sayacını sıfırla
      resetFailedAttempts(rateLimitKey);

      // Kriptografik HMAC-SHA256 imzalı oturum token'ı üret
      const token = await createAdminSessionToken(username);
      const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

      const response = NextResponse.json({ success: true, token, username });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 saat
        path: '/',
      });
      return response;
    }

    // Başarısız giriş — Deneme sayacını artır ve bot yavaşlatma gecikmesi ekle
    const failedInfo = recordFailedAttempt(rateLimitKey);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (failedInfo.locked) {
      return NextResponse.json(
        {
          error: 'Üst üste 5 hatalı giriş yapıldı. Güvenliğiniz için erişim 15 dakika kilitlendi.',
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Kullanıcı adı veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'İstek işlenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get('admin_token')?.value;
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const queryToken = req.nextUrl.searchParams.get('token');
  const token = cookieToken || authHeader || queryToken;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    // 1. Yeni HMAC-SHA256 imzalı token doğrulaması
    const verifyResult = await verifyAdminSessionToken(token);
    if (verifyResult.valid && verifyResult.username) {
      const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');
      const response = NextResponse.json({ authenticated: true, username: verifyResult.username, token });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 saat
        path: '/',
      });
      return response;
    }

    // 2. Geriye dönük geçiş (Legacy fallback) — Sadece geçerli biçimdeyse ve admin_secret içeriyorsa
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.includes('TaşınTeklif_admin_secret_2024')) {
      const [user] = decoded.split(':');
      const validUser = (process.env.ADMIN_USERNAME || 'admin').trim();
      if (user && (user.toLowerCase() === validUser.toLowerCase() || user.toLowerCase() === 'admin')) {
        const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');
        const response = NextResponse.json({ authenticated: true, username: user, token });
        response.cookies.set('admin_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production' || isHttps,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        });
        return response;
      }
    }
  } catch {
    // invalid token
  }

  return NextResponse.json({ authenticated: false });
}