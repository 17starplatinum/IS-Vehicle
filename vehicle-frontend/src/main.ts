import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { provideStore } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    ...appConfig.providers,
    provideHttpClient(),
    provideStore({})
  ]
}).catch(err => console.error(err));

