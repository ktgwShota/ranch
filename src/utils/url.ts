// URLからサービス名（食べログ/ぐるなび/その他）を判定
export function getServiceLabel(url: string): string | null {
  if (!url.trim()) return null;

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // 食べログのドメイン
    const tabelogDomains = ['tabelog.com', 'www.tabelog.com'];
    if (tabelogDomains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))) {
      return '食べログ';
    }

    // ぐるなびのドメイン
    const gurunaviDomains = [
      'gurunavi.com',
      'www.gurunavi.com',
      'r.gnavi.co.jp',
      'www.r.gnavi.co.jp',
    ];
    if (gurunaviDomains.some((domain) => hostname === domain || hostname.endsWith('.' + domain))) {
      return 'ぐるなび';
    }

    // その他の有効なURL
    return 'その他';
  } catch {
    return null;
  }
}

export function validateUrl(url: string): string | null {
  if (!url.trim()) return null;

  try {
    // 有効なURL形式かチェック（ドメイン制限なし）
    new URL(url);
    return null;
  } catch {
    return '正しいURLを入力してください';
  }
}

