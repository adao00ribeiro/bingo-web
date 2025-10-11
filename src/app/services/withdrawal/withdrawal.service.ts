import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, effect } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IRound } from '../../interfaces/IRound';
import { IWithdrawalRequest } from '../../interfaces/IWithdrawalRequest';
import { IWithdrawalResponse } from '../../interfaces/IWithdrawalResponse';

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  private url = `${environment.api}/api/v1/withdrawal`;
  private httpClient: HttpClient = inject(HttpClient);

  Create(withdrawal: IWithdrawalRequest): Observable<IWithdrawalResponse> {
    return this.httpClient.post<IWithdrawalResponse>(this.url, withdrawal);
  }
}
