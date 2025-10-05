/**
 * CORS設定
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * OPTIONSリクエストのレスポンスを作成
 */
export function createCorsResponse(): Response {
  return new Response(null, { status: 200, headers: corsHeaders });
}

/**
 * エラーレスポンスを作成
 */
export function createErrorResponse(message: string, status: number = 500): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

/**
 * 成功レスポンスを作成
 */
export function createSuccessResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}
