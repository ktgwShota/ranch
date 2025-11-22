'use client';

import { create } from 'zustand';

export type ErrorType = 'api' | 'network' | 'validation' | 'unknown';

interface ErrorMessages {
  api: string;
  network: string;
  validation: string;
  unknown: string;
}

const ERROR_MESSAGES: ErrorMessages = {
  api: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
  network: 'ネットワークエラーが発生しました。接続を確認してください。',
  validation: '入力内容に問題があります。再度ご確認ください。',
  unknown: 'エラーが発生しました。しばらく時間をおいて再度お試しください。',
};

interface ErrorState {
  errorMessage: string | null;
  isOpen: boolean;
  showError: (type?: ErrorType) => void;
  closeError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: null,
  isOpen: false,
  showError: (type: ErrorType = 'unknown') => {
    set({ errorMessage: ERROR_MESSAGES[type], isOpen: true });
  },
  closeError: () => {
    set({ isOpen: false });
    setTimeout(() => {
      set({ errorMessage: null });
    }, 300);
  },
}));

