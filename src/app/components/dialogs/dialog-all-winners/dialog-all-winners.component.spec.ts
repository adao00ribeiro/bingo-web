import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAllWinnersComponent } from './dialog-all-winners.component';

describe('DialogAllWinnersComponent', () => {
  let component: DialogAllWinnersComponent;
  let fixture: ComponentFixture<DialogAllWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAllWinnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAllWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
