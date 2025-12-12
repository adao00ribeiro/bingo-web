import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MediaService {

 private url = `${environment.api}/api/v1/media`;
   private httpClient: HttpClient = inject(HttpClient);

   download(fileName: string): Observable<Blob> {
    return this.httpClient.get(`${this.url}/download/${encodeURIComponent(fileName)}`, {
      responseType: 'blob'
    });
  }

   getPresignedUrl(fileName: string): Observable<string> {
   return this.httpClient.get(`${this.url}/presigned/${fileName}`, {
      responseType: 'text'
    });
  }

}
