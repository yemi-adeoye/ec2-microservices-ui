import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IUserService } from './user.interface.service';
import { jwtDecode } from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class UserService implements IUserService {

  constructor(private http: HttpClient) { }

  getUsername(token: string): string {
    return jwtDecode(token).sub || ''
  }

  getUser(username: string): Observable<any> {
    return this.http.get<any>(`http://localhost:7000/users/${username}`)
  }

  getUserId(token: string): string | null {
    const decoded: any = jwtDecode(token);

    return decoded.userId || null;
  }
}
