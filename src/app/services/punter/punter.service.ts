import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIndicateTagResponse } from '../../interfaces/IIndicateTagResponse';
import { IPunterPatchRequestDto } from '../../interfaces/request/IPunterPatchRequestDto';
import { IPunter } from '../../interfaces/IPunter';


@Injectable({
  providedIn: 'root'
})
export class PunterService {
  private url = `${environment.api}/api/v1/punter`
  private httpClient: HttpClient = inject(HttpClient);

  GetIndicateTag(): Observable<IIndicateTagResponse> {
    return this.httpClient.get<IIndicateTagResponse>(`${this.url}/indicatetag`);
  }
  Update(data: IPunterPatchRequestDto): Observable<void> {
    return this.httpClient.patch<void>(this.url, data);
  }
   GetMe(): Observable<IPunter> {
    return this.httpClient.get<IPunter>(this.url + "/me")
 }
}
