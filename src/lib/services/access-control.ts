import { User, CarrierProfile, UserRole } from '@/types';
import { db } from '../data/mock-db';
import { checkEntitlement, FeatureKey } from './entitlements';

export type AccessCheckResult = 
  | { allowed: true }
  | { 
      allowed: false; 
      code: 'AUTH_REQUIRED' | 'ROLE_REQUIRED' | 'VERIFICATION_REQUIRED' | 'SUBSCRIPTION_REQUIRED' | 'FEATURE_REQUIRED' | 'PERMISSION_DENIED';
      title: string;
      message: string;
      ctaText: string;
      ctaAction: string;
    };

export function checkAccess(options: {
  requiredRole?: UserRole;
  requireCarrierApproved?: boolean;
  requiredFeature?: FeatureKey;
  targetUser?: User | null;
}): AccessCheckResult {
  const user = options.targetUser !== undefined ? options.targetUser : db.getCurrentUser();

  // 1. Auth check
  if (!user) {
    return {
      allowed: false,
      code: 'AUTH_REQUIRED',
      title: 'Bu işlem için üye olmalısınız',
      message: 'Taşıma teklifi vermek, mesajlaşmak veya detayları görüntülemek için ücretsiz hesabınızı oluşturun.',
      ctaText: 'Giriş Yap / Üye Ol',
      ctaAction: '/giris'
    };
  }

  // 2. Role check
  if (options.requiredRole && user.role !== options.requiredRole && user.role !== 'SUPER_ADMIN') {
    if (options.requiredRole === 'CARRIER') {
      return {
        allowed: false,
        code: 'ROLE_REQUIRED',
        title: 'Bu özellik nakliyecilere özeldir',
        message: 'Taşıma taleplerine teklif vermek ve Nakliyeci Defteri\'ni kullanmak için firma hesabı oluşturmanız gerekmektedir.',
        ctaText: 'Nakliyeci Hesabı Aç',
        ctaAction: '/kayit/nakliyeci'
      };
    }
    return {
      allowed: false,
      code: 'ROLE_REQUIRED',
      title: 'Yetkisiz Erişim',
      message: 'Bu sayfayı görüntülemek için uygun hesap yetkiniz bulunmamaktadır.',
      ctaText: 'Ana Sayfaya Dön',
      ctaAction: '/'
    };
  }

  // 3. Carrier verification check
  if (user.role === 'CARRIER' && options.requireCarrierApproved) {
    const carrier = user.carrierProfileId ? db.getCarrierById(user.carrierProfileId) : undefined;
    if (!carrier || carrier.verificationStatus !== 'APPROVED') {
      return {
        allowed: false,
        code: 'VERIFICATION_REQUIRED',
        title: 'Firmanız Henüz Doğrulanmadı',
        message: 'Teklif vermek ve iletişim bilgilerini görüntülemek için kimlik ve vergi levhanızın onaylanması gerekmektedir.',
        ctaText: 'Doğrulama Durumunu Gör',
        ctaAction: '/app/carrier/onay-bekleniyor'
      };
    }
  }

  // 4. Feature entitlement check
  if (user.role === 'CARRIER' && options.requiredFeature && user.carrierProfileId) {
    const carrier = db.getCarrierById(user.carrierProfileId);
    if (carrier) {
      const hasEntitlement = checkEntitlement(carrier.planId, options.requiredFeature);
      if (!hasEntitlement.hasAccess) {
        return {
          allowed: false,
          code: 'FEATURE_REQUIRED',
          title: 'Paketinizi Yükseltin',
          message: hasEntitlement.reason || 'Bu özelliği kullanmak için mevcut üyeliğinizi yükseltmeniz gerekmektedir.',
          ctaText: 'Paketleri İncele',
          ctaAction: '/paketler'
        };
      }
    }
  }

  return { allowed: true };
}
