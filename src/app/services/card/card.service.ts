import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICard } from '../../interfaces/ICard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private url = `${environment.api}/api/v1/card`
  private httpClient: HttpClient = inject(HttpClient);

   GetAllByIdRound(roundId : string): Observable<ICard[]> {
     return this.httpClient.get<ICard[]>(`${this.url}/round/${roundId}`);
   }
}
