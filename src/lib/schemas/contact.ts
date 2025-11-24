import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'お名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  subject: z.string().min(1, '件名は必須です'),
  message: z.string().min(10, 'お問い合わせ内容は10文字以上で入力してください'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

