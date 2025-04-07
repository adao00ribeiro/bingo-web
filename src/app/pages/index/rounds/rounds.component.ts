import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CardRoundComponent } from "../../../components/card-round/card-round.component";
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { CarouselComponent } from "../../../components/carousel/carousel.component";
import { RoundService } from '../../../services/round/round.service';
import { RoundsByRoomIdResourceService } from '../../../resource/round/rounds-by-room-id-resource.service';
import { PunterMeResourceService } from '../../../resource/punter/punter-me-resource.service';
import { AudioDataBaseService } from '../../../services/audio-data-base.service';


@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [CardRoundComponent, CarouselComponent],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent  {
  public readonly roundService:RoundService = inject(RoundService);
  public readonly roundsRealTimeService : RoundsRealTimeService = inject(RoundsRealTimeService);
  protected readonly RoundsByRoomIdResourceService = inject(RoundsByRoomIdResourceService);
  protected readonly PunterMeResourceService = inject(PunterMeResourceService);
   readonly audioDataBaseService = inject(AudioDataBaseService);

  selectedBalls = signal<number | null>(null);

  rounds = computed(() => this.RoundsByRoomIdResourceService.resource.value() || []);
  filteredRounds = computed(() => {
    const rounds = this.rounds();
    const balls = this.selectedBalls();
    return balls ? rounds.filter(round => round.maxBalls === balls) : rounds;
  });
  constructor(){
    effect(()=>{
      const punter = this.PunterMeResourceService.resource.value();
      if(punter){
        this.RoundsByRoomIdResourceService.loadRoundsByRoomId(punter.seller.rooms[0].id);
      }
    })
  }

  filterRounds(balls: number) {
    this.selectedBalls.set(balls);
  }

  filterAllRounds() {
    this.selectedBalls.set(null);
  }

}
