import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomRoundRealTimeComponent } from './room-round-real-time.component';

describe('RoomRoundRealTimeComponent', () => {
  let component: RoomRoundRealTimeComponent;
  let fixture: ComponentFixture<RoomRoundRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomRoundRealTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomRoundRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
