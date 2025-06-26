import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IRecharge } from '../../../interfaces/IRecharge';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
export interface DialogQrCode {
  recharge : IRecharge
}
@Component({
  selector: 'app-dialog-qrcode',
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
      MatButtonModule],
  templateUrl: './dialog-qrcode.component.html',
  styleUrl: './dialog-qrcode.component.scss'
})
export class DialogQrcodeComponent {
  readonly dialogRef = inject(MatDialogRef<DialogQrcodeComponent>);
    readonly data = inject<DialogQrCode>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyPixKey(){
  navigator.clipboard.writeText(this.data.recharge.qrcode);
  const textarea = document.createElement('textarea');
  textarea.value = this.data.recharge.qrcode;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  //this.isCopied = copied;
  //setTimeout(() => {
  //  this.isCopied = false;
  //}, 2000);
  }
}
