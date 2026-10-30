import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const DATA_DIR = path.join(process.cwd(), '.data');
const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const SECRET_FILE = path.join(DATA_DIR, 'admin-secret.key');

export interface AdminCredentials {
  username: string;
  passwordHash: string;
  salt: string;
  passwordVersion: number;
  updatedAt: string;
}

// In-memory cache for credentials and session signing key
let cachedCredentials: AdminCredentials | null = null;
let cachedHmacSecret: string | null = null;

// Rate limiting cache: IP -> { failedAttempts: number, lockedUntil: number, lastAttempt: number }
interface RateLimitEntry {
  failedAttempts: number;
  lockedUntil: number;
  lastAttempt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 dakika

function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {}
}

/**
 * Gets or creates the HMAC signing secret for admin sessions.
 */
function getHmacSecret(): string {
  if (cachedHmacSecret) return cachedHmacSecret;

  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32) {
    cachedHmacSecret = process.env.ADMIN_SESSION_SECRET;
    return cachedHmacSecret;
  }

  ensureDataDir();
  try {
    if (fs.existsSync(SECRET_FILE)) {
      const secret = fs.readFileSync(SECRET_FILE, 'utf8').trim();
      if (secret.length >= 32) {
        cachedHmacSecret = secret;
        return cachedHmacSecret;
      }
    }
  } catch {}

  // Generate cryptographically secure 64-byte random key
  const newSecret = crypto.randomBytes(64).toString('hex');
  try {
    fs.writeFileSync(SECRET_FILE, newSecret, 'utf8');
  } catch {}
  cachedHmacSecret = newSecret;
  return cachedHmacSecret;
}

/**
 * Hash a password using scrypt (memory-hard, GPU-resistant).
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(32).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt,
  };
}

/**
 * Constant-time password verification to prevent timing attacks.
 */
export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(derivedKey, storedBuf);
  } catch {
    return false;
  }
}

/**
 * Constant-time comparison for plain strings (e.g. initial environment fallback).
 */
function safeEqualString(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Loads admin credentials from memory, filesystem, or Firestore.
 */
export async function getAdminCredentials(): Promise<AdminCredentials | null> {
  if (cachedCredentials) return cachedCredentials;

  // 1. Check local filesystem (.data/admin-auth.json)
  ensureDataDir();
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const raw = fs.readFileSync(AUTH_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.passwordHash && parsed.salt) {
        cachedCredentials = parsed;
        return cachedCredentials;
      }
    }
  } catch {}

  // 2. Check Firestore (if configured)
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      const snap = await getDoc(doc(firestoreDb, 'system_config', 'admin_auth'));
      if (snap.exists()) {
        const data = snap.data() as AdminCredentials;
        if (data.passwordHash && data.salt) {
          cachedCredentials = data;
          try {
            fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), 'utf8');
          } catch {}
          return cachedCredentials;
        }
      }
    } catch (fsErr) {
      console.warn('[Admin Auth] Firestore read warning:', fsErr);
    }
  }

  return null;
}

/**
 * Validates admin username and password.
 * Checks against custom stored credentials, or falls back to environment variable.
 */
export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const validUser = (process.env.ADMIN_USERNAME || 'admin').trim();
  if (username.toLowerCase() !== validUser.toLowerCase()) {
    return false;
  }

  const stored = await getAdminCredentials();
  if (stored) {
    return verifyPassword(password, stored.passwordHash, stored.salt);
  }

  // Fallback to initial environment variable (default: 1967) with constant-time check
  const envPass = (process.env.ADMIN_PASSWORD || '1967').trim();
  return safeEqualString(password, envPass);
}

/**
 * Updates the admin password, stores the salted scrypt hash, and increments passwordVersion.
 */
export async function updateAdminPassword(newPassword: string): Promise<AdminCredentials> {
  const current = await getAdminCredentials();
  const username = current?.username || (process.env.ADMIN_USERNAME || 'admin').trim();
  const newVersion = (current?.passwordVersion || 1) + 1;

  const { hash, salt } = hashPassword(newPassword);
  const updated: AdminCredentials = {
    username,
    passwordHash: hash,
    salt,
    passwordVersion: newVersion,
    updatedAt: new Date().toISOString(),
  };

  cachedCredentials = updated;

  // 1. Save to local filesystem
  ensureDataDir();
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(updated, null, 2), 'utf8');
  } catch (fsErr) {
    console.warn('[Admin Auth] File write warning:', fsErr);
  }

  // 2. Sync to Firestore (if configured)
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'system_config', 'admin_auth'), updated);
    } catch (fsErr) {
      console.warn('[Admin Auth] Firestore sync warning:', fsErr);
    }
  }

  return updated;
}

