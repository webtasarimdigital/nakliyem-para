/**
 * Email validation and fake/disposable email detection for TaşınTeklif
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'throwawaymail.com',
  'dispostable.com',
  'getairmail.com',
  'fakemailgenerator.com',
  'mohmal.com',
  'mohmal.im',
  'crazymailing.com',
  'armyspy.com',
  'cuvox.de',
  'dayrep.com',
  'fleckens.hu',
  'gustr.com',
  'jourrapide.com',
  'rhyta.com',
  'superrito.com',
  'teleworm.us',
  'einrot.com',
  'temp-mail.org',
  'temp-mail.ru',
  'dropmail.me',
  'nada.ltd',
  'inboxbear.com',
  'burnermail.io',
  'mytemp.email',
  'fakeinbox.com',
  'generator.email',
  'emailondeck.com',
  'minutemailbox.com',
  'tempail.com',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailin8r.com',
  'mailinator2.com',
  'notmailinator.com',
  'reallymymail.com',
  'reconmail.com',
  'safetymail.info',
  'sendspamhere.com',
  'sogetthis.com',
  'spambooger.com',
  'spamherelots.com',
  'spamhereplease.com',
  'spamthisplease.com',
  'streetwisemail.com',
  'suremail.info',
  'thisisnotmyrealemail.com',
  'tradermail.info',
  'veryrealemail.com',
  'zippymail.info',
  'test.com',
  'fake.com',
  'example.com',
  'sample.com',
]);

const OBVIOUS_FAKE_PATTERNS = [
  /^test@/i,
  /^asdf/i,
  /^qwer/i,
  /^1234/i,
  /^admin@test/i,
  /^deneme@deneme/i,
  /^a+@a+/i,
];

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateEmailAddress(email: string): EmailValidationResult {
  const clean = (email || '').trim().toLowerCase();

  if (!clean) {
    return { isValid: false, error: 'E-posta adresi boş bırakılamaz.' };
  }

  // Basic regex check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { isValid: false, error: 'Lütfen geçerli bir e-posta formatı giriniz (örn: adiniz@domain.com).' };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Geçersiz e-posta adresi formatı.' };
  }

  const [username, domain] = parts;

  // Username length check
  if (username.length < 2) {
    return { isValid: false, error: 'E-posta kullanıcı adı çok kısa.' };
  }

  // Check disposable email providers
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Geçici / tek kullanımlık e-posta adresleri kabul edilmemektedir. Lütfen gerçek ve aktif bir e-posta adresi giriniz.',
    };
  }

  // Check obvious fake patterns
  for (const pattern of OBVIOUS_FAKE_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        isValid: false,
        error: 'Lütfen geçerli bir kişisel veya kurumsal e-posta adresi giriniz.',
      };
    }
  }

  // Domain structure checks
  if (domain.split('.').some(segment => segment.length < 2)) {
    return { isValid: false, error: 'E-posta alan adı geçerli görünmüyor.' };
  }

  return { isValid: true };
}
