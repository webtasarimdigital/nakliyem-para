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
  const [showDemoData, setShowDemoData] = useState(false);
  const [carriers, setCarriers] = useState(showDemoData ? db.getCarriers() : db.getRealCarriers());
  const [documents, setDocuments] = useState(showDemoData ? db.getDocuments() : db.getRealDocuments());

  // Re-sync when showDemoData changes
  React.useEffect(() => {
    const carrs = showDemoData ? db.getCarriers() : db.getRealCarriers();
    const docs = showDemoData ? db.getDocuments() : db.getRealDocuments();
    setCarriers(carrs);
    setDocuments(docs);
    const pending = carrs.filter(c => c.verificationStatus === 'PENDING');
    setSelectedCarrier(pending[0] || carrs[0] || null);
  }, [showDemoData]);

  const pendingCarriers = carriers.filter(c => c.verificationStatus === 'PENDING');
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierProfile | null>(
    pendingCarriers[0] || carriers[0] || null
  );

  const [reviewNotes, setReviewNotes] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const carrierDocs = selectedCarrier ? documents.filter(d => d.carrierId === selectedCarrier.id) : [];

  const handleApproveDocument = (docId: string) => {
    db.updateDocumentStatus(docId, 'APPROVED');
    setDocuments(showDemoData ? db.getDocuments() : db.getRealDocuments());
  };

  const handleRejectDocument = (docId: string) => {
    db.updateDocumentStatus(docId, 'REJECTED', reviewNotes || 'Belge okunaklı değil veya geçersiz.');
    setDocuments(showDemoData ? db.getDocuments() : db.getRealDocuments());
  };

  const handleOverallApprove = () => {
    if (!selectedCarrier) return;
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

    const updatedCarriers = showDemoData ? db.getCarriers() : db.getRealCarriers();
    setCarriers(updatedCarriers);
    setDocuments(showDemoData ? db.getDocuments() : db.getRealDocuments());
    setSuccessNotice(`${selectedCarrier.companyName} başarıyla onaylandı ve doğrulanmış rozeti aktifleştirildi.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const handleOverallReject = () => {
    if (!selectedCarrier) return;
    db.updateCarrier(selectedCarrier.id, {
      verificationStatus: 'REJECTED'
    });

    const updatedCarriers = showDemoData ? db.getCarriers() : db.getRealCarriers();
    setCarriers(updatedCarriers);
    setSuccessNotice(`${selectedCarrier.companyName} başvurusu reddedildi.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#F95700] mb-0.5">Güvenlik & Uyum</p>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1128]">
            Firma Evrak Doğrulama Konsolu
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Vergi levhası ve kimlik belgelerini denetleyin, firmaları onaylayarak platforma kabul edin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDemoData(!showDemoData)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {showDemoData ? '🛡️ Yalnızca Gerçek Üyeleri Göster' : 'Demo Verileri Göster'}
          </button>
          <div className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl">
            Onay Bekleyen: <strong>{pendingCarriers.length} Firma</strong>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4" /> {successNotice}
        </div>
      )}

      {/* Split-Screen 3-Column Layout (Spec Item 167) */}
      {carriers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-base font-black text-[#0A1128] mb-1">
            İnceleme Bekleyen Belge Bulunmuyor
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Platforma yeni bir nakliye firması kayıt olduğunda ve vergi levhası veya kimlik belgesi yüklediğinde burada onayınıza sunulacaktır.
          </p>
          {!showDemoData && (
            <button
              onClick={() => setShowDemoData(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Örnek Demo Başvurularını İncele
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col (3/12): Carriers List */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit space-y-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Başvurular</h2>
            {carriers.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCarrier(c)}
                className={`p-3 rounded-xl cursor-pointer transition-all border text-xs ${
                  selectedCarrier?.id === c.id
                    ? 'border-[#146EF5] bg-blue-50/50 shadow-2xs font-bold text-[#0A1128]'
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
            {selectedCarrier && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-lg font-black text-[#0A1128]">{selectedCarrier.companyName}</h2>
                  <Badge variant={selectedCarrier.verificationStatus === 'APPROVED' ? 'verified' : 'pending'} size="md" />
                </div>
                <p className="text-xs text-slate-500">
                  Yetkili: {selectedCarrier.authorizedPersonName} {selectedCarrier.authorizedPersonSurname} • Tel: {selectedCarrier.phone}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider">Yüklenen Belgeler</h3>

              {carrierDocs.length > 0 ? (
                carrierDocs.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#146EF5]" />
                        <div>
                          <span className="text-xs font-bold text-[#0A1128] block">{doc.title}</span>
                          <span className="text-[11px] text-slate-400">{doc.fileName}</span>
                        </div>
                      </div>
                      <Badge variant={doc.status === 'APPROVED' ? 'verified' : doc.status === 'REJECTED' ? 'danger' : 'pending'} size="sm" />
                    </div>

                    {/* Document preview */}
                    {doc.fileUrl && doc.fileUrl.startsWith('data:image') ? (
                      <div className="bg-slate-100 rounded-xl p-2 border border-slate-200 flex justify-center">
                        <img src={doc.fileUrl} alt={doc.title} className="max-h-72 object-contain rounded-lg shadow-sm" />
                      </div>
                    ) : doc.fileUrl && doc.fileUrl.startsWith('data:application/pdf') ? (
                      <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-center font-bold text-xs flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span>PDF Belgesi: {doc.fileName}</span>
                        <a href={doc.fileUrl} download={doc.fileName} className="text-blue-600 underline ml-2">İndir & İncele</a>
                      </div>
                    ) : (
                      <div className="aspect-3/1 bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-center text-xs text-slate-500 font-medium">
                        📄 Belge: {doc.fileName} (Görüntülendi)
                      </div>
                    )}

                    {/* Individual Document Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => handleRejectDocument(doc.id)}
                        className="text-red-600 font-bold hover:underline cursor-pointer"
                      >
                        Reddet / Düzeltme İste
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveDocument(doc.id)}
                        className="text-xs cursor-pointer"
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
            <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider">Doğrulama Kararı</h3>

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
              ✓ Onaylandığında firmaya <strong>&apos;Firmanız doğrulandı. Teklif vermeye başlayabilirsiniz&apos;</strong> bildirimi gider.
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold cursor-pointer"
              onClick={handleOverallApprove}
              disabled={!selectedCarrier}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Firmayı Onayla & Yayınla
            </Button>

            <button
              type="button"
              onClick={handleOverallReject}
              disabled={!selectedCarrier}
              className="w-full py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            >
              Başvuruyu Reddet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
