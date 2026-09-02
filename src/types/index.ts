export type UserRole = 'CUSTOMER' | 'CARRIER' | 'ADMIN' | 'SUPER_ADMIN';

export type CarrierVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED';

export type DocumentType = 'IDENTITY' | 'TAX_CERTIFICATE' | 'TRANSPORT_PERMIT' | 'VEHICLE_REGISTRATION' | 'INSURANCE' | 'ELEVATOR_PERMIT' | 'OTHER';

export interface CarrierDocument {
  id: string;
  carrierId: string;
  type: DocumentType;
  title: string;
  fileName: string;
  fileUrl: string;
  status: CarrierVerificationStatus;
  uploadedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface MobileElevatorSpec {
  hasElevator: boolean;
  elevatorType?: 'VEHICLE_MOUNTED' | 'TRAILER_MOUNTED' | 'PORTABLE';
  maxFloor?: number;
  serviceCities?: string[];
  permitFileUrl?: string;
  photos?: string[];
  description?: string;
  isVerified?: boolean;
}

export interface CarrierProfile {
  id: string;
  userId: string;
  companyName: string;
  slug: string;
  authorizedPersonName: string;
  authorizedPersonSurname: string;
  nationalIdNumber?: string; // Private
  birthDate?: string; // Private
  phone: string;
  whatsapp?: string;
  email: string;
  logoUrl?: string;
  coverImageUrl?: string;
  shortBio: string;
  description?: string;
  city: string;
  district: string;
  fullAddress?: string; // Private
  services: string[]; // ['evden-eve', 'ofis-tasima', 'parca-esya', 'depolama', 'mobil-asansor', 'sehirler-arasi']
  serviceAreas: string[]; // Array of cities, or ['TÜM_TÜRKİYE']
  verificationStatus: CarrierVerificationStatus;
  verificationBadges: {
    identityVerified: boolean;
    taxVerified: boolean;
    transportPermitVerified: boolean;
    elevatorVerified: boolean;
  };
  elevatorSpec?: MobileElevatorSpec;
  planId: string; // 'free' | 'starter' | 'pro' | 'gold'
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  responseRatePercent: number;
  joinedAt: string;
  createdAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  fullName?: string;
  companyName?: string;
  city?: string;
  carrierProfileId?: string;
  customerProfileId?: string;
  createdAt: string;
}

export type RequestStatus = 'DRAFT' | 'ACTIVE' | 'ASSIGNED' | 'CLOSED' | 'CANCELED' | 'EXPIRED';

export type ServiceCategory = 'EVDEN_EVE' | 'OFIS_TASIMA' | 'PARCA_ESYA' | 'ESYA_DEPOLAMA';

export interface MovingRequest {
  id: string;
  requestCode: string; // e.g. #26093
  customerId: string;
  customerName: string;
  customerPhone: string;
  allowPhoneCall: boolean;
  serviceCategory: ServiceCategory;
  originCity: string;
  originDistrict: string;
  destinationCity: string;
  destinationDistrict: string;
  homeSize: string; // 'studio' | '1+1' | '2+1' | '3+1' | '4+1' | '5+1+' | 'office_small' | 'office_large' | 'single_item'
  movingDate: string;
  isDateFlexible: boolean;
  flexibleDays?: number; // 1, 3, 7
  originFloor: number;
  originHasElevator: boolean;
  originHasFreightElevator: boolean;
  originRequiresMobileElevator: boolean;
  originTruckAccess: boolean;
  destinationFloor: number;
  destinationHasElevator: boolean;
  destinationHasFreightElevator: boolean;
  destinationRequiresMobileElevator: boolean;
  destinationTruckAccess: boolean;
  packagingPreference: 'CARRIER_PACKS' | 'CUSTOMER_PACKS' | 'BOTH_OFFERS';
  extraServices: string[]; // ['disassembly_assembly', 'white_goods_connection', 'storage', 'insured', 'mobile_elevator']
  photos: string[];
  notes?: string;
  status: RequestStatus;
  offersCount: number;
  assignedCarrierId?: string;
  assignedOfferId?: string;
  closedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type OfferStatus = 'PENDING' | 'UPDATED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'REQUEST_CLOSED';

export interface Offer {
  id: string;
  requestId: string;
  carrierId: string;
  carrier: CarrierProfile;
  price: number;
  isVatIncluded: boolean;
  isPackagingIncluded: boolean;
  isMobileElevatorIncluded: boolean;
  isAssemblyIncluded: boolean;
  isInsuranceIncluded: boolean;
  estimatedDeliveryDuration: string; // 'Aynı Gün', '24 Saat', '2 Gün'
  validUntil: string;
  notes?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export type DefterPostCategory = 
  | 'EMPTY_VEHICLE' 
  | 'CARGO_JOB' 
  | 'RETURN_TRIP' 
  | 'PARTIAL_LOAD' 
  | 'ELEVATOR' 
  | 'STAFF' 
  | 'EQUIPMENT';

export type DefterPostStatus = 'ACTIVE' | 'COMPLETED' | 'CLOSED' | 'EXPIRED';

export interface DefterPost {
  id: string;
  carrierId: string;
  carrier: CarrierProfile;
  category: DefterPostCategory;
  originCity: string;
  originDistrict?: string;
  destinationCity: string;
  destinationDistrict?: string;
  date: string;
  vehicleType?: string; // '10 Teker Kamyon', 'Kırkayak', 'Kamyonet', 'TIR', 'Panelvan'
  capacityPercent?: number; // %70 Boş
  acceptsWaypoints?: boolean;
  title?: string;
  content: string;
  photos?: string[];
  allowPhone: boolean;
  allowMessage: boolean;
  status: DefterPostStatus;
  isSponsored?: boolean;
  createdAt: string;
  expiresAt: string;
}

export type AlarmType = 'REQUEST_ALARM' | 'NOTEBOOK_ALARM' | 'ROUTE_ALARM';
export type AlarmStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED';

export interface RouteAlarm {
  id: string;
  carrierId: string;
  type: AlarmType;
  title: string;
  originCity?: string;
  originDistrict?: string;
  originAny?: boolean;
  destinationCity?: string;
  destinationDistrict?: string;
  destinationAny?: boolean;
  serviceCategory?: string;
  defterCategory?: string;
  channels: {
    inApp: boolean;
    email: boolean;
    browserPush: boolean;
  };
  status: AlarmStatus;
  matchCountLast7Days: number;
  createdAt: string;
}

export type SubscriptionStatus = 'PENDING' | 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' | 'SUSPENDED';

export interface PlanFeature {
  key: string;
  name: string;
  description: string;
  type: 'BOOLEAN' | 'NUMERIC' | 'TEXT';
  value: string | number | boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  trialDays: number;
  isFeatured?: boolean;
  isActive: boolean;
  badge?: string;
  features: {
    offerCreate: boolean;
    monthlyOfferLimit: number | 'unlimited';
    customerPhoneAccess: boolean;
    notebookAccess: boolean;
    notebookPostLimit: number | 'unlimited';
    routeAlarmLimit: number | 'unlimited';
    featuredHomepage: boolean;
    featuredNotebook: boolean;
    featuredCityPages: boolean;
    featuredCompanyDirectory: boolean;
    premiumBadge: boolean;
    analyticsAdvanced: boolean;
    digitalServicesDiscountPercent: number;
  };
}

export interface CarrierSubscription {
  id: string;
  carrierId: string;
  planId: string;
  status: SubscriptionStatus;
  trialStartedAt?: string;
  trialEndsAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  cardLastFour?: string;
  cardBrand?: string;
  autoRenew: boolean;
  createdAt: string;
}

export type AdSlotPlacement = 
  | 'homepage.featured_carriers' 
  | 'notebook.feed' 
  | 'companies.directory' 
  | 'city_page.featured' 
  | 'district_page.featured' 
  | 'service_page.featured';

export interface AdSlot {
  id: string;
  key: AdSlotPlacement;
  title: string;
  description: string;
  maxCarriersToShow: number;
  isActive: boolean;
}

export interface AdCampaign {
  id: string;
  carrierId: string;
  carrier: CarrierProfile;
  slotKey: AdSlotPlacement;
  targetCity?: string;
  targetService?: string;
  weight: number;
  startDate: string;
  endDate: string;
  maxImpressions?: number;
  currentImpressions: number;
  currentClicks: number;
  source: 'GOLD_MEMBERSHIP' | 'DIRECT_CAMPAIGN';
  isActive: boolean;
  createdAt: string;
}

export type LeadPipelineStatus = 'NEW' | 'CONTACTED' | 'MEETING' | 'PROPOSAL' | 'WON' | 'LOST';

export interface DigitalService {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  startingPrice: string;
  isActive: boolean;
}

export interface DigitalServiceLead {
  id: string;
  serviceId: string;
  serviceTitle: string;
  carrierId?: string;
  companyName: string;
  authorizedPerson: string;
  phone: string;
  email: string;
  city: string;
  existingWebsite?: string;
  notes?: string;
  status: LeadPipelineStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  carrierId: string;
  customerId: string;
  customerName: string;
  originCity: string;
  destinationCity: string;
  rating: number; // 1-5
  communicationRating: number;
  punctualityRating: number;
  serviceQualityRating: number;
  priceHonestyRating: number;
  comment: string;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  mediaUrl?: string;
  isOfferCard?: boolean;
  offerData?: Partial<Offer>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: { [userId: string]: string };
  contextType: 'REQUEST' | 'DEFTER' | 'DIRECT';
  contextId: string;
  contextTitle: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCounts: { [userId: string]: number };
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT' | 'OFFER' | 'JOB' | 'DEFTER';
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SystemSettings {
  platformName: string;
  supportPhone: string;
  supportEmail: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  mobileAppBandActive: boolean;
  mobileAppBandTitle: string;
  mobileAppBandSubtitle: string;
  trialDurationDays: number;
  maxRequestPhotos: number;
  currency: string;
  maintenanceMode: boolean;
  featureFlags: {
    marketplaceEnabled: boolean;
    routeMatchingEnabled: boolean;
    pushEnabled: boolean;
    digitalServicesEnabled: boolean;
    reviewsEnabled: boolean;
  };
}
