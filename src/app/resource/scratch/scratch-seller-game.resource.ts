import { Injectable, inject, signal } from "@angular/core";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { Observable } from "rxjs";
import { ScratchSellerGameService } from "../../services/scratch/scratch-seller-game/scratch-seller-game.service";
import { IScratchSellerGameResponse } from "../../interfaces/response/scratch/IScratchSellerGameResponse";

@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class ScratchSellerGameResource extends BaseResource<{ page?: number; size?: number }, IPaged<IScratchSellerGameResponse>> {
  private scratchSellerGameService = inject(ScratchSellerGameService)

  protected override loader(request: { page?: number; size?: number }): Observable<IPaged<IScratchSellerGameResponse>> {
       return this.scratchSellerGameService.GetAll(request.page, request.size);
  }
}
