import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWinnerComponent } from './dialog-winner.component';

describe('DialogWinnerComponent', () => {
  let component: DialogWinnerComponent;
  let fixture: ComponentFixture<DialogWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWinnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
