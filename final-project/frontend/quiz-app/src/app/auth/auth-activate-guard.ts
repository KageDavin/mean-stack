// src/app/auth/auth-activate.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authActivate: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  // optionally record attempted url in query for redirect after login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
