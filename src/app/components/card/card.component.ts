import { Component, input, Input, OnInit } from '@angular/core';
import { ICard } from '../../interfaces/ICard';
import { GuidPipe } from '../../pipes/guid.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [GuidPipe,CommonModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.card().round)
  }

  card = input.required<ICard>();
  balls = input.required<number[]>();

   gridStyles() {
    const rows = this.card().round.cardRows;
    const cols = this.card().round.cardColumns;
    return {
      'grid-template-rows': `repeat(${rows}, 1fr)`,
      'grid-template-columns': `repeat(${cols}, 1fr)`
    };
  }

  defineclass(nameClass : number) {
    return this.balls().includes(nameClass) ? "ballRed" : "ballBlue";
  }
}
