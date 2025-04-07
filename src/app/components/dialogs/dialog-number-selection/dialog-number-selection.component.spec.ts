import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNumberSelectionComponent } from './dialog-number-selection.component';

describe('DialogNumberSelectionComponent', () => {
  let component: DialogNumberSelectionComponent;
  let fixture: ComponentFixture<DialogNumberSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogNumberSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogNumberSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
