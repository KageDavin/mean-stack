// src/app/auth/auth.guard.ts
import { CanMatchFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};




// ###### Formal Code. Updating to v20 best practices and shortening ######
// import { inject } from '@angular/core';
// import { CanMatchFn, Router, UrlSegment, Route } from '@angular/router';
// import { AuthService } from './auth.service';

// export const authGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
//   const auth = inject(AuthService);
//   const router = inject(Router);
//   if (auth.isAuthenticated()) return true;
//   router.navigate(['/login']);
//   return false;
// };
// ########### Deprecated: Class-based guard ###########
// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { AuthService } from './auth.service';
