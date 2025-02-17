import { TestBed } from '@angular/core/testing';

import { CardBuyService } from './card-buy.service';

describe('CardBuyService', () => {
  let service: CardBuyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardBuyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
