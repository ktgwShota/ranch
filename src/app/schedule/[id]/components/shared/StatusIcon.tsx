'use client';

import {
  Check as CheckMarkIcon,
  Close as CloseIcon,
  QuestionMark as QuestionMarkIcon,
} from '@mui/icons-material';
import { AvailabilityStatus } from './types';

interface StatusIconProps {
  status: AvailabilityStatus | null | undefined;
  size?: number;
}

const icons = {
  available: {
    color: '#22c55e',
    icon: CheckMarkIcon,
  },
  maybe: {
    color: '#f59e0b',
    icon: QuestionMarkIcon,
  },
  unavailable: {
    color: '#ff4359',
    icon: CloseIcon,
  },
};

export default function StatusIcon({ status, size = 24 }: StatusIconProps) {
  // null/undefined の場合は unavailable として扱う
  const config = icons[status ?? 'unavailable'];
  const IconComponent = config.icon;

  return <IconComponent sx={{ color: config.color, fontSize: size }} />;
}

// ステータス切り替え（直接指定）- モバイル版で使用
export const setStatusDirectly = (
  currentStatus: AvailabilityStatus | null | undefined,
  targetStatus: AvailabilityStatus,
  toggleFn: () => void
) => {
  const order: AvailabilityStatus[] = ['unavailable', 'available', 'maybe'];
  const current = currentStatus ?? 'unavailable';
  const currentIndex = order.indexOf(current);
  const targetIndex = order.indexOf(targetStatus);
  const steps = (targetIndex - currentIndex + 3) % 3;
  for (let i = 0; i < steps; i++) toggleFn();
};

