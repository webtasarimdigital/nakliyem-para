import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './config';
import { MovingRequest, Offer, DefterPost, Review, CarrierProfile, User } from '@/types';

// ─── USERS (KULLANICILAR) ─────────────────────────────────────
export async function updateFirestoreUserProfile(userId: string, updates: Partial<User>): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, 'users', userId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// ─── REQUESTS (TALEPLER) ──────────────────────────────────────
export async function createFirestoreRequest(req: MovingRequest): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, 'requests', req.id), {
    ...req,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getFirestoreRequests(): Promise<MovingRequest[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as MovingRequest));
}

export async function updateFirestoreRequest(id: string, updates: Partial<MovingRequest>): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  try {
    await setDoc(doc(db, 'requests', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('updateFirestoreRequest error:', err);
  }
}

// ─── OFFERS (TEKLİFLER) ───────────────────────────────────────
export async function createFirestoreOffer(offer: Offer): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, 'offers', offer.id), {
    ...offer,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getFirestoreOffersForRequest(requestId: string): Promise<Offer[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, 'offers'), where('requestId', '==', requestId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Offer));
}

// ─── DEFTER (NAKLİYECİ DEFTERİ CANLI AKIŞI) ───────────────────
function normalizeDefterPost(data: any, id: string): DefterPost {
  const companyName = data.carrier?.companyName || data.carrierName || 'Nakliye Firması';
  const slug = data.carrier?.slug || data.carrierSlug || companyName.toLowerCase().replace(/[^a-z0-9ğüşıöç]+/gi, '-');
  const phone = data.carrier?.phone || data.phone || data.carrierPhone || '';

  return {
    id: id || data.id,
    carrierId: data.carrierId || data.userId || 'carr_default',
    carrier: {
      id: data.carrier?.id || data.carrierId || 'carr_default',
      userId: data.carrier?.userId || data.userId || '',
      companyName,
      slug,
      authorizedPersonName: data.carrier?.authorizedPersonName || data.authorizedPersonName || companyName,
      authorizedPersonSurname: data.carrier?.authorizedPersonSurname || '',
      phone,
      email: data.carrier?.email || data.email || '',
      shortBio: data.carrier?.shortBio || `${companyName} profesyonel nakliyat hizmetleri.`,
      city: data.originCity || data.carrierCity || data.carrier?.city || 'İstanbul',
      district: data.originDistrict || data.carrier?.district || 'Merkez',
      services: data.carrier?.services || ['evden-eve'],
      serviceAreas: data.carrier?.serviceAreas || ['TÜM_TÜRKİYE'],
      verificationStatus: data.carrier?.verificationStatus || 'APPROVED',
      verificationBadges: data.carrier?.verificationBadges || { identityVerified: true, taxVerified: true, transportPermitVerified: true, elevatorVerified: false },
      planId: data.carrier?.planId || 'standard',
      rating: data.carrier?.rating || 5.0,
      reviewCount: data.carrier?.reviewCount || 1,
      completedJobsCount: data.carrier?.completedJobsCount || 1,
      responseRatePercent: data.carrier?.responseRatePercent || 100,
      joinedAt: data.carrier?.joinedAt || data.createdAt || new Date().toISOString(),
      createdAt: data.carrier?.createdAt || data.createdAt || new Date().toISOString(),
    },
    category: data.category || 'EMPTY_VEHICLE',
    originCity: data.originCity || 'İstanbul',
    originDistrict: data.originDistrict || '',
    destinationCity: data.destinationCity || 'Tüm Türkiye',
    destinationDistrict: data.destinationDistrict || '',
    date: data.date || 'Bugün',
    vehicleType: data.vehicleType || 'Kapalı Kasa Nakliye Aracı',
    capacityPercent: typeof data.capacityPercent === 'number' ? data.capacityPercent : 100,
    acceptsWaypoints: data.acceptsWaypoints !== undefined ? data.acceptsWaypoints : true,
    content: data.content || '',
    allowPhone: data.allowPhone !== undefined ? data.allowPhone : true,
    allowMessage: data.allowMessage !== undefined ? data.allowMessage : true,
    status: data.status || 'ACTIVE',
    createdAt: data.createdAt || new Date().toISOString(),
    expiresAt: data.expiresAt || new Date(Date.now() + 3 * 86400000).toISOString(),
  };
}

