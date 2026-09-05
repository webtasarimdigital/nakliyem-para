'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building2,
  Settings2,
  Check,
  X,
  MoveRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { db } from '@/lib/data/mock-db';

interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'WON_JOB' | 'PENDING_OFFER' | 'EMPTY_RETURN' | 'ELEVATOR_RENTAL' | 'CUSTOM_JOB';
  title: string;
  route?: { origin: string; dest: string };
  price?: number;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED';
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    date: '2026-09-12',
    time: '08:30',
    type: 'WON_JOB',
    title: '3+1 Ev Taşıma (Kadıköy → Çankaya)',
    route: { origin: 'İstanbul, Kadıköy', dest: 'Ankara, Çankaya' },
    price: 24500,
    customerName: 'Ahmet Kaya',
    customerPhone: '0532 111 22 33',
    notes: 'Mobil asansör çıkışta gerekli. Paketleme dahil.',
    status: 'CONFIRMED'
  },
  {
    id: 'ev-2',
    date: '2026-09-14',
    time: '14:00',
    type: 'EMPTY_RETURN',
    title: 'Ankara → İstanbul Boş Dönüş',
    route: { origin: 'Ankara, Yenimahalle', dest: 'İstanbul, Pendik' },
    notes: '%80 Boş Kapasite — 10 Teker Kamyon',
    status: 'CONFIRMED'
  },
  {
    id: 'ev-3',
    date: '2026-09-15',
    time: '09:00',
    type: 'PENDING_OFFER',
    title: '2+1 Ofis Taşıma (Beşiktaş → Ataşehir)',
    route: { origin: 'İstanbul, Beşiktaş', dest: 'İstanbul, Ataşehir' },
    price: 18500,
    customerName: 'Selin Yıldız',
    notes: 'Müşteriden onay bekleniyor.',
    status: 'PENDING'
  },
  {
    id: 'ev-4',
    date: '2026-09-18',
    time: '10:00',
    type: 'ELEVATOR_RENTAL',
    title: 'Mobil Asansör Kiralama (14. Kat)',
    route: { origin: 'İstanbul, Kartal', dest: 'İstanbul, Kartal' },
    price: 3500,
    customerName: 'Demir Lojistik (Meslektaş)',
    customerPhone: '0544 555 66 77',
    notes: 'Operatörlü servis, 3 saatlik iş.',
    status: 'CONFIRMED'
  }
];

