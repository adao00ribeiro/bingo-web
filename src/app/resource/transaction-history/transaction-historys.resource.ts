import { Injectable, inject, signal } from "@angular/core";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { ITransactionHistoryResponse } from "../../interfaces/response/ITransactionHistory";
import { TransactionHistoryService } from "../../services/transaction-historys/transaction-history.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class TransactionHistorysResource extends BaseResource<{ page: number; size: number  }, IPaged<ITransactionHistoryResponse>> {
  private transactionHistoryService = inject(TransactionHistoryService)

  protected override loader(request: { page: number; size: number , enabledScratch:boolean }): Observable<IPaged<ITransactionHistoryResponse>> {
       return this.transactionHistoryService.GetAll(request.page, request.size);
  }
}
