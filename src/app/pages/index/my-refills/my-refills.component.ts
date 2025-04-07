import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { RechargesResourceService } from '../../../resource/recharge/recharges-resource.service';

@Component({
  selector: 'app-my-refills',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './my-refills.component.html',
  styleUrl: './my-refills.component.scss'
})
export class MyRefillsComponent {

  protected readonly rechargeService: RechargesResourceService = inject(RechargesResourceService);

  recharges = computed(() => this.rechargeService.resource.value() || undefined);
  totalItems = 0;
  columnConfigs = [
    { key: 'id', displayName: 'ID', pipe: "guid" },
    { key: 'value', displayName: 'Valor', pipe: "currency" },
    { key: 'status', displayName: 'Status' },
  ];
  constructor() {
    effect(() => {

    })
    this.loadData(1, 5);
  }

  loadData(page: number, size: number) {
   this.rechargeService.reload(page,size)
  }
}
