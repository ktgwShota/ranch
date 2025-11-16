async function fetchOGPData(url: string): Promise<{ title: string; image: string | null; description?: string | null; error?: string }> {
  try {
    // URLのバリデーション
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'Invalid URL' };
    }

    // セキュリティ: 許可されていないプロトコルをブロック
    const allowedProtocols = ['http:', 'https:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'HTTPまたはHTTPSのURLのみ対応しています。' };
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
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'ローカルホストのURLは取得できません。' };
    }

    // プライベートIPアドレスをチェック
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/;
    if (privateIpRegex.test(hostname)) {
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'プライベートIPアドレスのURLは取得できません。' };
    }

    // HTMLを取得
    let html: string;
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OGP-Fetcher/1.0)',
        },
        signal: AbortSignal.timeout(10000), // 10秒でタイムアウト
      });

      if (!response.ok) {
        return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: `HTTP error! status: ${response.status}` };
      }

      html = await response.text();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('timeout') || errorMessage.includes('AbortError')) {
        return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'timeout' };
      }
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: errorMessage };
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
    const description =
      extractMetaContent(html, 'og:description') ||
      extractMetaContent(html, 'twitter:description') ||
      extractMetaContent(html, 'description') ||
      null;

    if (!hasOGPData) {
      return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: 'サイトが OGP に対応していない or 入力された URL が不正です。' };
    }

    return { title: title.trim(), image: image || null, description, error: undefined };
  } catch (error) {
    console.error('Error fetching OGP data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { title: 'お店の情報を取得できませんでした', image: null, description: null, error: errorMessage };
  }
}

export { fetchOGPData };

