import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from "../../../components/table/table.component";
import { CardWinnersResourceService } from '../../../resource/card-winner/card-winners-resource.service';
@Component({
  selector: 'app-my-awards',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-awards.component.html',
  styleUrl: './my-awards.component.scss'
})
export class MyAwardsComponent {
  protected readonly cardWinnersResourceService: CardWinnersResourceService = inject(CardWinnersResourceService);

  columnConfigs = [
    { key: 'card.round.id', displayName: 'Id rodada', pipe: "guid" },
    { key: 'card.round.cardValue', displayName: 'Valor Cartela', pipe: "currency" },
    { key: 'card.code', displayName: 'Code Card'},
    { key: 'createAt', displayName: 'Data Criação',pipe: "dateTime" },
    { key: 'prize.type', displayName: 'Tipo do Premio' },
    { key: 'prize.value', displayName: 'Valor Premio', pipe: "currency" },
  ];
  cardWinners = computed(() => this.cardWinnersResourceService.resource.value()|| undefined);
  totalItems = computed(() =>
     this.cardWinnersResourceService.resource.value()?.totalCount || 0
  );
  loadData(page: number, size: number) {
    this.cardWinnersResourceService.reload(page, size)
  }
}
