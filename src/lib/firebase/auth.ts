import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './config';
import { User, UserRole } from '@/types';

export interface RegisterParams {
  email: string;
  password: string;
  phone: string;
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
  if (!isFirebaseConfigured()) {
    return { user: null, error: 'Firebase yapılandırması bulunamadı. Lütfen .env.local dosyanızı kontrol edin.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, params.email, params.password);
    const fbUser = userCredential.user;

    const userProfile: User = {
      id: fbUser.uid,
      email: params.email,
      phone: params.phone,
      role: params.role,
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
        planId: 'plan_starter',
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
  if (!isFirebaseConfigured()) {
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
  if (isFirebaseConfigured()) {
    await signOut(auth);
  }
}
