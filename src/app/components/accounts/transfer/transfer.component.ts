import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, debounce, debounceTime, map, Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { CacheService } from '../../../services/cache.service';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArrayFilter } from '../../../pipes/app.array-filter.pipe';
import { TransactionService } from '../../../services/transaction.service';
import { SpinnerComponent } from "../../spinner/spinner.component";

@Component({
  selector: 'app-transfer',
  imports: [NgFor, NgIf, AsyncPipe, ArrayFilter, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent implements OnInit, OnDestroy {

  transferForm: FormGroup;

  isProcessing: boolean;
  isSuccessful: boolean;

  fromAccountCtrl: FormControl;
  amountCtrl: FormControl;

  accountSubscription?: Subscription;
  usernameSubscription?: Subscription;
  fromAccountSubscription?: Subscription;

  $accounts: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([])
  amountSubscription?: Subscription;
  errorMessage: string;
  transactionSubscription?: Subscription;

  constructor(private accountsService: AccountService, private userService: UserService,
    private cacheService: CacheService,
    private transactionService: TransactionService,
  ) {
    this.fromAccountCtrl = new FormControl('', [Validators.required])
    this.amountCtrl = new FormControl(0, [Validators.required, Validators.min(0.1)])

    this.errorMessage = ''

    this.transferForm = new FormGroup({
      fromAccount: this.fromAccountCtrl,
      toAccount: new FormControl('', [Validators.required]),
      amount: this.amountCtrl
    })

    this.isProcessing = false;
    this.isSuccessful = false;
  }


  ngOnInit(): void {
    const username = this.userService.getUsername(this.cacheService.getItem('ACCESS_TOKEN'))

    this.usernameSubscription = this.userService.getUser(username).pipe(map(user => {

      this.accountSubscription = this.accountsService.getUserAccounts(user.id).pipe(map(accounts => {

        this.$accounts.next(accounts);

      })).subscribe((accountFetchError) => {
        // handle account fetch error // TODO
      })
    })).subscribe({
      error: (userFetchError) => {
        // handle user fetch error
      }
    })

    // this resets the 'to account' each time the value of the from account changes because the
    // value of the to account drop down changes based on the from account selected
    this.fromAccountSubscription = this.fromAccountCtrl
      .valueChanges
      .pipe(map((_) => {
        this.transferForm.controls['toAccount'].setValue('')
        this.transferForm.controls['amount'].setValue(0)
      }))
      .subscribe()

    this.amountSubscription = this.amountCtrl.valueChanges
      .pipe(map((val) => {
        this.errorMessage = ''
        this.isProcessing = false;

        const accounts = [...this.$accounts.value]
        const fromAccount: any = accounts.filter((account: any) => account.accountNumber == this.fromAccountCtrl.value)
        if (fromAccount[0].accountBalance < this.amountCtrl.value) {
          this.errorMessage = 'Insufficient Funds'
        }
      }))
      .subscribe()
  }


  transfer() {
    this.errorMessage = ''
    this.isProcessing = true;
    this.isSuccessful = false

    const userId = this.userService.getUserId(this.cacheService.getItem('ACCESS_TOKEN')) || ''

    this.transactionSubscription =
      this.transactionService.transact(this.transferForm.value, userId)
        .pipe(map((response: any) => {
          this.isProcessing = false;
          this.isSuccessful = true;
        }))
        .subscribe({
          error: (error) => {
            this.isProcessing = false;
            this.errorMessage = 'Something went wrong. Please review transaction details and try again'
          }
        })
  }

  ngOnDestroy(): void {
    this.fromAccountSubscription?.unsubscribe();
    this.amountSubscription?.unsubscribe()
    this.transactionSubscription?.unsubscribe()
  }

  createNewTransaction() {
    this.errorMessage = ''
    this.isProcessing = false
    this.isSuccessful = false;
    this.fromAccountCtrl.setValue('')
  }

}
