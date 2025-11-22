import { TestBed } from '@angular/core/testing';

import { ScratchGameService } from './scratch-game.service';

describe('ScratchGameService', () => {
  let service: ScratchGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScratchGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
