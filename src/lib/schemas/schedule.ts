import { z } from 'zod';

const scheduleDateSchema = z.object({
  date: z.string(), // YYYY-MM-DD形式
  times: z.array(z.string()), // HH:mm形式の配列
});

export const scheduleSchema = z
  .object({
    title: z.string().min(1, 'タイトルは必須です'),
    dates: z.array(scheduleDateSchema).min(1, '日程を1つ以上選択してください'),
    endDate: z.string().optional(),
    endTime: z.string().optional(),
    hasAgreedToTerms: z.boolean().refine((val) => val === true, {
      message: '利用規約に同意してください',
    }),
  })
  .refine(
    (data) => {
      // endDateとendTimeの両方が設定されている場合のみ検証
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

export type ScheduleFormData = z.infer<typeof scheduleSchema>;
export type ScheduleDateData = z.infer<typeof scheduleDateSchema>;

