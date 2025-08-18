import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DepositService } from '../../../services/deposit/deposit.service';
import { IDepositRequest } from '../../../interfaces/IDepositRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/auth/user.service';
import { DialogQrcodeComponent } from '../dialog-qrcode/dialog-qrcode.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { NormalDepositComponent } from "./normal-deposit/normal-deposit.component";
import { CryptoDepositComponent } from "./crypto-deposit/crypto-deposit.component";
import { WalletService } from '../../../services/wallet/wallet.service';

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
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTabsModule,
    NormalDepositComponent,
    CryptoDepositComponent
  ],
  templateUrl: './dialog-deposit.component.html',
  styleUrl: './dialog-deposit.component.scss'
})
export class DialogDepositComponent {
  @ViewChild('normalDeposit') normalDepositComponent: any;
  @ViewChild('criptoDeposit') criptoDepositComponent: any;
  readonly dialogRef = inject(MatDialogRef<DialogDepositComponent>);
  readonly data = inject<DialogDeposit>(MAT_DIALOG_DATA);
  readonly depositService = inject(DepositService);
  private readonly userService = inject(UserService);
  protected readonly walletService = inject(WalletService);

  readonly snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  isNormalDeposit = true;

  depositRequest?: IDepositRequest;
  onNoClick(): void {
    this.dialogRef.close();
  }

  async handleDepositClick() {

    if (!this.isNormalDeposit) {
      this.criptoDepositComponent.emitDeposit();

      const valor = Number(this.depositRequest?.amount);
      const destino = "0x621428AFD56F5A2F3AD241FfAc9Fb3Fc4C1A9d22";


      const txHash = await this.walletService.sendBNB(destino, valor);
      console.log("Tx USDT enviada:", txHash);

      this.depositRequest = {
        ...this.depositRequest,
        value: valor,
        network: "BSC",
        token: "BNB",
        transactionHash: txHash,
        destinationAddress: destino
      };

    } else {
      this.normalDepositComponent.emitDeposit();
    }
    console.log(this.depositRequest)
    if (!this.depositRequest) {
      return;
    }
    return;
    this.depositService.Deposit({ value: 0, amount: 0 }).subscribe({
      next: (data) => {
        if (data) {
          this.dialog.open(DialogQrcodeComponent, {
            disableClose: true,
            data: {
              recharge: data
            },
          });
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

  onTabChange(event: MatTabChangeEvent) {
    this.isNormalDeposit = event.index === 0;
    console.log('Depósito normal?', this.isNormalDeposit);
  }

}
