import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMyRechargeComponent } from './card-my-recharge.component';

describe('CardMyRechargeComponent', () => {
  let component: CardMyRechargeComponent;
  let fixture: ComponentFixture<CardMyRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMyRechargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMyRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
