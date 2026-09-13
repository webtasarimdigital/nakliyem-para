import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'bilgi@tasinteklif.com';

interface NotificationEmailPayload {
  type: 'NEW_OFFER' | 'FIRST_MESSAGE' | 'OFFER_ACCEPTED';
  to: string;
  recipientName?: string;
  carrierName?: string;
  customerName?: string;
  customerPhone?: string;
  price?: number | string;
  routeText?: string;
  movingDate?: string;
  messagePreview?: string;
  requestId?: string;
  conversationId?: string;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as NotificationEmailPayload;
    const { type, to, recipientName, carrierName, customerName, customerPhone, price, routeText, movingDate, messagePreview, requestId } = payload;

    if (!to || !to.includes('@')) {
      return NextResponse.json({ success: false, error: 'Geçersiz alıcı e-posta adresi.' }, { status: 400 });
    }

    let subject = '';
    let htmlContent = '';
    let textContent = '';

    const actionUrlBase = 'https://tasinteklif.com';

    if (type === 'NEW_OFFER') {
      subject = `🚚 Yeni Nakliyat Teklifi: ${carrierName || 'Onaylı Nakliyeci'} — ${price ? `${Number(price).toLocaleString('tr-TR')} TL` : 'Teklif Verildi'}`;
      const redirectPath = `/app/customer/teklifler${requestId ? `?reqId=${requestId}` : ''}`;
      const offersUrl = `${actionUrlBase}/giris?redirect=${encodeURIComponent(redirectPath)}`;

      textContent = `Sayın ${recipientName || 'Müşterimiz'},\n\n${carrierName || 'Bir nakliyat firması'} taşıma talebinize ${price ? `${Number(price).toLocaleString('tr-TR')} TL` : ''} fiyat teklifi verdi.${messagePreview && messagePreview !== 'Hızlı teklif iletildi.' ? `\n\nFirma Notu: "${messagePreview}"` : ''}\n\nGüzergah: ${routeText || 'Talebiniz'}\n\nTeklifi incelemek ve firmayla görüşmek için: ${offersUrl}\n\nTaşınTeklif Destek Ekibi`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background-color: #0A1128; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Taşın<span style="color: #F95700;">Teklif</span></h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Yeni Fiyat Teklifi Bildirimi</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Sayın <strong>${recipientName || 'Müşterimiz'}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Taşıma talebiniz için bölgenizdeki yetki belgeli nakliye firmasından yeni bir fiyat teklifi geldi!
            </p>
            
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Firma:</td>
                  <td style="color: #0f172a; font-weight: bold; text-align: right;">${carrierName || 'Onaylı Nakliyat'}</td>
                </tr>
                ${price ? `
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Teklif Tutarı:</td>
                  <td style="color: #F95700; font-weight: 900; font-size: 18px; text-align: right;">${Number(price).toLocaleString('tr-TR')} TL</td>
                </tr>` : ''}
                ${messagePreview && messagePreview !== 'Hızlı teklif iletildi.' ? `
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Firma Notu / Mesajı:</td>
                  <td style="color: #0f172a; font-weight: 600; font-style: italic; text-align: right;">&quot;${messagePreview}&quot;</td>
                </tr>` : ''}
                ${routeText ? `
                <tr>
                  <td style="color: #64748b; padding: 6px 0;">Güzergah:</td>
                  <td style="color: #0f172a; font-weight: 600; text-align: right;">${routeText}</td>
                </tr>` : ''}
              </table>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${offersUrl}" style="background-color: #F95700; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: bold; border-radius: 10px; display: inline-block;">
                Teklifi İncele & Firmayla Yazış →
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
              💡 Not: Firmanın kullanıcı yorumlarını, araç özelliklerini ve sigorta kapsamını panelinizden inceleyebilir, teklifi anında onaylayabilirsiniz.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
            TaşınTeklif • Türkiye'nin Akıllı Nakliyat Platformu<br>
            Destek: <a href="mailto:${ADMIN_EMAIL}" style="color: #F95700; text-decoration: none;">${ADMIN_EMAIL}</a>
          </div>
        </div>
      `;
    } else if (type === 'FIRST_MESSAGE') {
      subject = `💬 Müşterinizden Yeni Mesaj Var: ${customerName || 'Müşteri'}`;
      const messagesUrl = `${actionUrlBase}/app/carrier/mesajlar`;

      textContent = `Sayın ${carrierName || 'Yetkili'},\n\n${customerName || 'Müşteriniz'} teklif verdiğiniz taşıma talebiyle ilgili size bir mesaj gönderdi:\n\n"${messagePreview || 'Mesaj detayları panelinizde.'}"\n\nMesajı yanıtlamak için: ${messagesUrl}\n\nTaşınTeklif Ekibi`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background-color: #0A1128; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold;">Taşın<span style="color: #F95700;">Teklif</span></h1>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Müşteri İletişim Bildirimi</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Sayın <strong>${carrierName || 'Yetkili'}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Teklif verdiğiniz taşıma ilanıyla ilgili müşteri sizinle iletişime geçti:
            </p>
            
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #1e40af; font-weight: bold;">
                ${customerName || 'Müşteri'} dedi ki:
              </p>
              <p style="margin: 0; font-size: 14px; color: #1e293b; font-style: italic; line-height: 1.5;">
                "${messagePreview || 'Merhaba, teklifinizle ilgileniyorum.'}"
              </p>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${messagesUrl}" style="background-color: #111E38; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: bold; border-radius: 10px; display: inline-block;">
                Müşteriye Anında Yanıt Ver →
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
              ⚡ İpucu: Hızlı yanıt veren nakliye firmalarının anlaşma oranı %65 daha yüksektir.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
            TaşınTeklif Nakliyeci Destek Merkezi • <a href="mailto:${ADMIN_EMAIL}" style="color: #F95700; text-decoration: none;">${ADMIN_EMAIL}</a>
          </div>
        </div>
      `;
    } else if (type === 'OFFER_ACCEPTED') {
      subject = `🎉 Tebrikler! Teklifiniz Kabul Edildi: ${customerName || 'Müşteri'} — ${price ? `${Number(price).toLocaleString('tr-TR')} TL` : ''}`;
      const jobsUrl = `${actionUrlBase}/app/carrier/isler`;

      textContent = `Tebrikler ${carrierName || 'Yetkili'}!\n\n${customerName || 'Müşteriniz'} taşıma teklifinizi KABUL ETTİ!\n\nAnlaşılan Fiyat: ${price ? `${Number(price).toLocaleString('tr-TR')} TL` : 'Belirtildi'}\nMüşteri Telefon: ${customerPhone || 'Panelde açık'}\nGüzergah: ${routeText || 'Talebiniz'}\nTarih: ${movingDate || 'Belirtildi'}\n\nİş detaylarına gitmek için: ${jobsUrl}\n\nTaşınTeklif Ekibi`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden;">
          <div style="background-color: #059669; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">🎉 Anlaşma Sağlandı!</h1>
            <p style="color: #d1fae5; font-size: 13px; margin: 4px 0 0 0;">Teklifiniz Müşteri Tarafından Kabul Edildi</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="font-size: 15px; color: #1e293b; margin-top: 0;">Tebrikler <strong>${carrierName || 'Yetkili'}</strong>,</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              <strong>${customerName || 'Müşteriniz'}</strong> taşıma teklifinizi onayladı ve firmanızı seçti. Lütfen taşınma detaylarını teyit etmek için müşteriyle en kısa sürede iletişime geçiniz.
            </p>
            
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                ${price ? `
                <tr>
                  <td style="color: #166534; padding: 6px 0;">Anlaşılan Tutar:</td>
                  <td style="color: #047857; font-weight: 900; font-size: 18px; text-align: right;">${Number(price).toLocaleString('tr-TR')} TL</td>
                </tr>` : ''}
                <tr>
                  <td style="color: #166534; padding: 6px 0;">Müşteri:</td>
                  <td style="color: #0f172a; font-weight: bold; text-align: right;">${customerName || 'Müşteri'}</td>
                </tr>
                ${customerPhone ? `
                <tr>
                  <td style="color: #166534; padding: 6px 0;">Müşteri Telefonu:</td>
                  <td style="color: #0f172a; font-weight: bold; text-align: right;">
                    <a href="tel:${customerPhone}" style="color: #047857; font-weight: bold; text-decoration: none;">📞 ${customerPhone}</a>
                  </td>
                </tr>` : ''}
                ${routeText ? `
                <tr>
                  <td style="color: #166534; padding: 6px 0;">Güzergah:</td>
                  <td style="color: #0f172a; font-weight: 600; text-align: right;">${routeText}</td>
                </tr>` : ''}
                ${movingDate ? `
                <tr>
                  <td style="color: #166534; padding: 6px 0;">Taşınma Tarihi:</td>
                  <td style="color: #0f172a; font-weight: 600; text-align: right;">${movingDate}</td>
                </tr>` : ''}
              </table>
            </div>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${jobsUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: bold; border-radius: 10px; display: inline-block;">
                Taşınma İş Havuzuna Git →
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
              Hayırlı işler dileriz. Taşıma gününde müşteri memnuniyeti için ambalaj ve montaj süreçlerine özen göstermenizi rica ederiz.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #64748b;">
            TaşınTeklif • <a href="mailto:${ADMIN_EMAIL}" style="color: #F95700; text-decoration: none;">${ADMIN_EMAIL}</a>
          </div>
        </div>
      `;
    }

    // Send via Nodemailer (SMTP)
    const smtpHost = process.env.SMTP_HOST || 'mail.guzel.net.tr';
    const smtpUser = process.env.SMTP_USER || 'bilgi@tasinteklif.com';
    const smtpPass = process.env.SMTP_PASS || '6D3Sc0v7jr';

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    try {
      await transporter.sendMail({
        from: {
          name: 'TaşınTeklif Bildirim',
          address: process.env.SMTP_FROM || process.env.SMTP_USER || 'bilgi@tasinteklif.com',
        },
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[NOTIFICATION EMAIL SENT] Type: ${type} | To: ${to}`);
      return NextResponse.json({ success: true, message: 'Bildirim e-postası başarıyla gönderildi.' });
    } catch (sendErr: any) {
      console.warn(`[NOTIFICATION EMAIL ERROR] To: ${to} | Error: ${sendErr?.message}`);
      // Return success true with warning so client flow never blocks
      return NextResponse.json({ success: true, warning: sendErr?.message });
    }
  } catch (err: any) {
    console.error('send-email route error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Bilinmeyen hata.' }, { status: 500 });
  }
}
