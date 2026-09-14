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
  CarrierDocument,
  UserRole
} from '@/types';

// Seed Subscription Plans
export const SEED_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_starter',
    name: 'Başlangıç (Ücretsiz)',
    slug: 'baslangic',
    tagline: 'Platforma yeni katılan ve iş hacmini denemek isteyen firmalar için günlük 3 ücretsiz teklif.',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    badge: 'Ücretsiz',
    isActive: true,
    features: {
      offerCreate: true,
      monthlyOfferLimit: 90,
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
    phone: '0532 489 71 25',
    whatsapp: '0532 489 71 25',
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
    isProfileCompleted: true,
    rating: 4.9,
    reviewCount: 58,
    completedJobsCount: 240,
    responseRatePercent: 99,
    joinedAt: '2011-02-10T10:00:00Z',
    createdAt: '2011-02-10T10:00:00Z',
    isSeed: true
  },
  {
    id: 'carr_bogazici',
    userId: 'user_carr_1',
    companyName: 'Boğaziçi Profesyonel Nakliyat',
    slug: 'bogazici-profesyonel-nakliyat',
    authorizedPersonName: 'Murat',
    authorizedPersonSurname: 'Yılmaz',
    phone: '0533 624 18 90',
    whatsapp: '0533 624 18 90',
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
    createdAt: '2023-01-15T10:00:00Z',
    isSeed: true
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
    uploadedAt: '2024-02-18T10:05:00Z',
    isSeed: true
  },
  {
    id: 'doc_2',
    carrierId: 'carr_yeni_onay_bekleyen',
    type: 'IDENTITY',
    title: 'Firma Yetkilisi Kimlik Belgesi',
    fileName: 'mehmet_arslan_kimlik.jpg',
    fileUrl: '/mock-files/kimlik.jpg',
    status: 'PENDING',
    uploadedAt: '2024-02-18T10:08:00Z',
    isSeed: true
  }
];

// Registered Users (for phone verification and password reset)
export interface RegisteredUserRecord {
  id: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  fullName?: string;
  companyName?: string;
  carrierId?: string;
  createdAt: string;
  isSeed?: boolean;
}

export const SEED_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    id: 'user_cust_1',
    email: 'ahmet@example.com',
    phone: '0535 412 83 91',
    password: 'Password123!',
    role: 'CUSTOMER',
    fullName: 'Ahmet Yılmaz',
    createdAt: '2024-01-01T00:00:00Z',
    isSeed: true
  },
  {
    id: 'user_carr_1',
    email: 'info@bogazicinakliyat.com',
    phone: '0533 624 18 90',
    password: 'Password123!',
    role: 'CARRIER',
    companyName: 'Boğaziçi Profesyonel Nakliyat',
    carrierId: 'carr_bogazici',
    createdAt: '2024-01-10T10:00:00Z',
    isSeed: true
  },
  {
    id: 'user_carr_pending',
    email: 'info@marmaralider.com',
    phone: '0542 315 84 92',
    password: 'Password123!',
    role: 'CARRIER',
    companyName: 'Marmara Lider Nakliyat',
    carrierId: 'carr_yeni_onay_bekleyen',
    createdAt: '2024-02-18T10:00:00Z',
    isSeed: true
  }
];

