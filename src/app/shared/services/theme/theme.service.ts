import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  setTheme(theme: string): void {
    this.document.documentElement.classList.toggle('app-dark', theme.includes('dark'));
  }

  onConfigurationTheme(theme: string): void {
    if(theme === 'DARK'){
      this.setTheme("aura-dark-purple");
    } else {
      this.setTheme("aura-light-purple");
    }
  }
}
