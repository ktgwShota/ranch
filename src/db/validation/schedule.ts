import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { schedules } from '../core/schema';

export const scheduleDateFormSchema = z.object({
  date: z.string(), // YYYY-MM-DD形式
  times: z.array(z.string()), // HH:mm形式の配列
});

export const scheduleFormSchema = createInsertSchema(schedules, {
  title: z.string().min(1, 'タイトルを入力してください'),
})
  .pick({
    title: true,
  })
  .extend({
    dates: z.array(scheduleDateFormSchema).min(1, '日程を1つ以上選択してください'),
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
