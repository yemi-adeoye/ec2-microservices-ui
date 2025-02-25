import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IUserService } from './user.interface.service';
import { jwtDecode } from 'jwt-decode'
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {
  constructor(private http: HttpClient) { }

  register(registerFormValues: any) {
    registerFormValues.authorities = ["USER"]
    return this.http.post<any>(`${environment.apiGatewayUrl}/users/`, { body: registerFormValues })
  }

  isValidUsername(username: string) {
    return this.http.get<any>(`${environment.apiGatewayUrl}/users/valid/${username}`)
  }

  getUsername(token: string): string {
    return jwtDecode(token).sub || ''
  }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(`${environment.apiGatewayUrl}/users/${username}`)
  }

  getUserId(token: string): string | null {
    const decoded: any = jwtDecode(token);

    return decoded.userId || null;
  }
}
