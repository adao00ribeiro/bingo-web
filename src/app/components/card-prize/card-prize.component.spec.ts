import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPrizeComponent } from './card-prize.component';

describe('CardPrizeComponent', () => {
  let component: CardPrizeComponent;
  let fixture: ComponentFixture<CardPrizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPrizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
