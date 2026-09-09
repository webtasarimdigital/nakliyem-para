import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const ADMIN_EMAIL = 'tasinteklif@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message, subject } = body;

    if (!message || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Lütfen mesajınızı ve iletişim bilginizi (e-posta veya telefon) eksiksiz girin.' },
        { status: 400 }
      );
    }

    const senderName = (name || 'Ziyaretçi').trim();
    const senderEmail = (email || 'Belirtilmedi').trim();
    const senderPhone = (phone || 'Belirtilmedi').trim();
    const emailSubject = subject || `🔔 Yeni Destek Mesajı: ${senderName} (TaşınTeklif)`;
    const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #111E38; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">TaşınTeklif — Canlı Destek & İletişim</h1>
          <p style="color: #F95700; margin: 6px 0 0 0; font-size: 13px; font-weight: bold;">Yeni Müşteri / Nakliyeci Mesajı</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: bold; width: 120px;">Gönderen Adı:</td>
              <td style="padding: 10px 0; font-size: 14px; color: #0f172a; font-weight: bold;">${senderName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: bold;">E-posta:</td>
              <td style="padding: 10px 0; font-size: 14px; color: #2563eb;">
                <a href="mailto:${senderEmail}" style="color: #2563eb; text-decoration: none;">${senderEmail}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: bold;">Telefon:</td>
              <td style="padding: 10px 0; font-size: 14px; color: #0f172a; font-weight: bold;">
                <a href="tel:${senderPhone}" style="color: #0f172a; text-decoration: none;">${senderPhone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; color: #64748b; font-weight: bold;">Tarih & Saat:</td>
              <td style="padding: 10px 0; font-size: 13px; color: #475569;">${now}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 10px;">
            <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">İletilen Mesaj:</div>
            <div style="font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 11px; color: #64748b;">
          Bu bildirim <a href="https://tasinteklif.com" style="color: #F95700; font-weight: bold;">TaşınTeklif</a> Canlı Destek sistemi üzerinden otomatik olarak iletilmiştir.
        </div>
      </div>
    `;

    const textBody = `
TaşınTeklif — Yeni Destek Mesajı
Gönderen: ${senderName}
E-posta: ${senderEmail}
Telefon: ${senderPhone}
Tarih: ${now}

Mesaj:
${message}
    `.trim();

    let emailSent = false;
    let errorDetails: string[] = [];

    // 1. STRATEGY 1: NODEMAILER (If SMTP or Gmail configured)
    const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : '');
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 465,
          secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"TaşınTeklif Canlı Destek" <${smtpUser}>`,
          to: ADMIN_EMAIL,
          replyTo: senderEmail !== 'Belirtilmedi' ? senderEmail : undefined,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        });

        emailSent = true;
      } catch (err: any) {
        console.warn('Nodemailer gönderimi başarısız:', err?.message);
        errorDetails.push(`Nodemailer: ${err?.message}`);
      }
    }

    // 2. STRATEGY 2: RESEND API (If RESEND_API_KEY configured)
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
            to: [ADMIN_EMAIL],
            subject: emailSubject,
            text: textBody,
            html: htmlBody,
          }),
        });
        if (res.ok) {
          emailSent = true;
        } else {
          const resErr = await res.text();
          errorDetails.push(`Resend: ${resErr}`);
        }
      } catch (err: any) {
        errorDetails.push(`Resend Exception: ${err?.message}`);
      }
    }

    // 3. STRATEGY 3: FormSubmit AJAX API (Free direct dispatch to tasinteklif@gmail.com with zero configuration)
    if (!emailSent) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            _subject: emailSubject,
            _template: 'box',
            Ad_Soyad: senderName,
            Eposta: senderEmail,
            Telefon: senderPhone,
            Tarih: now,
            Mesaj: message,
          }),
        });

        if (formSubmitRes.ok) {
          emailSent = true;
        }
      } catch (err: any) {
        errorDetails.push(`FormSubmit Exception: ${err?.message}`);
      }
    }

    // 4. STRATEGY 4: SAVE TO FIRESTORE (If configured)
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await addDoc(collection(firestoreDb, 'support_messages'), {
          name: senderName,
          email: senderEmail,
          phone: senderPhone,
          message,
          createdAt: new Date().toISOString(),
          status: 'UNREAD',
          adminNotified: emailSent,
        });
      } catch (err: any) {
        console.warn('Firestore support_messages kayıt hatası:', err?.message);
      }
    }

    // Log message for server tracking
    console.log('[SUPPORT MESSAGE]', {
      name: senderName,
      email: senderEmail,
      phone: senderPhone,
      message,
      emailSent,
    });

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi.',
      emailSent,
    });
  } catch (error: any) {
    console.error('Support API error:', error);
    return NextResponse.json(
      { error: 'Mesaj iletilirken bir sorun oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
