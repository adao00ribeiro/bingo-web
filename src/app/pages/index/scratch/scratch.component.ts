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
  AfterViewInit
} from '@angular/core';
import { ScratchGameResourceService } from '../../../resource/scratch/scratch-game-resource.service';
import { ScratchTicketService } from '../../../services/scratch/scratch-ticket.service';
import { IScratchItemResponse } from '../../../interfaces/response/scratch/jsonb/IScratchItemResponse';



interface GameState {
  animals: string[];
  scratchedBoxes: number[];
  isEnded: boolean;
  isWon: boolean;
  winningAnimal: string;
  isStarted: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface AnimationConfig {
  confettiCount: number;
  fireworksCount: number;
  confettiDuration: number;
  fireworksDuration: number;
}

// Constantes
const GAME_CONFIG = {
  GRID_SIZE: 9,
  WINNING_THRESHOLD: 3,
  WIN_PROBABILITY: 0.25,
  SCRATCH_RADIUS: 20,
  SCRATCH_THRESHOLD: 40, // Porcentagem para revelar automaticamente
  VIBRATION_DURATION: 50,
  VICTORY_VIBRATION: [200, 100, 200, 100, 200],
} as const;

const ANIMALS = [
  '🦁', '🐯', '🐻', '🦊', '🐺', '🦝', '🐨', '🦘',
  '🐵', '🦒', '🐘', '🦏', '🦓', '🦌', '🐃', '🐄'
] as const;

const PRIZES = {
  '🦁': 'Leão Dourado - R$ 500,00',
  '🐯': 'Tigre Feroz - R$ 400,00',
  '🐻': 'Urso Polar - R$ 300,00',
  '🦊': 'Raposa Esperta - R$ 250,00',
  '🐺': 'Lobo Alpha - R$ 350,00',
  '🦝': 'Guaxinim Ninja - R$ 200,00',
  '🐨': 'Coala Zen - R$ 180,00',
  '🦘': 'Canguru Boxeador - R$ 220,00',
  '🐵': 'Macaco Sábio - R$ 280,00',
  '🦒': 'Girafa Gigante - R$ 320,00',
  '🐘': 'Elefante Real - R$ 450,00',
  '🦏': 'Rinoceronte Blindado - R$ 380,00',
  '🦓': 'Zebra Listrada - R$ 240,00',
  '🦌': 'Cervo Majestoso - R$ 260,00',
  '🐃': 'Búfalo Bravo - R$ 300,00',
  '🐄': 'Vaca Dourada - R$ 150,00'
} as const;

const ANIMATION_CONFIG: AnimationConfig = {
  confettiCount: 50,
  fireworksCount: 20,
  confettiDuration: 5000,
  fireworksDuration: 3000,
};

@Component({
  selector: 'app-scratch',
  imports: [CommonModule],
  templateUrl: './scratch.component.html',
  styleUrl: './scratch.component.scss'
})
export class ScratchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gameContainer', { static: true })
  private readonly gameContainer!: ElementRef<HTMLElement>;

  @ViewChild('scratchCanvas', { static: true })
  private readonly scratchCanvas!: ElementRef<HTMLCanvasElement>;

  // Injeção de dependências

