'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { useTutorialStore } from '@/stores/useTutorialStore';

export function Tutorial() {
  const { isActive, currentStepIndex, steps, goToNextStep, finishTutorial } = useTutorialStore();

  const currentStep = currentStepIndex !== null ? steps[currentStepIndex] : null;
  const totalSteps = steps.length;

  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [elementStyle, setElementStyle] = useState<{
    borderRadius: string;
  }>({ borderRadius: '0px' });

  // チュートリアル表示中はユーザーによる手動スクロールを無効化
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !currentStep || currentStepIndex === null) {
      setShow(false);
      return;
    }

    const updatePosition = () => {
      const element = document.getElementById(currentStep.elementId);
      if (!element) {
        setShow(false);
        return;
      }

      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);

      const computedStyle = window.getComputedStyle(element);
      setElementStyle({
        borderRadius: computedStyle.borderRadius,
      });

      const popoverPosition = currentStep.position || 'bottom';
      let top = 0;
      let left = 0;

      switch (popoverPosition) {
        case 'top':
          top = rect.top - 20;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 20;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 20;
          break;
      }

      setPosition({ top, left });
      setShow(true);
    };

    // NOTE: レイアウトが完了した次のフレーム（最速時間）で実行
    requestAnimationFrame(updatePosition);

    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, currentStep?.elementId, currentStep?.position, currentStepIndex, currentStep]);

  if (!isActive || !currentStep || currentStepIndex === null || !show || !highlightRect) {
    return null;
  }

  return (
    <>
      {/* オーバーレイ */}
      <div className="fixed inset-0 z-[9999] bg-black/50" />

      {/* ハイライト（要素の周り） */}
      <div
        className="pointer-events-none fixed z-[10000] animate-pulse border-[#3b82f6] border-[3px]"
        style={{
          top: highlightRect.top - 4,
          left: highlightRect.left - 4,
          width: highlightRect.width + 8,
          height: highlightRect.height + 8,
          borderRadius: elementStyle.borderRadius,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* 説明ポップオーバー */}
      <div
        className="fixed z-[10001] w-[calc(100%-32px)] max-w-[320px] rounded-lg bg-white p-6 shadow-2xl transition-all"
        style={{
          top: position.top,
          left: position.left,
          transform:
            currentStep.position === 'left' || currentStep.position === 'right'
              ? 'translateY(-50%)'
              : 'translateX(-50%)',
        }}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex w-full items-center justify-between">
            <h6 className="m-0 font-bold text-[20px] text-slate-900">{currentStep.title}</h6>
            {totalSteps > 1 && (
              <span className="mr-1 text-[12px] text-slate-400">
                {currentStepIndex + 1} / {totalSteps}
              </span>
            )}
          </div>
        </div>
        <p className="m-0 mb-6 whitespace-pre-line text-slate-500 leading-relaxed">
          {currentStep.description}
        </p>
        <div className="flex justify-between gap-4">
          <Button
            variant="default"
            onClick={(e) => {
              e.stopPropagation();
              const isLastStep = currentStepIndex === totalSteps - 1;
              if (isLastStep) {
                finishTutorial();
              } else {
                goToNextStep();
              }
            }}
            size={totalSteps === 1 ? 'lg' : 'default'}
            className={`rounded-[4px] ${totalSteps === 1 ? 'w-full' : 'flex-1'}`}
          >
            わかりました
          </Button>
        </div>
      </div>
    </>
  );
}
