import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookiesService } from '../../shared/services/cookies/cookies.service';
import { EnumCookie } from '../../shared/services/cookies/cookie.enum';



export const privateGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookiesService = inject(CookiesService);

  const token = cookiesService.get(EnumCookie.AUTHORIZATION);

  if(!token) {
    router.navigate(['login'])
  }
  
  return true;
};
