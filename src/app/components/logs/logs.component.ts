import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, delay, map, Subscription } from 'rxjs';
import { LogDetails } from '../../models/LogDetails';
import { AsyncPipe, NgFor, SlicePipe } from '@angular/common';
import { LoggingService } from '../../services/logging.service';

@Component({
  selector: 'app-logs',
  imports: [NgFor, AsyncPipe, SlicePipe],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss'
})
export class LogsComponent implements OnInit, OnDestroy {
  currentPage: number = 20

  $logs: BehaviorSubject<LogDetails[]>
    = new BehaviorSubject<LogDetails[]>([])
  isLoadingLogs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  isLogLoadError$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  loggingSubscription?: Subscription

  constructor(private readonly loggingService: LoggingService) {

  }


  ngOnInit(): void {
    this.loggingSubscription = this.loggingService.getUserLogs()
      .pipe(map((logs: any) => {
        this.isLogLoadError$.next(false)
        this.isLoadingLogs$.next(false)
        logs.sort((a: LogDetails, b: LogDetails) =>
          new Date(b.callTime).valueOf() - new Date(a.callTime).valueOf())
        this.$logs.next(logs)
      }))
      .subscribe({
        error: (error) => {
          this.isLoadingLogs$.next(false)
          this.isLogLoadError$.next(true)
          console.error(error)
        }
      })
  }

  ngOnDestroy(): void {
    this.loggingSubscription?.unsubscribe()
  }


}
