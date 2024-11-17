import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {provideRouter, withHashLocation, withRouterConfig} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService } from './shared/services/translate/translate.service';
import {RegisterService} from "./services/register/register.service";


export function loadTranslationsFactory(translationService: TranslateService) {
  return () => translationService.loadTranslations().pipe();
}

export function loadRegisterModelFactory(translationService: RegisterService) {
  return () => translationService.loadModelRegister().pipe();
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
      useFactory: loadRegisterModelFactory,
      deps: [RegisterService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: loadTranslationsFactory,
      deps: [TranslateService],
      multi: true
    },
  ]
};
