import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPurchesedComponent } from './card-purchesed.component';

describe('CardPurchesedComponent', () => {
  let component: CardPurchesedComponent;
  let fixture: ComponentFixture<CardPurchesedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPurchesedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardPurchesedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
