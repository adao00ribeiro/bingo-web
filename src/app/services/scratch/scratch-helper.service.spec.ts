import { TestBed } from '@angular/core/testing';

import { ScratchHelperService } from './scratch-helper.service';

describe('ScratchHelperService', () => {
  let service: ScratchHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScratchHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
