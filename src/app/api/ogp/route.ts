import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // POSTメソッドの処理を呼び出し
  const postRequest = new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl })
  });

  return await POST(postRequest);
}

export async function POST(request: NextRequest) {
  console.log('OGP API called');
  try {
    const { url } = await request.json() as { url: string };
    console.log('Request URL:', url);

    if (!url) {
      console.log('No URL provided');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // URLのバリデーション
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // 食べログとぐるなびのURLのみ許可
    const allowedDomains = [
      'tabelog.com',
      'www.tabelog.com',
      'gurunavi.com',
      'www.gurunabi.com',
      'r.gnavi.co.jp',
      'www.r.gnavi.co.jp'
    ];

    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowedDomain = allowedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isAllowedDomain) {
      return NextResponse.json({
        error: 'このURLは対応していません。食べログまたはぐるなびのURLを入力してください。',
        title: '対応していないURLです',
        rating: null,
        image: null
      }, { status: 400 });
    }

    // HTMLを取得
    console.log('Fetching HTML from URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGP-Fetcher/1.0)',
      },
    });

    console.log('HTML response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('HTML length:', html.length);

    // OGPタグを抽出する関数
    const extractMetaContent = (html: string, property: string): string | null => {
      const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    // タイトルを取得（OGP title → og:title → titleタグの順で試行）
    let title =
      extractMetaContent(html, 'og:title') ||
      extractMetaContent(html, 'title') ||
      'タイトルを取得できませんでした';

    // ぐるなびの場合は「楽天ぐるなび - 」を削除
    if (parsedUrl.hostname.includes('gurunavi.com') || parsedUrl.hostname.includes('gnavi.co.jp')) {
      title = title.replace(/^楽天ぐるなび\s*-\s*/, '');
    }





    // 画像を取得（OGP image → og:imageの順で試行）
    let image =
      extractMetaContent(html, 'og:image') ||
      extractMetaContent(html, 'og:image:url');

    // 相対URLを絶対URLに変換
    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url);
      image = `${baseUrl.protocol}//${baseUrl.host}${image.startsWith('/') ? '' : '/'}${image}`;
    }

    return NextResponse.json({
      title: title.trim(),
      image: image || null,
    });

  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch OGP data',
        title: '店舗情報を取得できませんでした',
        image: null
      },
      { status: 500 }
    );
  }
}
