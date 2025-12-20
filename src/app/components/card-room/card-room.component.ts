import { Component, computed, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { IRound } from '../../interfaces/IRound';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { DialogCardBuyComponent } from '../dialogs/dialog-card-buy/dialog-card-buy.component';
import { interval, Subscription } from 'rxjs';
import { DialogCardsPurchasedComponent } from '../dialogs/dialog-cards-purchased/dialog-cards-purchased.component';
import { TimerService } from '../../services/timer.service';
import { BallComponent } from "../ball/ball.component";
import { MediaService } from '../../services/media/media.service';
import { ImageDatabaseService } from '../../services/image-data-base.service';

@Component({
  selector: 'app-card-room',
  imports: [ MatIcon, MatTooltipModule, CurrencyPipe,  BallComponent],
  templateUrl: './card-room.component.html',
  styleUrl: './card-room.component.scss'
})
export class CardRoomComponent implements OnInit, OnDestroy {
  round = input.required<IRound>();
  private router: Router = inject(Router);
    private imageDB = inject(ImageDatabaseService);
  private mediaService: MediaService = inject(MediaService);
  readonly dialog = inject(MatDialog);
  readonly timerService = inject(TimerService);
  private intervalId: Subscription = new Subscription();
  imageUrl = signal<string | null>(null);
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';

  totalPrize = computed(() => {
    if (this.round()) {
      return this.round().prizes.reduce((total, prize) => total + prize.value, 0);
    }
    return 0;
  });

  getImage = computed(() => {
    const maxBalls = this.round().maxBalls;
    return maxBalls ? `/images/${maxBalls}.png` : '';
  });


getImageRoom = computed(() => this.imageUrl());

  updateTimeRemaining = computed(()=> {
    if (!this.round) return;
    const serverTime = this.timerService.AdjustedTime();
    if (serverTime == null) {
      return;
    }
    const currentTimestamp = new Date(this.round().started).getTime() - serverTime.getTime();
    if (currentTimestamp <= 0) {
      this.days = this.hours = this.minutes = this.seconds = '00';
      return;
    }

    this.days = Math.floor(currentTimestamp / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    this.hours = Math.floor((currentTimestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    this.minutes = Math.floor((currentTimestamp % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    this.seconds = Math.floor((currentTimestamp % (1000 * 60)) / 1000).toString().padStart(2, '0');

    this.checkTimeAlerts();
  })
 constructor() {
  effect(() => {
    const media = this.round().room?.mediaAttachment;
    if (!media) {
      this.imageUrl.set(null);
      return;
    }

    const fileName = `${media.entityId}_${media.fileName}`;

    this.mediaService.getPresignedUrl(fileName).subscribe({
      next: (data) => this.imageUrl.set(data),
      error: () => this.imageUrl.set(null)
    });
  });
}

  ngOnInit(): void {

    this.intervalId = interval(1000).subscribe(() => this.updateTimeRemaining());
  }

  ngOnDestroy(): void {
    this.intervalId.unsubscribe();
  }

  openDialog() {
    this.dialog.open(DialogCardBuyComponent, {
      data: { round: this.round() },
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '250ms'
    });
  }

  openDialogCardPurchased() {
    const round = this.round();
    if (round && round.cardsPurchased > 0) {
      this.dialog.open(DialogCardsPurchasedComponent, {
        data: { round },
        width: '90vw',
        height: '90vh',  // Defina a altura explicitamente aqui
        maxHeight: '100vh',
        enterAnimationDuration: '500ms',
        exitAnimationDuration: '250ms'
      });
    }
  }

  goViewRoom() {
    this.router.navigate(['/room', this.round().roomId]);
  }



  checkTimeAlerts(): void {
    const alertTimes: Record<string, () => void> = {
      '05:00': this.playFiveMinuteLeft,
      '03:00': this.playThreeMinuteLeft,
      '01:00': this.playOneMinuteLeft,
      '00:10': this.playTenSecondsLeft
    };

    const currentTime = `${this.minutes}:${this.seconds}`;
    if (alertTimes[currentTime]) alertTimes[currentTime].apply(this);
  }

  playFiveMinuteLeft(): void { console.log('Five minutes left!'); }
  playThreeMinuteLeft(): void { console.log('Three minutes left!'); }
  playOneMinuteLeft(): void { console.log('One minute left!'); }
  playTenSecondsLeft(): void { console.log('Ten seconds left!'); }
}
