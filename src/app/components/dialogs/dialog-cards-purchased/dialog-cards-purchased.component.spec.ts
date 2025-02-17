import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCardsPurchasedComponent } from './dialog-cards-purchased.component';

describe('DialogCardsPurchasedComponent', () => {
  let component: DialogCardsPurchasedComponent;
  let fixture: ComponentFixture<DialogCardsPurchasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCardsPurchasedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCardsPurchasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
