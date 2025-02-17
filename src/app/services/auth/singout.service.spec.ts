import { TestBed } from '@angular/core/testing';

import { SingoutService } from './singout.service';

describe('SingoutService', () => {
  let service: SingoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
