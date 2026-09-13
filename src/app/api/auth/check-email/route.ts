import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ exists: false, error: 'Geçersiz e-posta adresi' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ exists: false });
    }

    const dummyPassword = `Chk_${Date.now()}_${Math.random().toString(36).slice(2)}!A1`;
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        password: dummyPassword,
        returnSecureToken: true,
      }),
    });

    const data = await res.json();

    if (data.error) {
      const msg = data.error.message;
      const errors = data.error.errors || [];
      if (
        msg === 'EMAIL_EXISTS' ||
        errors.some((e: any) => e.message === 'EMAIL_EXISTS' || e.reason === 'EMAIL_EXISTS')
      ) {
        return NextResponse.json({ exists: true, email: cleanEmail });
      }
      return NextResponse.json({ exists: false });
    }

    if (data.idToken) {
      await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: data.idToken }),
      }).catch(() => {});
    }

    return NextResponse.json({ exists: false, email: cleanEmail });
  } catch (err: any) {
    return NextResponse.json({ exists: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ exists: false, error: 'E-posta parametresi gereklidir' }, { status: 400 });
  }
  return POST(new NextRequest(req.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  }));
}
