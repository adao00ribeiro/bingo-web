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
import { ScratchSellerGameService } from '../../../services/scratch/scratch-seller-game/scratch-seller-game.service';
import { IScratchSellerGameResponse } from '../../../interfaces/response/scratch/IScratchSellerGameResponse';
import { IScratchTicketResponse } from '../../../interfaces/response/scratch/IScratchTicketResponse';

@Component({
  selector: 'app-scratch',
  imports: [CommonModule],
  templateUrl: './scratch.component.html',
  styleUrl: './scratch.component.scss'
})
export class ScratchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scratchCanvas', { static: false })
  private readonly scratchCanvas!: ElementRef<HTMLCanvasElement>;
  scratchSellerGameId = input('');
  private readonly punterMeResource = inject(PunterMeResource);
  private readonly scratchTicketService = inject(ScratchTicketService);
  private readonly scratchSellerGameService = inject(ScratchSellerGameService);
  private readonly canvasService = inject(CanvasService);
  private readonly destroyRef = inject(DestroyRef);

  ticket?: IScratchTicketResponse;
  layoutSize = 9;
  isScratching = false;
  imagesLoaded = false;
  loadingProgress = 0;
  audio = new Audio('/audios/cash-register.mp3');
  gamesOnlineSeller: IScratchSellerGameResponse | undefined = undefined;
  gameState = {
    animals: [] as any[],
    scratchedBoxes: [] as any[],
    isEnded: false,
    isWon: false,
    winningAnimal: '',
    isStarted: false
  };
  private subs = new Subscription();

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
        console.log("fdp")
        setTimeout(() => this.initializeCanvasAfterMount(), 100);
      }, 300);
    } catch (err) {
      console.error('Erro ao inicializar jogo:', err);
      this.imagesLoaded = true;
    }
  }

  async loadGameData() {
    this.scratchSellerGameService.GetById(this.scratchSellerGameId()).subscribe({
      next: (data) => {
        if (data) {
          this.gamesOnlineSeller = data;
        }
      },
      error: (err) => {

      },
      complete: () => {

      }
    });
    this.gameState.scratchedBoxes = Array(this.layoutSize).fill({ symbol: '' });
  }

  async preloadImages() {
    const images = [
      '/images/raspadinha.jpg',
      '/images/raspadinha.jpg',
      this.getImageGame()
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
    console.log(this.scratchCanvas)
    if (!canvas) return;

    const gridConfig = { rows: 3, cols: 3, gap: 5 };
    this.canvasService.initializeCanvas(canvas, gridConfig, this.getImageGame());
    this.canvasService.setupResizeObserver(() => console.log('Canvas resized'));
  }

  getBackgroundGame() {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha.jpg';
    if (id == '1') return '/images/raspadinha.jpg';
    if (id == ' 2') return '/images/raspadinha.jpg';
    return '/images/raspadinha.jpg';
  }

  getImageGame() {
    const id = this.gamesOnlineSeller?.scratchGameId;
    if (!id) return '/images/raspadinha.jpg';
    if (id == '1') return '/images/raspadinha.jpg';
    if (id == '2') return '/images/raspadinha.jpg';
    return '/images/raspadinha.jpg';
  }

  getPrice(): number {
    return this.gamesOnlineSeller?.scratchGame.price || this.gamesOnlineSeller?.scratchGame?.price || 0;
  }

  prizeMessage(): string {
    const state = this.gameState;
    if (!state.isStarted) return 'Click em Jogar';
    if (!state.isEnded) return 'Raspe os Slots';
    if (state.isWon)
      return `${state.winningAnimal} JACKPOT! Você ganhou! ${this.ticket ? this.ticket.prizeWon : ''
        }`;
    return '💀 Que pena! Tente novamente!';
  }

  isWinningBox(index: number): boolean {
    return this.gameState.isWon && this.gameState.animals[index] === this.gameState.winningAnimal;
  }

  async play() {
    this.gameState = {
      ...this.gameState,
      isStarted: true,
      isEnded: false,
      isWon: false,
      winningAnimal: '',
      scratchedBoxes: []
    };

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
          }
        },
        error: (err) => {

        },
        complete: () => {

        }
      });

    } catch (err) {
      console.error('Erro ao iniciar jogo:', err);
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
    if (this.canvasService.checkScratchProgress()) this.revealAllBoxes();
  }

  scratchMove(event: any) {
    if (!this.isScratching || !this.gameState.isStarted || this.gameState.isEnded) return;
    this.canvasService.performScratch(event);
  }

  revealAllBoxes() {
    if (!this.gameState.isStarted || this.gameState.isEnded) return;
    this.canvasService.clearCanvas();
    this.evaluateGameResult();
    this.gameState.isEnded = true;
  }

  evaluateGameResult() {



    if (!this.ticket || this.ticket.revealed) return;
    this.scratchTicketService.finish({ ticketId: this.ticket?.id }).subscribe({
      next: (data) => {

      },
      error: (err) => {

      },
      complete: () => {
        const counts: Record<string, number> = {};
        for (const s of this.gameState.animals) counts[s] = (counts[s] || 0) + 1;

        for (const [symbol, count] of Object.entries(counts)) {
          if (count >= 3) {
            this.gameState.isWon = true;
            this.gameState.winningAnimal = symbol;
            this.audio.play();
            return;
          }
        }
        this.gameState.isWon = false;
      }
    });


  }
}
