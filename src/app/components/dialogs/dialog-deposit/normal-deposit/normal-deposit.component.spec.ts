import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalDepositComponent } from './normal-deposit.component';

describe('NormalDepositComponent', () => {
  let component: NormalDepositComponent;
  let fixture: ComponentFixture<NormalDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
