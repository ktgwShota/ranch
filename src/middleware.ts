/**
 * Middleware for Next.js
 *
 * NOTE: Next.js 16 では proxy.ts への移行が推奨されていますが、
 * @opennextjs/cloudflare が proxy.ts に完全対応するまでは middleware.ts を使用します。
 *
 * TODO: @opennextjs/cloudflare が Next.js 16 の proxy.ts に対応したら、
 * 以下の手順で移行してください：
 * 1. このファイルを src/proxy.ts にリネーム
 * 2. export function middleware を export function proxy に変更
 * 3. ビルドとデプロイが正常に動作することを確認
 *
 * 参考: https://nextjs.org/docs/messages/middleware-to-proxy
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
