'use client';

import { create } from 'zustand';
import { scrollToElement } from '@/utils/scroll';

export interface TutorialStep {
  elementId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialState {
  isActive: boolean;
  currentStepIndex: number | null;
  steps: TutorialStep[];
  localStorageKey: string;
  setupTutorial: (steps: TutorialStep[], localStorageKey: string) => void;
  goToNextStep: () => void;
  finishTutorial: () => void;
  initTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>((set, get) => ({
  isActive: false,
  currentStepIndex: null,
  steps: [],
  localStorageKey: '',
  initTutorial: () => {
    set({
      isActive: false,
      currentStepIndex: null,
      steps: [],
      localStorageKey: '',
    });
  },
  setupTutorial: (steps: TutorialStep[], localStorageKey: string) => {
    if (steps.length === 0) return;

    const isCompleted = localStorage.getItem(localStorageKey);
    if (isCompleted === 'true') return;

    set({
      steps,
      localStorageKey,
      currentStepIndex: 0,
      isActive: true,
    });
  },
  finishTutorial: () => {
    const { localStorageKey } = get();
    if (localStorageKey) {
      localStorage.setItem(localStorageKey, 'true');
    }
    get().initTutorial();
  },
  goToNextStep: () => {
    const { currentStepIndex, steps, finishTutorial } = get();
    if (currentStepIndex === null) return;

    const isLastStep = currentStepIndex === steps.length - 1;
    if (isLastStep) {
      finishTutorial();
    } else {
      const nextStepIndex = currentStepIndex + 1;
      set({ currentStepIndex: nextStepIndex });

      const nextStep = steps[nextStepIndex];
      scrollToElement(nextStep.elementId);
    }
  },
}));
