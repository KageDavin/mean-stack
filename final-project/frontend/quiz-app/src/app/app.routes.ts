import { AuthService } from './../../../../../frs/frontend/quiz-frontend/src/app/services/auth.service';
// src/app/app.routes.ts
import { Routes, CanMatchFn } from '@angular/router';
import { authActivate } from '../app/auth/auth-activate-guard';
import { adminGuard } from './auth/admin.guard';
import { canDeactivateQuiz } from './shared/unsaved.guard';
import { roleGuard } from './auth';

export const appRoutes: Routes = [

  // 🧑‍🎓 Public & Student Routes
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
  },
  // {
  //   path: 'quizzes',
  //   loadComponent: () => import('./auth/').then(m => m.QuizList),
  // },
  // {
  //   path: 'quiz/:id',
  //   loadComponent: () => import('./student/quiz-taker').then(m => m.QuizTaker),
  //   canMatch: [authActivate],
  //   canDeactivate: [canDeactivateQuiz],
  // },
  // {
  //   path: 'results/:id',
  //   loadComponent: () => import('./student/result').then(m => m.Result),
  //   canMatch: [authActivate],
  // },

  // 🛠️ Auth Routes
//   {
//     path: 'login',
//     loadComponent: () => import('./auth/login/login').then(m => m.Login),
//   },
//   {
//     path: 'register',
//     loadComponent: () => import('./auth/register/register').then(m => m.Register),
//   },
//   {
//   path: 'dashboard',
//   loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
//   canMatch: [
//   authActivate,
//   roleGuard
// ]
// },

  // 🧑‍🏫 Admin Routes

  // {
  //   path: 'create-quiz',
  //   loadComponent: () => import('./create-quiz/create-quiz').then(m => m.CreateQuiz),
  //   canMatch: [adminGuard],
  // },
  // {
  //   path: 'edit-quiz/:id',
  //   loadComponent: () => import('./admin/edit-quiz/edit-quiz').then(m => m.EditQuiz),
  //   canMatch: [adminGuard],
  // },
  // {
  //   path: 'quiz/:id/results',
  //   loadComponent: () => import('./admin/quiz-results/quiz-results').then(m => m.AdminQuizResults),
  //   canMatch: [adminGuard],
  // },

  // 🧹 Fallback
//   {
//     path: '**',
//     redirectTo: '',
//   }
// ];




// {
//   path: 'dashboard',
//   children: [
//     { path: '', component: AdminView }, // or StudentView based on role
//   ]
// },
// {
//   path: 'quiz',
//   children: [
//     { path: 'new', component: QuizEditor },
//     { path: ':id/edit', component: QuizEditor },
//     { path: ':id/attempt', component: QuizTaker },
//     { path: ':id/results', component: QuizResults },
//   ]
// }








// #### OLD CODE below that was working. Updating to stricter CanMatch and lazy loading ####
// import { Routes, CanMatchFn } from '@angular/router';
// import { authGuard } from './auth/auth.guard';
// import { roleGuard } from './auth/role.guard';

// export const appRoutes: Routes = [
//   {
//     path: '',
//     loadComponent: () => import('./student/').then(m => m.QuizList)
//   },
//   {
//     path: 'quizzes',
//     loadComponent: () => import('./student/').then(m => m.QuizList)
//   },
//   {
//     path: 'quiz/:id',
//     canMatch: [authGuard], // must be logged in
//     loadComponent: () => import('./student/').then(m => m.QuizTaker)
//   },
//   { path: 'create-quiz',
//     loadComponent: () => import('./create-quiz/create-quiz-debug').then(m => m.CreateQuiz)
//   },
//   {
//     path: 'results/:id',
//     canMatch: [authGuard],
//     loadComponent: () => import('./student/').then(m => m.Result)
//   },
//   {
//     path: 'login',
//     loadComponent: () => import('./auth/').then(m => m.Login)
//   },
//   {
//     path: 'register',
//     loadComponent: () => import('./auth/').then(m => m.Register)
//   },

//   // Example admin screen (stub)
//   {
//     path: 'admin',
//     canMatch: [authGuard, roleGuard('admin')],
//     loadComponent: () => import('./student/').then(m => m.QuizList) // replace with admin dashboard later
//   },

//   { path: '**', redirectTo: '' }
// ];
