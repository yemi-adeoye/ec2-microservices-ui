export interface IAuthWorkerSErvice {
  createWorker(url: URL): Worker

  process(): void

  terminate(worker: Worker): void
}
