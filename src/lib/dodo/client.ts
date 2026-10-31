import crypto from 'crypto';

export const DODO_CONFIG = {
  apiKey: process.env.DODO_PAYMENTS_API_KEY || 'FWUwEnFGORn-IqFX.kjN6Z0hqWDodQEeKIguV0iDAObX5QlJPwC5ToAn4gvkdn7uN',
  brandId: process.env.DODO_PAYMENTS_BRAND_ID || 'brnd_0Nq4im18A1Ts2aB1TStXx',
  webhookSecret: process.env.DODO_PAYMENTS_WEBHOOK_SECRET || 'whsec_YRV8jPXtj1beBZo7LXPHCnBgc8eVhtI0',
  webhookId: process.env.DODO_PAYMENTS_WEBHOOK_ID || 'ep_3KueqOalzELxtXD8GVkVHqTK90e',
  testProductId: process.env.DODO_TEST_PRODUCT_ID || 'pdt_0NlJmVowt63o3bdQdXjMA',
  environment: (process.env.DODO_PAYMENTS_ENVIRONMENT || 'live_mode') as 'live_mode' | 'test_mode',
  baseUrl: (process.env.DODO_PAYMENTS_ENVIRONMENT || 'live_mode') === 'live_mode' 
    ? 'https://live.dodopayments.com' 
    : 'https://test.dodopayments.com',
};

// Webhook secrets to verify signatures
const KNOWN_SECRETS = [
  DODO_CONFIG.webhookSecret,
  'whsec_YRV8jPXtj1beBZo7LXPHCnBgc8eVhtI0',
  process.env.DODO_TEST_PAYMENTS_WEBHOOK_SECRET,
  'whsec_rDYHmQlu+uQhXGFGAAIoZV6ZblwQv02q',
].filter(Boolean) as string[];

// Dodo Payments Product ID mappings for TaşınTeklif plans
export const DODO_PRODUCT_MAP: Record<string, string> = {
  // Test mode product provided by user
  test: 'pdt_0NlJmVowt63o3bdQdXjMA',
  // Live mode products (Güncel Fiyatlar - ₺1.199, ₺2.990, ₺5.990)
  starter: 'pdt_0NqrUwnU6UGhZEjaqdgES',
  pro: 'pdt_0NqrUwrUfS1xSmpU3umYU',
  gold: 'pdt_0NqrUwvgW3tE8vEm697UD',
  starter_yearly: 'pdt_0NqrUwzyTHEKDNSdMN2De',
  pro_yearly: 'pdt_0NqrUx4yyfKl5y6JRySnc',
  gold_yearly: 'pdt_0NqrUx92WUbxwNDyyB3Mc',
};

export interface CreateCheckoutParams {
  planKey: 'starter' | 'pro' | 'gold' | string;
  billingCycle?: 'monthly' | 'yearly';
  customer?: {
    email?: string;
    name?: string;
    phone?: string;
  };
  metadata?: Record<string, string>;
  returnUrl?: string;
}

export interface CheckoutSessionResult {
  session_id: string;
  checkout_url: string;
  isTestMode: boolean;
}

/**
 * Normalizes phone numbers to standard E.164 format for Dodo Payments (+90...)
 */
function formatE164Phone(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;

  // 05321234567 (11 digits, starts with 0) -> +905321234567
  if (digits.startsWith('0') && digits.length === 11) {
    return `+90${digits.substring(1)}`;
  }
  // 905321234567 (12 digits, starts with 90) -> +90${digits.substring(2)}
  if (digits.startsWith('90') && digits.length === 12) {
    return `+${digits}`;
  }
  // 5321234567 (10 digits) -> +905321234567
  if (digits.length === 10) {
    return `+90${digits}`;
  }
  // Generic international digits (between 11 and 15 digits)
  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`;
  }
  return undefined;
}

/**
 * Creates a Dodo Payments hosted checkout session
 */
export async function createDodoCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSessionResult> {
  const isTest = DODO_CONFIG.environment === 'test_mode';
  const isYearly = params.billingCycle === 'yearly';
  const lookupKey = isYearly ? `${params.planKey}_yearly` : params.planKey;

  // In test mode, use the test product ID requested by the user
  const productId = isTest 
    ? (DODO_CONFIG.testProductId || 'pdt_0NlJmVowt63o3bdQdXjMA')
    : (DODO_PRODUCT_MAP[lookupKey] || DODO_PRODUCT_MAP[params.planKey]);

  if (!productId) {
    throw new Error(`Dodo Payments Product ID not found for plan: ${lookupKey}`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tasinteklif.com';
  const returnUrl = params.returnUrl || `${siteUrl}/odeme/sonuc?plan=${params.planKey}&cycle=${params.billingCycle || 'monthly'}`;

  const bodyPayload: any = {
    product_cart: [
      {
        product_id: productId,
        quantity: 1,
      }
    ],
    return_url: returnUrl,
    brand_id: DODO_CONFIG.brandId,
    metadata: {
      platform: 'tasinteklif',
      brand_id: DODO_CONFIG.brandId,
      planKey: params.planKey,
      billingCycle: params.billingCycle || 'monthly',
      ...params.metadata,
    }
  };

  if (params.customer) {
    const customerObj: Record<string, string> = {};
    if (params.customer.email && params.customer.email.includes('@')) {
      customerObj.email = params.customer.email.trim();
    }
    if (params.customer.name && params.customer.name.trim()) {
      customerObj.name = params.customer.name.trim();
    }
    const formattedPhone = formatE164Phone(params.customer.phone);
    if (formattedPhone) {
      customerObj.phone_number = formattedPhone;
    }
    if (Object.keys(customerObj).length > 0) {
      bodyPayload.customer = customerObj;
    }
  }

  const response = await fetch(`${DODO_CONFIG.baseUrl}/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DODO_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dodo Payments Checkout Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return {
    session_id: data.session_id,
    checkout_url: data.checkout_url,
    isTestMode: isTest,
  };
}

