import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map, Observable } from 'rxjs';
import {environment} from "../../../../environments/environment";
import {languages} from "../../util/constants";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private translations: { [key: string]: string } = {};
  private language = 'pt-BR';

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadTranslations(): Observable<void> {
    if(isPlatformBrowser(this.platformId)){
      this.language = navigator.language || navigator.languages[0];
      if(this.language.indexOf("en") > -1){
        this.language = 'en-US';
      } else if(this.language.indexOf("es") > -1){
        this.language = 'es-ES';
      }
    }
    let urlProduction = "";
    if(environment.production){
      urlProduction = "/church-lite"
    }
    return this.http.get<{ [key: string]: string }>(`${urlProduction}/assets/i18n/${this.language}.json`).pipe(
      map((data) => {
        this.translations = data;
      })
    );
  }

  loadTranslationsUser(lang: string) {

    let urlProduction = "";
    if(environment.production){
      urlProduction = "/church-lite"
    }
    this.http.get<{ [key: string]: string }>(`${urlProduction}/assets/i18n/${languages[lang]}.json`).subscribe({
      next: (data) => {
        this.translations = data;
      }
    })
  }

  translate(key: string): string {
    return this.translations[key] || key;
  }
}
