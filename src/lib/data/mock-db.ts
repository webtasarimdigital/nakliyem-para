import { 
  User, 
  CarrierProfile, 
  CustomerProfile, 
  MovingRequest, 
  Offer, 
  DefterPost, 
  RouteAlarm, 
  SubscriptionPlan, 
  CarrierSubscription, 
  AdSlot, 
  AdCampaign, 
  DigitalService, 
  DigitalServiceLead, 
  Review, 
  Conversation, 
  ConversationMessage, 
  NotificationItem, 
  SystemSettings,
  CarrierDocument
} from '@/types';

// Seed Subscription Plans
export const SEED_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Başlangıç',
    slug: 'baslangic',
    tagline: 'Platforma yeni katılan ve iş hacmini denemek isteyen firmalar için.',
    priceMonthly: 1250,
    priceYearly: 12500,
    trialDays: 7,
    isActive: true,
    features: {
      offerCreate: true,
      monthlyOfferLimit: 25,
      customerPhoneAccess: false,
      notebookAccess: true,
      notebookPostLimit: 10,
      routeAlarmLimit: 2,
      featuredHomepage: false,
      featuredNotebook: false,
      featuredCityPages: false,
      featuredCompanyDirectory: false,
      premiumBadge: false,
      analyticsAdvanced: false,
      digitalServicesDiscountPercent: 0
    }
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    slug: 'pro',
    tagline: 'Düzenli taşıma işi alan ve aktif güzergâhlarını doldurmak isteyen nakliyeciler için.',
    priceMonthly: 2450,
    priceYearly: 24500,
    trialDays: 7,
    isFeatured: true,
    badge: 'En Çok Tercih Edilen',
    isActive: true,
    features: {
      offerCreate: true,
      monthlyOfferLimit: 100,
      customerPhoneAccess: true,
      notebookAccess: true,
      notebookPostLimit: 40,
      routeAlarmLimit: 8,
      featuredHomepage: false,
      featuredNotebook: true,
      featuredCityPages: true,
      featuredCompanyDirectory: true,
      premiumBadge: true,
      analyticsAdvanced: true,
      digitalServicesDiscountPercent: 10
    }
  },
  {
    id: 'plan_gold',
    name: 'Gold',
    slug: 'gold',
    tagline: 'Maksimum görünürlük, sınırsız iş teklifi ve tüm sayfalarda sponsorlu reklam ayrıcalığı.',
    priceMonthly: 4850,
    priceYearly: 48500,
    trialDays: 7,
    badge: 'Maksimum Güç',
    isActive: true,
    features: {
      offerCreate: true,
      monthlyOfferLimit: 'unlimited',
      customerPhoneAccess: true,
      notebookAccess: true,
      notebookPostLimit: 'unlimited',
      routeAlarmLimit: 'unlimited',
      featuredHomepage: true,
      featuredNotebook: true,
      featuredCityPages: true,
      featuredCompanyDirectory: true,
      premiumBadge: true,
      analyticsAdvanced: true,
      digitalServicesDiscountPercent: 25
    }
  }
];

// Seed Digital Services
export const SEED_DIGITAL_SERVICES: DigitalService[] = [
  {
    id: 'srv_web',
    slug: 'profesyonel-web-sitesi',
    title: 'Profesyonel Nakliyat Web Sitesi',
    shortDesc: 'Firmanıza özel, hızlı, mobil uyumlu ve SEO altyapılı kurumsal nakliyat sitesi.',
    fullDesc: 'Google ve mobil kullanıcılar için optimize edilmiş, online teklif formu içeren, WhatsApp ve doğrudan arama butonlarıyla donatılmış profesyonel nakliyat web sitesi.',
    iconName: 'Globe',
    features: [
      'Mobil & Tablet Uyumlu Responsive Tasarım',
      'Online Fiyat Teklif Formu & WhatsApp Entegrasyonu',
      'Hızlı Yüklenen Güçlü Sunucu Altyapısı',
      'Google Arama Altyapısına Tam Uyum',
      'Ücretsiz Alan Adı (.com) ve SSL Güvenlik Sertifikası'
    ],
    startingPrice: '7.500 TL',
    isActive: true
  },
  {
    id: 'srv_google_ads',
    slug: 'google-ads-reklamlari',
    title: 'Google Ads Nakliyat Reklamları',
    shortDesc: 'Google\'da nakliyat arayan binlerce müşteriye doğrudan ilk sırada ulaşın.',
    fullDesc: 'Bölgenizde "evden eve nakliyat" arayan kişileri anında telefonunuza ve web sitenize yönlendiren profesyonel Google reklam yönetimi.',
    iconName: 'Target',
    features: [
      'Hedef İl ve İlçe Odaklı Reklam Kurulumu',
      'Negatif Anahtar Kelime Optimizasyonu (Gereksiz Tıklamaları Önleme)',
      'Dönüşüm & Telefon Arama Takibi',
      'Haftalık Şeffaf Performans Raporları',
      'Düşük Bütçeyle Maksimum Gerçek Müşteri Çağrısı'
    ],
    startingPrice: '3.500 TL / Ay',
    isActive: true
  },
  {
    id: 'srv_seo',
    slug: 'google-seo-calismasi',
    title: 'Google Arama (SEO) Optimizasyonu',
    shortDesc: 'Reklam vermeden, organik arama sonuçlarında şehrinizde üst sıralara çıkın.',
    fullDesc: 'Şehir ve ilçe bazında yapılan nakliye aramalarında web sitenizin kalıcı olarak ilk sayfada yer almasını sağlayan teknik ve içerik optimizasyonu.',
    iconName: 'TrendingUp',
    features: [
      'Yerel Nakliyat Anahtar Kelime Haritası',
      'Sayfa İçi Hız & Teknik SEO İyileştirmeleri',
      'Şehir ve İlçe Hizmet Sayfaları Kurgusu',
      'Güvenilir Sektörel Tanıtım Yazıları & Backlink',
      'Aylık Sıralama & Trafik Raporu'
    ],
    startingPrice: '5.000 TL / Ay',
    isActive: true
  },
  {
    id: 'srv_maps',
    slug: 'google-haritalar-konum',
    title: 'Google Haritalar & Yerel Görünürlük',
    shortDesc: 'Bölgenizdeki yerel aramalarda Google Haritalar üzerinde 3\'lü pakette görünün.',
    fullDesc: 'Telefon aramalarının en yoğun geldiği Google Haritalar işletme profilinizin kurulumu, doğrulaması ve yerel SEO ile öne çıkarılması.',
    iconName: 'MapPin',
    features: [
      'Google İşletme Profili Kurulumu & Doğrulama Desteği',
      'Kategori & Hizmet Alanı Doğru Yapılandırması',
      'Müşteri Yorum Yönetimi Stratejisi',
      'Fotoğraf & Gönderi Düzenli Güncellemesi',
      'Yerel Harita Arama Sıralama İyileştirmesi'
    ],
    startingPrice: '2.500 TL',
    isActive: true
  }
];

