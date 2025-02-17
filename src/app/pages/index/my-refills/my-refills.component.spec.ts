import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRefillsComponent } from './my-refills.component';

describe('MyRefillsComponent', () => {
  let component: MyRefillsComponent;
  let fixture: ComponentFixture<MyRefillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRefillsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyRefillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
