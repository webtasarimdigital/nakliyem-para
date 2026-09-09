import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp, deleteOtp } from '@/lib/auth/otp-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Lütfen e-posta adresinizi ve 6 haneli doğrulama kodunu giriniz.' },
        { status: 400 }
      );
    }

    const cleanCode = String(code).trim();
    if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
      return NextResponse.json(
        { error: 'Doğrulama kodu tam 6 haneli rakamlardan oluşmalıdır.' },
        { status: 400 }
      );
    }

    const result = await verifyOtp(email, cleanCode);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Doğrulama başarısız oldu.' },
        { status: 400 }
      );
    }

    // Clean up used OTP
    await deleteOtp(email);

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'E-posta adresiniz başarıyla doğrulandı.',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: error?.message || 'Doğrulama işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