// Seed Carriers — Canlı platformda yalnızca gerçek kayıtlı firmalar listelenecek
export const SEED_CARRIERS: CarrierProfile[] = [
  {
    id: 'carr_saycanlar',
    userId: 'user_carr_saycanlar',
    companyName: 'SAYCANLAR NAKLİYAT',
    slug: 'saycanlar-nakliyat',
    authorizedPersonName: 'Murat',
    authorizedPersonSurname: 'Saycan',
    phone: '0532 999 88 77',
    whatsapp: '0532 999 88 77',
    email: 'info@saycanlarnakliyat.com',
    logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    shortBio: '2011 yılından bu yana profesyonel evden eve ve ofis taşımacılığı, sigortalı nakliyat ve asansörlü taşımacılık hizmetleri.',
    city: 'İstanbul',
    district: 'Esenler',
    services: ['evden-eve', 'ofis-tasima', 'sehirler-arasi', 'mobil-asansor', 'depolama'],
    serviceAreas: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'],
    verificationStatus: 'APPROVED',
    verificationBadges: {
      identityVerified: true,
      taxVerified: true,
      transportPermitVerified: true,
      elevatorVerified: true
    },
    planId: 'plan_gold',
    rating: 4.9,
    reviewCount: 58,
    completedJobsCount: 240,
    responseRatePercent: 99,
    joinedAt: '2011-02-10T10:00:00Z',
    createdAt: '2011-02-10T10:00:00Z'
  },
  {
    id: 'carr_bogazici',
    userId: 'user_carr_1',
    companyName: 'Boğaziçi Profesyonel Nakliyat',
    slug: 'bogazici-profesyonel-nakliyat',
    authorizedPersonName: 'Murat',
    authorizedPersonSurname: 'Yılmaz',
    phone: '0532 890 12 34',
    whatsapp: '0532 890 12 34',
    email: 'info@bogazicinakliyat.com',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80',
    shortBio: '20 yılı aşkın tecrübe, 8 modern araç filosu ve uzman kadromuzla İstanbul ve Türkiye geneli profesyonel ev & ofis taşımacılığı.',
    description: 'Boğaziçi Nakliyat olarak tüm taşımalarımızda çift kat balonlu patpat ambalajlama, marangozlu mobilya montajı, sigortalı nakliye ve isteğe bağlı mobil asansör desteği sağlıyoruz.',
    city: 'İstanbul',
    district: 'Kadıköy',
    services: ['evden-eve', 'ofis-tasima', 'sehirler-arasi', 'mobil-asansor', 'depolama'],
    serviceAreas: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Kocaeli'],
    verificationStatus: 'APPROVED',
    verificationBadges: {
      identityVerified: true,
      taxVerified: true,
      transportPermitVerified: true,
      elevatorVerified: true
    },
    elevatorSpec: {
      hasElevator: true,
      elevatorType: 'VEHICLE_MOUNTED',
      maxFloor: 15,
      serviceCities: ['İstanbul', 'Kocaeli', 'Tekirdağ'],
      description: '15. kata kadar ulaşabilen hidrolik araç üstü asansörümüz ile dar merdivenli binalarda güvenli taşıma.',
      isVerified: true
    },
    planId: 'plan_gold',
    rating: 4.9,
    reviewCount: 84,
    completedJobsCount: 312,
    responseRatePercent: 98,
    joinedAt: '2023-01-15T10:00:00Z',
    createdAt: '2023-01-15T10:00:00Z'
  }
];

// Seed Documents
export const SEED_DOCUMENTS: CarrierDocument[] = [
  {
    id: 'doc_1',
    carrierId: 'carr_yeni_onay_bekleyen',
    type: 'TAX_CERTIFICATE',
    title: 'Güncel Vergi Levhası (2024)',
    fileName: 'marmara_lider_vergi_levhasi.pdf',
    fileUrl: '/mock-files/vergi_levhasi.pdf',
    status: 'PENDING',
    uploadedAt: '2024-02-18T10:05:00Z'
  },
  {
    id: 'doc_2',
    carrierId: 'carr_yeni_onay_bekleyen',
    type: 'IDENTITY',
    title: 'Firma Yetkilisi Kimlik Belgesi',
    fileName: 'mehmet_arslan_kimlik.jpg',
    fileUrl: '/mock-files/kimlik.jpg',
    status: 'PENDING',
    uploadedAt: '2024-02-18T10:08:00Z'
  }
];

// Registered Users (for phone verification and password reset)
export interface RegisteredUserRecord {
  id: string;
  email: string;
  phone: string;
  password?: string;
  role: 'CUSTOMER' | 'CARRIER' | 'ADMIN';
  fullName?: string;
  companyName?: string;
  carrierId?: string;
  createdAt: string;
}

