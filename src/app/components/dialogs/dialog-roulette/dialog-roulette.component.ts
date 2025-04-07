import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CardBuyComponent } from '../../card-buy/card-buy.component';

@Component({
  selector: 'app-dialog-roulette',
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,  MatDialogContent,  MatButtonModule],
  templateUrl: './dialog-roulette.component.html',
  styleUrl: './dialog-roulette.component.scss'
})
export class DialogRouletteComponent {
  @ViewChild('internoRoleta') internoRoleta!: ElementRef;
  @ViewChild('spin') spinButton!: ElementRef;
  @ViewChild('txtResult') txtResult!: ElementRef;

  degree = 1800;
  clicks = 0;
  selectedOption = '';
  isSpinning = false;

  ngAfterViewInit() {
    // Initialize any necessary elements after view is loaded
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;

    this.clicks++;
    const newDegree = this.degree * this.clicks;
    const extraDegree = Math.floor(Math.random() * 360) + 1;
    const totalDegree = newDegree + extraDegree;

    // Apply the rotation
    const rouletteElement = this.internoRoleta.nativeElement as HTMLElement;
    rouletteElement.style.transition = 'all 5s ease-out';
    rouletteElement.style.transform = `rotate(${totalDegree}deg)`;

    // Determine the result after spinning
    setTimeout(() => {
      this.determineResult(totalDegree % 360);
      this.isSpinning = false;
    }, 5000);
  }

  determineResult(finalAngle: number) {
    // Calculate which section is selected based on final angle
    // Assuming 6 sections of 60 degrees each
    const sectionSize = 60;
    const normalizedAngle = (finalAngle % 360); // Normalize to 0-359
    const section = Math.floor(normalizedAngle / sectionSize);

    // Map section number to option
    const options = ['Front-End', 'Back End', 'Full Stack', 'Des. Mobile', 'DevOps', 'Anal. de Dados'];
    this.selectedOption = options[section % options.length];

    if (this.txtResult) {
      this.txtResult.nativeElement.innerText = `Resultado: ${this.selectedOption}`;
    }
  }
}
