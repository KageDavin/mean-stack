import { Routes } from '@angular/router';
import { canActivateAuth } from './services/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage) },
  { path: 'login', loadComponent: () => import('./pages/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./pages/register.page').then(m => m.RegisterPage) },
  { path: 'quizzes', canActivate:[canActivateAuth], loadComponent: () => import('./pages/quiz-list.page').then(m => m.QuizListPage) },
  { path: 'quiz/:id', canActivate:[canActivateAuth], loadComponent: () => import('./pages/quiz.page').then(m => m.QuizPage) },
  { path: 'result/:id', canActivate:[canActivateAuth], loadComponent: () => import('./pages/result.page').then(m => m.ResultPage) },
  { path: 'admin', canActivate:[canActivateAuth], loadComponent: () => import('./pages/admin.page').then(m => m.AdminPage) },
  { path: '**', redirectTo: '' }
];