export const SEED_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    id: 'user_cust_1',
    email: 'ahmet@example.com',
    phone: '0535 234 56 78',
    password: 'Password123!',
    role: 'CUSTOMER',
    fullName: 'Ahmet Yılmaz',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user_carr_1',
    email: 'info@bogazicinakliyat.com',
    phone: '0532 890 12 34',
    password: 'Password123!',
    role: 'CARRIER',
    companyName: 'Boğaziçi Profesyonel Nakliyat',
    carrierId: 'carr_bogazici',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'user_carr_pending',
    email: 'info@marmaralider.com',
    phone: '0533 123 45 67',
    password: 'Password123!',
    role: 'CARRIER',
    companyName: 'Marmara Lider Nakliyat',
    carrierId: 'carr_yeni_onay_bekleyen',
    createdAt: '2024-02-18T10:00:00Z'
  }
];

// Seed Requests — Platform canlıya çıktığında vitrini ve nakliyeci panelini dolu gösteren gerçekçi talepler
export const SEED_REQUESTS: MovingRequest[] = [
  {
    id: 'req_1',
    requestCode: '#26368',
    customerId: 'cust_ahmet',
    customerName: 'Ahmet T.',
    customerPhone: '0534 812 ** **',
    allowPhoneCall: true,
    serviceCategory: 'EVDEN_EVE',
    originCity: 'Bursa',
    originDistrict: 'Yıldırım',
    destinationCity: 'Bursa',
    destinationDistrict: 'Yıldırım',
    homeSize: '3+1',
    movingDate: '30 Eylül 2026',
    isDateFlexible: false,
    originFloor: 3,
    originHasElevator: false,
    originHasFreightElevator: false,
    originRequiresMobileElevator: false,
    originTruckAccess: true,
    destinationFloor: 1,
    destinationHasElevator: false,
    destinationHasFreightElevator: false,
    destinationRequiresMobileElevator: false,
    destinationTruckAccess: true,
    packagingPreference: 'CARRIER_PACKS',
    extraServices: ['disassembly_assembly'],
    photos: ['/mock-photos/living_room_bursa.jpg'],
    notes: 'Mobilyaların söküm ve montajı yapılacak, beyaz eşyalar patpat naylonla sarılmalı.',
    status: 'ACTIVE',
    offersCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'req_2',
    requestCode: '#38491',
    customerId: 'cust_selim',
    customerName: 'Selim K.',
    customerPhone: '0532 418 ** **',
    allowPhoneCall: true,
    serviceCategory: 'EVDEN_EVE',
    originCity: 'İstanbul',
    originDistrict: 'Kadıköy',
    destinationCity: 'Ankara',
    destinationDistrict: 'Çankaya',
    homeSize: '3+1',
    movingDate: '18 Ekim 2026',
    isDateFlexible: true,
    flexibleDays: 3,
    originFloor: 3,
    originHasElevator: true,
    originHasFreightElevator: false,
    originRequiresMobileElevator: false,
    originTruckAccess: true,
    destinationFloor: 4,
    destinationHasElevator: true,
    destinationHasFreightElevator: false,
    destinationRequiresMobileElevator: false,
    destinationTruckAccess: true,
    packagingPreference: 'CARRIER_PACKS',
    extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
    photos: ['/mock-photos/moving_room_1.jpg'],
    notes: 'Mobilyaların söküm ve montajı yapılacak, beyaz eşyalar patpat naylonla sarılmalı. İki bina da asansörlü.',
    status: 'ACTIVE',
    offersCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'req_3',
    requestCode: '#49102',
    customerId: 'cust_busra',
    customerName: 'Büşra T.',
    customerPhone: '0544 671 ** **',
    allowPhoneCall: true,
    serviceCategory: 'EVDEN_EVE',
    originCity: 'İzmir',
    originDistrict: 'Karşıyaka',
    destinationCity: 'Bursa',
    destinationDistrict: 'Nilüfer',
    homeSize: '2+1',
    movingDate: '22 Ekim 2026',
    isDateFlexible: false,
    originFloor: 2,
    originHasElevator: true,
    originHasFreightElevator: false,
    originRequiresMobileElevator: false,
    originTruckAccess: true,
    destinationFloor: 1,
    destinationHasElevator: false,
    destinationHasFreightElevator: false,
    destinationRequiresMobileElevator: false,
    destinationTruckAccess: true,
    packagingPreference: 'BOTH_OFFERS',
    extraServices: ['disassembly_assembly', 'insured'],
    photos: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'],
    notes: 'Kırılacak eşyalar tarafımızdan kolilendi. Gardırop ve yatak odası mobilyaları demonte edilip kurulacak.',
    status: 'ACTIVE',
    offersCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'req_4',
    requestCode: '#51283',
    customerId: 'cust_murat',
    customerName: 'Murat Y.',
    customerPhone: '0535 892 ** **',
    allowPhoneCall: true,
    serviceCategory: 'OFIS_TASIMA',
    originCity: 'İstanbul',
    originDistrict: 'Şişli',
    destinationCity: 'İstanbul',
    destinationDistrict: 'Ataşehir',
    homeSize: 'office_small',
    movingDate: '25 Ekim 2026',
    isDateFlexible: true,
    flexibleDays: 2,
    originFloor: 5,
    originHasElevator: true,
    originHasFreightElevator: true,
    originRequiresMobileElevator: false,
    originTruckAccess: true,
    destinationFloor: 2,
    destinationHasElevator: true,
    destinationHasFreightElevator: true,
    destinationRequiresMobileElevator: false,
    destinationTruckAccess: true,
    packagingPreference: 'CARRIER_PACKS',
    extraServices: ['disassembly_assembly'],
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'],
    notes: '12 çalışma masası, dosya dolapları ve ofis koltukları. Hafta sonu taşınması gerekmektedir.',
    status: 'ACTIVE',
    offersCount: 0,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Seed Offers — Canlıda nakliyecilerin boş form görmesi ve teklif vermeye yönlendirilmesi için boş başlar
export const SEED_OFFERS: Offer[] = [];

// Seed Defter Posts — Canlı ve Güncel İlanlar
export const SEED_DEFTER_POSTS: DefterPost[] = [
  {
    id: 'def_1',
    carrierId: 'carr_bogazici',
    carrier: SEED_CARRIERS[1],
    category: 'EMPTY_VEHICLE',
    originCity: 'İstanbul',
    originDistrict: 'Kadıköy',
    destinationCity: 'Ankara',
    destinationDistrict: 'Çankaya',
    date: 'Yarın Sabah',
    vehicleType: '10 Teker Kapalı Kasa',
    capacityPercent: 75,
    acceptsWaypoints: true,
    title: 'İstanbul ➔ Ankara Kapalı Kasa Boş Dönüş Aracı',
    content: 'Yarın sabah Kadıköy boşaltması sonrası Ankara\'ya boş dönüşümüz var. Aracımızın %75\'i boştur. Yol üzeri Kocaeli, Sakarya, Düzce, Bolu teslimatları yapılır. Çift kat balonlu ambalaj hazır.',
    allowPhone: true,
    allowMessage: true,
    status: 'ACTIVE',
    isSponsored: true,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 dk önce
    expiresAt: '2026-09-05T23:59:59Z'
  },
  {
    id: 'def_2',
    carrierId: 'carr_saycanlar',
    carrier: SEED_CARRIERS[0],
    category: 'PARTIAL_LOAD',
    originCity: 'İstanbul',
    originDistrict: 'Esenler',
    destinationCity: 'Ankara',
    destinationDistrict: 'Çankaya',
    date: 'Bugün Öğleden Sonra',
    vehicleType: 'Kırkayak Büyük Kamyon',
    capacityPercent: 40,
    acceptsWaypoints: true,
    title: 'İstanbul ➔ Ankara ➔ İzmir Parsiyel Yük İlanı',
    content: 'İstanbul çıkışlı aracımızda 20 m³ temiz eşya alanımız vardır. Parça mobilya, beyaz eşya veya öğrenci/bekar eşyası alınır. Fiyat makul tutulacaktır.',
    allowPhone: true,
    allowMessage: true,
    status: 'ACTIVE',
    isSponsored: true,
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 dk önce
    expiresAt: '2026-09-05T23:59:59Z'
  }
];

// Seed Route Alarms
export const SEED_ALARMS: RouteAlarm[] = [
  {
    id: 'alm_1',
    carrierId: 'carr_bogazici',
    type: 'REQUEST_ALARM',
    title: 'İstanbul → Ankara / İzmir Evden Eve Talepleri',
    originCity: 'İstanbul',
    destinationCity: 'Ankara',
    serviceCategory: 'EVDEN_EVE',
    channels: {
      inApp: true,
      email: true,
      browserPush: true
    },
    status: 'ACTIVE',
    matchCountLast7Days: 6,
    createdAt: '2026-08-20T10:00:00Z'
  },
  {
    id: 'alm_2',
    carrierId: 'carr_karadeniz_yildiz',
    type: 'NOTEBOOK_ALARM',
    title: 'Trabzon → İstanbul Defter Yük & Boş Araç',
    originCity: 'Trabzon',
    destinationCity: 'İstanbul',
    defterCategory: 'CARGO_JOB',
    channels: {
      inApp: true,
      email: false,
      browserPush: true
    },
    status: 'ACTIVE',
    matchCountLast7Days: 3,
    createdAt: '2026-08-22T14:00:00Z'
  }
];

// Seed Ad Slots & Campaigns
export const SEED_AD_SLOTS: AdSlot[] = [
  {
    id: 'slot_hp_featured',
    key: 'homepage.featured_carriers',
    title: 'Ana Sayfa Öne Çıkan Nakliyat Firmaları',
    description: 'Ana sayfada üst bantta ve güven bölümünde sponsorlu olarak listelenen onaylı nakliyat firmaları.',
    maxCarriersToShow: 4,
    isActive: true
  },
  {
    id: 'slot_nb_feed',
    key: 'notebook.feed',
    title: 'Defter Akışı Sponsorlu Meslektaş Kartı',
    description: 'Defter iş ağında her 3 gönderide bir dönen Gold firma reklam alanı.',
    maxCarriersToShow: 2,
    isActive: true
  },
  {
    id: 'slot_city_featured',
    key: 'city_page.featured',
    title: 'Şehir Sayfaları Üst Sponsorluk Alanı',
    description: 'İlgili şehir sayfalarında (ör. İstanbul Nakliyat Firmaları) en üstte çıkan firmalar.',
    maxCarriersToShow: 3,
    isActive: true
  }
];

export const SEED_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'camp_1',
    carrierId: 'carr_bogazici',
    carrier: SEED_CARRIERS[0],
    slotKey: 'homepage.featured_carriers',
    weight: 10,
    startDate: '2026-08-01',
    endDate: '2026-09-01',
    currentImpressions: 14250,
    currentClicks: 720,
    source: 'GOLD_MEMBERSHIP',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'camp_2',
    carrierId: 'carr_ege_trans',
    carrier: SEED_CARRIERS[1],
    slotKey: 'homepage.featured_carriers',
    weight: 10,
    startDate: '2026-08-01',
    endDate: '2026-09-01',
    currentImpressions: 11890,
    currentClicks: 590,
    source: 'GOLD_MEMBERSHIP',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z'
  },
  {
    id: 'camp_3',
    carrierId: 'carr_bogazici',
    carrier: SEED_CARRIERS[0],
    slotKey: 'notebook.feed',
    weight: 10,
    startDate: '2026-08-01',
    endDate: '2026-09-01',
    currentImpressions: 4320,
    currentClicks: 210,
    source: 'GOLD_MEMBERSHIP',
    isActive: true,
    createdAt: '2026-08-01T00:00:00Z'
  }
];

