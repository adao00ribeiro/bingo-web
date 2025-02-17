import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsRealTimeComponent } from './rounds-real-time.component';

describe('RoundsRealTimeComponent', () => {
  let component: RoundsRealTimeComponent;
  let fixture: ComponentFixture<RoundsRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundsRealTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoundsRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
