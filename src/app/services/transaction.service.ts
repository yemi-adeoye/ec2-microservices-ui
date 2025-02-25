import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  readonly DEFAULT_PAGE = 1
  readonly DEFAULT_PAGE_SIZE = 20

  constructor(private http: HttpClient) { }

  getTransactions(accountNumber: string): Observable<any> {
    return this.http.get(`${environment.apiGatewayUrl}/transactions/account/${accountNumber}?page=${this.DEFAULT_PAGE}&size=${this.DEFAULT_PAGE_SIZE}`) //TODO get url from environment files
  }

  transact(transactionDetails: any, userId: string): Observable<any> {

    const { fromAccount, toAccount, amount } = transactionDetails;
    const body = {
      initiator: userId,
      beneficiary: userId,
      transactionDescription: 'INTRABANK_TRANSFER',
      amount: amount,
      initiatorAccount: fromAccount,
      beneficiaryAccount: toAccount,
      transactedBy: userId,
      comment: ''
    }

    return this.http.post(`${environment.apiGatewayUrl}/transactions/`, { body })
  }
}
