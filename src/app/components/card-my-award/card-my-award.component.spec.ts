import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMyAwardComponent } from './card-my-award.component';

describe('CardMyAwardComponent', () => {
  let component: CardMyAwardComponent;
  let fixture: ComponentFixture<CardMyAwardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMyAwardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardMyAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
