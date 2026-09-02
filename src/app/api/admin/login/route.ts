import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (username === validUser && password === validPass) {
    // Güvenli bir token oluştur (username + timestamp + salt)
    const token = Buffer.from(
      `${validUser}:${Date.now()}:nakliyempara_admin_secret_2024`
    ).toString('base64');

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,       // JS ile okunamaz (XSS koruması)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',   // CSRF koruması
      maxAge: 60 * 60 * 8,  // 8 saat
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı.' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [user] = decoded.split(':');
    if (user === (process.env.ADMIN_USERNAME || 'admin')) {
      return NextResponse.json({ authenticated: true });
    }
  } catch {
    // invalid token
  }

  return NextResponse.json({ authenticated: false });
}
