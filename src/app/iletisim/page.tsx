'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Headphones, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';
import { openSupportChat } from '@/components/ui/SupportChatWidget';

export default function IletisimPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Genel Destek');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || (!email.trim() && !phone.trim())) {
      setErrorMessage('Lütfen iletişim bilginizi ve mesajınızı eksiksiz girin.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'Ziyaretçi',
          email: email.trim(),
          phone: phone.trim(),
          subject: `🔔 İletişim Formu: ${subject} — ${name.trim() || 'Ziyaretçi'}`,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Mesaj gönderilemedi.');
      }
    } catch {
      setErrorMessage('Bağlantı hatası oluştu. Lütfen canlı sohbet widget’ını kullanın veya doğrudan e-posta gönderin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#F95700] text-xs font-black">
            <Headphones className="w-3.5 h-3.5" />
            <span>TaşınTeklif Destek Merkezi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111E38] tracking-tight">
            Bizimle İletişime Geçin
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Sorularınız, iş birliği talepleriniz veya yardım almak istediğiniz her konuda buradayız. 
            Canlı destek üzerinden yazabilir veya formu doldurabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Contact Information & Live Chat Trigger (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Chat Banner */}
            <div className="bg-[#111E38] rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F95700] text-white flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Canlı Destek</h3>
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Çevrimiçi · Anında Yanıt
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Ekibimizle hemen canlı sohbet başlatarak soru ve taleplerinizi iletebilirsiniz. Mesajlarınız doğrudan destek ekibimize düşer.
              </p>

              <button
                type="button"
                onClick={() => openSupportChat()}
                className="w-full py-3 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-black text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Headphones className="w-4 h-4" />
                <span>Canlı Sohbeti Başlat</span>
              </button>
            </div>

            {/* Direct Contact Cards */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">İletişim Bilgilerimiz</h4>
              
              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F95700] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">E-posta Destek</span>
                  <a href="mailto:tasinteklif@gmail.com" className="hover:text-[#F95700] transition-colors">
                    tasinteklif@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Çalışma Saatleri</span>
                  <span>7/24 Online Destek &amp; Talep Takibi</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Hızlı Dönüş Garantisi</span>
                  <span>Tüm mesajlar en geç 30 dakika içinde yanıtlanır</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#111E38]">Mesajınız Başarıyla İletildi!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Mesajınız destek ekibimize ve <strong>tasinteklif@gmail.com</strong> adresine ulaştırıldı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#111E38] text-white font-bold text-xs hover:bg-[#1a2e56] transition-colors"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-[#111E38]">Bize Mesaj Gönderin</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Mesajınız anında yönetici e-posta kutumuza iletilecektir.</p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Adınız Soyadınız</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresiniz *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Numaranız</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Konu</label>
                    <select
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:border-[#F95700] focus:outline-none"
                    >
                      <option value="Genel Destek">Genel Destek</option>
                      <option value="Nakliyat Talebi Hakkında">Nakliyat Talebi Hakkında</option>
                      <option value="Nakliyeci Üyeliği / Onay">Nakliyeci Üyeliği / Onay</option>
                      <option value="Ödeme / Abonelik">Ödeme / Abonelik</option>
                      <option value="Şikayet &amp; Öneri">Şikayet &amp; Öneri</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mesajınız *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Nasıl yardımcı olabiliriz? Detayları buraya yazabilirsiniz..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#F95700] hover:bg-[#E04D00] disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Mesajı Gönder</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
