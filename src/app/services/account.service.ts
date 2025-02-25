import { Injectable } from '@angular/core';
import { AccountRequest } from '../models/AccountRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  getUserAccounts(userId: string) {

    return this.http.get<any>(`${environment.apiGatewayUrl}/accounts/user/${userId}`)
  }

  getAccount(accountNumber: string) {
    return this.http.get<any>(`${environment.apiGatewayUrl}/accounts/${accountNumber}`)
  }

  handleAccountClick(accountNumber: string, $accountsObservable: BehaviorSubject<any>, $activeAccountObservable: BehaviorSubject<any>) {
    this.getAccount(accountNumber).pipe(map((newAccount) => {
      const previousAccounts = $accountsObservable.value
      previousAccounts.forEach((previousAccount: any) => {
        if (previousAccount.accountNumber == accountNumber) {
          previousAccount.accountBalance = newAccount.accountBalance
        }
      })
      $accountsObservable.next([...previousAccounts])
    })).subscribe({
      error: (err) => {
        console.error(err)
        // TODO
        // tell user couldnt load account
      }
    })
    $activeAccountObservable.next(accountNumber)
  }

  constructor(private http: HttpClient) { }

  createAccount(accountRequest: AccountRequest) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http.post<any>(`${environment.apiGatewayUrl}/accounts/`, { body: accountRequest }, { headers })
  }
}
