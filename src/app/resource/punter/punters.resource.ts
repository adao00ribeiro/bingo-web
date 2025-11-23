import { Injectable, inject, signal } from "@angular/core";
import { IPunter } from "../../interfaces/IPunter";
import { IPaged } from "../../interfaces/IPaged";
import { Observable } from "rxjs";
import { PunterService } from "../../services/punter/punter.service";
import { BaseResource } from "../base.resource";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class PuntersResource  extends BaseResource<{ page: number; size: number }, IPaged<IPunter>> {
  private punterService = inject(PunterService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IPunter>> {
       return this.punterService.GetAll(request.page, request.size);
  }
}
