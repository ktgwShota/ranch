import { NextRequest, NextResponse } from 'next/server';

/**
 * D1データベース接続テスト用のAPI Route（モック版）
 * 通常のNext.js開発環境では、実際のD1接続の代わりにモックデータを返します
 */

export async function GET(request: NextRequest) {
  try {
    // モックデータを返す（実際のD1接続の代わり）
    const mockData = {
      success: true,
      message: 'D1データベース接続テスト（モック版）',
      environment: 'development',
      databaseName: 'myapp_stg (mock)',
      testResult: [
        { test: 1, current_time: new Date().toISOString() }
      ],
      timestamp: new Date().toISOString(),
      note: '実際のD1接続は Cloudflare Pages 環境でのみ利用可能です'
    };

    return NextResponse.json(mockData);

  } catch (error) {
    console.error('モックAPI エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'モックAPI でエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { name?: string; email?: string };

    // モックのデータ挿入結果を返す
    const mockInsertResult = {
      success: true,
      message: 'データの挿入に成功しました（モック版）',
      insertedData: {
        id: Math.floor(Math.random() * 1000),
        name: body.name || 'Test User',
        email: body.email || 'test@example.com',
        created_at: new Date().toISOString()
      },
      insertResult: {
        changes: 1,
        lastRowId: Math.floor(Math.random() * 1000)
      },
      note: '実際のデータ挿入は Cloudflare Pages 環境でのみ実行されます'
    };

    return NextResponse.json(mockInsertResult);

  } catch (error) {
    console.error('モックAPI エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'モックAPI でエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
