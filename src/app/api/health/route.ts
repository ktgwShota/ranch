import { NextResponse } from 'next/server';

/**
 * ヘルスチェック用のAPI Route
 * D1に依存しない基本的な動作確認用
 */

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API Route is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
