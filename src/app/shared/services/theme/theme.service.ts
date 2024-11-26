import {Injectable, Renderer2, RendererFactory2} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private renderer: Renderer2;
  private themeLinkElement: HTMLLinkElement | null = null;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setTheme(theme: string): void {
    const themePath = `assets/theme/${theme}/theme.css`;

    if (!this.themeLinkElement) {
      this.themeLinkElement = this.renderer.createElement('link');
      this.renderer.setAttribute(this.themeLinkElement, 'rel', 'stylesheet');
      this.renderer.setAttribute(this.themeLinkElement, 'type', 'text/css');
      this.renderer.appendChild(document.head, this.themeLinkElement);
    }

    this.renderer.setAttribute(this.themeLinkElement, 'href', themePath);
  }

  onConfigurationTheme(theme: string): void {
    if(theme === 'DARK'){
      this.setTheme("aura-dark-purple");
    } else {
      this.setTheme("aura-light-purple");
    }
  }
}
