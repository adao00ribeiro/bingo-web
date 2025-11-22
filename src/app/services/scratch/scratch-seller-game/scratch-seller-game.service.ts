import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaged } from '../../../interfaces/IPaged';
import { IScratchGameResponse } from '../../../interfaces/response/scratch/IScratchGameResponse';
import { IScratchSellerGameResponse } from '../../../interfaces/response/scratch/IScratchSellerGameResponse';
import { IScratchGameRequest } from '../../../interfaces/request/scratch/IScratchGameRequest';

@Injectable({
  providedIn: 'root'
})
export class ScratchSellerGameService {

  private url = `${environment.api}/api/v1/scratchsellergame`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page?: number, size?: number): Observable<IPaged<IScratchSellerGameResponse>> {
    let url = this.url
    console.log(page)
    if(page != undefined && size !=undefined){
          url +=  `?page=${page}&size=${size}`
    }
    return this.httpClient.get<IPaged<IScratchSellerGameResponse>>(url)
  }
  Create(data: IScratchGameRequest): Observable<IScratchGameResponse> {
    return this.httpClient.post<IScratchGameResponse>(this.url, data);
  }
  GetById(id: string): Observable<IScratchSellerGameResponse> {
    return this.httpClient.get<IScratchSellerGameResponse>(`${this.url}/id/${id}`);
  }
}
