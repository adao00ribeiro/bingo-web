import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, OnDestroy, OnInit, Signal, signal   } from '@angular/core';
import { timer,Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-carousel',
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent  implements OnInit, OnDestroy{
  imagens = input<string[]>([])
  timerHidden = input<number>(3)
  private timerSubs!: Subscription;
   indexImagemAtiva = signal<number>(0);
   activeImageIndex: Signal<number> = computed(() => this.indexImagemAtiva());
   showCarousel = signal<boolean>(true);
  ngOnInit(): void {
    this.iniciarTimer();
    this.iniciarToggleCarousel();
  }

  ngOnDestroy(): void {
    this.pararTimer();
  }

  iniciarTimer(): void {
    this.timerSubs = interval(3000).subscribe(() => {
      const nextIndex = this.indexImagemAtiva() + 1;
      const newIndex = nextIndex >= this.imagens().length ? 0 : nextIndex;

      this.indexImagemAtiva.set(newIndex);
    });
  }

  pararTimer(): void {
    this.timerSubs?.unsubscribe();
  }
  iniciarToggleCarousel(): void {
    interval(5000).subscribe(() => {
      this.showCarousel.set(!this.showCarousel());
    });
  }
  ativarImagem(index: number): void {
    console.log(index)
    const validIndex = index >= 0 && index < this.imagens().length ? index : 0;
    this.indexImagemAtiva.set(validIndex);
    this.pararTimer();
    this.iniciarTimer();
  }
}
