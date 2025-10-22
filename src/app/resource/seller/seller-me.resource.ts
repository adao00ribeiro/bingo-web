import { Injectable, inject, signal } from "@angular/core";
import { IPunter } from "../../interfaces/IPunter";
import { ISeller } from "../../interfaces/ISeller";
import { SellerService } from "../../services/seller/seller.service";
import { BaseResource } from "../base.resource";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class SellerMeResource extends BaseResource<ISeller> {
  private sellerService = inject(SellerService)

  protected override loader(): Observable<ISeller> {
       return this.sellerService.GetMe();
  }
}

