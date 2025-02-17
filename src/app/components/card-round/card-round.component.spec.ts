import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRoundComponent } from './card-round.component';

describe('CardRoundComponent', () => {
  let component: CardRoundComponent;
  let fixture: ComponentFixture<CardRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
