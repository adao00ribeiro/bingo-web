import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INetwork } from '../../interfaces/blockchain/INetwork';
import { IPaged } from '../../interfaces/IPaged';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private url = `${environment.api}/api/v1/network`
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(): Observable<IPaged> {
    return this.httpClient.get<IPaged>(this.url);
  }
}
