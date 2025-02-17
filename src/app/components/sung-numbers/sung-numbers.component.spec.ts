import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SungNumbersComponent } from './sung-numbers.component';

describe('SungNumbersComponent', () => {
  let component: SungNumbersComponent;
  let fixture: ComponentFixture<SungNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SungNumbersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SungNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
