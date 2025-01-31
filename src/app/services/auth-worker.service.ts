import { Injectable } from '@angular/core';
import { IAuthWorkerSErvice } from './auth-worker.interface.service';

@Injectable({
  providedIn: 'root'
})
export class AuthWorkerService implements IAuthWorkerSErvice {

  constructor() {

  }

  createWorker(url: URL): Worker {
    return new Worker(url)
  }

  process(): void {
    throw new Error('Method not implemented.');
  }

  terminate(worker: Worker): void {
    throw new Error('Method not implemented.');
  }

}
