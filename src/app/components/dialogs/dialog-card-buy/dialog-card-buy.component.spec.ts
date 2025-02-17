import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCardBuyComponent } from './dialog-card-buy.component';

describe('DialogCardBuyComponent', () => {
  let component: DialogCardBuyComponent;
  let fixture: ComponentFixture<DialogCardBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCardBuyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogCardBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
