import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { EnumCookie } from './cookie.enum';

@Injectable({
  providedIn: 'root'
})
export class CookiesService {
  constructor(private readonly cookieService: CookieService) { }

  public set(name: EnumCookie, value: string): void {
    return this.cookieService.set(name, value, {path: '/'});
  }

  public setObject(name: EnumCookie, value: string): void {
    return this.cookieService.set(name, JSON.stringify(value), {path: '/'});
  }

  public get(name: EnumCookie): string {
    return this.cookieService.get(name);
  }

  public getObject(name: EnumCookie): string {
    return JSON.parse(this.cookieService.get(name));
  }

  public delete(name: EnumCookie): void {
    return this.cookieService.delete(name, '/');
  }

  public clear(): void {
    const browserCookies = this.cookieService.getAll();
    const names = new Set([...Object.values(EnumCookie), ...Object.keys(browserCookies)]);
    const paths = new Set(["/", "/home", "/login"]);

    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/").filter(Boolean);
      for (let index = 1; index <= segments.length; index++) {
        paths.add("/" + segments.slice(0, index).join("/"));
      }
    }

    for (const path of paths) {
      for (const name of names) this.cookieService.delete(name, path);
      this.cookieService.deleteAll(path);
    }
    this.cookieService.deleteAll();

    if (typeof document !== "undefined") {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "";
      const domains = hostname ? ["", hostname, "." + hostname] : [""];
      for (const name of names) {
        for (const path of paths) {
          for (const domain of domains) {
            const domainPart = domain ? " Domain=" + domain + ";" : "";
            document.cookie = encodeURIComponent(name) + "=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=" + path + ";" + domainPart + " SameSite=Lax";
          }
        }
      }
    }
  }

  public check(name: EnumCookie): boolean {
    return this.cookieService.check(name);
  }
}
