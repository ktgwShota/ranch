import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { submitResponseAction } from '../actions';
import type { AvailabilityStatus, DateTimeItem, Response } from '../types';

// respondentIdをlocalStorageから取得または生成
const getRespondentId = (): string => {
  if (typeof window === 'undefined') return '';
  const storageKey = 'schedule_respondent_id';
  let respondentId = localStorage.getItem(storageKey);
  if (!respondentId) {
    respondentId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(storageKey, respondentId);
  }
  return respondentId;
};

// null を 'unavailable' に変換
const normalizeAvailability = (availability: {
  [key: string]: AvailabilityStatus | null;
}): { [key: string]: AvailabilityStatus } => {
  const result: { [key: string]: AvailabilityStatus } = {};
  for (const [key, value] of Object.entries(availability)) {
    result[key] = value ?? 'unavailable';
  }
  return result;
};

interface UseScheduleResponseProps {
  scheduleId: string;
  responses: Response[];
  allDateTimes: DateTimeItem[];
}

export function useScheduleResponse({
  scheduleId,
  responses,
  allDateTimes,
}: UseScheduleResponseProps) {
  const router = useRouter();

  const [voterName, setVoterName] = useState('');
  const [myAvailability, setMyAvailability] = useState<{ [key: string]: AvailabilityStatus }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [respondentId, setRespondentId] = useState('');

  // デフォルトの回答を生成（全て unavailable）
  const getDefaultAvailability = useCallback((): { [key: string]: AvailabilityStatus } => {
    const defaults: { [key: string]: AvailabilityStatus } = {};
    for (const { key } of allDateTimes) {
      defaults[key] = 'unavailable';
    }
    return defaults;
  }, [allDateTimes]);

  // 初期化
  useEffect(() => {
    const id = getRespondentId();
    setRespondentId(id);
    const myResponse = responses.find((r) => r.respondentId === id);
    if (myResponse) {
      setIsSubmitted(true);
      setVoterName(myResponse.name);
      setMyAvailability(normalizeAvailability(myResponse.availability));
    }
  }, [responses]);

  const toggleAvailability = useCallback((dateTimeKey: string) => {
    setMyAvailability((prev) => {
      const order: AvailabilityStatus[] = ['unavailable', 'available', 'maybe'];
      const current = prev[dateTimeKey];
      const currentIndex = order.indexOf(current);
      const next = order[(currentIndex + 1) % 3];
      return { ...prev, [dateTimeKey]: next };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!voterName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await submitResponseAction(scheduleId, {
        respondentId,
        name: voterName.trim(),
        availability: myAvailability,
      });

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました');
      }

      setIsSubmitted(true);
      setIsEditing(false);
      setShowInputForm(false);
      router.refresh();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert(error instanceof Error ? error.message : '送信に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [voterName, isSubmitting, scheduleId, respondentId, myAvailability, router]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowInputForm(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    const myResponse = responses.find((r) => r.respondentId === respondentId);
    if (myResponse) {
      setVoterName(myResponse.name);
      setMyAvailability(normalizeAvailability(myResponse.availability));
    } else {
      setVoterName('');
      setMyAvailability({});
    }
    setIsEditing(false);
    setShowInputForm(false);
  }, [responses, respondentId]);

  const handleShowInputForm = useCallback(
    (show: boolean) => {
      if (show && !isSubmitted) {
        setMyAvailability(getDefaultAvailability());
      }
      setShowInputForm(show);
    },
    [isSubmitted, getDefaultAvailability]
  );

  return {
    voterName,
    setVoterName,
    myAvailability,
    toggleAvailability,
    isSubmitted,
    isEditing,
    showInputForm,
    setShowInputForm: handleShowInputForm,
    respondentId,
    handleEdit,
    handleCancelEdit,
    handleSubmit,
  };
}
