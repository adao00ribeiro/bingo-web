import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginRequest } from '../../interfaces/ILoginRequest';
import { ILoginResponse } from '../../interfaces/ILoginResponse';
import { IIndicateTagResponse } from '../../interfaces/IIndicateTagResponse';


@Injectable({
  providedIn: 'root'
})
export class PunterService {
   private url = `${environment.api}/api/v1/punter`
   private httpClient: HttpClient = inject(HttpClient);


 GetIndicateTag() :Observable<IIndicateTagResponse>{
   return this.httpClient.get<IIndicateTagResponse>(`${this.url}/indicatetag`);
 }

}
