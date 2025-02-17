import { Component, inject, OnInit } from '@angular/core';
import { CardMyRechargeComponent } from "../../../components/card-my-recharge/card-my-recharge.component";
import { TableComponent } from '../../../components/table/table.component';
import { RechargeService } from '../../../services/recharge/recharge.service';

@Component({
  selector: 'app-my-refills',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-refills.component.html',
  styleUrl: './my-refills.component.scss'
})
export class MyRefillsComponent  implements OnInit{

 protected readonly rechargeService: RechargeService = inject(RechargeService);


 columnConfigs = [
  { key: 'id', displayName: 'ID', pipe: "guid" },
  { key: 'value', displayName: 'Valor', pipe: "currency" },
  { key: 'status', displayName: 'Status' },
];
 ngOnInit(): void {
  this.rechargeService.loadRecharges();
}
}
