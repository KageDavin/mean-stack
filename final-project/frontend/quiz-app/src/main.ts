// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { App } from './app/app';
import { appRoutes } from './app/app.routes';
import { authInterceptor } from './app/shared/auth.interceptor';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZonelessChangeDetection()
  ]
}).catch(console.error);



// ####### Formal Code to meet v20 best practices, syntax, and rules #########
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideZonelessChangeDetection } from '@angular/core';
// import { App } from './app/app';
// import { appRoutes } from './app/app.routes';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { provideRouter } from '@angular/router';
// import { authInterceptor } from './app/shared/auth.interceptor';
// import { appConfig } from './app/app.config';

// bootstrapApplication(App, {
//   providers: [
//     provideRouter(appRoutes),
//     provideHttpClient(withInterceptors([authInterceptor])),
//     provideZonelessChangeDetection(),
//   ]
// }).catch(console.error);


