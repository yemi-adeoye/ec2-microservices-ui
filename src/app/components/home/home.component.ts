import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [RouterModule, RouterLink, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor(private authService: AuthService) {
    this.authService.$isLoggedIn
      .pipe(tap(isLoggedIn => {
        this.$isLoggedIn.next(isLoggedIn)
      }
      )).subscribe()
  }



}
