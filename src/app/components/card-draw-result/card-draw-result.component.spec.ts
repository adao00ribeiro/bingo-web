import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDrawResultComponent } from './card-draw-result.component';

describe('CardDrawResultComponent', () => {
  let component: CardDrawResultComponent;
  let fixture: ComponentFixture<CardDrawResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDrawResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDrawResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
