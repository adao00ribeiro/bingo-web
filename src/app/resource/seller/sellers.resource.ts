import { Injectable, inject, signal } from "@angular/core";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { ISeller } from "../../interfaces/ISeller";
import { SellerService } from "../../services/seller/seller.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class SellersResource extends BaseResource<{ page: number; size: number , enabledScratch?:boolean }, IPaged<ISeller>> {
  private sellerService = inject(SellerService)

  protected override loader(request: { page: number; size: number , enabledScratch:boolean }): Observable<IPaged<ISeller>> {
       return this.sellerService.GetAll(request.page, request.size ,request.enabledScratch);
  }
}
