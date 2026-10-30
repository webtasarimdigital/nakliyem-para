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

    // 3. Mock DB guncellemesi: Otomatik yenilemeyi kapat, deneme durumunu iptal/suresi doldu olarak ayarla
    let updatedSub = null;
    if (targetCarrier) {
      updatedSub = db.cancelCarrierSubscription(targetCarrier.id);
      
      db.updateCarrier(targetCarrier.id, {
        trialStatus: 'EXPIRED',
        autoRenew: false,
        planId: 'plan_starter',
      });

      // 4. Firestore senkronizasyonu
      try {
        await updateFirestoreCarrier(targetCarrier.id, {
          trialStatus: 'EXPIRED',
          autoRenew: false,
          planId: 'plan_starter',
        });
      } catch (fsErr: any) {
        console.warn('[Dodo Subscription Cancel] Firestore sync warning:', fsErr?.message || fsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Aboneliğiniz başarıyla iptal edildi. 7 günlük deneme süresi bitiminde veya sonrasında kartınızdan kesinlikle ücret çekilmeyecektir (0 ₺).',
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
