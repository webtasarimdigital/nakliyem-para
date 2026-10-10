/**
 * Turkish-aware SEO Slug & Normalization Utilities
 * Handles Turkish characters (İ, ı, ğ, ü, ş, ö, ç) and prevents combining diacritical mark issues (\u0307).
 */

export function slugifyTurkish(text: string): string {
  if (!text) return '';

  return (
    text
      // Handle uppercase Turkish characters before any toLowerCase() to prevent combining dots (\u0307)
      .replace(/İ/g, 'i')
      .replace(/I/g, 'i')
      .replace(/ı/g, 'i')
      .replace(/Ğ/g, 'g')
      .replace(/ğ/g, 'g')
      .replace(/Ü/g, 'u')
      .replace(/ü/g, 'u')
      .replace(/Ş/g, 's')
      .replace(/ş/g, 's')
      .replace(/Ö/g, 'o')
      .replace(/ö/g, 'o')
      .replace(/Ç/g, 'c')
      .replace(/ç/g, 'c')
      // Remove any leftover combining diacritical marks (e.g., \u0307)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      // Replace spaces and invalid URL characters with hyphen
      .replace(/[^a-z0-9]+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

export function getDistrictSlug(districtName: string): string {
  return slugifyTurkish(districtName);
}

export function isMatchingDistrict(districtA: string, districtB: string): boolean {
  if (!districtA || !districtB) return false;
  return slugifyTurkish(districtA) === slugifyTurkish(districtB);
}
