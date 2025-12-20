import { Component, computed, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
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
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { IRound } from '../../../interfaces/IRound';
import { DialogWinnerComponent } from '../../../components/dialogs/dialog-winner/dialog-winner.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EPrizeType } from '../../../enums/EPrizeType';
import { DialogAllWinnersComponent } from '../../../components/dialogs/dialog-all-winners/dialog-all-winners.component';
import { AudioPlayerService } from '../../../services/audio-player.service';
import { TableAlmostThereComponent } from "../../../components/tables/table-almost-there/table-almost-there.component";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { CardsByRoundIdResource } from '../../../resource/card/cards-by-round-id.resource';
import { TicketSelectorComponent } from "../../../components/ticket-selector/ticket-selector.component";
import { RoundTimerComponent } from '../../../components/round-timer/round-timer.component';
import { GuidPipe } from '../../../pipes/guid.pipe';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { PanelBallsComponent } from "../../../components/panel-balls/panel-balls.component";

@Component({
  selector: 'app-room-round-real-time',
  imports: [
    CurrencyPipe,
    GuidPipe,
    ScrollingModule,
    MatIconModule,
    MatButtonModule,
    CardComponent,
    SungNumbersComponent,
    PrizeBoardComponent,
    TableAlmostThereComponent,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    InfiniteScrollDirective,
    TicketSelectorComponent,
    RoundTimerComponent,
    PanelBallsComponent
],
  templateUrl: './room-round-real-time.component.html',
  styleUrl: './room-round-real-time.component.scss',
  animations: [
    trigger('rotateAnimation', [
      state('rotated', style({ transform: 'rotate(0deg)' })),
      state('default', style({ transform: 'rotate(-360deg)' })),
      transition('default => rotated', animate('500ms ease-out')),
      transition('rotated => default', animate('500ms ease-out')),
    ]),
    trigger('fadeAnimation', [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(
          "150ms ease-in-out",
          style({ opacity: 1 })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(
          "150ms ease-in-out",
          style({ opacity: 0, })
        )
      ])
    ]),
  ]
})
export class RoomRoundRealTimeComponent {
  round = input.required<IRound>();
  roundMessage = input.required<IRoundMessage>();
  public readonly roundService = inject(RoundService);
  public readonly cardsByRoundIdResource = inject(CardsByRoundIdResource);
  public readonly snackBar = inject(MatSnackBar);

  public readonly roundsRealTimeService: RoundsRealTimeService = inject(RoundsRealTimeService);
  readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<DialogWinnerComponent> | null = null;
  private dialogAllWinnersRef: MatDialogRef<DialogAllWinnersComponent> | null = null;
  private router: Router = inject(Router);
  readonly audioPlayer = inject(AudioPlayerService);
  private lastRoundId?: string;
  cards: ICard[] = [];
   totalCards:number = 0
  page = 1;
  pageSize = 50;
  totalItems = 1000; // Suponha que o total venha do backend
  loading = false;
  isStartedRound = signal(false);
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  show_dialog = false;
  prize_type = "";

  public isOpen = true;
  public iconState = 'default';
  getPrizes = computed(() => {
    return this.roundMessage() ? this.roundMessage()?.results : [
      {
        prizeId: '338d08c4-4449-421d-a467-96a71547b2fc',
        roundId: 'a419f7ee-3232-4ca1-bc66-cfec4fbd263f',
        prizeType: EPrizeType.FourInLine,
        value: 100,
        winningCards: [],
        listTopCards: [],
      },
      {
        prizeId: 'e349053d-0685-4d8e-889f-8faa490cc603',
        roundId: 'a419f7ee-3232-4ca1-bc66-cfec4fbd263f',
        prizeType: EPrizeType.SingleLine,
        value: 200,
        winningCards: [],
        listTopCards: [],
      },
      {
        prizeId: 'f897dabe-031a-4a58-ba1d-b2fa33566ca1',
        roundId: 'a419f7ee-3232-4ca1-bc66-cfec4fbd263f',
        prizeType: EPrizeType.FullCard,
        value: 300,
        winningCards: [],
        listTopCards: [],
      }
    ]
  })
  getImage = computed(() => {
    const maxBalls = this.round()?.maxBalls;
    return maxBalls ? `/images/${maxBalls}.png` : '/images/90.png';
  });
  totalPrize = computed(() => {
    if (this.round()) {
      return this.round()?.prizes.reduce((total, prize) => total + prize.value, 0);
    }
    return 0;
  });
  top_cards = computed(() => {
    if (true) {
      console.log("aki", this.cards);
      return this.cards;
    }

    if (!this.roundMessage()) {

      return this.cards;
    }

    const roundNumbersSet = new Set(this.roundMessage()?.numbers);
    const heap = []; // Simulando uma min-heap para os 20 melhores

    for (const card of this.cards) {
      const score = card.numbers.reduce(
        (count: number, num: number) => count + (roundNumbersSet.has(num) ? 1 : 0), 0
      );

      if (heap.length < 100) {
        heap.push({ ...card, score });
        heap.sort((a, b) => a.score - b.score); // Ordenação apenas dos 20 elementos
      } else if (score > heap[0].score) {
        heap[0] = { ...card, score };
        heap.sort((a, b) => a.score - b.score); // Reorganiza a heap com os melhores
      }
    }
    return heap.sort((a, b) => b.score - a.score); // Ordena do maior para o menor
  })


