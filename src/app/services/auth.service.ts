import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { AuthDetails } from '../models/AuthDetails';
import { IAuthService } from './auth.interface.service';
import { CacheService } from './cache.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {

  readonly $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  readonly $currentUsername: BehaviorSubject<string> = new BehaviorSubject('') // TODO add user type

  constructor(private router: Router,
    private http: HttpClient,
    private cacheService: CacheService,
    private notificationService: NotificationService,
    private cookieService: CookieService
  ) {
    document.cookie = "YEMI=badooooo"
  }

  loginWithCode(code: string): Observable<boolean> {

    let requestBody = { code }

    return this.http
      .post<AuthDetails>('http://localhost:7000/oauth2/token', requestBody)
      .pipe(map(authDetails => {
        console.log({ authDetails })
        const { access_token: accessToken, refresh_token: refreshToken } = authDetails

        this.cacheService.setItem('ACCESS_TOKEN', accessToken)
        this.cacheService.setItem('REFRESH_TOKEN', refreshToken)
        const username = jwtDecode(accessToken).sub || ''

        this.$currentUsername.next(username || '')

        this.subscribeToNotifications(username);

        this.$isLoggedIn.next(true)

        return true
      }), catchError(error => {

        this.logout()

        return of(false)
      })
      )

  }

  loginWithToken(accessToken: string) {

    return this.http
      .post<any>('http://localhost:7000/oauth2/introspect', { accessToken })
      .pipe(map(introspectResponse => {

        const { active } = introspectResponse
        console.log({ active })
        if (!active) {
          this.logout()

          return false

        } else {
          this.$isLoggedIn.next(true)

          const accessToken = this.cacheService.getItem('ACCESS_TOKEN')

          const username = jwtDecode(accessToken).sub || ''

          this.$currentUsername.next(username || '')

          this.subscribeToNotifications(username)

          return true
        }

      }), catchError(error => of(false)))
  }

  subscribeToNotifications(userId: string) {
    if (!this.notificationService.socket) {

      // create connection and subscribe
      this.notificationService.createConnection();

      this.notificationService.subscribe(`${userId}`, null)
    }
  }



  refreshLogin(): AuthDetails {
    throw new Error('Method not implemented.');
  }

  logout(): void {
    // disconnect from websocket
    this.notificationService.disconnect()

    // log user out
    setTimeout(() => this.$isLoggedIn.next(false), 0)

    this.$currentUsername.next('')

    this.cacheService.clear()

    this.router.navigate([''])

  }

  isLoggedIn(): boolean { return this.$isLoggedIn.value }
}
