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

    if (metadata?.isTrialCheckout === 'true') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const trialFile = path.join(process.cwd(), '.data', 'used_trials.json');
        if (fs.existsSync(trialFile)) {
          const trials = JSON.parse(fs.readFileSync(trialFile, 'utf-8'));
          const normPhone = customer?.phone ? String(customer.phone).replace(/\D/g, '').slice(-10) : '';
          const normEmail = customer?.email ? String(customer.email).trim().toLowerCase() : '';
          const already = trials.some((t: any) => 
            (normPhone && t.phone === normPhone) ||
            (normEmail && t.email === normEmail)
          );
          if (already) {
            return NextResponse.json(
              { error: 'Bu telefon numarası veya e-posta adresi ile daha önce 7 günlük ücretsiz deneme hakkı kullanılmıştır. Kampanyadan firma başına yalnızca 1 defa yararlanılabilir.' },
              { status: 400 }
            );
          }
        }
      } catch {}
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
