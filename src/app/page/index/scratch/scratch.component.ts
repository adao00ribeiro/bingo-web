import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, OnInit, QueryList, signal, ViewChild, ViewChildren } from '@angular/core';
interface GameStats {
  gamesPlayed: number;
  wins: number;
  winRate: number;
}

@Component({
  selector: 'app-scratch',
  imports: [CommonModule],
  templateUrl: './scratch.component.html',
  styleUrl: './scratch.component.scss'
})
export class ScratchComponent implements OnInit {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  @ViewChildren('scratchCanvas') scratchCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  // Reactive signals
  gameState = signal<string[]>([]);
  scratchedBoxes = signal<number[]>([]);
  gameEnded = signal<boolean>(false);
  gameWon = signal<boolean>(false);
  winningAnimal = signal<string>('');
  gamesPlayed = signal<number>(0);
  wins = signal<number>(0);

  // Computed signals
  stats = computed((): GameStats => {
    const played = this.gamesPlayed();
    const won = this.wins();
    const winRate = played > 0 ? Math.round((won / played) * 100) : 0;
    return { gamesPlayed: played, wins: won, winRate };
  });

  resultMessage = computed(() => {
    if (this.scratchedBoxes().length === 0) {
      return 'Clique nos quadrados para começar!';
    }
    if (this.gameEnded()) {
      return this.gameWon() ? '🎉 JACKPOT! Você ganhou! 🎉' : '💀 Que pena! Tente novamente!';
    }
    return 'Continue raspando...';
  });

  prizeMessage = computed(() => {
    return this.gameWon() ? `🏆 ${this.prizes[this.winningAnimal()]}` : '';
  });

  // Game data
  private animals = ['🦁', '🐯', '🐻', '🦊', '🐺', '🦝', '🐨', '🦘', '🐵', '🦒', '🐘', '🦏', '🦓', '🦌', '🐃', '🐄'];

  private prizes: { [key: string]: string } = {
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
  };
  scratching: boolean[] = [];
  canvasContexts: CanvasRenderingContext2D[] = [];

  @ViewChild('scratchCanvas', { static: true }) scratchCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private isScratching = false;

  ngAfterViewInit() {
     this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas.bind(this));
    const canvas = this.scratchCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      this.ctx = ctx;
      const image = new Image();
      image.src = '/images/bicho.jpg';
      image.onload = () => {
        this.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }

  }
