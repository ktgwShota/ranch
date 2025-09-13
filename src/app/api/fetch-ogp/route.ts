import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json() as { url: string };

    if (!url) {
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
        description: '食べログまたはぐるなびのURLを入力してください',
        image: null
      }, { status: 400 });
    }

    // HTMLを取得
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGP-Fetcher/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // OGPタグを抽出する関数
    const extractMetaContent = (html: string, property: string): string | null => {
      const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
      const match = html.match(regex);
      return match ? match[1] : null;
    };

    // タイトルを取得（OGP title → og:title → titleタグの順で試行）
    const title =
      extractMetaContent(html, 'og:title') ||
      extractMetaContent(html, 'title') ||
      'タイトルを取得できませんでした';

    // 説明文を取得（OGP description → descriptionの順で試行）
    const description =
      extractMetaContent(html, 'og:description') ||
      extractMetaContent(html, 'description') ||
      '説明を取得できませんでした';

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
      description: description.trim(),
      image: image || null,
    });

  } catch (error) {
    console.error('Error fetching OGP data:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch OGP data',
        title: '店舗情報を取得できませんでした',
        description: 'URLから情報を取得できませんでした',
        image: null
      },
      { status: 500 }
    );
  }
}
