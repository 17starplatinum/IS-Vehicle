import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app-routing.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withDebugTracing()),
    provideHttpClient()
  ]
};

export const API_PATH_VEHICLES = '/api/v1/vehicles';
export const API_PATH_COORDS = '/api/v1/coordinates';
export const SPECIAL_API_POSTFIX = '/special';