// Seed Reviews
export const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    carrierId: 'carr_bogazici',
    requestId: 'req_26093',
    customerId: 'user_cust_1',
    customerName: 'Ahmet Yılmaz',
    originCity: 'İstanbul',
    destinationCity: 'Ankara',
    rating: 5,
    communicationRating: 5,
    punctualityRating: 5,
    serviceQualityRating: 5,
    priceHonestyRating: 5,
    comment: 'Gerçekten kusursuz bir taşınma oldu. Ekip tam vaktinde geldi, tüm mobilyalarımızı çift kat patpat naylonla sarıp numaralandırdı. Ankara teslimatında da aynı titizlikle kurdular. Boğaziçi Nakliyat ekibine teşekkür ederim.',
    reply: 'Ahmet Bey güzel yorumunuz için teşekkür ederiz, yeni evinizde huzurla oturmanız dileğiyle.',
    repliedAt: '2026-08-27T10:00:00Z',
    createdAt: '2026-08-26T18:30:00Z'
  },
  {
    id: 'rev_2',
    carrierId: 'carr_bogazici',
    requestId: 'req_prev_1',
    customerId: 'user_cust_2',
    customerName: 'Zeynep Kaya',
    originCity: 'İstanbul',
    destinationCity: 'İzmir',
    rating: 4.8,
    communicationRating: 5,
    punctualityRating: 4.8,
    serviceQualityRating: 5,
    priceHonestyRating: 4.8,
    comment: 'Asansörlü taşıma sayesinde 6. kattaki evimiz 3 saatte boşaltıldı. Hiçbir tabak veya cam eşya kırılmadı. Fiyat teklifinde anlaştığımız rakam dışında tek kuruş ek ücret talep etmediler.',
    createdAt: '2026-08-20T14:15:00Z'
  },
  {
    id: 'rev_3',
    carrierId: 'carr_ege_trans',
    requestId: 'req_prev_2',
    customerId: 'user_cust_3',
    customerName: 'Mehmet Özkan',
    originCity: 'İzmir',
    destinationCity: 'İstanbul',
    rating: 4.9,
    communicationRating: 5,
    punctualityRating: 5,
    serviceQualityRating: 4.8,
    priceHonestyRating: 5,
    comment: 'Ege Güven ekibi söz verdiği saatte geldi. Marangoz arkadaş gardırobu kusursuz kurdu. Çok memnun kaldık, herkese öneririz.',
    createdAt: '2026-08-18T11:00:00Z'
  }
];

