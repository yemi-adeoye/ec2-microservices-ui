import { Component, OnInit } from '@angular/core';
import { IUserService } from '../../../services/user.interface.service';
import { CacheService } from '../../../services/cache.service';
import { BehaviorSubject, map, tap } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { AccountService } from '../../../services/account.service';
import { AccountRequest } from '../../../models/AccountRequest';
import { AuthService } from '../../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-create-account',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent implements OnInit {


  createAccountForm: FormGroup

  readonly $accountError: BehaviorSubject<string> = new BehaviorSubject('');
  readonly $currentUser: BehaviorSubject<any> = new BehaviorSubject({});
  readonly $accountCreated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private cacheService: CacheService, private accountService: AccountService, private userService: UserService) {
    this.createAccountForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dob: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      accountType: new FormControl('savings'),
    })
  }

  ngOnInit(): void {

    this.$accountError.next("")

    const username = this.userService.getUsername(this.cacheService.getItem('ACCESS_TOKEN'))

    this.userService.
      getUser(username)
      .pipe(tap(user => {
        console.log({ user })
        this.$currentUser.next(user)
        this.populateAccountForm(this.createAccountForm, user)
      }))
      .subscribe({
        error: (error) => {
          console.log(error)
          this.$accountError.next("Something went wrong while fetching user details. ")
        }
      })
  }

  populateAccountForm = (form: FormGroup, fields: any) => {
    console.log(Object.keys(fields), fields[0],)

    Object.keys(fields).forEach((field) => {
      form.get(field)?.setValue(fields[field])
    })
  }

  showForm() {
    this.$accountCreated.next(false)
    this.$accountError.next('')
  }

  createAccount() {

    this.$currentUser.pipe(tap((currentUser) => {
      const accountRequest: AccountRequest = {
        userId: currentUser.id,
        accountType: this.createAccountForm.value.accountType,
        createdBy: currentUser.id
      }

      this.accountService.createAccount(accountRequest).pipe(tap(accountResponse => {
        this.$accountCreated.next(true)
        return accountResponse;
      })).subscribe({
        error: (err) => {
          this.$accountError.next('Error creating Account, Something went wrong!')
          console.log(err)
        }
      })
    })).subscribe()


  }
}
