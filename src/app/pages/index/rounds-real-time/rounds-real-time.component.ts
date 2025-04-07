import { Component,  computed,  effect, inject, Input, OnInit, signal } from '@angular/core';
import { Router} from '@angular/router';
import { PanelBallsComponent } from "../../../components/panel-balls/panel-balls.component";
import { CardComponent } from "../../../components/card/card.component";
import { SungNumbersComponent } from "../../../components/sung-numbers/sung-numbers.component";
import { PrizeBoardComponent } from "../../../components/prize-board/prize-board.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoundService } from '../../../services/round/round.service';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { AudioPlayerService } from '../../../services/audio-player.service';
import { CardsByPunterResourceService } from '../../../resource/card/cards-by-punter-resource.service';



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
  public readonly cardsByPunterResourceService = inject(CardsByPunterResourceService);
  public readonly snackBar = inject(MatSnackBar);
  public readonly roundsRealTimeService: RoundsRealTimeService = inject(RoundsRealTimeService);
  readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<DialogWinnerComponent> | null = null;
  private dialogAllWinnersRef: MatDialogRef<DialogAllWinnersComponent> | null = null;
  private router: Router = inject(Router);
  readonly audioPlayer = inject(AudioPlayerService);
  cards: ICard[] = [];
  rows: ICard[][] = [];
  round = signal<IRound | null>(null);
  roundMessage?: IRoundMessage;
  show_dialog = false;

  totalPrize = computed(() => {
    if (this.round()) {
      return this.round()?.prizes.reduce((total, prize) => total + prize.value, 0);
    }
    return 0;
  });
  constructor() {
    effect(() => {
      const currentRound = this.round();
      if (currentRound) {
        this.roundMessage = this.roundsRealTimeService.getRoundSignal()(currentRound.roomId, currentRound.id);
        console.log(this.roundMessage)
        if (this.roundMessage?.currentPrizeResult == null) {
          this.audioPlayer.playNumber(this.roundMessage.mainBall);
        }
        this.updateShowDialogWinner();
        this.playSong();
      }
      const paged = this.cardsByPunterResourceService.resource.value()

      if(paged){
        this.cards = paged.items
        this.rows = this.chunkArray(this.cards, 4);
      }

      if( this.cardsByPunterResourceService.resource.error()){
        this.snackBar.open("Erro de chamadas", 'Ok', {
          duration: 5000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
      }



    })
  }
  playSong() {
    var currentPrizeResult = this.roundMessage?.currentPrizeResult;
    if(currentPrizeResult==null){
      return;
    }
    const prizeAudioMap: Record<EPrizeType, () => void> = {
      [EPrizeType.FourInLine]: () => this.audioPlayer.playFourInLine(),
      [EPrizeType.FourCorners]: () => this.audioPlayer.playFourCorners(),
      [EPrizeType.SingleLine]: () => this.audioPlayer.playSingleLine(),
      [EPrizeType.SingleColumn]: () => this.audioPlayer.playSingleColumn(),
      [EPrizeType.Diagonal]: () => this.audioPlayer.playDiagonal(),
      [EPrizeType.InvertedDiagonal]: () => this.audioPlayer.playInvertedDiagonal(),
      [EPrizeType.DoubleLine]: () => this.audioPlayer.playDoubleLine(),
      [EPrizeType.DoubleColumn]: () => this.audioPlayer.playDoubleColumn(),
      [EPrizeType.TShape]: () => this.audioPlayer.playTShape(),
      [EPrizeType.XShape]: () => this.audioPlayer.playXShape(),
      [EPrizeType.PlusShape]: () => this.audioPlayer.playPlusShape(),
      [EPrizeType.OuterEdge]: () => this.audioPlayer.playOuterEdge(),
      [EPrizeType.FullCard]: () => {
        if (this.roundMessage?.isAccumulated) {
          this.audioPlayer.playAccumulated();
        } else {
          this.audioPlayer.playFullCard();
        }
      },
    };
    const playAudio = prizeAudioMap[currentPrizeResult.prizeType];
    if (playAudio) {
      playAudio();
    } else {
      console.warn("Áudio não encontrado para o tipo de prêmio:", currentPrizeResult.prizeType);
    }
  }
  ngOnInit(): void {
    this.getRound();
    this.cardsByPunterResourceService.reload(this.id,null,null);
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
        if(data.finishedDate){

        }

        this.round.set(data);
        console.log("opa",data)
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
