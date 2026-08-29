export interface CityData {
  id: number;
  name: string;
  slug: string;
  region: 'Marmara' | 'İç Anadolu' | 'Ege' | 'Akdeniz' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu Anadolu';
  districts: string[];
  isPopular?: boolean;
  lat?: number;
  lng?: number;
}

// 81 Official Provinces of Turkey with Coordinates and Popular Districts
export const TURKEY_CITIES: CityData[] = [
  { id: 1, name: 'Adana', slug: 'adana', region: 'Akdeniz', isPopular: true, lat: 37.0000, lng: 35.3213, districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam', 'Ceyhan', 'Kozan', 'İmamoğlu', 'Karataş', 'Pozantı', 'Karaisalı'] },
  { id: 2, name: 'Adıyaman', slug: 'adiyaman', region: 'Güneydoğu Anadolu', lat: 37.7648, lng: 38.2786, districts: ['Merkez', 'Kahta', 'Besni', 'Gölbaşı', 'Gerger', 'Sincik', 'Çelikhan', 'Samsat', 'Tut'] },
  { id: 3, name: 'Afyonkarahisar', slug: 'afyonkarahisar', region: 'Ege', lat: 38.7507, lng: 30.5567, districts: ['Merkez', 'Sandıklı', 'Dinar', 'Bolvadin', 'Sinanpaşa', 'Emirdağ', 'Şuhut', 'Çay', 'İhsaniye'] },
  { id: 4, name: 'Ağrı', slug: 'agri', region: 'Doğu Anadolu', lat: 39.7191, lng: 43.0503, districts: ['Merkez', 'Doğubayazıt', 'Patnos', 'Diyadin', 'Eleşkirt', 'Tutak', 'Taşlıçay', 'Hamur'] },
  { id: 5, name: 'Amasya', slug: 'amasya', region: 'Karadeniz', lat: 40.6501, lng: 35.8353, districts: ['Merkez', 'Merzifon', 'Suluova', 'Taşova', 'Gümüşhacıköy', 'Göynücek', 'Hamamözü'] },
  { id: 6, name: 'Ankara', slug: 'ankara', region: 'İç Anadolu', isPopular: true, lat: 39.9334, lng: 32.8597, districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı', 'Polatlı', 'Çubuk', 'Kahramankazan', 'Beypazarı', 'Elmadağ', 'Şereflikoçhisar', 'Akyurt', 'Nallıhan', 'Kızılcahamam'] },
  { id: 7, name: 'Antalya', slug: 'antalya', region: 'Akdeniz', isPopular: true, lat: 36.8969, lng: 30.7133, districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kumluca', 'Kaş', 'Finike', 'Gazipaşa', 'Döşemealtı', 'Aksu', 'Korkuteli', 'Elmalı', 'Demre'] },
  { id: 8, name: 'Artvin', slug: 'artvin', region: 'Karadeniz', lat: 41.1828, lng: 41.8183, districts: ['Merkez', 'Hopa', 'Borçka', 'Yusufeli', 'Arhavi', 'Şavşat', 'Ardanuç', 'Murgul', 'Kemalpaşa'] },
  { id: 9, name: 'Aydın', slug: 'aydin', region: 'Ege', isPopular: true, lat: 37.8560, lng: 27.8416, districts: ['Efeler', 'Kuşadası', 'Didim', 'Nazilli', 'Söke', 'İncirliova', 'Çine', 'Germencik', 'Bozdoğan', 'Köşk', 'Kuyucak'] },
  { id: 10, name: 'Balıkesir', slug: 'balikesir', region: 'Marmara', isPopular: true, lat: 39.6484, lng: 27.8826, districts: ['Altıeylül', 'Karesi', 'Bandırma', 'Edremit', 'Gönen', 'Ayvalık', 'Burhaniye', 'Bigadiç', 'Susurluk', 'Dursunbey', 'Sındırgı', 'Erdek', 'Havran'] },
  { id: 11, name: 'Bilecik', slug: 'bilecik', region: 'Marmara', lat: 40.1451, lng: 29.9799, districts: ['Merkez', 'Bozüyük', 'Osmaneli', 'Söğüt', 'Gölpazarı', 'Pazaryeri', 'Yenipazar', 'İnhisar'] },
  { id: 12, name: 'Bingöl', slug: 'bingol', region: 'Doğu Anadolu', lat: 38.8854, lng: 40.4983, districts: ['Merkez', 'Genç', 'Solhan', 'Karlıova', 'Adaklı', 'Kiğı', 'Yedisu', 'Yayladere'] },
  { id: 13, name: 'Bitlis', slug: 'bitlis', region: 'Doğu Anadolu', lat: 38.3938, lng: 42.1232, districts: ['Merkez', 'Tatvan', 'Güroymak', 'Ahlat', 'Hizan', 'Mutki', 'Adilcevaz'] },
  { id: 14, name: 'Bolu', slug: 'bolu', region: 'Karadeniz', isPopular: true, lat: 40.7392, lng: 31.6089, districts: ['Merkez', 'Gerede', 'Mengen', 'Göynük', 'Mudurnu', 'Yeniçağa', 'Dörtdivan', 'Seben', 'Kıbrıscık'] },
  { id: 15, name: 'Burdur', slug: 'burdur', region: 'Akdeniz', lat: 37.7203, lng: 30.2908, districts: ['Merkez', 'Bucak', 'Gölhisar', 'Yeşilova', 'Çavdır', 'Tefenni', 'Ağlasun', 'Karamanlı', 'Altınyayla', 'Çeltikçi', 'Kemer'] },
  { id: 16, name: 'Bursa', slug: 'bursa', region: 'Marmara', isPopular: true, lat: 40.1885, lng: 29.0610, districts: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'Gemlik', 'İnegöl', 'Gürsu', 'Kestel', 'Mustafakemalpaşa', 'Karacabey', 'Orhangazi', 'İznik', 'Yenişehir', 'Orhaneli', 'Keles'] },
  { id: 17, name: 'Çanakkale', slug: 'canakkale', region: 'Marmara', isPopular: true, lat: 40.1553, lng: 26.4142, districts: ['Merkez', 'Biga', 'Çan', 'Gelibolu', 'Yenice', 'Ayvacık', 'Ezine', 'Bayramiç', 'Lapseki', 'Eceabat', 'Gökçeada', 'Bozcaada'] },
  { id: 18, name: 'Çankırı', slug: 'cankiri', region: 'İç Anadolu', lat: 40.6013, lng: 33.6134, districts: ['Merkez', 'Çerkeş', 'Ilgaz', 'Orta', 'Şabanözü', 'Kurşunlu', 'Yapraklı', 'Kızılırmak', 'Eldivan', 'Atkaracalar', 'Korgun', 'Bayramören'] },
  { id: 19, name: 'Çorum', slug: 'corum', region: 'Karadeniz', lat: 40.5506, lng: 34.9556, districts: ['Merkez', 'Sungurlu', 'Osmancık', 'İskilip', 'Alaca', 'Bayat', 'Mecitözü', 'Kargı', 'Ortaköy', 'Uğurludağ', 'Dodurga', 'Oğuzlar', 'Laçin', 'Boğazkale'] },
  { id: 20, name: 'Denizli', slug: 'denizli', region: 'Ege', isPopular: true, lat: 37.7765, lng: 29.0864, districts: ['Pamukkale', 'Merkezefendi', 'Çivril', 'Acıpayam', 'Tavas', 'Honaz', 'Sarayköy', 'Buldan', 'Kale', 'Çal', 'Çameli', 'Serinhisar', 'Bozkurt', 'Güney', 'Çardak'] },
  { id: 21, name: 'Diyarbakır', slug: 'diyarbakir', region: 'Güneydoğu Anadolu', isPopular: true, lat: 37.9144, lng: 40.2306, districts: ['Bağlar', 'Kayapınar', 'Yenişehir', 'Sur', 'Ergani', 'Bismil', 'Silvan', 'Çınar', 'Kulp', 'Dicle', 'Lice', 'Hani', 'Hazro', 'Eğil', 'Kocaköy', 'Çüngüş', 'Çermik'] },
  { id: 22, name: 'Edirne', slug: 'edirne', region: 'Marmara', lat: 41.6818, lng: 26.5623, districts: ['Merkez', 'Keşan', 'Uzunköprü', 'İpsala', 'Havsa', 'Meriç', 'Enez', 'Süloğlu', 'Lalapaşa'] },
  { id: 23, name: 'Elazığ', slug: 'elazig', region: 'Doğu Anadolu', lat: 38.6810, lng: 39.2264, districts: ['Merkez', 'Kovancılar', 'Karakoçan', 'Palu', 'Arıcak', 'Baskil', 'Maden', 'Sivrice', 'Alacakaya', 'Keban', 'Ağın'] },
  { id: 24, name: 'Erzincan', slug: 'erzincan', region: 'Doğu Anadolu', lat: 39.7500, lng: 39.5000, districts: ['Merkez', 'Tercan', 'Üzümlü', 'Çayırlı', 'İliç', 'Kemah', 'Kemaliye', 'Refahiye', 'Otlukbeli'] },
  { id: 25, name: 'Erzurum', slug: 'erzurum', region: 'Doğu Anadolu', isPopular: true, lat: 39.9000, lng: 41.2700, districts: ['Yakutiye', 'Palandöken', 'Aziziye', 'Horasan', 'Oltu', 'Pasinler', 'Karayazı', 'Hınıs', 'Tekman', 'Karaçoban', 'Aşkale', 'Şenkaya', 'Çat', 'Köprüköy', 'İspir', 'Tortum', 'Narman', 'Uzundere', 'Olur', 'Pazaryolu'] },
  { id: 26, name: 'Eskişehir', slug: 'eskisehir', region: 'İç Anadolu', isPopular: true, lat: 39.7767, lng: 30.5206, districts: ['Odunpazarı', 'Tepebaşı', 'Sivrihisar', 'Çifteler', 'Seyitgazi', 'Alpu', 'Mihalıççık', 'Mahmudiye', 'Beylikova', 'İnönü', 'Günyüzü', 'Han', 'Mihalgazi', 'Sarıcakaya'] },
  { id: 27, name: 'Gaziantep', slug: 'gaziantep', region: 'Güneydoğu Anadolu', isPopular: true, lat: 37.0662, lng: 37.3833, districts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı', 'Oğuzeli', 'Araban', 'Yavuzeli', 'Karkamış'] },
  { id: 28, name: 'Giresun', slug: 'giresun', region: 'Karadeniz', lat: 40.9128, lng: 38.3895, districts: ['Merkez', 'Bulancak', 'Espiye', 'Görele', 'Tirebolu', 'Dereli', 'Şebinkarahisar', 'Keşap', 'Yağlıdere', 'Piraziz', 'Eynesil', 'Alucra', 'Çamoluk', 'Güce', 'Doğankent', 'Çanakçı'] },
  { id: 29, name: 'Gümüşhane', slug: 'gumushane', region: 'Karadeniz', lat: 40.4600, lng: 39.4700, districts: ['Merkez', 'Kelkit', 'Şiran', 'Kürtün', 'Torul', 'Köse'] },
  { id: 30, name: 'Hakkari', slug: 'hakkari', region: 'Güneydoğu Anadolu', lat: 37.5833, lng: 43.7333, districts: ['Merkez', 'Yüksekova', 'Şemdinli', 'Çukurca', 'Derecik'] },
  { id: 31, name: 'Hatay', slug: 'hatay', region: 'Akdeniz', isPopular: true, lat: 36.2000, lng: 36.1667, districts: ['Antakya', 'İskenderun', 'Defne', 'Dörtyol', 'Samandağ', 'Kırıkhan', 'Reyhanlı', 'Arsuz', 'Altınözü', 'Hassa', 'Payas', 'Erzin', 'Yayladağı', 'Belen', 'Kumlu'] },
  { id: 32, name: 'Isparta', slug: 'isparta', region: 'Akdeniz', lat: 37.7648, lng: 30.5566, districts: ['Merkez', 'Yalvaç', 'Eğirdir', 'Şarkikaraağaç', 'Gelendost', 'Keçiborlu', 'Senirkent', 'Sütçüler', 'Gönen', 'Uluborlu', 'Atabey', 'Aksu', 'Yenişarbademli'] },
  { id: 33, name: 'Mersin', slug: 'mersin', region: 'Akdeniz', isPopular: true, lat: 36.8000, lng: 34.6333, districts: ['Yenişehir', 'Mezitli', 'Toroslar', 'Akdeniz', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur', 'Mut', 'Bozyazı', 'Gülnar', 'Aydıncık', 'Çamlıyayla'] },
  { id: 34, name: 'İstanbul', slug: 'istanbul', region: 'Marmara', isPopular: true, lat: 41.0082, lng: 28.9784, districts: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Bakırköy', 'Esenyurt', 'Beylikdüzü', 'Ataşehir', 'Maltepe', 'Pendik', 'Ümraniye', 'Şişli', 'Sarıyer', 'Kartal', 'Başakşehir', 'Küçükçekmece', 'Bahçelievler', 'Bağcılar', 'Fatih', 'Eyüpsultan', 'Tuzla', 'Çekmeköy', 'Sancaktepe', 'Sultanbeyli', 'Zeytinburnu', 'Gaziosmanpaşa', 'Güngören', 'Avcılar', 'Büyükçekmece', 'Silivri', 'Arnavutköy', 'Çatalca', 'Şile', 'Adalar'] },
  { id: 35, name: 'İzmir', slug: 'izmir', region: 'Ege', isPopular: true, lat: 38.4192, lng: 27.1287, districts: ['Karşıyaka', 'Konak', 'Bornova', 'Buca', 'Çiğli', 'Bayraklı', 'Karabağlar', 'Gaziemir', 'Balçova', 'Narlıdere', 'Güzelbahçe', 'Urla', 'Çeşme', 'Menemen', 'Torbalı', 'Kemalpaşa', 'Aliağa', 'Seferihisar', 'Foça', 'Ödemiş', 'Bergama', 'Tire', 'Dikili', 'Menderes', 'Kınık', 'Kiraz', 'Beydağ', 'Karaburun'] },
  { id: 36, name: 'Kars', slug: 'kars', region: 'Doğu Anadolu', lat: 40.6167, lng: 43.1000, districts: ['Merkez', 'Kağızman', 'Sarıkamış', 'Selim', 'Digor', 'Arpaçay', 'Akyaka', 'Susuz'] },
  { id: 37, name: 'Kastamonu', slug: 'kastamonu', region: 'Karadeniz', lat: 41.3887, lng: 33.7827, districts: ['Merkez', 'Tosya', 'Taşköprü', 'Cide', 'İnebolu', 'Araç', 'Devrekani', 'Bozkurt', 'Daday', 'Azdavay', 'Çatalzeytin', 'Küre', 'Doğanyurt', 'İhsangazi', 'Pınarbaşı', 'Şenpazar', 'Abana', 'Seydiler', 'Hanönü', 'Ağlı'] },
  { id: 38, name: 'Kayseri', slug: 'kayseri', region: 'İç Anadolu', isPopular: true, lat: 38.7312, lng: 35.4787, districts: ['Melikgazi', 'Kocasinan', 'Talas', 'Develi', 'Yahyalı', 'Bünyan', 'Pınarbaşı', 'Tomarza', 'Yeşilhisar', 'Sarıoğlan', 'Hacılar', 'Sarız', 'Felahiye', 'Akkışla', 'Özvatan'] },
  { id: 39, name: 'Kırklareli', slug: 'kirklareli', region: 'Marmara', lat: 41.7333, lng: 27.2167, districts: ['Merkez', 'Lüleburgaz', 'Babaeski', 'Vize', 'Pınarhisar', 'Demirköy', 'Pehlivanköy', 'Kofçaz'] },
  { id: 40, name: 'Kırşehir', slug: 'kirsehir', region: 'İç Anadolu', lat: 39.1425, lng: 34.1709, districts: ['Merkez', 'Kaman', 'Mucur', 'Çiçekdağı', 'Akpınar', 'Boztepe', 'Akçakent'] },
  { id: 41, name: 'Kocaeli', slug: 'kocaeli', region: 'Marmara', isPopular: true, lat: 40.8533, lng: 29.8815, districts: ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Gölcük', 'Derince', 'Çayırova', 'Kartepe', 'Başiskele', 'Karamürsel', 'Kandıra', 'Dilovası'] },
  { id: 42, name: 'Konya', slug: 'konya', region: 'İç Anadolu', isPopular: true, lat: 37.8667, lng: 32.4833, districts: ['Selçuklu', 'Meram', 'Karatay', 'Ereğli', 'Akşehir', 'Beyşehir', 'Seydişehir', 'Ilgın', 'Cihanbeyli', 'Kulu', 'Karapınar', 'Çumra', 'Doğanhisar', 'Hüyük', 'Sarayönü', 'Bozkır', 'Kadınhanı', 'Yunak', 'Hadim', 'Taşkent'] },
  { id: 43, name: 'Kütahya', slug: 'kutahya', region: 'Ege', lat: 39.4167, lng: 29.9833, districts: ['Merkez', 'Tavşanlı', 'Simav', 'Gediz', 'Emet', 'Altıntaş', 'Domaniç', 'Hisarcık', 'Aslanapa', 'Çavdarhisar', 'Şaphane', 'Pazarlar', 'Dumlupınar'] },
  { id: 44, name: 'Malatya', slug: 'malatya', region: 'Doğu Anadolu', isPopular: true, lat: 38.3552, lng: 38.3095, districts: ['Battalgazi', 'Yeşilyurt', 'Doğanşehir', 'Akçadağ', 'Darende', 'Hekimhan', 'Pütürge', 'Yazıhan', 'Arapgir', 'Kuluncak', 'Arguvan', 'Kale', 'Doğanyol'] },
  { id: 45, name: 'Manisa', slug: 'manisa', region: 'Ege', isPopular: true, lat: 38.6191, lng: 27.4289, districts: ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu', 'Salihli', 'Soma', 'Alaşehir', 'Saruhanlı', 'Demirci', 'Kırkağaç', 'Kula', 'Sarıgöl', 'Gördes', 'Selendi', 'Ahmetli', 'Gölmarmara', 'Köprübaşı'] },
  { id: 46, name: 'Kahramanmaraş', slug: 'kahramanmaras', region: 'Akdeniz', isPopular: true, lat: 37.5858, lng: 36.9371, districts: ['Onikişubat', 'Dulkadiroğlu', 'Elbistan', 'Afşin', 'Türkoğlu', 'Pazarcık', 'Göksun', 'Andırın', 'Çağlayancerit', 'Nurhak', 'Ekinözü'] },
  { id: 47, name: 'Mardin', slug: 'mardin', region: 'Güneydoğu Anadolu', isPopular: true, lat: 37.3212, lng: 40.7245, districts: ['Artuklu', 'Kızıltepe', 'Midyat', 'Nusaybin', 'Derik', 'Mazıdağı', 'Dargeçit', 'Savur', 'Yeşilli', 'Ömerli'] },
  { id: 48, name: 'Muğla', slug: 'mugla', region: 'Ege', isPopular: true, lat: 37.2153, lng: 28.3636, districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Menteşe', 'Milas', 'Ortaca', 'Datça', 'Dalaman', 'Seydikemer', 'Yatağan', 'Ula', 'Köyceğiz', 'Kavaklıdere'] },
  { id: 49, name: 'Muş', slug: 'mus', region: 'Doğu Anadolu', lat: 38.7432, lng: 41.5064, districts: ['Merkez', 'Bulanık', 'Malazgirt', 'Varto', 'Hasköy', 'Korkut'] },
  { id: 50, name: 'Nevşehir', slug: 'nevsehir', region: 'İç Anadolu', isPopular: true, lat: 38.6244, lng: 34.7141, districts: ['Merkez', 'Ürgüp', 'Avanos', 'Gülşehir', 'Derinkuyu', 'Acıgöl', 'Kozaklı', 'Hacıbektaş'] },
  { id: 51, name: 'Niğde', slug: 'nigde', region: 'İç Anadolu', lat: 37.9667, lng: 34.6833, districts: ['Merkez', 'Bor', 'Çiftlik', 'Ulukışla', 'Altunhisar', 'Çamardı'] },
  { id: 52, name: 'Ordu', slug: 'ordu', region: 'Karadeniz', isPopular: true, lat: 40.9839, lng: 37.8764, districts: ['Altınordu', 'Ünye', 'Fatsa', 'Gölköy', 'Perşembe', 'Korgan', 'Kumru', 'Aybastı', 'Akkuş', 'Ulubey', 'Mesudiye', 'İkizce', 'Gürgentepe', 'Çatalpınar', 'Çaybaşı', 'Kabataş', 'Kabadüz', 'Gülyalı', 'Çamaş'] },
  { id: 53, name: 'Rize', slug: 'rize', region: 'Karadeniz', isPopular: true, lat: 41.0201, lng: 40.5234, districts: ['Merkez', 'Çayeli', 'Ardeşen', 'Pazar', 'Fındıklı', 'Güneysu', 'Kalkandere', 'İyidere', 'Derepazarı', 'Çamlıhemşin', 'İkizdere', 'Hemşin'] },
  { id: 54, name: 'Sakarya', slug: 'sakarya', region: 'Marmara', isPopular: true, lat: 40.7569, lng: 30.3783, districts: ['Adapazarı', 'Serdivan', 'Erenler', 'Hendek', 'Akyazı', 'Karasu', 'Geyve', 'Arifiye', 'Sapanca', 'Pamukova', 'Ferizli', 'Kaynarca', 'Kocaali', 'Söğütlü', 'Karapürçek', 'Taraklı'] },
  { id: 55, name: 'Samsun', slug: 'samsun', region: 'Karadeniz', isPopular: true, lat: 41.2928, lng: 36.3313, districts: ['Atakum', 'İlkadım', 'Canik', 'Bafra', 'Çarşamba', 'Vezirköprü', 'Terme', 'Tekkeköy', 'Havza', 'Alaçam', '19 Mayıs', 'Ayvacık', 'Kavak', 'Salıpazarı', 'Asarcık', 'Ladik', 'Yakakent'] },
  { id: 56, name: 'Siirt', slug: 'siirt', region: 'Güneydoğu Anadolu', lat: 37.9333, lng: 41.9500, districts: ['Merkez', 'Kurtalan', 'Pervari', 'Baykan', 'Şirvan', 'Eruh', 'Tillo'] },
  { id: 57, name: 'Sinop', slug: 'sinop', region: 'Karadeniz', lat: 42.0231, lng: 35.1531, districts: ['Merkez', 'Boyabat', 'Gerze', 'Ayancık', 'Durağan', 'Türkeli', 'Erfelek', 'Dikmen', 'Saraydüzü'] },
  { id: 58, name: 'Sivas', slug: 'sivas', region: 'İç Anadolu', isPopular: true, lat: 39.7477, lng: 37.0179, districts: ['Merkez', 'Şarkışla', 'Yıldızeli', 'Suşehri', 'Gemerek', 'Zara', 'Kangal', 'Gürün', 'Divriği', 'Koyulhisar', 'Altınyayla', 'Hafik', 'Ulaş', 'İmranlı', 'Akıncılar', 'Gölova', 'Doğanşar'] },
  { id: 59, name: 'Tekirdağ', slug: 'tekirdag', region: 'Marmara', isPopular: true, lat: 40.9833, lng: 27.5167, districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy', 'Kapaklı', 'Ergene', 'Malkara', 'Saray', 'Hayrabolu', 'Şarköy', 'Muratlı', 'Marmaraereğlisi'] },
  { id: 60, name: 'Tokat', slug: 'tokat', region: 'Karadeniz', lat: 40.3167, lng: 36.5500, districts: ['Merkez', 'Erbaa', 'Turhal', 'Niksar', 'Zile', 'Reşadiye', 'Almus', 'Pazar', 'Yeşilyurt', 'Artova', 'Sulusaray', 'Başçiftlik'] },
  { id: 61, name: 'Trabzon', slug: 'trabzon', region: 'Karadeniz', isPopular: true, lat: 41.0015, lng: 39.7178, districts: ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Yomra', 'Arsin', 'Vakfıkebir', 'Sürmene', 'Maçka', 'Beşikdüzü', 'Çarşıbaşı', 'Tonya', 'Düzköy', 'Çaykara', 'Şalpazarı', 'Hayrat', 'Köprübaşı', 'Dernekpazarı'] },
  { id: 62, name: 'Tunceli', slug: 'tunceli', region: 'Doğu Anadolu', lat: 39.1079, lng: 39.5401, districts: ['Merkez', 'Pertek', 'Mazgirt', 'Çemişgezek', 'Hozat', 'Ovacık', 'Nazımiye', 'Pülümür'] },
  { id: 63, name: 'Şanlıurfa', slug: 'sanliurfa', region: 'Güneydoğu Anadolu', isPopular: true, lat: 37.1591, lng: 38.7969, districts: ['Eyyübiye', 'Haliliye', 'Karaköprü', 'Siverek', 'Viranşehir', 'Suruç', 'Birecik', 'Ceylanpınar', 'Akçakale', 'Harran', 'Bozova', 'Hilvan', 'Halfeti'] },
  { id: 64, name: 'Uşak', slug: 'usak', region: 'Ege', lat: 38.6823, lng: 29.4082, districts: ['Merkez', 'Banaz', 'Eşme', 'Sivaslı', 'Ulubey', 'Karahallı'] },
  { id: 65, name: 'Van', slug: 'van', region: 'Doğu Anadolu', isPopular: true, lat: 38.4891, lng: 43.4089, districts: ['İpekyolu', 'Tuşba', 'Edremit', 'Erciş', 'Özalp', 'Çaldıran', 'Başkale', 'Muradiye', 'Gürpınar', 'Gevaş', 'Saray', 'Çatak', 'Bahçesaray'] },
  { id: 66, name: 'Yozgat', slug: 'yozgat', region: 'İç Anadolu', lat: 39.8181, lng: 34.8147, districts: ['Merkez', 'Sorgun', 'Akdağmadeni', 'Yerköy', 'Boğazlıyan', 'Saraykent', 'Çekerek', 'Şefaatli', 'Sorgun', 'Kadışehri', 'Aydıncık', 'Yenifakılı', 'Çandır'] },
  { id: 67, name: 'Zonguldak', slug: 'zonguldak', region: 'Karadeniz', isPopular: true, lat: 41.4564, lng: 31.7987, districts: ['Merkez', 'Ereğli', 'Çaycuma', 'Devrek', 'Kozlu', 'Alaplı', 'Kilimli', 'Gökçebey'] },
  { id: 68, name: 'Aksaray', slug: 'aksaray', region: 'İç Anadolu', lat: 38.3687, lng: 34.0370, districts: ['Merkez', 'Ortaköy', 'Eskil', 'Gülağaç', 'Güzelyurt', 'Ağaçören', 'Sultanhanı', 'Sarıyahşi'] },
  { id: 69, name: 'Bayburt', slug: 'bayburt', region: 'Karadeniz', lat: 40.2552, lng: 40.2249, districts: ['Merkez', 'Demirözü', 'Aydıntepe'] },
  { id: 70, name: 'Karaman', slug: 'karaman', region: 'İç Anadolu', lat: 37.1759, lng: 33.2287, districts: ['Merkez', 'Ermenek', 'Sarıveliler', 'Ayrancı', 'Kazımkarabekir', 'Başyayla'] },
  { id: 71, name: 'Kırıkkale', slug: 'kirikkale', region: 'İç Anadolu', lat: 39.8468, lng: 33.5153, districts: ['Merkez', 'Yahşihan', 'Keskin', 'Delice', 'Bahşılı', 'Sulakyurt', 'Balışeyh', 'Karakeçili', 'Çelebi'] },
  { id: 72, name: 'Batman', slug: 'batman', region: 'Güneydoğu Anadolu', isPopular: true, lat: 37.8812, lng: 41.1293, districts: ['Merkez', 'Kozluk', 'Sason', 'Beşiri', 'Gercüş', 'Hasankeyf'] },
  { id: 73, name: 'Şırnak', slug: 'sirnak', region: 'Güneydoğu Anadolu', lat: 37.5164, lng: 42.4595, districts: ['Cizre', 'Silopi', 'Merkez', 'İdil', 'Uludere', 'Beytüşşebap', 'Güçlükonak'] },
  { id: 74, name: 'Bartın', slug: 'bartin', region: 'Karadeniz', lat: 41.6344, lng: 32.3375, districts: ['Merkez', 'Ulus', 'Amasra', 'Kurucaşile'] },
  { id: 75, name: 'Ardahan', slug: 'ardahan', region: 'Doğu Anadolu', lat: 41.1105, lng: 42.7022, districts: ['Merkez', 'Göle', 'Çıldır', 'Hanak', 'Posof', 'Damal'] },
  { id: 76, name: 'Iğdır', slug: 'igdir', region: 'Doğu Anadolu', lat: 39.9196, lng: 44.0458, districts: ['Merkez', 'Tuzluca', 'Aralık', 'Karakoyunlu'] },
  { id: 77, name: 'Yalova', slug: 'yalova', region: 'Marmara', isPopular: true, lat: 40.6500, lng: 29.2667, districts: ['Merkez', 'Çiftlikköy', 'Çınarcık', 'Altınova', 'Armutlu', 'Termal'] },
  { id: 78, name: 'Karabük', slug: 'karabuk', region: 'Karadeniz', lat: 41.2061, lng: 32.6204, districts: ['Merkez', 'Safranbolu', 'Yenice', 'Eskipazar', 'Eflani', 'Ovacık'] },
  { id: 79, name: 'Kilis', slug: 'kilis', region: 'Güneydoğu Anadolu', lat: 36.7184, lng: 37.1212, districts: ['Merkez', 'Elbeyli', 'Musabeyli', 'Polateli'] },
  { id: 80, name: 'Osmaniye', slug: 'osmaniye', region: 'Akdeniz', lat: 37.0742, lng: 36.2472, districts: ['Merkez', 'Kadirli', 'Düziçi', 'Bahçe', 'Toprakkale', 'Sumbas', 'Hasanbeyli'] },
  { id: 81, name: 'Düzce', slug: 'duzce', region: 'Karadeniz', isPopular: true, lat: 40.8438, lng: 31.1565, districts: ['Merkez', 'Akçakoca', 'Kaynaşlı', 'Gölyaka', 'Çilimli', 'Yığılca', 'Gümüşova', 'Cumayeri'] }
];

// Special high-frequency route distances (exact highway toll/KM benchmark)
const SPECIAL_ROUTE_MATRIX: Record<string, { km: number; durationHours: number }> = {
  'istanbul-ankara': { km: 450, durationHours: 5 },
  'istanbul-izmir': { km: 480, durationHours: 5.5 },
  'istanbul-bursa': { km: 155, durationHours: 2 },
  'istanbul-antalya': { km: 695, durationHours: 8.5 },
  'istanbul-adana': { km: 935, durationHours: 10.5 },
  'istanbul-trabzon': { km: 1060, durationHours: 12.5 },
  'istanbul-samsun': { km: 735, durationHours: 8.5 },
  'istanbul-gaziantep': { km: 1140, durationHours: 13 },
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
  'ordu-mersin': { km: 720, durationHours: 9 },
  'mersin-ordu': { km: 720, durationHours: 9 },
};

function toRadians(degree: number): number {
  return (degree * Math.PI) / 180;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in KM
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeCityName(cityName: string): string {
  if (!cityName) return '';
  return cityName
    .trim()
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i');
}

export function findCity(cityNameOrSlug: string): CityData | undefined {
  if (!cityNameOrSlug) return undefined;
  const normalized = normalizeCityName(cityNameOrSlug);
  return TURKEY_CITIES.find(
    c =>
      normalizeCityName(c.name) === normalized ||
      c.slug === normalized ||
      normalizeCityName(c.slug) === normalized
  );
}

/**
 * Calculates road distance (KM) and realistic truck travel duration (hours) between any two cities in Turkey.
 */
export function calculateDistance(originCity: string, destinationCity: string): { km: number; durationHours: number } {
  if (!originCity || !destinationCity) return { km: 0, durationHours: 0 };

  const norm1 = normalizeCityName(originCity);
  const norm2 = normalizeCityName(destinationCity);

  if (norm1 === norm2) {
    return { km: 35, durationHours: 1.5 }; // Inner-city moving average
  }

  // 1. Check known high-accuracy route matrix
  const key1 = `${norm1}-${norm2}`;
  const key2 = `${norm2}-${norm1}`;
  if (SPECIAL_ROUTE_MATRIX[key1]) return SPECIAL_ROUTE_MATRIX[key1];
  if (SPECIAL_ROUTE_MATRIX[key2]) return SPECIAL_ROUTE_MATRIX[key2];

  // 2. Lookup geographic coordinates for accurate road distance calculation
  const cityA = findCity(originCity);
  const cityB = findCity(destinationCity);

  if (cityA?.lat && cityA?.lng && cityB?.lat && cityB?.lng) {
    const straightKm = haversineDistance(cityA.lat, cityA.lng, cityB.lat, cityB.lng);
    // Real highway road detour factor across Turkish terrain (mountains, highway connections)
    const detourFactor = straightKm < 200 ? 1.34 : straightKm < 500 ? 1.29 : 1.25;
    const roadKm = Math.round(straightKm * detourFactor);
    
    // Truck average speed ~70-75 km/h + 30 min departure/arrival buffer
    const durationHours = Math.max(1.5, Math.round(((roadKm / 75) + 0.5) * 10) / 10);
    return { km: roadKm, durationHours };
  }

  // Fallback
  return { km: 520, durationHours: 6.5 };
}
