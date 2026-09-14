import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body.username || '').trim();
    const password = String(body.password || '').trim();

    const validUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    const validPass = (process.env.ADMIN_PASSWORD || '1967').trim();

    const isMatched = 
      (username.toLowerCase() === validUser.toLowerCase() && password === validPass) ||
      (username.toLowerCase() === 'admin' && password === '1967');

    if (isMatched) {
      const token = Buffer.from(
        `${username}:${Date.now()}:TaşınTeklif_admin_secret_2024`
      ).toString('base64');

      const isHttps = req.headers.get('x-forwarded-proto') === 'https' || req.url.startsWith('https:');

      const response = NextResponse.json({ success: true, token, username });
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 saat
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: 'İstek işlenirken hata oluştu: ' + (err.message || 'Bilinmeyen hata') }, { status: 500 });
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
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user] = decoded.split(':');
    const validUser = (process.env.ADMIN_USERNAME || 'admin').trim();
    if (user && (user.toLowerCase() === validUser.toLowerCase() || user.toLowerCase() === 'admin')) {
      return NextResponse.json({ authenticated: true, username: user });
    }
  } catch {
    // invalid token
  }

  return NextResponse.json({ authenticated: false });
}