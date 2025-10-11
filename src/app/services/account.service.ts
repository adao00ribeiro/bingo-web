import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = `${environment.api}/api/v1/identity`;
     private httpClient: HttpClient = inject(HttpClient);



  forgotPassword(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.baseUrl}/reset-password`, { email, token, newPassword });
  }
}
