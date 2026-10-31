'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Send, CheckCircle2, AlertCircle, Mail, Phone, Loader2 } from 'lucide-react';

interface AppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  initialPhone?: string;
  initialName?: string;
}

export const AppealModal: React.FC<AppealModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
  initialPhone = '',
  initialName = ''
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Sync state if initial props change
  React.useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialPhone) setPhone(initialPhone);
    if (initialName) setName(initialName);
  }, [initialEmail, initialPhone, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Lütfen itiraz gerekçenizi açıklayınız.');
      return;
    }
    if (!email && !phone) {
      setError('Lütfen size ulaşabileceğimiz bir e-posta veya telefon numarası giriniz.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Yasaklı Hesap İtirazcısı',
          email: email.trim(),
          phone: phone.trim(),
          subject: `⚠️ [YASAKLAMA İTİRAZI] ${name || 'Üye'} (${phone || email})`,
          message: `TaşınTeklif — Hesap Askıya Alma / Yasaklama İtirazı\n\nAd Soyad: ${name || 'Belirtilmedi'}\nTelefon: ${phone || 'Belirtilmedi'}\nE-posta: ${email || 'Belirtilmedi'}\n\nİtiraz Gerekçesi ve Açıklama:\n${reason.trim()}\n\n---\nBu bildirim kullanıcı tarafından sistem üzerindeki 'Yasaklamaya İtiraz Et' butonu ile gönderilmiştir.`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        // Fallback: mailto
        window.location.href = `mailto:bilgi@tasinteklif.com?subject=Yasaklama%20İtirazı&body=${encodeURIComponent(
          `Ad Soyad: ${name}\nTelefon: ${phone}\nE-posta: ${email}\n\nİtiraz Gerekçesi:\n${reason}`
        )}`;
        setSubmitted(true);
      }
    } catch {
      // Fallback to mailto
      window.location.href = `mailto:bilgi@tasinteklif.com?subject=Yasaklama%20İtirazı&body=${encodeURIComponent(
        `Ad Soyad: ${name}\nTelefon: ${phone}\nE-posta: ${email}\n\nİtiraz Gerekçesi:\n${reason}`
      )}`;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hesap Askıya Alma İtirazı"
      maxWidth="md"
    >
      {submitted ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#0A1128]">
              İtirazınız Başarıyla İletildi
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-2 max-w-sm mx-auto leading-relaxed">
              İtiraz başvurunuz sistem yöneticilerimize ulaştı. Güvenlik ve moderasyon ekibimiz hesabınızı inceleyerek en kısa sürede tarafınıza dönüş yapacaktır.
            </p>
          </div>
          <div className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-full"
            >
              Kapat
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed font-medium">
              Hesabınız sistem kuralları veya güvenlik protokolleri gereği askıya alınmıştır. Haksız olduğunu düşünüyorsanız lütfen gerekçenizi belirtin.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ad Soyad / Firma Ünvanı
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adınız Soyadınız veya Firma Adınız"
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefon Numaranız
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="05XX XXX XX XX"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-posta Adresiniz
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              İtiraz Gerekçeniz & Açıklamanız <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Hesabınızın neden yeniden aktif edilmesi gerektiğini ve durumla ilgili detayları yazınız..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 font-medium focus:border-[#F95700] focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> bilgi@tasinteklif.com
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> 0850 308 34 26
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-1/3"
            >
              Vazgeç
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              className="w-2/3 bg-[#F95700] hover:bg-[#E04D00] text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1.5" />
                  İtirazımı Gönder
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
