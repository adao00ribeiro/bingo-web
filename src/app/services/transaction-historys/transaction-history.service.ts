import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';
import { ITransactionHistoryResponse } from '../../interfaces/response/ITransactionHistory';

@Injectable({
  providedIn: 'root'
})
export class TransactionHistoryService {
  private url = `${environment.api}/api/v1/transactionhistory`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<ITransactionHistoryResponse>> {
    return this.httpClient.get<IPaged<ITransactionHistoryResponse>>(this.url + `?page=${page}&size=${size}`)
  }

}
