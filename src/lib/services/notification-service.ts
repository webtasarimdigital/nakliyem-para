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

/**
 * Her bir ilan (requestId) için her firmanın (carrierId) YALNIZCA İLK TEKLİFİNDE bildirim maili gönderilmesini sağlar.
 * - X firması İlan A için ilk teklifini verdiğinde: TRUE (Mail gönderilir)
 * - Y firması İlan A için ilk teklifini verdiğinde: TRUE (Mail gönderilir)
 * - X veya Y firması İlan A için teklifini güncellediğinde, yeni teklif attığında veya sohbet ettiğinde: FALSE (Mail gönderilmez)
 * - Müşteri 2. ilanını (İlan B) açtığında ve X firması İlan B'ye ilk teklifini verdiğinde: TRUE (Yeni ilan olduğu için mail gönderilir)
 */
export function shouldSendCarrierFirstOfferEmail(
  requestId: string,
  carrierId: string,
  existingOffersCountForThisCarrier: number = 0
): boolean {
  if (!requestId || !carrierId) return false;

  // 1. Veritabanında bu ilana ait bu firmanın önceden verilmiş bir teklifi varsa mail atılmaz
  if (existingOffersCountForThisCarrier > 0) {
    return false;
  }

  // 2. Tarayıcı depolama kontrolü (aynı oturumda / sayfa yenilemelerinde mükerrer mailleri engeller)
  if (typeof window !== 'undefined') {
    const storageKey = 'tasinteklif_first_offers_notified_v1';
    let registry: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) registry = JSON.parse(raw);
    } catch {}

    const pairKey = `${requestId}___${carrierId}`;
    if (registry[pairKey]) {
      return false; // Bu firmanın bu ilanı için daha önce bildirim maili gönderilmiş
    }

    // İlk teklif olarak işaretle
    registry[pairKey] = true;
    try {
      localStorage.setItem(storageKey, JSON.stringify(registry));
    } catch {}
  }

  return true;
}
