import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexRoomComponent } from './index-room.component';

describe('IndexRoomComponent', () => {
  let component: IndexRoomComponent;
  let fixture: ComponentFixture<IndexRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
