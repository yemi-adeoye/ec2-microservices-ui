import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { environment } from '../../../environment/environment';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, NgIf, Location, NgFor, NgClass } from '@angular/common';
import { AuthWorkerService } from '../../services/auth-worker.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { NotificationDetails } from '../../models/NotificationDetails';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, RouterLink, AsyncPipe, NgIf, NgFor, NgClass],
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
    private location: Location, private authWorkerSerice: AuthWorkerService) {


  }

  ngOnInit(): void {
    this.worker = new Worker(new URL('./auth.worker', import.meta.url))

    this.isLoggedInSubscription = this.authService.$isLoggedIn
      .pipe(map(isLoggedIn => {
        this.$isLoggedIn.next(isLoggedIn)

        const message = isLoggedIn ? 'LOGGED_IN' : 'NOT_LOGGED_IN';

        this.worker.onmessage = (data) => {
          // console.log('Incoming message from worker,...', data)
        }

        if (isLoggedIn) {
          this.worker.postMessage(message);

          this.notificationService.getNotifications();
          this.notificationService.$notifications.pipe(map((notifications) => {

            notifications.forEach((notification) => {
              notification.parsedMessage = JSON.parse(notification.message).notification
            })

            this.$notifications.next(notifications)
          })).subscribe()
        }

      }
      ))
      .subscribe()



  }

  login = () => {
    const { authEndpoint, clientId, redirectUri, responseType, scope } = environment.authServer

    window.location.replace(`${authEndpoint}?redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&client_id=${clientId}`)
  }

  logout = () => {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.worker.terminate()
    this.isLoggedInSubscription.unsubscribe()
  }

  handleNotificationRead(notificationId: any) {
    console.log({ notificationId })
    // this.notificationService.handleNotificationRead();
  }
}