export default function CarrierTakvimPage() {
  const carrier = db.getCarriers()[0];
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');
  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Müsaitlik State (YYYY-MM-DD -> MUSAIT / DOLU)
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, 'MUSAIT' | 'DOLU'>>({
    '2026-09-12': 'DOLU',
    '2026-09-13': 'MUSAIT',
    '2026-09-14': 'DOLU',
    '2026-09-15': 'MUSAIT',
    '2026-09-16': 'MUSAIT',
    '2026-09-17': 'MUSAIT',
    '2026-09-18': 'DOLU',
    '2026-09-19': 'MUSAIT',
    '2026-09-20': 'MUSAIT'
  });

  // Modal State for Custom Event
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(selectedDate);
  const [newTime, setNewTime] = useState('09:00');
  const [newOrigin, setNewOrigin] = useState('');
  const [newDest, setNewDest] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('CUSTOM_JOB');
  const [newNotes, setNewNotes] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: CalendarEvent = {
      id: `ev-${Date.now()}`,
      date: newDate,
      time: newTime,
      type: newType,
      title: newTitle || 'Özel Operasyon İşi',
      route: newOrigin && newDest ? { origin: newOrigin, dest: newDest } : undefined,
      price: newPrice ? Number(newPrice) : undefined,
      notes: newNotes,
      status: 'CONFIRMED'
    };

    setEvents(prev => [...prev, event]);
    setIsAddModalOpen(false);
    // Mark date as DOLU
    setAvailabilityMap(prev => ({ ...prev, [newDate]: 'DOLU' }));
  };

  const toggleAvailability = (dateStr: string) => {
    setAvailabilityMap(prev => ({
      ...prev,
      [dateStr]: prev[dateStr] === 'DOLU' ? 'MUSAIT' : 'DOLU'
    }));
  };

  // Selected date events
  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  // Month days for Sept 2026 (Starts Tuesday Sep 1, 30 days)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const availability = availabilityMap[dateStr] || 'MUSAIT';
    return { dayNum, dateStr, events: dayEvents, availability };
  });

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'WON_JOB':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded">Kazanılan İş</span>;
      case 'PENDING_OFFER':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.5 rounded">Teklif Bekliyor</span>;
      case 'EMPTY_RETURN':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-1.5 py-0.5 rounded">Boş Dönüş</span>;
      case 'ELEVATOR_RENTAL':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-1.5 py-0.5 rounded">Asansör Rezervasyon</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-black px-1.5 py-0.5 rounded">Özel İş</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Top Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-[#F95700] uppercase tracking-wider">Operasyon Yönetimi</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-500">{carrier.companyName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">İş &amp; Operasyon Takvimi</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex bg-slate-200 rounded-xl p-1 gap-1 text-xs font-black">
              <button
                onClick={() => setViewMode('MONTH')}
                className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'MONTH' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-600'}`}
              >
                Ay
              </button>
              <button
                onClick={() => setViewMode('WEEK')}
                className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'WEEK' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-600'}`}
              >
                Hafta
              </button>
              <button
                onClick={() => setViewMode('DAY')}
                className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'DAY' ? 'bg-white text-[#0A1128] shadow-xs' : 'text-slate-600'}`}
              >
                Gün
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-black shadow-sm"
              onClick={() => {
                setNewDate(selectedDate);
                setIsAddModalOpen(true);
              }}
            >
              Özel İş Ekle
            </Button>
          </div>
        </div>

        {/* Info Banner for Availability / Matching (Prompt 229) */}
        <div className="bg-[#0A1128] text-white rounded-2xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F95700]/20 text-[#F95700] flex items-center justify-center shrink-0 mt-0.5">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-black text-sm text-white">Akıllı Müsaitlik &amp; Eşleştirme Motoru</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Takviminizde &apos;Müsait&apos; işaretlediğiniz günlere ait müşteri talepleri size öncelikli rota eşleşmesiyle iletilir.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Müsait ({Object.values(availabilityMap).filter(v => v === 'MUSAIT').length} Gün)
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 ml-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Dolu / İşte ({Object.values(availabilityMap).filter(v => v === 'DOLU').length} Gün)
            </div>
          </div>
        </div>

        {/* Main Grid: Calendar on Left (2/3), Day Details on Right (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Calendar Grid (8/12) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            {/* Month Header Nav */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-[#0A1128]">Eylül 2026</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {events.length} Planlı Operasyon
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#F95700] hover:text-[#F95700] transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#F95700] hover:text-[#F95700] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((w, idx) => (
                <span key={idx} className="text-[11px] font-black text-slate-400 uppercase tracking-wider py-1">
                  {w}
                </span>
              ))}
            </div>

            {/* 30 Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day offset for Tuesday Sep 1 (1 empty cell for Mon) */}
              <div className="min-h-[84px] p-2 rounded-xl bg-slate-50/50 border border-transparent opacity-30" />

              {daysInMonth.map((day) => {
                const isSelected = day.dateStr === selectedDate;
                const isDolu = day.availability === 'DOLU';
                return (
                  <div
                    key={day.dateStr}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`min-h-[88px] p-2 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#F95700] bg-orange-50/30 shadow-xs'
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Top Date & Availability Dot */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${isSelected ? 'text-[#F95700]' : 'text-slate-800'}`}>
                        {day.dayNum}
                      </span>
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAvailability(day.dateStr);
                        }}
                        title={isDolu ? 'Durum: DOLU (Tıkla Müsait Yap)' : 'Durum: MÜSAİT (Tıkla Dolu Yap)'}
                        className={`w-2.5 h-2.5 rounded-full transition-transform hover:scale-125 cursor-pointer ${
                          isDolu ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                    </div>

                    {/* Events Mini Dots / Chips */}
                    <div className="space-y-1 my-1">
                      {day.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                            ev.type === 'WON_JOB'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.type === 'PENDING_OFFER'
                              ? 'bg-amber-100 text-amber-800'
                              : ev.type === 'EMPTY_RETURN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <span className="text-[9px] font-black text-slate-400 block pl-0.5">
                          +{day.events.length - 2} daha
                        </span>
                      )}
                    </div>

                    {/* Müsait / Dolu status tag */}
                    <div className="text-[9px] font-black text-right text-slate-400">
                      {isDolu ? 'Dolu' : 'Müsait'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Selected Day Details & Quick Actions (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Selected Date Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Seçilen Gün</span>
                  <p className="text-lg font-black text-[#0A1128]">{selectedDate}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={availabilityMap[selectedDate] === 'MUSAIT' ? 'primary' : 'outline'}
                    size="sm"
                    className="text-xs font-black"
                    onClick={() => toggleAvailability(selectedDate)}
                  >
                    {availabilityMap[selectedDate] === 'MUSAIT' ? '✓ Müsaitim' : '⚠️ Doluyum'}
                  </Button>
                </div>
              </div>

              {/* Day's Scheduled Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0A1128]">Bu Günün Operasyonları ({selectedDateEvents.length})</span>
                  <button
                    onClick={() => {
                      setNewDate(selectedDate);
                      setIsAddModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#F95700] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> İş Ekle
                  </button>
                </div>

                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#F95700] transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        {getEventBadge(ev.type)}
                        {ev.time && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                            <Clock className="w-3 h-3 text-slate-400" /> {ev.time}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-[#0A1128]">{ev.title}</h4>

                      {ev.route && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-[#F95700]" />
                          <span>{ev.route.origin}</span>
                          <MoveRight className="w-3 h-3 text-slate-400" />
                          <span>{ev.route.dest}</span>
                        </div>
                      )}

                      {ev.price && (
                        <div className="text-sm font-black text-[#F95700]">
                          {ev.price.toLocaleString('tr-TR')} TL
                        </div>
                      )}

                      {ev.notes && (
                        <p className="text-xs text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-100">
                          {ev.notes}
                        </p>
                      )}

                      {ev.customerPhone && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">{ev.customerName}</span>
                          <a href={`tel:${ev.customerPhone}`}>
                            <Button variant="navy" size="sm" className="text-xs font-bold py-1 px-2.5 h-auto" leftIcon={<Phone className="w-3 h-3" />}>
                              Ara
                            </Button>
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">Bu tarihe kayıtlı iş yok</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Müsait durumdasınız, rota eşleşmeleri bekleniyor.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-xs text-orange-950 font-medium leading-relaxed space-y-1.5">
              <strong className="block font-black text-orange-900">💡 Nakliyeci Operasyon İpucu</strong>
              <p>
                Şehirlerarası gidiş işinizi takvime eklediğinizde sistem otomatik olarak dönüş rotanızı tarar ve ters istikametteki açık yükleri Operasyon Merkezinize düşürür.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Custom Event */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Takvime Yeni Operasyon / İş Ekle"
      >
        <form onSubmit={handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">İş / Operasyon Başlığı *</label>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Örn: 2+1 Ev Taşıma, Asansör Kiralama, Özel Nakliye"
              required
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Tarih</label>
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Saat</label>
              <input
                type="time"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">İş Tipi</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none bg-white"
              >
                <option value="WON_JOB">Kazanılan İş</option>
                <option value="EMPTY_RETURN">Boş Dönüş Rotası</option>
                <option value="ELEVATOR_RENTAL">Mobil Asansör Rezervasyonu</option>
                <option value="CUSTOM_JOB">Firma İçi Özel İş</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Anlaşılan Fiyat (TL)</label>
              <input
                type="number"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                placeholder="20000"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Nereden</label>
              <input
                type="text"
                value={newOrigin}
                onChange={e => setNewOrigin(e.target.value)}
                placeholder="İstanbul, Kadıköy"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Nereye</label>
              <input
                type="text"
                value={newDest}
                onChange={e => setNewDest(e.target.value)}
                placeholder="Ankara, Çankaya"
                className="w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#0A1128] uppercase tracking-wider mb-1.5">Operasyon Notları</label>
            <textarea
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              rows={2}
              placeholder="Araç plakası, personel sayısı, özel ambalaj notları..."
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#0A1128] focus:border-[#F95700] focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1 font-bold"
              onClick={() => setIsAddModalOpen(false)}
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="flex-1 font-black shadow-md"
            >
              Takvime Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
