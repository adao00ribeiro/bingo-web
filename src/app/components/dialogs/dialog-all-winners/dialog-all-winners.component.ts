import { Component, inject } from '@angular/core';
import { IPrizeResult } from '../../../interfaces/IPrizeResult';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { EPrizeType, PRIZE_TYPE_TRANSLATIONS } from '../../../enums/EPrizeType';
export interface DialogAllWinnerProps {
  results : IPrizeResult[];
}
@Component({
  selector: 'app-dialog-all-winners',
  imports: [MatDialogContent,CurrencyPipe],
  templateUrl: './dialog-all-winners.component.html',
  styleUrl: './dialog-all-winners.component.scss'
})
export class DialogAllWinnersComponent {
 readonly dialogRef = inject(MatDialogRef<DialogAllWinnerProps>);
 readonly data = inject<DialogAllWinnerProps>(MAT_DIALOG_DATA);

  getTitle( prizeType : EPrizeType){
   return PRIZE_TYPE_TRANSLATIONS[prizeType]
  }

}
