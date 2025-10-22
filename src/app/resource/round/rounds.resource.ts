import { inject, Injectable, signal} from "@angular/core";
import { IRound } from "../../interfaces/IRound";
import { BaseResource } from "../base.resource";
import { IPaged } from "../../interfaces/IPaged";
import { RoundService } from "../../services/round/round.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RoundsResource extends BaseResource<{ page: number; size: number }, IPaged<IRound>> {
  private roundService = inject(RoundService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<IRound>> {
       return this.roundService.GetAll(request.page, request.size);
  }
}
