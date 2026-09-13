export interface SendNotificationOptions {
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

export async function sendNotificationEmail(options: SendNotificationOptions): Promise<boolean> {
  if (!options.to || !options.to.includes('@')) {
    return false;
  }

  try {
    const res = await fetch('/api/notifications/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.warn('sendNotificationEmail client error:', err);
    return false;
  }
}
