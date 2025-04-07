import { Component, input } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { CardPrizeComponent } from "../card-prize/card-prize.component";
import { IPrize } from '../../interfaces/IPrize';

@Component({
  selector: 'app-prize-board',
  standalone: true,
  imports: [ CardPrizeComponent],
  templateUrl: './prize-board.component.html',
  styleUrl: './prize-board.component.scss'
})
export class PrizeBoardComponent {
  prizes= input<IPrize[] | undefined>([])
}
