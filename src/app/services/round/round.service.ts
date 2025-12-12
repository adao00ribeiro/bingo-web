import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, Signal, effect } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IRound } from '../../interfaces/IRound';
import { IPaged } from '../../interfaces/IPaged';
import { IRoundRequest } from '../../interfaces/request/IRoundRequest';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private url = `${environment.api}/api/v1/round`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<IRound>> {
    return this.httpClient.get<IPaged<IRound>>(this.url + `?page=${page}&size=${size}`)
  }
   GetNextRounds(page: number, size: number ): Observable<IPaged<IRound>> {
    return this.httpClient.get<IPaged<IRound>>(this.url + `/next` + `?page=${page}&size=${size}`)
  }
  Create(round: IRoundRequest): Observable<IRound> {
    return this.httpClient.post<IRound>(this.url, round);
  }
  GetById(id: string): Observable<IRound> {
    return this.httpClient.get<IRound>(`${this.url}/id/${id}`);
  }
  GetByRoomId(roomId: string){
    return this.httpClient.get<IRound[]>(`${this.url}/filter/room/${roomId}`);;
  }
  UpdateById(id: number, round: IRound): Observable<IRound> {
    return this.httpClient.put<IRound>(`${this.url}/${id}`, round);
  }
  DeleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
