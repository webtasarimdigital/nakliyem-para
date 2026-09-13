/**
 * TaşınTeklif Akıllı Asistan (AI Assistant) NLP & Knowledge Engine
 * 100% Ücretsiz, harici API maliyeti olmayan yerleşik yapay zeka bilgi motoru.
 */

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: {
    text: string;
    href: string;
  };
}

interface KnowledgeNode {
  id: string;
  keywords: string[];
  phrases: string[];
  category: 'CUSTOMER' | 'CARRIER' | 'PRICING' | 'SAFETY' | 'SERVICES' | 'GENERAL';
  title: string;
  response: string;
  suggestions?: string[];
  actionLink?: {
    text: string;
    href: string;
  };
}

// Normalizer for Turkish text
export function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const KNOWLEDGE_BASE: KnowledgeNode[] = [
  // 1. Müşteri Fiyat Teklifi ve Süreç
  {
    id: 'teklif_alma_sureci',
    category: 'CUSTOMER',
    keywords: ['teklif', 'al', 'nasil', 'ucretsiz', 'ilan', 'talep', 'form', 'basvuru', 'nereden', 'yapilir'],
    phrases: ['nasil teklif alirim', 'teklif nasil alinir', 'talep nasil olusturulur', 'ilan nasil verilir', 'fiyat nasil alirim', 'ucretsiz mi'],
    title: 'Taşınma Teklifi Alma Süreci',
    response: `TaşınTeklif'te talep oluşturmak **%100 ücretsizdir** ve hiçbir komisyon alınmaz! 🎉

**3 Basit Adımda Teklif Alın:**
1. **Talep Oluşturun:** "Teklif Al" butonuna tıklayarak nereden nereye taşınacağınızı, oda sayınızı (1+1, 2+1, 3+1 vb.) ve taşınma tarihinizi seçin.
2. **Teklifleri Karşılaştırın:** 15-30 dakika içinde bölgenizdeki onaylı nakliye firmalarından fiyat teklifleri gelmeye başlar.
3. **Firmayı Seçin:** Fiyatları, müşteri puanlarını, paketleme ve mobil asansör gibi dahil hizmetleri kıyaslayarak dilediğiniz firmayı seçin!

Herhangi bir ön ödeme veya kart bilgisi gerekmez.`,
    suggestions: ['Komisyon alıyor musunuz?', 'Teklifler ne zaman gelir?', 'Ödemeyi nasıl yaparım?'],
    actionLink: {
      text: 'Hemen Ücretsiz Teklif Al →',
      href: '/teklif-al'
    }
  },

  // 2. Komisyon ve Ücretlendirme
  {
    id: 'komisyon_ve_ucretler',
    category: 'PRICING',
    keywords: ['komisyon', 'ucret', 'maliyet', 'para', 'kesinti', 'yuzde', 'masraf', 'ekstra'],
    phrases: ['komisyon var mi', 'komisyon aliyor musunuz', 'ucretli mi', 'musteriden komisyon', 'gizli ucret'],
    title: 'Komisyon ve Ücretlendirme Politikası',
    response: `Hayır! **Müşterilerden hiçbir komisyon, aracılık veya işlem ücreti ALINMAZ.** 🛡️

* Taşınma talebi açmak, teklifleri incelemek ve firmalarla görüşmek tamamen ücretsizdir.
* Teklif ekranında gördüğünüz fiyat firmanın size sunduğu nihai tutardır.
* Ödemeyi platforma değil, taşıma günü doğrudan anlaştığınız nakliyat firmasına yaparsınız.`,
    suggestions: ['Ödemeyi nasıl yaparım?', 'Teklif nasıl alırım?', 'Nakliyeci paketleri neler?']
  },

  // 3. Teklif Süresi & Bekleme
  {
    id: 'teklif_suresi',
    category: 'CUSTOMER',
    keywords: ['sure', 'zaman', 'dakika', 'ne zaman', 'gelir', 'bekleme', 'hizli', 'gecikti'],
    phrases: ['teklifler ne zaman gelir', 'ne kadar surer', 'kac dakikada gelir', 'teklif gelmedi'],
    title: 'Teklif Gelme Süresi',
    response: `Talebiniz sisteme düştükten hemen sonra güzergahınızdaki onaylı nakliyecilere anlık bildirim gönderilir. ⚡

* **İlk Teklif:** Genellikle **15 ile 30 dakika** içerisinde ilk teklifler panelinize ulaşır.
* Yoğun saatlerde veya özel güzergahlarda gün içinde 3 ila 6 farklı firmadan teklif alabilirsiniz.
* Teklif geldiğinde kayıtlı e-posta adresinize ve panelinize anında bildirim düşer.`,
    suggestions: ['Gelen teklifleri nasıl görürüm?', 'Firma nasıl seçilir?', 'Hemen Teklif Al']
  },

  // 4. Ödeme Yöntemleri
  {
    id: 'odeme_nasil_yapilir',
    category: 'PRICING',
    keywords: ['odeme', 'nasil', 'kredi karti', 'havale', 'eft', 'nakit', 'pos', 'kapida', 'kime'],
    phrases: ['odemeyi nasil yaparim', 'odeme kime yapilir', 'kart gecerli mi', 'on odeme var mi', 'ne zaman oderim'],
    title: 'Ödeme Süreci ve Koşulları',
    response: `Ödeme TaşınTeklif'e değil, **doğrudan taşıma hizmetini veren nakliyat firmasına** yapılır. 💳

* **Ön Ödeme Yoktur:** Platform üzerinden kredi kartı veya peşinat girmeniz gerekmez.
* **Ödeme Zamanı:** Genellikle taşıma günü eşyalar yeni evinize sağ salim ulaştırılıp monte edildikten sonra ödeme gerçekleştirilir.
* **Ödeme Şekli:** Firmalar Nakit, Banka Havalesi/EFT veya Taşınabilir POS cihazı ile kartlı ödeme kabul etmektedir. Tercihinizi teklif sonrası firmayla netleştirebilirsiniz.`,
    suggestions: ['Sigorta dahil mi?', 'Firma nasıl seçilir?', 'Teklif Al']
  },

  // 5. Mobil Asansörlü Taşımacılık
  {
    id: 'mobil_asansor',
    category: 'SERVICES',
    keywords: ['asansor', 'mobil', 'asansorlu', 'yuk', 'kat', 'balkon', 'sepetli', 'kiralik', 'yuksek'],
    phrases: ['asansorlu tasima', 'mobil asansor nedir', 'asansor dahil mi', 'kaca kadar cikar', 'asansor kiralama'],
    title: 'Mobil Asansörlü Taşımacılık Hizmeti',
    response: `Mobil Asansör, yüksek katlı binalarda eşyaların bina merdiveni veya bina asansörü yerine **balkon/pencereye kurulan sepetli ray sistemiyle** taşınmasını sağlayan modern bir teknolojidir. 🏢🏗️

**Avantajları:**
* **%95 Hasarsızlık:** Eşyalar bina merdivenlerinde veya dar kapılarda sürtünmez, çizilmez ve darbe almaz.
* **Süper Hızlı:** Normalde 5-6 saat süren yükleme/boşaltma işlemi 1.5 - 2 saatte tamamlanır.
* **Komşu ve Bina Koruması:** Bina koridorları ve asansörleri zarar görmez, komşular rahatsız edilmez.
* Firmalarımız genellikle **1. kattan 25. kata kadar** mobil asansör hizmeti sunmaktadır. Talep açarken asansör ihtiyacınızı belirtebilirsiniz.`,
    suggestions: ['Paketleme hizmeti nedir?', 'Sigorta neleri kapsar?', 'Teklif Al']
  },

  // 6. Paketleme ve Ambalajlama
  {
    id: 'paketleme_hizmeti',
    category: 'SERVICES',
    keywords: ['paketleme', 'ambalaj', 'koli', 'sarma', 'balonlu', 'patpat', 'strech', 'mobilya', 'marangoz'],
    phrases: ['paketleme dahil mi', 'nasil paketlenir', 'kolileme yapiyor musunuz', 'sarma isi kimin'],
    title: 'Paketleme ve Ambalajlama Standartları',
    response: `Teklif verirken firmalar paketleme tercihine göre fiyat sunar: 📦

1. **Firma Paketesin (Tam Hizmet):** Beyaz eşyalar, mobilyalar, gardırop, televizyon ve kırılacak mutfak eşyaları birinci sınıf havalı naylon (patpat), kraft kağıt ve streç ile profesyonel ekiplerce paketlenir.
2. **Ben Paketleyeceğim:** Kolileme ve ufak eşyaları siz hazırlarsınız, nakliye ekibi büyük mobilyaları koruyucu ambalajla taşır.
3. **Demontaj & Montaj:** Gardırop, bazalar ve yemek masaları marangoz ustası tarafından sökülür, yeni evde aynı şekilde kurulur.`,
    suggestions: ['Mobil asansör nedir?', 'Sigorta neleri kapsar?', 'Teklif Al']
  },

  // 7. Eşya Sigortası & Güvenlik
  {
    id: 'sigorta_guvence',
    category: 'SAFETY',
    keywords: ['sigorta', 'guvenlik', 'hasar', 'kirilma', 'tazminat', 'guvence', 'teminat', 'zarar'],
    phrases: ['sigorta var mi', 'esyalarim kirilirsa ne olur', 'hasar olursa', 'guvenilir mi', 'emtia sigortasi'],
    title: 'Taşıma Sigortası ve Hasar Güvencesi',
    response: `Platformumuzdaki onaylı nakliye firmaları **Emtia ve Nakliyat Sigortası** ile çalışmaktadır. 🛡️

* **Yol Güvencesi:** Taşıma aracı seyir halindeyken olası kaza, yangın, devrilme veya hırsızlık risklerine karşı eşyalarınız poliçe teminatı altındadır.
* **Ulaştırma Bakanlığı Belgeli:** Sadece K3 veya yetki belgelerine sahip, kimlik ve vergi levhası doğrulanmış kurumsal firmalar teklif verebilir.
* **Hasar Durumunda:** Taşıma esnasında herhangi bir hasar oluşması halinde teslimat tutanağı tutularak firmanın sigortası veya firma garantisi üzerinden zarar karşılanır.`,
    suggestions: ['Firmaların belgelerini görebilir miyim?', 'Mobil asansör nedir?', 'Teklif Al']
  },

  // 8. Nakliyeci Kaydı ve Evrak Onayı
  {
    id: 'nakliyeci_kaydi_ve_evrak',
    category: 'CARRIER',
    keywords: ['nakliyeci', 'firma', 'kayit', 'evrak', 'vergi', 'kimlik', 'belge', 'onay', 'nasil uye olunur'],
    phrases: ['nakliyeci nasil olurum', 'firma kaydi', 'evrak nasil yuklenir', 'onay ne kadar surer', 'kimlik vergi levhasi'],
    title: 'Nakliyeci Firma Kaydı ve Doğrulama Adımları',
    response: `TaşınTeklif ailesine katılmak ve her gün yüzlerce taşınma talebine teklif vermek çok kolay! 🚛

**Kayıt ve Onay Aşamaları:**
1. **Firma Kaydı Açın:** "Nakliyeci Kaydı" ekranından firma adı, yetkili ve iletişim bilgilerinizi girin.
2. **Evrakları Yükleyin:** Profilinizden **Kimlik Belgesi** ve **Vergi Levhası** (varsa K3 yetki belgesi) yükleyin.
3. **Admin Onayı:** Evraklarınız ekibimizce incelenip ortalama 1-2 saat içinde onaylanır.
4. **Hemen Teklif Verin:** Onay sonrası bölgenizdeki ev ve ofis taşıma taleplerine anında teklif vermeye başlayabilirsiniz!

*Evrak yüklemeyen firmalar güvenlik gereği müşteri iletişim bilgilerini göremez.*`,
    suggestions: ['Nakliyeci paketleri ve fiyatları neler?', 'Günlük teklif sınırı var mı?', 'İş havuzunu nasıl görürüm?'],
    actionLink: {
      text: 'Evrak Yükle / Profile Git →',
      href: '/app/carrier/profil'
    }
  },

  // 9. Nakliyeci Paketleri (Bronz, Gümüş, Altın)
  {
    id: 'nakliyeci_paketleri',
    category: 'CARRIER',
    keywords: ['paket', 'bronz', 'gumus', 'altin', 'fiyat', 'abonelik', 'ucreti', 'limit', 'gunluk'],
    phrases: ['nakliyeci paketleri', 'altin paket ne kadar', 'gumus paket', 'bronz paket', 'uyelik ucretleri', 'kac teklif verebilirim'],
    title: 'Nakliyeci Üyelik Paketleri ve Avantajları',
    response: `Firmalarımız için esnek ve yüksek kazanç sağlayan 3 avantajlı üyelik paketimiz bulunmaktadır: 💼

* 🥉 **Bronz Paket (1.490 TL / ay):**
  * Aylık 30 Teklif Verme Hakkı
  * Şehir İçi İş Havuzuna Erişim
  * Temel Firma Rozeti & Profil

* 🥈 **Gümüş Paket (2.990 TL / ay) — Popüler:**
  * Aylık 75 Teklif Verme Hakkı
  * Şehirler Arası İş Havuzuna Erişim
  * "Öne Çıkan Firma" Rozeti
  * Doğrudan Müşteri Telefonunu Görme

* 🥇 **Altın VIP Paket (4.990 TL / ay) — En Çok Kazandıran:**
  * **Sınırsız Teklif Verme Hakkı**
  * Türkiye Geneli Tüm İlanlara Anında Erişim
  * "VIP Onaylı Nakliyeci" Rozeti & En Üst Sıralama
  * Yeni İlanlarda SMS & Anlık WhatsApp Bildirimi
  * 7/24 Özel Müşteri Temsilcisi

*Yeni kayıt olan her firmaya ilk 7 gün boyunca günlük **3 ücretsiz teklif hakkı** hediye edilir!*`,
    suggestions: ['Paketimi nasıl yükseltirim?', 'Evrak onayı nasıl yapılır?', 'İş havuzuna git'],
    actionLink: {
      text: 'Paketleri İncele & Yükselt →',
      href: '/app/carrier/paketler'
    }
  },

  // 10. Şehirler Arası & Parça Eşya (Dönüş Boş Araç)
  {
    id: 'sehirler_arasi_ve_parca',
    category: 'SERVICES',
    keywords: ['sehirler arasi', 'parca', 'parsiyel', 'donus', 'bos arac', 'tek esya', 'ogrenci', 'farkli sehir'],
    phrases: ['sehirler arasi tasima', 'baska sehire tasinma', 'parca esya tasima', 'bos arac', 'donus nakliyesi'],
    title: 'Şehirler Arası Nakliyat ve Parça Eşya',
    response: `TaşınTeklif ile 81 il arasında güvenle taşınabilirsiniz! 🗺️

* **Dönüş Araçları ile %40 Tasarruf:** İstanbul, Ankara, İzmir, Antalya ve diğer illere giden nakliye araçlarının dönüş seferlerine denk gelen taşınmalarda çok daha ekonomik fiyatlar alırsınız.
* **Parça Eşya (Parsiyel):** Yalnızca bir beyaz eşya, koltuk takımı veya öğrenci evi taşımak için komple kamyon tutmanıza gerek yok; parça eşya talebi açarak bütçenizi koruyun.
* **Zamanında Teslimat:** Şehirler arası taşımalarda tahmini varış süresi sözleşmeyle netleştirilir.`,
    suggestions: ['Teklif nasıl alınır?', 'Mobil asansör nedir?', 'Teklif Al']
  },

  // 11. İletişim Bilgileri Gizliliği & Numara Görme
  {
    id: 'iletisim_gizliligi',
    category: 'SAFETY',
    keywords: ['telefon', 'numara', 'gizli', 'gorunmuyor', 'iletisim', 'arama', 'mesaj', 'nasil ulasirim'],
    phrases: ['telefon numarasi neden gizli', 'numarayi nasil gorurum', 'musteriyi nasil ararim', 'nakliyeciyi arama'],
    title: 'İletişim Bilgileri ve Numara Görünürlüğü',
    response: `KVKK ve müşteri güvenliği standartları gereğince iletişim kuralları şu şekilde işler: 🔒

* **Müşteriler İçin:** Teklif aldığınız nakliyecilerle panel üzerinden **anında mesajlaşabilirsiniz**. Bir firmanın teklifini "Kabul Et" butonuna basarak onayladığınızda firmanın doğrudan telefon numarası ekranınızda açılır.
* **Nakliyeciler İçin:** Belgeleri (Kimlik & Vergi Levhası) onaylanmış firmalar veya aktif üyelik paketine sahip nakliyeciler müşterinin telefon numarasını görüntüleyebilir. Onaysız profillerde numara güvenlik amacıyla maskelenir.`,
    suggestions: ['Evrak onayı nasıl yapılır?', 'Teklif nasıl kabul edilir?', 'Paketler']
  },

  // 12. İlan Güncelleme ve İptal
  {
    id: 'ilan_iptal_ve_guncelleme',
    category: 'CUSTOMER',
    keywords: ['iptal', 'guncelle', 'degistir', 'sil', 'vazgec', 'tarih degisikligi', 'duzenle'],
    phrases: ['ilanimi nasil iptal ederim', 'tarihi nasil degistiririm', 'talep iptali', 'vazgectim'],
    title: 'İlan Güncelleme ve İptal İşlemleri',
    response: `Taşınma planlarınız değiştiyse endişelenmeyin! 📝

* Müşteri panelinizde **"Taleplerim"** sekmesine giderek dilediğiniz ilanı seçin.
* İlan detayından taşınma tarihinizi, oda sayınızı veya adres notlarınızı güncelleyebilirsiniz.
* Taşınmaktan vazgeçtiyseniz tek bir tıkla talebinizi yayından kaldırabilir veya iptal edebilirsiniz. Herhangi bir ceza veya ücret söz konusu değildir.`,
    suggestions: ['Gelen teklifleri nasıl görürüm?', 'Canlı Destek', 'Hemen Teklif Al']
  }
];

