import { Injectable, inject, signal } from "@angular/core";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { Observable } from "rxjs";
import { IScratchGameOverrideResponse } from "../../interfaces/response/scratch/IScratchGameOverrideResponse";
import { ScratchGameOverrideService } from "../../services/scratch/scratch-game-override/scratch-game-override.service";

@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class ScratchGameOverrideResource extends BaseResource<{ page: number; size: number }, IPaged<IScratchGameOverrideResponse>> {
  private scratchGameOverrideService = inject(ScratchGameOverrideService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IScratchGameOverrideResponse>> {
       return this.scratchGameOverrideService.GetAll(request.page, request.size);
  }
}
