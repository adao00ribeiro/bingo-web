import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDepositComponent } from './dialog-deposit.component';

describe('DialogDepositComponent', () => {
  let component: DialogDepositComponent;
  let fixture: ComponentFixture<DialogDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDepositComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
