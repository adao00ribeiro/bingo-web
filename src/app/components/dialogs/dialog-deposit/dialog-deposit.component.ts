import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { DepositService } from '../../../services/deposit/deposit.service';
import { IDepositRequest } from '../../../interfaces/IDepositRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/auth/user.service';
export interface DialogDeposit {

}
@Component({
  selector: 'app-dialog-deposit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatDialogContent,
    MatCardModule,
    MatButtonModule],
  templateUrl: './dialog-deposit.component.html',
  styleUrl: './dialog-deposit.component.scss'
})
export class DialogDepositComponent {
  depositForm: FormGroup;
  readonly dialogRef = inject(MatDialogRef<DialogDepositComponent>);
  readonly data = inject<DialogDeposit>(MAT_DIALOG_DATA);
  readonly depositService = inject(DepositService);
  private readonly userService = inject(UserService);
  readonly snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      value: ['', [Validators.required]],

    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  handleDepositClick() {
    const depositRequest: IDepositRequest = {
      value: this.depositForm.value.value,
    };
    this.depositService.Deposit(depositRequest).subscribe({
      next: (data) => {
       if(data){
        this.userService.loadUser();
       }
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
        this.snackBar.open("Depositado com Sucesso", 'Ok', {
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
