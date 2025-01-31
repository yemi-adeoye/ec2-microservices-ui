import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  readonly DEFAULT_PAGE = 1
  readonly DEFAULT_PAGE_SIZE = 20

  constructor(private http: HttpClient) { }

  getTransactions(accountNumber: string): Observable<any> {
    return this.http.get(`http://localhost:7000/transactions/account/${accountNumber}?page=${this.DEFAULT_PAGE}&size=${this.DEFAULT_PAGE_SIZE}`) //TODO get url from environment files
  }
}
