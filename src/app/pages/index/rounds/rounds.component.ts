import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CardRoundComponent } from "../../../components/card-round/card-round.component";
import { RoundService } from '../../../services/round/round.service';
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { IRound } from '../../../interfaces/IRound';
import { CarouselComponent } from "../../../components/carousel/carousel.component";

@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [CardRoundComponent, CarouselComponent],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
  providers:[RoundService]
})
export class RoundsComponent implements OnInit{


  public readonly roundService:RoundService = inject(RoundService);
  public readonly roundsRealTimeService : RoundsRealTimeService = inject(RoundsRealTimeService);

  rounds : IRound[] = [];

  public readonly getRoundData = computed(() => {
    return (roomId: string, roundId: string) =>
      this.roundsRealTimeService.getRoundSignal()(roomId, roundId);
  });
  constructor(){
    effect(()=>{
      this.rounds = this.roundService.rounds();
      console.log('teste')
    })
  }

  ngOnInit(): void {
   this.roundService.loadRounds();
  }

}
