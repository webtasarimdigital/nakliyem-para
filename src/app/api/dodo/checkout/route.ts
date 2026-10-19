import { NextRequest, NextResponse } from 'next/server';
import { createDodoCheckoutSession } from '@/lib/dodo/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planKey, billingCycle, customer, metadata, returnUrl } = body;

    if (!planKey || !['starter', 'pro', 'gold'].includes(planKey)) {
      return NextResponse.json(
        { error: 'Geçersiz plan türü. starter, pro veya gold olmalıdır.' },
        { status: 400 }
      );
    }

    const session = await createDodoCheckoutSession({
      planKey,
      billingCycle: billingCycle || 'monthly',
      customer,
      metadata,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.checkout_url,
      sessionId: session.session_id,
    });
  } catch (error: any) {
    console.error('[Dodo Checkout API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Ödeme oturumu başlatılamadı' },
      { status: 500 }
    );
  }
}
