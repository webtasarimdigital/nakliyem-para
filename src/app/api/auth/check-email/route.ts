import { NextRequest, NextResponse } from 'next/server';

import { collection, query, where, getDocs } from 'firebase/firestore';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ exists: false, error: 'Geçersiz e-posta adresi' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Firestore kontrolü (rol tespiti için)
    let existingRole: string | null = null;
    let firestoreExists = false;

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const uQ = query(collection(firestoreDb, 'users'), where('email', '==', cleanEmail));
        const uSnap = await getDocs(uQ);
        if (!uSnap.empty) {
          firestoreExists = true;
          existingRole = uSnap.docs[0].data()?.role || 'CUSTOMER';
        } else {
          const cQ = query(collection(firestoreDb, 'carriers'), where('email', '==', cleanEmail));
          const cSnap = await getDocs(cQ);
          if (!cSnap.empty) {
            firestoreExists = true;
            existingRole = 'CARRIER';
          }
        }
      } catch (fErr) {
        console.warn('Firestore role check warning in check-email:', fErr);
      }
    }

    if (firestoreExists) {
      return NextResponse.json({ exists: true, email: cleanEmail, role: existingRole });
    }

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
      const isTestEmail = ['omerfarukamazon@gmail.com', 'omerfarukkdursun@gmail.com', 'nimetstepn61@gmail.com'].includes(cleanEmail);
      if (
        !isTestEmail &&
        (msg === 'EMAIL_EXISTS' ||
        errors.some((e: any) => e.message === 'EMAIL_EXISTS' || e.reason === 'EMAIL_EXISTS'))
      ) {
        return NextResponse.json({ exists: true, email: cleanEmail, role: existingRole || 'CUSTOMER' });
      }
      return NextResponse.json({ exists: false, email: cleanEmail });
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
