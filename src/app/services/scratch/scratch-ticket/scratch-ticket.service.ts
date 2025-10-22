import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IScratchTicketResponse } from '../../../interfaces/response/scratch/IScratchTicketResponse';
import { IScratchBuyRequest } from '../../../interfaces/request/scratch/IScratchBuyRequest';
import { IScratchFinishRequest } from '../../../interfaces/request/scratch/IScratchFinishRequest';


@Injectable({
  providedIn: 'root'
})
export class ScratchTicketService {
  private url = `${environment.api}/api/v1/scratchticket`
  private httpClient: HttpClient = inject(HttpClient);

  buyTicket(buy : IScratchBuyRequest){
      return this.httpClient.post<IScratchTicketResponse>(`${this.url}/buy`,buy);
  }
  finish(data:IScratchFinishRequest){
      return this.httpClient.post<IScratchTicketResponse>(`${this.url}/finish`,data);
  }
}
