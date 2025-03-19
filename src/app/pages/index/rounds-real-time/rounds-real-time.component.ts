import { ChangeDetectionStrategy, Component, computed, effect, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PanelBallsComponent } from "../../../components/panel-balls/panel-balls.component";
import { CardComponent } from "../../../components/card/card.component";
import { SungNumbersComponent } from "../../../components/sung-numbers/sung-numbers.component";
import { PrizeBoardComponent } from "../../../components/prize-board/prize-board.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoundService } from '../../../services/round/round.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardService } from '../../../services/card/card.service';
import { ICard } from '../../../interfaces/ICard';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { IRoundMessage } from '../../../interfaces/IRoundMessage';
import { GuidPipe } from '../../../pipes/guid.pipe';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { IRound } from '../../../interfaces/IRound';
import { DialogWinnerComponent } from '../../../components/dialogs/dialog-winner/dialog-winner.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EPrizeType } from '../../../enums/EPrizeType';
import { DialogAllWinnersComponent } from '../../../components/dialogs/dialog-all-winners/dialog-all-winners.component';



@Component({
  selector: 'app-rounds-real-time',
  standalone: true,
  imports: [CurrencyPipe, GuidPipe, ScrollingModule, MatIconModule, MatButtonModule, PanelBallsComponent, CardComponent, SungNumbersComponent, PrizeBoardComponent],
  templateUrl: './rounds-real-time.component.html',
  styleUrl: './rounds-real-time.component.scss',
})
export class RoundsRealTimeComponent implements OnInit {
  @Input() id = '';
  isMuted: boolean = false; // Variável para controlar o estado de som
  public readonly roundService = inject(RoundService);
  public readonly cardService = inject(CardService);
  public readonly snackBar = inject(MatSnackBar);
  public readonly roundsRealTimeService: RoundsRealTimeService = inject(RoundsRealTimeService);
  readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<DialogWinnerComponent> | null = null;
  private dialogAllWinnersRef: MatDialogRef<DialogAllWinnersComponent> | null = null;
  private router: Router = inject(Router);

  cards: ICard[] = [];
  rows: ICard[][] = [];
  round = signal<IRound | null>(null);
  roundMessage?: IRoundMessage;
  show_dialog = false;


  constructor() {
    effect(() => {
      const currentRound = this.round();
      if (currentRound) {
        this.roundMessage = this.roundsRealTimeService.getRoundSignal()(currentRound.roomId, currentRound.id);
        console.log(this.roundMessage)
        this.updateShowDialogWinner();
      }
    })
  }
  ngOnInit(): void {

    this.getRound();
    this.cardService.GetAllByIdRound(this.id).subscribe({
      next: (data) => {
        this.cards = data
        this.rows = this.chunkArray(this.cards, 4);
      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
        // Aqui você pode implementar a lógica para lidar com o erro, como exibir uma mensagem ao usuário
      },
      complete: () => {

      }
    });
  }
  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  getRound(): void {
    this.roundService.GetById(this.id).subscribe({
      next: (data) => {
        this.round.set(data);
      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
        // Aqui você pode implementar a lógica para lidar com o erro, como exibir uma mensagem ao usuário
      },
      complete: () => {

      }
    });
  }
  openDialogWinner() {
    if (!this.dialogRef) { // Evita abrir múltiplas instâncias
      this.dialogRef = this.dialog.open(DialogWinnerComponent, {
        disableClose: true,
        data: {
          titlePrize: this.roundMessage?.currentPrizeResult?.prizeType,
          winningCards: this.roundMessage?.currentPrizeResult?.winningCards,
          numbers: this.roundMessage?.numbers
        }
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null; // Reseta a referência quando fechar
      });
    }
  }
  openDialogAllWinners() {
    if (!this.dialogAllWinnersRef) { // Evita abrir múltiplas instâncias
      this.dialogAllWinnersRef =  this.dialog.open(DialogAllWinnersComponent, {
        disableClose: true,
        maxWidth: '95vw',
        maxHeight: '95vh',
        height: '95%',
        width: '95%',
        data: {
          results: this.roundMessage?.results
        }
      });

      this.dialogAllWinnersRef.afterClosed().subscribe(() => {
        this.dialogAllWinnersRef = null; // Reseta a referência quando fechar
      });
    }

  }
  closeDialogWinner() {
    this.dialogRef?.close();
    this.dialogRef = null;
  }
  closeDialogAllWinner() {
    this.dialogAllWinnersRef?.close();
    this.dialogAllWinnersRef = null;
  }
  updateShowDialogWinner() {
    if (this.roundMessage?.currentPrizeResult != null) {
      this.openDialogWinner();
      if (this.roundMessage.numbers.length === 90 || this.roundMessage.currentPrizeResult.prizeType == EPrizeType.FullCard )  {
        if(this.roundMessage.currentPrizeResult.winningCards.length > 0){
        setTimeout(() => {
          this.closeDialogWinner();
          this.openDialogAllWinners();
        }, 10000);
        setTimeout(() => {
          this.closeDialogAllWinner();
          this.router.navigate(["/"]);
        }, this.roundMessage.isAccumulated ? 15000 : 40000);
      }
      }
    } else {
      this.closeDialogWinner();
    }
  }
}
