import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-number-selection',
  imports: [ReactiveFormsModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatDividerModule,
      MatDialogContent,
      MatCardModule,
      MatButtonModule],
  templateUrl: './dialog-number-selection.component.html',
  styleUrl: './dialog-number-selection.component.scss'
})
export class DialogNumberSelectionComponent {

  availableNumbers: number[] = Array.from({ length: 30 }, (_, i) => i + 1);
  selectedNumbers: number[][] = [[], [], []];
  currentStep = 0;

  constructor(public dialogRef: MatDialogRef<DialogNumberSelectionComponent>) {}

  isNumberSelected(num: number): boolean {
    // Verifica se o número já foi escolhido em alguma etapa anterior
    return this.selectedNumbers.flat().includes(num);
  }

  selectNumber(num: number) {
    const stepNumbers = this.selectedNumbers[this.currentStep];

    if (stepNumbers.includes(num)) {
      // Se já estiver selecionado, deseleciona
      this.selectedNumbers[this.currentStep] = stepNumbers.filter(n => n !== num);
    } else if (stepNumbers.length < 3) {
      // Se ainda não atingiu o limite, adiciona e ordena
      stepNumbers.push(num);
      stepNumbers.sort((a, b) => a - b);
    }
  }

  nextStep() {
    if (this.selectedNumbers[this.currentStep].length === 3 && this.currentStep < 2) {
      this.currentStep++;
    }
  }

  finish() {
    if (this.selectedNumbers[2].length === 3) {
      this.dialogRef.close(this.selectedNumbers);
    }
  }
  cancel() {
    this.dialogRef.close(this.selectedNumbers);
    }
}
