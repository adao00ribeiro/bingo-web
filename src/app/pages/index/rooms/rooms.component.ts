import { Component, computed, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from '../../../services/socket/socket.service';
import { RoundService } from '../../../services/round/round.service';
import { IRound } from '../../../interfaces/IRound';
import { TimerService } from '../../../services/timer.service';
import { ITimelineEvent } from '../../../interfaces/ITimelineEvent';
import { IRoundMessage } from '../../../interfaces/IRoundMessage';
import { RoomRoundRealTimeComponent } from "../room-round-real-time/room-round-real-time.component";

@Component({
  selector: 'app-rooms',
  imports: [
    RoomRoundRealTimeComponent
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',

})
export class RoomsComponent implements OnInit {
  roomId = input('');
  public readonly snackBar = inject(MatSnackBar);
  private socketService: SocketService = inject(SocketService)
  private timerService: TimerService = inject(TimerService)
  private roundService: RoundService = inject(RoundService)

  private roundPoller: number | undefined;
  private stepInterval: number | null = null;
  round = signal<IRound | null>(null);
  step_timeline: {
    stepIndex: number;
    currentKey: string | null;
    currentStep: ITimelineEvent | null;
  } = {
      stepIndex: -1,
      currentKey: null,
      currentStep: null
    };
  eventData: IRoundMessage | null = null;
  constructor() {
    effect(() => {
      if (this.socketService.IsConnected()) {
        this.socketService.subscribeToChannel(`chat_room_${this.roomId()}`);
      }
    });
  }
  ngOnInit(): void {
    this.fetchRound();
    this.startRoundPoller();
  }

  startRoundPoller(): void {
    if (this.roundPoller !== undefined) return;
    this.roundPoller = window.setInterval(() => {
      if (!this.eventData) {
        this.fetchRound();
        // this.loadMockTimeline();
      } else {
        if (this.roundPoller !== undefined) {
          clearInterval(this.roundPoller);
          this.roundPoller = undefined;
        }
      }
    }, this.getRandomInterval(10_000, 15_000));
  }

  getRandomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  fetchRound() {
    this.roundService.GetRoundsWithTimelineAsync(this.roomId()).subscribe(round => {
      this.round.set(round)
      if (!round || Object.keys(round.timeline).length === 0) {
        return;
      }
      if (this.roundPoller) {
        clearInterval(this.roundPoller);
        this.roundPoller = undefined;
      }
      const serverTime = this.timerService.AdjustedTime();
      if (!serverTime) {
        return;
      }
      const { stepIndex, currentKey, currentStep } = this.preparedTimeline(
        round.timeline,
        round.timeline[Object.keys(round.timeline)[0]].eventData.startedWeb,
        serverTime
      );
      this.step_timeline = { stepIndex, currentKey, currentStep };
      this.startStepProgression();
    });
  }

  preparedTimeline(
    timelineHash: Record<string, ITimelineEvent>,
    inicio: Date | string,
    currentHorario: Date
  ): {
    stepIndex: number;
    currentStep: ITimelineEvent;
    currentKey: string;
  } {
    const startTime = inicio instanceof Date ? inicio : new Date(inicio);
    const currentTime =
      currentHorario instanceof Date
        ? currentHorario
        : new Date(currentHorario);

    const elapsedSeconds =
      (currentTime.getTime() - startTime.getTime()) / 1000;

    const keys = Object.keys(timelineHash).sort();

    let stepIndex = keys.findIndex((time) => {
      const diff =
        (new Date(time).getTime() - startTime.getTime()) / 1000;
      return elapsedSeconds <= diff;
    });

    if (stepIndex === -1) {
      stepIndex = keys.length - 1;
    }

    stepIndex = Math.max(0, stepIndex - 3);

    const currentKey = keys[stepIndex];
    const currentStep = timelineHash[currentKey];

    return { stepIndex, currentStep, currentKey };
  }
  startStepProgression(): void {
    const round = this.round();
    if (!round || !round.timeline) return;

    if (this.stepInterval !== null) {
      clearTimeout(this.stepInterval);
      this.stepInterval = null;
    }

    const keys = Object.keys(round.timeline).sort();

    if (typeof this.step_timeline.stepIndex !== 'number') {
      this.step_timeline.stepIndex = -1;
    }

    const runStep = () => {
      this.step_timeline.stepIndex++;

      // 👉 último step → encerra
      if (this.step_timeline.stepIndex === keys.length - 1) {
        this.stepInterval = null;
        return;
      }

      const currentKey = keys[this.step_timeline.stepIndex];
      const currentStep = round.timeline[currentKey];

      this.step_timeline.currentKey = currentKey;
      this.step_timeline.currentStep = currentStep;

      if (currentStep.eventData) {
        this.eventData = currentStep.eventData;
      }

      // 🧹 Remove steps anteriores (liberar memória)
      // for (let i = 0; i < this.step_timeline.stepIndex; i++) {
      //   delete round.timeline[keys[i]];
      // }

      const delay = currentStep.delay ?? 0;

      this.stepInterval = window.setTimeout(
        runStep,
        delay * 1000
      );
    };

    runStep();
  }

    ngOnDestroy(): void {
    this.socketService.unsubscribeToChannel(`room_${this.roomId()}`);
    this.socketService.unsubscribeToChannel(`chat_room_${this.roomId()}`);
  }
}
