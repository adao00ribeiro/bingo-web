import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IDepositRequest } from '../../interfaces/IDepositRequest';
import { Observable } from 'rxjs';
import { IRecharge } from '../../interfaces/IRecharge';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  private url = `${environment.api}/api/v1/deposit`;
  private httpClient: HttpClient = inject(HttpClient);

  Deposit(room: IDepositRequest): Observable<IRecharge> {
    return this.httpClient.post<IRecharge>(this.url, room);
  }

}
