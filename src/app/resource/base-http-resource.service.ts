import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



export abstract class BaseHttpResourceService {
  protected url = `${environment.api}/api/v1`;
  protected httpClient: HttpClient = inject(HttpClient);
}
