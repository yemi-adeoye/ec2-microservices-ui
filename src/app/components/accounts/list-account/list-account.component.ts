import { AsyncPipe, CurrencyPipe, DatePipe, NgClass, NgFor, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, mergeAll, of, Subscription, tap, throwError } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { TransactionService } from '../../../services/transaction.service';
import { UserService } from '../../../services/user.service';
import { CacheService } from '../../../services/cache.service';
import { AccountDetails } from '../../../models/AccountDetails';
import { TransactionDetails } from '../../../models/TransactionDetails';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpinnerComponent } from "../../spinner/spinner.component";

@Component({
  selector: 'app-list-account',
  imports: [CurrencyPipe, UpperCasePipe, DatePipe, NgFor, AsyncPipe, NgClass, RouterLink, SpinnerComponent],
  templateUrl: './list-account.component.html',
  styleUrl: './list-account.component.scss'
})
export class ListAccountComponent {

  accountSubscription?: Subscription
  accountLoadSubscription?: Subscription
  accountChangeSubscription?: Subscription
  routeSubscription?: Subscription


  $accounts: BehaviorSubject<AccountDetails[]> = new BehaviorSubject<AccountDetails[]>([]);
  $activeAccount: BehaviorSubject<string> = new BehaviorSubject<string>('')
  $transactions: BehaviorSubject<TransactionDetails[]> = new BehaviorSubject<TransactionDetails[]>([]);
  $isAccountFetchError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $isTransactionFetchError: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $isFetchingData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  $isFetchingTransaction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private accountsService: AccountService, private route: ActivatedRoute,
    private router: Router,
    private userService: UserService, private cacheService: CacheService,
    private transactionService: TransactionService) {

  }

  ngAfterViewInit(): void {
    window.history.pushState({}, '', '/accounts')
  }

  ngOnInit(): void {
    this.loadUserAccounts();
    this.handleActiveAccountChange();
    this.handlePathParamChanges();
  }

  loadUserAccounts = () => {
    const username = this.userService.getUsername(this.cacheService.getItem('ACCESS_TOKEN'))

    this.accountLoadSubscription = this.userService.getUser(username)
      .pipe(
        map((user) => this.accountsService.getUserAccounts(user.id)),
      )
      .pipe(mergeAll())
      .pipe(tap(accounts => {
        console.log(accounts)
        this.$accounts.next(accounts)
        accounts.length ? this.$activeAccount.next(accounts[0].accountNumber) : null
        this.$isFetchingData.next(false)
        this.$isAccountFetchError.next(false)
      }))
      .subscribe({
        error: (err) => {
          console.log({ err })
          this.$isFetchingData.next(false)
          this.$isAccountFetchError.next(true)
        }
      })
  }

  handleActiveAccountChange = () => {
    this.$isFetchingTransaction.next(true)
    this.accountChangeSubscription = this.$activeAccount
      .pipe(
        map((accountNumber) => {
          this.$isFetchingTransaction.next(false)
          if (accountNumber) {
            return this.transactionService.getTransactions(accountNumber)
          }

          return of(false)

        }))
      .pipe(
        mergeAll(),
      )
      .pipe(tap(transactions => transactions ? this.$transactions.next(transactions) : null))
      .subscribe({
        error: (transactionFetchError) => {
          this.$isTransactionFetchError.next(true)
          this.$isFetchingTransaction.next(false)
        }
      })
  }

  handlePathParamChanges = () => {
    // listen for path param changes
    this.routeSubscription = this.route.queryParams.pipe(map((param: any) => {
      console.log(param.account)
      if (param.account) {
        this.$isTransactionFetchError.next(false)
        this.accountsService.handleAccountClick(param.account, this.$accounts, this.$activeAccount)
      }
    }))
      .subscribe()
  }

  handleAccountclick(accountNumber: string) {
    this.router.navigate(['accounts'], { queryParams: { account: accountNumber } })
  }

  ngOnDestroy(): void {
    this.accountSubscription?.unsubscribe()
    this.accountLoadSubscription?.unsubscribe()
    this.accountChangeSubscription?.unsubscribe()
    this.routeSubscription?.unsubscribe()
  }

}
