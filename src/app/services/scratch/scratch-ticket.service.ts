import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IScratchTicketResponse } from '../../interfaces/response/scratch/IScratchTicketResponse';


@Injectable({
  providedIn: 'root'
})
export class ScratchTicketService {
  private url = `${environment.api}/api/v1/scratchticket`
  private httpClient: HttpClient = inject(HttpClient);

  buyTicket(){
      return this.httpClient.post<IScratchTicketResponse>(`${this.url}/buy`,{});
  }
  finishedTicket(data:any){
      return this.httpClient.post<IScratchTicketResponse>(this.url,data);
  }
}
