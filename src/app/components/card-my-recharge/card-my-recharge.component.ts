import { Component, Input } from '@angular/core';
import { IRecharge } from '../../interfaces/IRecharge';

import { ERechargeStatus } from '../../enums/ERechargeStatus';
@Component({
  selector: 'app-card-my-recharge',
  standalone: true,
  imports: [],
  templateUrl: './card-my-recharge.component.html',
  styleUrl: './card-my-recharge.component.scss'
})
export class CardMyRechargeComponent {
  @Input() recharge: IRecharge | undefined = undefined;
  @Input() value: number = 0;

  formatarData(date: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }
}
