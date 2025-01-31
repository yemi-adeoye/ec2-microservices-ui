import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly $notifications: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private httpClient: HttpClient) {

  }

  getNotifications() {

  }

  createConnection = () => {
    const socket = io("http://localhost:7000") // TODO import from environment file
    return socket;
  }

  subscribe = (socket: Socket, channel: string, handler: Function) => {
    socket.on(channel, (data) => {
      handler(data)
    })
  }

  sendMessage = (socket: Socket, channel: string, message: string) => {
    socket.emit(channel, message)
  }
}
