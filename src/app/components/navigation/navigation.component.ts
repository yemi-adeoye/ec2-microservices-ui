import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, NgIf, Location, NgFor, NgClass } from '@angular/common';
import { AuthWorkerService } from '../../services/auth-worker.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { NotificationDetails } from '../../models/NotificationDetails';
import { AccountService } from '../../services/account.service';
import { ListAccountComponent } from '../accounts/list-account/list-account.component';
import { ObjectCountPipe } from '../../pipes/app.object-count.pipe';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, RouterLink, AsyncPipe, NgIf, NgFor, NgClass, ObjectCountPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnDestroy {


  readonly $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false)
  isLoggedInSubscription!: Subscription

  worker!: Worker;


  readonly $notifications: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private accountService: AccountService,
    private location: Location, private authWorkerSerice: AuthWorkerService) {


  }

  ngOnInit(): void {
    this.worker = new Worker(new URL('./auth.worker', import.meta.url))

    this.isLoggedInSubscription = this.authService.$isLoggedIn
      .pipe(map(isLoggedIn => {

        this.$isLoggedIn.next(isLoggedIn)

        const message = isLoggedIn ? 'LOGGED_IN' : 'NOT_LOGGED_IN';

        this.worker.onmessage = (message) => {
          switch (message.data) {
            case 'REFRESH':
              this.authService.refreshLogin().subscribe({
                error: (error: any) => {
                  this.worker.terminate()
                  console.error(error)
                  this.logout()
                }
              })
              break;
          }
        }

        if (isLoggedIn) {
          this.worker.postMessage(message);

          this.notificationService.getNotifications();
          this.notificationService.$notifications.pipe(map((notifications) => {

            notifications.forEach((notification) => {
              notification.parsedMessage = JSON.parse(notification.message).notification
            })

            this.$notifications.next(notifications.sort((a: NotificationDetails, b: NotificationDetails) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()))
          })).subscribe()
        }

      }
      ))
      .subscribe()



  }

  login = () => {
    this.authService.initiateLogin()
  }

  logout = () => {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.worker.terminate()
    this.isLoggedInSubscription.unsubscribe()
  }

  handleNotificationRead(notificationId: any) {
    this.notificationService.handleNotificationsRead(notificationId);
  }
}
