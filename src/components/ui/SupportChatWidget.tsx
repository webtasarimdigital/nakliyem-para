'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCheck, 
  Minimize2, 
  Headphones,
  Loader2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { db } from '@/lib/data/mock-db';

interface FAQItem {
  id: string;
  category: 'MÜŞTERİ' | 'NAKLİYECİ' | 'GENEL';
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq_teklif_al',
    category: 'MÜŞTERİ',
    question: 'Nasıl fiyat teklifi alırım, süreç nasıl işler?',
    answer: 'TaşınTeklif\'te talep oluşturmak %100 ücretsizdir! "Teklif Al" butonuna tıklayarak oda sayısı, nereden nereye taşınacağınızı ve tercih ettiğiniz tarihi girin. Talebiniz bölgenizdeki onaylı nakliyecilere anında iletilir ve 15-30 dakika içinde teklifler gelmeye başlar. Gelen teklifleri fiyata, kullanıcı puanlarına ve dahil olan hizmetlere göre karşılaştırıp en uygun nakliyeciyi seçebilirsiniz.'
  },
  {
    id: 'faq_sigorta',
    category: 'GENEL',
    question: 'Taşınma sırasında eşyalarım sigortalı mı?',
    answer: 'Evet! Platformumuzdaki onaylı nakliyat firmaları eşya taşıma sigortası kapsamındadır. Talep oluştururken "Sigortalı Taşımacılık" opsiyonunu seçebilirsiniz. Nakliyecilerin teklif detaylarında sigorta poliçesi ve teminat kapsamını inceleyebilirsiniz.'
  },
  {
    id: 'faq_komisyon',
    category: 'MÜŞTERİ',
    question: 'TaşınTeklif müşterilerden komisyon veya ek ücret alıyor mu?',
    answer: 'Kesinlikle hayır! TaşınTeklif müşterilerden hiçbir komisyon veya aracılık ücreti almaz. Yalnızca seçtiğiniz nakliyat firmasıyla doğrudan anlaştığınız teklif tutarını ödersiniz; gizli hiçbir maliyet yoktur.'
  },
  {
    id: 'faq_nakliyeci_kayit',
    category: 'NAKLİYECİ',
    question: 'Nakliyeciyim, sisteme nasıl kayıt olup iş alabilirim?',
    answer: 'Kayıt Ol sayfasından "Nakliyeci Kaydı"nı seçerek firma adınız, yetki belgeniz (K3 vb.) ve iletişim bilgilerinizle anında kaydolabilirsiniz. İlk 7 gün ücretsiz deneyebilir, "İş Havuzu"ndaki tüm güncel ev ve ofis taşıma taleplerine anında teklif vererek yeni müşteriler kazanabilirsiniz.'
  },
  {
    id: 'faq_ilan_duzenle',
    category: 'MÜŞTERİ',
    question: 'Verdiğim ilanı nasıl günceller veya iptal edebilirim?',
    answer: 'Müşteri panelinizde "Taleplerim" sayfasına giderek oluşturduğunuz ilanların detaylarını görüntüleyebilirsiniz. Tarih, kat veya eşya notlarınızı dilediğiniz zaman güncelleyebilir veya ilanı tek tıkla yayından kaldırabilirsiniz.'
  },
  {
    id: 'faq_odeme',
    category: 'GENEL',
    question: 'Ödemeyi ne zaman ve kime yapacağım?',
    answer: 'Ödemeyi TaşınTeklif\'e değil, doğrudan anlaştığınız nakliye firmasına taşıma günü yaparsınız. Firmalar genellikle nakit, havale/EFT veya POS cihazı ile ödeme kabul etmektedir. Platformumuz üzerinden ön ödeme yapmanız gerekmez.'
  },
  {
    id: 'faq_guvenlik',
    category: 'GENEL',
    question: 'Nakliyecilerin güvenilir olduğunu nasıl anlarım?',
    answer: 'Platformumuzdaki tüm nakliye firmaları vergi levhası, Ulaştırma Bakanlığı yetki belgeleri ve kimlik doğrulamasından geçirilir. Ayrıca diğer müşterilerin verdikleri gerçek puanları ve yorumları inceleyerek güvenle karar verebilirsiniz.'
  }
];

