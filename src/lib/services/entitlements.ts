import { db, SEED_PLANS } from '../data/mock-db';

export type FeatureKey = 
  | 'offer.create'
  | 'offers.monthly_limit'
  | 'customer_phone_access'
  | 'notebook.access'
  | 'notebook.post_limit'
  | 'route_alarm.limit'
  | 'featured.homepage'
  | 'featured.notebook'
  | 'featured.city_pages'
  | 'featured.company_directory'
  | 'premium.badge'
  | 'analytics.advanced'
  | 'digital_services.discount';

export interface EntitlementCheckResult {
  hasAccess: boolean;
  limit?: number | 'unlimited';
  currentUsage?: number;
  reason?: string;
}

export function checkEntitlement(planId: string, feature: FeatureKey): EntitlementCheckResult {
  const plan = db.getPlanById(planId) || SEED_PLANS[0];
  const { features } = plan;

  switch (feature) {
    case 'offer.create':
      return { hasAccess: features.offerCreate };
    
    case 'offers.monthly_limit':
      return { 
        hasAccess: true, 
        limit: features.monthlyOfferLimit 
      };

    case 'customer_phone_access':
      return { 
        hasAccess: features.customerPhoneAccess,
        reason: features.customerPhoneAccess ? undefined : 'Müşteri telefon numarasını doğrudan arayabilmek için Pro veya Gold üyelik gereklidir.'
      };

    case 'notebook.access':
      return { hasAccess: features.notebookAccess };

    case 'notebook.post_limit':
      return { 
        hasAccess: true, 
        limit: features.notebookPostLimit 
      };

    case 'route_alarm.limit':
      return { 
        hasAccess: true, 
        limit: features.routeAlarmLimit 
      };

    case 'featured.homepage':
      return { 
        hasAccess: features.featuredHomepage,
        reason: features.featuredHomepage ? undefined : 'Ana sayfa sponsorlu firma listesinde yer almak için Gold üyelik gereklidir.'
      };

    case 'featured.notebook':
      return { hasAccess: features.featuredNotebook };

    case 'featured.city_pages':
      return { hasAccess: features.featuredCityPages };

    case 'featured.company_directory':
      return { hasAccess: features.featuredCompanyDirectory };

    case 'premium.badge':
      return { hasAccess: features.premiumBadge };

    case 'analytics.advanced':
      return { hasAccess: features.analyticsAdvanced };

    case 'digital_services.discount':
      return { 
        hasAccess: features.digitalServicesDiscountPercent > 0, 
        limit: features.digitalServicesDiscountPercent 
      };

    default:
      return { hasAccess: true };
  }
}
