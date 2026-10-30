import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminSessionToken,
  verifyAdminCredentials,
  updateAdminPassword,
  createAdminSessionToken,
  validatePasswordStrength,
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
  const rateLimitKey = `change_pass_${clientIp}`;

  // 1. Rate Limiter Kontrolü
  const rateCheck = checkRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    const minutesLeft = Math.ceil(rateCheck.resetInMs / (60 * 1000));
    return NextResponse.json(
      {
        error: `Çok fazla hatalı deneme yapıldı. Güvenlik nedeniyle işlem ${minutesLeft} dakika süreyle kilitlenmiştir.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)),
        },
      }
    );
  }

  // 2. Oturum Kontrolü (Yetkisiz erişimi engelle)
  const cookieToken = req.cookies.get('admin_token')?.value;
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = cookieToken || authHeader;

  if (!token) {
    return NextResponse.json(
      { error: 'Bu işlem için yönetici girişi yapılmış olmalıdır.' },
      { status: 401 }
    );
  }

  const session = await verifyAdminSessionToken(token);
  if (!session.valid || !session.username) {
    return NextResponse.json(
      { error: 'Oturumunuzun süresi dolmuş veya geçersiz. Lütfen tekrar giriş yapın.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const currentPassword = String(body.currentPassword || '').trim();
    const newPassword = String(body.newPassword || '').trim();
    const confirmPassword = String(body.confirmPassword || '').trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Mevcut şifre, yeni şifre ve şifre tekrarı alanları zorunludur.' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Yeni şifreler birbiriyle uyuşmuyor. Lütfen kontrol ediniz.' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Yeni şifreniz mevcut şifrenizle aynı olamaz. Lütfen farklı ve güçlü bir şifre belirleyin.' },
        { status: 400 }
      );
    }

    // 3. Yeni Şifre Karmaşıklık ve Güçlülük Kontrolü
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json(
        { error: strength.error || 'Yeni şifre güvenlik kriterlerini karşılamıyor.' },
        { status: 400 }
      );
    }

    // 4. Mevcut Şifrenin Doğrulanması (Sabit zamanlı scrypt karşılaştırması)
    const isCurrentValid = await verifyAdminCredentials(session.username, currentPassword);
    if (!isCurrentValid) {
      recordFailedAttempt(rateLimitKey);
      await new Promise(resolve => setTimeout(resolve, 600));
      return NextResponse.json(
        { error: 'Mevcut şifreniz hatalı. Lütfen kontrol edip tekrar deneyin.' },
        { status: 400 }
      );
    }

    // 5. Şifreyi Güvenle Güncelle (Salted scrypt hash kaydı, Firestore senkronizasyonu ve passwordVersion artırımı)
    await updateAdminPassword(newPassword);
    resetFailedAttempts(rateLimitKey);

    // 6. Yeni Oturum Token'ı Üret ve Çerezi Yenile (Eski token'lar passwordVersion nedeniyle anında geçersiz olur!)
    const newToken = await createAdminSessionToken(session.username);
    const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

    const response = NextResponse.json({
      success: true,
      message: 'Yönetici şifreniz başarıyla değiştirildi. Güvenliğiniz için diğer tüm aktif oturumlar kapatıldı.',
      token: newToken,
    });

    response.cookies.set('admin_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 saat
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Şifre değiştirilirken sunucu hatası oluştu: ' + (err.message || 'Bilinmeyen hata') },
      { status: 500 }
    );
  }
}