export const openSupportChat = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-support-chat'));
  }
};

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'FAQ' | 'EMAIL'>('FAQ');
  const [selectedCategory, setSelectedCategory] = useState<'TÜMÜ' | 'MÜŞTERİ' | 'NAKLİYECİ' | 'GENEL'>('TÜMÜ');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq_teklif_al');
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'yes' | 'no'>>({});

  // Email Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize from currentUser and localStorage
  useEffect(() => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setName(currentUser.fullName || (currentUser as any).name || currentUser.companyName || '');
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
    } else {
      const savedName = localStorage.getItem('tasinteklif_support_name');
      const savedEmail = localStorage.getItem('tasinteklif_support_email');
      const savedPhone = localStorage.getItem('tasinteklif_support_phone');
      if (savedName) setName(savedName);
      if (savedEmail) setEmail(savedEmail);
      if (savedPhone) setPhone(savedPhone);
    }

    // Global open event listener
    const handleOpen = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };
    window.addEventListener('open-support-chat', handleOpen);
    return () => window.removeEventListener('open-support-chat', handleOpen);
  }, []);

  const handleHelpfulFeedback = (id: string) => {
    setHelpfulFeedback(prev => ({ ...prev, [id]: 'yes' }));
  };

  const handleNotHelpful = (questionText: string) => {
    setHelpfulFeedback(prev => ({ ...prev, [questionText]: 'no' }));
    setSubject(`Soru: ${questionText}`);
    setMessage(`"${questionText}" konusunda daha fazla bilgi almak istiyorum.\n\n`);
    setActiveTab('EMAIL');
    setSendSuccess(false);
    setErrorMessage('');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim();
    const cleanMessage = message.trim();
    const cleanName = name.trim() || 'Ziyaretçi';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Lütfen geçerli bir e-posta adresi girin.');
      return;
    }

    if (!cleanMessage) {
      setErrorMessage('Lütfen iletmek istediğiniz sorunuzu veya mesajınızı yazın.');
      return;
    }

    setIsSending(true);

    try {
      // Save contact details for next time
      localStorage.setItem('tasinteklif_support_name', cleanName);
      localStorage.setItem('tasinteklif_support_email', cleanEmail);
      if (phone) localStorage.setItem('tasinteklif_support_phone', phone.trim());

      const payload = {
        name: cleanName,
        email: cleanEmail,
        phone: phone.trim(),
        subject: subject.trim() || `🔔 Destek Talebi: ${cleanName}`,
        message: cleanMessage,
      };

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Mesaj iletilemedi, lütfen daha sonra tekrar deneyin.');
      }

      setSendSuccess(true);
      setMessage('');
    } catch (err: any) {
      console.error('Support email send error:', err);
      setErrorMessage(err?.message || 'Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setIsSending(false);
    }
  };

  const filteredFaqs = selectedCategory === 'TÜMÜ' 
    ? FAQS 
    : FAQS.filter(f => f.category === selectedCategory);

  return (
    <>
      {/* ── 1. FLOATING BUTTON: ONLY VISIBLE ON DESKTOP (HIDDEN ON MOBILE PER USER REQUEST) ── */}
      {(!isOpen || isMinimized) && (
        <div className="hidden md:block fixed bottom-6 right-6 z-50 animate-bounce-short">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#111E38] hover:bg-[#1a2e56] text-white shadow-2xl hover:shadow-orange-500/20 border-2 border-[#F95700] transition-all transform hover:scale-105 group cursor-pointer"
            aria-label="Bize Ulaşın / Canlı Destek & SSS"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#111E38] animate-pulse" />
              <Headphones className="w-5 h-5 text-[#F95700] group-hover:rotate-12 transition-transform" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block leading-tight text-white">Bize Ulaşın</span>
              <span className="text-[10px] text-emerald-400 font-medium block leading-none">Canlı Destek & SSS</span>
            </div>
          </button>
        </div>
      )}

      {/* ── 2. SUPPORT & FAQ MODAL (DESKTOP FLOATING / MOBILE SLIDE-OVER) ──────────── */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'hidden'
              : 'inset-x-3 bottom-16 sm:bottom-6 sm:inset-x-auto sm:right-6 sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scale-up">
            
            {/* Header */}
            <div className="bg-[#111E38] text-white p-4 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-[#F95700] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#111E38]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5 leading-tight">
                    TaşınTeklif Destek
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    Çevrimiçi · Otomatik Yanıt & E-posta Destek
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Küçült"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                  title="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs: Soru-Cevap vs E-posta ile Sor */}
            <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('FAQ');
                  setSendSuccess(false);
                }}
                className={`flex-1 py-2.5 text-xs font-black border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'FAQ'
                    ? 'border-[#F95700] text-[#F95700] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Otomatik Soru-Cevap
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('EMAIL')}
                className={`flex-1 py-2.5 text-xs font-black border-b-2 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'EMAIL'
                    ? 'border-[#F95700] text-[#F95700] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                E-posta ile Bize Yazın
              </button>
            </div>

            {/* ── TAB 1: FAQ / AUTOMATED ANSWERS ── */}
            {activeTab === 'FAQ' && (
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 space-y-3">
                {/* Intro Banner */}
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111E38] leading-snug">
                        Sıkça Sorulan Sorular
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                        Yanıt almak istediğiniz soruyu seçin. Yeterli bulmazsanız sorunuzu doğrudan bize e-posta ile iletebilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {(['TÜMÜ', 'MÜŞTERİ', 'NAKLİYECİ', 'GENEL'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#111E38] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'TÜMÜ' ? 'Tümü' : cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-2">
                  {filteredFaqs.map(faq => {
                    const isExpanded = expandedFaqId === faq.id;
                    const feedback = helpfulFeedback[faq.id];

                    return (
                      <div
                        key={faq.id}
                        className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 uppercase ${
                              faq.category === 'MÜŞTERİ'
                                ? 'bg-orange-100 text-[#F95700]'
                                : faq.category === 'NAKLİYECİ'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {faq.category}
                            </span>
                            <span className="text-xs font-bold text-slate-800 leading-snug">
                              {faq.question}
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                            <p className="whitespace-pre-wrap font-medium text-slate-700">
                              {faq.answer}
                            </p>

                            {/* "Yeterli bulmazsa maille sorsun" feedback card */}
                            <div className="mt-3 p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 flex flex-col gap-2">
                              <span className="text-[11px] font-bold text-orange-950">
                                Bu cevap sorunuz için yeterli oldu mu?
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleHelpfulFeedback(faq.id)}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                    feedback === 'yes'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <CheckCheck className="w-3.5 h-3.5" />
                                  {feedback === 'yes' ? 'Evet, Teşekkürler!' : 'Evet, Yeterli'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleNotHelpful(faq.question)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#F95700] hover:bg-[#E04D00] text-white transition-all shadow-xs cursor-pointer"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Yeterli Değil, Mail ile Sor
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CTA to Email */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2 mt-4 shadow-2xs">
                  <div className="text-xs font-black text-[#111E38]">
                    Farklı bir konuda yardıma mı ihtiyacınız var?
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Bize mesajınızı e-posta ile iletin, ekibimiz en kısa sürede size dönüş yapsın.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubject('');
                      setMessage('');
                      setActiveTab('EMAIL');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#111E38] hover:bg-[#1a2e56] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Mail className="w-4 h-4 text-[#F95700]" />
                    <span>Bize E-posta Gönder</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: EMAIL INQUIRY FORM ── */}
            {activeTab === 'EMAIL' && (
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/60 flex flex-col justify-between">
                {sendSuccess ? (
                  <div className="my-auto text-center p-6 space-y-3 bg-white rounded-2xl border border-emerald-200 shadow-sm animate-fade-in">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-black text-[#111E38]">
                      Sorunuz Başarıyla İletildi! 🎉
                    </h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Mesajınız yetkili destek ekibimize ulaştı. Belirttiğiniz <strong className="text-slate-900">{email}</strong> adresine en kısa sürede detaylı yanıt verilecektir.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSendSuccess(false);
                          setActiveTab('FAQ');
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Soru-Cevap&apos;a Dön
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[#F95700] hover:bg-[#e04d00] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Kapat
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendEmail} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                    <div>
                      <h4 className="text-xs font-black text-[#111E38] flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-[#F95700]" />
                        Bize E-posta ile Sorun
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Sorunuz doğrudan yetkili ekibimizin gelen kutusuna düşer.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Adınız Soyadınız
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Örn: Ahmet Yılmaz"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                          />
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          E-posta Adresiniz *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ornek@domain.com"
                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                          />
                          <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Telefon Numaranız <span className="text-slate-400 font-normal">(Opsiyonel)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05XX XXX XX XX"
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Konu
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Örn: Teklif Detayları Hakkında Soru"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Sorunuz veya Mesajınız *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Sorunuzu detaylı bir şekilde buraya yazın..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-[#F95700] focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F95700] hover:bg-[#E04D00] disabled:bg-slate-300 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>E-postayı Gönder</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
