import { Component, input } from '@angular/core';
import { BallComponent } from "../ball/ball.component";

@Component({
  selector: 'app-sung-numbers',
  standalone: true,
  imports: [BallComponent],
  templateUrl: './sung-numbers.component.html',
  styleUrl: './sung-numbers.component.scss'
})
export class SungNumbersComponent {
  mainBall =   input.required<number>();
  secondBall = input.required<number>();
  thirdBall = input.required<number>();
  fourthBall = input.required<number>();
  maxBalls = input.required<number>();
  MaxNumbers = input.required<number>();

}
