import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./student/quiz-list').then(m => m.QuizList)
  },
  {
    path: 'quizzes',
    loadComponent: () => import('./student/quiz-list').then(m => m.QuizList)
  },
  {
    path: 'quiz/:id',
    canMatch: [authGuard], // must be logged in
    loadComponent: () => import('./student/quiz-taker').then(m => m.QuizTaker)
  },
  {
    path: 'results/:id',
    canMatch: [authGuard],
    loadComponent: () => import('./student/result').then(m => m.Result)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register').then(m => m.Register)
  },

  // Example admin screen (stub)
  {
    path: 'admin',
    canMatch: [authGuard, roleGuard('admin')],
    loadComponent: () => import('./student/quiz-list').then(m => m.QuizList) // replace with admin dashboard later
  },

  { path: '**', redirectTo: '' }
];
