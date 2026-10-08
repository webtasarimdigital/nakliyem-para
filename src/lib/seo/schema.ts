/**
 * Schema.org JSON-LD Generators for TasinTeklif
 */

export const SITE_URL = 'https://tasinteklif.com';
export const SITE_NAME = 'TaşınTeklif';
export const SITE_LOGO = `${SITE_URL}/images/logo.png`;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Organization Schema
 */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    description: 'Türkiye’nin onaylı nakliyat firmalarını bir araya getiren güvenilir evden eve nakliyat, ofis taşıma ve nakliyeci borsası platformu.',
    sameAs: [
      'https://facebook.com/tasinteklif',
      'https://instagram.com/tasinteklif',
      'https://linkedin.com/company/tasinteklif',
      'https://x.com/tasinteklif',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-850-000-0000',
      contactType: 'customer service',
      email: 'bilgi@tasinteklif.com',
      areaServed: 'TR',
      availableLanguage: ['Turkish'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR',
    },
  };
}

/**
 * WebSite Schema with SearchAction
 */
export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/nakliyat-firmalari?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * BreadcrumbList Schema
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Service Schema (Evden Eve, Ofis, Parça Eşya, Depolama)
 */
export function buildServiceSchema({
  name,
  description,
  serviceType,
  url,
  areaServed = 'Türkiye',
}: {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    serviceType,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: areaServed,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'TRY',
      description: 'Ücretsiz Teklif Karşılaştırma ve Fiyat Alma',
    },
  };
}

/**
 * FAQPage Schema
 */
export function buildFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * ItemList Schema (Firma Rehberi ve Şehir Listeleri)
 */
export function buildItemListSchema(items: { name: string; url: string; description?: string }[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
      description: item.description,
    })),
  };
}

/**
 * MovingCompany / LocalBusiness Schema
 */
export function buildLocalBusinessSchema({
  companyName,
  slug,
  city,
  district,
  rating = 4.8,
  reviewCount = 12,
  description,
  phone,
}: {
  companyName: string;
  slug: string;
  city: string;
  district?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  phone?: string;
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'MovingCompany',
    name: companyName,
    url: `${SITE_URL}/firma/${slug}`,
    description: description || `${city} bölgesinde sigortalı, profesyonel evden eve nakliyat ve asansörlü taşıma hizmeti.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: district || city,
      addressCountry: 'TR',
    },
    priceRange: '₺₺',
  };

  if (phone) {
    schema.telephone = phone;
  }

  if (reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return schema;
}

/**
 * Article Schema (Blog Post)
 */
export function buildArticleSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = 'TaşınTeklif Uzman Ekibi',
  imageUrl = `${SITE_URL}/images/logo.png`,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: imageUrl,
  };
}
