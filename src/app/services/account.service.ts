import { Injectable } from '@angular/core';
import { AccountRequest } from '../models/AccountRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  getUserAccounts(userId: string) {
    return this.http.get<any>(`http://localhost:7000/accounts/user/${userId}`)
  }

  constructor(private http: HttpClient) { }

  createAccount(accountRequest: AccountRequest) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http.post<any>('http://localhost:7000/accounts/', { body: accountRequest }, { headers })
  }
}
