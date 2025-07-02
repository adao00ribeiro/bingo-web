import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInactivateAccountComponent } from './dialog-inactivate-account.component';

describe('DialogInactivateAccountComponent', () => {
  let component: DialogInactivateAccountComponent;
  let fixture: ComponentFixture<DialogInactivateAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInactivateAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogInactivateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
