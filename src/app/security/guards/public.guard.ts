import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../../shared/services/cookies/cookies.service';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';



export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookiesService = inject(CookiesService);

  if (route.queryParamMap.get("logout") === "1") {
    cookiesService.clear();
    return true;
  }

  const token = cookiesService.get(EnumCookie.AUTHORIZATION);
  return token ? router.createUrlTree(["/home"]) : true;
};
