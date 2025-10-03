// src/app/shared/unsaved.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import type { QuizTaker } from '../quiz/quiz-taker';



export interface CanComponentDeactivate {
  hasUnsavedChanges: () => boolean;
  confirmLeave?: () => Promise<boolean> | boolean;
}

export const canDeactivateQuiz: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  const unsaved = component.hasUnsavedChanges?.() ?? false;
  if (!unsaved) return true;

  const result = component.confirmLeave?.();
  if (typeof result === 'boolean') return result;
  return result?.then(Boolean) ?? true;
};
