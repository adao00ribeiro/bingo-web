import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiqueGanheComponent } from './indique-ganhe.component';

describe('IndiqueGanheComponent', () => {
  let component: IndiqueGanheComponent;
  let fixture: ComponentFixture<IndiqueGanheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndiqueGanheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndiqueGanheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
