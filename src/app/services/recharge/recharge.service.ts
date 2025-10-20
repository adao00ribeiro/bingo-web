import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IRecharge } from '../../interfaces/IRecharge';
import { Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private url = `${environment.api}/api/v1/recharge`;
  private httpClient: HttpClient = inject(HttpClient);

   GetAll(page: number, size: number): Observable<IPaged<IRecharge>> {
    return this.httpClient.get<IPaged<IRecharge>>(this.url + `?page=${page}&size=${size}`)
  }

  Create(recharge: IRecharge): Observable<IRecharge> {
    return this.httpClient.post<IRecharge>(this.url, recharge);
  }

  GetById(id: string): Observable<IRecharge> {
    return this.httpClient.get<IRecharge>(`${this.url}/id/${id}`);
  }

  UpdateById(id: number, recharge: IRecharge): Observable<IRecharge> {
    return this.httpClient.put<IRecharge>(`${this.url}/${id}`, recharge);
  }
  PatchById( recharge: IRecharge): Observable<boolean> {
    return this.httpClient.patch<boolean>(`${this.url}/complete`, recharge);
  }
  DeleteById(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
