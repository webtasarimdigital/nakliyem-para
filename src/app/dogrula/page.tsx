'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '@/lib/data/mock-db';

function DogrulaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get('email') || '';
  const codeParam = searchParams?.get('code') || '';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUser = db.getCurrentUser();

  useEffect(() => {
    if (emailParam && codeParam && codeParam.length === 6) {
      handleVerify(codeParam);
    }
  }, [emailParam, codeParam]);

  const handleVerify = (inputCode: string) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Mark verified
      if (currentUser) {
        db.setCurrentUser({
          ...currentUser,
          emailVerified: true,
        });
      }
      localStorage.setItem(`verified_${email || currentUser?.email}`, 'true');
      setIsVerified(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center">
        
        {isVerified ? (
          <div className="space-y-5 animate-scale-up">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
                E-posta Adresiniz Doğrulandı! 🎉
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                Hesabınız başarıyla onaylandı. Artık platformun tüm özelliklerini sınırsız ve güvenle kullanabilirsiniz.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (currentUser?.role === 'CARRIER') {
                    router.push('/app/carrier');
                  } else {
                    router.push('/app/customer');
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#F95700] hover:bg-[#E04D00] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Yönetim Panelime Git</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 bg-blue-50 text-[#111E38] rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-[#F95700]" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#111E38] tracking-tight">
                Hesap Doğrulama
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                E-posta adresinize gönderdiğimiz 6 haneli doğrulama kodunu giriniz.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">E-posta Adresi</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ornek@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:border-[#F95700] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">6 Haneli Doğrulama Kodu</label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-base tracking-widest font-black text-center focus:border-[#F95700] focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => handleVerify(code)}
              disabled={loading || code.length < 6}
              className="w-full py-3.5 rounded-xl bg-[#111E38] hover:bg-[#1a2e56] disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Hesabı Onayla</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function DogrulaPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-bold text-slate-500">Yükleniyor...</div>}>
      <DogrulaContent />
    </Suspense>
  );
}
