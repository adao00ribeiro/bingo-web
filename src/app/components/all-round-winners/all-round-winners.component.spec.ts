import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRoundWinnersComponent } from './all-round-winners.component';

describe('AllRoundWinnersComponent', () => {
  let component: AllRoundWinnersComponent;
  let fixture: ComponentFixture<AllRoundWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRoundWinnersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllRoundWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
