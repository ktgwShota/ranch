import { D1Database } from '@cloudflare/workers-types';

/**
 * Cloudflare D1 データベース接続ユーティリティ
 * 
 * 環境に応じて適切なデータベースインスタンスを返します：
 * - production: myapp_prod
 * - その他（local/preview）: myapp_stg
 */

export interface CloudflareEnv {
  DB: D1Database;
  NODE_ENV: string;
}

/**
 * 現在の環境に応じたデータベースインスタンスを取得
 * @param env Cloudflare環境変数
 * @returns D1Database インスタンス
 */
export function getDatabase(env: CloudflareEnv): D1Database {
  return env.DB;
}

/**
 * データベースクエリを実行するヘルパー関数
 * @param env Cloudflare環境変数
 * @param sql SQLクエリ
 * @param params クエリパラメータ
 * @returns クエリ結果
 */
export async function executeQuery<T = any>(
  env: CloudflareEnv,
  sql: string,
  params: any[] = []
): Promise<D1Result<T>> {
  const db = getDatabase(env);
  return await db.prepare(sql).bind(...params).all<T>();
}

/**
 * データベースクエリを実行するヘルパー関数（単一行）
 * @param env Cloudflare環境変数
 * @param sql SQLクエリ
 * @param params クエリパラメータ
 * @returns クエリ結果（単一行）
 */
export async function executeQueryFirst<T = any>(
  env: CloudflareEnv,
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const db = getDatabase(env);
  const result = await db.prepare(sql).bind(...params).first<T>();
  return result || null;
}

/**
 * データベースに変更を実行するヘルパー関数
 * @param env Cloudflare環境変数
 * @param sql SQLクエリ
 * @param params クエリパラメータ
 * @returns 実行結果
 */
export async function executeMutation(
  env: CloudflareEnv,
  sql: string,
  params: any[] = []
): Promise<D1Result> {
  const db = getDatabase(env);
  return await db.prepare(sql).bind(...params).run();
}

/**
 * トランザクションを実行するヘルパー関数
 * @param env Cloudflare環境変数
 * @param queries 実行するクエリの配列
 * @returns 実行結果の配列
 */
export async function executeTransaction(
  env: CloudflareEnv,
  queries: Array<{ sql: string; params?: any[] }>
): Promise<D1Result[]> {
  const db = getDatabase(env);
  const results: D1Result[] = [];

  for (const query of queries) {
    const result = await db.prepare(query.sql).bind(...(query.params || [])).run();
    results.push(result);
  }

  return results;
}

/**
 * 現在の環境名を取得
 * @param env Cloudflare環境変数
 * @returns 環境名
 */
export function getEnvironment(env: CloudflareEnv): 'production' | 'staging' {
  return env.NODE_ENV === 'production' ? 'production' : 'staging';
}

/**
 * データベース名を取得
 * @param env Cloudflare環境変数
 * @returns データベース名
 */
export function getDatabaseName(env: CloudflareEnv): string {
  return getEnvironment(env) === 'production' ? 'myapp_prod' : 'myapp_stg';
}
