import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';
import { IRoom } from '../../interfaces/IRoom';
import { IRoomRequest } from '../../interfaces/request/IRoomRequest';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private url = `${environment.api}/api/v1/room`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<IRoom>> {
    return this.httpClient.get<IPaged<IRoom>>(this.url + `?page=${page}&size=${size}`)
  }

  Create(recharge: IRoomRequest): Observable<IRoom> {
    return this.httpClient.post<IRoom>(this.url, recharge);
  }

  GetById(id: string): Observable<IRoom> {
    return this.httpClient.get<IRoom>(`${this.url}/id/${id}`);
  }

  UpdateById(id: number, recharge: IRoom): Observable<IRoom> {
    return this.httpClient.put<IRoom>(`${this.url}/${id}`, recharge);
  }
  PatchById( recharge: IRoom): Observable<boolean> {
    return this.httpClient.patch<boolean>(`${this.url}/complete`, recharge);
  }
  DeleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
