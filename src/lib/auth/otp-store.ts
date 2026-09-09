import { db as firestoreDb, isFirebaseConfigured } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export interface OtpEntry {
  email: string;
  code: string;
  expiresAt: number;
  createdAt: number;
  verified?: boolean;
}

// Global in-memory map to survive within process
const memoryOtpStore = new Map<string, OtpEntry>();

// Default expiration: 3 minutes = 180,000 milliseconds
export const OTP_EXPIRATION_MS = 3 * 60 * 1000;

/**
 * Generate a random 6-digit numeric string (100000 - 999999)
 */
export function generateNumericOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Save OTP to both memory store and Firestore (if available)
 */
export async function saveOtp(email: string, code: string): Promise<OtpEntry> {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const expiresAt = now + OTP_EXPIRATION_MS;

  const entry: OtpEntry = {
    email: normalizedEmail,
    code,
    expiresAt,
    createdAt: now,
    verified: false,
  };

  // In-memory store
  memoryOtpStore.set(normalizedEmail, entry);

  // Firestore store (if configured)
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'email_otp', normalizedEmail), entry);
    } catch (err) {
      console.warn('Firestore OTP save warning:', err);
    }
  }

  return entry;
}

/**
 * Retrieve OTP from memory store or Firestore
 */
export async function getOtp(email: string): Promise<OtpEntry | null> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // 1. Check in-memory store first
  const mem = memoryOtpStore.get(normalizedEmail);
  if (mem) {
    return mem;
  }

  // 2. Check Firestore if configured
  if (isFirebaseConfigured() && firestoreDb) {
    try {
      const snap = await getDoc(doc(firestoreDb, 'email_otp', normalizedEmail));
      if (snap.exists()) {
        const data = snap.data() as OtpEntry;
        // Cache back in memory
        memoryOtpStore.set(normalizedEmail, data);
        return data;
      }
    } catch (err) {
      console.warn('Firestore OTP fetch warning:', err);
    }
  }

  return null;
}

/**
 * Verify submitted OTP against stored code and check 3-minute expiration
 */
export async function verifyOtp(email: string, inputCode: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = inputCode.trim();

  const record = await getOtp(normalizedEmail);

  if (!record) {
    return {
      success: false,
      error: 'Doğrulama kodu bulunamadı veya süresi doldu. Lütfen "Tekrar Gönder" butonuna basarak yeni bir kod isteyin.',
    };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    // Expired
    await deleteOtp(normalizedEmail);
    return {
      success: false,
      error: 'Doğrulama kodunun 3 dakikalık süresi dolmuştur. Lütfen yeni bir kod isteyiniz.',
    };
  }

  if (record.code !== cleanCode) {
    return {
      success: false,
      error: 'Girdiğiniz 6 haneli doğrulama kodu hatalı. Lütfen e-postanızı kontrol edip tekrar deneyiniz.',
    };
  }

  // Mark verified
  record.verified = true;
  memoryOtpStore.set(normalizedEmail, record);

  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'email_otp', normalizedEmail), record);
    } catch (err) {
      console.warn('Firestore OTP update warning:', err);
    }
  }

  return { success: true };
}

/**
 * Remove OTP after successful registration
 */
export async function deleteOtp(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  memoryOtpStore.delete(normalizedEmail);

  if (isFirebaseConfigured() && firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'email_otp', normalizedEmail));
    } catch (err) {
      console.warn('Firestore OTP delete warning:', err);
    }
  }
}
