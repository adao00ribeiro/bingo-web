import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCashoutComponent } from './dialog-cashout.component';

describe('DialogCashoutComponent', () => {
  let component: DialogCashoutComponent;
  let fixture: ComponentFixture<DialogCashoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCashoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCashoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
