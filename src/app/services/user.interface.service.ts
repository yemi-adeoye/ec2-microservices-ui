import { Observable } from "rxjs";

export interface IUserService {
  getUser(username: string): Observable<any>

  getUsername(token: string): string
}
