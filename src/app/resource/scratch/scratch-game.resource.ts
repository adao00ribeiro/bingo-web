import { Injectable, inject, signal } from "@angular/core";
import { ScratchGameService } from "../../services/scratch/scratch-game/scratch-game.service";
import { IScratchGameResponse } from "../../interfaces/response/scratch/IScratchGameResponse";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class ScratchGameResource extends BaseResource<{ page: number; size: number }, IPaged<IScratchGameResponse>> {
  private scratchGameService = inject(ScratchGameService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IScratchGameResponse>> {
       return this.scratchGameService.GetAll(request.page, request.size);
  }
}
