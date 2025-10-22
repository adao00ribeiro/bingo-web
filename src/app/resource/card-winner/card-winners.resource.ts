import { Injectable, inject, signal } from "@angular/core";
import { IPaged } from "../../interfaces/IPaged";
import { BaseResource } from "../base.resource";
import { ICardWinner } from "../../interfaces/ICardWinner";
import { Observable } from "rxjs";
import { CardWinnersService } from "../../services/card-winners/card-winners.service";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class CardWinnersResource extends BaseResource<{ page: number; size: number }, IPaged<ICardWinner>> {
  private cardWinnerService = inject(CardWinnersService)

  protected override loader(request: { page: number; size: number }): Observable<IPaged<ICardWinner>> {
       return this.cardWinnerService.GetAll(request.page, request.size);
  }
}
