import { Injectable, inject, signal } from "@angular/core";
import { IRecharge } from "../../interfaces/IRecharge";
import { IPaged } from "../../interfaces/IPaged";
import { RechargeService } from "../../services/recharge/recharge.service";
import { BaseResource } from "../base.resource";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class RechargesResource extends BaseResource<{ page: number; size: number }, IPaged<IRecharge>> {
  private rechargeService = inject(RechargeService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IRecharge>> {
       return this.rechargeService.GetAll(request.page, request.size);
  }
}
