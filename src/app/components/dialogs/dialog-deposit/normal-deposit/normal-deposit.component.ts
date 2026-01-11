import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { IDepositRequest } from '../../../../interfaces/IDepositRequest';
import { CurrencyPipe } from '../../../../pipes/currency.pipe';
import { currency, MaskedInputDirective, NgxBrazil, NgxBrazilMASKS, NgxBrazilValidators } from 'ngx-brazil';

@Component({
  selector: 'app-normal-deposit',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatButtonModule,
    MaskedInputDirective,
    NgxBrazil
],
  templateUrl: './normal-deposit.component.html',
  styleUrl: './normal-deposit.component.scss'
})
export class NormalDepositComponent {
  @Output() depositChange = new EventEmitter<IDepositRequest>();
  depositForm: FormGroup;
 public MASKS = NgxBrazilMASKS;
  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      currency: ['', [Validators.required, Validators.min(1),NgxBrazilValidators.currency ] ],
    });
  }

  emitDeposit() {

    if (this.depositForm.valid) {
      const rawValue = this.depositForm.value.currency;

      const value = Number(
      rawValue
        .replace('R$ ', '')
        .replace(/\./g, '')
        .replace(',', '.')
    );

      this.depositChange.emit({
        value: value,
        amount:0
      });
    }
  }
}
