declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Le22K4tAAAAAAb2KMhCh96ThKKAL4DvBfytmaSV';

/**
 * Execute Google reCAPTCHA Enterprise token for a given action.
 * Returns the assessment token string, or null if execution failed / unavailable.
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    if (!window.grecaptcha?.enterprise) {
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha!.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha!.enterprise.execute(RECAPTCHA_SITE_KEY, {
            action,
          });
          resolve(token);
        } catch (err) {
          console.warn('[reCAPTCHA] Execution failed:', err);
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.warn('[reCAPTCHA] Error:', error);
    return null;
  }
}
