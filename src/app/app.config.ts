import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { GlobalErrorHandler } from './shared/Errors/global-error-handler';
import { loggerInterceptor } from './shared/Inrerceptors/logger.interceptor';
import { errorInterceptor } from './shared/Inrerceptors/error.interceptor';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideClientHydration(),
    {
      provide: ErrorHandler, // Use ErrorHandler as the token
      useClass: GlobalErrorHandler
    },
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([
      loggerInterceptor,
      errorInterceptor
    ])), provideAnimationsAsync()
  ],
};

