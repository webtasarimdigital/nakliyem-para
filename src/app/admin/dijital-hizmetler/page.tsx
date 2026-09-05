'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
import { DigitalServiceLead, LeadPipelineStatus } from '@/types';

export default function AdminDigitalLeadsCrmPage() {
  const [leads, setLeads] = useState<DigitalServiceLead[]>(db.getLeads());

  const pipelineStages: { id: LeadPipelineStatus; label: string; color: string }[] = [
    { id: 'NEW', label: 'Yeni Talep', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'CONTACTED', label: 'Görüşüldü', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'MEETING', label: 'Toplantı Planlandı', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'PROPOSAL', label: 'Teklif İletildi', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'WON', label: 'Satış Yapıldı 🎉', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'LOST', label: 'Olumsuz', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  ];

  const handleStageChange = (leadId: string, nextStatus: LeadPipelineStatus) => {
    db.updateLead(leadId, { status: nextStatus });
    setLeads(db.getLeads());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A1128] mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-[#0A1128]">
            Dijital Hizmetler CRM & Lead Boru Hattı
          </h1>
        </div>
      </div>

      {/* Kanban / Pipeline Grid (Spec Item 103) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => {
          const stageLeads = leads.filter(l => l.status === stage.id);
          return (
            <div key={stage.id} className="bg-slate-100/70 rounded-2xl p-4 min-w-[240px] flex flex-col">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-[#0A1128]">{stage.label}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
                  {stageLeads.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="font-bold text-[#0A1128]">{lead.companyName}</div>
                    <div className="text-slate-500 text-[11px]">{lead.serviceTitle}</div>
                    <div className="text-slate-600 font-semibold">{lead.phone} • {lead.city}</div>

                    {lead.notes && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                        &quot;{lead.notes}&quot;
                      </p>
                    )}

                    {/* Quick stage transition selector */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStageChange(lead.id, e.target.value as LeadPipelineStatus)}
                        className="w-full text-[10px] font-bold p-1 rounded border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer"
                      >
                        {pipelineStages.map(s => (
                          <option key={s.id} value={s.id}>Aşama: {s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed rounded-xl border-slate-300">
                    Kayıt yok
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
