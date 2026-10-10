import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'b654f5c9e29a4bb3805878db6c4e09d1';
const HOST = 'www.tasinteklif.com';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const urlList: string[] = body.urls || [];

    if (!Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: 'urls array is required and must not be empty' },
        { status: 400 }
      );
    }

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList.slice(0, 10000),
    };

    // Submit to Bing / IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const isOk = response.ok || response.status === 200 || response.status === 202;

    return NextResponse.json({
      success: isOk,
      submittedUrlsCount: urlList.length,
      statusCode: response.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit URLs to IndexNow' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    host: HOST,
    keyLocation: KEY_LOCATION,
  });
}
