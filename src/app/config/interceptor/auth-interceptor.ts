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
import { ToastService } from '../../shared/services/toast/toast.service';
import { TranslateService } from '../../shared/services/translate/translate.service';

export function authInterceptor(
  originalRequest: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const cookiesService = inject(CookiesService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const translate = inject(TranslateService);

  let request = originalRequest;

  const socialRequest = originalRequest.url.startsWith(environment.socialApiUrl);
  if (!isPublicAssetOrExternalUrl(originalRequest.url) || socialRequest) {
    const token = cookiesService.get(EnumCookie.AUTHORIZATION);
    const accessProfile = cookiesService.get(EnumCookie.ACCESS_PROFILE);
    const apiUrl = environment.apiUrl.replace(/\/$/, '');
    const relativeUrl = originalRequest.url.replace(/^\/+/, '');

    request = originalRequest.clone({
      url: socialRequest ? originalRequest.url : `${apiUrl}/${relativeUrl}`,
      setHeaders: token ? { Authorization: `Bearer ${token}`, ...(accessProfile ? {XAccessProfile: accessProfile} : {}) } : {}
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        cookiesService.delete(EnumCookie.AUTHORIZATION);
        router.navigate(['/login']);
      }
      if (error.status === 403 || error.status === 422) {
        const errorKey = permissionErrorKey(error);
        const subscriptionError = errorKey?.startsWith('subscription_');
        toast.error({
          summary: translate.translate('common_message'),
          detail: translate.translate(subscriptionError ? errorKey! : 'permission_access_denied')
        });
      }
      return throwError(() => error);
    })
  );
}

function permissionErrorKey(error: HttpErrorResponse): string | undefined {
  const body = error.error;
  if (typeof body === 'string') return body;
  return body?.message ?? body?.detail ?? (typeof body?.error === 'string' ? body.error : undefined);
}

function isPublicAssetOrExternalUrl(url: string): boolean {
  return (
    /^https?:\/\//i.test(url) ||
    url.startsWith('/') ||
    url.startsWith('assets/')
  );
}
