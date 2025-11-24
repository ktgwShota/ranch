export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DBContact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: number; // 0 = 未読, 1 = 既読
  createdAt: string;
}

export interface DBResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

