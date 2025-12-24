import { Component, computed, input, signal } from '@angular/core';
import { IRound } from '../../interfaces/IRound';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { GuidPipe } from '../../pipes/guid.pipe';
import { PrizeBoardComponent } from "../prize-board/prize-board.component";

@Component({
  selector: 'app-info-room',
  imports: [CurrencyPipe,
    GuidPipe, PrizeBoardComponent],
  templateUrl: './info-room.component.html',
  styleUrl: './info-room.component.scss'
})
export class InfoRoomComponent {
    round = input<IRound | null>();

      totalPrize = computed(() => {
          if (this.round()) {
            return this.round()?.prizes.reduce((total, prize) => total + prize.value, 0);
          }
          return 0;
        });
}