// Seed Conversations — Canlı platformda yeni kullanıcılar için boş başlar
export const SEED_CONVERSATIONS: Conversation[] = [];

// Seed Messages — Canlı platformda yeni kullanıcılar için boş başlar
export const SEED_MESSAGES: ConversationMessage[] = [];

// Seed System Settings
export const SEED_SETTINGS: SystemSettings = {
  platformName: 'TaşınTeklif',
  supportPhone: '0850 300 00 00',
  supportEmail: 'bilgi@tasinteklif.com',
  appStoreUrl: 'https://apple.com/app-store',
  googlePlayUrl: 'https://play.google.com',
  mobileAppBandActive: true,
  mobileAppBandTitle: 'Nakliyat cebinizde. Mobil uygulamamızı indirin.',
  mobileAppBandSubtitle: 'Tüm taşıma taleplerini ve teklifleri cebinizden anında yönetin.',
  trialDurationDays: 7,
  maxRequestPhotos: 10,
  currency: 'TL',
  maintenanceMode: false,
  featureFlags: {
    marketplaceEnabled: false,
    routeMatchingEnabled: true,
    pushEnabled: true,
    digitalServicesEnabled: true,
    reviewsEnabled: true
  }
};

// Client-side state hydration & in-memory manager
class MockDatabase {
  private isClient = typeof window !== 'undefined';

