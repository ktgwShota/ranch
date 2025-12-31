'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useErrorStore } from '@/stores/useErrorStore';

export function ErrorSnackbar() {
  const { errorMessage, isOpen, closeError } = useErrorStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed top-4 right-4 z-[99999] w-full max-w-[320px]">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="group relative flex w-full items-start gap-3 rounded-[2px] border border-red-200 bg-red-50 p-4 shadow-lg transition-all"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1 font-medium text-[14px] text-red-900 leading-relaxed">
              {errorMessage}
            </div>
            <button
              onClick={closeError}
              className="mt-0.5 shrink-0 rounded-[2px] p-0.5 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600"
              aria-label="閉じる"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
