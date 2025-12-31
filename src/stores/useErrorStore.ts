'use client';

import { create } from 'zustand';

export type ErrorType = 'api' | 'network' | 'unknown';

interface ErrorMessages {
  api: string;
  network: string;
  unknown: string;
}

const ERROR_MESSAGES: ErrorMessages = {
  api: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
  network: 'ネットワークエラーが発生しました。接続を確認してください。',
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
  showError: (type: ErrorType = 'api') => {
    set({ errorMessage: ERROR_MESSAGES[type], isOpen: true });
  },
  closeError: () => {
    set({ isOpen: false });
    setTimeout(() => {
      set({ errorMessage: null });
    }, 300);
  },
}));
