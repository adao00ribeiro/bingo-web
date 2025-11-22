import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from "../../../components/table/table.component";
import { CardWinnersResource } from '../../../resource/card-winner/card-winners.resource';
@Component({
  selector: 'app-my-awards',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-awards.component.html',
  styleUrl: './my-awards.component.scss'
})
export class MyAwardsComponent {
  protected readonly cardWinnersResource: CardWinnersResource = inject(CardWinnersResource);

  columnConfigs = [
    { key: 'card.round.id', displayName: 'Id rodada', pipe: "guid" },
    { key: 'card.round.cardValue', displayName: 'Valor Cartela', pipe: "currency" },
    { key: 'card.code', displayName: 'Code Card'},
    { key: 'createdAt', displayName: 'Data Criação',pipe: "dateTime" },
    { key: 'prize.type', displayName: 'Tipo do Premio' },
    { key: 'prize.value', displayName: 'Valor Premio', pipe: "currency" },
  ];
  cardWinners = computed(() => this.cardWinnersResource.resource.value()|| undefined);
  totalItems = computed(() =>
     this.cardWinnersResource.resource.value()?.rowsCount || 0
  );
   refresh(page: number, size: number) {
    this.cardWinnersResource.reload({ page: page, size: size });
  }
}
