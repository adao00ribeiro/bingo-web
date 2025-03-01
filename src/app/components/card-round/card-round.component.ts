import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IRound } from '../../interfaces/IRound';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { DialogCardBuyComponent } from '../dialogs/dialog-card-buy/dialog-card-buy.component';
import { GuidPipe } from '../../pipes/guid.pipe';
import { IRoundMessage } from '../../interfaces/IRoundMessage';
import { interval, Subscription } from 'rxjs';


@Component({
  selector: 'app-card-round',
  standalone: true,
  imports: [MatIcon, MatTooltipModule, CurrencyPipe, GuidPipe],
  templateUrl: './card-round.component.html',
  styleUrl: './card-round.component.scss'
})
export class CardRoundComponent implements OnInit ,OnDestroy {

  round = input.required<IRound>();
  roundSocket = input.required<IRoundMessage | undefined>();


  private router: Router = inject(Router);
  readonly dialog = inject(MatDialog);
  private intervalId: Subscription= new Subscription();
  minutes: string = '00';
  seconds: string = '00';
  totalPrize = computed(() => {
    if (this.round()) {
      return this.round().prizes.reduce((total, prize) => total + prize.value, 0);
    } else {
      return 0;
    }
  });
  getImage = computed(() => {
    const maxBalls = this.round().maxBalls;
    if (maxBalls === 90) {
      return "/images/90.png";
    } else if (maxBalls === 80) {
      return "/images/80.png";
    } else if (maxBalls === 75) {
      return "/images/75.png";
    } else if (maxBalls === 50) {
      return "/images/50.png";
    } else if (maxBalls === 30) {
      return "/images/30.png";
    } else {
      return "";
    }
  });
  constructor() {

    effect(() => {
      console.log("aki", this.roundSocket())
    })
  }
  ngOnInit(): void {
    console.log(this.round());
    this.intervalId = interval(1000).subscribe(() => this.updateTimeRemaining());
  }
  ngOnDestroy(): void {
    this.intervalId.unsubscribe();
  }
  openDialog() {
    this.dialog.open(DialogCardBuyComponent, {
      data: {
        round: this.round()
      },
    });

  }
  goViewRound() {
    this.router.navigate(['/sorteio', this.round().id]);
  }
  updateTimeRemaining(): void {
    if (!this.round) return;

    const currentTimestamp = new Date(this.round().startedDate).getTime() - new Date().getTime();
    if (currentTimestamp <= 0) {
      this.minutes = '00';
      this.seconds = '00';
      return;
    }

    this.minutes = Math.floor((currentTimestamp % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    this.seconds = Math.floor((currentTimestamp % (1000 * 60)) / 1000).toString().padStart(2, '0');

    if (this.minutes === '05' && this.seconds === '00') {
      this.playFiveMinuteLeft();
    } else if (this.minutes === '03' && this.seconds === '00') {
      this.playThreeMinuteLeft();
    } else if (this.minutes === '01' && this.seconds === '00') {
      this.playOneMinuteLeft();
    } else if (this.minutes === '00' && this.seconds === '10') {
      this.playTenSecondsLeft();
    }
  }
  playFiveMinuteLeft(): void {
    console.log('Five minutes left!');
  }

  playThreeMinuteLeft(): void {
    console.log('Three minutes left!');
  }

  playOneMinuteLeft(): void {
    console.log('One minute left!');
  }

  playTenSecondsLeft(): void {
    console.log('Ten seconds left!');
  }
}
