/**
 * Telefon Numarasi Dogrulama ve Normalizasyon Yardimcisi
 * 
 * Turkiye telefon numaralarini (05XX, 5XX, +905XX) tek standart 10 haneli
 * formata (5XXXXXXXXX) donusturerek mukerrer kayit ve ucretsiz surum suistimalini engeller.
 */

export function normalizePhoneNumber(raw: string): string {
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('90')) {
    digits = digits.slice(2);
  } else if (digits.length === 13 && digits.startsWith('090')) {
    digits = digits.slice(3);
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  return digits;
}

export function validatePhoneNumber(raw: string): {
  isValid: boolean;
  error?: string;
  normalized: string;
} {
  const normalized = normalizePhoneNumber(raw);

  if (!normalized) {
    return { isValid: false, error: 'Lütfen cep telefonu numaranızı giriniz.', normalized: '' };
  }

  if (normalized.length !== 10) {
    return {
      isValid: false,
      error: 'Telefon numarası 10 haneli olmalıdır (Örn: 5XX XXX XX XX).',
      normalized,
    };
  }

  if (!normalized.startsWith('5')) {
    return {
      isValid: false,
      error: 'Geçerli bir Türkiye cep telefonu numarası giriniz (5 ile başlamalıdır).',
      normalized,
    };
  }

  return { isValid: true, normalized };
}

export function formatPhoneNumber(raw: string): string {
  const norm = normalizePhoneNumber(raw);
  if (norm.length !== 10) return raw;
  return '0' + norm.slice(0, 3) + ' ' + norm.slice(3, 6) + ' ' + norm.slice(6, 8) + ' ' + norm.slice(8, 10);
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || '';
  const parts = email.split('@');
  const user = parts[0];
  const domain = parts[1];
  if (user.length <= 2) {
    return user + '***@' + domain;
  }
  const visible = user.slice(0, 2);
  return visible + '***@' + domain;
}
