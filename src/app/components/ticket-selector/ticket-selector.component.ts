import { Component, EventEmitter, inject, Input, input, model, output, Output } from '@angular/core';
import { IRound } from '../../interfaces/IRound';
import { GuidPipe } from '../../pipes/guid.pipe';
import { CurrencyPipe } from '../../pipes/currency.pipe';
import { FormsModule } from '@angular/forms';
import { PunterMeResource } from '../../resource/punter/punter-me.resource';
import { RoundsResource } from '../../resource/round/rounds.resource';
import { CardBuyService } from '../../services/card/card-buy.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICardBuyRequest } from '../../interfaces/ICardBuyRequest';

@Component({
  selector: 'app-ticket-selector',
  imports: [FormsModule, CurrencyPipe, GuidPipe],
  templateUrl: './ticket-selector.component.html',
  styleUrl: './ticket-selector.component.scss'
})
export class TicketSelectorComponent {

  round = input.required<IRound>();
  totalCards = input<number>(0);
  purchaseCompleted = output<void>();
  protected readonly PunterMeResource = inject(PunterMeResource);
  private readonly roundResource = inject(RoundsResource);

  @Input() hiddenTittle: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  readonly cardBuyService = inject(CardBuyService);
  readonly valueModel = model('0');
  loading: boolean = false;
  moneytotal: number = 0.0;
  presets = [1, 25, 49, 73];
  max = 96;

  constructor(private snackBar: MatSnackBar) { }


  changeBuy() {
    if (this.ticketCount < 1) {
      this.snackBar.open('Your message here', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    this.loading = true;
    const loginRequest: ICardBuyRequest = {
      quantity: this.ticketCount,
      roundId: this.round().id,
      punterId: this.PunterMeResource.resource.value()?.id
    };
    this.cardBuyService.buy(loginRequest).subscribe({
      next: (data) => {
        if (data) {
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
          duration: 15000, // Set the duration in milliseconds
          horizontalPosition: 'center', // Options: 'start', 'center', 'end'
          verticalPosition: 'bottom', // Options: 'top', 'bottom'
          panelClass: ['sucess-snackbar'],
        });
        this.purchaseCompleted.emit();
      }
    });
  }

  fetchRoundById(id: any) {
    // Implementar a chamada para buscar a rodada pelo ID
  }



  ticketCount: number = 2;
  pricePerTicket: number = 0.10;

  get totalPrice(): number {
    return this.ticketCount * this.pricePerTicket
  }

  get freeTickets(): number {
    return 0;
  }

  setTicketCount(count: number): void {
    this.ticketCount = count;
  }

  increaseTickets(): void {
    if (this.ticketCount < 36) {
      this.ticketCount++;
    }
  }

  decreaseTickets(): void {
    if (this.ticketCount > 1) {
      this.ticketCount--;
    }
  }

  clearSelection(): void {
    this.ticketCount = 1;
  }
}
