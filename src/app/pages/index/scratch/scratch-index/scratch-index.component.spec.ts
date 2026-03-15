import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScratchIndexComponent } from './scratch-index.component';

describe('ScratchIndexComponent', () => {
  let component: ScratchIndexComponent;
  let fixture: ComponentFixture<ScratchIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScratchIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScratchIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
