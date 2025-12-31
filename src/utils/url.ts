/**
 * URLのバリデーションを行う
 * @param url - バリデーション対象のURL
 * @returns エラーメッセージ（バリデーション成功時はnull）
 */
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
