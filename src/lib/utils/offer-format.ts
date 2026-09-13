/**
 * TaşınTeklif - Teklif Girişi Formatlayıcı ve Ayrıştırıcı
 * 
 * Nakliyecilerin hem sayısal (50000 -> 50.000) hem de doğal Türkçe ifadelerle
 * (50 bin tl olur hocam, 45 bin, 50k) teklif verebilmesini sağlar.
 */

/**
 * Kullanıcı giriş yaparken sayısal değerleri Türkçe binlik ayracıyla (.) formatlar.
 * Eğer kullanıcı metin/harf veya boşluk yazıyorsa (örn: 50 bin tl olur hocam, 50k, 50 bin ) serbest bırakır.
 */
export function formatOfferInputOnType(val: string): string {
  if (!val) return '';

  // Kullanıcı harf veya boşluk yazıyorsa serbestçe yazabilsin
  if (/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(val) || val.includes(' ')) {
    return val;
  }

  // Sadece rakamlar ve noktalar varsa binlik ayracı ile formatla
  const digits = val.replace(/\D/g, '');
  if (!digits) return '';

  const num = parseInt(digits, 10);
  if (isNaN(num)) return '';
  return num.toLocaleString('tr-TR');
}

export interface ParsedOfferInput {
  price: number;
  note: string;
  hasExplicitPrice: boolean;
}

/**
 * Kullanıcının yazdığı metinden fiyatı ve notu akıllıca çıkarır.
 * Örnekler:
 * - 50 bin tl olur hocam -> price: 50000, note: 50 bin tl olur hocam
 * - 50bin tl             -> price: 50000, note: 50bin tl
 * - 50 bin               -> price: 50000, note: 50 bin
 * - 50k                  -> price: 50000, note: 50k
 * - 50000 / 50.000     -> price: 50000, note: 50.000 TL teklif iletildi.
 * - 50.000 TL            -> price: 50000, note: 50.000 TL
 * - 50                   -> price: 50000, note: 50.000 TL teklif iletildi.
 */
export function parseOfferInput(input: string): ParsedOfferInput {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { price: 0, note: '', hasExplicitPrice: false };
  }

  // 1. bin, k, b gibi Türkçe kısaltmaları yakala: 50 bin, 50bin, 50,5 bin, 50.5 bin, 50k
  const binRegex = /(\d+(?:[.,]\d+)?)\s*(?:bin|k|b)\b/i;
  const binMatch = trimmed.match(binRegex);
  if (binMatch) {
    const rawNum = binMatch[1].replace(',', '.');
    const parsedNum = parseFloat(rawNum);
    if (!isNaN(parsedNum) && parsedNum > 0) {
      return {
        price: Math.round(parsedNum * 1000),
        note: trimmed,
        hasExplicitPrice: true,
      };
    }
  }

  // 2. Noktayla formatlanmış binlik sayıları yakala: 50.000, 50.000 TL, 125.500
  const formattedThousandsRegex = /(\d{1,3}(?:\.\d{3})+)/;
  const formattedMatch = trimmed.match(formattedThousandsRegex);
  if (formattedMatch) {
    const cleaned = formattedMatch[1].replace(/\./g, '');
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return {
        price: parsed,
        note: trimmed.length > formattedMatch[1].length ? trimmed : `${parsed.toLocaleString('tr-TR')} TL teklif iletildi.`,
        hasExplicitPrice: true,
      };
    }
  }

  // 3. Düz sayıları yakala: 50000, 50000 TL, hocam 45000 olur
  const numberRegex = /(\d+)/g;
  const allNums = trimmed.match(numberRegex);
  if (allNums && allNums.length > 0) {
    for (const numStr of allNums) {
      const val = parseInt(numStr, 10);
      if (val >= 1000) {
        return {
          price: val,
          note: trimmed.length > numStr.length ? trimmed : `${val.toLocaleString('tr-TR')} TL teklif iletildi.`,
          hasExplicitPrice: true,
        };
      }
    }

    // 500'den küçük sayılar (örn: 50, 35, 50 tl olur) nakliyede bin olarak kullanılır
    const firstNum = parseInt(allNums[0], 10);
    if (firstNum > 0) {
      const price = firstNum < 500 ? firstNum * 1000 : firstNum;
      return {
        price,
        note: trimmed.length > allNums[0].length ? trimmed : `${price.toLocaleString('tr-TR')} TL teklif iletildi.`,
        hasExplicitPrice: true,
      };
    }
  }

  return {
    price: 0,
    note: trimmed,
    hasExplicitPrice: false,
  };
}
