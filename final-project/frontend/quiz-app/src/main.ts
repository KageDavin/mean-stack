import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { appRoutes } from './app/app.routes';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './app/auth/auth.interceptor';
import { provideZonelessChangeDetectionn } from '@angular/core/rxjs-interop';
import { provideZonelessChangeDetection } from '@angular/core/zoneless-change-detection';
import { importProvidersFrom } from '@angular/core';
import { rxjs } from '@angular/core/rxjs-interop';
import { rxjs } from 'rxjs';

bootstrapApplication(App, appConfig) .then(() => {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZonelessChangeDetection()

  ]
}).catch(console.error);









