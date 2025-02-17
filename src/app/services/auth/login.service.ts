import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginRequest } from '../../interfaces/ILoginRequest';
import { ILoginResponse } from '../../interfaces/ILoginResponse';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
   private url = `${environment.api}/api/v1/identity/login`
   private httpClient: HttpClient = inject(HttpClient);


 Login(data : ILoginRequest) :Observable<ILoginResponse>{
   return this.httpClient.post<ILoginResponse>(this.url, data);
 }

}
