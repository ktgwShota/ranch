'use client';

import { AlertCircle, Clock, Eye, Inbox, Loader2, Mail, MailCheck, Type, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getContactsAction, markContactAsReadAction } from '@/app/contact/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/primitives/alert';
import { Badge } from '@/components/primitives/badge';
import { Button } from '@/components/primitives/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/dialog';
import { Separator } from '@/components/primitives/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/table';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
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
  }, [fetchContacts]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getContactsAction();

      if (!result.success) {
        throw new Error(result.error);
      }
      setContacts((result.data as Contact[]) || []);
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
      const result = await markContactAsReadAction(id);

      if (!result.success) {
        throw new Error(result.error || '既読マークに失敗しました');
      }

      setContacts((prev) =>
        prev.map((contact) => (contact.id === id ? { ...contact, isRead: true } : contact))
      );

      if (selectedContact?.id === id) {
        setSelectedContact((prev) => (prev ? { ...prev, isRead: true } : null));
      }
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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 font-bold text-2xl text-slate-900 tracking-tight">
            <Inbox size={24} className="text-blue-600" />
            お問い合わせ管理
          </h1>
          <p className="mt-1 text-slate-500 text-sm">
            未読:{' '}
            <span className="font-bold text-orange-600">
              {contacts.filter((c) => !c.isRead).length}
            </span>
            件 / 全件数: <span className="font-bold text-slate-900">{contacts.length}</span>件
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchContacts}
          className="rounded-[2px] border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          リフレッシュ
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="font-medium text-slate-500 text-sm">データを読み込み中...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6 rounded-[2px] border-red-100 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="overflow-hidden rounded-[2px] border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[180px] font-bold text-slate-700">日時</TableHead>
                <TableHead className="font-bold text-slate-700">名前</TableHead>
                <TableHead className="font-bold text-slate-700">メールアドレス</TableHead>
                <TableHead className="font-bold text-slate-700">件名</TableHead>
                <TableHead className="w-[100px] text-center font-bold text-slate-700">
                  ステータス
                </TableHead>
                <TableHead className="w-[100px] text-right font-bold text-slate-700">
                  操作
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                    お問い合わせはありません
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} className="transition-colors hover:bg-slate-50/50">
                    <TableCell className="font-medium text-[13px] text-slate-600">
                      {formatDate(contact.createdAt)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">{contact.name}</TableCell>
                    <TableCell className="text-slate-600">{contact.email}</TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium text-slate-900">
                      {contact.subject}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`rounded-[2px] px-2 py-0.5 font-bold text-[11px] ${
                          !contact.isRead
                            ? 'border-orange-200 bg-orange-100 text-orange-700'
                            : 'border-slate-200 bg-slate-100 text-slate-500'
                        }`}
                      >
                        {!contact.isRead ? '未読' : '既読'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleViewContact(contact)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          title="詳細を表示"
                        >
                          <Eye size={18} />
                        </button>
                        {!contact.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(contact.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-green-50 hover:text-green-600"
                            title="既読にする"
                          >
                            <MailCheck size={18} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* 詳細ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={(val) => !val && setDialogOpen(false)}>
        <DialogContent className="max-w-2xl gap-0 overflow-hidden rounded-[2px] border-none p-0 shadow-2xl">
          <DialogHeader className="bg-slate-900 p-6 text-white">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="flex items-center gap-2 font-bold text-xl">
                <Inbox size={20} className="text-blue-400" />
                お問い合わせ詳細
              </DialogTitle>
              {selectedContact && !selectedContact.isRead && (
                <Button
                  onClick={() => handleMarkAsRead(selectedContact.id)}
                  size="sm"
                  className="h-8 gap-1.5 rounded-[2px] bg-blue-600 px-3 font-bold text-white hover:bg-blue-500"
                >
                  <MailCheck size={14} />
                  既読にする
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="bg-white p-8">
            {selectedContact && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                      <User size={14} />
                      お名前
                    </div>
                    <p className="font-bold text-[17px] text-slate-900">{selectedContact.name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                      <Clock size={14} />
                      送信日時
                    </div>
                    <p className="font-medium text-slate-600">
                      {formatDate(selectedContact.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                      <Mail size={14} />
                      メールアドレス
                    </div>
                    <p className="font-bold text-blue-600 underline decoration-blue-200 underline-offset-4 transition-colors hover:decoration-blue-600">
                      {selectedContact.email}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                      <Type size={14} />
                      件名
                    </div>
                    <p className="truncate font-bold text-slate-900">{selectedContact.subject}</p>
                  </div>
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-3">
                  <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                    お問い合わせ内容
                  </div>
                  <div className="min-h-[150px] whitespace-pre-wrap break-words rounded-[2px] border border-slate-100 bg-slate-50 p-6 text-[15px] text-slate-700 leading-relaxed">
                    {selectedContact.message}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end border-slate-100 border-t bg-slate-50 p-4">
            <Button
              onClick={() => setDialogOpen(false)}
              variant="outline"
              className="rounded-[2px] border-slate-200 px-8 text-slate-500 hover:bg-white"
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
