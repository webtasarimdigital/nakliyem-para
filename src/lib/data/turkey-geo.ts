export interface CityData {
  id: number;
  name: string;
  slug: string;
  region: 'Marmara' | 'İç Anadolu' | 'Ege' | 'Akdeniz' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  districts: string[];
  isPopular?: boolean;
}

export const TURKEY_CITIES: CityData[] = [
  {
    id: 34,
    name: 'İstanbul',
    slug: 'istanbul',
    region: 'Marmara',
    isPopular: true,
    districts: [
      'Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy', 'Esenyurt', 'Beylikdüzü', 
      'Ataşehir', 'Maltepe', 'Pendik', 'Ümraniye', 'Şişli', 'Sarıyer', 
      'Kartal', 'Başakşehir', 'Küçükçekmece', 'Bahçelievler', 'Bağcılar', 
      'Fatih', 'Eyüpsultan', 'Tuzla', 'Çekmeköy', 'Sancaktepe', 'Sultanbeyli', 
      'Zeytinburnu', 'Gaziosmanpaşa', 'Güngören', 'Avcılar', 'Büyükçekmece', 
      'Silivri', 'Arnavutköy', 'Çatalca', 'Şile', 'Adalar'
    ]
  },
  {
    id: 6,
    name: 'Ankara',
    slug: 'ankara',
    region: 'İç Anadolu',
    isPopular: true,
    districts: [
      'Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 
      'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı', 'Çubuk', 'Kahramankazan', 
      'Beypazarı', 'Elmadağ', 'Şereflikoçhisar', 'Akyurt', 'Nallıhan', 'Kızılcahamam'
    ]
  },
  {
    id: 35,
    name: 'İzmir',
    slug: 'izmir',
    region: 'Ege',
    isPopular: true,
    districts: [
      'Karşıyaka', 'Konak', 'Bornova', 'Buca', 'Çiğli', 'Bayraklı', 
      'Karabağlar', 'Gaziemir', 'Balçova', 'Narlıdere', 'Güzelbahçe', 
      'Urla', 'Çeşme', 'Menemen', 'Torbalı', 'Kemalpaşa', 'Aliağa', 
      'Seferihisar', 'Foça', 'Ödemiş', 'Bergama', 'Tire', 'Dikili'
    ]
  },
  {
    id: 16,
    name: 'Bursa',
    slug: 'bursa',
    region: 'Marmara',
    isPopular: true,
    districts: [
      'Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'Gemlik', 'İnegöl', 
      'Gürsu', 'Kestel', 'Mustafakemalpaşa', 'Karacabey', 'Orhangazi', 'İznik'
    ]
  },
  {
    id: 7,
    name: 'Antalya',
    slug: 'antalya',
    region: 'Akdeniz',
    isPopular: true,
    districts: [
      'Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 
      'Kemer', 'Kumluca', 'Kaş', 'Finike', 'Gazipaşa', 'Döşemealtı', 'Aksu'
    ]
  },
  {
    id: 1,
    name: 'Adana',
    slug: 'adana',
    region: 'Akdeniz',
    isPopular: true,
    districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Ceyhan', 'Kozan', 'İmamoğlu']
  },
  {
    id: 42,
    name: 'Konya',
    slug: 'konya',
    region: 'İç Anadolu',
    isPopular: true,
    districts: ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Seydişehir']
  },
  {
    id: 33,
    name: 'Mersin',
    slug: 'mersin',
    region: 'Akdeniz',
    isPopular: true,
    districts: ['Yenişehir', 'Mezitli', 'Toroslar', 'Akdeniz', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur']
  },
  {
    id: 41,
    name: 'Kocaeli',
    slug: 'kocaeli',
    region: 'Marmara',
    isPopular: true,
    districts: ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Gölcük', 'Derince', 'Çayırova', 'Kartepe', 'Başiskele']
  },
  {
    id: 26,
    name: 'Eskişehir',
    slug: 'eskisehir',
    region: 'İç Anadolu',
    isPopular: true,
    districts: ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Seyitgazi']
  },
  {
    id: 27,
    name: 'Gaziantep',
    slug: 'gaziantep',
    region: 'Güneydoğu Anadolu',
    isPopular: true,
    districts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı', 'Oğuzeli']
  },
  {
    id: 55,
    name: 'Samsun',
    slug: 'samsun',
    region: 'Karadeniz',
    isPopular: true,
    districts: ['Atakum', 'İlkadım', 'Canik', 'Bafra', 'Çarşamba', 'Tekkeköy', 'Terme']
  },
  {
    id: 61,
    name: 'Trabzon',
    slug: 'trabzon',
    region: 'Karadeniz',
    isPopular: true,
    districts: ['Ortahisar', 'Akçaabat', 'Yomra', 'Vakfıkebir', 'Of', 'Sürmene', 'Beşikdüzü']
  },
  {
    id: 48,
    name: 'Muğla',
    slug: 'mugla',
    region: 'Ege',
    isPopular: true,
    districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Menteşe', 'Milas', 'Ortaca', 'Datça', 'Dalaman']
  },
  {
    id: 20,
    name: 'Denizli',
    slug: 'denizli',
    region: 'Ege',
    districts: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas', 'Honaz']
  },
  {
    id: 54,
    name: 'Sakarya',
    slug: 'sakarya',
    region: 'Marmara',
    districts: ['Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Karasu', 'Sapanca']
  },
  {
    id: 59,
    name: 'Tekirdağ',
    slug: 'tekirdag',
    region: 'Marmara',
    districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene', 'Malkara']
  },
  {
    id: 10,
    name: 'Balıkesir',
    slug: 'balikesir',
    region: 'Marmara',
    districts: ['Altıeylül', 'Karesi', 'Bandırma', 'Edremit', 'Gönen', 'Ayvalık', 'Burhaniye']
  },
  {
    id: 38,
    name: 'Kayseri',
    slug: 'kayseri',
    region: 'İç Anadolu',
    districts: ['Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Bünyan']
  },
  {
    id: 52,
    name: 'Ordu',
    slug: 'ordu',
    region: 'Karadeniz',
    districts: ['Altınordu', 'Ünye', 'Fatsa', 'Gölköy', 'Perşembe', 'Korgan']
  },
  {
    id: 21,
    name: 'Diyarbakır',
    slug: 'diyarbakir',
    region: 'Güneydoğu Anadolu',
    districts: ['Bağlar', 'Kayapınar', 'Yenişehir', 'Sur', 'Ergani', 'Bismil', 'Silvan']
  },
  {
    id: 44,
    name: 'Malatya',
    slug: 'malatya',
    region: 'Doğu Anadolu',
    districts: ['Battalgazi', 'Yeşilyurt', 'Doğanşehir', 'Akçadağ', 'Darende']
  },
  {
    id: 25,
    name: 'Erzurum',
    slug: 'erzurum',
    region: 'Doğu Anadolu',
    districts: ['Yakutiye', 'Palandöken', 'Aziziye', 'Oltu', 'Horasan', 'Pasinler']
  },
  {
    id: 65,
    name: 'Van',
    slug: 'van',
    region: 'Doğu Anadolu',
    districts: ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Başkale']
  },
  {
    id: 63,
    name: 'Şanlıurfa',
    slug: 'sanliurfa',
    region: 'Güneydoğu Anadolu',
    districts: ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Suruç', 'Birecik']
  },
  {
    id: 17,
    name: 'Çanakkale',
    slug: 'canakkale',
    region: 'Marmara',
    districts: ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Yenice', 'Ayvacık', 'Ezine']
  },
  {
    id: 45,
    name: 'Manisa',
    slug: 'manisa',
    region: 'Ege',
    districts: ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli', 'Soma', 'Alaşehir']
  },
  {
    id: 9,
    name: 'Aydın',
    slug: 'aydin',
    region: 'Ege',
    districts: ['Efeler', 'Kuşadası', 'Didim', 'Nazilli', 'Söke', 'İncirliova', 'Çine']
  },
  {
    id: 14,
    name: 'Bolu',
    slug: 'bolu',
    region: 'Karadeniz',
    districts: ['Merkez', 'Gerede', 'Mengen', 'Göynük', 'Mudurnu']
  },
  {
    id: 67,
    name: 'Zonguldak',
    slug: 'zonguldak',
    region: 'Karadeniz',
    districts: ['Merkez', 'Ereğli', 'Çaycuma', 'Devrek', 'Kozlu', 'Kilimli']
  },
  {
    id: 77,
    name: 'Yalova',
    slug: 'yalova',
    region: 'Marmara',
    districts: ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu', 'Termal']
  },
  {
    id: 81,
    name: 'Düzce',
    slug: 'duzce',
    region: 'Karadeniz',
    districts: ['Merkez', 'Akçakoca', 'Kaynaşlı', 'Gölyaka', 'Çilimli']
  }
];

// Major route distance calculation helper in Turkey (approximate highway KM)
const DISTANCE_MATRIX: { [key: string]: { km: number; durationHours: number } } = {
  'istanbul-ankara': { km: 450, durationHours: 5 },
  'istanbul-izmir': { km: 480, durationHours: 5.5 },
  'istanbul-bursa': { km: 155, durationHours: 2 },
  'istanbul-antalya': { km: 695, durationHours: 8.5 },
  'istanbul-adana': { km: 935, durationHours: 10.5 },
  'istanbul-trabzon': { km: 1060, durationHours: 12.5 },
  'istanbul-samsun': { km: 735, durationHours: 8.5 },
  'istanbul-gaziantep': { km: 1140, durationHours: 12.5 },
  'istanbul-diyarbakir': { km: 1435, durationHours: 16 },
  'istanbul-bodrum': { km: 690, durationHours: 7.5 },
  'ankara-izmir': { km: 585, durationHours: 6.5 },
  'ankara-antalya': { km: 480, durationHours: 6 },
  'ankara-bursa': { km: 385, durationHours: 4.5 },
  'ankara-adana': { km: 490, durationHours: 5.5 },
  'ankara-trabzon': { km: 760, durationHours: 9 },
  'ankara-diyarbakir': { km: 1000, durationHours: 11.5 },
  'izmir-antalya': { km: 460, durationHours: 5.5 },
  'izmir-bursa': { km: 345, durationHours: 4 },
  'trabzon-istanbul': { km: 1060, durationHours: 12.5 },
};

export function calculateDistance(originCity: string, destinationCity: string): { km: number; durationHours: number } {
  if (!originCity || !destinationCity) return { km: 0, durationHours: 0 };
  if (originCity.toLowerCase() === destinationCity.toLowerCase()) {
    return { km: 35, durationHours: 1 }; // Inner-city average
  }

  const key1 = `${originCity.toLowerCase()}-${destinationCity.toLowerCase()}`;
  const key2 = `${destinationCity.toLowerCase()}-${originCity.toLowerCase()}`;

  if (DISTANCE_MATRIX[key1]) return DISTANCE_MATRIX[key1];
  if (DISTANCE_MATRIX[key2]) return DISTANCE_MATRIX[key2];

  // Heuristic estimation based on Turkish geography
  return { km: 520, durationHours: 6 };
}
