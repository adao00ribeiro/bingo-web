import { Component, computed, inject, OnInit } from '@angular/core';
import { TableComponent } from '../../../components/table/table.component';
import { DialogCashoutComponent } from '../../../components/dialogs/dialog-cashout/dialog-cashout.component';
import { MatDialog } from '@angular/material/dialog';
import { TransactionHistorysResource } from '../../../resource/transaction-history/transaction-historys.resource';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent implements OnInit {
  protected readonly transactionHistorysResource: TransactionHistorysResource = inject(TransactionHistorysResource);
  readonly dialog = inject(MatDialog);
  columnConfigs = [
    { key: 'id', displayName: 'Id', pipe: "guid" },
    { key: 'amount', displayName: 'Valor', pipe: "currency" },
    { key: 'previousBalance', displayName: 'Saldo Anterior', pipe: "currency" },
    { key: 'currentBalance', displayName: 'Saldo Atual', pipe: "currency" },
    { key: 'type', displayName: 'Tipo' },
    { key: 'createdAt', displayName: 'Data Criação', pipe: "dateTime" },

  ];

  transactionsHistory = computed(() => this.transactionHistorysResource.resource.value() || undefined);
  ngOnInit(): void {
    this.refresh(1, 10);
  }
  refresh(page: number, size: number) {
    this.transactionHistorysResource.reload({ page: page, size: size });
  }
  openDialogCashout() {
    this.dialog.open(DialogCashoutComponent, {
      data: {},
    });
  }
}
