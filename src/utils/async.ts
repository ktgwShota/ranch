/**
 * Promiseの実行に最低限かかる時間を保証するユーティリティ
 * @param promise 実行するPromise
 * @param minDelayMs 最小待機時間(ミリ秒)
 * @returns Promiseの結果
 */
export async function withMinDelay<T>(promise: Promise<T>, minDelayMs: number): Promise<T> {
  const startTime = Date.now();
  const result = await promise;
  const elapsedTime = Date.now() - startTime;

  if (elapsedTime < minDelayMs) {
    await new Promise((resolve) => setTimeout(resolve, minDelayMs - elapsedTime));
  }

  return result;
}
