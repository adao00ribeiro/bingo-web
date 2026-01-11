import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';
import { IOnlineHouseResponse } from '../../interfaces/response/bingo/IOnlineHouseResponse';

@Injectable({
  providedIn: 'root'
})
export class OnlineHouseService {
  private url = `${environment.api}/api/v1/onlinehouse`
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<IOnlineHouseResponse>> {
    return this.httpClient.get<IPaged<IOnlineHouseResponse>>(this.url + `?page=${page}&size=${size}`)
  }
  GetByHostname(hostname: string): Observable<IOnlineHouseResponse> {
    return this.httpClient
    .get<IOnlineHouseResponse>(`${this.url}/hostname/${hostname}`)
    .pipe(
      delay(10_000) // 1 minuto
    );
  }
}
