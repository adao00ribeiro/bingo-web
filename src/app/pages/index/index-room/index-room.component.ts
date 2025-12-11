import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RoundsRealTimeService } from '../../../services/rounds-real-time.service';
import { CarouselComponent } from "../../../components/carousel/carousel.component";
import { RoundService } from '../../../services/round/round.service';
import { AudioDataBaseService } from '../../../services/audio-data-base.service';
import { PunterMeResource } from '../../../resource/punter/punter-me.resource';
import { IPunter } from '../../../interfaces/IPunter';
import { IRound } from '../../../interfaces/IRound';
import { CardRoomComponent } from '../../../components/card-room/card-room.component';
@Component({
  selector: 'app-index-room',
   imports: [ CarouselComponent , CardRoomComponent],
  templateUrl: './index-room.component.html',
  styleUrl: './index-room.component.scss'
})
export class IndexRoomComponent  implements OnInit {
protected readonly roundService:RoundService = inject(RoundService);

  protected readonly roundsRealTimeService : RoundsRealTimeService = inject(RoundsRealTimeService);
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
  constructor(){
    effect(()=>{
      var punter = this.punterMeResource.resource.value();
      if(punter){
      this.punter.set(punter);
       this.fetchRouds();
      }


    })
  }
   ngOnInit(): void {
    this.punterMeResource.reload();

  }
  fetchRouds(){
    if(this.punter() == null){
      return ;
    }
    var roomId = this.punter()?.seller.rooms[0].id;
    if(roomId == undefined ){
      return;
    }
    this.roundService.GetNextRounds(1,50).subscribe({
      next: (data) => {
       if(data){
       this.rounds.set(data.rows)
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

