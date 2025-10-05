import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQueryFirst, executeMutation, getEnvironment, getDatabaseName } from '@/lib/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Cloudflare環境変数の型定義
interface CloudflareEnv {
  DB: D1Database;
  NODE_ENV: string;
}

/**
 * D1データベース接続テスト用のAPI Route
 * GET: データベース接続とクエリ実行のテスト
 * POST: サンプルデータの挿入テスト
 */

export async function GET(request: NextRequest) {
  try {
    // 公式推奨の方法でCloudflare環境変数を取得
    const { env } = await getCloudflareContext();
    
    // D1データベースが利用可能かチェック
    if (!env.DB) {
      return NextResponse.json({
        success: false,
        error: 'D1データベースが利用できません',
        details: 'env.DB is undefined',
        availableEnv: Object.keys(env)
      }, { status: 500 });
    }

    // 環境情報を取得
    const environment = getEnvironment(env);
    const databaseName = getDatabaseName(env);

    // データベース接続テスト
    const testQuery = await executeQuery(env, 'SELECT 1 as test, datetime("now") as current_time');

    return NextResponse.json({
      success: true,
      message: 'D1データベース接続成功',
      environment,
      databaseName,
      testResult: testQuery.results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('D1接続エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'データベース接続に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 公式推奨の方法でCloudflare環境変数を取得
    const { env } = await getCloudflareContext();
    
    // D1データベースが利用可能かチェック
    if (!env.DB) {
      return NextResponse.json({
        success: false,
        error: 'D1データベースが利用できません',
        details: 'env.DB is undefined',
        availableEnv: Object.keys(env)
      }, { status: 500 });
    }
    const body = await request.json() as { name?: string; email?: string };

    // サンプルテーブルが存在しない場合は作成
    await executeMutation(env, `
      CREATE TABLE IF NOT EXISTS test_table (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // データを挿入
    const insertResult = await executeMutation(
      env,
      'INSERT INTO test_table (name, email) VALUES (?, ?)',
      [body.name || 'Test User', body.email || 'test@example.com']
    );

    // 挿入されたデータを取得
    const insertedData = await executeQueryFirst(
      env,
      'SELECT * FROM test_table WHERE id = ?',
      [insertResult.meta.last_row_id]
    );

    return NextResponse.json({
      success: true,
      message: 'データの挿入に成功しました',
      insertedData,
      insertResult: {
        changes: insertResult.meta.changes,
        lastRowId: insertResult.meta.last_row_id
      }
    });

  } catch (error) {
    console.error('データ挿入エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'データの挿入に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
