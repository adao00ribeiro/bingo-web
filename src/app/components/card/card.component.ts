import { Component, input, Input, OnInit } from '@angular/core';
import { ICard } from '../../interfaces/ICard';
import { GuidPipe } from '../../pipes/guid.pipe';
import { CommonModule } from '@angular/common';
import { EPrizeType } from '../../enums/EPrizeType';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [GuidPipe,CommonModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent  {

  card = input.required<ICard>();
  balls = input<number[]>([]);
  prizeType = input<EPrizeType | undefined>();

   gridStyles() {
    const rows = this.card().round.cardRows;
    const cols = this.card().round.cardColumns;
    return {
      'grid-template-rows': `repeat(${rows}, 1fr)`,
      'grid-template-columns': `repeat(${cols}, 1fr)`
    };
  }

  defineclass(n : number) {
    if (this.balls() == null) {
      return "ball";
    }
    if (this.balls()[this.balls().length - 1] === n) {
      return "ball-current";
    }

    return this.balls().includes(n) ? "ball-marked" : "ball";
  }
}
