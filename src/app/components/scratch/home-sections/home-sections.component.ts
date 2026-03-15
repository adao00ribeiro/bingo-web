import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSkeletonComponent } from '../card-skeleton/card-skeleton.component';
import { GameCardComponent } from '../game-card/game-card.component';
import { CommonModule } from '@angular/common';
import { IScratchGameOverrideResponse } from '../../../interfaces/response/scratch/IScratchGameOverrideResponse';

@Component({
  selector: 'app-home-sections',
  imports: [CommonModule, GameCardComponent, CardSkeletonComponent],
  templateUrl: './home-sections.component.html',
  styleUrl: './home-sections.component.scss',
})
export class HomeSectionsComponent {
 @Input() loading = false;
  @Input() games: IScratchGameOverrideResponse[] = [];
  @Input() recentGames: IScratchGameOverrideResponse[] = [];
  @Input() lastPlayedGames: IScratchGameOverrideResponse[] = [];
  @Output() play = new EventEmitter<string | number>();

  skeletons = Array(8).fill(0);

  trackById(_: number, item: IScratchGameOverrideResponse): string | number {
    return item.id;
  }
}
