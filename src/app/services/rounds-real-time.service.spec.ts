import { TestBed } from '@angular/core/testing';

import { RoundsRealTimeService } from './rounds-real-time.service';

describe('RoundsRealTimeService', () => {
  let service: RoundsRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundsRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
