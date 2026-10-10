'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Mail,
  HeartHandshake,
  CheckCircle2,
  Building2,
  Briefcase,
  PhoneCall,
  GraduationCap
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'management' | 'tech' | 'operations' | 'support';
  departmentLabel: string;
  bio: string;
  experience: string;
  image: string;
  linkedin?: string;
  email?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Burak Yılmaz',
    role: 'Kurucu Ortak & CEO',
    department: 'management',
    departmentLabel: 'Yönetim & Strateji',
    bio: '14 yılı aşkın uluslararası lojistik ve tedarik zinciri yönetimi deneyimine sahip. TaşınTeklif\'in vizyon ve pazar büyüme stratejisini yönetiyor.',
    experience: '14+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'burak@tasinteklif.com',
  },
  {
    id: '2',
    name: 'Selin Kaya',
    role: 'Kurucu Ortak & CTO',
    department: 'tech',
    departmentLabel: 'Yazılım & Teknoloji',
    bio: 'İTÜ Bilgisayar Mühendisliği mezunu. Yüksek hacimli pazaryeri mimarisi, gerçek zamanlı rota optimizasyonu ve algoritma geliştirme lideri.',
    experience: '11+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'selin@tasinteklif.com',
  },
  {
    id: '3',
    name: 'Emre Demirtaş',
    role: 'Operasyon Direktörü (COO)',
    department: 'operations',
    departmentLabel: 'Saha & Operasyon',
    bio: 'Türkiye genelinde 81 ilde nakliyeci K3 belge doğrulama süreçlerini, kalite standartlarını ve saha denetim operasyonlarını koordine ediyor.',
    experience: '10+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'emre@tasinteklif.com',
  },
  {
    id: '4',
    name: 'Zeynep Aydın',
    role: 'Ürün & Tasarım Lideri (CPO)',
    department: 'tech',
    departmentLabel: 'Yazılım & Teknoloji',
    bio: 'Kullanıcı dostu teklif motoru, mobil arayüzler ve dijital taşıma deneyiminin tasarım süreçlerini yöneten kıdemli ürün yöneticisi.',
    experience: '8+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    email: 'zeynep@tasinteklif.com',
  },
  {
    id: '5',
    name: 'Mert Aksoy',
    role: 'Taşıyıcı İlişkileri & Birlik Koordinatörü',
    department: 'operations',
    departmentLabel: 'Saha & Operasyon',
    bio: 'Nakliyeciler odaları, esnaf kooperatifleri ve büyük araç filolarıyla iletişim köprüsünü kurarak Nakliyeci Defteri ağını genişletiyor.',
    experience: '9+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    email: 'mert@tasinteklif.com',
  },
  {
    id: '6',
    name: 'Canan Öztürk',
    role: 'Müşteri Deneyimi & Destek Ekip Lideri',
    department: 'support',
    departmentLabel: 'Müşteri Deneyimi',
    bio: 'Taşınma gününde müşterilerin tüm soru ve taleplerini anında çözen 7/24 çok kanallı destek ekibinin yönetiminden sorumlu.',
    experience: '7+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'canan@tasinteklif.com',
  },
  {
    id: '7',
    name: 'Oğuzhan Çelik',
    role: 'Kıdemli Backend & Altyapı Mimarı',
    department: 'tech',
    departmentLabel: 'Yazılım & Teknoloji',
    bio: 'Mikroservis mimarileri, anlık SMS/E-posta bildirim sistemleri ve sunucu güvenliği altyapısını geliştiren yazılım mühendisi.',
    experience: '9+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    email: 'oguzhan@tasinteklif.com',
  },
  {
    id: '8',
    name: 'Elif Şahin',
    role: 'Büyüme & Dijital Pazarlama Müdürü',
    department: 'management',
    departmentLabel: 'Yönetim & Strateji',
    bio: 'Organik SEO, performans pazarlaması ve bölgesel talep analizleriyle TaşınTeklif\'i Türkiye\'nin 1 numaralı taşınma platformu haline getirdi.',
    experience: '8+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    email: 'elif@tasinteklif.com',
  },
  {
    id: '9',
    name: 'Kaan Erdem',
    role: 'Veri Analisti & Fiyatlandırma Uzmanı',
    department: 'tech',
    departmentLabel: 'Yazılım & Teknoloji',
    bio: 'İl-ilçe rotaları arasındaki mazot, köprü ve mevsimsel taşınma verilerini modelleyerek şeffaf fiyat endeksleri üretiyor.',
    experience: '6+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    email: 'kaan@tasinteklif.com',
  },
  {
    id: '10',
    name: 'Büşra Yıldız',
    role: 'Kalite Güvence & Uyuşmazlık Çözüm Uzmanı',
    department: 'support',
    departmentLabel: 'Müşteri Deneyimi',
    bio: 'Müşteri ve nakliyeci arasındaki taşıma sözleşmeleri, sigorta hasar takip süreçleri ve tarafsız arabuluculuk konularında uzman.',
    experience: '6+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    email: 'busra@tasinteklif.com',
  },
  {
    id: '11',
    name: 'Tarık Kurt',
    role: 'Mobil Uygulama Geliştiricisi',
    department: 'tech',
    departmentLabel: 'Yazılım & Teknoloji',
    bio: 'Nakliyecilerin cebindeki iş takip paneli ve kullanıcıların canlı taşınma takip uygulamalarını geliştiren iOS/Android uzmanı.',
    experience: '5+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    email: 'tarik@tasinteklif.com',
  },
  {
    id: '12',
    name: 'Gizem Arslan',
    role: 'Kurumsal İletişim & İş Ortaklıkları',
    department: 'operations',
    departmentLabel: 'Saha & Operasyon',
    bio: 'Eşya depolama tesisleri, asansör kiralama firmaları ve kurumsal şirket taşımalarıyla stratejik iş birliklerini koordine ediyor.',
    experience: '7+ Yıl Deneyim',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    email: 'gizem@tasinteklif.com',
  },
];