/**
 * Verifies standard webhook signatures from Dodo Payments (Standard Webhooks / HMAC-SHA256)
 */
export function verifyDodoWebhookSignature(
  rawBody: string,
  headers: {
    webhookId?: string | null;
    webhookTimestamp?: string | null;
    webhookSignature?: string | null;
  },
  secretOverride?: string
): { isValid: boolean; error?: string } {
  const webhookId = headers.webhookId;
  const webhookTimestamp = headers.webhookTimestamp;
  const webhookSignature = headers.webhookSignature;

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return { isValid: false, error: 'Missing required webhook headers (webhook-id, webhook-timestamp, webhook-signature)' };
  }

  // 1. Check timestamp tolerance (prevent replay attacks older than 5 minutes / 300 seconds)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const eventTimestamp = parseInt(webhookTimestamp, 10);
  if (isNaN(eventTimestamp) || Math.abs(currentTimestamp - eventTimestamp) > 300) {
    return { isValid: false, error: 'Webhook timestamp outside 5-minute tolerance limit' };
  }

  const secretsToTry = secretOverride ? [secretOverride] : KNOWN_SECRETS;
  if (!secretsToTry.length) {
    return { isValid: false, error: 'Webhook secret is not configured' };
  }

  // 2. Construct signature payload: `${webhook-id}.${webhook-timestamp}.${rawBody}`
  const signaturePayload = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const incomingSignatures = webhookSignature.split(' ');

  for (const secret of secretsToTry) {
    // Decode secret (Strip 'whsec_' prefix if present, decode base64)
    let rawSecret = secret;
    if (rawSecret.startsWith('whsec_')) {
      rawSecret = rawSecret.substring(6);
    }
    const secretBuffer = Buffer.from(rawSecret, 'base64');

    // Compute HMAC-SHA256
    const computedHash = crypto
      .createHmac('sha256', secretBuffer)
      .update(signaturePayload)
      .digest('base64');
    const expectedSignature = `v1,${computedHash}`;

    // Constant-time comparison against incoming signatures
    for (const sig of incomingSignatures) {
      try {
        const sigBuf = Buffer.from(sig);
        const expectedBuf = Buffer.from(expectedSignature);
        if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) {
          return { isValid: true };
        }
      } catch {
        // Ignore byte comparison errors
      }
    }
  }

  return { isValid: false, error: 'Invalid webhook signature' };
}

/**
 * Cancels a Dodo Payments subscription to ensure no recurring charges occur after trial or current period.
 */
export async function cancelDodoSubscription(subscriptionId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!subscriptionId) {
    return { success: false, error: 'Subscription ID is required' };
  }

  try {
    const response = await fetch(`${DODO_CONFIG.baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${DODO_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cancel_at_next_billing_date: true,
        cancellation_feedback: 'customer_service',
        cancellation_comment: 'Customer cancelled subscription via profile. No recurring charges.',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Dodo Payments] Subscription cancel warning (${response.status}):`, errorText);
      return { success: false, error: errorText };
    }

    const data = await response.json();
    console.log(`[Dodo Payments] Subscription ${subscriptionId} successfully cancelled:`, data);
    return { success: true, data };
  } catch (err: any) {
    console.warn('[Dodo Payments] Subscription cancel exception:', err?.message || err);
    return { success: false, error: err?.message || String(err) };
  }
}

