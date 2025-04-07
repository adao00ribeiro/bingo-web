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
