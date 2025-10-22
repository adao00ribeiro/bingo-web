import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Input, model, OnInit, Output } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRound } from '../../interfaces/IRound';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { CardBuyService } from '../../services/card/card-buy.service';
import { ICardBuyRequest } from '../../interfaces/ICardBuyRequest';
import { GuidPipe } from '../../pipes/guid.pipe';
import { PunterMeResource } from '../../resource/punter/punter-me.resource';
import { RoundsResource } from '../../resource/round/rounds.resource';
@Component({
  selector: 'app-card-buy',
  standalone: true,
  imports: [CommonModule,FormsModule,CurrencyPipe , GuidPipe],
  templateUrl: './card-buy.component.html',
  styleUrl: './card-buy.component.scss',
  providers:[]
})
export class CardBuyComponent  {
  round = input.required<IRound>();
  protected readonly PunterMeResource = inject(PunterMeResource);
  private readonly roundResource = inject(RoundsResource);


  @Input() hiddenTittle: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  readonly cardBuyService = inject(CardBuyService);
  readonly valueModel = model('0');
  loading: boolean = false;
  valueQtds: number = 0;
  moneytotal: number = 0.0;
  constructor(private snackBar: MatSnackBar) { }

  handleReset() {
    this.handleSetValue(0);

  }

  handleSetValue(value: number) {
    this.valueQtds = value;
    this.moneytotal = this.round().cardValue * this.valueQtds;
    this.valueModel.set( this.valueQtds.toString());
  }

  handleAddValue(value: number) {
    const newvalue = this.valueQtds + value;
    this.handleSetValue(newvalue);
  }

  handleSubValue(value: number) {
    const newvalue = this.valueQtds + value;
    if (newvalue < 0) {
      this.valueQtds = 0;
      return;
    }
    this.handleSetValue(newvalue);
  }

  changeBuy() {
    if (this.valueQtds < 2) {
      this.snackBar.open('Your message here', 'Close', {
        duration: 5000,
       horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    this.loading = true;
     const loginRequest: ICardBuyRequest = {
      quantity: this.valueQtds,
      roundId : this.round().id,
      punterId : this.PunterMeResource.resource.value()?.id
    };
    this.cardBuyService.buy(loginRequest).subscribe({
      next: (data) => {
        if(data){
            this.roundResource.reload();
            this.PunterMeResource.resource.reload()
        }
        this.loading = false;
      },
      error: (err) => {
        this.snackBar.open(err.error.detail, 'Ok', {
          duration: 5000, // Set the duration in milliseconds
         horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: 'error-snackbar',
        });
        this.loading = false;
        // Aqui você pode implementar a lógica para lidar com o erro, como exibir uma mensagem ao usuário
      },
      complete: () => {
        this.snackBar.open("Compra finalizada com sucesso", 'Ok', {
          duration: 150000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: ['sucess-snackbar'],
        });
          this.closeModal.emit();
      }
    });
  }

  fetchRoundById(id: any) {
    // Implementar a chamada para buscar a rodada pelo ID
  }
}
