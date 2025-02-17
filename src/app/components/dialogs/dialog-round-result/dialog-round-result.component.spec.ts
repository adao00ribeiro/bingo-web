import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRoundResultComponent } from './dialog-round-result.component';

describe('DialogRoundResultComponent', () => {
  let component: DialogRoundResultComponent;
  let fixture: ComponentFixture<DialogRoundResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRoundResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogRoundResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
