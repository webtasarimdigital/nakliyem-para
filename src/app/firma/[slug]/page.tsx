'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Share2, 
  Sparkles,
  ArrowRight,
  Shield,
  FileCheck,
  Camera,
  Layers,
  ChevronRight,
  Check,
  X,
  Clock,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';

// Gallery photos for demo
const SAMPLE_FLEET_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&auto=format&fit=crop&q=80', title: '10 Teker Kapalı Kasa Evden Eve Aracı' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&auto=format&fit=crop&q=80', title: 'Şehirlerarası Çelik Kasa Nakliye Kamyonu' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&auto=format&fit=crop&q=80', title: '15. Kat Hidrolik Araç Üstü Mobil Asansör' },
  { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1000&auto=format&fit=crop&q=80', title: 'Birinci Sınıf Çift Kat Balonlu Patpat Ambalajlama' }
];

export default function PublicCarrierProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const carrier = db.getCarrierBySlug(resolvedParams.slug) || db.getCarriers()[0];
  const reviews = db.getReviewsForCarrier(carrier.id);
  const defterPosts = db.getDefterPosts().filter(p => p.carrierId === carrier.id);

  const [activeTab, setActiveTab] = useState<'ABOUT' | 'FLEET' | 'SERVICES' | 'REVIEWS' | 'DEFTER'>('ABOUT');
  const [showPhone, setShowPhone] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* ── HERO & COVER PHOTO ───────────────────────────────── */}
      <div className="bg-[#0A1128] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-0">
          
          {/* Cover Photo */}
          <div className="h-48 sm:h-72 rounded-3xl overflow-hidden relative border border-white/10 bg-slate-800">
            {carrier.coverImageUrl ? (
              <img
                src={carrier.coverImageUrl}
                alt={carrier.companyName}
                className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#0A1128] via-[#132247] to-[#0A1128]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-transparent" />
          </div>

          {/* Profile Bar */}
          <div className="px-4 sm:px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-6">
              
              {/* Logo & Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white border-4 border-white shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
                  {carrier.logoUrl ? (
                    <img src={carrier.logoUrl} alt={carrier.companyName} className="w-full h-full object-cover" />
                  ) : (
                    <Truck className="w-14 h-14 text-[#F95700]" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {carrier.companyName}
                    </h1>
                    {carrier.planId === 'plan_gold' && <Badge variant="gold" size="sm" />}
                    <Badge variant="verified" size="sm" />
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-300 font-medium flex-wrap">
                    <div className="flex items-center text-amber-400 font-black gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{carrier.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({carrier.reviewCount} Değerlendirme)</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#F95700]" />
                      {carrier.city} / {carrier.district}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">
                      {carrier.completedJobsCount}+ Başarılı Taşıma
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <Link href={`/teklif-al?preferredCarrier=${carrier.id}`}>
                  <Button variant="primary" size="lg" className="font-black shadow-lg shadow-orange-900/25 px-6">
                    Ücretsiz Teklif İste
                  </Button>
                </Link>

                {showPhone ? (
                  <a href={`tel:${carrier.phone}`}>
                    <Button variant="navy" size="lg" className="font-bold border border-white/20 text-white" leftIcon={<Phone className="w-4 h-4" />}>
                      {carrier.phone}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold border-white/20 text-white hover:bg-white/10"
                    leftIcon={<Phone className="w-4 h-4" />}
                    onClick={() => setShowPhone(true)}
                  >
                    Telefonu Gör
                  </Button>
                )}

                {carrier.whatsapp && (
                  <a href={`https://wa.me/90${carrier.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="lg" className="font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10">
                      WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Verification Proofs Badges Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-black text-white block text-[11px]">K3 Yetki Belgesi</span>
                  <span className="text-[10px] text-slate-400 font-medium">Bakanlık Onaylı</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-black text-white block text-[11px]">Vergi Levhası</span>
                  <span className="text-[10px] text-slate-400 font-medium">Doğrulanmış İşletme</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-black text-white block text-[11px]">Araç Üstü Asansör</span>
                  <span className="text-[10px] text-slate-400 font-medium">{carrier.elevatorSpec?.maxFloor || 15}. Kata Kadar</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-black text-white block text-[11px]">VIP Taşımacılık</span>
                  <span className="text-[10px] text-slate-400 font-medium">%98 Yanıt Oranı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFILE NAVIGATION TABS ─────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'ABOUT', label: 'Hakkımızda & Standartlar' },
              { id: 'FLEET', label: `Araç Filosu & Asansör (${SAMPLE_FLEET_PHOTOS.length})` },
              { id: 'SERVICES', label: 'Hizmetler & Bölgeler' },
              { id: 'REVIEWS', label: `Müşteri Yorumları (${reviews.length > 0 ? reviews.length : carrier.reviewCount})` },
              { id: 'DEFTER', label: `Aktif Defter Paylaşımları (${defterPosts.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0A1128] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT TABS ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* TAB: ABOUT */}
            {activeTab === 'ABOUT' && (
              <div className="space-y-6 animate-fade-in">
                {/* Short Bio Callout */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h2 className="text-xl font-black text-[#0A1128] mb-3">Kurumsal Profil</h2>
                  <p className="text-base text-slate-800 font-bold leading-relaxed mb-4">
                    &ldquo;{carrier.shortBio}&rdquo;
                  </p>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                    {carrier.description || 'Firmamız evden eve nakliyat, ofis taşımacılığı ve eşya depolama alanlarında sektörün öncü ve güvenilir kuruluşlarındandır. Tüm araçlarımız taşınmaya özel kapalı çelik kasalıdır.'}
                  </p>
                </div>

                {/* Packaging & Quality Standards */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-black text-[#0A1128] mb-4">Taşıma &amp; Paketleme Standartlarımız</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: 'Çift Kat Balonlu Patpat', desc: 'Mobilyalar, beyaz eşyalar ve hassas eşyalar kalın havalı ambalaj naylonu ile sarılır.' },
                      { title: 'Uzman Marangozluk', desc: 'Gardırop, yatak odası takımları ve üniteler ustamız tarafından sökülüp yeni evde kurulur.' },
                      { title: 'Askılı Tekstil Dolapları', desc: 'Takım elbise ve kıyafetleriniz kırışmadan özel askılı dolaplarımızla nakledilir.' },
                      { title: 'Emtia Nakliyat Sigortası', desc: 'Taşıma esnasında oluşabilecek tüm risklere karşı tam kapsamlı poliçe düzenlenir.' }
                    ].map((st, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="w-7 h-7 rounded-xl bg-[#F95700]/15 text-[#F95700] flex items-center justify-center font-black text-xs mb-2">
                          ✓
                        </div>
                        <h4 className="font-black text-sm text-[#0A1128] mb-1">{st.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{st.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: FLEET & ASANSÖR PHOTOS */}
            {activeTab === 'FLEET' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-fade-in space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0A1128] mb-1">Araç Filosu &amp; Ekipman Görselleri</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Firmamıza ait kapalı kasa nakliye araçları ve dış cephe mobil asansörleri.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SAMPLE_FLEET_PHOTOS.map((photo, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(photo.url)}
                      className="group relative aspect-video rounded-2xl overflow-hidden border border-slate-200 cursor-pointer shadow-2xs"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                        <p className="text-xs font-bold text-white leading-tight">{photo.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {carrier.elevatorSpec?.hasElevator && (
                  <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F95700] text-white flex items-center justify-center font-black text-lg shrink-0">
                      🏢
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#0A1128]">Mobil Asansör Teknik Özellikleri</h4>
                      <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                        {carrier.elevatorSpec.description || `${carrier.elevatorSpec.maxFloor || 15}. kata kadar hidrolik araç üstü asansör ile dar merdivenli veya bina yönetiminin asansör kullanımına izin vermediği durumlarda hızlı servis.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SERVICES & CITIES */}
            {activeTab === 'SERVICES' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-fade-in space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#0A1128] mb-1">Verilen Hizmetler</h2>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {carrier.services.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-orange-50 text-[#C23E00] border border-orange-200 font-black text-xs">
                        ✓ {s.toUpperCase().replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-base font-black text-[#0A1128] mb-2">Hizmet Verilen İller &amp; Rotalar</h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    Bu iller arasında düzenli seferler ve araç üstü nakliyat sağlanmaktadır.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {carrier.serviceAreas.map((city, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
                        📍 {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'REVIEWS' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-fade-in space-y-6">
                
                {/* Header & Overall Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-black text-[#0A1128]">Müşteri Değerlendirmeleri</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      Bu firmayla taşınması tamamlanan onaylı müşterilerin bağımsız yorumları.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 shrink-0">
                    <div className="text-3xl font-black text-[#F95700] flex items-center gap-1">
                      <Star className="w-7 h-7 fill-current text-amber-400" />
                      <span>{carrier.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-left border-l border-slate-200 pl-4">
                      <p className="text-xs font-black text-slate-800">{carrier.reviewCount} Değerlendirme</p>
                      <p className="text-[10px] text-emerald-600 font-bold">%100 Doğrulanmış Müşteri</p>
                    </div>
                  </div>
                </div>

                {/* Trust Notice Band */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Güvenlik Garantisi:</strong> Sadece platform üzerinden talep açıp bu nakliye firması ile anlaşan ve taşınması tamamlanan müşteriler puan/yorum verebilir. Hizmet almamış kişilerin yorum yapması teknik olarak engellenmiştir.
                  </p>
                </div>

                {/* Review items */}
                <div className="space-y-4">
                  {reviews.map((rev) => {
                    // Mask customer surname for privacy (e.g., "Ahmet Kaya" -> "Ahmet K.")
                    const nameParts = rev.customerName.trim().split(' ');
                    const maskedName = nameParts.length > 1 
                      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.` 
                      : rev.customerName;

                    return (
                      <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-black text-sm text-[#0A1128]">{maskedName}</p>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Onaylı Taşınma
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium mt-0.5 block">
                              📍 {rev.originCity} → {rev.destinationCity} Taşınması
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-amber-500 font-black text-sm bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </div>

                        {/* Sub ratings mini pills if available */}
                        {(rev.communicationRating || rev.serviceQualityRating) && (
                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-600 pt-1">
                            {rev.communicationRating && (
                              <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">
                                İletişim: <strong className="text-slate-800">{rev.communicationRating}/5</strong>
                              </span>
                            )}
                            {rev.punctualityRating && (
                              <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">
                                Dakiklik: <strong className="text-slate-800">{rev.punctualityRating}/5</strong>
                              </span>
                            )}
                            {rev.serviceQualityRating && (
                              <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">
                                Kalite: <strong className="text-slate-800">{rev.serviceQualityRating}/5</strong>
                              </span>
                            )}
                            {rev.priceHonestyRating && (
                              <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200">
                                Fiyat Şeffaflığı: <strong className="text-slate-800">{rev.priceHonestyRating}/5</strong>
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          &ldquo;{rev.comment}&rdquo;
                        </p>

                        {rev.reply && (
                          <div className="mt-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
                            <strong className="text-[#F95700] block mb-1">{carrier.companyName} Yanıtı:</strong>
                            <p className="text-slate-600 font-medium leading-relaxed">{rev.reply}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {reviews.length === 0 && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                      <Star className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                      <p className="font-bold text-sm text-slate-700">Henüz müşteri değerlendirmesi bulunmuyor</p>
                      <p className="text-xs text-slate-400 mt-1">Bu firmayla taşınan ilk müşteri olup deneyiminizi paylaşabilirsiniz.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: DEFTER POSTS */}
            {activeTab === 'DEFTER' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs animate-fade-in space-y-4">
                <div>
                  <h2 className="text-xl font-black text-[#0A1128] mb-1">Aktif Nakliyeci Defteri Paylaşımları</h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Firmanın güncel boş araç, dönüş rotası ve yük paylaşımları.
                  </p>
                </div>

                {defterPosts.length > 0 ? (
                  defterPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-[#F95700]">
                          {post.originCity} → {post.destinationCity}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-3">
                        {post.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Truck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm text-slate-600">Aktif Defter paylaşımı bulunmuyor.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar (4/12) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick Request Box */}
            <div className="bg-gradient-to-br from-[#0A1128] to-[#132247] rounded-3xl p-6 text-white shadow-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F95700]/20 text-[#F95700] text-xs font-black mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Öncelikli Teklif</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">Bu Firmadan Fiyat Alın</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed mb-6">
                Talebinizi oluşturduğunuzda {carrier.companyName} bildirim alarak en avantajlı teklifini size iletecektir.
              </p>

              <Link href={`/teklif-al?preferredCarrier=${carrier.id}`}>
                <Button variant="primary" size="lg" className="w-full font-black shadow-md shadow-orange-900/30" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Hemen Teklif Oluştur
                </Button>
              </Link>
            </div>

            {/* Direct Contact Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h4 className="font-black text-sm text-[#0A1128] uppercase tracking-wider">İletişim Bilgileri</h4>
              
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#C23E00] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block">Telefon</span>
                    <span className="font-black text-slate-900">{showPhone ? carrier.phone : '05** *** ** **'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black block">Merkez Adres</span>
                    <span className="font-bold text-slate-700">{carrier.city}, {carrier.district}</span>
                  </div>
                </div>
              </div>

              {!showPhone && (
                <Button variant="outline" size="sm" className="w-full font-bold text-xs" onClick={() => setShowPhone(true)}>
                  Numarayı Göster
                </Button>
              )}
            </div>

            {/* Trust Notice */}
            <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed space-y-1">
              <strong className="block font-black text-amber-950">🛡️ Güvenli Taşıma Garantisi</strong>
              <p>Platformumuzdaki tüm Gold onaylı nakliyeciler Ulaştırma Bakanlığı K3 yetki belgesi ve vergi levhası denetiminden geçmektedir.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Photos */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedPhoto} alt="Büyük Görsel" className="w-full h-full object-contain rounded-2xl" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
