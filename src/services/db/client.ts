// D1データベースを取得する共通関数
export function getDB(env: { DB: D1Database }) {
  if (!env || !env.DB) {
    throw new Error('DB not found in environment');
  }
  return env.DB;
}
