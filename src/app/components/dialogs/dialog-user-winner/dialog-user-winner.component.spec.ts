import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserWinnerComponent } from './dialog-user-winner.component';

describe('DialogUserWinnerComponent', () => {
  let component: DialogUserWinnerComponent;
  let fixture: ComponentFixture<DialogUserWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserWinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUserWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
