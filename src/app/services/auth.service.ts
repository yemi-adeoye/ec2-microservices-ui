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
import { environment } from '../../environment/environment';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/constants';

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
  }

  initiateLogin() {
    const { authEndpoint, clientId, redirectUri, responseType, scope } = environment.authServer

    window.location.replace(`${authEndpoint}?redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&client_id=${clientId}`)
  }

  loginWithCode(code: string): Observable<boolean> {

    let requestBody = { code }

    return this.http
      .post<AuthDetails>(`${environment.apiGatewayUrl}/oauth2/token`, requestBody)
      .pipe(map(authDetails => {
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
      .post<any>(`${environment.apiGatewayUrl}/oauth2/introspect`, { accessToken })
      .pipe(map(introspectResponse => {

        const { active } = introspectResponse
        if (!active) {
          this.logout()

          return false

        } else {
          this.$isLoggedIn.next(true)

          const accessToken = this.cacheService.getItem('ACCESS_TOKEN')

          const username = jwtDecode(accessToken).sub || ''

          this.$currentUsername.next(username || '')

          const decoded: any = jwtDecode(accessToken)

          this.subscribeToNotifications(decoded['userId'])

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



  refreshLogin(): any {
    const refreshToken = this.cacheService.getItem(REFRESH_TOKEN)
    return this.http.post(`${environment.apiGatewayUrl}/oauth2/refresh`, { refreshToken }).pipe(map((authDetails: any) => {
      const { access_token: accessToken, refresh_token: refreshToken } = authDetails
      this.cacheService.setItem(ACCESS_TOKEN, accessToken)
      this.cacheService.setItem(REFRESH_TOKEN, refreshToken)
    }))
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
