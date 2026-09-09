import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { validateEmailAddress } from '@/lib/validation/email';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'tasinteklif@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, role, companyName } = body;

    const emailCheck = validateEmailAddress(email);
    if (!emailCheck.isValid) {
      return NextResponse.json({ error: emailCheck.error }, { status: 400 });
    }

    const recipientName = (role === 'CARRIER' && companyName ? companyName : name) || 'Değerli Üyemiz';
    const isCarrier = role === 'CARRIER';
    const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
    
    // Resolve origin
    const origin = req.nextUrl.origin || 'https://tasinteklif.com';
    const verifyUrl = `${origin}/dogrula?email=${encodeURIComponent(email)}&code=${verificationCode}`;

    const subject = isCarrier
      ? `🚛 TaşınTeklif Nakliyeci Ailesine Hoş Geldiniz! (Hesap Doğrulama Kodu: ${verificationCode})`
      : `✨ TaşınTeklif'e Hoş Geldiniz! (E-posta Doğrulama Kodu: ${verificationCode})`;

    const roleSpecificText = isCarrier
      ? `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <h4 style="color: #166534; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">🚛 Nakliyeci Profiliniz Aktifleştirildi</h4>
          <p style="color: #15803d; margin: 0; font-size: 13px; line-height: 1.5;">
            Tebrikler! TaşınTeklif Taşıyıcı Ağı'na başarıyla katıldınız. Paneliniz üzerinden Türkiye genelindeki binlerce evden eve, ofis ve parça eşya nakliyat talebine anında fiyat teklifi verebilir, boş dönüşlerinizi doldurabilirsiniz.
          </p>
        </div>
      `
      : `
        <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 10px; padding: 16px; margin: 20px 0;">
          <h4 style="color: #9a3412; margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">🏠 Güvenilir Taşınmanın En Kolay Yolu</h4>
          <p style="color: #c2410c; margin: 0; font-size: 13px; line-height: 1.5;">
            TaşınTeklif ile 81 ilde onaylı nakliyat firmalarından 2 dakika içinde ücretsiz fiyat teklifi alabilir, teklifleri ve firma puanlarını karşılaştırarak komisyonsuz taşınabilirsiniz.
          </p>
        </div>
      `;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background-color: #111E38; padding: 32px 24px; text-align: center; }
          .logo { color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; text-decoration: none; }
          .logo span { color: #F95700; }
          .tagline { color: #94a3b8; font-size: 12px; margin-top: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 32px 28px; }
          .greeting { font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 20px; }
          .code-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .code-label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .code-number { font-size: 32px; font-weight: 900; color: #111E38; letter-spacing: 8px; font-family: monospace; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { display: inline-block; background-color: #F95700; color: #ffffff !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(249, 87, 0, 0.3); }
          .features { border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; }
          .feature-item { font-size: 12px; color: #64748b; margin-bottom: 8px; font-weight: 600; }
          .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <a href="${origin}" class="logo">Taşın<span>Teklif</span></a>
            <div class="tagline">Türkiye'nin Akıllı Nakliyat Platformu</div>
          </div>
          
          <div class="content">
            <div class="greeting">Merhaba Sayın ${recipientName},</div>
            <div class="intro">
              TaşınTeklif'e kaydınız başarıyla alındı! Güvenliğiniz için hesabınızı doğrulamanız gerekmektedir. Aşağıdaki 6 haneli doğrulama kodunu kullanarak veya doğrudan doğrulama butonuna tıklayarak hesabınızı onaylayabilirsiniz.
            </div>

            <div class="code-box">
              <div class="code-label">E-posta Doğrulama Kodunuz</div>
              <div class="code-number">${verificationCode}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Kod 24 saat boyunca geçerlidir.</div>
            </div>

            <div class="btn-container">
              <a href="${verifyUrl}" class="btn">Hesabımı Hemen Doğrula →</a>
            </div>

            ${roleSpecificText}

            <div class="features">
              <div class="feature-item">🛡️ <strong>%100 Güvenli & Komisyonsuz:</strong> Gizli ücretler veya sürpriz masraflar yok.</div>
              <div class="feature-item">⚡ <strong>Hızlı & Kolay:</strong> Talebinizi oluşturun, onaylı firmalar anında teklif versin.</div>
              <div class="feature-item">📞 <strong>Canlı Destek:</strong> Sorularınız için 7/24 yanınızdayız.</div>
            </div>
          </div>

          <div class="footer">
            Bu e-posta TaşınTeklif (${origin}) üyeliğiniz sebebiyle gönderilmiştir.<br>
            Eğer bu hesabı siz açmadıysanız bu e-postayı güvenle dikkate almayabilirsiniz.<br>
            Destek: <a href="mailto:${ADMIN_EMAIL}" style="color: #F95700; text-decoration: none;">${ADMIN_EMAIL}</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `
TaşınTeklif'e Hoş Geldiniz!
Merhaba Sayın ${recipientName},

TaşınTeklif hesabınız oluşturuldu. E-posta doğrulama kodunuz:
${verificationCode}

Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayabilirsiniz:
${verifyUrl}

TaşınTeklif Ekibi
${ADMIN_EMAIL}
    `.trim();

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
        console.warn('Nodemailer welcome mail failed:', err?.message);
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
        console.warn('Resend welcome mail failed:', err?.message);
      }
    }

    // 3. Fallback notification to admin email as backup log
    if (!emailSent) {
      try {
        await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `🔔 Yeni Kayıt & Doğrulama Kodu: ${recipientName} (${email})`,
            Ad_Soyad: recipientName,
            Eposta: email,
            Rol: role,
            Dogrulama_Kodu: verificationCode,
            Dogrulama_Linki: verifyUrl,
          }),
        });
      } catch {
        // ignore
      }
    }

    // Save verification code to Firestore if configured
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'email_verifications', email), {
          email,
          name: recipientName,
          role,
          code: verificationCode,
          verified: false,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore verification save error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Hoş geldin ve doğrulama e-postası başarıyla gönderildi.',
      verificationCode,
      emailSent,
    });
  } catch (err: any) {
    console.error('Welcome email API error:', err);
    return NextResponse.json(
      { error: 'E-posta gönderilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