/**
 * Intelligent Intent Matching Engine
 * Scores the query against the knowledge base and returns the best matching response.
 */
export function findBestAssistantResponse(userQuery: string): AssistantMessage {
  const norm = normalizeTurkish(userQuery);
  const words = norm.split(' ').filter(w => w.length > 1);

  if (!norm || words.length === 0) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: 'Merhaba! Ben TaşınTeklif Akıllı Asistanıyım. Size nasıl yardımcı olabilirim? Aşağıdaki popüler konulardan birini seçebilir veya sorunuzu doğrudan yazabilirsiniz. 😊',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: ['Nasıl teklif alırım?', 'Nakliyeci paketleri neler?', 'Mobil asansör nedir?', 'Komisyon alıyor musunuz?']
    };
  }

  let bestNode: KnowledgeNode | null = null;
  let maxScore = 0;

  for (const node of KNOWLEDGE_BASE) {
    let score = 0;

    // Exact phrase matches give highest score
    for (const phrase of node.phrases) {
      const normPhrase = normalizeTurkish(phrase);
      if (norm.includes(normPhrase)) {
        score += 40;
      }
    }

    // Keyword matches
    for (const kw of node.keywords) {
      const normKw = normalizeTurkish(kw);
      if (norm.includes(normKw)) {
        score += 8;
      } else {
        // Partial or word-level match
        for (const w of words) {
          if (w === normKw) {
            score += 10;
          } else if (w.length > 3 && normKw.startsWith(w.slice(0, 4))) {
            score += 4;
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestNode = node;
    }
  }

  // Threshold check: If match score is solid, return the rich response
  if (bestNode && maxScore >= 12) {
    return {
      id: `bot_${Date.now()}`,
      sender: 'bot',
      text: bestNode.response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: bestNode.suggestions || ['Nasıl teklif alırım?', 'Fiyatlar ne kadar?', 'Canlı Destek'],
      actionLink: bestNode.actionLink
    };
  }

  // Smart fallback if no direct match found
  return {
    id: `bot_${Date.now()}`,
    sender: 'bot',
    text: `Sorunuzu anladım ancak daha kesin bir yanıt verebilmek için aşağıdaki başlıklardan birini seçebilir veya sorunuzu farklı kelimelerle iletebilirsiniz:

* 📦 **Teklif Alma & Süreç:** "Nasıl teklif alırım?", "Komisyon var mı?"
* 🚛 **Nakliyeci & Paketler:** "Nakliyeci paketleri neler?", "Evrak onayı nasıl yapılır?"
* 🏗️ **Hizmetler:** "Mobil asansör nedir?", "Paketleme dahil mi?"
* 🛡️ **Güvenlik & Ödeme:** "Eşyalar sigortalı mı?", "Ödemeyi kime yapacağım?"

Dilerseniz sorunuzu doğrudan **bilgi@tasinteklif.com** adresine iletmeniz için e-posta sekmesine de aktarabilirim.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestions: ['Nasıl teklif alırım?', 'Nakliyeci paketleri neler?', 'Mobil asansör nedir?', 'E-posta ile Sor'],
    actionLink: {
      text: 'Müşteri Hizmetlerine E-posta Yaz →',
      href: '#email-tab'
    }
  };
}
