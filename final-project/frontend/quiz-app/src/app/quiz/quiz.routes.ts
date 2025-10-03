// src/app/quiz/quiz.routes.ts
import { Routes } from '@angular/router';
import { QuizEditor } from './quiz-editor';

export const quizRoutes: Routes = [
  { path: 'quiz/new', component: QuizEditor },
  { path: 'quiz/:id/edit', component: QuizEditor },
];
