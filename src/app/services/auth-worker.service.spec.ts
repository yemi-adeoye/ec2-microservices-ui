import { TestBed } from '@angular/core/testing';

import { AuthWorkerService } from './auth-worker.service';

describe('AuthWorkerService', () => {
  let service: AuthWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
