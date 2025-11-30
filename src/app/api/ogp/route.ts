import { type NextRequest, NextResponse } from 'next/server';
import { fetchOGPData as fetchOGPDataCommon } from '../../../lib/ogp';

const GAS_PROXY_URL = 'https://script.google.com/macros/s/AKfycbykQq3SWYs1m9mteUsW8QNoNxKOxOZlyPMj3HK6hcmwfl6nTnyvh8N-Bfpse9eKIaqQ/exec';

// OGPデータを取得する共通関数（後方互換性のため残す）
async function fetchOGPData(url: string) {
  console.log('Fetching OGP data for URL:', url);

  // URLのバリデーション
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // セキュリティ: 許可されていないプロトコルをブロック
  const allowedProtocols = ['http:', 'https:'];
  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    return NextResponse.json(
      {
        error: 'HTTPまたはHTTPSのURLのみ対応しています。',
        title: '対応していないプロトコルです',
        image: null,
      },
      { status: 400 }
    );
  }

  // セキュリティ: ローカルホストやプライベートIPをブロック（SSRF攻撃を防ぐ）
  const hostname = parsedUrl.hostname.toLowerCase();
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    '[::1]',
  ];

  if (blockedHosts.includes(hostname)) {
    return NextResponse.json(
      {
        error: 'ローカルホストのURLは取得できません。',
        title: 'セキュリティ上の理由でブロックされました',
        image: null,
      },
      { status: 400 }
    );
  }

  // プライベートIPアドレスをチェック
  const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;
  if (privateIpRegex.test(hostname)) {
    return NextResponse.json(
      {
        error: 'プライベートIPアドレスのURLは取得できません。',
        title: 'セキュリティ上の理由でブロックされました',
        image: null,
      },
      { status: 400 }
    );
  }

  // HTMLを取得
  console.log('Fetching HTML from URL:', url);
  let html: string;
  try {
    let response: Response;

    // 食べログの場合はGASプロキシを経由する
    if (parsedUrl.hostname.includes('tabelog.com') && GAS_PROXY_URL) {
      console.log('Using GAS Proxy for Tabelog...');
      const proxyUrl = `${GAS_PROXY_URL}?url=${encodeURIComponent(url)}`;

      // GASプロキシへのリクエストは単純なGETで良い
      response = await fetch(proxyUrl, {
        signal: AbortSignal.timeout(15000), // プロキシ経由なので少し長めに
      });
    } else {
      // 通常のフェッチ
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(10000), // 10秒でタイムアウト
      });
    }

    console.log('HTML response status:', response.status);
    if (!response.ok) {
      // エラー時でもレスポンスを返す
      return NextResponse.json({
        title: 'お店の情報を取得できませんでした',
        image: null,
        description: null,
        url: url,
        type: null,
        siteName: null,
        locale: null,
        twitterCard: null,
        twitterSite: null,
        keywords: null,
        error: `HTTP error! status: ${response.status}`,
      });
    }

    html = await response.text();
    console.log('HTML length:', html.length);
  } catch (error) {
    // エラー時でもレスポンスを返す
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching HTML:', errorMessage);
    return NextResponse.json({
      title: 'お店の情報を取得できませんでした',
      image: null,
      description: null,
      url: url,
      type: null,
      siteName: null,
      locale: null,
      twitterCard: null,
      twitterSite: null,
      keywords: null,
      error: errorMessage,
    });
  }

  // OGPタグを抽出する関数
  const extractMetaContent = (html: string, property: string): string | null => {
    const regex = new RegExp(
      `<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']*)["']`,
      'i'
    );
    const match = html.match(regex);
    return match ? match[1] : null;
  };

  // 全てのメタタグを抽出してログに出力（サイト固有のプロパティを確認するため）
  const extractAllMetaTags = (html: string) => {
    const metaRegex = /<meta[^>]*(?:property|name)=["']([^"']+)["'][^>]*content=["']([^"']*)["'][^>]*>/gi;
    const allMetaTags: Record<string, string | string[]> = {};
    let match;

    while ((match = metaRegex.exec(html)) !== null) {
      const property = match[1];
      const content = match[2];
      // 既に存在する場合は配列に変換
      if (allMetaTags[property]) {
        const existingValue = allMetaTags[property];
        if (Array.isArray(existingValue)) {
          existingValue.push(content);
        } else {
          allMetaTags[property] = [existingValue, content];
        }
      } else {
        allMetaTags[property] = content;
      }
    }

    return allMetaTags;
  };

  // 全てのメタタグを抽出
  const allMetaTags = extractAllMetaTags(html);
  console.log('🔍 All Meta Tags found:', JSON.stringify(allMetaTags, null, 2));

  // タイトルを取得（OGP title → og:title → titleタグの順で試行）
  const ogTitle = extractMetaContent(html, 'og:title');
  const htmlTitle = extractMetaContent(html, 'title');
  const twitterTitle = extractMetaContent(html, 'twitter:title');

  let title =
    ogTitle ||
    htmlTitle ||
    twitterTitle ||
    'お店の情報を取得できませんでした';

  // OGP情報が取得できなかった場合はエラーフラグを立てる
  const hasOGPData = !!(ogTitle || extractMetaContent(html, 'og:image') || extractMetaContent(html, 'og:description'));

  // サイト固有のタイトルクリーンアップ
  // ぐるなびの場合は「楽天ぐるなび - 」を削除
  if (parsedUrl.hostname.includes('gurunavi.com') || parsedUrl.hostname.includes('gnavi.co.jp')) {
    title = title.replace(/^楽天ぐるなび\s*-\s*/, '');
  }

  // 画像を取得（OGP image → og:image → twitter:imageの順で試行）
  let image =
    extractMetaContent(html, 'og:image') ||
    extractMetaContent(html, 'og:image:url') ||
    extractMetaContent(html, 'twitter:image') ||
    extractMetaContent(html, 'twitter:image:src');

  // 相対URLを絶対URLに変換
  if (image && !image.startsWith('http')) {
    const baseUrl = new URL(url);
    image = `${baseUrl.protocol}//${baseUrl.host}${image.startsWith('/') ? '' : '/'}${image}`;
  }

  // 説明を取得
  let description =
    extractMetaContent(html, 'og:description') ||
    extractMetaContent(html, 'twitter:description') ||
    extractMetaContent(html, 'description') ||
    null;

  // 定型文を除外
  if (description) {
    // ぐるなびの定型文を除外
    if (parsedUrl.hostname.includes('gurunavi.com') || parsedUrl.hostname.includes('gnavi.co.jp')) {
      // 【】で囲まれた部分を削除
      description = description.replace(/【[^】]*】/g, '').trim();
      // 「（店名）の候補リストをご紹介。お店のウリキーワード：...など。楽天ぐるなびなら店舗の詳細なメニューの情報やクーポン情報など、「（店名）」の情報が満載です。」を削除
      description = description.replace(/.+の候補リストをご紹介[\s\S]*?お店のウリキーワード[\s\S]*?など。楽天ぐるなびなら店舗の詳細なメニューの情報やクーポン情報など[\s\S]*?の情報が満載です[。.]*/g, '').trim();
    }

    // 食べログの定型文を除外
    if (parsedUrl.hostname.includes('tabelog.com') || parsedUrl.hostname.includes('tabelog.jp')) {
      // ★★★☆☆3.30 ■ のような評価と記号を削除
      description = description.replace(/^[★☆\s]*[\d.]+\s*■\s*/, '');
      // ■予算(夜):￥4,000～￥4,999 のような予算情報を削除
      description = description.replace(/■予算[^■]*/g, '');
      // 先頭の■を削除
      description = description.replace(/^■\s*/, '').trim();
    }

    // 空になった場合はnullに
    if (!description || description.length === 0) {
      description = null;
    }
  }

  // その他のOGP情報を取得（標準OGP + Twitter Card + その他）
  const ogpData = {
    title: title.trim(),
    image: image || null,
    description,
    url: extractMetaContent(html, 'og:url') || url,
    type: extractMetaContent(html, 'og:type') || null,
    siteName: extractMetaContent(html, 'og:site_name') || null,
    locale: extractMetaContent(html, 'og:locale') || null,
    // Twitter Card
    twitterCard: extractMetaContent(html, 'twitter:card') || null,
    twitterSite: extractMetaContent(html, 'twitter:site') || null,
    // その他
    keywords: extractMetaContent(html, 'keywords') || null,
    // OGP情報が取得できなかった場合はエラーフラグを立てる
    error: !hasOGPData ? 'サイトが OGP に対応していない or 入力された URL が不正です。' : undefined,
  };

  // 取得したOGPデータをログに出力
  console.log('📦 OGP Data extracted:', JSON.stringify(ogpData, null, 2));

  return NextResponse.json(ogpData);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // GETリクエストの場合は直接OGPデータを取得
  return await fetchOGPData(targetUrl);
}

export async function POST(request: NextRequest) {
  console.log('OGP API called');
  let url: string | null = null;
  try {
    const body: { url?: string } = await request.json();
    url = body.url || null;
    console.log('Request URL:', url);

    if (!url) {
      console.log('No URL provided');
      return NextResponse.json({
        title: 'お店の情報を取得できませんでした',
        image: null,
        description: null,
        url: null,
        type: null,
        siteName: null,
        locale: null,
        twitterCard: null,
        twitterSite: null,
        keywords: null,
        error: 'URL is required',
      });
    }

    return await fetchOGPData(url);
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // エラー時でもレスポンスを返す（スローしない）
    return NextResponse.json({
      title: 'お店の情報を取得できませんでした',
      image: null,
      description: null,
      url: url || null,
      type: null,
      siteName: null,
      locale: null,
      twitterCard: null,
      twitterSite: null,
      keywords: null,
      error: errorMessage,
    });
  }
}
