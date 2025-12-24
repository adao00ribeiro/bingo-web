import { Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TimerService } from '../../services/timer.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-round-timer',
  imports: [MatIcon],
  templateUrl: './round-timer.component.html',
  styleUrl: './round-timer.component.scss'
})
export class RoundTimerComponent implements OnInit, OnDestroy {
  startedRound = input.required<Date>();
  isStartedRoundChange = output<boolean>();
  readonly timerService = inject(TimerService);
  private intervalId: Subscription = new Subscription();
  days: string = '00';
  hours: string = '00';
  minutes: string = '00';
  seconds: string = '00';


  updateTimeRemaining = computed(() => {

    const serverTime = this.timerService.AdjustedTime();
    if (serverTime == null) {
      return;
    }
    const currentTimestamp = new Date(this.startedRound()).getTime() - serverTime.getTime();
    if (currentTimestamp <= 0) {
      this.days = this.hours = this.minutes = this.seconds = '00';

      this.isStartedRoundChange.emit(true);
      return;
    }

    this.days = Math.floor(currentTimestamp / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    this.hours = Math.floor((currentTimestamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    this.minutes = Math.floor((currentTimestamp % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    this.seconds = Math.floor((currentTimestamp % (1000 * 60)) / 1000).toString().padStart(2, '0');

    this.checkTimeAlerts();
  })
  ngOnInit(): void {

    this.intervalId = interval(1000).subscribe(() => this.updateTimeRemaining());
  }
   ngOnDestroy(): void {
    this.intervalId.unsubscribe();
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
