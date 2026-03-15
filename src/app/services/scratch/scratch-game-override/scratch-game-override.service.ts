import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaged } from '../../../interfaces/IPaged';
import { IScratchGameOverrideResponse } from '../../../interfaces/response/scratch/IScratchGameOverrideResponse';
import { IScratchGameOverrideRequest } from '../../../interfaces/request/scratch/IScratchGameOverrideRequest';

@Injectable({
  providedIn: 'root'
})
export class ScratchGameOverrideService {

  private url = `${environment.api}/api/v1/scratchgameoverride`;
  private httpClient: HttpClient = inject(HttpClient);

  GetAll(page: number, size: number): Observable<IPaged<IScratchGameOverrideResponse>> {
    return this.httpClient.get<IPaged<IScratchGameOverrideResponse>>(this.url + `?page=${page}&size=${size}`)
  }
  Create(data: IScratchGameOverrideRequest): Observable<IScratchGameOverrideResponse> {
    return this.httpClient.post<IScratchGameOverrideResponse>(this.url, data);
  }
  GetById(id: string): Observable<IScratchGameOverrideResponse> {
    return this.httpClient.get<IScratchGameOverrideResponse>(`${this.url}/id/${id}`);
  }
}
