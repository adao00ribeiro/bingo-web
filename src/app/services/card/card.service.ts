import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICard } from '../../interfaces/ICard';
import { Observable } from 'rxjs';
import { IPaged } from '../../interfaces/IPaged';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private url = `${environment.api}/api/v1/card`
  private httpClient: HttpClient = inject(HttpClient);

   GetAllByIdRound(roundId : string , page: number , size : number): Observable<IPaged<ICard>> {
    return this.httpClient.get<IPaged>(`${this.url}/round/${roundId}?page=${page}&size=${size}`)
   }
}
