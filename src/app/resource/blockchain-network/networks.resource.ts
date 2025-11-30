import { Injectable, inject } from "@angular/core";
import { NetworkService } from "../../services/blockchain/network.service";
import { INetwork } from "../../interfaces/blockchain/INetwork";
import { IPaged } from "../../interfaces/IPaged";
import { Observable } from "rxjs";
import { BaseResource } from "../base.resource";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class NetworksResource extends BaseResource<{ page: number; size: number }, IPaged<INetwork>> {
  private networkService = inject(NetworkService)

  protected override loader(request: {  page: number; size: number }): Observable<IPaged<INetwork>> {
    return this.networkService.GetAll(request.page, request.size);
  }
}
