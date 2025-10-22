import { TestBed } from '@angular/core/testing';
import { CardWinnersService } from './card-winners.service';



describe('CardWinnersService', () => {
  let service: CardWinnersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardWinnersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