resizeCanvas() {
  const canvas = this.scratchCanvas.nativeElement;
  const wrapper = canvas.parentElement; // .scratch-area-wrapper

  if (wrapper) {
    const rect = wrapper.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
  }
}
  getMousePos(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.scratchCanvas.nativeElement.getBoundingClientRect();
    const clientX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
    const clientY = event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  startScratching(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isScratching = true;
    this.scratchMove(event);
  }

  stopScratching() {
    this.isScratching = false;

    const canvas = this.scratchCanvas.nativeElement;
    const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    let cleared = 0;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] === 0) cleared++;
    }

    const percent = cleared / (canvas.width * canvas.height) * 100;
    if (percent > 40) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.revealAll();
    }
  }

  scratchMove(event: MouseEvent | TouchEvent) {
    if (!this.isScratching) return;

    const pos = this.getMousePos(event);
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
    this.ctx.fill();
  }

  revealAll() {
    // Mostra todos os slots como "raspados"
    this.gameState().forEach((_, i) => this.scratch(i));
  }


  ngOnInit() {
    this.loadStats();
    this.initGame();
  }

  private loadStats() {
    if (typeof localStorage !== 'undefined') {
      this.gamesPlayed.set(parseInt(localStorage.getItem('gamesPlayed') || '0'));
      this.wins.set(parseInt(localStorage.getItem('wins') || '0'));
    }
  }

  private saveStats() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gamesPlayed', this.gamesPlayed().toString());
      localStorage.setItem('wins', this.wins().toString());
    }
  }

  initGame() {
    const shouldWin = Math.random() < 0.25; // 25% chance de ganhar
    const newGameState: string[] = [];

    if (shouldWin) {
      const winningAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
      const winningPositions: number[] = [];

      // Escolher 3 posições aleatórias para o animal vencedor
      while (winningPositions.length < 3) {
        const pos = Math.floor(Math.random() * 9);
        if (!winningPositions.includes(pos)) {
          winningPositions.push(pos);
        }
      }

      // Preencher o grid
      for (let i = 0; i < 9; i++) {
        if (winningPositions.includes(i)) {
          newGameState[i] = winningAnimal;
        } else {
          let randomAnimal: string;
          do {
            randomAnimal = this.animals[Math.floor(Math.random() * this.animals.length)];
          } while (randomAnimal === winningAnimal);
          newGameState[i] = randomAnimal;
        }
      }
    } else {
      // Jogo perdedor
      const usedAnimals: string[] = [];
      for (let i = 0; i < 9; i++) {
        let animal: string;
        do {
          animal = this.animals[Math.floor(Math.random() * this.animals.length)];
        } while (usedAnimals.filter(a => a === animal).length >= 2);
        newGameState[i] = animal;
        usedAnimals.push(animal);
      }
    }

    this.gameState.set(newGameState);
    this.scratchedBoxes.set([]);
    this.gameEnded.set(false);
    this.gameWon.set(false);
    this.winningAnimal.set('');
  }

  scratch(index: number) {
    if (this.gameEnded() || this.scratchedBoxes().includes(index)) return;

    const newScratchedBoxes = [...this.scratchedBoxes(), index];
    this.scratchedBoxes.set(newScratchedBoxes);

    // Efeito de vibração
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Verificar se todos foram raspados
    if (newScratchedBoxes.length === 9) {
      setTimeout(() => this.checkResult(), 500);
    }
  }

  private checkResult() {
    this.gameEnded.set(true);
    this.gamesPlayed.set(this.gamesPlayed() + 1);

    const counts: { [key: string]: number } = {};
    this.gameState().forEach(animal => {
      counts[animal] = (counts[animal] || 0) + 1;
    });

    let won = false;
    let winningAnimal = '';

    for (const animal in counts) {
      if (counts[animal] >= 3) {
        won = true;
        winningAnimal = animal;
        break;
      }
    }

    if (won) {
      this.wins.set(this.wins() + 1);
      this.gameWon.set(true);
      this.winningAnimal.set(winningAnimal);

      // Criar efeitos visuais
      this.createConfetti();
      this.createFireworks();

      // Vibração de vitória
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    }

    this.saveStats();
  }

  isWinningAnimal(index: number): boolean {
    return this.gameWon() && this.gameState()[index] === this.winningAnimal();
  }

  isWinningBox(index: number): boolean {
    return this.gameWon() && this.gameState()[index] === this.winningAnimal();
  }

  private createConfetti() {
    const container = this.gameContainer.nativeElement;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti confetti-${(i % 5) + 1}`;
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  }

  private createFireworks() {
    const container = this.gameContainer.nativeElement;

    for (let i = 0; i < 20; i++) {
      const firework = document.createElement('div');
      firework.className = `firework firework-${(i % 4) + 1}`;
      firework.style.left = Math.random() * 100 + '%';
      firework.style.top = Math.random() * 100 + '%';
      firework.style.animationDelay = Math.random() * 2 + 's';
      container.appendChild(firework);

      setTimeout(() => {
        if (firework.parentNode) {
          firework.parentNode.removeChild(firework);
        }
      }, 3000);
    }
  }

  resetGame() {
    // Reinicializa o canvas
    const canvas = this.scratchCanvas.nativeElement;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // limpa o canvas
    ctx.globalCompositeOperation = 'source-over'; // volta para o modo normal
    const image = new Image();
    image.src = '/images/bicho.jpg'; // Caminho relativo ao `angular.json` baseHref
    image.onload = () => {
      this.ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      this.initGame();
    };
  }

}
