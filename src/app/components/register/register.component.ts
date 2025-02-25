import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime, delay, map, mergeAll, of, Subscription, tap } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CustomValidators } from '../../validators/CustomValidators';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {

  registerForm: FormGroup;
  usernameFormCtrl: FormControl = new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.noSpace])
  passwordFormCtrl: FormControl = new FormControl('', [Validators.required, CustomValidators.isValidPassword])

  usernameCtrlChangesSubscription?: Subscription

  isTakenUsername$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isUsernameValidationError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  registrationError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  registrationPending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  registrationSuccess$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: this.usernameFormCtrl,
      password: this.passwordFormCtrl,
      email: new FormControl('', [Validators.required, Validators.email]),
      dob: new FormControl('', [Validators.required]),
    })
  }


  ngOnInit(): void {
    this.usernameFormCtrl.valueChanges
      .pipe(
        debounceTime(1000),
        map(username => username.length > 1 ? this.userService.isValidUsername(username) : of(false))
      )
      .pipe(mergeAll())
      .pipe(tap(isTakenUsername => {
        console.log({ isTakenUsername })
        return this.isTakenUsername$.next(isTakenUsername)
      }))
      .subscribe({
        error: (error) => {
          console.log(error)
          this.isUsernameValidationError$.next(true)
        }
      })

  }

  register() {
    this.registrationPending$.next(true)
    this.userService
      .register(this.registerForm.value)
      .pipe(delay(8000), tap(registerResponse => {
        console.log({ registerResponse })
        this.registrationPending$.next(false)
        this.registrationSuccess$.next(true)
      }))
      .subscribe({
        error: () => {
          this.registrationError$.next(true)
          this.registrationPending$.next(false)
        }
      })
  }

  login() {
    this.authService.initiateLogin()
  }

  ngOnDestroy(): void {
    this.usernameCtrlChangesSubscription?.unsubscribe()
  }

}

