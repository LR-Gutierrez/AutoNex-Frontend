import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IonicRouteStrategy, ModalController } from '@ionic/angular';
import { provideIonicAngular } from '@ionic/angular/standalone';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { appRoutes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideAnimations(),
    provideIonicAngular(),
    ModalController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
