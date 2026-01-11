import { TestBed } from '@angular/core/testing';

import { OnlineHouseService } from './online-house.service';

describe('OnlineHouseService', () => {
  let service: OnlineHouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineHouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
