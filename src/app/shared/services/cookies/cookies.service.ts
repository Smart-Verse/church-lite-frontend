import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { EnumCookie } from './cookie.enum';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor(private readonly cookieService: CookieService) { }

  public set(name: EnumCookie, value: string): void {
    return this.cookieService.set(name, value);
  }

  public setObject(name: EnumCookie, value: string): void {
    return this.cookieService.set(name, JSON.stringify(value));
  }

  public get(name: EnumCookie): string {
    return this.cookieService.get(name);
  }

  public getObject(name: EnumCookie): string {
    return JSON.parse(this.cookieService.get(name));
  }

  public delete(name: EnumCookie): void {
    return this.cookieService.delete(name);
  }

  public check(name: EnumCookie): boolean {
    return this.cookieService.check(name);
  }
}
