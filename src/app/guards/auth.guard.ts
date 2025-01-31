import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CacheService } from '../services/cache.service';

export const authGuard = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);

  const authService = inject(AuthService)
  const cacheService = inject(CacheService)

  const code: string = route.queryParams['code'] || ''

  const accessToken: string = cacheService.getItem('ACCESS_TOKEN');

  return checkLogin(authService, code, accessToken, router)

};

function checkLogin(authService: AuthService, code: string, accessToken: string, router: Router): Observable<boolean> {
  if (code) {
    return authService.loginWithCode(code).pipe(map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigate(['/']) // TRY TO SEND THIS TO SPRINGBOOTS LOGIN PAGE
      }
      return isLoggedIn
    }, take(1)))
  }

  return authService.loginWithToken(accessToken).pipe(map((isValidToken) => {
    if (!isValidToken) {
      router.navigate(['/']) // TRY TO SEND THIS TO SPRINGBOOTS LOGIN PAGE
    }
    return isValidToken
  }, take(1)))


}
