import { Auth, signInWithEmailAndPassword } from 'firebase/auth';

/**
 * Ensures that server-side API routes authenticate as the background sync worker.
 * This function must ONLY be called on the server side (in Next.js route handlers).
 * The credentials are read securely from server-side environment variables (without NEXT_PUBLIC_),
 * ensuring they are NEVER leaked into browser bundles.
 */
export async function ensureServerWorkerAuth(authInstance: Auth | null): Promise<void> {
  if (typeof window !== 'undefined') {
    // Safety guard: Never run on client
    return;
  }
  if (!authInstance) return;

  try {
    if (!authInstance.currentUser) {
      const email = process.env.FIREBASE_SYNC_WORKER_EMAIL;
      const password = process.env.FIREBASE_SYNC_WORKER_PASSWORD;
      if (email && password) {
        await signInWithEmailAndPassword(authInstance, email, password);
      }
    }
  } catch (err: any) {
    console.warn('[Server Worker Auth] warning:', err?.message || err);
  }
}
