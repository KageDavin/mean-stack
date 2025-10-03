// ─────────────────────────────────────────────
// File: src/app/shared/response.store.ts
// Purpose: Signal-based store for quiz attempts
// ─────────────────────────────────────────────

import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { QuizPublic } from '../models/quiz-public.model';

@Injectable({ providedIn: 'root' })
export class ResponseStore {
  constructor(private router: Router) {}

  score = signal<number | null>(null);
  total = signal<number | null>(null);
  answers = signal<number[]>([]);
  quiz = signal<QuizPublic | null>(null);

  submitAttempt(quiz: QuizPublic, selected: number[]) {
    this.quiz.set(quiz);
    this.answers.set(selected);

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (selected[i] === q.correctOption) correct++;
    });

    this.score.set(correct);
    this.total.set(quiz.questions.length);

    this.router.navigate(['/quiz', quiz.id, 'results']);
  }

  reset() {
    this.score.set(null);
    this.total.set(null);
    this.answers.set([]);
    this.quiz.set(null);
  }
}
