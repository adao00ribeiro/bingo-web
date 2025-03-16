import { Component, inject, Input, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { CardComponent } from "../../card/card.component";
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { IWinningCardsInfo } from '../../../interfaces/IWinningCardsInfo';
import { EPrizeType, PRIZE_TYPE_TRANSLATIONS } from '../../../enums/EPrizeType';



export interface DialogWinnerProps {
  titlePrize: EPrizeType;
  winningCards : IWinningCardsInfo[];
  numbers:number[];
}
@Component({
  selector: 'app-dialog-winner',
  standalone: true,
  imports: [MatDialogContent, CardComponent , CurrencyPipe],
  templateUrl: './dialog-winner.component.html',
  styleUrl: './dialog-winner.component.scss'
})
export class DialogWinnerComponent {
  readonly dialogRef = inject(MatDialogRef<DialogWinnerProps>);
  readonly data = inject<DialogWinnerProps>(MAT_DIALOG_DATA);
  readonly winingCards = model(this.data.winningCards);
  readonly numbers = model(this.data.numbers);


  getTitle( ){
   return PRIZE_TYPE_TRANSLATIONS[this.data.titlePrize]
  }
}
