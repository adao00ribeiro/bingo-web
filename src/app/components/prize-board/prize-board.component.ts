import {Component, computed, input} from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { IPrizeResult } from '../../interfaces/IPrizeResult';
import { CurrencyPipe } from '../../pipes/currency.pipe';


@Component({
  selector: 'app-prize-board',
  standalone: true,
  imports: [ CurrencyPipe,MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prize-board.component.html',
  styleUrl: './prize-board.component.scss'
})
export class PrizeBoardComponent {
   prizeResults = input<IPrizeResult[] | undefined>();


  isOpen = false;
  currentPrize = computed(()=>{
    console.log(this.prizeResults())
    return this.prizeResults()?.find(x=>x.winningCards.length==0)?.prizeType
  })
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  // Computa o primeiro prêmio que ainda não saiu

}
