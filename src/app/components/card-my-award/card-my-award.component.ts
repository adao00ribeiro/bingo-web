import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-my-award',
  standalone: true,
  imports: [],
  templateUrl: './card-my-award.component.html',
  styleUrl: './card-my-award.component.scss'
})
export class CardMyAwardComponent {
  @Input() award: any;
  @Input() value: number=0;

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }
}
