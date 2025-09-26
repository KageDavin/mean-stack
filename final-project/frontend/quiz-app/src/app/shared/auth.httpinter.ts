import { inject, Injectable } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const authHttpInter: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');
  if (!token) return next(req);

  const cloned: HttpRequest<unknown> = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(cloned);
};
