'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { db } from '@/lib/data/mock-db';
import { ShieldCheck, Truck, UserCheck, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface IntentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'CUSTOMER' | 'CARRIER';
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
}

export const IntentAuthModal: React.FC<IntentAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'CUSTOMER',
  title,
  subtitle,
  onSuccess
}) => {
  const router = useRouter();
  const [tab, setTab] = useState<'REGISTER' | 'LOGIN'>('REGISTER');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Create user session
      if (targetRole === 'CUSTOMER') {
        db.setCurrentUser({
          id: `user_cust_${Date.now()}`,
          email: `${phone.replace(/\s/g, '')}@musteri.com`,
          phone: phone || '0535 000 00 00',
          role: 'CUSTOMER',
          customerProfileId: `cust_${Date.now()}`,
          createdAt: new Date().toISOString()
        });
      } else {
        db.setCurrentUser({
          id: `user_carr_${Date.now()}`,
          email: `${phone.replace(/\s/g, '')}@nakliyeci.com`,
          phone: phone || '0532 000 00 00',
          role: 'CARRIER',
          carrierProfileId: 'carr_bogazici',
          createdAt: new Date().toISOString()
        });
      }

      setIsLoading(false);
      onClose();
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    }, 600);
  };

  const defaultTitle = targetRole === 'CUSTOMER' 
    ? 'Teklifleri Alabilmek İçin Hesabınızı Oluşturun'
    : 'Bu Özellik Nakliyat Firmalarına Özeldir';

  const defaultSubtitle = targetRole === 'CUSTOMER'
    ? 'Talebinizi yayınlamak, nakliyecilerden gelen ücretsiz teklifleri karşılaştırmak ve doğrudan görüşmek için hesabınızı oluşturun.'
    : 'Taşıma taleplerine teklif vermek, yeni iş bildirimleri almak ve Nakliyeci Defteri\'ni kullanmak için firma hesabı oluşturun.';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      subtitle={subtitle || defaultSubtitle}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Value props badge */}
        <div className="p-3.5 rounded-xl bg-[#EAF3FF] border border-blue-100 flex items-start gap-3">
          {targetRole === 'CUSTOMER' ? (
            <ShieldCheck className="w-5 h-5 text-[#146EF5] shrink-0 mt-0.5" />
          ) : (
            <Truck className="w-5 h-5 text-[#146EF5] shrink-0 mt-0.5" />
          )}
          <div className="text-xs text-slate-700 space-y-1">
            {targetRole === 'CUSTOMER' ? (
              <>
                <p className="font-semibold text-[#0B3B8F]">Müşteri Avantajları:</p>
                <p>✓ Ücretsiz nakliyat teklifleri alın ve karşılaştırın</p>
                <p>✓ Onaylı ve belgeli nakliyecilerle güvenle mesajlaşın</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-[#0B3B8F]">Nakliyeci Avantajları:</p>
                <p>✓ Günlük 100+ yeni ev ve ofis taşıma işine ulaşın</p>
                <p>✓ 7 gün ücretsiz deneyin, boş dönüşlerinizi paraya çevirin</p>
              </>
            )}
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setTab('REGISTER')}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 text-center transition-colors ${
              tab === 'REGISTER'
                ? 'border-[#146EF5] text-[#146EF5]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Hızlı Üye Ol
          </button>
          <button
            type="button"
            onClick={() => setTab('LOGIN')}
            className={`flex-1 py-2 text-sm font-semibold border-b-2 text-center transition-colors ${
              tab === 'LOGIN'
                ? 'border-[#146EF5] text-[#146EF5]'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Giriş Yap
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'REGISTER' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {targetRole === 'CUSTOMER' ? 'Adınız ve Soyadınız' : 'Firma Yetkilisi Adı'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={targetRole === 'CUSTOMER' ? 'Örn: Ahmet Yılmaz' : 'Örn: Murat Kaya'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cep Telefonu Numaranız</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#146EF5]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {tab === 'REGISTER' 
              ? (targetRole === 'CUSTOMER' ? 'Talebi Yayınla & Ücretsiz Üye Ol' : 'Nakliyeci Olarak Kaydol')
              : 'Giriş Yap ve Devam Et'
            }
          </Button>

          <p className="text-[11px] text-slate-400 text-center">
            Devam ederek{' '}
            <a
              href="/kullanim-kosullari"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 font-medium"
            >
              Kullanım Koşulları
            </a>{' '}
            ve{' '}
            <a
              href="/kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-600 font-medium"
            >
              KVKK Aydınlatma Metni
            </a>
            &apos;ni kabul etmiş olursunuz.
          </p>
        </form>
      </div>
    </Modal>
  );
};
