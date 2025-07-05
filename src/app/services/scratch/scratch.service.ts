import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIndicateTagResponse } from '../../interfaces/IIndicateTagResponse';
import { IPunterPatchRequestDto } from '../../interfaces/request/IPunterPatchRequestDto';


@Injectable({
  providedIn: 'root'
})
export class PunterService {
  private url = `${environment.api}/api/v1/scratch`
  private httpClient: HttpClient = inject(HttpClient);


}
