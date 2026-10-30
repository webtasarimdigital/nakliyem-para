import { NextRequest, NextResponse } from 'next/server';
import { cancelDodoSubscription } from '@/lib/dodo/client';
import { db } from '@/lib/data/mock-db';
import { updateFirestoreCarrier } from '@/lib/firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carrierId, subscriptionId } = body;

    if (!carrierId && !subscriptionId) {
      return NextResponse.json(
        { error: 'carrierId veya subscriptionId belirtilmelidir.' },
        { status: 400 }
      );
    }

    // 1. Nakliyeci profilini ve aboneligini tespit et
    let targetCarrier = null;
    if (carrierId) {
      targetCarrier = db.getCarrierById(carrierId) || db.getCarriers().find(c => c.id === carrierId);
    }

    const carrierSub = targetCarrier ? db.getCarrierSubscription(targetCarrier.id) : null;
    const activeSubId = subscriptionId || carrierSub?.dodoSubscriptionId || targetCarrier?.dodoSubscriptionId;

    // 2. Dodo Payments API uzerinden aboneligi iptal et (Tekrarlayan cekimi engelle)
    let dodoCancelResult = null;
    if (activeSubId) {
      try {
        dodoCancelResult = await cancelDodoSubscription(activeSubId);
        console.log(`[Dodo Subscription Cancel] Dodo API cancel result for ${activeSubId}:`, dodoCancelResult);
      } catch (dodoErr: any) {
        console.warn(`[Dodo Subscription Cancel] Dodo API call warning:`, dodoErr?.message || dodoErr);
      }
    }

    // 3. Durum Tespiti: 7 Günlük Deneme mi yoksa Ücretli Abonelik mi?
    let updatedSub = null;
    let isTrial = false;
    let validUntilDate = '';
    let responseMessage = '';

    if (targetCarrier) {
      const now = Date.now();
      const trialEndMs = targetCarrier.trialEndsAt ? new Date(targetCarrier.trialEndsAt).getTime() : 0;
      isTrial = Boolean(targetCarrier.trialStatus === 'ACTIVE_TRIAL' && trialEndMs > now);

      updatedSub = db.cancelCarrierSubscription(targetCarrier.id);

      if (isTrial) {
        // 7 Günlük Deneme İptali:
        // Süre sonuna kadar Pro hakları devam eder. Süre bitiminde 0 ₺ olarak Starter'a geçer.
        const trialEndDate = new Date(trialEndMs);
        validUntilDate = trialEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        responseMessage = `${validUntilDate} tarihine kadar 7 günlük Pro deneme haklarınız geçerlidir. 7 gün dolduğunda kartınızdan KESİNLİKLE HİÇBİR ÜCRET ÇEKİLMEYECEKTİR (0 ₺).`;

        db.updateCarrier(targetCarrier.id, {
          autoRenew: false,
        });

        try {
          await updateFirestoreCarrier(targetCarrier.id, {
            autoRenew: false,
            trialStatus: 'ACTIVE_TRIAL',
          });
        } catch (fsErr: any) {
          console.warn('[Dodo Subscription Cancel] Firestore sync warning:', fsErr?.message || fsErr);
        }
      } else {
        // 7 Gün Sonrası / Normal Ücretli Abonelik İptali:
        const periodEndDate = carrierSub?.currentPeriodEnd 
          ? new Date(carrierSub.currentPeriodEnd) 
          : new Date(now + 30 * 24 * 60 * 60 * 1000);
        validUntilDate = periodEndDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        responseMessage = `${validUntilDate} tarihine kadar Pro hesabınız geçerlidir. Gelecek ay yenileme veya ücret çekimi olmayacaktır.`;

        db.updateCarrier(targetCarrier.id, {
          autoRenew: false,
        });

        try {
          await updateFirestoreCarrier(targetCarrier.id, {
            autoRenew: false,
          });
        } catch (fsErr: any) {
          console.warn('[Dodo Subscription Cancel] Firestore sync warning:', fsErr?.message || fsErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      isTrial,
      validUntilDate,
      message: responseMessage || 'Aboneliğiniz başarıyla iptal edildi. Süre bitiminde kartınızdan ücret çekilmeyecektir.',
      subscription: updatedSub,
      dodoCancelled: Boolean(dodoCancelResult?.success),
    });
  } catch (error: any) {
    console.error('[Dodo Subscription Cancel Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Abonelik iptal edilemedi.' },
      { status: 500 }
    );
  }
}
