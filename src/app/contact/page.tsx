'use client';

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/PageHeader';
import { contactSchema, type ContactFormData } from '@/lib/schemas/contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ | ChoisuR',
  description: 'ChoisuR（チョイスル）に対するお問い合わせはこちらをご利用ください',
  openGraph: {
    title: 'お問い合わせ | ChoisuR',
    description: 'ChoisuR（チョイスル）に対するお問い合わせはこちらをご利用ください',
  },
};


export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: { error?: string } = await response.json();
        throw new Error(errorData.error || '送信に失敗しました');
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
    <Container maxWidth={false} sx={{ maxWidth: LAYOUT_CONSTANTS.MAX_CONTENT_WIDTH }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          my: { xs: 2, sm: 3 },
          borderRadius: 0.5,
          border: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        <PageHeader title="お問い合わせ" />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="お名前"
              required
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              placeholder="山田 太郎"
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '1rem',
                  '& .MuiFormLabel-asterisk': {
                    color: '#f44336',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              label="メールアドレス"
              required
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              placeholder="example@email.com"
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '1rem',
                  '& .MuiFormLabel-asterisk': {
                    color: '#f44336',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="件名"
              required
              {...register('subject')}
              error={!!errors.subject}
              helperText={errors.subject?.message}
              placeholder="お問い合わせの件名"
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '1rem',
                  '& .MuiFormLabel-asterisk': {
                    color: '#f44336',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              label="お問い合わせ内容"
              required
              {...register('message')}
              error={!!errors.message}
              helperText={errors.message?.message}
              placeholder="お問い合わせ内容をご記入ください"
              InputLabelProps={{
                shrink: true,
                sx: {
                  fontSize: '1rem',
                  '& .MuiFormLabel-asterisk': {
                    color: '#f44336',
                  },
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0.5,
                },
              }}
            />
          </Box>

          {submitStatus === 'success' && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                border: '1px solid #c8e6c9',
                backgroundColor: '#e8f5e9',
                '& .MuiAlert-message': {
                  fontWeight: 500,
                },
              }}
            >
              お問い合わせを受け付けました。ありがとうございます。
            </Alert>
          )}

          {(submitStatus === 'error' || errors.root) && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                border: '1px solid #ffebee',
                backgroundColor: '#ffebee',
                '& .MuiAlert-message': {
                  fontWeight: 500,
                },
              }}
            >
              {errors.root?.message || '入力内容に誤りがあります。再度ご確認ください。'}
            </Alert>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting || submitStatus === 'success'}
              sx={{
                backgroundColor: '#f97316',
                color: '#fff',
                fontSize: '0.9375rem',
                fontWeight: 500,
                padding: '10px 40px',
                borderRadius: '4px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#ea580c',
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

