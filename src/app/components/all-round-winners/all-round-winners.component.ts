import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-all-round-winners',
  standalone: true,
  imports: [],
  templateUrl: './all-round-winners.component.html',
  styleUrl: './all-round-winners.component.scss'
})
export class AllRoundWinnersComponent {
  @Input() prizeResults: Array<any> = [];
}
