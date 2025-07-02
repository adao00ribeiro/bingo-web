import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDeactivateAccountRequestDto } from '../../interfaces/request/IDeactivateAccountRequestDto';


@Injectable({
  providedIn: 'root'
})
export class InactivateFor30Days {
  private url = `${environment.api}/api/v1/identity/inactivate-for-30-days`
  private httpClient: HttpClient = inject(HttpClient);


  Inactivate(data: IDeactivateAccountRequestDto): Observable<void> {
    return this.httpClient.post<void>(this.url, data);
  }

}
