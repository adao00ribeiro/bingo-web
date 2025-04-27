import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IRegister } from '../../interfaces/IRegister';
import { Observable } from 'rxjs';
import { IRegisterResponse } from '../../interfaces/response/IRegisterResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
   private url = `${environment.api}/api/v1/identity/cadastro/punter`
   private httpClient: HttpClient = inject(HttpClient);


 Register(data : IRegister) :Observable<IRegisterResponse>{
   return this.httpClient.post<IRegisterResponse>(this.url, data);
 }

}