  private getItem<T>(key: string, defaultVal: T): T {
    if (!this.isClient) return defaultVal;
    try {
      const stored = localStorage.getItem(`nakliyem_db_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    if (!this.isClient) return;
    try {
      localStorage.setItem(`nakliyem_db_${key}`, JSON.stringify(val));
    } catch {
      // Ignore quota errors
    }
  }

  // Active User session (Simulated auth state for demo)
  getCurrentUser(): User | null {
    return this.getItem<User | null>('currentUser', null);
  }

  setCurrentUser(user: User | null): void {
    this.setItem('currentUser', user);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
    }
  }

  // Switch demo persona easily
  switchPersona(role: 'CUSTOMER' | 'CARRIER' | 'ADMIN' | 'GUEST'): void {
    if (role === 'GUEST') {
      this.setCurrentUser(null);
      return;
    }
    if (role === 'CUSTOMER') {
      this.setCurrentUser({
        id: 'user_cust_1',
        email: 'ahmet@example.com',
        phone: '0535 234 56 78',
        role: 'CUSTOMER',
        customerProfileId: 'cust_1',
        createdAt: '2024-01-01T00:00:00Z'
      });
      return;
    }
    if (role === 'CARRIER') {
      this.setCurrentUser({
        id: 'user_carr_1',
        email: 'murat@bogazicinakliyat.com',
        phone: '0532 890 12 34',
        role: 'CARRIER',
        carrierProfileId: 'carr_bogazici',
        createdAt: '2023-01-15T10:00:00Z'
      });
      return;
    }
    if (role === 'ADMIN') {
      this.setCurrentUser({
        id: 'user_admin_1',
        email: 'admin@TaşınTeklif.com',
        phone: '0850 300 00 00',
        role: 'ADMIN',
        createdAt: '2023-01-01T00:00:00Z'
      });
      return;
    }
  }

  // Carriers
  getCarriers(): CarrierProfile[] {
    return this.getItem<CarrierProfile[]>('carriers', SEED_CARRIERS);
  }

  getCarrierById(id: string): CarrierProfile | undefined {
    return this.getCarriers().find(c => c.id === id);
  }

  getCarrierBySlug(slug: string): CarrierProfile | undefined {
    return this.getCarriers().find(c => c.slug === slug);
  }

  updateCarrier(id: string, updates: Partial<CarrierProfile>): void {
    const list = this.getCarriers().map(c => c.id === id ? { ...c, ...updates } : c);
    this.setItem('carriers', list);
  }

  addCarrier(carrier: CarrierProfile): void {
    const list = [carrier, ...this.getCarriers()];
    this.setItem('carriers', list);
  }

  // Documents
  getDocuments(): CarrierDocument[] {
    return this.getItem<CarrierDocument[]>('documents', SEED_DOCUMENTS);
  }

  getDocumentsForCarrier(carrierId: string): CarrierDocument[] {
    return this.getDocuments().filter(d => d.carrierId === carrierId);
  }

  addDocument(doc: CarrierDocument): void {
    const list = [doc, ...this.getDocuments().filter(d => d.id !== doc.id)];
    this.setItem('documents', list);
  }

  updateDocumentStatus(docId: string, status: CarrierDocument['status'], notes?: string): void {
    const list = this.getDocuments().map(d => d.id === docId ? { 
      ...d, 
      status, 
      reviewNotes: notes, 
      reviewedAt: new Date().toISOString() 
    } : d);
    this.setItem('documents', list);
  }

  // Registered Users (for phone verification and password reset)
  getRegisteredUsers(): RegisteredUserRecord[] {
    return this.getItem<RegisteredUserRecord[]>('registeredUsers', SEED_REGISTERED_USERS);
  }

  getUserByPhone(phone: string): RegisteredUserRecord | undefined {
    const clean = phone.replace(/\D/g, '');
    return this.getRegisteredUsers().find(u => u.phone.replace(/\D/g, '') === clean);
  }

  getUserByEmail(email: string): RegisteredUserRecord | undefined {
    return this.getRegisteredUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getRegisteredUserByEmail(email: string): RegisteredUserRecord | undefined {
    return this.getUserByEmail(email);
  }

  addRegisteredUser(user: RegisteredUserRecord): void {
    const list = [...this.getRegisteredUsers().filter(u => u.id !== user.id), user];
    this.setItem('registeredUsers', list);
  }

  updateUserPassword(phoneOrEmail: string, newPass: string): boolean {
    const cleanPhone = phoneOrEmail.replace(/\D/g, '');
    const cleanEmail = phoneOrEmail.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    const user = users.find(u => 
      (cleanPhone.length >= 10 && u.phone.replace(/\D/g, '') === cleanPhone) ||
      u.email.toLowerCase() === cleanEmail
    );
    if (!user) return false;
    const updated = users.map(u => u.id === user.id ? { ...u, password: newPass } : u);
    this.setItem('registeredUsers', updated);
    return true;
  }

  // Carrier Subscriptions (Days remaining, cancel subscription)
  getCarrierSubscription(carrierId: string): CarrierSubscription {
    const subs = this.getItem<Record<string, CarrierSubscription>>('carrierSubscriptions', {});
    if (subs[carrierId]) return subs[carrierId];

    const carrier = this.getCarrierById(carrierId);
    const planId = carrier?.planId || 'plan_gold';
    const now = new Date();
    // Varsayılan: 24 gün kaldı
    const periodEnd = new Date(now.getTime() + 24 * 24 * 60 * 60 * 1000);

    const defaultSub: CarrierSubscription = {
      id: `sub_${carrierId}`,
      carrierId,
      planId,
      status: 'ACTIVE',
      currentPeriodStart: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
      lastPaymentDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      lastPaymentAmount: planId === 'plan_gold' ? 4850 : planId === 'plan_pro' ? 2450 : 1250,
      cardLastFour: '4242',
      cardBrand: 'Mastercard',
      autoRenew: true,
      createdAt: new Date(now.getTime() - 36 * 24 * 60 * 60 * 1000).toISOString(),
    };
    subs[carrierId] = defaultSub;
    this.setItem('carrierSubscriptions', subs);
    return defaultSub;
  }

  cancelCarrierSubscription(carrierId: string): CarrierSubscription {
    const sub = this.getCarrierSubscription(carrierId);
    const updated: CarrierSubscription = {
      ...sub,
      status: 'CANCELED',
      cancelAtPeriodEnd: true,
      autoRenew: false,
    };
    const subs = this.getItem<Record<string, CarrierSubscription>>('carrierSubscriptions', {});
    subs[carrierId] = updated;
    this.setItem('carrierSubscriptions', subs);
    return updated;
  }

  renewCarrierSubscription(carrierId: string): CarrierSubscription {
    const sub = this.getCarrierSubscription(carrierId);
    const now = new Date();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const updated: CarrierSubscription = {
      ...sub,
      status: 'ACTIVE',
      cancelAtPeriodEnd: false,
      autoRenew: true,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
    };
    const subs = this.getItem<Record<string, CarrierSubscription>>('carrierSubscriptions', {});
    subs[carrierId] = updated;
    this.setItem('carrierSubscriptions', subs);
    return updated;
  }

  // Requests
  getRequests(): MovingRequest[] {
    const list = this.getItem<MovingRequest[]>('requests', SEED_REQUESTS);
    if (list.length > 0 && list[0].requestCode === '#38491') {
      this.setItem('requests', SEED_REQUESTS);
      return SEED_REQUESTS;
    }
    return list;
  }

  getRequestById(id: string): MovingRequest | undefined {
    return this.getRequests().find(r => r.id === id || r.requestCode === id);
  }

  addRequest(req: MovingRequest): void {
    const list = [req, ...this.getRequests()];
    this.setItem('requests', list);
  }

  updateRequest(id: string, updates: Partial<MovingRequest>): void {
    const list = this.getRequests().map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r);
    this.setItem('requests', list);
  }

  // Offers
  getOffers(): Offer[] {
    return this.getItem<Offer[]>('offers', SEED_OFFERS).filter(o => o.id !== 'off_1' && o.id !== 'off_2');
  }

  getOffersForRequest(requestId: string): Offer[] {
    return this.getOffers().filter(o => o.requestId === requestId);
  }

  getOffersForCarrier(carrierId: string): Offer[] {
    if (!carrierId) return [];
    return this.getOffers().filter(o => o.carrierId === carrierId);
  }

  addOffer(offer: Offer): void {
    const list = [offer, ...this.getOffers()];
    this.setItem('offers', list);

    // Increment request offers count
    const req = this.getRequestById(offer.requestId);
    if (req) {
      this.updateRequest(req.id, { offersCount: req.offersCount + 1 });
    }

    // Auto-create chat & message to customer (Image media_1788383028254)
    const customerId = req?.customerId || 'user_cust_1';
    const carrier = this.getCarriers().find(c => c.id === offer.carrierId) || offer.carrier;
    const carrierUserId = carrier?.userId || `user_${offer.carrierId}`;
    const carrierName = carrier?.companyName || 'Nakliye Firması';

    const conversations = this.getConversations();
    let conv = conversations.find(c => 
      c.contextId === offer.requestId && 
      c.participantIds.includes(carrierUserId)
    );

    const now = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participantIds: [customerId, carrierUserId],
        participantNames: {
          [customerId]: req?.customerName || 'Müşteri',
          [carrierUserId]: carrierName
        },
        contextType: 'REQUEST',
        contextId: offer.requestId,
        contextTitle: `${req?.requestCode || ''} · ${req?.originDistrict || req?.originCity || ''} → ${req?.destinationDistrict || req?.destinationCity || ''}`,
        lastMessage: `${offer.price.toLocaleString('tr-TR')} TL teklif gönderdim`,
        lastMessageAt: now,
        unreadCounts: {
          [customerId]: 1,
          [carrierUserId]: 0
        },
        createdAt: now
      };
      this.setItem('conversations', [conv, ...conversations]);
    }

    const offerCardMsg: ConversationMessage = {
      id: `msg_${Date.now()}_1`,
      conversationId: conv.id,
      senderId: carrierUserId,
      senderName: carrierName,
      senderRole: 'CARRIER',
      content: `${req?.requestCode || ''} · ${req?.originDistrict || ''}, ${req?.originCity || ''} → ${req?.destinationDistrict || ''}, ${req?.destinationCity || ''}\n· Evden Eve Nakliyat · ${offer.price.toLocaleString('tr-TR')} TL teklif`,
      isOfferCard: true,
      offerData: {
        price: offer.price,
        requestId: offer.requestId,
        id: offer.id
      },
      createdAt: now
    };

    const textMsg: ConversationMessage = {
      id: `msg_${Date.now()}_2`,
      conversationId: conv.id,
      senderId: carrierUserId,
      senderName: carrierName,
      senderRole: 'CARRIER',
      content: `${offer.price.toLocaleString('tr-TR')} TL teklif gönderdim`,
      createdAt: new Date(Date.now() + 1000).toISOString()
    };

    this.setItem('messages', [...this.getAllMessages(), offerCardMsg, textMsg]);
  }

  updateOffer(id: string, updates: Partial<Offer>): void {
    const list = this.getOffers().map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o);
    this.setItem('offers', list);
  }

  // Assign request to an offer
  acceptOffer(requestId: string, offerId: string): void {
    const offers = this.getOffers();
    const targetOffer = offers.find(o => o.id === offerId);
    if (!targetOffer) return;

    // Update accepted offer
    const updatedOffers = offers.map(o => {
      if (o.requestId === requestId) {
        return o.id === offerId 
          ? { ...o, status: 'ACCEPTED' as const }
          : { ...o, status: 'REJECTED' as const };
      }
      return o;
    });
    this.setItem('offers', updatedOffers);

    // Update request
    this.updateRequest(requestId, {
      status: 'ASSIGNED',
      assignedCarrierId: targetOffer.carrierId,
      assignedOfferId: offerId
    });
  }

  // Defter
  getDefterPosts(): DefterPost[] {
    return this.getItem<DefterPost[]>('defter_posts', SEED_DEFTER_POSTS);
  }

  addDefterPost(post: DefterPost): void {
    const list = [post, ...this.getDefterPosts()];
    this.setItem('defter_posts', list);
  }

  updateDefterPost(id: string, updates: Partial<DefterPost>): void {
    const list = this.getDefterPosts().map(p => p.id === id ? { ...p, ...updates } : p);
    this.setItem('defter_posts', list);
  }

  // Alarms
  getAlarms(): RouteAlarm[] {
    return this.getItem<RouteAlarm[]>('alarms', SEED_ALARMS);
  }

  getAlarmsForCarrier(carrierId: string): RouteAlarm[] {
    return this.getAlarms().filter(a => a.carrierId === carrierId);
  }

  addAlarm(alarm: RouteAlarm): void {
    const list = [alarm, ...this.getAlarms()];
    this.setItem('alarms', list);
  }

  updateAlarm(id: string, updates: Partial<RouteAlarm>): void {
    const list = this.getAlarms().map(a => a.id === id ? { ...a, ...updates } : a);
    this.setItem('alarms', list);
  }

  // Plans & Features
  getPlans(): SubscriptionPlan[] {
    return this.getItem<SubscriptionPlan[]>('plans', SEED_PLANS);
  }

  getPlanById(id: string): SubscriptionPlan | undefined {
    return this.getPlans().find(p => p.id === id || p.slug === id);
  }

  updatePlan(id: string, updates: Partial<SubscriptionPlan>): void {
    const list = this.getPlans().map(p => p.id === id ? { ...p, ...updates } : p);
    this.setItem('plans', list);
  }

  // Ad Slots & Campaigns
  getAdSlots(): AdSlot[] {
    return this.getItem<AdSlot[]>('ad_slots', SEED_AD_SLOTS);
  }

  getAdCampaigns(): AdCampaign[] {
    return this.getItem<AdCampaign[]>('ad_campaigns', SEED_AD_CAMPAIGNS);
  }

  addAdCampaign(camp: AdCampaign): void {
    const list = [camp, ...this.getAdCampaigns()];
    this.setItem('ad_campaigns', list);
  }

  // Digital Services & Leads
  getDigitalServices(): DigitalService[] {
    return this.getItem<DigitalService[]>('digital_services', SEED_DIGITAL_SERVICES);
  }

  getLeads(): DigitalServiceLead[] {
    return this.getItem<DigitalServiceLead[]>('digital_leads', [
      {
        id: 'lead_1',
        serviceId: 'srv_google_ads',
        serviceTitle: 'Google Ads Nakliyat Reklamları',
        carrierId: 'carr_baskent_ekspres',
        companyName: 'Başkent Ekspres Nakliyat',
        authorizedPerson: 'Ahmet Kaya',
        phone: '0505 321 45 67',
        email: 'destek@baskentekspres.com',
        city: 'Ankara',
        existingWebsite: 'www.baskentekspres.com',
        notes: 'Ankara Çankaya ve Yenimahalle bölgesinde aylık 5.000 TL bütçe ile reklam vermek istiyor.',
        status: 'CONTACTED',
        createdAt: '2026-08-24T11:00:00Z',
        updatedAt: '2026-08-25T09:30:00Z'
      }
    ]);
  }

  addLead(lead: DigitalServiceLead): void {
    const list = [lead, ...this.getLeads()];
    this.setItem('digital_leads', list);
  }

  updateLead(id: string, updates: Partial<DigitalServiceLead>): void {
    const list = this.getLeads().map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l);
    this.setItem('digital_leads', list);
  }

  // System Settings
  getSettings(): SystemSettings {
    return this.getItem<SystemSettings>('settings', SEED_SETTINGS);
  }

  updateSettings(updates: Partial<SystemSettings>): void {
    const curr = this.getSettings();
    this.setItem('settings', { ...curr, ...updates });
  }

  // Reviews
  getReviews(): Review[] {
    return this.getItem<Review[]>('reviews', SEED_REVIEWS);
  }

  getReviewsForCarrier(carrierId: string): Review[] {
    return this.getReviews().filter(r => r.carrierId === carrierId);
  }

  addReview(review: Review): void {
    const list = [review, ...this.getReviews()];
    this.setItem('reviews', list);
  }

  hasReviewForRequest(requestId: string): boolean {
    return this.getReviews().some(r => r.requestId === requestId);
  }

  getReviewByRequest(requestId: string): Review | undefined {
    return this.getReviews().find(r => r.requestId === requestId);
  }

  getReviewableRequestsForCustomer(customerId: string): MovingRequest[] {
    return this.getRequests().filter(r =>
      r.customerId === customerId &&
      (r.status === 'ASSIGNED' || r.status === 'CLOSED') &&
      !!r.assignedCarrierId
    );
  }

  addReviewAndUpdateCarrier(review: Review): void {
    this.addReview(review);
    const allReviews = this.getReviewsForCarrier(review.carrierId);
    const newAvg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    this.updateCarrier(review.carrierId, {
      rating: Math.round(newAvg * 10) / 10,
      reviewCount: allReviews.length
    });
  }

  // Conversations & Messages
  getConversations(userId?: string): Conversation[] {
    const all = this.getItem<Conversation[]>('conversations', SEED_CONVERSATIONS);
    if (!userId) return all;
    return all.filter(c => c.participantIds.includes(userId));
  }

  getConversationById(id: string): Conversation | undefined {
    return this.getConversations().find(c => c.id === id);
  }

  getAllMessages(): ConversationMessage[] {
    return this.getItem<ConversationMessage[]>('messages', SEED_MESSAGES);
  }

  getMessages(conversationId: string): ConversationMessage[] {
    const all = this.getAllMessages();
    return all.filter(m => m.conversationId === conversationId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  sendMessage(conversationId: string, messageData: { senderId: string; senderName: string; senderRole: any; content: string; mediaUrl?: string; isOfferCard?: boolean; offerData?: any }): ConversationMessage {
    const newMsg: ConversationMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderRole: messageData.senderRole,
      content: messageData.content,
      mediaUrl: messageData.mediaUrl,
      isOfferCard: messageData.isOfferCard,
      offerData: messageData.offerData,
      createdAt: new Date().toISOString()
    };

    const allMsgs = [...this.getItem<ConversationMessage[]>('messages', SEED_MESSAGES), newMsg];
    this.setItem('messages', allMsgs);

    // Update conversation lastMessage & lastMessageAt
    const convs = this.getConversations().map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: messageData.content,
          lastMessageAt: newMsg.createdAt
        };
      }
      return c;
    });
    this.setItem('conversations', convs);

    return newMsg;
  }

  createConversation(data: { participantIds: string[]; participantNames: { [id: string]: string }; contextType: 'REQUEST' | 'DEFTER' | 'DIRECT'; contextId: string; contextTitle: string; initialMessage?: string }): Conversation {
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participantIds: data.participantIds,
      participantNames: data.participantNames,
      contextType: data.contextType,
      contextId: data.contextId,
      contextTitle: data.contextTitle,
      lastMessage: data.initialMessage || 'Sohbet başlatıldı.',
      lastMessageAt: new Date().toISOString(),
      unreadCounts: {},
      createdAt: new Date().toISOString()
    };

    const list = [newConv, ...this.getConversations()];
    this.setItem('conversations', list);

    if (data.initialMessage) {
      this.sendMessage(newConv.id, {
        senderId: data.participantIds[0],
        senderName: data.participantNames[data.participantIds[0]] || 'Kullanıcı',
        senderRole: 'CUSTOMER',
        content: data.initialMessage
      });
    }

    return newConv;
  }

  markConversationAsRead(conversationId: string, userId: string): void {
    const convs = this.getConversations().map(c => {
      if (c.id === conversationId) {
        return {
          ...c,
          unreadCounts: {
            ...c.unreadCounts,
            [userId]: 0
          }
        };
      }
      return c;
    });
    this.setItem('conversations', convs);
  }

  // Intent preservation for non-logged-in users
  getIntendedAction(): { action: string; payload?: any; returnUrl?: string } | null {
    return this.getItem('intendedAction', null);
  }

  setIntendedAction(data: { action: string; payload?: any; returnUrl?: string } | null): void {
    this.setItem('intendedAction', data);
  }

  // Marketplace Listings
  getMarketplaceListings(): any[] {
    return this.getItem<any[]>('marketplace_listings', []);
  }

  addMarketplaceListing(listing: any): void {
    const list = [listing, ...this.getMarketplaceListings()];
    this.setItem('marketplace_listings', list);
  }
}

export const db = new MockDatabase();
