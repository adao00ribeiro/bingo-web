import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  signal,
  DestroyRef,
  AfterViewInit,
  Input,
  input
} from '@angular/core';
import { ScratchTicketService } from '../../../services/scratch/scratch-ticket/scratch-ticket.service';
import { CanvasService } from '../../../services/canvas.service';
import { Subscription } from 'rxjs';
import { IScratchBuyRequest } from '../../../interfaces/request/scratch/IScratchBuyRequest';
import { PunterMeResource } from '../../../resource/punter/punter-me.resource';
import { IScratchTicketResponse } from '../../../interfaces/response/scratch/IScratchTicketResponse';
import { CurrencyPipe } from '../../../pipes/currency.pipe';
import { ScratchGameOverrideService } from '../../../services/scratch/scratch-game-override/scratch-game-override.service';
import { IScratchGameOverrideResponse } from '../../../interfaces/response/scratch/IScratchGameOverrideResponse';

@Component({
  selector: 'app-scratch',
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './scratch.component.html',
  styleUrl: './scratch.component.scss'
})
export class ScratchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scratchCanvas', { static: false })
  private readonly scratchCanvas!: ElementRef<HTMLCanvasElement>;
  scratchSellerGameId = input('');
  private readonly punterMeResource = inject(PunterMeResource);
  private readonly scratchTicketService = inject(ScratchTicketService);
  private readonly scratchGameOverrideService = inject(ScratchGameOverrideService);
  private readonly canvasService = inject(CanvasService);
  private readonly destroyRef = inject(DestroyRef);

  ticket?: IScratchTicketResponse;
  layoutSize = 9;
  isScratching = false;
  imagesLoaded = false;
  loadingProgress = 0;
  audio = new Audio('/audios/cash-register.mp3');
  gamesOnlineSeller: IScratchGameOverrideResponse | undefined = undefined;

  // Estados do jogo
  gameState = {
    animals: [] as any[],
    scratchedBoxes: [] as any[],
    isEnded: false,
    isWon: false,
    winningAnimal: '',
    isStarted: false,
    isProcessingResult: false,
    canPlayAgain: true,
    showResultImage: false // Nova flag para mostrar imagem de resultado
  };

  private subs = new Subscription();
  private resultImageTimeout?: any;

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.initializeGame();
  }

  ngAfterViewInit(): void {
    if (this.imagesLoaded) this.initializeCanvasAfterMount();
  }

  ngOnDestroy(): void {
    this.canvasService.cleanup();
    this.subs.unsubscribe();
    if (this.resultImageTimeout) {
      clearTimeout(this.resultImageTimeout);
    }
  }

  async initializeGame() {
    try {
      this.loadingProgress = 10;
      await this.loadGameData();
      this.loadingProgress = 30;
      await this.preloadImages();
      this.loadingProgress = 100;

      setTimeout(() => {
        this.imagesLoaded = true;
        setTimeout(() => this.initializeCanvasAfterMount(), 100);
      }, 300);
    } catch (err) {
      console.error('Erro ao inicializar jogo:', err);
      this.imagesLoaded = true;
    }
  }

  async loadGameData() {
    this.scratchGameOverrideService.GetById(this.scratchSellerGameId()).subscribe({
      next: (data) => {
        if (data) {
          this.gamesOnlineSeller = data;
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados do jogo:', err);
      }
    });
    this.gameState.scratchedBoxes = Array(this.layoutSize).fill({ symbol: '' });
  }

  async preloadImages() {
    const images = [
      this.getImageInitial(),      // Imagem inicial (antes de jogar)
      this.getImageGame(),          // Imagem durante o jogo
      this.getImageWin(),           // Imagem de vitória
      this.getImageLose()           // Imagem de derrota
    ];

    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => {
          console.warn('Falha ao carregar imagem:', src);
          resolve();
        };
      });

    const total = images.length;
    for (let i = 0; i < total; i++) {
      await loadImage(images[i]);
      this.loadingProgress = 30 + ((i + 1) / total) * 50;
    }
  }

  initializeCanvasAfterMount() {
    const canvas = this.scratchCanvas?.nativeElement;
    if (!canvas) return;

    const gridConfig = { rows: 3, cols: 3, gap: 5 };
    const imageToUse = this.getCurrentCanvasImage();
    this.canvasService.initializeCanvas(canvas, gridConfig, imageToUse);
    this.canvasService.setupResizeObserver(() => console.log('Canvas resized'));
  }

  // Retorna a imagem apropriada baseada no estado do jogo
  getCurrentCanvasImage(): string {
    if (!this.gameState.isStarted) {
      return this.getImageInitial();
    }
    if (this.gameState.showResultImage) {
      return this.gameState.isWon ? this.getImageWin() : this.getImageLose();
    }
    return this.getImageGame();
  }

  // Imagem inicial (antes de jogar)
  getImageInitial(): string {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha-inicial.jpg';
    if (id == '1') return '/images/raspadinha-inicial.jpg';
    if (id == '2') return '/images/raspadinha-inicial.jpg';
    return '/images/raspadinha-inicial.jpg';
  }

  // Imagem durante o jogo (para raspar)
  getImageGame(): string {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha-jogo.jpg';
    if (id == '1') return '/images/raspadinha-jogo.jpg';
    if (id == '2') return '/images/raspadinha-jogo-2.jpg';
    return '/images/raspadinha-jogo.jpg';
  }

  // Imagem de vitória
  getImageWin(): string {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha-ganhou.jpg';
    if (id == '1') return '/images/raspadinha-ganhou.jpg';
    if (id == '2') return '/images/raspadinha-ganhou.jpg';
    return '/images/raspadinha-ganhou.jpg';
  }

  // Imagem de derrota
  getImageLose(): string {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha-perdeu.jpg';
    if (id == '1') return '/images/raspadinha-perdeu.jpg';
    if (id == '2') return '/images/raspadinha-perdeu.jpg';
    return '/images/raspadinha-perdeu.jpg';
  }

  getBackgroundGame() {
    return this.getCurrentCanvasImage();
  }

  getPrice(): number {
    return this.gamesOnlineSeller?.scratchGame.price || this.gamesOnlineSeller?.scratchGame?.price || 0;
  }

  prizeMessage(): string {
    const state = this.gameState;
    if (!state.isStarted) return 'Clique em Jogar para começar';
    if (state.isProcessingResult) return 'Processando resultado...';
    if (!state.isEnded) return 'Raspe os Slots para descobrir o resultado';
    if (state.showResultImage) return ''; // Esconde mensagem quando mostra imagem
    if (state.isWon) {
      return `🎉 JACKPOT! Você ganhou ${this.ticket ? this.ticket.prizeWon : ''}!`;
    }
    return '💀 Que pena!';
  }

  isWinningBox(index: number): boolean {
    return this.gameState.isWon && this.gameState.animals[index] === this.gameState.winningAnimal;
  }

  canPlay(): boolean {
    return this.gameState.canPlayAgain && !this.gameState.isProcessingResult;
  }

  async play() {
    if (!this.canPlay()) return;

    // Limpa timeout anterior se existir
    if (this.resultImageTimeout) {
      clearTimeout(this.resultImageTimeout);
    }

    // Reseta o estado do jogo
    this.gameState = {
      ...this.gameState,
      isStarted: true,
      isEnded: false,
      isWon: false,
      winningAnimal: '',
      scratchedBoxes: [],
      isProcessingResult: false,
      canPlayAgain: false,
      showResultImage: false
    };

    this.ticket = undefined;

    const buy: IScratchBuyRequest = {
      quantity: 1,
      scratchSellerGameId: this.gamesOnlineSeller?.id,
      punterId: this.punterMeResource.resource.value()?.id
    };

    try {
      this.scratchTicketService.buyTicket(buy).subscribe({
        next: (data) => {
          if (data && data.attributes) {
            this.ticket = data;
            this.gameState.animals = data.attributes?.items.map((i: any) => i.symbol);
            this.gameState.scratchedBoxes = data.attributes?.items;
            this.gameState.winningAnimal = data.attributes?.items.find((i: any) => i.is_winner)?.symbol || '';

            // Reinicializa o canvas com a imagem do jogo
            setTimeout(() => this.initializeCanvasAfterMount(), 100);
          }
        },
        error: (err) => {
          console.error('Erro ao comprar ticket:', err);
          this.gameState.canPlayAgain = true;
          this.gameState.isStarted = false;
        }
      });
    } catch (err) {
      console.error('Erro ao iniciar jogo:', err);
      this.gameState.canPlayAgain = true;
      this.gameState.isStarted = false;
    }
  }

  startScratching(event: any) {
    if (!this.gameState.isStarted || this.gameState.isEnded) return;
    this.isScratching = true;
    this.canvasService.performScratch(event);
  }

  stopScratching() {
    if (!this.isScratching) return;
    this.isScratching = false;
    if (this.canvasService.checkScratchProgress()) {
      this.revealAllBoxes();
    }
  }

  scratchMove(event: any) {
    if (!this.isScratching || !this.gameState.isStarted || this.gameState.isEnded) return;
    this.canvasService.performScratch(event);
  }

  revealAllBoxes() {
    if (!this.gameState.isStarted || this.gameState.isEnded || this.gameState.isProcessingResult) return;

    this.canvasService.clearCanvas();
    this.evaluateGameResult();
  }

  evaluateGameResult() {
    if (!this.ticket || this.ticket.revealed || this.gameState.isProcessingResult) return;

    this.gameState.isProcessingResult = true;

    this.scratchTicketService.finish({ ticketId: this.ticket?.id }).subscribe({
      next: (data) => {
        console.log('Resultado recebido:', data);
      },
      error: (err) => {
        console.error('Erro ao finalizar ticket:', err);
        this.gameState.isProcessingResult = false;
        this.gameState.canPlayAgain = true;
      },
      complete: () => {
        // Verifica se ganhou
        const counts: Record<string, number> = {};
        for (const s of this.gameState.animals) {
          counts[s] = (counts[s] || 0) + 1;
        }

        let won = false;
        for (const [symbol, count] of Object.entries(counts)) {
          if (count >= 3) {
            won = true;
            this.gameState.winningAnimal = symbol;
            break;
          }
        }

        this.gameState.isWon = won;
        this.gameState.isEnded = true;
        this.gameState.isProcessingResult = false;

        // Após 2 segundos, mostra a imagem de resultado
        this.resultImageTimeout = setTimeout(() => {
          this.gameState.showResultImage = true;

          // Toca o som se ganhou
          if (this.gameState.isWon) {
            this.audio.play();
          }

          // Reinicializa o canvas com a imagem de resultado
          this.initializeCanvasAfterMount();

          // Após mais 3 segundos, permite jogar novamente
          this.resultImageTimeout = setTimeout(() => {
            this.gameState.canPlayAgain = true;
          }, 3000);
        }, 2000);
      }
    });
  }

  shouldShowResultOverlay(): boolean {
    return this.gameState.isEnded && this.gameState.showResultImage;
  }

  getResultOverlayImage(): string {
    return this.gameState.isWon ? this.getImageWin() : this.getImageLose();
  }

  getResultOverlayTitle(): string {
    return this.gameState.isWon
      ? `🎉 PARABÉNS! Você ganhou ${this.ticket?.prizeWon || ''}!`
      : '💀 Que pena!';
  }

  getResultOverlaySubtitle(): string {
    return this.gameState.isWon
      ? `${this.gameState.winningAnimal} JACKPOT!`
      : 'Tente novamente!';
  }
}
