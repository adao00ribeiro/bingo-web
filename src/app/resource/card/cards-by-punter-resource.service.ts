import { Injectable, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { RoundService } from "../../services/round/round.service";
import { IRound } from "../../interfaces/IRound";
import { BaseHttpResourceService } from "../base-http-resource.service";
import { IPaged } from "../../interfaces/IPaged";


@Injectable({
  providedIn: 'root' // Garantimos que o serviço é um singleton
})
export class CardsByPunterResourceService extends BaseHttpResourceService {
  private roundId = signal<string | null>(null);
  private page = signal<number | null>(null);
  private size = signal<number | null>(null);

  resource = rxResource({
    request: () => ({
      roundId: this.roundId(), // Obtém o ID dinamicamente
      page: this.page(), // Obtém o ID dinamicamente
      size: this.size(), // Obtém o ID dinamicamente
    }), // Pode ser um objeto vazio caso não precise de parâmetros
    loader: ({request}) =>
    {

      if(request.page ==null || request.size ==null)
      {
        return this.httpClient.get<IPaged>(`${this.url}/card/round/${request.roundId}`)
      }

      return this.httpClient.get<IPaged>(`${this.url}/card/round/${request.roundId}?page=${request.page}&size=${request.size}`)
    }
  });

  // Método opcional para recarregar os rounds
  reload(roundId :string, page:number | null , size:number | null) {

    this.roundId.set(roundId);
    this.page.set(page);
    this.size.set(size);
    this.resource.reload();
  }
}
