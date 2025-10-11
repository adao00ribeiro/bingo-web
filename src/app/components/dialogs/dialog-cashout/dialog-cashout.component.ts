import { Component, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WithdrawalService } from '../../../services/withdrawal/withdrawal.service';
import { IWithdrawalRequest } from '../../../interfaces/IWithdrawalRequest';
import { PunterMeResourceService } from '../../../resource/punter/punter-me-resource.service';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { NgxCurrencyDirective } from 'ngx-currency';
export interface DialogCashout {

}
@Component({
  selector: 'app-dialog-cashout',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatDialogContent,
    MatCardModule,
    MatButtonModule,
  NgxCurrencyDirective],
  templateUrl: './dialog-cashout.component.html',
  styleUrl: './dialog-cashout.component.scss'
})
export class DialogCashoutComponent {
  depositForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<DialogCashoutComponent>);
  readonly data = inject<DialogCashout>(MAT_DIALOG_DATA);
  readonly withdrawalService = inject(WithdrawalService);
  protected readonly punterMeResourceService = inject(PunterMeResourceService);
  readonly snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      value: [0, [Validators.required]],

    });

    effect(()=>{
         const user =  this.punterMeResourceService.resource.value();

    })
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  handleWithdrawalClick() {
    const id = this.punterMeResourceService.resource.value()?.id
    if(!id){
      return;
    }
    const withdrawalRequest: IWithdrawalRequest = {
      amount: this.depositForm.value.value,
       entityId : id
    };
    this.withdrawalService.Create(withdrawalRequest).subscribe({
      next: (data) => {
       console.log(data)
      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
      },
      complete: () => {
        this.snackBar.open("Pedido de saque em Processamento", 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['sucess-snackbar'],
        });
        this.onNoClick();
      }
    });
  }
}