  top_list = computed(() => {
    const prize_results = this.roundMessage()?.results;

    if (prize_results == null) {
      return [];
    }
    var result = prize_results.find((p) => p.prizeType == EPrizeType.FullCard);

    if (result) {
      return result.listTopCards;
    } else {
      return [];
    }
  });

  constructor() {
    // Effect específico para mudanças na roundMessage da sala atual
    effect(() => {

      const currentRound = this.round();

      if (currentRound) {

        if (this.lastRoundId !== currentRound.id) {
          this.lastRoundId = currentRound.id;
          this.isStartedRound.set(false);
        }
      }

      const currentRoundEventData = this.roundMessage(); // 👈 dependência reativa
      if (currentRoundEventData) {

        if (currentRoundEventData.currentPrizeResult == null) {
          this.audioPlayer.playNumber(currentRoundEventData.mainBall ?? 0);
        }
        this.updateShowDialogWinner();
        this.playSong();
      }
    });

    // Effect separado para cards (não relacionado aos rounds)
    effect(() => {
      const paged = this.cardsByRoundIdResource.resource.value();
      if (paged) {
        this.cards = [...this.cards, ...paged.rows];
        this.totalCards = this.cards.length;
        this.totalItems += paged.rowsCount;
        this.loading = false;
      }

      if (this.cardsByRoundIdResource.resource.error()) {
        this.snackBar.open("Erro de chamadas", 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: 'error-snackbar',
        });
      }
    });
  }
   reloadCards(){
      this.cards = []
      this.cardsByRoundIdResource.resource.reload();
    }
  playSong() {
    var currentPrizeResult = this.roundMessage()?.currentPrizeResult;
    if (currentPrizeResult == null) {
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
        if (this.roundMessage()?.isAccumulated) {
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

    this.loadNextPage();
    if (window.innerWidth < 768) {
      this.isOpen = false;
    }
  }

  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  openDialogWinner() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(DialogWinnerComponent, {
        disableClose: true,
        data: {
          titlePrize: this.roundMessage()?.currentPrizeResult?.prizeType,
          winningCards: this.roundMessage()?.currentPrizeResult?.winningCards,
          numbers: this.roundMessage()?.numbers
        }
      });

      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef = null;
      });
    }
  }

  openDialogAllWinners() {
    if (!this.dialogAllWinnersRef) {
      this.dialogAllWinnersRef = this.dialog.open(DialogAllWinnersComponent, {
        disableClose: true,
        maxWidth: '95vw',
        maxHeight: '95vh',
        height: '95%',
        width: '95%',
        data: {
          results: this.roundMessage()?.results
        }
      });
      this.dialogAllWinnersRef.afterClosed().subscribe(() => {
        this.dialogAllWinnersRef = null;
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
    const roundMessageValue = this.roundMessage();
    if (roundMessageValue?.currentPrizeResult != null) {
      this.openDialogWinner();
      if (roundMessageValue.numbers.length === 90 || roundMessageValue.currentPrizeResult.prizeType == EPrizeType.FullCard) {
        if (roundMessageValue.currentPrizeResult.winningCards.length > 0) {
          setTimeout(() => {
            this.closeDialogWinner();
            this.openDialogAllWinners();
          }, 10000);
          setTimeout(() => {
            this.closeDialogAllWinner();
            this.router.navigate(["/"]);
          }, roundMessageValue.isAccumulated ? 15000 : 20000);
        }
      }
    } else {
      this.closeDialogWinner();
    }
  }
  onScroll() {
    if (this.loading) {
      return;
    }
    this.loadNextPage();
  }

  loadNextPage() {
    const roundId = this.round()?.id

    if (!roundId) {
      return;
    }
    this.loading = true;
    this.cardsByRoundIdResource.reload({ roundId: roundId, page: this.page, size: this.pageSize });
    this.page++;
  }
  public onChangeChatState(): void {
    this.isOpen = !this.isOpen;
    this.iconState = (this.iconState === 'default' ? 'rotated' : 'default');
  }
}
