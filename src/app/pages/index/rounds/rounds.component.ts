import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CardRoundComponent } from "../../../components/card-round/card-round.component";
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { CarouselComponent } from "../../../components/carousel/carousel.component";
import { RoundService } from '../../../services/round/round.service';
import { AudioDataBaseService } from '../../../services/audio-data-base.service';
import { PunterMeResource } from '../../../resource/punter/punter-me.resource';
import { IPunter } from '../../../interfaces/IPunter';
import { IRound } from '../../../interfaces/IRound';


@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [CardRoundComponent, CarouselComponent],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent implements OnInit {
  protected readonly roundService: RoundService = inject(RoundService);

  protected readonly roundsRealTimeService: RoundsRealTimeService = inject(RoundsRealTimeService);
  protected readonly punterMeResource = inject(PunterMeResource);
  readonly audioDataBaseService = inject(AudioDataBaseService);

  selectedBalls = signal<number | null>(null);
  punter = signal<IPunter | null>(null);
  rounds = signal<IRound[]>([]);
  filteredRounds = computed(() => {
    const rounds = this.rounds();
    const balls = this.selectedBalls();
    return balls ? rounds.filter(round => round.maxBalls === balls) : rounds;
  });
  constructor() {
    effect(() => {
      var punter = this.punterMeResource.resource.value();
      if (punter) {
        this.punter.set(punter);
        this.fetchRouds();
      }


    })
  }
  ngOnInit(): void {
    this.punterMeResource.reload();

  }
  fetchRouds() {
    if (this.punter() == null) {
      return;
    }

    const roomIds = this.punter()?.onlineHouse?.ownerRooms?.map(room => room.id) ?? [];

    if (roomIds.length === 0) {
      return;
    }
    this.roundService.GetByRoomId(roomIds).subscribe({
      next: (data) => {
        if (data) {
          this.rounds.set(data)
        }
      },
      error: (err) => {

      },
      complete: () => {

      }
    });
  }
  filterRounds(balls: number) {
    this.selectedBalls.set(balls);
  }

  filterAllRounds() {
    this.selectedBalls.set(null);
  }

}
