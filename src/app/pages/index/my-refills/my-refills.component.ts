import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { RechargesResource } from '../../../resource/recharge/recharges.resource';

@Component({
  selector: 'app-my-refills',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-refills.component.html',
  styleUrl: './my-refills.component.scss'
})
export class MyRefillsComponent implements OnInit {

  protected readonly rechargeService: RechargesResource = inject(RechargesResource);

  recharges = computed(() => this.rechargeService.resource.value() || undefined);
  totalItems = 0;
  columnConfigs = [
    { key: 'id', displayName: 'ID', pipe: "guid" },
    { key: 'value', displayName: 'Valor', pipe: "currency" },
    { key: 'status', displayName: 'Status' },
  ];
  constructor() {

  }
 ngOnInit(): void {
    this.refresh(1, 10);
  }
   refresh(page: number, size: number) {
    this.rechargeService.reload({ page: page, size: size });
  }
}
