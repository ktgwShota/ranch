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
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/app/components/PageHeader';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // バリデーション
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // ここで実際のAPI呼び出しを行う
      // 現在はモック実装
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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

        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              お名前 <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              メールアドレス <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              件名 <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="お問い合わせの件名"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
              お問い合わせ内容 <span style={{ color: '#f44336' } as React.CSSProperties}>*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="お問い合わせ内容をご記入ください"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '0.875rem',
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
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            >
              お問い合わせを受け付けました。ありがとうございます。
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                border: '1px solid #ffebee',
                backgroundColor: '#ffebee',
                '& .MuiAlert-message': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
              }}
            >
              入力内容に誤りがあります。再度ご確認ください。
            </Alert>
          )}

          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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

