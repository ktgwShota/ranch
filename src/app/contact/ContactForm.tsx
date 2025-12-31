'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { submitContactAction } from '@/app/contact/actions';
import { Alert, AlertDescription } from '@/components/primitives/alert';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/input';
import { Label } from '@/components/primitives/label';
import { contactFormSchema } from '@/db/validation/contact';
import type { ContactFormData } from '@/db/validation/types';

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus(null);
    try {
      const result = await submitContactAction(data);

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました');
      }

      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setError('root', {
        message: error instanceof Error ? error.message : '送信に失敗しました',
      });
    }
  };

  return (
    <>
      <h1
        style={{ fontWeight: 700, color: 'rgba(0, 0, 0, 0.87)', marginBottom: '16px' }}
        className="text-[18px] sm:text-[20px]"
      >
        お問い合わせ
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <Label htmlFor="name" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            お名前<span className="ml-0.5 text-[#d32f2f]">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
            placeholder="山田 太郎"
            {...register('name')}
          />
          {errors.name?.message && (
            <p className="mx-[14px] mt-1 text-red-600 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="email" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            メールアドレス<span className="ml-0.5 text-[#d32f2f]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
            placeholder="example@email.com"
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="mx-[14px] mt-1 text-red-600 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="subject" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            件名<span className="ml-0.5 text-[#d32f2f]">*</span>
          </Label>
          <Input
            id="subject"
            type="text"
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
            placeholder="お問い合わせの件名"
            {...register('subject')}
          />
          {errors.subject?.message && (
            <p className="mx-[14px] mt-1 text-red-600 text-xs">{errors.subject.message}</p>
          )}
        </div>

        <div className="mb-6">
          <Label htmlFor="message" className="mb-3 block font-bold text-[#1a1a1c] text-base">
            お問い合わせ内容<span className="ml-0.5 text-[#d32f2f]">*</span>
          </Label>
          <Input
            id="message"
            type="text"
            className="h-auto rounded-[2px] border-[rgba(0,0,0,0.23)] bg-white px-[14px] py-[16.5px] text-[15px] focus-visible:border-[#1976d2] focus-visible:ring-1 focus-visible:ring-[#1976d2]"
            placeholder="お問い合わせ内容をご記入ください"
            {...register('message')}
          />
          {errors.message?.message && (
            <p className="mx-[14px] mt-1 text-red-600 text-xs">{errors.message.message}</p>
          )}
        </div>

        {submitStatus === 'success' && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="font-medium">
              お問い合わせを受け付けました。ありがとうございます。
            </AlertDescription>
          </Alert>
        )}

        {(submitStatus === 'error' || errors.root) && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="font-medium">
              {errors.root?.message || '入力内容に誤りがあります。再度ご確認ください。'}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="relative rounded-[4px] bg-[#f97316] px-10 py-[10px] font-medium text-[15px] text-white hover:bg-[#ea580c] disabled:bg-[#ccc]"
          >
            <span className={isSubmitting ? 'invisible opacity-0' : ''}>
              {isSubmitting ? '送信中...' : '送信する'}
            </span>
            {isSubmitting && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="h-5 w-5 animate-spin text-current" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