/**
 * Generates an HMAC-SHA256 signed session token.
 */
export async function createAdminSessionToken(username: string): Promise<string> {
  const creds = await getAdminCredentials();
  const passwordVersion = creds?.passwordVersion || 1;
  const now = Date.now();
  const exp = now + 24 * 60 * 60 * 1000; // 24 saat
  const jti = crypto.randomBytes(16).toString('hex');

  const payload = {
    u: username,
    exp,
    iat: now,
    pv: passwordVersion,
    jti,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const secret = getHmacSecret();
  const signature = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token.
 * Checks signature, expiration, and passwordVersion (invalidates old sessions if password changed).
 */
export async function verifyAdminSessionToken(token: string): Promise<{ valid: boolean; username?: string }> {
  if (!token || typeof token !== 'string') return { valid: false };

  const parts = token.split('.');
  if (parts.length !== 2) return { valid: false };

  const [payloadBase64, providedSig] = parts;

  // 1. Verify HMAC signature in constant time
  const secret = getHmacSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(payloadBase64).digest('base64url');

  try {
    const provBuf = Buffer.from(providedSig);
    const expBuf = Buffer.from(expectedSig);
    if (provBuf.length !== expBuf.length || !crypto.timingSafeEqual(provBuf, expBuf)) {
      return { valid: false };
    }
  } catch {
    return { valid: false };
  }

  // 2. Parse payload and check expiration
  try {
    const rawPayload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload = JSON.parse(rawPayload);

    if (!payload.u || !payload.exp || typeof payload.exp !== 'number') {
      return { valid: false };
    }

    if (Date.now() > payload.exp) {
      return { valid: false };
    }

    // 3. Verify passwordVersion (if password changed, session is invalid!)
    const creds = await getAdminCredentials();
    const currentVersion = creds?.passwordVersion || 1;
    if (payload.pv && payload.pv < currentVersion) {
      return { valid: false };
    }

    return { valid: true, username: payload.u };
  } catch {
    return { valid: false };
  }
}

/**
 * Rate limiting check to prevent brute-force attacks.
 */
export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS, resetInMs: LOCKOUT_DURATION_MS };
  }

  // Check if locked out
  if (entry.lockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: entry.lockedUntil - now,
    };
  }

  // If lockout window expired, reset
  if (now - entry.lastAttempt > LOCKOUT_DURATION_MS) {
    rateLimitMap.delete(key);
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS, resetInMs: LOCKOUT_DURATION_MS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - entry.failedAttempts);
  return {
    allowed: entry.failedAttempts < MAX_FAILED_ATTEMPTS,
    remaining,
    resetInMs: LOCKOUT_DURATION_MS - (now - entry.lastAttempt),
  };
}

/**
 * Records a failed attempt for rate limiting. Locks out if threshold reached.
 */
export function recordFailedAttempt(key: string): { locked: boolean; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { failedAttempts: 0, lockedUntil: 0, lastAttempt: now };

  entry.failedAttempts += 1;
  entry.lastAttempt = now;

  if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitMap.set(key, entry);
    return { locked: true, resetInMs: LOCKOUT_DURATION_MS };
  }

  rateLimitMap.set(key, entry);
  return { locked: false, resetInMs: LOCKOUT_DURATION_MS };
}

/**
 * Clears failed attempts upon successful login/authentication.
 */
export function resetFailedAttempts(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Validates password complexity:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Şifre boş olamaz.' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Yeni şifre en az 8 karakter uzunluğunda olmalıdır.' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Yeni şifre en az 1 adet büyük harf (A-Z) içermelidir.' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Yeni şifre en az 1 adet küçük harf (a-z) içermelidir.' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Yeni şifre en az 1 adet rakam (0-9) içermelidir.' };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return { valid: false, error: 'Yeni şifre en az 1 adet özel karakter (!@#$%^&* vb.) içermelidir.' };
  }

  const commonWeak = ['admin123', 'password', '12345678', '123456789', 'adminadmin', '19671967'];
  if (commonWeak.includes(password.toLowerCase())) {
    return { valid: false, error: 'Bu şifre çok yaygın ve tahmin edilebilir olduğu için kullanılamaz.' };
  }

  return { valid: true };
}
