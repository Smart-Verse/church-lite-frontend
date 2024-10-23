import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { catchError, Observable, tap, throwError } from "rxjs";
import { CookiesService } from "../../services/cookies/cookies.service";
import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { EnumCookie } from "../../services/cookies/cookie.enum";
import { environment } from "../../../environments/environment";
import { ToastService } from "../../services/toast/toast.service";

export function authInterceptor(originalRequest: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const cookiesService = inject(CookiesService);
    const router = inject(Router);
    //const toastService = inject(ToastService, { optional: true });

    let request: HttpRequest<unknown>;

    let headers = new HttpHeaders();
    if(cookiesService.get(EnumCookie.AUTHORIZATION) !== null){
        headers = headers.set('DOtoken', cookiesService.get(EnumCookie.AUTHORIZATION));
        headers = headers.set('Authorization', environment.basicAuth);
    }
    

    request = originalRequest.clone({
        headers: headers,
        url: `${environment.apiUrl}/${originalRequest.url}`,
    });

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {

            if(error.status === 401 || error.status === 0){
              cookiesService.delete(EnumCookie.AUTHORIZATION);
              router.navigate(['login']);
            }

            return throwError(() => {
            });
          })
    );
}