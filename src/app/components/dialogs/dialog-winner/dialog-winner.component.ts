import { Component, Input } from '@angular/core';
import { MatDialogContent } from '@angular/material/dialog';
import { CardComponent } from "../../card/card.component";
import { CurrencyPipe } from '../../../pipes/currency.pipe';

@Component({
  selector: 'app-dialog-winner',
  standalone: true,
  imports: [MatDialogContent, CardComponent , CurrencyPipe],
  templateUrl: './dialog-winner.component.html',
  styleUrl: './dialog-winner.component.scss'
})
export class DialogWinnerComponent {
  @Input() titlePrize!: string;
  @Input() winningCards: any[] = [];
  @Input() numbers: number[] = [];

  getTitle(): string {
    switch (this.titlePrize) {
      case 'Bingo::PrizeFourNumber':
        return 'Premio 1';
      case 'Bingo::PrizeFullRow':
        return 'Premio 2';
      case 'Bingo::PrizeFullCard':
        return 'Premio 3';
      default:
        return 'Premio';
    }
  }
}
