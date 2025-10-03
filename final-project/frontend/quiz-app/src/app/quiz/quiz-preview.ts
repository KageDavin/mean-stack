// src/app/quiz/quiz-preview.ts
import { Component, inject } from '@angular/core';
import { QuizStore } from '../shared/quiz.store';

@Component({
  selector: 'quiz-preview',
  templateUrl: './quiz-preview.html',
})
export class QuizPreview {
  private store = inject(QuizStore);
  quiz = this.store.quiz(); // assuming quiz is a signal
}
