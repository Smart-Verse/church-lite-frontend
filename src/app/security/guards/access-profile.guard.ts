import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../../shared/services/cookies/cookies.service';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';

export const staffGuard: CanActivateFn = () => {const cookies=inject(CookiesService),router=inject(Router);return cookies.get(EnumCookie.ACCESS_PROFILE)==='MEMBER'?router.createUrlTree(['/member']):true;};
export const memberGuard: CanActivateFn = () => {const cookies=inject(CookiesService),router=inject(Router);return cookies.get(EnumCookie.ACCESS_PROFILE)==='MEMBER'?true:router.createUrlTree(['/home']);};
