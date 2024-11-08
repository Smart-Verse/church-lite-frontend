import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService } from './shared/services/translate/translate.service';

export function loadTranslationsFactory(translationService: TranslateService) {
  return () => translationService.loadTranslations().pipe();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, 
      withHashLocation()
    ), 
    
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: loadTranslationsFactory,
      deps: [TranslateService],
      multi: true
    }
  ]
};
