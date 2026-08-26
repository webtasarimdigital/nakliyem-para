'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Truck, 
  Phone, 
  MapPin,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { db } from '@/lib/data/mock-db';
import { CarrierDocument, CarrierProfile } from '@/types';

export default function AdminVerificationConsolePage() {
  const [carriers, setCarriers] = useState(db.getCarriers());
  const [documents, setDocuments] = useState(db.getDocuments());

  const pendingCarriers = carriers.filter(c => c.verificationStatus === 'PENDING');
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierProfile>(
    pendingCarriers[0] || carriers[0]
  );

  const [reviewNotes, setReviewNotes] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const carrierDocs = documents.filter(d => d.carrierId === selectedCarrier.id);

  const handleApproveDocument = (docId: string) => {
    db.updateDocumentStatus(docId, 'APPROVED');
    setDocuments(db.getDocuments());
  };

  const handleRejectDocument = (docId: string) => {
    db.updateDocumentStatus(docId, 'REJECTED', reviewNotes || 'Belge okunaklı değil veya geçersiz.');
    setDocuments(db.getDocuments());
  };

  const handleOverallApprove = () => {
    db.updateCarrier(selectedCarrier.id, {
      verificationStatus: 'APPROVED',
      verificationBadges: {
        identityVerified: true,
        taxVerified: true,
        transportPermitVerified: true,
        elevatorVerified: !!selectedCarrier.elevatorSpec?.hasElevator
      }
    });

    // Update all carrier docs to approved
    carrierDocs.forEach(d => db.updateDocumentStatus(d.id, 'APPROVED'));

    setCarriers(db.getCarriers());
    setDocuments(db.getDocuments());
    setSuccessNotice(`${selectedCarrier.companyName} başarıyla onaylandı ve 7 günlük ücretsiz denemesi aktifleştirildi.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-1">
            <ArrowLeft className="w-4 h-4" /> Admin Paneline Dön
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            Firma Doğrulama Konsolu
          </h1>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Onay Bekleyen: <strong className="text-amber-600">{pendingCarriers.length} Firma</strong>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold mb-6 flex items-center gap-2">
          <Check className="w-4 h-4" /> {successNotice}
        </div>
      )}

      {/* Split-Screen 3-Column Layout (Spec Item 167) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (3/12): Carriers List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit space-y-2">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Başvurular</h2>
          {carriers.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCarrier(c)}
              className={`p-3 rounded-xl cursor-pointer transition-all border text-xs ${
                selectedCarrier.id === c.id
                  ? 'border-[#146EF5] bg-blue-50/50 shadow-2xs font-bold text-slate-900'
                  : 'border-slate-100 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="truncate max-w-[140px]">{c.companyName}</span>
                <Badge variant={c.verificationStatus === 'APPROVED' ? 'verified' : 'pending'} size="sm" />
              </div>
              <span className="text-[11px] text-slate-400 font-normal">{c.city} • {c.phone}</span>
            </div>
          ))}
        </div>

        {/* Middle Col (6/12): Document Preview & Details */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-lg font-black text-slate-900">{selectedCarrier.companyName}</h2>
              <Badge variant={selectedCarrier.verificationStatus === 'APPROVED' ? 'verified' : 'pending'} size="md" />
            </div>
            <p className="text-xs text-slate-500">
              Yetkili: {selectedCarrier.authorizedPersonName} {selectedCarrier.authorizedPersonSurname} • Tel: {selectedCarrier.phone}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Yüklenen Belgeler</h3>

            {carrierDocs.length > 0 ? (
              carrierDocs.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#146EF5]" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{doc.title}</span>
                        <span className="text-[11px] text-slate-400">{doc.fileName}</span>
                      </div>
                    </div>
                    <Badge variant={doc.status === 'APPROVED' ? 'verified' : doc.status === 'REJECTED' ? 'danger' : 'pending'} size="sm" />
                  </div>

                  {/* Document preview mockup */}
                  <div className="aspect-3/1 bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-center text-xs text-slate-500 font-medium">
                    📄 Belge Önizleme: {doc.fileName} (Görüntülendi)
                  </div>

                  {/* Individual Document Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => handleRejectDocument(doc.id)}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Reddet / Düzeltme İste
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApproveDocument(doc.id)}
                      className="text-xs"
                    >
                      Belgeyi Onayla
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 border border-dashed rounded-xl">
                Bu firma henüz belge yüklememiş.
              </div>
            )}
          </div>
        </div>

        {/* Right Col (3/12): Final Decision & Action */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs h-fit space-y-4 text-xs">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Doğrulama Kararı</h3>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Yönetici Notu (Gerekirse)</label>
            <textarea
              rows={3}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Firmaya iletilecek inceleme notu veya revizyon talebi..."
              className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50 text-[#0B3B8F] text-[11px] leading-relaxed">
            ✓ Onaylandığında firmaya <strong>&apos;Firmanız doğrulandı. 7 günlük ücretsiz denemenizi başlatabilirsiniz&apos;</strong> bildirimi gider.
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold"
            onClick={handleOverallApprove}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Firmayı Onayla & Yayınla
          </Button>
        </div>
      </div>
    </div>
  );
}
