import { inject, Injectable, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { ICard } from "../../interfaces/ICard";
import { CardService } from "../../services/card/card.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class CardsByRoundIdResource extends BaseResource<{ roundId: string, page: number; size: number }, IPaged<ICard>> {
  private cardService = inject(CardService)

  protected override loader(request: { roundId: string, page: number; size: number }): Observable<IPaged<ICard>> {
    return this.cardService.GetAllByIdRound(request.roundId, request.page, request.size);
  }
}
