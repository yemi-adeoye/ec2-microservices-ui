import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { CacheService } from './cache.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly $notifications: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  socket: any;

  constructor(private httpClient: HttpClient, private cacheService: CacheService, private userService: UserService) {

  }

  getNotifications() {
    const token: string = this.cacheService.getItem('ACCESS_TOKEN');

    if (token) {
      const userId = this.userService.getUserId(token);
      this.httpClient.get(`http://localhost:7000/notifications/${userId}`).pipe(map((notifications: any) => {
        console.log('notifications: ', notifications)
        this.$notifications.next(notifications)
      })).subscribe({
        error: (err) => {
          // TODO show user try again to fetch notifications?
          console.log(err)
        }
      })
    }
  }

  createConnection = () => {
    this.socket = io("http://localhost:7000") // TODO import from environment file
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
    console.log({ notification })
  }

  handleNotificationsRead = (notificationId: string) => {
    this.httpClient.post(`http://localhost:7000/notifications/${notificationId}`, {}).pipe(map((notificationReadResponse: any) => {

      this.$notifications.pipe(map((notifications: any) => {
        notifications.forEach((notification: any) => {
          if (notification.id == notificationReadResponse.id) {
            notification.read = true;
          }
        })
        this.$notifications.next([...notifications])
      })).subscribe()

    })).subscribe({
      error: (error) => {
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
