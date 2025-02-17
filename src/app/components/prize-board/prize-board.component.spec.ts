import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeBoardComponent } from './prize-board.component';

describe('PrizeBoardComponent', () => {
  let component: PrizeBoardComponent;
  let fixture: ComponentFixture<PrizeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrizeBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrizeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
