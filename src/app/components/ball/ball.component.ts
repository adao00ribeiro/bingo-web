import { Component, computed, effect, HostListener, input, Input, OnChanges } from '@angular/core';
import colors from '../../../assets/number_colors.json';

@Component({
  selector: 'app-ball',
  standalone: true,
  imports: [],
  templateUrl: './ball.component.html',
  styleUrl: './ball.component.scss'
})
export class BallComponent {
   private numberColors: { [key: number]: { color1: string; color2: string; color3: string; color4: string } } = colors;
   number = input<number>(0);
   size = input<number>(80);
   fontSize = input<number>(10);

   ballStyles =  computed(()=>{
      const colors = this.getColor(this.number());

      return {
        "--ball-color1": colors?.color1,
        "--ball-color2": colors?.color2,
        "--ball-color3": colors?.color3,
        "--ball-color4": colors?.color4,
      };
   }); // Armazena os estilos dinâmicos


  getColor(index: number): { color1: string; color2: string; color3: string; color4: string } | null {
    return this.numberColors[index] || null; // Retorna as cores ou null se o índice não existir
  }
}
