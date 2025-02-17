import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, Input } from '@angular/core';

@Component({
  selector: 'app-panel-balls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-balls.component.html',
  styleUrl: './panel-balls.component.scss'
})
export class PanelBallsComponent {
  balls = input<number[]>([]);
  data = Array.from({ length: 90 }, (_, i) => i + 1);

  defineclass(nameClass : number) {
    return this.balls().includes(nameClass) ? "ballRed" : "ballBlack";
  }
}
