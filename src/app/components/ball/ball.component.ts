import { Component, effect, HostListener, input, Input, OnChanges } from '@angular/core';
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

   ballStyles: any = {}; // Armazena os estilos dinâmicos

   constructor(){
    effect(()=>{
      this.updateStyles();
    })
   }

  @HostListener('window:resize')
  onResize(): void {
    this.updateStyles();
  }

  private updateStyles(): void {
    const colors = this.getColor(this.number());
    let size = this.size();
    let fontSize = this.fontSize();

    if (window.innerWidth <= 480) {
      size *= 0.4; // Reduz para 40% em telas muito pequenas
      fontSize *= 0.4; // Reduz o font size em 40%
    } else if (window.innerWidth <= 768) {
      size *= 0.4; // Reduz para 60% em tablets
      fontSize *= 0.4; // Reduz o font size em 60%
    } else if (window.innerWidth <= 1200) {
      size *= 0.8; // Reduz para 80% em telas médias
      fontSize *= 0.8; // Reduz o font size em 80%
    }

    this.ballStyles = {
      width: `${size}rem`,
      height: `${size}rem`,
      '--font-size': `${fontSize}rem`,
      '--ball-color1': colors?.color1,
      '--ball-color2': colors?.color2,
      '--ball-color3': colors?.color3,
      '--ball-color4': colors?.color4,
    };
  }

  getColor(index: number): { color1: string; color2: string; color3: string; color4: string } | null {
    return this.numberColors[index] || null; // Retorna as cores ou null se o índice não existir
  }
}
