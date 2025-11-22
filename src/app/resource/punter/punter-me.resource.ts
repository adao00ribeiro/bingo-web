import { Injectable, inject, signal } from "@angular/core";
import { IPunter } from "../../interfaces/IPunter";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { PunterService } from "../../services/punter/punter.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class PunterMeResource extends BaseResource<IPunter> {
  private punterService = inject(PunterService)

  protected override loader(): Observable<IPunter> {
       return this.punterService.GetMe();
  }
}

