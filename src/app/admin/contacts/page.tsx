'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import {
  Visibility as VisibilityIcon,
  MarkEmailRead as MarkEmailReadIcon,
} from '@mui/icons-material';
import { LAYOUT_CONSTANTS } from '@/config/constants';
import PageHeader from '@/components/layouts/PageHeader';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: number;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('お問い合わせの取得に失敗しました');
      }
      const data: { contacts?: Contact[] } = await response.json();
      setContacts(data.contacts || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDialogOpen(true);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: 'markAsRead',
        }),
      });

      if (!response.ok) {
        throw new Error('既読マークに失敗しました');
      }

      // リストを更新
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === id ? { ...contact, isRead: 1 } : contact
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
      alert('既読マークに失敗しました');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Typography
        variant="h1"
        sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '18px', sm: '20px' }, mb: 2 }}
      >
        お問い合わせ管理
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              未読: {contacts.filter((c) => c.isRead === 0).length}件 / 全件数: {contacts.length}件
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>日時</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>名前</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>メールアドレス</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>件名</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ステータス</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        お問い合わせがありません
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id} hover>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.isRead === 0 ? '未読' : '既読'}
                          color={contact.isRead === 0 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewContact(contact)}
                          sx={{ mr: 1 }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {contact.isRead === 0 && (
                          <IconButton
                            size="small"
                            onClick={() => handleMarkAsRead(contact.id)}
                            color="primary"
                          >
                            <MarkEmailReadIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* 詳細ダイアログ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">お問い合わせ詳細</Typography>
            {selectedContact && selectedContact.isRead === 0 && (
              <Button
                startIcon={<MarkEmailReadIcon />}
                onClick={() => {
                  if (selectedContact) {
                    handleMarkAsRead(selectedContact.id);
                    setSelectedContact({ ...selectedContact, isRead: 1 });
                  }
                }}
                size="small"
              >
                既読にする
              </Button>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <>
              <DialogContentText sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  送信日時: {formatDate(selectedContact.createdAt)}
                </Typography>
              </DialogContentText>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  お名前
                </Typography>
                <Typography variant="body1">{selectedContact.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  メールアドレス
                </Typography>
                <Typography variant="body1">{selectedContact.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  件名
                </Typography>
                <Typography variant="body1">{selectedContact.subject}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  お問い合わせ内容
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.8,
                  }}
                >
                  {selectedContact.message}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

