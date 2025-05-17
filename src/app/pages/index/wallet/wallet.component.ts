import { Component, computed, inject } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { TransactionHistorysResourceService } from '../../../resource/transaction-history/transaction-historys-resource.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  protected readonly transactionHistorysResourceService: TransactionHistorysResourceService = inject(TransactionHistorysResourceService);

  columnConfigs = [
    { key: 'id', displayName: 'Id', pipe: "guid" },
    { key: 'amount', displayName: 'Valor', pipe: "currency" },
    { key: 'previousBalance', displayName: 'Saldo anterior', pipe: "currency"  },
    { key: 'currentBalance', displayName: 'Saldo Posterior' , pipe: "currency"  },
    { key: 'type', displayName: 'Tipo' },
    { key: 'createAt', displayName: 'Data Criação', pipe: "dateTime" },

  ];

    transactionsHistory = computed(() => this.transactionHistorysResourceService.resource.value()|| undefined);
    totalItems = computed(() =>
       this.transactionHistorysResourceService.resource.value()?.totalCount || 0
    );

    loadData(page: number, size: number) {
      this.transactionHistorysResourceService.reload(page, size)
    }
}
