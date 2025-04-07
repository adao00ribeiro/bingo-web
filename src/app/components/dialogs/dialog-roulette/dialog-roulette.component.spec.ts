import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRouletteComponent } from './dialog-roulette.component';

describe('DialogRouletteComponent', () => {
  let component: DialogRouletteComponent;
  let fixture: ComponentFixture<DialogRouletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRouletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogRouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
