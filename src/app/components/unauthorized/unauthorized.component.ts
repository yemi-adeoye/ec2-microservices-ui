import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-unauthorized',
  imports: [AsyncPipe],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {
  readonly $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoggedInSubscription: any = null;
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.$isLoggedIn
      .pipe(map(isLoggedIn => this.$isLoggedIn.next(isLoggedIn)))
      .subscribe()
  }

  ngOnDestroy() {
    if (this.isLoggedInSubscription) {
      this.isLoggedInSubscription.unsubscribe()
    }
  }

}
