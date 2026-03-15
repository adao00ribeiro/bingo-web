import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IScratchGameOverrideResponse } from '../../../interfaces/response/scratch/IScratchGameOverrideResponse';

@Component({
  selector: 'app-game-card',
  imports: [CommonModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
})
export class GameCardComponent {
  @Input() game: IScratchGameOverrideResponse = {
    id:"string",
    title:"string",
    subtitle:"string",
    cardValue:1,
    onlineHouseId:'string',
    scratchGameId: 'string',
    createdAt: 'string',
    onlineHouse : {
      id: '',
      name: '',
      hostname: '',
      sellerId: ''
    },
    scratchGame: {}

  };
  @Input() showBadge = false;
  @Output() play = new EventEmitter<void>();

  get thumbnailUrl(): string {
    return (
      this.game?.scratchGame?.thumbinail ||
      ''
    );
  }

  get title(): string {
    return this.game?.title || this.game?.title || 'Raspadinha';
  }
}
