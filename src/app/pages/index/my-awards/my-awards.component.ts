import { Component, inject } from '@angular/core';
import { TableComponent } from "../../../components/table/table.component";
import { CardWinnersService } from '../../../services/card-winners.service';


@Component({
  selector: 'app-my-awards',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-awards.component.html',
  styleUrl: './my-awards.component.scss'
})
export class MyAwardsComponent {
 protected readonly cardwinnerService: CardWinnersService = inject(CardWinnersService);


 columnConfigs = [
  { key: 'id', displayName: 'ID' , pipe: "guid"},
  { key: 'value', displayName: 'Valor' , pipe: "currency" },
  { key: 'cardId', displayName: 'ID Card',pipe: "guid" },
];
 ngOnInit(): void {
 this.cardwinnerService.loadCardWinners();
}
}
