// 共通のAPIヘルパー関数

// 型定義
export interface WorkerResult {
  success: boolean;
  data?: any;
  error?: string;
}

// 定数
// Next.jsアプリがWorker内で動作している場合の設定
export const WORKER_BASE_URL = process.env.WORKER_BASE_URL || 'http://localhost:8788';

// ヘルパー関数
export function createErrorResponse(message: string, status: number = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export function createSuccessResponse(data: any) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function callWorkerAPI(endpoint: string, method: string = 'GET', body?: any): Promise<WorkerResult> {
  const response = await fetch(`${WORKER_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  return response.json();
}