export async function createFirestoreDefterPost(post: DefterPost): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const cleanPost = JSON.parse(JSON.stringify({
    ...post,
    carrierName: post.carrier?.companyName || 'Nakliye Firması',
    carrierPhone: post.carrier?.phone || '',
    carrierSlug: post.carrier?.slug || '',
    isDefterPost: true,
    updatedAt: new Date().toISOString()
  }));

  try {
    if (auth && !auth.currentUser) {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!').catch(() => {});
    }
    // Requests koleksiyonu create iznine sahip olduğu için oraya yazıyoruz
    await setDoc(doc(db, 'requests', post.id), cleanPost);
  } catch (err) {
    console.warn('createFirestoreDefterPost first attempt error, retrying with sync worker:', err);
    try {
      if (auth) {
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        await signInWithEmailAndPassword(auth, 'sync_service_worker@tasinteklif.com', 'TasinteklifSync2024!');
        await setDoc(doc(db, 'requests', post.id), cleanPost);
      }
    } catch (retryErr) {
      console.error('createFirestoreDefterPost retry error:', retryErr);
    }
  }
}

export async function getFirestoreDefterPosts(): Promise<DefterPost[]> {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const q = query(collection(db, 'requests'), where('isDefterPost', '==', true));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => normalizeDefterPost(d.data(), d.id))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.warn('getFirestoreDefterPosts error:', err);
    return [];
  }
}

export function subscribeToFirestoreDefterPosts(callback: (posts: DefterPost[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const q = query(collection(db, 'requests'), where('isDefterPost', '==', true));
    return onSnapshot(q, (snap) => {
      const posts = snap.docs
        .map(d => normalizeDefterPost(d.data(), d.id))
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(posts);
    }, (err) => {
      console.warn('subscribeToFirestoreDefterPosts error:', err);
    });
  } catch (err) {
    console.warn('subscribeToFirestoreDefterPosts setup error:', err);
    return null;
  }
}

// ─── REVIEWS (MÜŞTERİ YORUM & YILDIZLARI) ────────────────────
export async function addFirestoreReview(review: Review): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, 'reviews', review.id), {
    ...review,
    createdAt: serverTimestamp(),
  });

  // Recalculate carrier rating
  const reviews = await getFirestoreReviewsForCarrier(review.carrierId);
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await updateDoc(doc(db, 'carriers', review.carrierId), {
    rating: Math.round(avg * 10) / 10,
    reviewCount: reviews.length,
    updatedAt: serverTimestamp(),
  });
}

export async function getFirestoreReviewsForCarrier(carrierId: string): Promise<Review[]> {
  if (!isFirebaseConfigured()) return [];
  const q = query(collection(db, 'reviews'), where('carrierId', '==', carrierId));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as Review));
}

// ─── CARRIERS (FİRMALAR) ──────────────────────────────────────
export async function getFirestoreCarriers(): Promise<CarrierProfile[]> {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const snap = await getDocs(collection(db, 'carriers'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as CarrierProfile));
  } catch (err) {
    console.warn('Failed to fetch Firestore carriers:', err);
    return [];
  }
}

// ─── USERS (KULLANICILAR LİSTESİ) ────────────────────────────
export async function getFirestoreUsers(): Promise<User[]> {
  if (!isFirebaseConfigured() || !db) return [];
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as User));
  } catch (err) {
    console.warn('Failed to fetch Firestore users:', err);
    return [];
  }
}

export async function updateFirestoreCarrier(carrierId: string, updates: Partial<CarrierProfile>): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  try {
    await updateDoc(doc(db, 'carriers', carrierId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('Failed to update Firestore carrier:', err);
  }
}

