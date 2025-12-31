export type ActionState<T = any> =
  | { success: true; data: T; error?: never; details?: any }
  | { success: false; error: string; data?: never; details?: any };
