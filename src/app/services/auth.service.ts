import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAuthService } from './auth.interface.service';
import { AuthDetails } from '../models/AuthDetails';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { CacheService } from './cache.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {

  readonly $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly $currentUsername: BehaviorSubject<string> = new BehaviorSubject('') // TODO add user type

  constructor(private http: HttpClient, private cacheService: CacheService) {

  }

  loginWithCode(code: string): Observable<boolean> {

    let requestBody = { code }

    return this.http
      .post<AuthDetails>('http://localhost:7000/oauth2/token', requestBody)
      .pipe(map(authDetails => {
        const { access_token: accessToken, refresh_token: refreshToken } = authDetails
        console.log(jwtDecode(accessToken))
        this.cacheService.setItem('ACCESS_TOKEN', accessToken)
        this.cacheService.setItem('REFRESH_TOKEN', refreshToken)
        this.$currentUsername.next(jwtDecode(accessToken).sub || '')
        this.$isLoggedIn.next(true)
        return true
      }), catchError(error => of(false)))

  }

  loginWithToken(accessToken: string) {

    return this.http
      .post<any>('http://localhost:7000/oauth2/introspect', { accessToken })
      .pipe(map(introspectResponse => {

        const { active } = introspectResponse

        if (!active) {
          setTimeout(() => this.$isLoggedIn.next(false), 0)
          this.$currentUsername.next(jwtDecode(accessToken).sub || '')
          return false
        } else {
          this.$isLoggedIn.next(true)
          return true
        }

      }), catchError(error => of(false)))
  }

  refreshLogin(): AuthDetails {
    throw new Error('Method not implemented.');
  }

  logout(): void {
    throw new Error('Method not implemented.');
  }

  isLoggedIn(): boolean { return this.$isLoggedIn.value }
}