function formatTurkishDate(ms: number): string {
  const d = new Date(ms);
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function getDynamicSeedRequests(): MovingRequest[] {
  const now = Date.now();
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;

  return [
    {
      id: 'req_seed_1',
      requestCode: '#64192',
      customerId: 'cust_selin',
      customerName: 'Selin K.',
      customerPhone: '0532 641 28 90',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'İstanbul',
      originDistrict: 'Kadıköy',
      destinationCity: 'Ankara',
      destinationDistrict: 'Çankaya',
      homeSize: '3+1',
      movingDate: formatTurkishDate(now + 3 * DAY),
      isDateFlexible: true,
      flexibleDays: 2,
      originFloor: 3,
      originHasElevator: true,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 2,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'],
      notes: 'Mobilyaların söküm ve montajı yapılacak, 6 kapılı gardırop ve köşe koltuk takımı var. Beyaz eşyalar patpat naylonla sarılmalı.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 38 * 60 * 1000).toISOString(), // 38 dk önce (BUGÜN)
      updatedAt: new Date(now - 38 * 60 * 1000).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_2',
      requestCode: '#64188',
      customerId: 'cust_baris',
      customerName: 'Barış E.',
      customerPhone: '0542 819 33 45',
      allowPhoneCall: true,
      serviceCategory: 'PARCA_ESYA',
      originCity: 'İstanbul',
      originDistrict: 'Beşiktaş',
      destinationCity: 'İzmir',
      destinationDistrict: 'Bornova',
      homeSize: '1+1',
      movingDate: formatTurkishDate(now + 4 * DAY),
      isDateFlexible: true,
      flexibleDays: 3,
      originFloor: 1,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 0,
      destinationHasElevator: false,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CUSTOMER_PACKS',
      extraServices: ['insured'],
      photos: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80'],
      notes: 'Öğrenci evimi taşıyorum. Sadece L koltuk, buzdolabı, çamaşır makinesi, çalışma masası ve 6 koli var. Kamyonda boş yer varsa parsiyel olarak da gidebilir.',
      status: 'ACTIVE',
      offersCount: 0,
      createdAt: new Date(now - 140 * 60 * 1000).toISOString(), // 2.3 saat önce (BUGÜN)
      updatedAt: new Date(now - 140 * 60 * 1000).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_3',
      requestCode: '#64175',
      customerId: 'cust_nilgun',
      customerName: 'Nilgün D.',
      customerPhone: '0533 502 91 18',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'İstanbul',
      originDistrict: 'Bakırköy',
      destinationCity: 'İstanbul',
      destinationDistrict: 'Maltepe',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 2 * DAY),
      isDateFlexible: false,
      originFloor: 4,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: true,
      originTruckAccess: true,
      destinationFloor: 3,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'BOTH_OFFERS',
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80'],
      notes: 'Bakırköy Ataköy\'deki evimiz 4. katta ve merdiven dar olduğu için dış cephe asansörü gereklidir. Maltepe\'de asansör var.',
      status: 'ACTIVE',
      offersCount: 2,
      createdAt: new Date(now - 310 * 60 * 1000).toISOString(), // 5 saat önce (BUGÜN)
      updatedAt: new Date(now - 310 * 60 * 1000).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_4',
      requestCode: '#64160',
      customerId: 'cust_erdem',
      customerName: 'Erdem T.',
      customerPhone: '0535 774 12 63',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Bursa',
      originDistrict: 'Nilüfer',
      destinationCity: 'Antalya',
      destinationDistrict: 'Muratpaşa',
      homeSize: '3+1',
      movingDate: formatTurkishDate(now + 6 * DAY),
      isDateFlexible: true,
      flexibleDays: 2,
      originFloor: 2,
      originHasElevator: true,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 5,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
      photos: ['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80'],
      notes: 'Tayin nedeniyle Bursa\'dan Antalya\'ya taşınıyoruz. Koşu bandı ve 80 kg çelik para kasası da taşınacak. Faturaya uygun kurumsal teklif rica ederiz.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 19 * HOUR).toISOString(), // DÜN
      updatedAt: new Date(now - 19 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_5',
      requestCode: '#64142',
      customerId: 'cust_ayse',
      customerName: 'Ayşe V. (Ofis)',
      customerPhone: '0530 488 65 20',
      allowPhoneCall: true,
      serviceCategory: 'OFIS_TASIMA',
      originCity: 'İstanbul',
      originDistrict: 'Şişli',
      destinationCity: 'İstanbul',
      destinationDistrict: 'Ataşehir',
      homeSize: 'office_small',
      movingDate: formatTurkishDate(now + 5 * DAY),
      isDateFlexible: false,
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
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'],
      notes: 'Mali müşavirlik büromuz hafta sonu taşınmalı, Pazartesi mesai başlayacak. 8 çalışma masası, 2 arşiv dolabı, toplantı masası ve 15 koli evrak.',
      status: 'ACTIVE',
      offersCount: 2,
      createdAt: new Date(now - 25 * HOUR).toISOString(), // DÜN
      updatedAt: new Date(now - 25 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_6',
      requestCode: '#64130',
      customerId: 'cust_kemal',
      customerName: 'Kemal S.',
      customerPhone: '0544 219 80 71',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'İzmir',
      originDistrict: 'Karşıyaka',
      destinationCity: 'İzmir',
      destinationDistrict: 'Urla',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 4 * DAY),
      isDateFlexible: true,
      flexibleDays: 2,
      originFloor: 3,
      originHasElevator: true,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 0,
      destinationHasElevator: false,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'],
      notes: 'Bostanlı\'daki daireden Urla\'daki bahçeli müstakil eve taşınma. Bahçe mobilyaları, barbekü ve saksı bitkileri de mevcuttur.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 31 * HOUR).toISOString(), // DÜN
      updatedAt: new Date(now - 31 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_7',
      requestCode: '#64115',
      customerId: 'cust_meltem',
      customerName: 'Doç. Dr. Meltem U.',
      customerPhone: '0532 991 43 12',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Ankara',
      originDistrict: 'Çankaya',
      destinationCity: 'Ankara',
      destinationDistrict: 'Gölbaşı',
      homeSize: '4+1',
      movingDate: formatTurkishDate(now + 7 * DAY),
      isDateFlexible: false,
      originFloor: 1,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 0,
      destinationHasElevator: false,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
      photos: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80'],
      notes: 'Evimizde duvar piyanosu bulunmaktadır. Profesyonel taşıyıcı ekip ve nakliyat sigortası şarttır. Salon takımı masif ahşaptır.',
      status: 'ACTIVE',
      offersCount: 3,
      createdAt: new Date(now - 46 * HOUR).toISOString(), // 2 gün önce
      updatedAt: new Date(now - 46 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_8',
      requestCode: '#64098',
      customerId: 'cust_gizem',
      customerName: 'Gizem & Can A.',
      customerPhone: '0538 610 52 87',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Kocaeli',
      originDistrict: 'İzmit',
      destinationCity: 'Muğla',
      destinationDistrict: 'Bodrum',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 8 * DAY),
      isDateFlexible: true,
      flexibleDays: 3,
      originFloor: 0,
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
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'],
      notes: 'Yeni evlendik, eşyaların tamamı sıfır ambalajlı çeyiz eşyasıdır. Mobilyaların montajı Bodrum\'daki evde yapılacaktır.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 55 * HOUR).toISOString(), // 2 gün önce
      updatedAt: new Date(now - 55 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_9',
      requestCode: '#64082',
      customerId: 'cust_deniz',
      customerName: 'Deniz O.',
      customerPhone: '0541 332 79 04',
      allowPhoneCall: true,
      serviceCategory: 'PARCA_ESYA',
      originCity: 'Eskişehir',
      originDistrict: 'Tepebaşı',
      destinationCity: 'İstanbul',
      destinationDistrict: 'Kadıköy',
      homeSize: '1+0',
      movingDate: formatTurkishDate(now + 9 * DAY),
      isDateFlexible: true,
      flexibleDays: 4,
      originFloor: 2,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 3,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CUSTOMER_PACKS',
      extraServices: [],
      photos: ['https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=600&auto=format&fit=crop&q=80'],
      notes: 'Baza yatak, mini buzdolabı ve 5 koli kitap/kıyafet. Küçük araç veya parsiyel taşıma yeterlidir.',
      status: 'ACTIVE',
      offersCount: 0,
      createdAt: new Date(now - 73 * HOUR).toISOString(), // 3 gün önce
      updatedAt: new Date(now - 73 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_10',
      requestCode: '#64065',
      customerId: 'cust_serdar',
      customerName: 'Serdar H.',
      customerPhone: '0536 415 88 32',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Antalya',
      originDistrict: 'Konyaaltı',
      destinationCity: 'Antalya',
      destinationDistrict: 'Kepez',
      homeSize: '3+1',
      movingDate: formatTurkishDate(now + 6 * DAY),
      isDateFlexible: false,
      originFloor: 6,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: true,
      originTruckAccess: true,
      destinationFloor: 3,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'BOTH_OFFERS',
      extraServices: ['disassembly_assembly', 'white_goods_connection'],
      photos: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80'],
      notes: 'Konyaaltı\'ndaki site bina asansöründen eşya taşınmasına kesinlikle izin vermiyor. Dış cephe modüler asansörü şarttır.',
      status: 'ACTIVE',
      offersCount: 2,
      createdAt: new Date(now - 81 * HOUR).toISOString(), // 3 gün önce
      updatedAt: new Date(now - 81 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_11',
      requestCode: '#64049',
      customerId: 'cust_mustafa',
      customerName: 'Mustafa Ç.',
      customerPhone: '0537 804 19 55',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'İstanbul',
      originDistrict: 'Pendik',
      destinationCity: 'Trabzon',
      destinationDistrict: 'Ortahisar',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 12 * DAY),
      isDateFlexible: true,
      flexibleDays: 3,
      originFloor: 4,
      originHasElevator: true,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 2,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80'],
      notes: 'Memur tayini nedeniyle İstanbul\'dan Trabzon\'a nakliye. Çift şoförlü araç ve resmi fatura zorunludur.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 97 * HOUR).toISOString(), // 4 gün önce
      updatedAt: new Date(now - 97 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_12',
      requestCode: '#64031',
      customerId: 'cust_fatma',
      customerName: 'Fatma B.',
      customerPhone: '0543 912 60 48',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'İstanbul',
      originDistrict: 'Ümraniye',
      destinationCity: 'İstanbul',
      destinationDistrict: 'Üsküdar',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 5 * DAY),
      isDateFlexible: true,
      flexibleDays: 2,
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
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly'],
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80'],
      notes: 'Mesafe 7 km civarı. Kısa mesafe olduğu için aynı gün öğleden önce başlayıp bitirilmesini rica ediyoruz.',
      status: 'ACTIVE',
      offersCount: 3,
      createdAt: new Date(now - 108 * HOUR).toISOString(), // 4 gün önce
      updatedAt: new Date(now - 108 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_13',
      requestCode: '#64018',
      customerId: 'cust_zafer',
      customerName: 'Zafer G.',
      customerPhone: '0533 118 72 90',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Aydın',
      originDistrict: 'Didim',
      destinationCity: 'Ankara',
      destinationDistrict: 'Etimesgut',
      homeSize: '3+1',
      movingDate: formatTurkishDate(now + 14 * DAY),
      isDateFlexible: true,
      flexibleDays: 3,
      originFloor: 0,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 7,
      destinationHasElevator: true,
      destinationHasFreightElevator: true,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'BOTH_OFFERS',
      extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
      photos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80'],
      notes: 'Didim\'deki yazlığı tamamen Ankara\'ya taşıyoruz. Beyaz eşyalar ve bahçe salıncağı da var.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 122 * HOUR).toISOString(), // 5 gün önce
      updatedAt: new Date(now - 122 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_14',
      requestCode: '#64005',
      customerId: 'cust_aliriza',
      customerName: 'Ali Rıza K.',
      customerPhone: '0542 703 41 66',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Adana',
      originDistrict: 'Seyhan',
      destinationCity: 'Mersin',
      destinationDistrict: 'Mezitli',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 7 * DAY),
      isDateFlexible: true,
      flexibleDays: 2,
      originFloor: 3,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 4,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly'],
      photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80'],
      notes: 'Adana - Mersin arası taşınma. Mobilyalar demonte edilip kurulacak. Güvenilir ve tecrübeli ekip arıyoruz.',
      status: 'ACTIVE',
      offersCount: 2,
      createdAt: new Date(now - 135 * HOUR).toISOString(), // 5 gün önce
      updatedAt: new Date(now - 135 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_15',
      requestCode: '#63988',
      customerId: 'cust_burak',
      customerName: 'Burak Y.',
      customerPhone: '0531 490 22 17',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Balıkesir',
      originDistrict: 'Ayvalık',
      destinationCity: 'İstanbul',
      destinationDistrict: 'Kadıköy',
      homeSize: '2+1',
      movingDate: formatTurkishDate(now + 10 * DAY),
      isDateFlexible: true,
      flexibleDays: 3,
      originFloor: 1,
      originHasElevator: false,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 3,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CUSTOMER_PACKS',
      extraServices: ['insured'],
      photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'],
      notes: 'Yazlık dönüşü. Koliler hazırlandı, mobilya olarak sadece salon koltukları ve TV sehpası var.',
      status: 'ACTIVE',
      offersCount: 1,
      createdAt: new Date(now - 147 * HOUR).toISOString(), // 6 gün önce
      updatedAt: new Date(now - 147 * HOUR).toISOString(),
      isSeed: true
    },
    {
      id: 'req_seed_16',
      requestCode: '#63972',
      customerId: 'cust_hande',
      customerName: 'Hande T.',
      customerPhone: '0539 881 74 23',
      allowPhoneCall: true,
      serviceCategory: 'EVDEN_EVE',
      originCity: 'Kayseri',
      originDistrict: 'Melikgazi',
      destinationCity: 'Ankara',
      destinationDistrict: 'Yenimahalle',
      homeSize: '3+1',
      movingDate: formatTurkishDate(now + 15 * DAY),
      isDateFlexible: false,
      originFloor: 4,
      originHasElevator: true,
      originHasFreightElevator: false,
      originRequiresMobileElevator: false,
      originTruckAccess: true,
      destinationFloor: 2,
      destinationHasElevator: true,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: 'CARRIER_PACKS',
      extraServices: ['disassembly_assembly', 'white_goods_connection', 'insured'],
      photos: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80'],
      notes: 'Kayseri - Ankara nakliyesi. Mobilyaların söküm ve montajı dahil. Eşyalar temiz ve özenle taşınmalıdır.',
      status: 'ACTIVE',
      offersCount: 0,
      createdAt: new Date(now - 160 * HOUR).toISOString(), // 6 gün önce
      updatedAt: new Date(now - 160 * HOUR).toISOString(),
      isSeed: true
    }
  ];
}

export const SEED_REQUESTS: MovingRequest[] = getDynamicSeedRequests();

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
    createdAt: '2026-08-01T00:00:00Z',
    isSeed: true
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
    createdAt: '2026-08-01T00:00:00Z',
    isSeed: true
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
    createdAt: '2026-08-01T00:00:00Z',
    isSeed: true
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
  supportPhone: '0850 308 34 26',
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
    reviewsEnabled: true,
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
    if (user && user.email) {
      this.addRegisteredUser({
        id: user.id,
        email: user.email.toLowerCase(),
        phone: user.phone || '',
        fullName: user.fullName || user.companyName || '',
        companyName: user.companyName,
        role: user.role || 'CUSTOMER',
        createdAt: user.createdAt || new Date().toISOString(),
      });
    }
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
        phone: '0535 412 83 91',
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
        phone: '0533 624 18 90',
        role: 'CARRIER',
        companyName: 'Boğaziçi Profesyonel Nakliyat',
        carrierProfileId: 'carr_bogazici',
        createdAt: '2023-01-15T10:00:00Z'
      });
      return;
    }
    if (role === 'ADMIN') {
      this.setCurrentUser({
        id: 'user_admin_1',
        email: 'admin@TaşınTeklif.com',
        phone: '0850 308 34 26',
        role: 'ADMIN',
        createdAt: '2023-01-01T00:00:00Z'
      });
      return;
    }
  }

  // Get active carrier matching current logged-in user
  getCurrentCarrier(): CarrierProfile | null {
    const user = this.getCurrentUser();
    if (!user || user.role !== 'CARRIER') return null;
    const carriers = this.getCarriers();
    if (user.carrierProfileId) {
      const found = carriers.find(c => c.id === user.carrierProfileId);
      if (found) return found;
    }
    const foundByUserId = carriers.find(c => c.userId === user.id);
    if (foundByUserId) return foundByUserId;
    if (user.companyName) {
      const foundByName = carriers.find(c => c.companyName?.trim().toLowerCase() === user.companyName?.trim().toLowerCase());
      if (foundByName) return foundByName;
    }

    // Auto-create an unapproved trial carrier record for this new user so they never inherit another company
    const newCarrier: CarrierProfile = {
      id: `carr_${user.id}`,
      userId: user.id,
      companyName: user.companyName || '',
      slug: (user.companyName || user.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      authorizedPersonName: user.fullName || '',
      authorizedPersonSurname: '',
      phone: user.phone || '',
      email: user.email,
      shortBio: '',
      city: 'İstanbul',
      district: '',
      services: ['evden-eve'],
      serviceAreas: ['TÜM_TÜRKİYE'],
      verificationStatus: 'PENDING',
      verificationBadges: {
        identityVerified: false,
        taxVerified: false,
        transportPermitVerified: false,
        elevatorVerified: false
      },
      planId: 'trial',
      isProfileCompleted: Boolean(user.companyName && user.phone),
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      responseRatePercent: 100,
      joinedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    this.addCarrier(newCarrier);
    return newCarrier;
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
    const list = [carrier, ...this.getCarriers().filter(c => c.id !== carrier.id && c.userId !== carrier.userId)];
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

  getUsers(): (RegisteredUserRecord | User)[] {
    return this.getRegisteredUsers();
  }

  getUserById(id: string): (RegisteredUserRecord | User) | undefined {
    return this.getRegisteredUsers().find(u => u.id === id);
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
    const cleanEmail = user.email.trim().toLowerCase();
    const list = [...this.getRegisteredUsers().filter(u => u.id !== user.id && u.email.trim().toLowerCase() !== cleanEmail), user];
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
    const planId = carrier?.planId || 'plan_starter';
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
      lastPaymentAmount: planId === 'plan_gold' ? 4850 : planId === 'plan_pro' ? 2450 : 0,
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
    const list = this.getItem<MovingRequest[]>('requests', []);
    // Real customer requests created by actual users (where !r.isSeed)
    const realUserReqs = list.filter(r => !r.isSeed);
    
    // Dynamic seeds pool with fresh relative dates
    const seeds = getDynamicSeedRequests();

    // Check closed map override
    let closedMap: Record<string, { status: any; closedReason?: string }> = {};
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('tasinteklif_closed_requests');
        if (raw) closedMap = JSON.parse(raw);
      } catch {}
    }
    
    // Preserve any updates made to seeds (e.g. status closed or assigned)
    const userSeedMap = new Map<string, Partial<MovingRequest>>();
    list.filter(r => r.isSeed).forEach(sr => userSeedMap.set(sr.id, sr));

    const mergedSeeds = seeds.map(s => {
      const existing = userSeedMap.get(s.id);
      const override = closedMap[s.id] || (s.requestCode ? closedMap[s.requestCode] : null);
      if (override) {
        return {
          ...s,
          status: override.status,
          closedReason: override.closedReason,
          offersCount: existing?.offersCount !== undefined ? existing.offersCount : s.offersCount
        };
      }
      if (existing) {
        return {
          ...s,
          status: existing.status || s.status,
          closedReason: existing.closedReason,
          offersCount: existing.offersCount !== undefined ? existing.offersCount : s.offersCount
        };
      }
      return s;
    });

    const effectiveRealUserReqs = realUserReqs.map(r => {
      const override = closedMap[r.id] || (r.requestCode ? closedMap[r.requestCode] : null);
      if (override) {
        return { ...r, status: override.status, closedReason: override.closedReason };
      }
      return r;
    });

    return [...effectiveRealUserReqs, ...mergedSeeds].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  getRequestById(id: string): MovingRequest | undefined {
    return this.getRequests().find(r => r.id === id || r.requestCode === id);
  }

  addRequest(req: MovingRequest): void {
    const list = [req, ...this.getRequests()];
    this.setItem('requests', list);
  }

  updateRequest(id: string, updates: Partial<MovingRequest>): void {
    if (updates.status === 'CLOSED' || updates.status === 'ASSIGNED') {
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('tasinteklif_closed_requests') || '{}';
          const parsed = JSON.parse(raw);
          parsed[id] = { status: updates.status, closedReason: updates.closedReason };
          localStorage.setItem('tasinteklif_closed_requests', JSON.stringify(parsed));
        } catch {}
      }
    }
    const list = this.getRequests().map(r => (r.id === id || r.requestCode === id) ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r);
    this.setItem('requests', list);
  }

  generateRandomMockRequest(): MovingRequest {
    const now = Date.now();
    const citiesAndDistricts = [
      { city: 'İstanbul', dist: 'Kadıköy', destCity: 'Ankara', destDist: 'Çankaya' },
      { city: 'İstanbul', dist: 'Beşiktaş', destCity: 'İzmir', destDist: 'Karşıyaka' },
      { city: 'İstanbul', dist: 'Bakırköy', destCity: 'İstanbul', destDist: 'Maltepe' },
      { city: 'İstanbul', dist: 'Sarıyer', destCity: 'Muğla', destDist: 'Bodrum' },
      { city: 'Ankara', dist: 'Çankaya', destCity: 'İstanbul', destDist: 'Ataşehir' },
      { city: 'İzmir', dist: 'Bornova', destCity: 'Bursa', destDist: 'Nilüfer' },
      { city: 'Bursa', dist: 'Nilüfer', destCity: 'Antalya', destDist: 'Muratpaşa' },
      { city: 'Antalya', dist: 'Konyaaltı', destCity: 'İstanbul', destDist: 'Pendik' },
      { city: 'Kocaeli', dist: 'İzmit', destCity: 'İzmir', destDist: 'Çiğli' },
      { city: 'Eskişehir', dist: 'Tepebaşı', destCity: 'Ankara', destDist: 'Yenimahalle' },
    ];
    const names = ['Tolga M.', 'Ezgi S.', 'Hakan V.', 'Ceren D.', 'Kaan R.', 'Tuğçe K.', 'Volkan A.', 'Gözde B.', 'Koray T.', 'Seda N.'];
    const notesPool = [
      'Salon takımı, gardırop ve beyaz eşyalar taşınacak. Mobilya montajı fiyata dahil olmalıdır.',
      'Kırılacak cam eşyalar ve mutfak tarafımızca kolilendi. Kaba mobilyaların sarılması rica olunur.',
      'Evimizde dış cephe asansörü kurulması gerekiyor, bina içi taşımaya izin verilmiyor.',
      'Yeni taşınacağımız ev zemin kat, eşyaların çizilmeden özenle yerleştirilmesini istiyoruz.',
      'Ofis masaları ve dosya dolapları taşınacak. Hafta sonu tamamlanması tercihimizdir.',
      'Öğrenci evimizi taşıyoruz, sadece büyük eşyalar ve birkaç koli var. Uygun teklif bekliyoruz.',
      'Memur tayini nedeniyle taşınıyoruz. Kurumsal sözleşme ve k1 yetki belgesi şarttır.',
      'Eşyaların tamamı çift kat havalı naylonla sarılmalıdır, hassas mobilyalarımız var.'
    ];
    const sizes = ['1+1', '2+1', '3+1', '2+1', '3+1', '4+1'];
    
    const pair = citiesAndDistricts[Math.floor(Math.random() * citiesAndDistricts.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const note = notesPool[Math.floor(Math.random() * notesPool.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const randomCode = `#${Math.floor(10000 + Math.random() * 89999)}`;
    const randomDays = Math.floor(2 + Math.random() * 8);

    const newReq: MovingRequest = {
      id: `req_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      requestCode: randomCode,
      customerId: `cust_mock_${Date.now()}`,
      customerName: name,
      customerPhone: `053${Math.floor(2 + Math.random() * 7)} ${Math.floor(100 + Math.random() * 899)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`,
      allowPhoneCall: true,
      serviceCategory: size.includes('office') ? 'OFIS_TASIMA' : 'EVDEN_EVE',
      originCity: pair.city,
      originDistrict: pair.dist,
      destinationCity: pair.destCity,
      destinationDistrict: pair.destDist,
      homeSize: size,
      movingDate: formatTurkishDate(now + randomDays * 86400000),
      isDateFlexible: true,
      flexibleDays: 2,
      originFloor: Math.floor(1 + Math.random() * 4),
      originHasElevator: Math.random() > 0.4,
      originHasFreightElevator: false,
      originRequiresMobileElevator: Math.random() > 0.7,
      originTruckAccess: true,
      destinationFloor: Math.floor(1 + Math.random() * 4),
      destinationHasElevator: Math.random() > 0.3,
      destinationHasFreightElevator: false,
      destinationRequiresMobileElevator: false,
      destinationTruckAccess: true,
      packagingPreference: Math.random() > 0.5 ? 'CARRIER_PACKS' : 'CUSTOMER_PACKS',
      extraServices: ['disassembly_assembly', 'insured'],
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'],
      notes: note,
      status: 'ACTIVE',
      offersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSeed: false
    };

    const currentList = this.getItem<MovingRequest[]>('requests', []);
    this.setItem('requests', [newReq, ...currentList]);
    return newReq;
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

  addOffer(offer: Offer, requestContext?: MovingRequest): void {
    const list = [offer, ...this.getOffers().filter(o => o.id !== offer.id)];
    this.setItem('offers', list);

    // Request context resolution
    let req = requestContext || this.getRequestById(offer.requestId);
    if (!req && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('tasinteklif_requests');
        if (raw) {
          const allReqs: MovingRequest[] = JSON.parse(raw);
          req = allReqs.find(r => r.id === offer.requestId || r.requestCode === offer.requestId);
        }
      } catch {}
    }

    // If request is available, ensure it is persisted with updated offersCount
    if (requestContext) {
      const currentReqs = this.getRequests();
      const existingReqIndex = currentReqs.findIndex(r => r.id === requestContext.id);
      const updatedReq = {
        ...requestContext,
        offersCount: (requestContext.offersCount || 0) + 1,
        updatedAt: new Date().toISOString()
      };
      if (existingReqIndex >= 0) {
        currentReqs[existingReqIndex] = updatedReq;
        this.setItem('requests', currentReqs);
      } else {
        this.setItem('requests', [updatedReq, ...currentReqs]);
      }
      req = updatedReq;
    } else if (req) {
      this.updateRequest(req.id, { offersCount: (req.offersCount || 0) + 1 });
    }

    // Auto-create chat & message to customer
    const customerId = req?.customerId || (req as any)?.userId || 'user_cust_1';
    const customerEmail = req?.customerEmail || '';
    const customerPhone = req?.customerPhone || '';
    const customerName = req?.customerName || 'Müşteri';

    const carrier = this.getCarriers().find(c => c.id === offer.carrierId) || offer.carrier;
    const carrierUserId = carrier?.userId || `user_${offer.carrierId}`;
    const carrierName = carrier?.companyName || 'Nakliye Firması';

    // Build comprehensive participant IDs to ensure matching on ANY browser / auth method
    const participantIds = Array.from(new Set([
      customerId,
      carrierUserId,
      carrier?.id,
      offer.carrierId,
      customerEmail,
      customerEmail.toLowerCase(),
      customerPhone
    ].filter(Boolean))) as string[];

    const conversations = this.getConversations();
    let conv = conversations.find(c => 
      c.contextId === offer.requestId && 
      (c.participantIds.includes(carrierUserId) || c.participantIds.includes(carrier?.id || '') || c.participantIds.includes(offer.carrierId))
    );

    const now = new Date().toISOString();
    const carrierNoteText = offer.notes && offer.notes !== 'Hızlı teklif iletildi.'
      ? offer.notes
      : `${offer.price.toLocaleString('tr-TR')} TL teklif gönderdim`;

    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        participantIds,
        participantNames: {
          [customerId]: customerName,
          [carrierUserId]: carrierName,
          ...(customerEmail ? { [customerEmail]: customerName } : {}),
          ...(customerPhone ? { [customerPhone]: customerName } : {})
        },
        contextType: 'REQUEST',
        contextId: offer.requestId,
        contextTitle: `${req?.requestCode || ''} · ${req?.originDistrict || req?.originCity || ''} → ${req?.destinationDistrict || req?.destinationCity || ''}`,
        lastMessage: carrierNoteText,
        lastMessageAt: now,
        unreadCounts: {
          [customerId]: 1,
          [carrierUserId]: 0
        },
        createdAt: now
      };
      this.setItem('conversations', [conv, ...conversations]);
    } else {
      conv.participantIds = Array.from(new Set([...conv.participantIds, ...participantIds]));
      conv.lastMessage = carrierNoteText;
      conv.lastMessageAt = now;
      conv.unreadCounts = {
        ...(conv.unreadCounts || {}),
        [customerId]: ((conv.unreadCounts?.[customerId] || 0) + 1)
      };
      this.setItem('conversations', conversations.map(c => c.id === conv!.id ? conv! : c));
    }

    const offerCardMsg: ConversationMessage = {
      id: `msg_${Date.now()}_1`,
      conversationId: conv.id,
      senderId: carrierUserId,
      senderName: carrierName,
      senderRole: 'CARRIER',
      content: `${req?.requestCode || ''} · ${req?.originDistrict || ''}, ${req?.originCity || ''} → ${req?.destinationDistrict || ''}, ${req?.destinationCity || ''}\n· Evden Eve Nakliyat · ${offer.price.toLocaleString('tr-TR')} TL teklif${offer.notes && offer.notes !== 'Hızlı teklif iletildi.' ? `\n· Firma Notu: "${offer.notes}"` : ''}`,
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
      content: carrierNoteText,
      createdAt: new Date(Date.now() + 1000).toISOString()
    };

    this.setItem('messages', [...this.getAllMessages(), offerCardMsg, textMsg]);

    // Background sync to server API so all browsers, incognito windows, and tabs receive this offer & chat!
    if (typeof window !== 'undefined') {
      fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer,
          request: req,
          conversation: conv,
          messages: [offerCardMsg, textMsg]
        })
      }).catch(err => console.warn('Offers API background sync error:', err));
    }

  }

  updateOffer(id: string, updates: Partial<Offer>): void {
    const list = this.getOffers().map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o);
    this.setItem('offers', list);
  }

  withdrawOffer(id: string): boolean {
    const offers = this.getOffers();
    const offer = offers.find(o => o.id === id);
    if (!offer) return false;

    const list = offers.map(o => o.id === id ? { ...o, status: 'WITHDRAWN' as const, updatedAt: new Date().toISOString() } : o);
    this.setItem('offers', list);

    const req = this.getRequestById(offer.requestId);
    if (req && req.offersCount > 0) {
      this.updateRequest(req.id, { offersCount: Math.max(0, req.offersCount - 1) });
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('offer-updated', { detail: { id, status: 'WITHDRAWN' } }));
    }
    return true;
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

  // Public bulk update helpers (used for cross-browser API sync)
  bulkMergeConversations(newConvs: Conversation[]): void {
    const current = this.getConversations();
    const map = new Map<string, Conversation>();
    current.forEach(c => map.set(c.id, c));
    newConvs.forEach(nc => {
      const existing = map.get(nc.id);
      if (!existing || new Date(nc.lastMessageAt || 0) >= new Date(existing.lastMessageAt || 0)) {
        map.set(nc.id, nc);
      }
    });
    this.setItem('conversations', Array.from(map.values()));
  }

  bulkMergeMessages(newMsgs: ConversationMessage[]): void {
    const existing = this.getAllMessages();
    const map = new Map<string, ConversationMessage>();
    existing.forEach(m => map.set(m.id, m));
    newMsgs.forEach(m => map.set(m.id, m));
    this.setItem('messages', Array.from(map.values()));
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
        updatedAt: '2026-08-25T09:30:00Z',
        isSeed: true
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

  // Real Data Fetchers (Filters out seed / demo data)
  getRealCarriers(): CarrierProfile[] {
    return this.getCarriers().filter(c => !isSeedCarrier(c));
  }

  getRealRegisteredUsers(): RegisteredUserRecord[] {
    return this.getRegisteredUsers().filter(u => !isSeedUser(u));
  }

  getRealRequests(): MovingRequest[] {
    return this.getRequests().filter(r => !isSeedRequest(r));
  }

  getRealDocuments(): CarrierDocument[] {
    return this.getDocuments().filter(d => !isSeedDoc(d));
  }

  getRealLeads(): DigitalServiceLead[] {
    return this.getLeads().filter(l => !isSeedLead(l));
  }

  getRealAdCampaigns(): AdCampaign[] {
    return this.getAdCampaigns().filter(c => !isSeedCampaign(c));
  }

  // Purge demo data permanently from localStorage
  clearDemoData(): void {
    if (!this.isClient) return;

    // Filter carriers
    const realCarriers = this.getRealCarriers();
    this.setItem('carriers', realCarriers);

    // Filter registered users
    const realUsers = this.getRealRegisteredUsers();
    this.setItem('registeredUsers', realUsers);

    // Filter requests
    const realRequests = this.getRealRequests();
    this.setItem('requests', realRequests);

    // Filter documents
    const realDocs = this.getRealDocuments();
    this.setItem('documents', realDocs);

    // Filter leads
    const realLeads = this.getRealLeads();
    this.setItem('digital_leads', realLeads);

    // Filter ad campaigns
    const realCamps = this.getRealAdCampaigns();
    this.setItem('ad_campaigns', realCamps);

    // Filter offers
    const realOffers = this.getOffers().filter(o => 
      !SEED_CARRIER_IDS.has(o.carrierId) && !SEED_REQUEST_IDS.has(o.requestId)
    );
    this.setItem('offers', realOffers);

    // Dispatches storage/auth updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('storage-updated'));
      window.dispatchEvent(new CustomEvent('auth-changed', { detail: this.getCurrentUser() }));
    }
  }
}

export const db = new MockDatabase();

// Seed identification constants & helpers
export const SEED_CARRIER_IDS = new Set([
  'carr_saycanlar', 
  'carr_bogazici', 
  'carr_ege_trans', 
  'carr_anadolu_ekspres', 
  'carr_karadeniz_yildiz', 
  'carr_baskent_ekspres', 
  'carr_yeni_onay_bekleyen'
]);

export const SEED_USER_IDS = new Set([
  'user_cust_1', 
  'user_carr_1', 
  'user_carr_pending', 
  'user_carr_saycanlar', 
  'user_admin_1', 
  'user_cust_2', 
  'user_cust_3'
]);

export const SEED_REQUEST_IDS = new Set([
  'req_1', 
  'req_2', 
  'req_3', 
  'req_4', 
  '#26368', 
  '#38491', 
  '#49102', 
  '#51283'
]);

export const SEED_DOC_IDS = new Set(['doc_1', 'doc_2']);
export const SEED_CAMPAIGN_IDS = new Set(['camp_1', 'camp_2', 'camp_3']);
export const SEED_LEAD_IDS = new Set(['lead_1']);

export function isSeedCarrier(carrier: CarrierProfile): boolean {
  if (carrier.isSeed) return true;
  if (SEED_CARRIER_IDS.has(carrier.id)) return true;
  if (carrier.userId && SEED_USER_IDS.has(carrier.userId)) return true;
  return false;
}

export function isSeedUser(user: RegisteredUserRecord | User): boolean {
  if ('isSeed' in user && Boolean((user as any).isSeed)) return true;
  if (SEED_USER_IDS.has(user.id)) return true;
  if ('carrierId' in user && user.carrierId && SEED_CARRIER_IDS.has(user.carrierId)) return true;
  return false;
}

export function isSeedRequest(req: MovingRequest): boolean {
  if (req.isSeed) return true;
  if (SEED_REQUEST_IDS.has(req.id) || (req.requestCode && SEED_REQUEST_IDS.has(req.requestCode))) return true;
  if (req.customerId && (req.customerId.startsWith('cust_') || SEED_USER_IDS.has(req.customerId))) return true;
  return false;
}

export function isSeedDoc(doc: CarrierDocument): boolean {
  if (doc.isSeed) return true;
  if (SEED_DOC_IDS.has(doc.id)) return true;
  if (SEED_CARRIER_IDS.has(doc.carrierId)) return true;
  return false;
}

export function isSeedLead(lead: DigitalServiceLead): boolean {
  if (lead.isSeed) return true;
  if (SEED_LEAD_IDS.has(lead.id)) return true;
  if (lead.carrierId && SEED_CARRIER_IDS.has(lead.carrierId)) return true;
  return false;
}

export function isSeedCampaign(camp: AdCampaign): boolean {
  if (camp.isSeed) return true;
  if (SEED_CAMPAIGN_IDS.has(camp.id)) return true;
  if (camp.carrierId && SEED_CARRIER_IDS.has(camp.carrierId)) return true;
  return false;
}
