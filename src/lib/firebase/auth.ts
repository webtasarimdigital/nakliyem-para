import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { User, UserRole } from '@/types';

export interface RegisterParams {
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  fullName?: string;
  companyName?: string;
  city?: string;
  district?: string;
}

/**
 * Register a new user with Firebase Auth and create their Firestore user profile
 */
export async function registerWithFirebase(params: RegisterParams): Promise<{ user: User | null; error: string | null }> {
  if (!isFirebaseConfigured() || !auth || !db) {
    return { user: null, error: 'Firebase yapılandırması bulunamadı. Lütfen .env.local dosyanızı kontrol edin.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
    const fbUser = userCredential.user;

    const userProfile: User = {
      id: fbUser.uid,
      email: params.email,
      phone: params.phone ?? '',
      role: params.role,
      fullName: params.fullName,
      companyName: params.companyName,
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore 'users' collection
    await setDoc(doc(db, 'users', fbUser.uid), {
      ...userProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // If carrier, create carrier profile record
    if (params.role === 'CARRIER' && params.companyName) {
      const carrierProfileId = `carrier_${fbUser.uid}`;
      await setDoc(doc(db, 'carriers', carrierProfileId), {
        id: carrierProfileId,
        userId: fbUser.uid,
        companyName: params.companyName,
        slug: params.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        phone: params.phone,
        email: params.email,
        city: params.city || 'İstanbul',
        district: params.district || 'Merkez',
        services: ['evden-eve'],
        serviceAreas: ['TÜM_TÜRKİYE'],
        verificationStatus: 'PENDING',
        verificationBadges: {
          identityVerified: false,
          taxVerified: false,
          transportPermitVerified: false,
          elevatorVerified: false,
        },
        planId: 'trial',
        isProfileCompleted: false,
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        responseRatePercent: 100,
        shortBio: `${params.companyName} - Güvenilir Şehirlerarası & Evden Eve Nakliyat`,
        joinedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
      });

      userProfile.carrierProfileId = carrierProfileId;
    }

    return { user: userProfile, error: null };
  } catch (err: any) {
    let message = 'Kayıt sırasında bir hata oluştu.';
    if (err.code === 'auth/email-already-in-use') message = 'Bu e-posta adresi zaten kullanımda.';
    if (err.code === 'auth/weak-password') message = 'Şifreniz en az 6 karakter olmalıdır.';
    if (err.code === 'auth/invalid-email') message = 'Geçersiz bir e-posta adresi girdiniz.';
    return { user: null, error: message };
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithFirebase(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!isFirebaseConfigured() || !auth) {
    return { user: null, error: 'Firebase yapılandırması bulunamadı.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Fetch user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      const data = userDoc.data() as User;
      return { user: data, error: null };
    }

    return {
      user: {
        id: fbUser.uid,
        email: fbUser.email || email,
        phone: '',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      },
      error: null,
    };
  } catch (err: any) {
    let message = 'Giriş yapılamadı.';
    if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      message = 'E-posta adresi veya şifre hatalı.';
    }
    return { user: null, error: message };
  }
}

/**
 * Sign out
 */
export async function logoutFirebase(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    await signOut(auth);
  }
}

/**
 * Sign in with Google Popup via Firebase
 */
export async function loginWithGoogleFirebase(targetRole: UserRole = 'CUSTOMER'): Promise<{ user: User | null; error: string | null }> {
  if (!isFirebaseConfigured() || !auth || !db) {
    return {
      user: null,
      error: 'Firebase yapılandırması bulunamadı. Lütfen Vercel veya sunucu ortam değişkenlerini (Environment Variables) kontrol edin.',
    };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const userDoc = await getDoc(userDocRef);

    let userProfile: User;
    if (userDoc.exists()) {
      // Mevcut kullanıcı — Firestore'daki gerçek rolünü koru, targetRole ile ezme
      userProfile = userDoc.data() as User;
    } else {
      // Yeni kullanıcı — targetRole ile kayıt oluştur
      userProfile = {
        id: fbUser.uid,
        email: fbUser.email || '',
        phone: fbUser.phoneNumber || '',
        role: targetRole,
        fullName: fbUser.displayName || 'Google Kullanıcısı',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return { user: userProfile, error: null };
  } catch (err: any) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return { user: null, error: null };
    }
    if (err.code === 'auth/popup-blocked') {
      return { user: null, error: 'Tarayıcınız Google açılır penceresini (popup) engelledi. Lütfen izin verin.' };
    }
    if (err.code === 'auth/operation-not-allowed') {
      return { user: null, error: 'Firebase konsolunda Google Giriş Sağlayıcısı henüz etkinleştirilmemiş.' };
    }
    if (err.code === 'auth/unauthorized-domain') {
      return { user: null, error: 'Bu domain Firebase Yetkili Alan Adları (Authorized Domains) listesinde kayıtlı değil. Lütfen Firebase Console > Authentication > Settings > Authorized Domains kısmına alan adınızı ekleyin.' };
    }
    return { user: null, error: err.message || 'Google ile giriş başarısız oldu.' };
  }
}

/**
 * Send Password Reset Email via Firebase
 */
export async function sendPasswordResetFirebase(email: string): Promise<{ success: boolean; error: string | null }> {
  if (!isFirebaseConfigured() || !auth) {
    return { success: true, error: null };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (err: any) {
    let message = 'Şifre sıfırlama e-postası gönderilemedi.';
    if (err.code === 'auth/user-not-found') message = 'Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı.';
    if (err.code === 'auth/invalid-email') message = 'Geçerli bir e-posta adresi giriniz.';
    return { success: false, error: message };
  }
}

/**
 * Pre-check if an email is already registered in Firebase Auth.
 * Tests if email is in use by any provider (Google, password, etc.).
 */
export async function checkEmailAlreadyRegistered(email: string): Promise<boolean> {
  if (!email || !email.includes('@')) return false;
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail }),
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.exists;
    }
  } catch (err) {
    console.warn('API check-email error, falling back to direct REST:', err);
  }

  // Fallback to direct REST API
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return false;
  try {
    const dummyPassword = `Chk_${Date.now()}_${Math.random().toString(36).slice(2)}!A1`;
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        password: dummyPassword,
        returnSecureToken: true,
      }),
    });
    const data = await res.json();
    if (data.error) {
      const msg = data.error.message;
      const errors = data.error.errors || [];
      return msg === 'EMAIL_EXISTS' || errors.some((e: any) => e.message === 'EMAIL_EXISTS' || e.reason === 'EMAIL_EXISTS');
    }
    if (data.idToken) {
      await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: data.idToken }),
      }).catch(() => {});
    }
    return false;
  } catch (err) {
    return false;
  }
}



