export interface IntercityRoute {
  slug: string;
  originCity: string;
  destinationCity: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  distanceKm: number;
  durationHours: string;
  overview: string;
  prices2026: {
    homeType: string;
    priceRange: string;
    details: string;
  }[];
  routeTips: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const INTERCITY_ROUTES: IntercityRoute[] = [
  {
    slug: 'istanbul-ankara-nakliyat',
    originCity: 'İstanbul',
    destinationCity: 'Ankara',
    title: 'İstanbul Ankara Evden Eve Nakliyat & Taşıma Fiyatları 2026',
    metaTitle: 'İstanbul Ankara Nakliyat Fiyatları 2026 (450 km)',
    metaDescription: 'İstanbul Ankara evden eve nakliyat kaç para? 450 km rota için güncel 2026 fiyatları, asansörlü taşıma, paketleme ve K3 onaylı nakliyecilerden ücretsiz teklif alın.',
    distanceKm: 450,
    durationHours: '5 - 6 saat',
    overview: 'İstanbul ile Ankara arasındaki 450 kilometrelik hat, Türkiye’nin en yoğun şehirlerarası taşınma koridorudur. O-4 Anadolu Otoyolu üzerinden gerçekleştirilen sevkiyatlarda aynı gün veya ertesi sabah teslimat imkanı bulunmaktadır.',
    prices2026: [
      { homeType: '1+1 Daire', priceRange: '18.000 TL – 24.000 TL', details: 'Küçük kapalı kasa kamyonet, 2 personel, temel paketleme' },
      { homeType: '2+1 Daire', priceRange: '24.000 TL – 34.000 TL', details: 'Orta boy kamyon, marangozlu mobilya söküm/montaj, patpat ambalaj' },
      { homeType: '3+1 Daire', priceRange: '32.000 TL – 44.000 TL', details: 'Büyük kapalı kasa nakliye kamyonu, 4 personel, tam korumalı ambalaj' },
      { homeType: 'Parça Eşya (Parsiyel)', priceRange: '6.500 TL – 12.000 TL', details: 'Dönüş yapan kamyonlarda paylaşımlı alan avantajı' },
    ],
    routeTips: [
      'Bolu Tüneli ve kış şartları: Kış aylarında Bolu Dağı geçişinde hava koşulları göz önünde bulundurulmalı, kış lastiği ve zincir donanımlı profesyonel araçlar seçilmelidir.',
      'Dönüş aracı avantajı: İstanbul’dan Ankara’ya eşya götürüp boş dönen araçları Nakliyeci Defteri üzerinden bularak %35 daha uygun fiyat yakalayabilirsiniz.',
      'Mobil asansör gereksinimi: Ankara Çankaya, Keçiören, Batıkent gibi yüksek katlı sitelerde bina yönetimi yük asansörüne izin vermeyebilir; dış cephe mobil asansör rezerve edilmelidir.',
    ],
    faqs: [
      {
        question: 'İstanbul Ankara arası taşınma kaç saat sürer?',
        answer: 'Kamyonun seyir süresi ortalama 5-6 saattir. Sabah 08:00’de yüklenen eşyalar genellikle aynı gün akşam veya ertesi gün sabah erken saatlerde yeni adrese indirilir.',
      },
      {
        question: 'İstanbul Ankara nakliyat sigortası zorunlu mu?',
        answer: 'Evet, şehirlerarası yollarda tüm onaylı firmalarımız yük emtia nakliyat sigortası düzenlemektedir.',
      },
    ],
  },
  {
    slug: 'istanbul-izmir-nakliyat',
    originCity: 'İstanbul',
    destinationCity: 'İzmir',
    title: 'İstanbul İzmir Evden Eve Nakliyat & Fiyat Hesaplama 2026',
    metaTitle: 'İstanbul İzmir Nakliyat Fiyatları 2026 (480 km)',
    metaDescription: 'İstanbul İzmir evden eve nakliyat ücretleri ne kadar? O-5 otoyolu güzergahında 2026 güncel fiyatları, parsiyel taşıma ve onaylı nakliye firmaları.',
    distanceKm: 480,
    durationHours: '5 - 6 saat',
    overview: 'İstanbul - İzmir O-5 Otoyolu ve Osmangazi Köprüsü sayesinde iki metropol arasındaki taşınma süresi yarı yarıya inmiştir. Ege bölgesine yapılan taşınmalarda yaz aylarında artan talebe karşı erken rezervasyon önerilir.',
    prices2026: [
      { homeType: '1+1 Daire', priceRange: '20.000 TL – 27.000 TL', details: 'Otoyol ve köprü geçişleri dahil ortalama bütçe' },
      { homeType: '2+1 Daire', priceRange: '26.000 TL – 38.000 TL', details: 'Marangozlu montaj, çift kat patpat ambalajlama' },
      { homeType: '3+1 Daire', priceRange: '36.000 TL – 48.000 TL', details: 'Geniş çelik kasa araç, tam sigorta teminatı' },
      { homeType: 'Parça Eşya (Parsiyel)', priceRange: '7.500 TL – 13.500 TL', details: 'Yazlık ve öğrenci eşyaları için paylaşımlı nakliyat' },
    ],
    routeTips: [
      'Osmangazi Köprüsü ve otoyol ücretleri teklife dahil olmalıdır; teklif alırken net fiyat talep edin.',
      'İzmir Karşıyaka, Bornova ve Çeşme gibi bölgelerde sokaklar dar olabileceğinden araç boyutu önceden bildirilmelidir.',
    ],
    faqs: [
      {
        question: 'İstanbul İzmir nakliyat kaç günde teslim edilir?',
        answer: 'Osmangazi köprüsü hattı ile nakliye araçları genellikle 24 saat içinde adrese varış sağlayıp teslimatı tamamlar.',
      },
    ],
  },
  {
    slug: 'istanbul-antalya-nakliyat',
    originCity: 'İstanbul',
    destinationCity: 'Antalya',
    title: 'İstanbul Antalya Evden Eve Nakliyat & Taşınma Ücretleri 2026',
    metaTitle: 'İstanbul Antalya Nakliyat Fiyatları 2026 (720 km)',
    metaDescription: 'İstanbul Antalya evden eve nakliyat fiyatları 2026. 720 km Akdeniz rotasında sigortalı, asansörlü ve marangozlu ev taşıma teklifleri alın.',
    distanceKm: 720,
    durationHours: '8 - 10 saat',
    overview: 'İstanbul’dan Antalya’ya yapılan taşınmalar genellikle 720 km olup Afyonkarahisar veya Kütahya üzerinden gerçekleştirilir. Yazlıkçılar ve Antalya’ya yerleşen aileler için haftalık düzenli parsiyel ve komple seferler düzenlenmektedir.',
    prices2026: [
      { homeType: '1+1 Daire', priceRange: '25.000 TL – 34.000 TL', details: 'Uzun yol sigortası ve yakıt dahil' },
      { homeType: '2+1 Daire', priceRange: '32.000 TL – 46.000 TL', details: 'Full mobilya demontaj ve montaj desteği' },
      { homeType: '3+1 Daire', priceRange: '42.000 TL – 58.000 TL', details: 'Büyük 10 teker nakliye kamyonu' },
      { homeType: 'Parça Eşya (Parsiyel)', priceRange: '8.500 TL – 16.000 TL', details: 'Koli ve tek mobilya taşımalarında ekonomik çözüm' },
    ],
    routeTips: [
      'Antalya’da yaz aylarındaki aşırı sıcaklık nedeniyle taşıma işlemlerinin sabah erken saatlerde başlatılması tavsiye edilir.',
      'Muratpaşa, Konyaaltı ve Alanya gibi merkezlerde bina katları yüksek olduğundan mobil asansör tercih edilmelidir.',
    ],
    faqs: [
      {
        question: 'Eşyalar ne zaman teslim edilir?',
        answer: '720 km mesafe için yükleme yapıldıktan sonraki gün sabah Antalya adresinde eşyaların indirilmesi sağlanır.',
      },
    ],
  },
  {
    slug: 'ankara-istanbul-nakliyat',
    originCity: 'Ankara',
    destinationCity: 'İstanbul',
    title: 'Ankara İstanbul Evden Eve Nakliyat Fiyatları & Rota Rehberi 2026',
    metaTitle: 'Ankara İstanbul Nakliyat Fiyatları 2026 (Dönüş Seferleri)',
    metaDescription: 'Ankara İstanbul evden eve nakliyat kaç TL? Başkentten İstanbula sigortalı, asansörlü ev taşıma fiyatları ve en iyi nakliye firmaları.',
    distanceKm: 450,
    durationHours: '5 - 6 saat',
    overview: 'Ankara’dan İstanbul’a memur tayinleri, iş değişiklikleri ve üniversite öğrencileri için haftanın her günü kesintisiz seferler düzenlenir. İstanbul girişindeki trafik yoğunluğuna göre teslimat saati optimize edilir.',
    prices2026: [
      { homeType: '1+1 Daire', priceRange: '17.500 TL – 24.000 TL', details: 'Ankara çıkışlı hızlı ekspres sevkiyat' },
      { homeType: '2+1 Daire', priceRange: '23.000 TL – 33.000 TL', details: 'Marangozlu montaj, ambalajlama ve sigorta' },
      { homeType: '3+1 Daire', priceRange: '30.000 TL – 42.000 TL', details: 'Komple ev eşyası taşıma kamyonu' },
      { homeType: 'Parça Eşya (Parsiyel)', priceRange: '6.000 TL – 11.500 TL', details: 'Dönüş yükü avantajlı parça taşıma' },
    ],
    routeTips: [
      'İstanbul Anadolu ve Avrupa yakası geçişlerinde Avrasya Tüneli kamyonlara kapalıdır; Yavuz Sultan Selim veya FSM Köprüsü güzergahı kullanılır.',
    ],
    faqs: [
      {
        question: 'Ankara’dan İstanbul’a aynı gün teslimat mümkün mü?',
        answer: 'Evet, sabah erken saatte yükleme yapıldığında akşam saatlerinde İstanbul’a teslimat gerçekleştirilebilir.',
      },
    ],
  },
  {
    slug: 'izmir-istanbul-nakliyat',
    originCity: 'İzmir',
    destinationCity: 'İstanbul',
    title: 'İzmir İstanbul Evden Eve Nakliyat & Güncel Fiyatlar 2026',
    metaTitle: 'İzmir İstanbul Nakliyat Fiyatları 2026 (480 km)',
    metaDescription: 'İzmirden İstanbula ev taşıma fiyatları 2026. O-5 otoyolu üzerinden güvenli, K3 belgeli ve asansörlü nakliyat teklifleri toplayın.',
    distanceKm: 480,
    durationHours: '5 - 6 saat',
    overview: 'Ege’nin incisi İzmir’den İstanbul’a dönüş taşınmaları için modern otoyol ağı sayesinde konforlu ve hızlı nakliyat hizmeti verilmektedir. Tüm eşyalar koruyucu ambalajlarla sarılarak güzergah boyunca emtia sigortasıyla teminat altına alınır.',
    prices2026: [
      { homeType: '1+1 Daire', priceRange: '19.000 TL – 26.000 TL', details: 'Ekonomik şehirlerarası nakliye' },
      { homeType: '2+1 Daire', priceRange: '25.000 TL – 36.000 TL', details: 'Tam kapsamlı paketleme ve marangozluk' },
      { homeType: '3+1 Daire', priceRange: '34.000 TL – 46.000 TL', details: 'Büyük boy kapalı çelik kasa araç' },
      { homeType: 'Parça Eşya (Parsiyel)', priceRange: '7.000 TL – 12.500 TL', details: 'Parsiyel ve öğrenci eşyası taşımacılığı' },
    ],
    routeTips: [
      'Taşınma tarihinden en az 1 hafta önce talep açarak dönüş yapan boş araç fırsatlarını yakalayabilirsiniz.',
    ],
    faqs: [
      {
        question: 'İzmir İstanbul arası nakliyat sigortası neleri kapsar?',
        answer: 'Aracın otoyoldaki kaza, yangın, devrilme ve doğal afet risklerine karşı tam eşya bedeli sigortalanır.',
      },
    ],
  },
];

export function getIntercityRouteBySlug(slug: string): IntercityRoute | undefined {
  return INTERCITY_ROUTES.find(r => r.slug === slug);
}
