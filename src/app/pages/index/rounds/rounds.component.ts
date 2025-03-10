import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CardRoundComponent } from "../../../components/card-round/card-round.component";
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { CarouselComponent } from "../../../components/carousel/carousel.component";
import { RoundService } from '../../../services/round/round.service';
import { RoundsByRoomIdResourceService } from '../../../resource/round/rounds-by-room-id-resource.service';




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
  protected readonly RoundsByRoomIdResourceService = inject(RoundsByRoomIdResourceService);

  constructor(){
    effect(()=>{
      console.log("Value: ", this.RoundsByRoomIdResourceService.resource.value());
      console.log("Status: ",this.RoundsByRoomIdResourceService.resource.status());
      console.log("Error: ", this.RoundsByRoomIdResourceService.resource.error());
    })
  }
  public readonly getRoundData = computed(() => {
    return (roomId: string, roundId: string) =>
      this.roundsRealTimeService.getRoundSignal()(roomId, roundId);
  });
  ngOnInit(): void {
    this.RoundsByRoomIdResourceService.loadRoundsByRoomId('1');
  }
  testResourceClick() {
    this.RoundsByRoomIdResourceService.loadRoundsByRoomId('fa34814b-cbeb-4e4e-a17c-5d7e4f365d83');
  }
}
