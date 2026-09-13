/**
 * Türkiye Cumhuriyeti Kimlik Numarası (TCKN) Doğrulama Algoritması
 *
 * Kurallar:
 * 1. 11 haneli ve sadece rakamlardan oluşmalıdır.
 * 2. İlk hane '0' (sıfır) olamaz.
 * 3. 1, 3, 5, 7 ve 9. hanelerin toplamının 7 katından, 2, 4, 6 ve 8. hanelerin toplamı
 *    çıkarıldığında elde edilen sonucun mod 10'u 10. haneyi vermelidir:
 *    ((1.+3.+5.+7.+9. haneler) * 7 - (2.+4.+6.+8. haneler)) % 10 = 10. hane
 * 4. İlk 10 hanenin toplamının mod 10'u 11. haneyi vermelidir.
 * 5. Son hane (11. hane) her zaman çift sayıdır, tek sayı olamaz.
 */

export interface TCKimlikValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateTCKimlik(tc: string): TCKimlikValidationResult {
  if (!tc) {
    return { isValid: false, error: 'TC Kimlik Numarası boş bırakılamaz.' };
  }

  const clean = tc.trim();

  if (!/^\d+$/.test(clean)) {
    return { isValid: false, error: 'TC Kimlik Numarası sadece rakamlardan oluşmalıdır.' };
  }

  if (clean.length !== 11) {
    return { isValid: false, error: 'TC Kimlik Numarası tam 11 haneli olmalıdır.' };
  }

  if (clean[0] === '0') {
    return { isValid: false, error: 'TC Kimlik Numarası 0 (sıfır) ile başlayamaz.' };
  }

  const d = clean.split('').map(Number);

  // Son hane tek sayı kontrolü
  if (d[10] % 2 !== 0) {
    return { isValid: false, error: 'TC Kimlik Numarasının son hanesi tek sayı olamaz.' };
  }

  // 10. hane kontrolü: ((tekler * 7) - ciftler) % 10 = 10. hane
  const oddSum = d[0] + d[2] + d[4] + d[6] + d[8];
  const evenSum = d[1] + d[3] + d[5] + d[7];
  const tenthDigit = ((oddSum * 7 - evenSum) % 10 + 10) % 10;

  if (tenthDigit !== d[9]) {
    return { isValid: false, error: 'Geçersiz TC Kimlik Numarası (Algoritma doğrulaması başarısız).' };
  }

  // 11. hane kontrolü: Ilk 10 hanenin toplaminin mod 10'u = 11. hane
  const sumFirst10 = d.slice(0, 10).reduce((acc, val) => acc + val, 0);
  if (sumFirst10 % 10 !== d[10]) {
    return { isValid: false, error: 'Geçersiz TC Kimlik Numarası (Kontrol hanesi eşleşmiyor).' };
  }

  return { isValid: true };
}