  private readonly scratchTicketService = inject(ScratchTicketService);
  private readonly scratchGameResourceService = inject(ScratchGameResourceService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals para estado do jogo
  private readonly gameState = signal<GameState>({
    animals: [],
    scratchedBoxes: [],
    isEnded: false,
    isWon: false,
    winningAnimal: '',
    isStarted: false,
  });

  // Signals para estatísticas
  private readonly gamesPlayed = signal<number>(0);
  private readonly wins = signal<number>(0);

  // Canvas e contexto
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private isScratching = false;
  private resizeObserver?: ResizeObserver;

  // Computed signals públicos
  readonly currentGameState = this.gameState.asReadonly();

  readonly resultMessage = computed(() => {
    const state = this.gameState();

    if (state.scratchedBoxes.length === 0) {
      return 'Clique nos quadrados para começar!';
    }

    if (state.isEnded) {
      return state.isWon ? '🎉 JACKPOT! Você ganhou! 🎉' : '💀 Que pena! Tente novamente!';
    }

    return 'Continue raspando...';
  });

  readonly prizeMessage = computed(() => {
    const state = this.gameState();
    return state.isWon ? `🏆 ${PRIZES[state.winningAnimal as keyof typeof PRIZES]}` : '';
  });

  // Getters para facilitar o uso no template
  get animals(): string[] {
    return this.gameState().animals;
  }

  get scratchedBoxes(): number[] {
    return this.gameState().scratchedBoxes;
  }

  get isGameEnded(): boolean {
    return this.gameState().isEnded;
  }

  get isGameWon(): boolean {
    return this.gameState().isWon;
  }

  get isGameStarted(): boolean {
    return this.gameState().isStarted;
  }

  get winningAnimal(): string {
    return this.gameState().winningAnimal;
  }

  ngOnInit(): void {
    this.initializeGame();
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Métodos públicos
  startScratching(event: MouseEvent | TouchEvent): void {
    if (!this.isGameStarted || this.isGameEnded) return;

    event.preventDefault();
    this.isScratching = true;
    this.performScratch(event);
  }

  stopScratching(): void {
    if (!this.isScratching) return;

    this.isScratching = false;
    this.checkScratchProgress();
  }

  scratchMove(event: MouseEvent | TouchEvent): void {
    if (!this.isScratching || !this.isGameStarted || this.isGameEnded) return;
    this.performScratch(event);
  }

  scratchBox(index: number): void {
    if (this.isGameEnded || this.scratchedBoxes.includes(index)) return;

    this.updateScratchedBoxes(index);
    this.triggerHapticFeedback();

    if (this.scratchedBoxes.length === GAME_CONFIG.GRID_SIZE) {
      setTimeout(() => this.evaluateGameResult(), 500);
    }
  }
 play() {
  this.scratchTicketService.buyTicket().subscribe({
    next: (data) => {
      const animalsFromTicket = data.attributes?.items.map((item: IScratchItemResponse) => item.symbol);
      const winningSymbol = this.findWinningSymbol(data.attributes?.items || []);

      this.gameState.set({
        animals: animalsFromTicket || [],
        scratchedBoxes: [],
        isEnded: false,
        isWon: false,
        winningAnimal: winningSymbol,
        isStarted: true,
      });

      // Redesenha a imagem de cobertura após carregar novo ticket
      this.drawCoverImage();
    },
    error: (err) => {
      console.error('Erro ao comprar bilhete', err);
    }
  });
}
private findWinningSymbol(items: IScratchItemResponse[]): string {
  const count = new Map<string, number>();

  for (const item of items) {
    if (item.isWinner) {
      count.set(item.symbol, (count.get(item.symbol) || 0) + 1);
    }
  }

  for (const [symbol, quantity] of count.entries()) {
    if (quantity >= GAME_CONFIG.WINNING_THRESHOLD) {
      return symbol;
    }
  }

  return '';
}
  resetGame(): void {
    // Primeiro desenha a imagem de cobertura para evitar piscada
    this.drawCoverImage();
    // Inicializa o novo jogo (sem delay para evitar flash)
    this.initializeGame();
  }

  isWinningBox(index: number): boolean {
    const state = this.gameState();
    return state.isWon && state.animals[index] === state.winningAnimal;
  }

  // Métodos privados
  private initializeGame(): void {
    const gameState = this.createGameState();
    this.gameState.set(gameState);
  }

  private createGameState(): GameState {
    const shouldWin = Math.random() < GAME_CONFIG.WIN_PROBABILITY;
    const animals = shouldWin ? this.generateWinningGame() : this.generateLosingGame();

    return {
      animals,
      scratchedBoxes: [],
      isEnded: false,
      isWon: false,
      winningAnimal: '',
      isStarted: true, // Inicia o jogo automaticamente
    };
  }

  private generateWinningGame(): string[] {
    const winningAnimal = this.getRandomAnimal();
    const winningPositions = this.getRandomPositions(GAME_CONFIG.WINNING_THRESHOLD);
    const animals = new Array(GAME_CONFIG.GRID_SIZE);

    // Preencher posições vencedoras
    winningPositions.forEach(pos => {
      animals[pos] = winningAnimal;
    });

    // Preencher posições restantes
    for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
      if (!animals[i]) {
        animals[i] = this.getRandomAnimalExcept(winningAnimal);
      }
    }

    return animals;
  }

  private generateLosingGame(): string[] {
    const animals: string[] = [];
    const animalCounts = new Map<string, number>();

    for (let i = 0; i < GAME_CONFIG.GRID_SIZE; i++) {
      let animal: string;

      do {
        animal = this.getRandomAnimal();
      } while ((animalCounts.get(animal) || 0) >= 2);

      animals.push(animal);
      animalCounts.set(animal, (animalCounts.get(animal) || 0) + 1);
    }

    return animals;
  }

  private getRandomAnimal(): string {
    return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  }

  private getRandomAnimalExcept(excludeAnimal: string): string {
    let animal: string;
    do {
      animal = this.getRandomAnimal();
    } while (animal === excludeAnimal);
    return animal;
  }

  private getRandomPositions(count: number): number[] {
    const positions: number[] = [];

    while (positions.length < count) {
      const pos = Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }

    return positions;
  }

  private initializeCanvas(): void {
    this.canvas = this.scratchCanvas.nativeElement;
    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Não foi possível obter o contexto 2D do canvas');
    }

    this.ctx = ctx;
    this.resizeCanvas();

    // Desenha imediatamente para evitar flash
    this.drawCoverImage();
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
      // Sempre redesenha a cobertura após resize para manter os animais ocultos
      this.drawCoverImage();
    });

    const wrapper = this.canvas.parentElement;
    if (wrapper) {
      this.resizeObserver.observe(wrapper);
    }
  }

  private resizeCanvas(): void {
    const wrapper = this.canvas.parentElement;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  private loadCanvasImage(): void {
    this.drawCoverImage();
  }

  private drawCoverImage(): void {
    // Primeiro garante que o contexto está no modo correto
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const image = new Image();
    image.src = '/images/bicho.jpg';
    image.onload = () => {
      // Desenha a imagem de cobertura
      this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    };
    image.onerror = () => {
      console.error('Erro ao carregar imagem do canvas');
      // Fallback: desenha um fundo sólido cinza para cobrir os animais
      this.ctx.fillStyle = '#8B4513';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Adiciona um padrão para simular uma raspadinha
      this.ctx.fillStyle = '#A0522D';
      for (let i = 0; i < this.canvas.width; i += 20) {
        for (let j = 0; j < this.canvas.height; j += 20) {
          if ((i + j) % 40 === 0) {
            this.ctx.fillRect(i, j, 10, 10);
          }
        }
      }
    };
  }

  private getMousePosition(event: MouseEvent | TouchEvent): Position {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  private performScratch(event: MouseEvent | TouchEvent): void {
    const position = this.getMousePosition(event);

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(position.x, position.y, GAME_CONFIG.SCRATCH_RADIUS, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private checkScratchProgress(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const totalPixels = this.canvas.width * this.canvas.height;
    let clearedPixels = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) {
        clearedPixels++;
      }
    }

    const scratchedPercent = (clearedPixels / totalPixels) * 100;

    if (scratchedPercent > GAME_CONFIG.SCRATCH_THRESHOLD) {
      this.revealAllBoxes();
    }
  }

  private revealAllBoxes(): void {
    // Remove completamente a cobertura do canvas
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const currentState = this.gameState();
    const allBoxes = Array.from({ length: GAME_CONFIG.GRID_SIZE }, (_, i) => i);

    this.gameState.set({
      ...currentState,
      scratchedBoxes: allBoxes
    });

    setTimeout(() => this.evaluateGameResult(), 500);
  }

  private updateScratchedBoxes(index: number): void {
    const currentState = this.gameState();
    const newScratchedBoxes = [...currentState.scratchedBoxes, index];

    this.gameState.set({
      ...currentState,
      scratchedBoxes: newScratchedBoxes
    });
  }

  private evaluateGameResult(): void {
    const currentState = this.gameState();
    const animalCounts = this.countAnimals(currentState.animals);
    const result = this.determineWinner(animalCounts);

    this.gameState.set({
      ...currentState,
      isEnded: true,
      isWon: result.isWon,
      winningAnimal: result.winningAnimal
    });

    this.gamesPlayed.set(this.gamesPlayed() + 1);

    if (result.isWon) {
      this.handleVictory();
    }
  }

  private countAnimals(animals: string[]): Map<string, number> {
    const counts = new Map<string, number>();

    animals.forEach(animal => {
      counts.set(animal, (counts.get(animal) || 0) + 1);
    });

    return counts;
  }

  private determineWinner(animalCounts: Map<string, number>): { isWon: boolean; winningAnimal: string } {
    for (const [animal, count] of animalCounts) {
      if (count >= GAME_CONFIG.WINNING_THRESHOLD) {
        return { isWon: true, winningAnimal: animal };
      }
    }

    return { isWon: false, winningAnimal: '' };
  }

  private handleVictory(): void {
    this.wins.set(this.wins() + 1);
    this.triggerVictoryEffects();
  }

  private triggerVictoryEffects(): void {
    this.createConfetti();
    this.createFireworks();
    this.triggerVictoryHapticFeedback();
  }

  private createConfetti(): void {
    const container = this.gameContainer.nativeElement;

    for (let i = 0; i < ANIMATION_CONFIG.confettiCount; i++) {
      const confetti = this.createConfettiElement(i);
      container.appendChild(confetti);

      setTimeout(() => {
        confetti.remove();
      }, ANIMATION_CONFIG.confettiDuration);
    }
  }

  private createConfettiElement(index: number): HTMLElement {
    const confetti = document.createElement('div');
    confetti.className = `confetti confetti-${(index % 5) + 1}`;
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    return confetti;
  }

  private createFireworks(): void {
    const container = this.gameContainer.nativeElement;

    for (let i = 0; i < ANIMATION_CONFIG.fireworksCount; i++) {
      const firework = this.createFireworkElement(i);
      container.appendChild(firework);

      setTimeout(() => {
        firework.remove();
      }, ANIMATION_CONFIG.fireworksDuration);
    }
  }

  private createFireworkElement(index: number): HTMLElement {
    const firework = document.createElement('div');
    firework.className = `firework firework-${(index % 4) + 1}`;
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 100}%`;
    firework.style.animationDelay = `${Math.random() * 2}s`;
    return firework;
  }

  private triggerHapticFeedback(): void {
    if (navigator.vibrate) {
      navigator.vibrate(GAME_CONFIG.VIBRATION_DURATION);
    }
  }

  private triggerVictoryHapticFeedback(): void {
    if (navigator.vibrate) {
      navigator.vibrate(GAME_CONFIG.VICTORY_VIBRATION);
    }
  }

  private clearCanvas(): void {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private redrawCanvas(): void {
    this.drawCoverImage();
  }

  private cleanup(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
