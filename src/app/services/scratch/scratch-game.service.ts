import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IScratchGameResponse } from '../../interfaces/response/scratch/IScratchGameResponse';


@Injectable({
  providedIn: 'root'
})
export class ScratchGameService {
  private url = `${environment.api}/api/v1/scratchgame`
  private httpClient: HttpClient = inject(HttpClient);

  GetAllGame(): Observable<IScratchGameResponse[]> {
     return this.httpClient.get<IScratchGameResponse[]>(this.url);
   }

}
