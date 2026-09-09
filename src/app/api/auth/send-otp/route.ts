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

    // Check if user already exists — check BOTH Firebase Auth AND Firestore
    if (isFirebaseConfigured() && firestoreDb && firebaseAuth) {
      try {
        // 1a. Firebase Auth kontrolü (Google, email/şifre vs. HEPSİNİ yakalar)
        const signInMethods = await fetchSignInMethodsForEmail(firebaseAuth, normalizedEmail);
        if (signInMethods && signInMethods.length > 0) {
          return NextResponse.json(
            {
              error: 'ALREADY_REGISTERED',
              message: 'Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır.',
              email: normalizedEmail,
            },
            { status: 409 }
          );
        }
      } catch (authErr: any) {
        // fetchSignInMethodsForEmail hata verirse sessizce geç, Firestore kontrolüne dön
        console.warn('Firebase Auth email check warning:', authErr?.message);
      }

      try {
        // 1b. Firestore users koleksiyonu kontrolü (ek güvence)
        const existingUsers = await getDocs(
          query(collection(firestoreDb, 'users'), where('email', '==', normalizedEmail))
        );
        if (!existingUsers.empty) {
          return NextResponse.json(
            {
              error: 'ALREADY_REGISTERED',
              message: 'Bu e-posta adresi ile zaten kayıtlı bir hesap bulunmaktadır.',
              email: normalizedEmail,
            },
            { status: 409 }
          );
        }
      } catch (err) {
        console.warn('Firestore existing user check warning:', err);
      }
    }

    // 2. Generate 6-digit code and save with 3-minute expiry
    const verificationCode = generateNumericOtp();
    await saveOtp(email, verificationCode);

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

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"TaşınTeklif" <${smtpUser}>`,
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

    // 2. Resend API if configured
    if (!emailSent && process.env.RESEND_API_KEY) {
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

    return NextResponse.json({
      success: true,
      message: emailSent
        ? 'Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol ediniz.'
        : 'E-posta servisi yapılandırılmadığı için doğrulama kodunuz ekranda hazırlanmıştır.',
      expiresIn: 180, // 3 minutes in seconds
      emailSent,
      code: !emailSent ? verificationCode : undefined,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: error?.message || 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyiniz.' },
      { status: 500 }
    );
  }
}
