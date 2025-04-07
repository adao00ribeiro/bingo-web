import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { STORAGE_REFRESH_TOKEN } from '../../constants/storage.service.constants';
import { StorageService } from '../storage.service';
import { ILoginResponse } from '../../interfaces/ILoginResponse';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private url = `${environment.api}/api/v1/identity/refresh-login`
  private httpClient: HttpClient = inject(HttpClient);
  private storageService = inject(StorageService);

  refresh(): Observable<any> {
    const tokenValidation = this.storageService.getSessionItem<string>(
      STORAGE_REFRESH_TOKEN
    );

    const headers = new HttpHeaders().append('Authorization', `Bearer ${tokenValidation}`);
    console.log("fazendo refresh",this.url)
    return this.httpClient.post<ILoginResponse>(
      `${this.url}`
      , null, { headers }
    ).pipe(
      catchError((error) => {
        // Tratar o erro, lançar erro adequado
        if (error.status === 401) {
          return throwError(() => new Error('User não autenticado'));
        }
        return throwError(() => new Error('Erro desconhecido'));
      })
    );
  }

}
