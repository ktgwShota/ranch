import { type NextRequest, NextResponse } from 'next/server';
import { fetchOGPData as fetchOGPDataCommon } from '../../../lib/ogp';

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
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGP-Fetcher/1.0)',
      },
      signal: AbortSignal.timeout(10000), // 10秒でタイムアウト
    });

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
      // 「（店名）の店舗情報をご紹介。お店のウリキーワード：...など。楽天ぐるなびなら店舗の詳細なメニューの情報やクーポン情報など、「（店名）」の情報が満載です。」を削除
      description = description.replace(/.+の店舗情報をご紹介[\s\S]*?お店のウリキーワード[\s\S]*?など。楽天ぐるなびなら店舗の詳細なメニューの情報やクーポン情報など[\s\S]*?の情報が満載です[。.]*/g, '').trim();
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

  // 予算情報を抽出
  let budgetMin: string | undefined = undefined;
  let budgetMax: string | undefined = undefined;
  let budgetOptions: Array<{ label: string; min: string; max: string }> | undefined = undefined;

  // 食べログの予算情報を抽出（HTMLから昼予算と夜予算を取得）
  if (parsedUrl.hostname.includes('tabelog.com') || parsedUrl.hostname.includes('tabelog.jp')) {
    const budgetOptionsList: Array<{ label: string; min: string; max: string }> = [];

    // 夜予算を抽出（dinner）
    // パターン: c-rating-v3__time--dinner の後に ￥([0-9,]+)～￥([0-9,]+)
    const dinnerPattern = /c-rating-v3__time--dinner[^>]*>[\s\S]*?￥([0-9,]+)～￥([0-9,]+)/;
    const dinnerMatch = html.match(dinnerPattern);

    if (dinnerMatch && dinnerMatch[1] && dinnerMatch[2]) {
      const dinnerMin = dinnerMatch[1].replace(/,/g, '');
      const dinnerMax = dinnerMatch[2].replace(/,/g, '');
      budgetOptionsList.push({
        label: `￥${parseInt(dinnerMin, 10).toLocaleString()}～￥${parseInt(dinnerMax, 10).toLocaleString()}（夜）`,
        min: dinnerMin,
        max: dinnerMax,
      });
    }

    // 昼予算を抽出（lunch）
    // パターン: c-rating-v3__time--lunch の後に ￥([0-9,]+)～￥([0-9,]+)
    const lunchPattern = /c-rating-v3__time--lunch[^>]*>[\s\S]*?￥([0-9,]+)～￥([0-9,]+)/;
    const lunchMatch = html.match(lunchPattern);

    if (lunchMatch && lunchMatch[1] && lunchMatch[2]) {
      const lunchMin = lunchMatch[1].replace(/,/g, '');
      const lunchMax = lunchMatch[2].replace(/,/g, '');
      budgetOptionsList.push({
        label: `￥${parseInt(lunchMin, 10).toLocaleString()}～￥${parseInt(lunchMax, 10).toLocaleString()}（昼）`,
        min: lunchMin,
        max: lunchMax,
      });
    }

    if (budgetOptionsList.length > 0) {
      budgetOptions = budgetOptionsList;
      // デフォルトで夜予算を選択（夜予算がない場合は昼予算）
      const dinnerBudget = budgetOptionsList.find(opt => opt.label.includes('夜'));
      const defaultBudget = dinnerBudget || budgetOptionsList[0];
      if (defaultBudget) {
        budgetMin = defaultBudget.min;
        budgetMax = defaultBudget.max;
      }
    }
  }

  // ぐるなびの予算情報を抽出（3つのオプションを取得）
  if (parsedUrl.hostname.includes('gurunavi.com') || parsedUrl.hostname.includes('gnavi.co.jp')) {
    const budgetOptionsList: Array<{ label: string; min: string; max: string }> = [];

    // 通常平均、宴会平均、ランチ平均を順に抽出
    const patterns = [
      { type: '通常平均', label: '通常平均' },
      { type: '宴会平均', label: '宴会平均' },
      { type: 'ランチ平均', label: 'ランチ平均' },
    ];

    for (const pattern of patterns) {
      // パターン1: pricerangeクラスがある場合（通常平均）
      let budgetPattern = new RegExp(`<span[^>]*pricerange[^>]*>([0-9,]+)<\/span>円（${pattern.type}）`);
      let budgetMatch = html.match(budgetPattern);

      // パターン2: pricerangeクラスがない場合（宴会平均、ランチ平均）
      if (!budgetMatch) {
        budgetPattern = new RegExp(`<li>[\\s\\S]*?([0-9,]+)円（${pattern.type}）`);
        budgetMatch = html.match(budgetPattern);
      }

      // パターン3: 複数行や空白に対応（pricerangeクラスあり）
      if (!budgetMatch) {
        budgetPattern = new RegExp(`<span[^>]*pricerange[^>]*>[\\s\\S]*?([0-9,]+)[\\s\\S]*?<\/span>[\\s\\S]*?円[\\s\\S]*?（${pattern.type}）`);
        budgetMatch = html.match(budgetPattern);
      }

      if (budgetMatch && budgetMatch[1]) {
        const budgetValue = budgetMatch[1].replace(/,/g, '');
        budgetOptionsList.push({
          label: `${parseInt(budgetValue, 10).toLocaleString()}円（${pattern.label}）`,
          min: budgetValue,
          max: budgetValue,
        });
      }
    }

    if (budgetOptionsList.length > 0) {
      budgetOptions = budgetOptionsList;
      // デフォルトで通常平均を選択
      const normalAverage = budgetOptionsList.find(opt => opt.label.includes('通常平均'));
      if (normalAverage) {
        budgetMin = normalAverage.min;
        budgetMax = normalAverage.max;
      }
    }
  }

  // その他のOGP情報を取得（標準OGP + Twitter Card + その他）
  const ogpData = {
    title: title.trim(),
    image: image || null,
    description,
    budgetMin,
    budgetMax,
    budgetOptions,
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
