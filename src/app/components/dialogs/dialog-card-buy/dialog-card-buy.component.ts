import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardBuyComponent } from "../../card-buy/card-buy.component";
import { IRound } from '../../../interfaces/IRound';
export interface DialogCardBuyProps {
  round: IRound;
}
@Component({
  selector: 'app-dialog-card-buy',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,  MatDialogContent,   MatButtonModule, CardBuyComponent],
  templateUrl: './dialog-card-buy.component.html',
  styleUrl: './dialog-card-buy.component.scss'
})
export class DialogCardBuyComponent {

  readonly dialogRef = inject(MatDialogRef<DialogCardBuyComponent>);
  readonly data = inject<DialogCardBuyProps>(MAT_DIALOG_DATA);
  readonly round = model(this.data.round);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
