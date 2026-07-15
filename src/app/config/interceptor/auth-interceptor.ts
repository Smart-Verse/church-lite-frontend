import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';
import { CookiesService } from '../../shared/services/cookies/cookies.service';

export function authInterceptor(
  originalRequest: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const cookiesService = inject(CookiesService);
  const router = inject(Router);

  let request = originalRequest;

  if (!isPublicAssetOrExternalUrl(originalRequest.url)) {
    const token = cookiesService.get(EnumCookie.AUTHORIZATION);
    const apiUrl = environment.apiUrl.replace(/\/$/, '');
    const relativeUrl = originalRequest.url.replace(/^\/+/, '');

    request = originalRequest.clone({
      url: `${apiUrl}/${relativeUrl}`,
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        cookiesService.delete(EnumCookie.AUTHORIZATION);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}

function isPublicAssetOrExternalUrl(url: string): boolean {
  return (
    /^https?:\/\//i.test(url) ||
    url.startsWith('/') ||
    url.startsWith('assets/')
  );
}
