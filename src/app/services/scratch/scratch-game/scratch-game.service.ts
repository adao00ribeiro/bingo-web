import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IScratchGameResponse } from '../../../interfaces/response/scratch/IScratchGameResponse';
import { Observable } from 'rxjs';
import { IPaged } from '../../../interfaces/IPaged';

@Injectable({
  providedIn: 'root'
})
export class ScratchGameService {

  private url = `${environment.api}/api/v1/scratchgame`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<IScratchGameResponse>> {
    let url = this.url;
    if (page != undefined || size != undefined) {
      url += `?page=${page}&size=${size}`
    }
    return this.httpClient.get<IPaged<IScratchGameResponse>>(url)
  }
  GetById(id: string): Observable<IScratchGameResponse> {
    return this.httpClient.get<IScratchGameResponse>(`${this.url}/id/${id}`);
  }

}
