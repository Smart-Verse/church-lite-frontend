import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {provideRouter, withHashLocation, withRouterConfig} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { TranslateService } from './shared/services/translate/translate.service';
import {RegisterService} from "./services/register/register.service";
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const ChurchLitePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}'
    }
  }
});


export function loadTranslationsFactory(translationService: TranslateService) {
  return () => translationService.loadTranslations().pipe();
}

export function loadRegisterModelFactory(translationService: RegisterService) {
  return () => translationService.loadModelRegister().pipe();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideClientHydration(),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: ChurchLitePreset,
        options: {
          darkModeSelector: '.app-dark'
        }
      }
    }),

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
