import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.Service';
import type { Role } from '../models/auth';

export const roleGuard = (required: Role): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated() && auth.role() === required) return true;
    router.navigate(['/']);
    return false;
  };
};
