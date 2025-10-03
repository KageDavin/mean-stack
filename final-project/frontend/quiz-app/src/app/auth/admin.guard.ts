// src/app/auth/admin.guard.ts
import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.role() === 'admin') return true;
  router.navigate(['/']);
  return false;
};
