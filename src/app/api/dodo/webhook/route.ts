import { NextRequest, NextResponse } from 'next/server';
import { verifyDodoWebhookSignature } from '@/lib/dodo/client';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// In-memory deduplication cache across serverless instance lifecycles
const recentlySentPaymentEmailKeys = new Set<string>();

async function hasPaymentEmailBeenSent(key: string): Promise<boolean> {
  if (recentlySentPaymentEmailKeys.has(key)) return true;
  if (!isFirebaseConfigured() || !firestoreDb) return false;
  try {
    const snap = await getDoc(doc(firestoreDb, 'sent_payment_emails', key));
    return snap.exists();
  } catch {
    return false;
  }
}

async function markPaymentEmailAsSent(key: string, data: any): Promise<void> {
  recentlySentPaymentEmailKeys.add(key);
  if (recentlySentPaymentEmailKeys.size > 2000) {
    const first = recentlySentPaymentEmailKeys.values().next().value;
    if (first) recentlySentPaymentEmailKeys.delete(first);
  }
  if (!isFirebaseConfigured() || !firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, 'sent_payment_emails', key), {
      ...data,
      sentAt: serverTimestamp(),
    });
  } catch (err: any) {
    console.warn('[Dodo Webhook] markPaymentEmailAsSent warning:', err.message);
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'TaşınTeklif Dodo Payments Webhook Endpoint',
    version: '1.0',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const webhookId = req.headers.get('webhook-id');
    const webhookTimestamp = req.headers.get('webhook-timestamp');
    const webhookSignature = req.headers.get('webhook-signature');

    // Verify webhook authenticity via HMAC-SHA256
    const verification = verifyDodoWebhookSignature(rawBody, {
      webhookId,
      webhookTimestamp,
      webhookSignature,
    });

    if (!verification.isValid) {
      console.warn('[Dodo Webhook] Verification failed:', verification.error);
      return NextResponse.json(
        { error: verification.error || 'Invalid signature' },
        { status: 400 }
      );
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const eventType = payload.type || payload.event;
    const eventData = payload.data || {};

    console.log(`[Dodo Webhook] Received verified event: ${eventType}`, {
      id: eventData.payment_id || eventData.subscription_id || eventData.id,
      customerEmail: eventData.customer?.email,
      metadata: eventData.metadata
    });

    const metadata = eventData.metadata || {};
    const customerEmail = eventData.customer?.email || metadata.customerEmail;
    const planKey = metadata.planKey || 'gold';
    const carrierId = metadata.carrierId;
    const userId = metadata.userId;

    // Map plan key to internal plan ID
    const planIdMap: Record<string, string> = {
      starter: 'plan_starter',
      pro: 'plan_pro',
      gold: 'plan_gold',
      starter_yearly: 'plan_starter',
      pro_yearly: 'plan_pro',
      gold_yearly: 'plan_gold',
    };
    const targetPlanId = planIdMap[planKey] || 'plan_gold';

    // ── EVENT: PAYMENT SUCCEEDED / SUBSCRIPTION ACTIVE ──
    if (
      eventType === 'payment.succeeded' ||
      eventType === 'subscription.active' ||
      eventType === 'subscription.renewed' ||
      eventType === 'subscription.updated'
    ) {
      let matchedCarrier = null;

      // 1. Try to find carrier by ID
      if (carrierId) {
        matchedCarrier = db.getCarriers().find(c => c.id === carrierId);
      }

      // 2. Try to find carrier by User ID
      if (!matchedCarrier && userId) {
        matchedCarrier = db.getCarriers().find(c => c.userId === userId);
      }

      // 3. Try to find carrier by email
      if (!matchedCarrier && customerEmail) {
        matchedCarrier = db.getCarriers().find(
          c => c.email?.toLowerCase() === customerEmail.toLowerCase()
        );
        if (!matchedCarrier) {
          const user = db.getUsers().find(
            u => u.email?.toLowerCase() === customerEmail.toLowerCase()
          ) as any;
          if (user?.carrierProfileId) {
            matchedCarrier = db.getCarriers().find(c => c.id === user.carrierProfileId);
          }
        }
      }

      // If matched, upgrade the carrier plan & renew subscription
      if (matchedCarrier) {
        db.updateCarrier(matchedCarrier.id, {
          planId: targetPlanId,
          trialStatus: 'CONVERTED',
          autoRenew: true,
        });
        db.renewCarrierSubscription(matchedCarrier.id, targetPlanId);

        // Also sync to Firestore if enabled
        updateFirestoreCarrier(matchedCarrier.id, {
          planId: targetPlanId,
          trialStatus: 'CONVERTED',
        }).catch(err => {
          console.warn('[Dodo Webhook] Firestore sync warning:', err.message);
        });

        console.log(`[Dodo Webhook] Successfully activated ${targetPlanId} for carrier ${matchedCarrier.id}`);
      }

      // Send confirmation email via SMTP (ONLY ONCE upon activation, never on repeated updates)
      const isActivationEvent = 
        eventType === 'subscription.active' || 
        (eventType === 'payment.succeeded' && !eventData.subscription_id);

      // Primary dedup key based on subscription or payment ID
      const emailDedupKey = eventData.subscription_id 
        ? `sub_${eventData.subscription_id}` 
        : (eventData.payment_id ? `pay_${eventData.payment_id}` : `evt_${eventData.id || webhookId || customerEmail}`);

      if (isActivationEvent && customerEmail && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          const alreadySent = await hasPaymentEmailBeenSent(emailDedupKey);

          if (alreadySent) {
            console.log(`[Dodo Webhook] Confirmation email already sent for ${emailDedupKey}, skipping duplicate notification.`);
          } else {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'mail.guzel.net.tr',
              port: Number(process.env.SMTP_PORT) || 465,
              secure: true,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });

            const planNames: Record<string, string> = {
              starter: 'Başlangıç Paketi',
              pro: 'Pro Paketi',
              gold: 'Gold (En Üst) Paketi',
            };
            const friendlyPlanName = planNames[planKey] || 'Gold Paketi';

            await transporter.sendMail({
              from: `"TaşınTeklif Ödeme Servisi" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
              to: customerEmail,
              subject: `Ödemeniz Alındı — ${friendlyPlanName} Aboneliğiniz Aktif!`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #111E38; margin: 0; font-size: 24px;">TAŞIN<span style="color: #F95700;">TEKLİF</span></h1>
                    <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Güvenli Ödeme Doğrulaması (Dodo Payments)</p>
                  </div>
                  <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <p style="color: #065f46; font-weight: bold; margin: 0;">✅ Ödemeniz Başarıyla Alındı!</p>
                    <p style="color: #047857; font-size: 14px; margin: 5px 0 0 0;">
                      <strong>${friendlyPlanName}</strong> üyeliğiniz firmanıza başarıyla tanımlandı.
                    </p>
                  </div>
                  <div style="font-size: 14px; color: #334155; line-height: 1.6;">
                    <p>Sayın Yetkili,</p>
                    <p>Dodo Payments altyapısı üzerinden gerçekleştirdiğiniz üyelik ödemesi onaylandı. Artık platform üzerindeki iş fırsatlarına teklif verebilir, doğrudan müşterilerle görüşebilirsiniz.</p>
                    <div style="text-align: center; margin: 25px 0;">
                      <a href="https://www.tasinteklif.com/app/carrier" style="background-color: #F95700; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                        Nakliyeci Paneline Git →
                      </a>
                    </div>
                  </div>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                    TaşınTeklif Teknoloji ve Bilişim Hizmetleri · Dodo Payments MoR Altyapısı
                  </p>
                </div>
              `,
            });

            await markPaymentEmailAsSent(emailDedupKey, {
              customerEmail,
              carrierId: matchedCarrier?.id,
              planKey,
              eventType,
              subscriptionId: eventData.subscription_id || null,
              paymentId: eventData.payment_id || null,
            });

            console.log(`[Dodo Webhook] Confirmation email sent successfully to ${customerEmail} (key: ${emailDedupKey})`);
          }
        } catch (emailErr: any) {
          console.warn('[Dodo Webhook] Failed to process/send email:', emailErr.message);
        }
      }
    }

    // ── EVENT: SUBSCRIPTION CANCELLED OR EXPIRED ──
    if (eventType === 'subscription.cancelled' || eventType === 'subscription.expired') {
      let matchedCarrier = null;
      if (carrierId) {
        matchedCarrier = db.getCarriers().find(c => c.id === carrierId || c.userId === carrierId);
      }
      if (!matchedCarrier && customerEmail) {
        matchedCarrier = db.getCarriers().find(c => c.email?.toLowerCase() === customerEmail.toLowerCase());
      }
      if (!matchedCarrier && customerEmail) {
        const u = db.getUsers().find(user => user.email?.toLowerCase() === customerEmail.toLowerCase()) as any;
        if (u?.carrierProfileId) {
          matchedCarrier = db.getCarriers().find(c => c.id === u.carrierProfileId);
        }
      }
      if (matchedCarrier) {
        db.updateCarrier(matchedCarrier.id, { 
          planId: 'plan_starter',
          trialStatus: 'EXPIRED',
          autoRenew: false
        });
        db.cancelCarrierSubscription(matchedCarrier.id);
        updateFirestoreCarrier(matchedCarrier.id, { 
          planId: 'plan_starter',
          trialStatus: 'EXPIRED',
          autoRenew: false
        }).catch(() => {});
        console.log(`[Dodo Webhook] Carrier ${matchedCarrier.id} cancelled/expired, downgraded to starter due to ${eventType}`);
      }
    }

    return NextResponse.json({
      received: true,
      event: eventType,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Dodo Webhook Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
