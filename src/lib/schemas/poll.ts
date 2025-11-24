import { z } from 'zod';
import { validateUrl } from '@/utils/url';

const pollOptionSchema = z.object({
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
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  description: z.string().max(50, '備考は50文字以内で入力してください').optional(),
});

export const pollSchema = z
  .object({
    title: z.string().min(1, 'タイトルは必須です'),
    options: z
      .array(pollOptionSchema)
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
    endDate: z.string().min(1, '投票締切日は必須です'),
    endTime: z.string().min(1, '投票締切時刻は必須です'),
    hasAgreedToTerms: z.boolean().refine((val) => val === true, {
      message: '利用規約に同意してください',
    }),
  })
  .refine(
    (data) => {
      const selectedDateTime = new Date(`${data.endDate}T${data.endTime}`);
      const now = new Date();
      return selectedDateTime > now;
    },
    {
      message: '締切日時は現在時刻より後の日時を選択してください',
      path: ['endTime'],
    }
  );

export type PollFormData = z.infer<typeof pollSchema>;
export type PollOptionFormData = z.infer<typeof pollOptionSchema>;

