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

