import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoDepositComponent } from './crypto-deposit.component';

describe('CryptoDepositComponent', () => {
  let component: CryptoDepositComponent;
  let fixture: ComponentFixture<CryptoDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
