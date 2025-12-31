import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { validateUrl } from '@/utils/url';
import { pollOptions, polls } from '../core/schema';

export const pollOptionFormSchema = createInsertSchema(pollOptions, {
  url: z
    .string()
    .min(1, 'URLは必須です')
    .refine(
      (url) => {
        const error = validateUrl(url);
        return error === null;
      },
      { message: '正しいURLを入力してください' }
    ),
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().max(50, '備考は50文字以内で入力してください').optional(),
}).pick({
  url: true,
  title: true,
  description: true,
});

export const pollFormSchema = createInsertSchema(polls, {
  title: z.string().min(1, 'タイトルは必須です'),
  password: z.string().optional(),
})
  .pick({
    title: true,
    password: true,
  })
  .extend({
    options: z
      .array(pollOptionFormSchema)
      .min(2, '最低2つの選択肢を入力してください')
      .max(6, '選択肢は最大6つまでです')
      .refine(
        (options) => {
          const validOptions = options.filter((opt) => opt.url.trim() !== '');
          return validOptions.length >= 2;
        },
        {
          message: '最低2つの有効な選択肢を入力してください',
        }
      ),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    hasAgreedToTerms: z.boolean().refine((val) => val === true, {
      message: '利用規約に同意してください',
    }),
  })
  .refine(
    (data) => {
      if (data.endDate && data.endTime) {
        const selectedDateTime = new Date(`${data.endDate}T${data.endTime}`);
        const now = new Date();
        return selectedDateTime > now;
      }
      return true;
    },
    {
      message: '締切日時は現在時刻より後の日時を選択してください',
      path: ['endTime'],
    }
  );
