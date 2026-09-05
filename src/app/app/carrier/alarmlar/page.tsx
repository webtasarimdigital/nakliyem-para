'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Check, 
  Play, 
  Pause, 
  ArrowRight, 
  SlidersHorizontal, 
  Smartphone, 
  Mail, 
  Globe,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RouteDisplay } from '@/components/ui/RouteDisplay';
import { Modal } from '@/components/ui/Modal';
import { TURKEY_CITIES } from '@/lib/data/turkey-geo';
import { db } from '@/lib/data/mock-db';
import { RouteAlarm, AlarmType } from '@/types';

export default function CarrierAlarmsPage() {
  const carrier = db.getCarriers()[0];
  const [alarms, setAlarms] = useState<RouteAlarm[]>(db.getAlarmsForCarrier(carrier.id));
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Alarm Form State (Spec Item 84)
  const [alarmType, setAlarmType] = useState<AlarmType>('REQUEST_ALARM');
  const [originCity, setOriginCity] = useState('İstanbul');
  const [destCity, setDestCity] = useState('Ankara');
  const [serviceCategory, setServiceCategory] = useState('EVDEN_EVE');
  const [channelPush, setChannelPush] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);

  const handleToggleAlarm = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    db.updateAlarm(id, { status: nextStatus as any });
    setAlarms(db.getAlarmsForCarrier(carrier.id));
  };

  const handleCreateAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: RouteAlarm = {
      id: `alm_${Date.now()}`,
      carrierId: carrier.id,
      type: alarmType,
      title: `${originCity} → ${destCity} ${alarmType === 'REQUEST_ALARM' ? 'İş Alarmı' : 'Defter Alarmı'}`,
      originCity,
      destinationCity: destCity,
      serviceCategory,
      channels: {
        inApp: true,
        email: channelEmail,
        browserPush: channelPush
      },
      status: 'ACTIVE',
      matchCountLast7Days: 0,
      createdAt: new Date().toISOString()
    };

    db.addAlarm(newAlarm);
    setAlarms(db.getAlarmsForCarrier(carrier.id));
    setCreateModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            İş ve Rota Alarmlarım
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Belirlediğiniz güzergâhlarda yeni müşteri talebi veya Defter paylaşımı açıldığında anında bildirim alın.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Alarm Oluştur
        </Button>
      </div>

      {/* Push Permission Prompt Card (Spec Item 86) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF3FF] border border-blue-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#146EF5] text-white shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0A1128]">Anlık Tarayıcı Bildirimleri</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Yeni işler açıldığında ilk teklif verenlerden olmak için bildirimleri aktif edin.
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" className="shrink-0">
          Bildirimleri Aç
        </Button>
      </div>

      {/* Alarms Grid (Spec Item 88) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alarms.map((alarm) => (
          <div
            key={alarm.id}
            className={`bg-white rounded-2xl border-2 transition-all p-5 sm:p-6 shadow-xs flex flex-col justify-between ${
              alarm.status === 'ACTIVE' ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {alarm.type === 'REQUEST_ALARM' ? 'Taşıma İşi Alarmı' : 'Defter Rota Alarmı'}
                </span>

                <Badge variant={alarm.status === 'ACTIVE' ? 'verified' : 'neutral'} size="sm">
                  {alarm.status === 'ACTIVE' ? 'Aktif' : 'Duraklatıldı'}
                </Badge>
              </div>

              <div>
                <RouteDisplay
                  originCity={alarm.originCity || 'Tüm İller'}
                  destinationCity={alarm.destinationCity || 'Tüm İller'}
                  size="md"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-emerald-700">
                  Son 7 günde {alarm.matchCountLast7Days} eşleşme
                </span>

                <div className="flex items-center gap-2 text-[11px]">
                  {alarm.channels.browserPush && <span title="Push">🔔 Push</span>}
                  {alarm.channels.email && <span title="E-posta">✉️ E-posta</span>}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleAlarm(alarm.id, alarm.status)}
                className="text-xs font-bold text-slate-600 hover:text-[#0A1128] flex items-center gap-1.5"
              >
                {alarm.status === 'ACTIVE' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-600" /> Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600" /> Aktifleştir
                  </>
                )}
              </button>

              <Link href="/app/carrier/isler">
                <Button variant="outline" size="sm" className="text-xs">
                  Eşleşen İşleri Gör →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Create Alarm Modal (Spec Item 84) */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Yeni Rota & İş Alarmı Oluştur"
        subtitle="Seçtiğiniz güzergâha yeni taşıma talebi düştüğünde size anında bildireceğiz."
      >
        <form onSubmit={handleCreateAlarm} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Alarm Türü</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAlarmType('REQUEST_ALARM')}
                className={`p-2.5 rounded-lg border font-bold text-center transition-colors ${
                  alarmType === 'REQUEST_ALARM'
                    ? 'bg-[#146EF5] text-white border-[#146EF5]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Müşteri İşi Alarmı
              </button>

              <button
                type="button"
                onClick={() => setAlarmType('NOTEBOOK_ALARM')}
                className={`p-2.5 rounded-lg border font-bold text-center transition-colors ${
                  alarmType === 'NOTEBOOK_ALARM'
                    ? 'bg-[#146EF5] text-white border-[#146EF5]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Defter Rota Alarmı
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Çıkış İli</label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {TURKEY_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Varış İli</label>
              <select
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
              >
                {TURKEY_CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="block font-bold text-slate-700">Bildirim Kanalları</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={channelPush}
                onChange={(e) => setChannelPush(e.target.checked)}
                className="w-4 h-4 text-[#146EF5]"
              />
              <span>Tarayıcı / Mobil Anlık Bildirimi</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={channelEmail}
                onChange={(e) => setChannelEmail(e.target.checked)}
                className="w-4 h-4 text-[#146EF5]"
              />
              <span>E-posta Bildirimi</span>
            </label>
          </div>

          <div className="pt-3">
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Alarmı Başlat
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
