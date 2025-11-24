'use client';

import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { useTutorialStore } from '@/app/stores/tutorialStore';

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
  }, [isActive, currentStep?.elementId, currentStep?.position, currentStepIndex]);

  if (!isActive || !currentStep || currentStepIndex === null || !show || !highlightRect) {
    return null;
  }

  return (
    <>
      {/* オーバーレイ */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      />

      {/* ハイライト（要素の周り） */}
      <Box
        sx={{
          position: 'fixed',
          top: highlightRect.top - 4,
          left: highlightRect.left - 4,
          width: highlightRect.width + 8,
          height: highlightRect.height + 8,
          border: '3px solid #3b82f6',
          borderRadius: elementStyle.borderRadius,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          zIndex: 9999 + 1,
          pointerEvents: 'none',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 0 rgba(59, 130, 246, 0.7)',
            },
            '50%': {
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 0 8px rgba(59, 130, 246, 0)',
            },
          },
        }}
      />

      {/* 説明ポップオーバー */}
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform:
            currentStep.position === 'left' || currentStep.position === 'right'
              ? 'translateY(-50%)'
              : 'translateX(-50%)',
          p: 3,
          width: 'calc(100% - 32px)',
          maxWidth: 320,
          zIndex: 9999 + 2,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
              {currentStep.title}
            </Typography>
            {totalSteps > 1 && (
              <Typography variant="caption" sx={{ mr: 0.5, color: 'text.secondary' }}>
                {currentStepIndex + 1} / {totalSteps}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {currentStep.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              const isLastStep = currentStepIndex === totalSteps - 1;
              if (isLastStep) {
                finishTutorial();
              } else {
                goToNextStep();
              }
            }}
            fullWidth={totalSteps === 1}
            sx={{
              backgroundColor: '#3b82f6',
              textTransform: 'none',
              borderRadius: 1,
              flex: totalSteps > 1 ? 1 : 'none',
              '&:hover': {
                backgroundColor: '#2563eb',
              },
            }}
          >
            わかりました
          </Button>
        </Box>
      </Paper>
    </>
  );
}

