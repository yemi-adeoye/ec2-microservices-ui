import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { CacheService } from './cache.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { TransactionService } from './transaction.service';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { ACCESS_TOKEN } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly $notifications: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  socket: any;

  constructor(private httpClient: HttpClient, private accountService: AccountService,
    private router: Router,
    private cacheService: CacheService, private userService: UserService, private transactionService: TransactionService) {
  }

  getNotifications() {
    const token: string = this.cacheService.getItem(ACCESS_TOKEN);

    if (token) {
      const userId = this.userService.getUserId(token);
      this.httpClient.get(`${environment.apiGatewayUrl}/notifications/${userId}`).pipe(map((notifications: any) => {
        this.$notifications.next(notifications)
      })).subscribe({
        error: (err) => {
          // TODO show user try again to fetch notifications?
        }
      })
    }
  }

  createConnection = () => {
    this.socket = io(`${environment.apiGatewayUrl}`) // TODO import from environment file
    return this.socket;
  }

  subscribe(channel: string, handler: Function | null): void {
    this.socket.on(channel, (data: any) => {
      handler ? handler(data) : this.handleNotifications(data)
    })
  }

  sendMessage = (channel: string, message: string) => {
    this.socket.emit(channel, message)
  }

  handleNotifications = (notification: string) => {
    let notificationJson;
    try {
      notificationJson = JSON.parse(notification)
      this.$notifications.next([...this.$notifications.value, notificationJson])

    } catch (error) {
      throw new Error(`Error parsing JSON notification: , ${error}`)
    }

  }

  handleNotificationsRead = (notificationId: string) => {
    this.httpClient.post(`${environment.apiGatewayUrl}/notifications/${notificationId}`, {}).pipe(map((notificationReadResponse: any) => {

      const previousNotifications = this.$notifications.value;

      let updatedNotification: any;

      previousNotifications.forEach((notification: any) => {
        if (notification.id == notificationReadResponse.id) {
          notification.read = true;
          updatedNotification = notification
        }
      })
      this.$notifications.next([...previousNotifications])

      const notificationJSON = JSON.parse(updatedNotification.message)
      const accountNumberStartIndex = notificationJSON.notification.search(/ \d+/) + 1
      const accountNumber = notificationJSON.notification.slice(accountNumberStartIndex, accountNumberStartIndex + 10)
      this.router.navigate(['accounts'], { queryParams: { account: accountNumber } })

    })).subscribe({
      error: (error) => {
        // TODO handle error
        console.error(error)
      }
    })

  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}