const DEPARTMENTS = [
  { id: 'all', label: 'Tüm Ekip' },
  { id: 'management', label: 'Yönetim & Strateji' },
  { id: 'tech', label: 'Yazılım & Teknoloji' },
  { id: 'operations', label: 'Saha & Operasyon' },
  { id: 'support', label: 'Müşteri Deneyimi' },
] as const;

export default function EkibimizPage() {
  const [activeDept, setActiveDept] = useState<string>('all');

  const filteredMembers = activeDept === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.department === activeDept);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-4">
            <Breadcrumb
              items={[
                { name: 'Ana Sayfa', url: '/' },
                { name: 'Kurumsal', url: '/hakkimizda' },
                { name: 'Ekibimiz', url: '/ekibimiz' },
              ]}
            />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#F95700] text-xs font-black border border-orange-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TaşınTeklif Çekirdek Kadrosu</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#111E38] tracking-tight leading-tight">
              Taşınma Dünyasını Dönüştüren <br />
              <span className="text-[#F95700]">Profesyonel Ekibimiz</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl">
              Lojistik uzmanları, yazılım mühendisleri, veri analistleri ve 7/24 müşteri deneyimi danışmanlarımızla Türkiye&apos;nin 81 ilinde taşınmayı güvenli, şeffaf ve zahmetsiz hale getiriyoruz.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-black text-[#111E38] block">45+</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Çekirdek Kadro &amp; Saha Temsilcisi</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-black text-[#F95700] block">81 İl</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Canlı Taşıma Koordinasyonu</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-black text-[#111E38] block">7/24</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Kesintisiz Operasyon Desteği</span>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">%98.4</span>
              <span className="text-xs text-slate-500 font-medium mt-0.5 block">Müşteri Memnuniyeti Skoru</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Team Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        
        {/* Department Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveDept(dept.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeDept === dept.id
                    ? 'bg-[#111E38] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-slate-400">
            {filteredMembers.length} Takım Üyesi
          </span>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
            >
              {/* Photo Area */}
              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                
                {/* Badge on Image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10">
                    {member.experience}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F95700] text-white shadow-xs">
                    {member.departmentLabel}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#111E38] group-hover:text-[#F95700] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-[#F95700] mt-0.5">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal mt-2.5 line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                {/* Footer Links */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Doğrulanmış Profil
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${member.email}`}
                      title={`${member.name} E-posta`}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#F95700] hover:text-white text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="#linkedin"
                      onClick={e => e.preventDefault()}
                      title={`${member.name} LinkedIn`}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#0A66C2] hover:text-white text-slate-600 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values & Culture */}
      <section className="bg-white border-y border-slate-200 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#F95700]">
              Çalışma İlkelerimiz
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111E38] tracking-tight">
              Ekibimizi Bir Araya Getiren Değerler
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Her taşınma hikayesinin arkasında titiz bir mühendislik ve insan odaklı hizmet anlayışı var.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#F95700] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#111E38]">Şeffaflık &amp; Dürüstlük</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Gizli maliyetlere, son dakika fiyat artışlarına ve belgesiz taşımacılığa sıfır tolerans gösteriyoruz. Ne anlaştıysanız o geçerlidir.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#111E38]">Taşıyıcı Emeğine Saygı</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Taşıyıcılarımızın haklarını koruyor, boş dönüşlerini dolduruyor ve komisyonsuz doğrudan kazanç elde etmelerini sağlıyoruz.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-[#111E38]">Kesintisiz Teknoloji</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Akıllı algoritma ve rota eşleştirme motorumuzla Türkiye genelinde kamyonların boş kilometre yapmasını önlüyor, çevreyi koruyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Team CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-[#111E38] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-[#F95700] text-xs font-bold border border-orange-500/30">
              <Briefcase className="w-3.5 h-3.5" />
              Kariyer &amp; Açık Pozisyonlar
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ekibimize Katılmak İster misiniz?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              TaşınTeklif olarak lojistik ve teknoloji dünyasını dönüştürecek yeni yetenekler arıyoruz. Yazılım, operasyon veya müşteri deneyimi alanında kariyer yapmak için başvurabilirsiniz.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              href="/iletisim"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white text-xs sm:text-sm font-black transition-all shadow-md text-center"
            >
              Özgeçmiş Gönder &amp; İletişime Geç
            </Link>
            <Link
              href="/hakkimizda"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold transition-all border border-slate-700 text-center"
            >
              Hakkımızda&apos;yı İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
