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
import { db, isFirebaseConfigured } from './config';
import { MovingRequest, Offer, DefterPost, Review, CarrierProfile } from '@/types';

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
  if (!isFirebaseConfigured()) return;
  await updateDoc(doc(db, 'requests', id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
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
export async function createFirestoreDefterPost(post: DefterPost): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, 'defter_posts', post.id), {
    ...post,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToFirestoreDefterPosts(callback: (posts: DefterPost[]) => void): Unsubscribe | null {
  if (!isFirebaseConfigured()) return null;
  const q = query(collection(db, 'defter_posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const posts = snap.docs.map(d => ({ ...d.data(), id: d.id } as DefterPost));
    callback(posts);
  });
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
  if (!isFirebaseConfigured()) return [];
  const snap = await getDocs(collection(db, 'carriers'));
  return snap.docs.map(d => ({ ...d.data(), id: d.id } as CarrierProfile));
}
