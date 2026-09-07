import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token bulunamadı.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nakliye-ddf1c';
    const siteKey =
      process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Le22K4tAAAAAAb2KMhCh96ThKKAL4DvBfytmaSV';

    const assessmentUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const res = await fetch(assessmentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: {
          token,
          expectedAction: action || 'SUBMIT',
          siteKey,
        },
      }),
    });

    if (!res.ok) {
      // In case Google Cloud Assessment API is still provisioning or fails, fail-open safely
      const errText = await res.text();
      console.warn('[reCAPTCHA Enterprise Assessment error, fail-open]:', errText);
      return NextResponse.json({ success: true, score: 0.9, fallback: true });
    }

    const data = await res.json();
    const isValid = data.tokenProperties?.valid === true;
    const score = data.riskAnalysis?.score ?? 1.0;

    // Reject if explicitly identified as malicious bot
    if (isValid && score < 0.3) {
      return NextResponse.json(
        {
          success: false,
          score,
          error: 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      score,
    });
  } catch (error) {
    console.error('[reCAPTCHA verification error]:', error);
    // Fail open safely to avoid disrupting user experience
    return NextResponse.json({ success: true, fallback: true });
  }
}
