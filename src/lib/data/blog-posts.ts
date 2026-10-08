export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  date: string;
  isoDate: string;
  category: string;
  readTime: string;
  author: string;
  keywords: string[];
  content: {
    lead: string;
    sections: {
      heading: string;
      paragraphs: string[];
      listItems?: string[];
    }[];
    faqs?: {
      question: string;
      answer: string;
    }[];
  };
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'evden-eve-nakliyat-fiyatlari-2026',
    title: 'Evden Eve Nakliyat Fiyatları 2026: Oda Sayısına Göre Güncel Maliyetler',
    metaTitle: 'Evden Eve Nakliyat Fiyatları 2026 (Güncel Hesaplama)',
    metaDescription: '2026 yılı 1+1, 2+1, 3+1 ve 4+1 evden eve nakliyat fiyatları ne kadar? Kat sayısı, asansör, ambalajlama ve mesafeye göre ortalama maliyet tablosu.',
    summary: '2026 yılında oda sayısı, kat yükseklikleri, asansör ihtiyacı ve kilometre mesafesine göre güncel nakliye maliyet faktörleri ve fiyat tablosu.',
    date: '15 Ocak 2026',
    isoDate: '2026-01-15T09:00:00Z',
    category: 'Fiyatlandırma & Rehber',
    readTime: '6 dk okuma',
    author: 'TaşınTeklif Fiyat Analiz Ekibi',
    keywords: ['evden eve nakliyat fiyatları 2026', 'ev taşıma fiyat hesaplama', '1+1 ev taşıma ücreti', '2+1 nakliyat fiyatı'],
    content: {
      lead: '2026 yılında ev taşıma planlayanların en çok merak ettiği konu evden eve nakliyat fiyatlarının nasıl hesaplandığı ve ortalama bütçenin ne olacağıdır. Akaryakıt, işçilik, ambalaj malzemeleri ve araç kaskolarındaki değişimlerle güncellenen 2026 nakliye maliyetlerini tüm detaylarıyla derledik.',
      sections: [
        {
          heading: '2026 Ortalama Evden Eve Nakliyat Fiyat Tablosu (Şehir İçi)',
          paragraphs: [
            'Şehir içi taşınmalarda mesafe genellikle 5-30 km aralığında olup fiyatı en çok belirleyen unsurlar eşya hacmi, işçi sayısı ve bina kat durumudur:',
          ],
          listItems: [
            '1+1 Daire Taşıma: 8.500 TL – 14.500 TL (2-3 Personel, Küçük Kapalı Kasa)',
            '2+1 Daire Taşıma: 14.000 TL – 22.000 TL (3-4 Personel, Marangoz Dahil)',
            '3+1 Daire Taşıma: 20.000 TL – 32.000 TL (4-5 Personel, Çift Kat Paketleme)',
            '4+1 ve Villa Taşıma: 30.000 TL – 50.000 TL+ (Büyük Kamyon, Ekip Şefi)',
          ],
        },
        {
          heading: 'Nakliyat Fiyatını Etkileyen 5 Temel Faktör',
          paragraphs: [
            '1. Kat Yüksekliği ve Dış Cephe Asansörü: Binada yük asansörü yoksa ve eşyalar merdivenden taşınacaksa kat başı işçilik maliyeti artar. Kat 3 ve üzeri binalarda dış cephe mobil hidrolik asansör kiralanması (yaklaşık 2.000 - 3.500 TL ek maliyet) hem eşyaların güvenliği hem de zaman tasarrufu açısından önerilir.',
            '2. Marangoz ve Mobilya Montaj Hizmeti: Gardırop, baza, konsol ve yemek masası gibi demonte edilmesi gereken mobilyaların sökülüp yeni evde kurulması profesyonel marangozluk gerektirir.',
            '3. Paketleme ve Ambalaj Kalitesi: Çift kat kraft balonlu patpat naylon, havalı poşetler ve özel askılı elbise kolileri kullanılması eşyaları çizilmeye ve kırılmaya karşı korur.',
            '4. Mesafe ve Şehir İçi Trafik: İki ev arasındaki kilometre ve köprü/otoyol geçiş ücretleri fiyata eklenir.',
          ],
        },
        {
          heading: 'Fiyatta Tasarruf Etmenin Yolları',
          paragraphs: [
            'Taşınma maliyetinizi %20 ila %30 oranında düşürmek için ay sonu ve hafta sonu yoğunlukları yerine ay ortası hafta içi günleri tercih edebilirsiniz. Ayrıca kullanmadığınız eski eşyaları taşınmadan önce elemek veya satmak kamyon hacmini küçültecektir.',
            'En önemlisi, tek bir nakliyeciye bağlı kalmak yerine TaşınTeklif üzerinden ücretsiz talep oluşturup bölgenizdeki onaylı firmaların tekliflerini yan yana karşılaştırmaktır.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Nakliyat teklifi aldıktan sonra ekstra ücret çıkar mı?',
          answer: 'Eğer kat sayısı, oda tipi ve asansör durumu gibi bilgileri talep açarken doğru belirttiyseniz, TaşınTeklif üzerinden anlaştığınız sabit teklif tutarı geçerlidir ve ek ücret talep edilemez.',
        },
        {
          question: 'Bahşiş vermek zorunlu mu?',
          answer: 'Hayır, bahşiş tamamen müşterinin takdirine bağlıdır ve zorunlu bir maliyet unsuru değildir.',
        },
      ],
    },
  },
  {
    slug: 'sehirlerarasi-nakliyat-fiyatlari-2026',
    title: 'Şehirlerarası Nakliyat Fiyatları 2026: Kilometre Başına Maliyetler',
    metaTitle: 'Şehirlerarası Nakliyat Fiyatları 2026 (Km Hesaplama)',
    metaDescription: '2026 şehirlerarası evden eve nakliyat fiyatları ne kadar? İstanbul Ankara, İstanbul İzmir ve tüm Türkiye rotalarında güncel parsiyel ve komple taşınma ücretleri.',
    summary: 'Şehirlerarası ev taşımada kilometre başına düşen maliyetler, dönüş yükü avantajları, otoyol geçiş ücretleri ve popüler rotaların 2026 fiyat dökümü.',
    date: '22 Ocak 2026',
    isoDate: '2026-01-22T09:00:00Z',
    category: 'Şehirlerarası & Lojistik',
    readTime: '7 dk okuma',
    author: 'TaşınTeklif Lojistik Masası',
    keywords: ['şehirlerarası nakliyat fiyatları 2026', 'istanbul ankara nakliyat fiyatı', 'şehirler arası ev taşıma km ücreti'],
    content: {
      lead: 'Farklı bir şehre taşınmak, şehir içi nakliyeye göre daha kapsamlı bir lojistik planlama, sigorta poliçesi ve yol güvenliği gerektirir. 2026 yılı güncel akaryakıt tarifeleri ve otoyol ücretleri ışığında şehirlerarası nakliye fiyatlarını inceledik.',
      sections: [
        {
          heading: '2026 Popüler Şehirlerarası Rota Fiyatları',
          paragraphs: [
            'Aşağıdaki fiyatlar 2+1 ve 3+1 standart ev eşyası için komple araç baz alınarak hesaplanmıştır:',
          ],
          listItems: [
            'İstanbul ➔ Ankara (450 km): 22.000 TL – 34.000 TL',
            'İstanbul ➔ İzmir (480 km): 24.000 TL – 38.000 TL',
            'İstanbul ➔ Antalya (720 km): 32.000 TL – 48.000 TL',
            'Ankara ➔ İzmir (590 km): 25.000 TL – 39.000 TL',
            'İstanbul ➔ Bursa (150 km): 14.000 TL – 22.000 TL',
          ],
        },
        {
          heading: 'Komple Araç ile Parsiyel (Dönüş Yükü) Farkı',
          paragraphs: [
            'Eğer bir evin tamamını taşıyorsanız araç sadece size tahsis edilir ve taşınma 24-48 saat içinde tamamlanır.',
            'Ancak eşyanız 1+1 gibi az hacimli ise veya sadece belirli eşyalarınızı gönderiyorsanız, Nakliyeci Defteri üzerinden dönüş yapan araçlara parsiyel (parça eşya) olarak yükleterek maliyetinizi %40 ila %50 oranında düşürebilirsiniz.',
          ],
        },
        {
          heading: 'Şehirlerarası Taşımada Olmazsa Olmaz Güvenlik Adımları',
          paragraphs: [
            '1. T.C. Ulaştırma Bakanlığı K3 Yetki Belgesi Sorgulaması: Şehirlerarası ev eşyası taşımacılığı yapan araçların mutlaka ticari K3 belgesine sahip olması şarttır. Belgesiz araçlar polis çevirmelerinde bağlanabilir.',
            '2. Emtia Nakliyat Sigortası: Kamyonun seyir halindeyken kaza, devrilme veya yangın gibi risklere karşı eşya bedeli kadar sigortalanması şarttır.',
            '3. İmzalı Taşınma Sözleşmesi: Taşıma günü, teslimat tarihi ve üzerinde anlaşılan net tutar yazılı sözleşmeye bağlanmalıdır.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Şehirlerarası nakliyat kaç günde teslim edilir?',
          answer: 'Genellikle 500 km altındaki mesafeler aynı gün veya ertesi sabah, 1000 km üzeri mesafeler ise 2 gün içinde teslim edilir.',
        },
      ],
    },
  },
  {
    slug: 'nakliyat-firmasi-nasil-secilir',
    title: 'Güvenilir Nakliyat Firması Nasıl Seçilir? 7 Kritik Kriter',
    metaTitle: 'Nakliyat Firması Nasıl Seçilir? (Dolandırıcılara Dikkat)',
    metaDescription: 'Ev taşırken doğru nakliyat firması nasıl bulunur? K3 yetki belgesi, sigorta, sözleşme, müşteri yorumları ve korsan nakliyecilerden korunma rehberi.',
    summary: 'K3 yetki belgesi kontrolünden emtia sigortasına, sözleşme detaylarından gerçek müşteri puanlarına kadar güvenli nakliyeci seçim rehberi.',
    date: '02 Şubat 2026',
    isoDate: '2026-02-02T09:00:00Z',
    category: 'Güvenlik & İpuçları',
    readTime: '5 dk okuma',
    author: 'TaşınTeklif Kalite Güvence Kurulu',
    keywords: ['nakliyat firması nasıl seçilir', 'güvenilir evden eve nakliyat', 'korsan nakliyeci nasıl anlaşılır'],
    content: {
      lead: 'Ev taşımak hayatın en stresli dönemlerinden biridir. Yanlış bir nakliye firması seçimi; kırılan mobilyalar, taşınma günü son dakika fiyat artıran fırsatçılar ve kaybolan eşyalarla kabusa dönüşebilir. İşte profesyonel bir nakliyeci seçerken dikkat etmeniz gereken 7 altın kural.',
      sections: [
        {
          heading: '1. K3 Yetki Belgesi ve Vergi Levhası Sorgulayın',
          paragraphs: [
            'Sektörde "komisyoncu" olarak bilinen ve hiçbir aracı olmadan internetten müşteri toplayıp işi sokaktaki rastgele kamyonculara satan şahıslardan uzak durun. Firmanın adına düzenlenmiş resmi Ulaştırma Bakanlığı K3 Yetki Belgesi ve aktif Vergi Levhası olduğunu teyit edin.',
          ],
        },
        {
          heading: '2. Şüpheli Derecede Düşük Fiyatlara Kanmayın',
          paragraphs: [
            'Piyasa ortalaması 20.000 TL olan bir işe 9.000 TL fiyat veren bir firma varsa dikkatli olun. Bu tür firmalar genellikle taşınma günü eşyalar kamyona yüklendikten sonra "Eşyanız çok çıktı, asansör sığmadı" diyerek sizden iki katı ücret talep eder.',
          ],
        },
        {
          heading: '3. Gerçek Müşteri Yorumlarını ve Puanlarını İnceleyin',
          paragraphs: [
            'Sosyal medya veya kendi sitelerindeki sahte referanslar yerine, bağımsız platformlar üzerinden onaylanmış ve hizmet almış gerçek kullanıcıların yorumlarını okuyun. Personelin marangozluk becerisi ve eşyalara gösterdiği özen hakkında yazılan detaylara dikkat edin.',
          ],
        },
        {
          heading: '4. Yazılı Sözleşme ve Detaylı Ekspertiz İsteyin',
          paragraphs: [
            'Tüm şartlar kağıt üzerinde veya dijital sistemde net olmalıdır: Paketleme kime ait? Mobilya montajı fiyata dahil mi? Kat asansörü kullanılacak mı? Taşınma günü hangi saatte gelinecek? TaşınTeklif üzerinden talep açtığınızda tüm bu maddeler teklif kartında bağlayıcı olarak sabitlenir.',
          ],
        },
      ],
    },
  },
  {
    slug: 'nakliyat-sigortasi-nedir',
    title: 'Nakliyat Sigortası Nedir ve Neleri Kapsar? Emtia Poliçesi Rehberi',
    metaTitle: 'Nakliyat Sigortası Nedir? (Emtia Taşıma Sigortası)',
    metaDescription: 'Evden eve nakliyat sigortası neleri kapsar, eşyalar kırılırsa kim öder? Emtia taşıma poliçesi, teminat limitleri ve hasar süreçleri rehberi.',
    summary: 'Ev taşıma sigortasının kapsamı, kaza ve hasar anında tazminat süreci ve kasko poliçesi ile nakliyat emtia sigortası arasındaki farklar.',
    date: '10 Şubat 2026',
    isoDate: '2026-02-10T09:00:00Z',
    category: 'Hukuk & Sigorta',
    readTime: '5 dk okuma',
    author: 'TaşınTeklif Hukuk & Sigorta Masası',
    keywords: ['nakliyat sigortası nedir', 'ev taşıma emtia sigortası', 'nakliyatta eşya kırılırsa ne olur'],
    content: {
      lead: 'Eşyalarınız kamyona yüklendiğinde ve yola çıktığında güvende olduğunu bilmek istersiniz. Nakliyat emtia sigortası, taşınma sırasında meydana gelebilecek kaza, yangın, devrilme ve doğal afet gibi risklere karşı eşyalarınızın maddi değerini koruyan yasal poliçedir.',
      sections: [
        {
          heading: 'Nakliyat Sigortası Neleri Kapsar?',
          paragraphs: [
            'Taşıyıcı sorumluluk ve emtia sigortası genellikle aracın trafikte seyrederken karşılaşabileceği büyük riskleri kapsar:',
          ],
          listItems: [
            'Kamyonun trafik kazası geçirmesi, çarpışma veya devrilmesi',
            'Araçta veya kasada çıkabilecek yangın ve patlamalar',
            'Köprü çökmesi, heyelan, sel gibi yol afetleri',
            'Aracın komple çalınması veya gaspa uğraması',
          ],
        },
        {
          heading: 'Bina İçi Çizilme ve Kırılmalar Sigortaya Dahil mi?',
          paragraphs: [
            'Genel emtia sigortaları aracın seyir halindeki risklerini kapsar. Merdivende taşıma esnasında personelin elinden düşen vazo veya çizilen buzdolabı için doğrudan nakliye firmasının "kusursuz sorumluluk" ilkesi geçerlidir. Bu nedenle sözleşmenizde firmanın taşıma hasarlarını karşılama taahhüdü yer almalıdır.',
          ],
        },
      ],
    },
  },
  {
    slug: 'k3-belgesi-nedir',
    title: 'K3 Yetki Belgesi Nedir ve Neden Zorunludur? Yasal Standartlar',
    metaTitle: 'K3 Belgesi Nedir? (Ulaştırma Bakanlığı Şartı)',
    metaDescription: 'K3 yetki belgesi nedir, evden eve nakliyat firmalarında neden zorunludur? K1 ile K3 farkı ve belgesiz korsan taşımacılığın cezaları.',
    summary: 'Ulaştırma ve Altyapı Bakanlığı tarafından verilen K3 belgesinin şartları, K1 belgesinden farkı ve tüketici haklarındaki kritik rolü.',
    date: '18 Şubat 2026',
    isoDate: '2026-02-18T09:00:00Z',
    category: 'Mevzuat & Standartlar',
    readTime: '4 dk okuma',
    author: 'TaşınTeklif Mevzuat Masası',
    keywords: ['k3 belgesi nedir', 'k3 yetki belgesi evden eve nakliyat', 'k1 k3 farkı nakliye'],
    content: {
      lead: 'T.C. Ulaştırma ve Altyapı Bakanlığı Karayolu Taşıma Yönetmeliği uyarınca, yurtiçi ticari ev ve büro eşyası taşımacılığı yapacak gerçek ve tüzel kişilerin K3 Yetki Belgesi alması kanunen zorunludur.',
      sections: [
        {
          heading: 'K3 Belgesi Neden Bu Kadar Önemlidir?',
          paragraphs: [
            'Bir firmanın K3 belgesi alabilmesi için Bakanlığa belirli bir özmal araç filosu (en az 2 adet ticari kapalı kasa araç), asgari sermaye (en az 50.000 TL), mesleki yeterlilik belgeleri (ODY/ÜDY) ve temiz adli sicil kaydı sunması zorunludur. Dolayısıyla K3 belgesi olan bir firma rastgele bir kamyoncu değil, devletin denetlediği kurumsal bir işletmedir.',
          ],
        },
        {
          heading: 'K1 ile K3 Arasındaki Fark Nedir?',
          paragraphs: [
            'K1 Belgesi: Genel ticari yük (kum, demir, fabrika paletleri vb.) taşımak içindir.',
            'K3 Belgesi: Yalnızca ve özel olarak ev, ofis ve büro eşyası taşımacılığı için tasarlanmış kapalı kasa araçlara verilir.',
            'K1 belgeli bir damperli kamyonla veya brandalı açık araçla ev eşyası taşınması yönetmeliğe aykırıdır.',
          ],
        },
      ],
    },
  },
  {
    slug: 'tasinma-oncesi-yapilacaklar-kontrol-listesi',
    title: 'Taşınma Öncesi Yapılacaklar: 4 Haftalık Eksiksiz Kontrol Listesi',
    metaTitle: 'Taşınma Öncesi Yapılacaklar Listesi (Adım Adım)',
    metaDescription: 'Ev taşırken nereden başlanmalı? 4 hafta öncesinden taşınma gününe kadar abonelik iptali, koli hazırlama ve eşya paketleme kontrol listesi.',
    summary: 'Abonelik devirleri, koli hazırlığı, beyaz eşya sabitleme ve taşınma günü stresi azaltacak 4 haftalık pratik zaman çizelgesi.',
    date: '25 Şubat 2026',
    isoDate: '2026-02-25T09:00:00Z',
    category: 'Taşınma Rehberi',
    readTime: '6 dk okuma',
    author: 'TaşınTeklif Pratik Yaşam Masası',
    keywords: ['taşınma öncesi yapılacaklar', 'ev taşırken yapılacaklar listesi', 'taşınma kontrol listesi', 'abonelik devirleri'],
    content: {
      lead: 'Taşınma hazırlıklarını son haftaya bırakmak kaos, kayıp eşyalar ve büyük bir yorgunluk demektir. Bu süreci 4 haftalık periyotlara bölerek adım adım planladığınızda taşınmanın ne kadar zahmetsiz olduğunu göreceksiniz.',
      sections: [
        {
          heading: '4 Hafta Önce: Eleme ve Nakliye Anlaşması',
          paragraphs: [
            '• Giymediğiniz kıyafetleri, kırık eşyaları ve gereksiz fazlalıkları ayırın, bağışlayın veya satın.',
            '• TaşınTeklif üzerinden erken talep oluşturarak en kaliteli nakliyat firmalarından avantajlı fiyat tekliflerini toplayın.',
            '• Ev sahibinizle veya site yönetimiyle taşınma tarihini netleştirin.',
          ],
        },
        {
          heading: '2 Hafta Önce: Abonelikler ve Koli Hazırlığı',
          paragraphs: [
            '• Elektrik, su, doğalgaz ve internet abonelikleriniz için nakil veya kapatma başvurularını başlatın.',
            '• Kitaplar, süs eşyaları ve mevsim dışı kıyafetleri kolilemeye başlayın. Kolilerin üzerine oda adını ve içeriğini kalın keçeli kalemle yazın.',
            '• Değerli mücevher, altın, pasaport ve tapu gibi evrakları ayrı bir şahsi çantada toplayın (bu çantayı nakliye kamyonuna vermeyin).',
          ],
        },
        {
          heading: '1 Hafta Önce: Beyaz Eşya ve Son Detaylar',
          paragraphs: [
            '• Buzdolabını taşınmadan 24 saat önce boşaltın, buzunu çözdürün ve içini kurulayın.',
            '• Çamaşır makinesinin arka emniyet cıvatalarını (kazan sabitleyici) hazır bulundurun.',
            '• Taşınma günü ilk açılacak "Acil İhtiyaç Kolisi" hazırlayın (şarj aletleri, nevresim, su ısıtıcı, temizlik bezi, ıslak mendil).',
          ],
        },
      ],
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find(p => p.slug === slug);
}
