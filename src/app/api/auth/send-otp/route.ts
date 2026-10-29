import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateEmailAddress } from '@/lib/validation/email';
import { generateNumericOtp, saveOtp } from '@/lib/auth/otp-store';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { db as firestoreDb, auth as firebaseAuth, isFirebaseConfigured } from '@/lib/firebase/config';

const ADMIN_EMAIL = 'tasinteklif@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role, companyName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // 1. Validate email address & prevent disposable/fake emails
    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { error: emailCheck.error || 'Geçersiz veya geçici bir e-posta adresi girdiniz.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1.2. Phone uniqueness check (Bir telefon numarası yalnızca tek bir üyelik için kullanılabilir)
    const rawPhone = body.phone ? String(body.phone) : '';
    let cleanPhone = rawPhone.replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('90')) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);

    if (cleanPhone && cleanPhone.length >= 10 && isFirebaseConfigured() && firestoreDb) {
      try {
        const pQ1 = query(collection(firestoreDb, 'users'), where('phone', '==', cleanPhone));
        const pSnap1 = await getDocs(pQ1);
        let phoneExistingUser: any = null;
        if (!pSnap1.empty) {
          phoneExistingUser = pSnap1.docs[0].data();
        } else {
          const pQ2 = query(collection(firestoreDb, 'carriers'), where('phone', '==', cleanPhone));
          const pSnap2 = await getDocs(pQ2);
          if (!pSnap2.empty) {
            phoneExistingUser = pSnap2.docs[0].data();
          }
        }

        if (phoneExistingUser && phoneExistingUser.email && phoneExistingUser.email.trim().toLowerCase() !== normalizedEmail) {
          return NextResponse.json(
            {
              error: 'PHONE_ALREADY_REGISTERED',
              message: `Bu telefon numarasına ait bir üyelik zaten bulunmaktadır. Kayıtlı e-posta: ${phoneExistingUser.email}`,
              phone: cleanPhone,
              existingEmail: phoneExistingUser.email,
              role: phoneExistingUser.role || 'CARRIER',
            },
            { status: 409 }
          );
        }
      } catch (pErr) {
        console.warn('Firestore phone uniqueness check warning in send-otp:', pErr);
      }
    }

    // 1.5. Check if user already exists in Firestore and detect role mismatch
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const uQ = query(collection(firestoreDb, 'users'), where('email', '==', normalizedEmail));
        const uSnap = await getDocs(uQ);
        let existingRole: string | null = null;
        if (!uSnap.empty) {
          existingRole = uSnap.docs[0].data()?.role || 'CUSTOMER';
        } else {
          const cQ = query(collection(firestoreDb, 'carriers'), where('email', '==', normalizedEmail));
          const cSnap = await getDocs(cQ);
          if (!cSnap.empty) {
            existingRole = 'CARRIER';
          }
        }

        if (existingRole === 'CARRIER' && role === 'CUSTOMER') {
          return NextResponse.json(
            {
              error: 'ROLE_MISMATCH_CARRIER',
              existingRole: 'CARRIER',
              targetRole: 'CUSTOMER',
              message: 'Bu e-posta adresiyle sistemimizde aktif bir Nakliyeci (Firma) kaydınız bulunmaktadır. Aynı e-posta adresiyle müşteri hesabı açamazsınız. Nakliyeci Girişi yapabilir veya farklı bir e-posta adresiyle müşteri kaydı oluşturabilirsiniz.',
              email: normalizedEmail,
            },
            { status: 409 }
          );
        }

        if (existingRole === 'CUSTOMER' && role === 'CARRIER') {
          return NextResponse.json(
            {
              error: 'ROLE_MISMATCH_CUSTOMER',
              existingRole: 'CUSTOMER',
              targetRole: 'CARRIER',
              message: 'Bu e-posta adresiyle sistemimizde aktif bir Müşteri kaydınız bulunmaktadır. Aynı e-posta adresiyle nakliyeci hesabı açamazsınız. Müşteri Girişi yapabilir veya nakliye firmanız için farklı bir kurumsal e-posta adresiyle kayıt oluşturabilirsiniz.',
              email: normalizedEmail,
            },
            { status: 409 }
          );
        }

        if (existingRole) {
          return NextResponse.json(
            {
              error: 'ALREADY_REGISTERED',
              message: 'Bu e-posta adresi ile zaten kayıtlı bir hesabınız bulunmaktadır.',
              email: normalizedEmail,
            },
            { status: 409 }
          );
        }
      } catch (fErr) {
        console.warn('Firestore role check warning in send-otp:', fErr);
      }
    }

    // Check if user already exists in Firebase Auth (Google, Email/Password, etc.)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (apiKey) {
      try {
        const dummyPassword = `Chk_${Date.now()}_${Math.random().toString(36).slice(2)}!A1`;
        const chkRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: normalizedEmail,
            password: dummyPassword,
            returnSecureToken: true,
          }),
        });
        const chkData = await chkRes.json();
        if (chkData.error) {
          const msg = chkData.error.message;
          const errors = chkData.error.errors || [];
          if (
            msg === 'EMAIL_EXISTS' ||
            errors.some((e: any) => e.message === 'EMAIL_EXISTS' || e.reason === 'EMAIL_EXISTS')
          ) {
            return NextResponse.json(
              {
                error: 'ALREADY_REGISTERED',
                message: 'Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır.',
                email: normalizedEmail,
              },
              { status: 409 }
            );
          }
        } else if (chkData.idToken) {
          // Clean up temporary user immediately
          await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: chkData.idToken }),
          }).catch(() => {});
        }
      } catch (checkErr) {
        console.warn('Pre-check email in send-otp error:', checkErr);
      }
    }

    // 2. Generate 6-digit code for fallback and local verification
    const verificationCode = generateNumericOtp();

    // 2.1. Attempt SMS OTP via otp.com if OTP_COM_API_KEY is configured
    let otpId: string | undefined;
    let smsSent = false;
    const otpComKey = process.env.OTP_COM_API_KEY;

    if (otpComKey && cleanPhone && cleanPhone.length === 10) {
      try {
        const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                         req.headers.get('x-real-ip') || undefined;

        const otpRes = await fetch('https://api.otp.com/api/v1/otp/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${otpComKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: `+90${cleanPhone}`,
            locale: 'tr',
            ...(clientIp ? { client_ip: clientIp } : {}),
          }),
        });

        const otpData = await otpRes.json();
        if (otpRes.ok && otpData.otp_id) {
          otpId = otpData.otp_id;
          smsSent = true;
          console.log(`[OTP.COM SMS SENT] To: +90${cleanPhone} | otp_id: ${otpId}`);
        } else {
          console.warn('otp.com send-otp non-200 or no otp_id:', otpData);
        }
      } catch (otpErr: any) {
        console.warn('otp.com send-otp network error:', otpErr?.message);
      }
    }

    const displayName = (role === 'CARRIER' && companyName ? companyName : name) || 'Değerli Kullanıcımız';
    const isCarrier = role === 'CARRIER';
    const subject = `🔐 TaşınTeklif Doğrulama Kodunuz: ${verificationCode}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background-color: #111E38; padding: 28px 24px; text-align: center; }
          .logo { color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-decoration: none; }
          .logo span { color: #F95700; }
          .tagline { color: #94a3b8; font-size: 11px; margin-top: 6px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
          .code-box { background: #fff7ed; border: 2px dashed #f97316; border-radius: 14px; padding: 22px; text-align: center; margin: 20px 0; }
          .code-label { font-size: 11px; font-weight: 800; color: #c2410c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
          .code-number { font-size: 36px; font-weight: 900; color: #111E38; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace; }
          .timer-notice { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #991b1b; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Taşın<span>Teklif</span></div>
            <div class="tagline">Türkiye'nin Akıllı Nakliyat Platformu</div>
          </div>
          
          <div class="content">
            <div class="greeting">Merhaba Sayın ${displayName},</div>
            <div class="intro">
              TaşınTeklif'e ${isCarrier ? 'nakliyeci' : 'müşteri'} kayıt işleminizi güvenle tamamlamak için aşağıdaki 6 haneli doğrulama kodunu giriniz:
            </div>

            <div class="code-box">
              <div class="code-label">E-Posta Onay Kodu</div>
              <div class="code-number">${verificationCode}</div>
            </div>

            <div class="timer-notice">
              ⏱️ Bu kod <strong>3 dakika (180 saniye)</strong> geçerlidir.
            </div>

            <div style="font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 20px;">
              Bu işlemi siz başlatmadıysanız bu e-postayı güvenle dikkate almayabilirsiniz. Güvenliğiniz için bu doğrulama kodunu kimseyle paylaşmayınız.
            </div>
          </div>

          <div class="footer">
            TaşınTeklif Güvenlik Bildirimi<br>
            Destek: <a href="mailto:${ADMIN_EMAIL}" style="color: #F95700; text-decoration: none;">${ADMIN_EMAIL}</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
TaşınTeklif Kayıt Doğrulama Kodunuz:
${verificationCode}

Merhaba Sayın ${displayName},
Hesabınızı açmak için bu kodu kayıt ekranına giriniz.
Bu kod 3 dakika (180 saniye) boyunca geçerlidir.

TaşınTeklif Ekibi
${ADMIN_EMAIL}
    `.trim();

    // Dev logging for testing
    console.log(`[AUTH OTP SENT] To: ${email} | Code: ${verificationCode} (Expires in 3 min)`);

    let emailSent = false;

    // 1. Nodemailer if SMTP configured
    const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : '');
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS;

    if (!smsSent && smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
          from: {
            name: 'TaşınTeklif',
            address: process.env.SMTP_FROM || process.env.SMTP_USER || 'bilgi@tasinteklif.com',
          },
          to: email,
          subject,
          text: textBody,
          html: htmlBody,
        });

        emailSent = true;
      } catch (err: any) {
        console.warn('Nodemailer OTP send failed:', err?.message);
      }
    }

    // 2. Resend API if configured and email not yet sent
    if (!smsSent && !emailSent && process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'TaşınTeklif <onboarding@resend.dev>',
            to: [email],
            subject,
            text: textBody,
            html: htmlBody,
          }),
        });
        if (res.ok) emailSent = true;
      } catch (err: any) {
        console.warn('Resend OTP send failed:', err?.message);
      }
    }

    // Save OTP to store with phone, otpId and channel
    await saveOtp(normalizedEmail, verificationCode, {
      phone: cleanPhone,
      otpId,
      channel: smsSent ? 'sms' : (emailSent ? 'email' : undefined),
    });

    const isDelivered = smsSent || emailSent;

    return NextResponse.json({
      success: true,
      channel: smsSent ? 'sms' : (emailSent ? 'email' : 'screen'),
      phone: cleanPhone ? `+90${cleanPhone}` : undefined,
      message: smsSent
        ? `Doğrulama kodu 0${cleanPhone} numaralı telefonunuza SMS ile gönderildi.`
        : (emailSent
            ? 'Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol ediniz.'
            : 'SMS veya E-posta servisi yapılandırılmadığı için doğrulama kodunuz ekranda hazırlanmıştır.'),
      expiresIn: 180, // 3 minutes in seconds
      emailSent: isDelivered,
      code: !isDelivered ? verificationCode : undefined,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error?.message || 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyiniz.' },
      { status: 500 }
    );
  }
}
