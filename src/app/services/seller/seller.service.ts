import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ISeller } from '../../interfaces/ISeller';
import { Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';
import { ISellerRequest } from '../../interfaces/request/ISellerRequest';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private url = `${environment.api}/api/v1/seller`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number, enabledScratch: boolean): Observable<IPaged<ISeller>> {
    let url = `${this.url}?page=${page}&size=${size}`;

    if (enabledScratch !== undefined) {
      url += `&enabledScratch=${enabledScratch}`;
    }
    return this.httpClient.get<IPaged<ISeller>>(url)
  }

  Create(round: ISellerRequest): Observable<ISeller> {
    return this.httpClient.post<ISeller>(this.url, round);
  }
  GetMe(): Observable<ISeller> {
    return this.httpClient.get<ISeller>(`${this.url}/me`);
  }
  GetById(id: string): Observable<ISeller> {
    return this.httpClient.get<ISeller>(`${this.url}/id/${id}`);
  }
  GetByEmail(email: string): Observable<ISeller> {
    return this.httpClient.get<ISeller>(`${this.url}/email/${email}`);
  }
  UpdateById(id: string, round: ISeller): Observable<ISeller> {
    return this.httpClient.patch<ISeller>(`${this.url}/${id}`, round);
  }

  DeleteById(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }

}
