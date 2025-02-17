import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICardBuyRequest } from '../../interfaces/ICardBuyRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardBuyService {
  private url = `${environment.api}/api/v1/cardbuy`
  private httpClient: HttpClient = inject(HttpClient);


  buy(data: ICardBuyRequest): Observable<boolean> {
    return this.httpClient.post<boolean>(this.url, data);
  }

}
