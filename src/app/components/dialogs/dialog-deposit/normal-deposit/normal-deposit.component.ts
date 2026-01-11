import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { IDepositRequest } from '../../../../interfaces/IDepositRequest';
import { CurrencyPipe } from '../../../../pipes/currency.pipe';

@Component({
  selector: 'app-normal-deposit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './normal-deposit.component.html',
  styleUrl: './normal-deposit.component.scss'
})
export class NormalDepositComponent {
  @Output() depositChange = new EventEmitter<IDepositRequest>();
  depositForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      value: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  emitDeposit() {
    if (this.depositForm.valid) {
      this.depositChange.emit({
        value: Number(this.depositForm.value.value),
        amount:0
      });
    }
  }
}
