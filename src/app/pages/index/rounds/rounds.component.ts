import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CardRoundComponent } from "../../../components/card-round/card-round.component";
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { CarouselComponent } from "../../../components/carousel/carousel.component";
import { RoundService } from '../../../services/round/round.service';
import {  RoundsResourceService } from '../../../resource/round/rounds-resource.service';




@Component({
  selector: 'app-rounds',
  standalone: true,
  imports: [CardRoundComponent, CarouselComponent],
  templateUrl: './rounds.component.html',
  styleUrl: './rounds.component.scss',
})
export class RoundsComponent implements OnInit{


  public readonly roundService:RoundService = inject(RoundService);
  public readonly roundsRealTimeService : RoundsRealTimeService = inject(RoundsRealTimeService);
  protected readonly roundsResourceService = inject(RoundsResourceService);

  constructor(){
    effect(()=>{
      console.log("Value: ", this.roundsResourceService.roundsResource.value());
      console.log("Status: ",this.roundsResourceService.roundsResource.status());
      console.log("Error: ", this.roundsResourceService.roundsResource.error());
    })
  }
  public readonly getRoundData = computed(() => {
    return (roomId: string, roundId: string) =>
      this.roundsRealTimeService.getRoundSignal()(roomId, roundId);
  });
  ngOnInit(): void {
    this.roundsResourceService.reloadRounds();
  }
  testResourceClick() {
    this.roundsResourceService.reloadRounds();
  }

}
