// src/app/shared/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { from, switchMap, throwError, catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const addAuth = (r: HttpRequest<unknown>, t?: string | null) =>
    t ? r.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : r;

  const withToken = addAuth(req, token ?? undefined);

  return next(withToken).pipe(
    catchError((err) => {
      if (err?.status === 401) {
        // attempt refresh once
        return from(auth.refreshAccessToken()).pipe(
          switchMap((newToken) => {
            if (!newToken) {
              return throwError(() => err);
            }
            return next(addAuth(req, newToken));
          }),
          catchError(() => throwError(() => err))
        );
      }
      return throwError(() => err);
    })
  );
};



// #### Formal Code to meet v20 best practice with Function-style interceptors / guards #########
// import { inject, Injectable } from '@angular/core';
// import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('accessToken');
//   if (!token) return next(req);

//   const cloned: HttpRequest<unknown> = req.clone({
//     setHeaders: { Authorization: `Bearer ${token}` }
//   });
//   return next(cloned);
// };
