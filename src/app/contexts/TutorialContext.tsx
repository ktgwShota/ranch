'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

interface TutorialStep {
  elementId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialContextValue {
  isActive: boolean;
  currentStep: TutorialStep | null;
  currentStepIndex: number | null;
  totalSteps: number;
  steps: TutorialStep[];
  setupTutorial: (steps: TutorialStep[], localStorageKey: string) => void;
  goToNextStep: () => void;
  finishTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextValue | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [localStorageKey, setLocalStorageKey] = useState<string>('');

  const initTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(null);
    setSteps([]);
    setLocalStorageKey('');
  }, []);

  const setupTutorial = useCallback((steps: TutorialStep[], localStorageKey: string) => {
    if (steps.length === 0) return;

    const isCompleted = localStorage.getItem(localStorageKey);
    if (isCompleted === 'true') return;

    setSteps(steps);
    setLocalStorageKey(localStorageKey);
    setCurrentStepIndex(0);
    setIsActive(true);
  }, []);

  const finishTutorial = useCallback(() => {
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, 'true');
    }
    initTutorial();
  }, [localStorageKey, initTutorial]);

  const goToNextStep = useCallback(() => {
    if (currentStepIndex === null) return;

    const isLastStep = currentStepIndex === steps.length - 1;
    if (isLastStep) {
      finishTutorial();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }, [currentStepIndex, steps.length, finishTutorial]);

  const currentStep = currentStepIndex !== null ? steps[currentStepIndex] : null;

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        currentStepIndex,
        totalSteps: steps.length,
        steps,
        setupTutorial,
        goToNextStep,
        finishTutorial,
      }}
    >
      {children}
      <Tutorial />
    </TutorialContext.Provider>
  );
}

export function Tutorial() {
  const { isActive, currentStep, currentStepIndex, totalSteps, goToNextStep, finishTutorial } = useTutorialContext();

  if (!isActive || !currentStep || currentStepIndex === null) {
    return null;
  }

  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const element = document.getElementById(currentStep.elementId);
      if (!element) {
        setShow(false);
        return;
      }

      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);

      const popoverPosition = currentStep.position || 'bottom';
      let top = 0;
      let left = 0;

      switch (popoverPosition) {
        case 'top':
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }

      setPosition({ top, left });
      setShow(true);
    };

    // 少し遅延させて位置を取得
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [currentStep.elementId, currentStep.position]);

  if (!show || !highlightRect) return null;

  const isLastStep = currentStepIndex === totalSteps - 1;

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
        onClick={finishTutorial}
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
          borderRadius: 1,
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
          transform: currentStep.position === 'left' || currentStep.position === 'right'
            ? 'translateY(-50%)'
            : 'translateX(-50%)',
          p: 2.5,
          maxWidth: 320,
          zIndex: 9999 + 2,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#111827' }}>
              {currentStep.title}
            </Typography>
            {totalSteps > 1 && (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {currentStepIndex + 1} / {totalSteps}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#6b7280',
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
            onClick={isLastStep ? finishTutorial : goToNextStep}
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
            わかった
          </Button>
        </Box>
      </Paper>
    </>
  );
}

export function useTutorialContext() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorialContext must be used within a TutorialProvider');
  }
  return context;
}
