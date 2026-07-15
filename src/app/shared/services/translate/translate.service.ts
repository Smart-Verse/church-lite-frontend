import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { languages } from '../../util/constants';

export interface TranslationOverride {
  id?: string;
  language: string;
  translationKey: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations: Record<string, string> = {};
  private defaults: Record<string, string> = {};
  private language = 'pt-BR';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  loadTranslations(): Observable<void> {
    if (isPlatformBrowser(this.platformId)) {
      const browserLanguage = navigator.language || navigator.languages[0];
      this.language = browserLanguage.includes('en') ? 'en-US' : browserLanguage.includes('es') ? 'es-ES' : 'pt-BR';
    }
    return this.loadLanguage(this.language, false);
  }

  loadTranslationsUser(lang: string): Observable<void> {
    return this.loadLanguage(languages[lang] ?? lang ?? 'pt-BR', true);
  }

  loadLanguage(language: string, includeOverrides = true): Observable<void> {
    this.language = language;
    return this.getDefaultTranslations(language).pipe(
      switchMap(defaults => {
        this.defaults = defaults;
        if (!includeOverrides) {
          this.translations = {...defaults};
          return of(void 0);
        }
        return this.getOverrides(language).pipe(
          map(overrides => {
            this.translations = {...defaults};
            for (const override of overrides) this.translations[override.translationKey] = override.value;
          })
        );
      })
    );
  }

  getDefaultTranslations(language = this.language): Observable<Record<string, string>> {
    const base = environment.production ? '/church-lite' : '';
    language = language === 'pt' ? 'pt-BR' : language;
    return this.http.get<Record<string, string>>(`${base}/assets/i18n/${language}.json`);
  }

  getOverrides(language = this.language): Observable<TranslationOverride[]> {
    const params = new HttpParams()
      .set('size', '1000')
      .set('offset', '1')
      .set('filter', `language eq ${language}`)
      .set('order', '')
      .set('displayFields', '*');
    return this.http.get<{contents: TranslationOverride[]}>('translation', {params}).pipe(
      map(response => response.contents ?? [])
    );
  }

  currentLanguage(): string { return this.language; }
  defaultTranslations(): Record<string, string> { return {...this.defaults}; }
  translate(key: string): string { return this.translations[key] || key; }
}
