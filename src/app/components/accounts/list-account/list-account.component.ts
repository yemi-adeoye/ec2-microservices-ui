import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { CacheService } from '../../../services/cache.service';
import { AccountDetails } from '../../../models/AccountDetails';
import { TransactionDetails } from '../../../models/TransactionDetails';

@Component({
  selector: 'app-list-account',
  imports: [CurrencyPipe, UpperCasePipe, DatePipe, NgFor, AsyncPipe],
  templateUrl: './list-account.component.html',
  styleUrl: './list-account.component.scss'
})
export class ListAccountComponent {


  $accounts: BehaviorSubject<AccountDetails[]> = new BehaviorSubject<AccountDetails[]>([]);
  $activeAccount: BehaviorSubject<string> = new BehaviorSubject<string>('')
  $transactions: BehaviorSubject<TransactionDetails[]> = new BehaviorSubject<TransactionDetails[]>([]);

  isFetchingData: boolean = true;

  constructor(private accountsService: AccountService, private userService: UserService, private cacheService: CacheService, private transactionService: TransactionService) {

  }

  handleAccountclick(accountNumber: string) {
    console.log({ accountNumber })
    this.$activeAccount.next(accountNumber)
  }


  ngOnInit(): void {
    const username = this.userService.getUsername(this.cacheService.getItem('ACCESS_TOKEN'))

    this.userService.getUser(username).pipe(map(user => {
      // load user accounts
      this.accountsService.getUserAccounts(user.id).pipe(map(accounts => {

        this.$accounts.next(accounts);

        this.$activeAccount.next(accounts[0].accountNumber)

      })).subscribe((accountFetchError) => {
        // handle account fetch error
      })
    })).subscribe({
      error: (userFetchError) => {
        // handle user fetch error
      }
    })

    // listen for account change
    this.$activeAccount.pipe(map(accountNumber => {
      if (accountNumber) {
        this.transactionService.getTransactions(accountNumber).pipe(map(transactions => {
          this.$transactions.next(transactions)
        })).subscribe({
          error: (transactionFetchError) => {
            // handle transaction fetch error
          }
        })
      }
    })).subscribe()
  }

  ngAfterViewInit(): void {
    window.history.pushState({}, '', '/accounts')
  }

  ngOnDestroy(): void {
    // unsubscribe from observables


  }

}
